import React from 'react';
import {
  LayoutDashboard, Dumbbell, BarChart2, BookOpen, Wrench, Trophy, Crown
} from 'lucide-react';

type AppView = 'dashboard' | 'workouts' | 'statistics' | 'programs' | 'tools' | 'leaderboard' | 'plans' | 'settings';

interface Props {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  collapsed: boolean;
}

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'workouts',    label: 'Workouts',         icon: Dumbbell },
  { id: 'statistics',  label: 'Statistics',       icon: BarChart2 },
  { id: 'programs',    label: 'Programs',         icon: BookOpen },
  { id: 'tools',       label: 'Tools',            icon: Wrench },
  { id: 'leaderboard', label: 'Leaderboard',      icon: Trophy },
  { id: 'plans',       label: 'Plans & Premium',  icon: Crown },
] as const;

const AppSidebar: React.FC<Props> = ({ currentView, onNavigate, collapsed }) => {
  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-[60px] bottom-0 z-40 transition-all duration-300 overflow-hidden"
      style={{
        width: collapsed ? '64px' : '220px',
        background: '#FFFFFF',
        borderRight: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id as AppView)}
              className={`sidebar-item w-full ${isActive ? 'active' : ''}`}
              style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Upgrade Banner */}
      {!collapsed && (
        <div
          className="p-3 m-3 rounded-xl"
          style={{
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Crown size={14} style={{ color: '#22C55E' }} />
            <span
              className="text-xs font-heading font-bold uppercase tracking-wide"
              style={{ color: '#22C55E' }}
            >
              Go Premium
            </span>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--ic-text-secondary)' }}>
            Unlock advanced analytics & AI coaching
          </p>
          <button
            type="button"
            onClick={() => onNavigate('plans')}
            className="w-full py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wide transition-all hover:opacity-90"
            style={{ background: '#22C55E', color: '#fff' }}
          >
            Upgrade Now
          </button>
        </div>
      )}
    </aside>
  );
};

export default AppSidebar;
