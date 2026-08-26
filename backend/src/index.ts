import express, { Request, Response } from "express";
import dotenv from "dotenv";
import pool from "./db";
import tasksRouter from "./routes/tasks";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/tasks", tasksRouter);

app.get("/live", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Backend is alive - GitOps deployment test",
  });
});

app.get("/health", async (req: Request, res: Response) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "ok",
      message: "Backend and database are running",
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
