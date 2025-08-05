'use client'

import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Home() {
  type Todo = {
    _id: string;
    title: string;
    desc: string;
    state: boolean;
  };

  const [todo, setTodo] = useState({ title: "", desc: "", state: false });
  const [list, setList] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const todos = await response.json();
      setList(todos);
    } catch (error) {
      setError('Failed to fetch todos');
    }
  };

  const addTodo = async () => {
    if (!todo.title || !todo.desc) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add todo');
      }
      
      const newTodo = await response.json();
      setList([newTodo, ...list]);
      setTodo({ title: "", desc: "", state: false });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to update todo');
      
      const updatedTodo = await response.json();
      setList(list.map(todo => 
        todo._id === id ? updatedTodo : todo
      ));
    } catch (error) {
      setError('Failed to update todo');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete todo');
      
      setList(list.filter(todo => todo._id !== id));
    } catch (error) {
      setError('Failed to delete todo');
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo({
      ...todo,
      [e.target.name]: e.target.value
    });
  };

  return (
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
                Todo Title
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
                Todo Description
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
              onClick={addTodo} 
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
                    onClick={() => deleteTodo(item._id)}
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
  );
}