import React, { useState, useRef, useEffect } from 'react';
import {
  Bell, Sun, Moon, Globe, ChevronDown, User, Settings, CreditCard, LogOut,
  Dumbbell, X, Zap, Droplets, Apple, Trophy, TrendingUp
} from 'lucide-react';
import { getAvatarColor } from '../utils/crypto';

type AppView = 'dashboard' | 'workouts' | 'statistics' | 'programs' | 'tools' | 'leaderboard' | 'plans' | 'settings';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

interface Props {
  user: UserInfo;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onLogout: () => void;
  onNavigate: (view: AppView) => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'de', label: 'German', flag: '🇩🇪' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { code: 'ar', label: 'Arabic', flag: '🇸🇦' },
];

const MOCK_NOTIFICATIONS = [
  { id: '1', icon: Dumbbell, color: '#22C55E', title: 'Workout Reminder', message: "Don't forget your evening chest & triceps session!", time: '5 min ago' },
  { id: '2', icon: Apple, color: '#22C55E', title: 'Meal Reminder', message: 'Time for your post-workout protein meal.', time: '1h ago' },
  { id: '3', icon: Droplets, color: '#3B82F6', title: 'Hydration Alert', message: "You've only had 1.2L today. Goal: 2.5L 💧", time: '2h ago' },
  { id: '4', icon: Trophy, color: '#F59E0B', title: 'New Milestone!', message: '7-day workout streak achieved! Keep going 🔥', time: 'Yesterday' },
  { id: '5', icon: TrendingUp, color: '#8B5CF6', title: 'Progress Update', message: "You're 80% to your weight goal!", time: '2 days ago' },
];

