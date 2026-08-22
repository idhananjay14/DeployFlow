import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { getTasks } from "./services/taskService";
import type { Task } from "./types/task";
import "./App.css";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    getTasks().then(setTasks).catch(console.error);
  }, [refreshTrigger]);

  const handleTasksChanged = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const isOverdue = (task: Task) =>
    !!task.due_date &&
    task.status !== "completed" &&
    new Date(task.due_date) < new Date(new Date().toDateString());

  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "pending" && !isOverdue(t)).length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const overdue = tasks.filter(isOverdue).length;

  return (
    <div className="app-shell">
      <Sidebar theme={theme} onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />

      <main className="main-content">
        <div className="main-header">
          <div>
            <h1>Welcome back, Dhananjay! 👋</h1>
            <p>Here's what's happening with your tasks today.</p>
          </div>
        </div>

        <div className="stats-grid">
          <StatCard icon="📋" label="Total Tasks" value={total} sublabel="All tasks in your workspace" color="purple" />
          <StatCard icon="🕐" label="Pending Tasks" value={pending} sublabel="Tasks waiting for progress" color="blue" />
          <StatCard icon="✓" label="Completed Tasks" value={completed} sublabel="Tasks successfully finished" color="green" />
          <StatCard icon="⊘" label="Overdue Tasks" value={overdue} sublabel="Tasks past due date" color="orange" />
        </div>

        <div className="content-grid">
          <TaskForm onTaskCreated={handleTasksChanged} />
          <TaskList refreshTrigger={refreshTrigger} onTasksChanged={handleTasksChanged} />
        </div>

        <footer>© 2026 DeployFlow. All rights reserved.</footer>
      </main>
    </div>
  );
}

export default App;
