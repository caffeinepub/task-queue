import React, { useState } from 'react';
import { DEFAULT_CATEGORY_NAMES, getCategoryEntries } from '../utils/storage';

interface SidebarProps {
  userId: string;
  categories: string[];
  activeCategory: string;
  onCategorySelect: (category: string) => void;
  onAddCategory: (category: string, icon: string) => void;
  onDeleteCategory: (category: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Keyword → emoji mapping for smart suggestions
const KEYWORD_EMOJI_MAP: { keyword: string; emoji: string }[] = [
  { keyword: 'gym', emoji: '🏋️' },
  { keyword: 'workout', emoji: '🏋️' },
  { keyword: 'fitness', emoji: '🏃' },
  { keyword: 'political', emoji: '🏛️' },
  { keyword: 'politics', emoji: '🏛️' },
  { keyword: 'government', emoji: '🏛️' },
  { keyword: 'music', emoji: '🎵' },
  { keyword: 'travel', emoji: '✈️' },
  { keyword: 'trip', emoji: '✈️' },
  { keyword: 'food', emoji: '🍔' },
  { keyword: 'cooking', emoji: '🍳' },
  { keyword: 'sport', emoji: '⚽' },
  { keyword: 'soccer', emoji: '⚽' },
  { keyword: 'basketball', emoji: '🏀' },
  { keyword: 'finance', emoji: '💰' },
  { keyword: 'money', emoji: '💰' },
  { keyword: 'budget', emoji: '💰' },
  { keyword: 'family', emoji: '👨‍👩‍👧' },
  { keyword: 'health', emoji: '💊' },
  { keyword: 'medical', emoji: '🏥' },
  { keyword: 'art', emoji: '🎨' },
  { keyword: 'design', emoji: '🎨' },
  { keyword: 'tech', emoji: '💻' },
  { keyword: 'coding', emoji: '💻' },
  { keyword: 'programming', emoji: '💻' },
  { keyword: 'nature', emoji: '🌿' },
  { keyword: 'garden', emoji: '🌱' },
  { keyword: 'book', emoji: '📖' },
  { keyword: 'reading', emoji: '📖' },
  { keyword: 'study', emoji: '📚' },
  { keyword: 'school', emoji: '🏫' },
  { keyword: 'work', emoji: '💼' },
  { keyword: 'job', emoji: '💼' },
  { keyword: 'meeting', emoji: '🤝' },
  { keyword: 'game', emoji: '🎮' },
  { keyword: 'gaming', emoji: '🎮' },
  { keyword: 'movie', emoji: '🎬' },
  { keyword: 'film', emoji: '🎬' },
  { keyword: 'photo', emoji: '📷' },
  { keyword: 'pet', emoji: '🐾' },
  { keyword: 'dog', emoji: '🐶' },
  { keyword: 'cat', emoji: '🐱' },
  { keyword: 'car', emoji: '🚗' },
  { keyword: 'drive', emoji: '🚗' },
  { keyword: 'home', emoji: '🏠' },
  { keyword: 'house', emoji: '🏠' },
  { keyword: 'shop', emoji: '🛒' },
  { keyword: 'buy', emoji: '🛍️' },
  { keyword: 'social', emoji: '💬' },
  { keyword: 'friend', emoji: '👫' },
  { keyword: 'party', emoji: '🎉' },
  { keyword: 'birthday', emoji: '🎂' },
  { keyword: 'holiday', emoji: '🏖️' },
  { keyword: 'yoga', emoji: '🧘' },
  { keyword: 'meditation', emoji: '🧘' },
  { keyword: 'run', emoji: '🏃' },
  { keyword: 'swim', emoji: '🏊' },
  { keyword: 'bike', emoji: '🚴' },
  { keyword: 'science', emoji: '🔬' },
  { keyword: 'research', emoji: '🔬' },
  { keyword: 'project', emoji: '📋' },
  { keyword: 'idea', emoji: '💡' },
];

function getSuggestedEmoji(name: string): string {
  const lower = name.toLowerCase();
  for (const { keyword, emoji } of KEYWORD_EMOJI_MAP) {
    if (lower.includes(keyword)) return emoji;
  }
  return '📁';
}

const Sidebar: React.FC<SidebarProps> = ({
  userId,
  categories,
  activeCategory,
  onCategorySelect,
  onAddCategory,
  onDeleteCategory,
  isOpen,
  onClose,
}) => {
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const suggestedEmoji = newCategory.trim() ? getSuggestedEmoji(newCategory) : null;

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      const icon = getSuggestedEmoji(trimmed);
      onAddCategory(trimmed, icon);
      setNewCategory('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddCategory();
    if (e.key === 'Escape') {
      setIsAdding(false);
      setNewCategory('');
    }
  };

  // Get category entries with icons for display
  const categoryEntries = getCategoryEntries(userId);
  const getCategoryIcon = (catName: string): string => {
    const entry = categoryEntries.find(e => e.name === catName);
    return entry?.icon || '📁';
  };

  const isDefaultCategory = (catName: string) => DEFAULT_CATEGORY_NAMES.includes(catName);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-navy-900 text-white">
      {/* My Day section */}
      <div className="p-4 border-b border-navy-700">
        <p className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3">My Day</p>
        <button
          onClick={() => { onCategorySelect('All'); onClose(); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeCategory === 'All'
              ? 'bg-sky-500 text-white shadow-md'
              : 'text-navy-200 hover:bg-navy-800 hover:text-white'
          }`}
        >
          <span>📋</span>
          <span>All Tasks</span>
        </button>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3">Categories</p>
        <div className="space-y-1">
          {categories.filter(c => c !== 'All').map(category => (
            <div
              key={category}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-navy-200 hover:bg-navy-800 hover:text-white'
              }`}
            >
              <button
                onClick={() => { onCategorySelect(category); onClose(); }}
                className="flex items-center gap-3 flex-1 min-w-0 text-left"
              >
                <span className="text-base leading-none">{getCategoryIcon(category)}</span>
                <span className="truncate">{category}</span>
              </button>

              {/* Delete button — only for user-created (non-default) categories */}
              {!isDefaultCategory(category) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCategory(category);
                  }}
                  title={`Delete "${category}"`}
                  className={`shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold transition-all opacity-0 group-hover:opacity-100 ${
                    activeCategory === category
                      ? 'hover:bg-white/20 text-white'
                      : 'hover:bg-red-500/20 text-navy-400 hover:text-red-400'
                  }`}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Category */}
        <div className="mt-4">
          {isAdding ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  {suggestedEmoji && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base leading-none pointer-events-none">
                      {suggestedEmoji}
                    </span>
                  )}
                  <input
                    type="text"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Category name..."
                    autoFocus
                    className={`w-full py-2 rounded-lg bg-navy-800 border border-navy-600 text-white placeholder-navy-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      suggestedEmoji ? 'pl-9 pr-3' : 'px-3'
                    }`}
                  />
                </div>
                <button
                  onClick={handleAddCategory}
                  className="px-3 py-2 rounded-lg bg-sky-500 text-white text-sm hover:bg-sky-400 transition-colors"
                >
                  Add
                </button>
              </div>
              {/* Emoji suggestion hint */}
              {suggestedEmoji && newCategory.trim() && (
                <p className="text-xs text-navy-400 px-1">
                  Suggested icon: <span className="text-base">{suggestedEmoji}</span>
                </p>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-navy-400 hover:text-white hover:bg-navy-800 text-sm transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Category
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-navy-700 bg-navy-900">
          <span className="text-white font-semibold">Menu</span>
          <button onClick={onClose} className="text-navy-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Sidebar - desktop static */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-navy-700 bg-navy-900">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
