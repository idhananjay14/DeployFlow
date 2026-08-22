import { Router, Request, Response } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../models/task";

const router = Router();

// Get all tasks
router.get("/", async (req: Request, res: Response) => {
  try {
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Get task by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const task = await getTaskById(Number(req.params.id));
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// Create task
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, priority, due_date } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const task = await createTask(
      title,
      description ?? null,
      priority ?? "medium",
      due_date ?? null
    );

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Update task status
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const task = await updateTask(Number(req.params.id), status);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await deleteTask(Number(req.params.id));

    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
