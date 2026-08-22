import axios from "axios";
import type { Task } from "../types/task";

const API_URL = import.meta.env.VITE_API_URL;

export const getTasks = async (): Promise<Task[]> => {
  const response = await axios.get<Task[]>(`${API_URL}/tasks`);
  return response.data;
};

export const createTask = async (
  title: string,
  description: string,
  priority: string,
  due_date: string | null
): Promise<Task> => {
  const response = await axios.post<Task>(`${API_URL}/tasks`, {
    title,
    description,
    priority,
    due_date,
  });
  return response.data;
};

export const updateTaskStatus = async (
  id: number,
  status: string
): Promise<Task> => {
  const response = await axios.patch<Task>(`${API_URL}/tasks/${id}`, {
    status,
  });
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/tasks/${id}`);
};
