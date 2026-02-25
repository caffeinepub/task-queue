import React, { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { getCurrentUser } from './utils/storage';
import { User } from './utils/storage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

type View = 'login' | 'signup' | 'dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<View>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setView('dashboard');
    }
  }, []);

  const handleLoginSuccess = () => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setView('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      {view === 'login' && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onGoToSignup={() => setView('signup')}
        />
      )}
      {view === 'signup' && (
        <Signup
          onSignupSuccess={() => setView('login')}
          onGoToLogin={() => setView('login')}
        />
      )}
      {view === 'dashboard' && currentUser && (
        <Dashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

export default App;
