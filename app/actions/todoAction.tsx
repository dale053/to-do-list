export type Todo = {
  _id: string;
  title: string;
  desc: string;
  state: boolean;
};

export type NewTodo = Omit<Todo, "_id">;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${API_BASE_URL}/todos`);
  if (!response.ok) throw new Error("Failed to fetch todos");
  return response.json();
};

export const addTodo = async (todo: NewTodo): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add todo");
  }

  return response.json();
};

export const toggleTodo = async (id: string): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error("Failed to update todo");
  return response.json();
};

export const deleteTodo = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete todo");
};