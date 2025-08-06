'use client'

import { useState, useEffect } from 'react';
import { fetchTodos, addTodo, toggleTodo, deleteTodo, Todo, NewTodo } from '../actions/todoAction';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [todo, setTodo] = useState<NewTodo>({ title: "", desc: "", state: false });
  const [list, setList] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descError, setDescError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    loadTodos();
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/'); // Redirect if not logged in
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('token'); // ✅ Remove token
    router.push('/'); // ✅ Redirect to login
  };

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
      setTodo({ title: "", desc: "", state: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const updated = await toggleTodo(id);
      setList(list.map(todo => (todo._id === id ? updated : todo)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      setList(list.filter(todo => todo._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      <div className="text-3xl">
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
            <div className="rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 bg-slate-300">
              <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
                Add a Todo
              </h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              <div className="relative mb-4">
                <label htmlFor="title" className="leading-7 text-sm text-gray-600">
                  Todo Title {titleError ? <span className='ml-10 text-red-700'>{titleError}</span> : null}
                </label>
                <input 
                  onChange={onChange}
                  value={todo.title} 
                  type="text" 
                  id="title" 
                  name="title"
                  className="w-full bg-white rounded border border-gray-300 focus:border-green-800 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  autoComplete="off" 
                />
              </div>
              
              <div className="relative mb-4">
                <label htmlFor="desc" className="leading-7 text-sm text-gray-600">
                  Todo Description {descError ? <span className='ml-10 text-red-700'>{descError}</span> : null}
                </label>
                <input 
                  onChange={onChange} 
                  value={todo.desc} 
                  type="text" 
                  id="desc" 
                  name="desc"
                  className="w-full bg-white rounded border border-gray-300 focus:border-green-800 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" 
                  autoComplete="off" 
                />
              </div>
              
              <button 
                onClick={handleAddTodo} 
                disabled={loading}
                className="text-white bg-green-800 border-0 py-2 px-8 focus:outline-none w-fit hover:bg-green-600 rounded text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Todo'}
              </button>
            </div>
            
            <div className='p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 bg-green-100'>
              {list && list.map((item, index) => (
                <div className='w-full text-lg flex flex-row my-1' key={item._id}>
                  <div className="w-1/12">
                    {index + 1}
                  </div>
                  <div className="w-3/12">
                    {item.title}
                  </div>
                  <div className="w-6/12">
                    {item.desc}
                  </div>
                  <div className="w-2/12 flex flex-row justify-end">
                    {item.state ? 
                      <button 
                        className="text-white bg-slate-300 border-0 px-5 focus:outline-none w-fit hover:bg-slate-300 rounded text-lg mr-1"
                      >
                        Done
                      </button> :
                      <button 
                        onClick={() => toggleTodo(item._id)}
                        className="cursor-pointer text-white bg-slate-500 border-0 px-5 focus:outline-none w-fit hover:bg-slate-600 rounded text-lg mr-1"
                      >
                        Done
                      </button>
                    }
                    
                    <button 
                      className="text-white bg-red-300 border-0 px-4 focus:outline-none w-fit hover:bg-red-400 rounded text-lg"
                      onClick={() => handleDeleteTodo(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