const NavBar: React.FC<Props> = ({ user, theme, onToggleTheme, onLogout, onNavigate, sidebarCollapsed, onToggleSidebar }) => {
  const [showNotif, setShowNotif] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const [unreadCount] = useState(3);

  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setShowLang(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUser(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const avatarColor = getAvatarColor(user.firstName);
  const initial = user.firstName.charAt(0).toUpperCase();

  const navBg = theme === 'dark'
    ? 'rgba(13,13,13,0.92)'
    : 'rgba(255,255,255,0.95)';

  const ironCladColor = theme === 'dark' ? 'var(--ic-copper)' : '#111827';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[60px]"
      style={{
        background: navBg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <div className="flex items-center justify-between h-full px-4">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg transition-colors hidden lg:flex"
            style={{ color: 'var(--ic-text-secondary)' }}
            aria-label="Toggle sidebar"
          >
            <div className="flex flex-col gap-1">
              <span className="block w-5 h-0.5 transition-all" style={{ background: 'var(--ic-text-secondary)' }} />
              <span className={`block h-0.5 transition-all ${sidebarCollapsed ? 'w-3' : 'w-5'}`} style={{ background: 'var(--ic-text-secondary)' }} />
              <span className="block w-5 h-0.5 transition-all" style={{ background: 'var(--ic-text-secondary)' }} />
            </div>
          </button>
          <button type="button" onClick={() => onNavigate('dashboard')} className="flex items-center gap-2">
            <img src="/assets/uploads/Brand-1.png" alt="IRONCLAD logo" className="w-7 h-7 object-contain" />
            <span
              className="font-display text-2xl tracking-widest hidden sm:block"
              style={{ color: ironCladColor }}
            >
              IRONCLAD
            </span>
          </button>
        </div>

        {/* Right: icons */}
        <div className="flex items-center gap-1">
          {/* Language */}
          <div ref={langRef} className="relative">
            <button
              type="button"
              onClick={() => { setShowLang(v => !v); setShowNotif(false); setShowUser(false); }}
              className="p-2 rounded-lg transition-colors hover:bg-[rgba(0,0,0,0.05)]"
              style={{ color: 'var(--ic-text-secondary)' }}
              aria-label="Select language"
            >
              <Globe size={18} />
            </button>
            {showLang && (
              <div
                className="absolute right-0 top-full mt-2 w-44 rounded-xl overflow-hidden z-50"
                style={{
                  background: 'var(--ic-surface)',
                  border: '1px solid var(--ic-border)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}
              >
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => { setSelectedLang(lang.code); setShowLang(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[rgba(59,130,246,0.06)]"
                    style={{ color: selectedLang === lang.code ? 'var(--ic-blue)' : 'var(--ic-text-primary)' }}
                  >
                    <span>{lang.flag}</span>
                    <span className="font-heading font-semibold">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => { setShowNotif(v => !v); setShowLang(false); setShowUser(false); }}
              className="p-2 rounded-lg transition-colors relative hover:bg-[rgba(0,0,0,0.05)]"
              style={{ color: 'var(--ic-text-secondary)' }}
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1 right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{ background: '#EF4444', color: '#fff', fontSize: '9px' }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotif && (
              <div
                className="absolute right-0 top-full mt-2 w-80 rounded-xl overflow-hidden z-50"
                style={{
                  background: 'var(--ic-surface)',
                  border: '1px solid var(--ic-border)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}
              >
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--ic-border)' }}>
                  <h3 className="font-heading font-bold text-sm" style={{ color: 'var(--ic-text-primary)' }}>Notifications</h3>
                  <button type="button" onClick={() => setShowNotif(false)} aria-label="Close notifications">
                    <X size={14} style={{ color: 'var(--ic-text-secondary)' }} />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {MOCK_NOTIFICATIONS.map(n => (
                    <div
                      key={n.id}
                      className="flex gap-3 px-4 py-3 transition-colors hover:bg-[rgba(0,0,0,0.03)]"
                      style={{ borderBottom: '1px solid var(--ic-border)' }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: `${n.color}20` }}
                      >
                        <n.icon size={14} style={{ color: n.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-xs mb-0.5" style={{ color: 'var(--ic-text-primary)' }}>{n.title}</p>
                        <p className="text-xs line-clamp-2" style={{ color: 'var(--ic-text-secondary)' }}>{n.message}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--ic-blue)' }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-lg transition-colors hover:bg-[rgba(0,0,0,0.05)]"
            style={{ color: 'var(--ic-text-secondary)' }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User avatar */}
          <div ref={userRef} className="relative ml-1">
            <button
              type="button"
              onClick={() => { setShowUser(v => !v); setShowNotif(false); setShowLang(false); }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all hover:bg-[rgba(0,0,0,0.05)]"
              aria-label="User menu"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-sm text-white"
                style={{ background: avatarColor }}
              >
                {initial}
              </div>
              <span className="font-heading font-semibold text-sm hidden sm:block" style={{ color: 'var(--ic-text-primary)' }}>
                {user.firstName}
              </span>
              <ChevronDown size={14} style={{ color: 'var(--ic-text-secondary)' }} />
            </button>
            {showUser && (
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden z-50"
                style={{
                  background: 'var(--ic-surface)',
                  border: '1px solid var(--ic-border)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}
              >
                <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--ic-border)' }}>
                  <p className="font-heading font-bold text-sm" style={{ color: 'var(--ic-text-primary)' }}>
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--ic-text-secondary)' }}>{user.email}</p>
                </div>
                {[
                  { icon: User, label: 'Profile', action: () => { onNavigate('settings'); setShowUser(false); } },
                  { icon: Settings, label: 'Settings', action: () => { onNavigate('settings'); setShowUser(false); } },
                  { icon: CreditCard, label: 'My Plan', action: () => { onNavigate('plans'); setShowUser(false); } },
                  { icon: Zap, label: 'Go Premium', action: () => { onNavigate('plans'); setShowUser(false); }, highlight: true },
                ].map(item => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.action}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                    style={{ color: item.highlight ? '#F59E0B' : 'var(--ic-text-primary)' }}
                  >
                    <item.icon size={15} />
                    <span className="font-heading font-semibold">{item.label}</span>
                  </button>
                ))}
                <div style={{ borderTop: '1px solid var(--ic-border)' }}>
                  <button
                    type="button"
                    onClick={() => { onLogout(); setShowUser(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[rgba(239,68,68,0.06)]"
                    style={{ color: 'var(--ic-danger)' }}
                  >
                    <LogOut size={15} />
                    <span className="font-heading font-semibold">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
