import { useState } from "react";
import type { FormEvent } from "react";
import { createTask } from "../services/taskService";
import type { Task } from "../types/task";

interface TaskFormProps {
  onTaskCreated: (task: Task) => void;
}

const TaskForm = ({ onTaskCreated }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      const task = await createTask(title, description, priority, dueDate || null);
      onTaskCreated(task);
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <span className="panel-label">NEW TASK</span>
      <h2>Create Task</h2>
      <p className="panel-subtitle">Add a new task to your list.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Task Title</label>
          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Task Description</label>
          <textarea
            placeholder="Enter task description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Priority</label>
          <div className={`priority-select priority-${priority}`}>
            <span className="priority-dot" />
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="form-field">
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary full-width" disabled={loading}>
          {loading ? "Creating..." : "+ Create Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
