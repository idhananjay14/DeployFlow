import express, { Request, Response } from "express";
import dotenv from "dotenv";
import pool from "./db";
import tasksRouter from "./routes/tasks";
import client from "prom-client";

dotenv.config();

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
});

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req: Request, res: Response, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;

    const route = req.route?.path || req.path;

    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status_code: res.statusCode,
      },
      durationInSeconds,
    );
  });

  next();
});

app.use("/tasks", tasksRouter);

app.get("/live", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Backend is alive - deployed through CI/CD and GitOps",
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

app.get("/metrics", async (req: Request, res: Response) => {
  res.set("Content-Type", client.register.contentType);

  res.end(await client.register.metrics());
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
