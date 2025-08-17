'use client';

import { useState } from 'react';
import { Check, Square } from 'lucide-react';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface InteractiveTodoListProps {
  title?: string;
  items: Omit<TodoItem, 'completed'>[];
  className?: string;
}

export function InteractiveTodoList({ 
  title = "学习清单", 
  items, 
  className = "" 
}: InteractiveTodoListProps) {
  const [todos, setTodos] = useState<TodoItem[]>(
    items.map(item => ({ ...item, completed: false }))
  );

  const toggleTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const progress = (completedCount / todos.length) * 100;

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          📝 {title}
        </h3>
        <span className="text-sm text-blue-600 font-medium">
          {completedCount}/{todos.length} 完成
        </span>
      </div>
      
      {/* 进度条 */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>学习进度</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 待办事项列表 */}
      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/60 ${
              todo.completed 
                ? 'bg-white/80 shadow-sm' 
                : 'bg-white/40 hover:shadow-sm'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {todo.completed ? (
                <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              ) : (
                <Square className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
              )}
            </div>
            <span className={`text-sm leading-relaxed transition-all duration-200 ${
              todo.completed 
                ? 'text-gray-500 line-through' 
                : 'text-gray-700'
            }`}>
              {todo.text}
            </span>
          </div>
        ))}
      </div>

      {/* 完成提示 */}
      {completedCount === todos.length && todos.length > 0 && (
        <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-green-800 text-sm font-medium">
              🎉 恭喜！你已完成所有学习任务
            </span>
          </div>
        </div>
      )}
    </div>
  );
}