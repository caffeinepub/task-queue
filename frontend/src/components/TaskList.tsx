import React from 'react';
import { Task } from '../utils/storage';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  searchQuery?: string;
  activeTab: string;
  activeCategory: string;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  searchQuery = '',
  activeTab,
  activeCategory,
  onEdit,
  onDelete,
}) => {
  if (tasks.length === 0) {
    const getEmptyMessage = () => {
      if (searchQuery) {
        return {
          icon: '🔍',
          title: 'No results found',
          subtitle: `No tasks match "${searchQuery}"`,
        };
      }
      if (activeCategory !== 'All') {
        return {
          icon: '📁',
          title: `No tasks in ${activeCategory}`,
          subtitle: 'Add a task to this category to get started.',
        };
      }
      const tabMessages: Record<string, { icon: string; title: string; subtitle: string }> = {
        completed: { icon: '✅', title: 'No completed tasks', subtitle: 'Complete some tasks to see them here.' },
        pending: { icon: '⏳', title: 'No pending tasks', subtitle: 'Tasks in progress will appear here.' },
        'not-started': { icon: '🚀', title: 'No tasks yet', subtitle: 'Add your first task to get started!' },
      };
      return tabMessages[activeTab] || { icon: '📋', title: 'No tasks', subtitle: 'Add a task to get started.' };
    };

    const { icon, title, subtitle } = getEmptyMessage();

    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-navy-700 mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task, index) => (
        <TaskCard
          key={task.id}
          task={task}
          searchQuery={searchQuery}
          onEdit={onEdit}
          onDelete={onDelete}
          animationDelay={index * 50}
        />
      ))}
    </div>
  );
};

export default TaskList;
