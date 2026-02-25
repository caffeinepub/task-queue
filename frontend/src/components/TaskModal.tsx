import React, { useState, useEffect } from 'react';
import { Task } from '../utils/storage';
import { showNotification } from '../utils/notifications';

interface TaskModalProps {
  task?: Task | null;
  categories: string[];
  userId: string;
  onSave: (task: Task) => void;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, categories, userId, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Work');
  const [status, setStatus] = useState<Task['status']>('not-started');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setCategory(task.category);
      setStatus(task.status);
      setDueDate(task.dueDate);
      setPriority(task.priority);
    }
  }, [task]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const savedTask: Task = {
      id: task?.id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title: title.trim(),
      description: description.trim(),
      category,
      status,
      dueDate,
      priority,
      createdAt: task?.createdAt || new Date().toISOString(),
    };

    onSave(savedTask);
    showNotification(task ? 'Task updated!' : 'Task created!', 'success');
    onClose();
  };

  const isEdit = !!task;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-modal w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-navy-900">
            {isEdit ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Task description (optional)"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm resize-none"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as Task['status'])}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm bg-white"
              >
                <option value="not-started">Not Started</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Task['priority'])}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy-900 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-navy-800 text-white text-sm font-semibold hover:bg-navy-700 transition-colors"
            >
              {isEdit ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
