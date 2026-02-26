import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { backend } from './utils/backendService';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OnboardingPage from './pages/OnboardingPage';

import NavBar from './components/NavBar';
import AppSidebar from './components/Sidebar';
import BottomTabBar from './components/BottomTabBar';

import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import StatisticsPage from './pages/StatisticsPage';
import ProgramsPage from './pages/ProgramsPage';
import ToolsPage from './pages/ToolsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import PlansPage from './pages/PlansPage';
import SettingsPage from './pages/SettingsPage';

type UnauthView = 'login' | 'signup' | 'forgot-password';
type AuthView = 'dashboard' | 'workouts' | 'statistics' | 'programs' | 'tools' | 'leaderboard' | 'plans' | 'settings';
type AppState = UnauthView | 'onboarding' | AuthView;

interface UserSession {
  firstName: string;
  lastName: string;
  email: string;
  hasCompletedOnboarding: boolean;
}

const THEME_KEY = 'ironclad_theme';
const SESSION_KEY = 'ironclad_session';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('login');
  const [user, setUser] = useState<UserSession | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'light';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Apply theme to html element
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Restore session on load
  const restoreSession = useCallback(async () => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (!saved) return;
    try {
      const session = JSON.parse(saved) as UserSession;
      // Try to fetch fresh profile
      const profile = await backend.getUserProfile();
      if (profile && profile.isVerified) {
        const freshSession: UserSession = {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          hasCompletedOnboarding: profile.hasCompletedOnboarding,
        };
        setUser(freshSession);
        localStorage.setItem(SESSION_KEY, JSON.stringify(freshSession));
        setView(profile.hasCompletedOnboarding ? 'dashboard' : 'onboarding');
      } else if (session) {
        // Fallback to cached session data
        setUser(session);
        setView(session.hasCompletedOnboarding ? 'dashboard' : 'onboarding');
      }
    } catch {
      // Could not restore, stay on login
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const handleLoginSuccess = (profile: UserSession) => {
    setUser(profile);
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    setView(profile.hasCompletedOnboarding ? 'dashboard' : 'onboarding');
  };

  const handleOnboardingComplete = () => {
    if (user) {
      const updated = { ...user, hasCompletedOnboarding: true };
      setUser(updated);
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    }
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    setView('login');
  };

  const navigate = (v: AuthView) => setView(v);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  // Unauthenticated views
  const isUnauth = view === 'login' || view === 'signup' || view === 'forgot-password' || view === 'onboarding';

  return (
    <>
      <Toaster position="top-right" richColors />

      {view === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onGoToSignup={() => setView('signup')}
          onGoToForgotPassword={() => setView('forgot-password')}
        />
      )}

      {view === 'signup' && (
        <SignupPage
          onSignupSuccess={() => setView('login')}
          onGoToLogin={() => setView('login')}
        />
      )}

      {view === 'forgot-password' && (
        <ForgotPasswordPage onGoToLogin={() => setView('login')} />
      )}

      {view === 'onboarding' && user && (
        <OnboardingPage onComplete={handleOnboardingComplete} />
      )}

      {/* Authenticated layout */}
      {!isUnauth && user && (
        <div style={{ background: 'var(--ic-bg)', minHeight: '100vh' }}>
          <NavBar
            user={user}
            theme={theme}
            onToggleTheme={toggleTheme}
            onLogout={handleLogout}
            onNavigate={navigate}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(v => !v)}
          />

          <AppSidebar
            currentView={view as AuthView}
            onNavigate={navigate}
            collapsed={sidebarCollapsed}
          />

          <main className="pt-[60px] pb-20 lg:pb-6 transition-all duration-300"
            style={{ marginLeft: 0 }}
            >
            <div className="max-w-6xl mx-auto px-4 py-6 lg:pl-6"
              style={{ paddingLeft: sidebarCollapsed ? '80px' : '236px' }}>
              {view === 'dashboard' && <DashboardPage user={user} onNavigate={navigate} />}
              {view === 'workouts' && <WorkoutsPage />}
              {view === 'statistics' && <StatisticsPage onNavigate={navigate} />}
              {view === 'programs' && <ProgramsPage />}
              {view === 'tools' && <ToolsPage />}
              {view === 'leaderboard' && <LeaderboardPage />}
              {view === 'plans' && <PlansPage />}
              {view === 'settings' && (
                <SettingsPage
                  user={user}
                  theme={theme}
                  onToggleTheme={toggleTheme}
                  onLogout={handleLogout}
                />
              )}
            </div>
          </main>

          <BottomTabBar currentView={view as AuthView} onNavigate={navigate} />
        </div>
      )}
    </>
  );
};

export default App;
