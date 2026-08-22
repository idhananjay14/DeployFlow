import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { getTasks, updateTaskStatus, deleteTask } from "../services/taskService";
import type { Task } from "../types/task";

interface TaskListProps {
  refreshTrigger: number;
  onTasksChanged: () => void;
}

type FilterType = "all" | "pending" | "completed" | "overdue";

const isOverdue = (task: Task) =>
  !!task.due_date &&
  task.status !== "completed" &&
  new Date(task.due_date) < new Date(new Date().toDateString());

const TaskList = ({ refreshTrigger, onTasksChanged }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [refreshTrigger]);

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    try {
      await updateTaskStatus(task.id, newStatus);
      loadTasks();
      onTasksChanged();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      loadTasks();
      onTasksChanged();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "overdue") return isOverdue(task);
    return task.status === filter;
  });

  const getBadge = (task: Task) => {
    if (isOverdue(task)) return { label: "OVERDUE", cls: "overdue" };
    if (task.status === "completed") return { label: "COMPLETED", cls: "completed" };
    return { label: "PENDING", cls: "pending" };
  };

  return (
    <div className="panel">
      <div className="panel-header-row">
        <div>
          <span className="panel-label">WORKSPACE</span>
          <h2>Your Tasks</h2>
        </div>
        <div className="filter-tabs">
          {(["all", "pending", "completed", "overdue"] as FilterType[]).map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <p className="panel-subtitle">Track and manage your current work.</p>

      {loading ? (
        <p className="empty-state">Loading tasks...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="empty-state">No tasks in this view.</p>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => {
            const badge = getBadge(task);
            return (
              <div className="task-item" key={task.id}>
                <button
                  className={`task-checkbox ${task.status === "completed" ? "checked" : ""}`}
                  onClick={() => handleToggleStatus(task)}
                  aria-label="Toggle status"
                >
                  {task.status === "completed" ? "✓" : ""}
                </button>

                <div className="task-info">
                  <strong>{task.title}</strong>
                  {task.description && <p>{task.description}</p>}
                </div>

                <span className={`status-badge ${badge.cls}`}>{badge.label}</span>

                {task.due_date && (
                  <span className="due-date">
                    📅 {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                )}

                <div className="task-actions">
                  <button className="icon-btn edit" aria-label="Edit task">
                    <Pencil size={16} />
                  </button>
                  <button className="icon-btn delete" onClick={() => handleDelete(task.id)} aria-label="Delete task">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskList;
