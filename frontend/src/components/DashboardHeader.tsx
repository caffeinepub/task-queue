import React from 'react';
import { User } from '../utils/storage';
import { getAvatarColor, getAvatarInitial } from '../utils/avatar';

interface DashboardHeaderProps {
  user: User;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  searchQuery,
  onSearchChange,
  onLogout,
}) => {
  const avatarColor = getAvatarColor(user.name);
  const avatarInitial = getAvatarInitial(user.name);

  return (
    <header className="sticky top-0 z-30 bg-navy-900 border-b border-navy-700 shadow-nav">
      <div className="flex items-center gap-3 px-4 py-3 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <img
            src="/assets/generated/task-queue-logo.dim_256x256.png"
            alt="Task Queue Logo"
            className="w-8 h-8 rounded-lg object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
            }}
          />
          <span className="text-white font-bold text-lg tracking-tight hidden sm:block">
            Task Queue
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-auto">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-navy-800 border border-navy-600 text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 cursor-default select-none"
            style={{ backgroundColor: avatarColor }}
            title={user.name}
          >
            {avatarInitial}
          </div>

          {/* User name - desktop */}
          <span className="text-white text-sm font-medium hidden md:block max-w-[120px] truncate">
            {user.name}
          </span>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-700 hover:bg-navy-600 text-navy-200 hover:text-white text-xs font-medium transition-all"
            title="Logout"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
