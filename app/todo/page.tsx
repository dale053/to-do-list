'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchTodos, addTodo, toggleTodo, deleteTodo, Todo, NewTodo, updateTodo } from '../actions/todoAction';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Home() {
  const [todo, setTodo] = useState<NewTodo>({ title: '', desc: '', state: false, deadline: '' });
  const [list, setList] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descError, setDescError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    loadTodos();
  }, [router]);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const todos = await fetchTodos();
      setList(todos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleAddTodo = async () => {
    if (!todo.title || !todo.desc) {
      setTitleError(todo.title ? null : 'Please fill in Title!');
      setDescError(todo.desc ? null : 'Please fill in Description!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newTodo = await addTodo(todo);
      setList([newTodo, ...list]);
      setTodo({ title: '', desc: '', state: false, deadline: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodo = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to mark this todo as done?',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        try {
          const updated = await toggleTodo(id);
          setList(list.map(todo => (todo._id === id ? updated : todo)));
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to update todo');
        }
      },
    });
  };

  const handleDeleteTodo = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to delete this todo?',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        try {
          await deleteTodo(id);
          setList(list.filter(todo => todo._id !== id));
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to delete todo');
        }
      },
    });
  };

  const handleUpdateTodo = async (id: string, updated: Partial<Todo>) => {
  setLoading(true);
  setError(null);

  try {
    const updatedTodo = await updateTodo(id, updated);
    setList(prev =>
      prev.map(todo => (todo._id === id ? updatedTodo : todo))
    );
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to update todo');
  } finally {
    setLoading(false);
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTodo(prev => ({ ...prev, [name]: value }));

    if (name === 'title' && titleError) setTitleError(null);
    if (name === 'desc' && descError) setDescError(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
        >
          Sign Out
        </button>
      </div>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto flex flex-wrap items-start gap-10">
          <TodoForm
            todo={todo}
            onChange={handleInputChange}
            onAdd={handleAddTodo}
            loading={loading}
            titleError={titleError}
            descError={descError}
            error={error}
          />

          <TodoList
            todos={list}
            loading={loading}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
          />
        </div>
      </section>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </div>
  );
}
