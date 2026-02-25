import React, { useState, useEffect, useCallback } from 'react';
import { User, Task, getTasksByUser, addTask, updateTask, deleteTask, getCategories, addCategory, deleteCategory } from '../utils/storage';
import { logout } from '../utils/auth';
import { showNotification } from '../utils/notifications';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '../components/Sidebar';
import TaskList from '../components/TaskList';
import TaskModal from '../components/TaskModal';
import CustomPopup from '../components/CustomPopup';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

type TabType = 'not-started' | 'pending' | 'completed';

const TABS: { id: TabType; label: string }[] = [
  { id: 'not-started', label: 'Not Started' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
];

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('not-started');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadData = useCallback(() => {
    setTasks(getTasksByUser(user.id));
    setCategories(getCategories(user.id));
  }, [user.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      updateTask(task);
    } else {
      addTask(task);
    }
    loadData();
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setDeleteConfirm(taskId);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteTask(deleteConfirm);
      loadData();
      showNotification('Task deleted.', 'info');
      setDeleteConfirm(null);
    }
  };

  const handleAddCategory = (category: string, icon: string) => {
    addCategory(user.id, category, icon);
    loadData();
    showNotification(`Category "${category}" added!`, 'success');
  };

  const handleDeleteCategory = (categoryName: string) => {
    deleteCategory(user.id, categoryName);
    // If the deleted category was active, revert to All Tasks
    if (activeCategory === categoryName) {
      setActiveCategory('All');
    }
    loadData();
    showNotification(`Category "${categoryName}" deleted.`, 'info');
  };

  const handleLogout = () => {
    logout();
    onLogout();
    showNotification('Logged out successfully.', 'info');
  };

  const handleOpenModal = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesTab = task.status === activeTab;
    const matchesCategory = activeCategory === 'All' || task.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesCategory && matchesSearch;
  });

  const taskCountByTab = (tab: TabType) =>
    tasks.filter(t => t.status === tab && (activeCategory === 'All' || t.category === activeCategory)).length;

  return (
    <div className="flex flex-col h-screen bg-surface-50 overflow-hidden">
      <DashboardHeader
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          userId={user.id}
          categories={['All', ...categories.filter(c => c !== 'All')]}
          activeCategory={activeCategory}
          onCategorySelect={setActiveCategory}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 md:px-6 border-b border-gray-100 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Tabs */}
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-navy-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs ${
                        activeTab === tab.id ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {taskCountByTab(tab.id)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add Task button */}
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-800 text-white text-sm font-semibold hover:bg-navy-700 active:scale-95 transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:block">Add Task</span>
            </button>
          </div>

          {/* Task list */}
          <div className="p-4 md:p-6">
            <TaskList
              tasks={filteredTasks}
              searchQuery={searchQuery}
              activeTab={activeTab}
              activeCategory={activeCategory}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-navy-900 border-t border-navy-700 py-2 px-4 text-center">
        <p className="text-navy-400 text-xs">
          © {new Date().getFullYear()} Task Queue. Built with{' '}
          <span className="text-red-400">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'task-queue')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          task={editingTask}
          categories={categories.filter(c => c !== 'All')}
          userId={user.id}
          onSave={handleSaveTask}
          onClose={() => { setShowModal(false); setEditingTask(null); }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <CustomPopup
          type="confirm"
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          onClose={() => setDeleteConfirm(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default Dashboard;
