import axios from 'axios';

export type Todo = {
  _id: string;
  title: string;
  desc: string;
  state: boolean;
};

export type NewTodo = Omit<Todo, "_id">;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with baseURL and token header
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach token to all requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    // Ensure headers exist before adding Authorization
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const response = await axiosInstance.get<Todo[]>('/todos');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch todos');
  }
};

export const addTodo = async (todo: NewTodo): Promise<Todo> => {
  try {
    const response = await axiosInstance.post<Todo>('/todos', todo);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add todo');
  }
};

export const toggleTodo = async (id: string): Promise<Todo> => {
  try {
    const response = await axiosInstance.put<Todo>(`/todos/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update todo');
  }
};

export const deleteTodo = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/todos/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete todo');
  }
};