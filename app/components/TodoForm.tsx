'use client';

import React from 'react';
import { NewTodo } from '../actions/todoAction';

interface TodoFormProps {
  todo: NewTodo;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onAdd: () => void;
  loading: boolean;
  titleError: string | null;
  descError: string | null;
  error: string | null;
}

const TodoForm: React.FC<TodoFormProps> = ({
  todo,
  onChange,
  onAdd,
  loading,
  titleError,
  descError,
  error,
}) => {
  return (
    <div className="rounded-lg p-8 flex flex-col w-full md:w-4/12 mt-10 bg-slate-300">
      <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Add a Todo</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <label htmlFor="title" className="leading-7 text-sm text-gray-600">
        Todo Title {titleError && <span className="ml-2 text-red-700">{titleError}</span>}
      </label>
      <input
        onChange={onChange}
        value={todo.title ?? ''}
        type="text"
        id="title"
        name="title"
        className="mb-4 w-full bg-white rounded border border-gray-300 focus:border-green-800 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8"
        autoComplete="off"
      />

      <label htmlFor="desc" className="leading-7 text-sm text-gray-600">
        Todo Description {descError && <span className="ml-2 text-red-700">{descError}</span>}
      </label>
      <textarea
        onChange={onChange}
        value={todo.desc ?? ''}
        id="desc"
        name="desc"
        rows={3}
        className="mb-4 w-full bg-white rounded border border-gray-300 focus:border-green-800 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3"
        autoComplete="off"
      />

      <label htmlFor="deadline" className="leading-7 text-sm text-gray-600">
        Deadline
      </label>
      <input
        onChange={onChange}
        value={todo.deadline ?? ''}
        type="date"
        id="deadline"
        name="deadline"
        className="mb-4 w-full bg-white rounded border border-gray-300 focus:border-green-800 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3"
      />

      <button
        onClick={onAdd}
        disabled={loading}
        className="text-white bg-green-800 border-0 py-2 px-8 focus:outline-none hover:bg-green-600 rounded text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding...' : 'Add Todo'}
      </button>
    </div>
  );
};

export default TodoForm;