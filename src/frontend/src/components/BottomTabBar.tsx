import React from 'react';
import { Dumbbell, BarChart2, BookOpen, Wrench, Trophy, Crown } from 'lucide-react';

type AppView = 'dashboard' | 'workouts' | 'statistics' | 'programs' | 'tools' | 'leaderboard' | 'plans' | 'settings';

interface Props {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

// Each tab has its own active color to match the screenshots
const TABS = [
  { id: 'workouts',    label: 'Workouts',  icon: Dumbbell,  activeColor: '#22C55E' },
  { id: 'programs',   label: 'Programs',  icon: BookOpen,  activeColor: '#14B8A6' },
  { id: 'statistics', label: 'Stats',     icon: BarChart2, activeColor: '#3B82F6' },
  { id: 'tools',      label: 'Tools',     icon: Wrench,    activeColor: '#3B82F6' },
  { id: 'leaderboard',label: 'Leaders',   icon: Trophy,    activeColor: '#F97316' },
  { id: 'plans',      label: 'Premium',   icon: Crown,     activeColor: '#F59E0B' },
] as const;

const BottomTabBar: React.FC<Props> = ({ currentView, onNavigate }) => {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch"
      style={{
        background: '#FFFFFF',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(tab => {
        const Icon = tab.icon;
        const isActive = currentView === tab.id;
        const color = isActive ? tab.activeColor : '#9CA3AF';

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onNavigate(tab.id as AppView)}
            className="tab-bar-item"
            style={{ color }}
          >
            <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span style={{ fontWeight: isActive ? 600 : 500 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomTabBar;
