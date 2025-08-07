'use client';

import React from 'react';
import { Todo } from '../actions/todoAction';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, loading, onToggle, onDelete }) => {
  return (
    <div className="p-8 flex flex-col w-full md:w-7/12 bg-green-100 rounded-lg mt-10">
      {loading ? (
        <div className="text-center text-gray-600 text-lg">Loading todos...</div>
      ) : todos.length === 0 ? (
        <div className="text-center text-gray-400 text-lg">No todos yet.</div>
      ) : (
        <div className="space-y-4">
          {todos.map((item, index) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm transition hover:shadow-md"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500 font-semibold">{index + 1}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                </div>

                <p className="text-gray-700 mt-1 text-lg">{item.desc}</p>

                {item.deadline && (
                  <p className="mt-1 text-sm text-gray-500">
                    📅 Deadline:{' '}
                    <span className="font-medium text-gray-800">
                      {new Date(item.deadline).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 mt-4 md:mt-0 md:ml-4">
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium ${
                    item.state
                      ? 'bg-green-200 text-green-800'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {item.state ? 'Completed' : 'Pending'}
                </span>

                <button
                  onClick={() => onToggle(item._id)}
                  disabled={item.state}
                  className={`px-4 py-1 rounded transition font-medium text-sm ${
                    item.state
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Mark Done
                </button>

                <button
                  onClick={() => onDelete(item._id)}
                  className="px-4 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;