import React from 'react';
import { Task } from '../utils/storage';

interface TaskCardProps {
  task: Task;
  searchQuery?: string;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  animationDelay?: number;
}

const STATUS_STYLES: Record<Task['status'], string> = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  'not-started': 'bg-gray-100 text-gray-600',
};

const STATUS_LABELS: Record<Task['status'], string> = {
  completed: 'Completed',
  pending: 'Pending',
  'not-started': 'Not Started',
};

const PRIORITY_STYLES: Record<Task['priority'], string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-orange-100 text-orange-700',
  low: 'bg-blue-100 text-blue-700',
};

function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 rounded px-0.5">$1</mark>');
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  searchQuery = '',
  onEdit,
  onDelete,
  animationDelay = 0,
}) => {
  const isOverdue =
    task.dueDate &&
    task.status !== 'completed' &&
    new Date(task.dueDate) < new Date(new Date().toDateString());

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 animate-card-reveal"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3
          className="font-semibold text-navy-900 text-sm leading-snug flex-1"
          dangerouslySetInnerHTML={{ __html: highlightText(task.title, searchQuery) }}
        />
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-sky-500 hover:bg-sky-50 transition-all"
            title="Edit task"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Delete task"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p
          className="text-xs text-gray-500 mb-3 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: highlightText(task.description, searchQuery) }}
        />
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-navy-100 text-navy-700">
          {task.category}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[task.status]}`}>
          {STATUS_LABELS[task.status]}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{isOverdue ? 'Overdue: ' : 'Due: '}{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
