import pool from "../db";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  created_at: Date;
  updated_at: Date;
}

export const getAllTasks = async (): Promise<Task[]> => {
  const result = await pool.query(
    "SELECT * FROM tasks ORDER BY created_at DESC"
  );

  return result.rows;
};

export const getTaskById = async (id: number): Promise<Task | null> => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE id = $1",
    [id]
  );

  return result.rows[0] || null;
};

export const createTask = async (
  title: string,
  description: string | null,
  priority: string,
  due_date: string | null
): Promise<Task> => {
  const result = await pool.query(
    `INSERT INTO tasks (title, description, priority, due_date)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, priority, due_date]
  );

  return result.rows[0];
};

export const updateTask = async (
  id: number,
  status: string
): Promise<Task | null> => {
  const result = await pool.query(
    `UPDATE tasks
     SET status = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );

  return result.rows[0] || null;
};

export const deleteTask = async (id: number): Promise<boolean> => {
  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1",
    [id]
  );

  return (result.rowCount ?? 0) > 0;
};
