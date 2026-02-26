import React, { useState } from 'react';
import { Eye, EyeOff, Bell, Globe, User, Dumbbell, BarChart2, BookOpen, Wrench, Trophy, Crown } from 'lucide-react';
import { SiGoogle } from 'react-icons/si';
import { toast } from 'sonner';
import { backend } from '../utils/backendService';
import { hashPassword } from '../utils/crypto';

interface Props {
  onLoginSuccess: (profile: { firstName: string; lastName: string; email: string; hasCompletedOnboarding: boolean }) => void;
  onGoToSignup: () => void;
  onGoToForgotPassword: () => void;
}

const BOTTOM_TABS = [
  { label: 'Workouts', icon: Dumbbell },
  { label: 'Programs', icon: BookOpen },
  { label: 'Statistics', icon: BarChart2 },
  { label: 'Tools', icon: Wrench },
  { label: 'Leaderboard', icon: Trophy },
  { label: 'Premium', icon: Crown },
];

const LoginPage: React.FC<Props> = ({ onLoginSuccess, onGoToSignup, onGoToForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const hashed = await hashPassword(password);
      const ok = await backend.loginUser(email.toLowerCase().trim(), hashed);
      if (!ok) {
        setErrors({ general: 'Invalid email or password. Please try again.' });
        setLoading(false);
        return;
      }
      const profile = await backend.getUserProfile();
      if (!profile) {
        setErrors({ general: 'Could not load your profile. Please try again.' });
        setLoading(false);
        return;
      }
      if (!profile.isVerified) {
        setErrors({ general: 'Account not verified. Please verify your email before logging in.' });
        setLoading(false);
        return;
      }
      toast.success(`Welcome back, ${profile.firstName}!`);
      onLoginSuccess({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        hasCompletedOnboarding: profile.hasCompletedOnboarding,
      });
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info('Google login is not available on this platform. Please use email/password.');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f7fa' }}>
      {/* Top nav bar */}
      <header className="w-full bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between fixed top-0 left-0 z-10">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#1a1a2e' }}>
            <img
              src="/assets/generated/volt-logo.dim_200x200.png"
              alt="VOLT logo"
              className="w-6 h-6 object-contain"
              onError={e => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="hidden text-yellow-400 font-bold text-xs">V</span>
          </div>
          <span className="font-bold text-gray-900 text-base tracking-wide">VOLT</span>
        </div>

        {/* Right: action icons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="hidden sm:flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-gray-400" />
            </span>
            Remove Ads
          </button>
          <button type="button" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500" aria-label="Notifications">
            <Bell size={17} />
          </button>
          <button type="button" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500" aria-label="Language">
            <Globe size={17} />
          </button>
          <button type="button" className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white" aria-label="User">
            <User size={15} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center pt-16 pb-24 px-4">
        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Login to your account</h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Enter your credentials below to login
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {errors.general && (
              <div className="p-3 rounded-lg text-sm bg-red-50 text-red-600 border border-red-200">
                {errors.general}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                placeholder="m@example.com"
                className="w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                style={errors.email ? { borderColor: '#ef4444' } : { borderColor: '#e5e7eb' }}
                autoComplete="email"
              />
              {errors.email && <p className="text-xs mt-1 text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={onGoToForgotPassword}
                  className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }}
                  placeholder=""
                  className="w-full px-3 py-2.5 pr-10 text-sm border rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  style={errors.password ? { borderColor: '#ef4444' } : { borderColor: '#e5e7eb' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1 text-red-500">{errors.password}</p>}
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
              style={{ background: loading ? '#60a5fa' : '#3b82f6', opacity: loading ? 0.85 : 1 }}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : 'Login'}
            </button>
          </form>

          {/* OR divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border text-sm font-medium transition-all hover:bg-gray-50 bg-white"
            style={{ borderColor: '#3b82f6', color: '#3b82f6' }}
          >
            <SiGoogle size={16} style={{ color: '#DB4437' }} />
            Sign in with Google
          </button>

          <p className="text-center text-sm mt-6 text-gray-600">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={onGoToSignup}
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </main>

      {/* Bottom tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-stretch"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {BOTTOM_TABS.map((tab, i) => {
          const Icon = tab.icon;
          const isPremium = tab.label === 'Premium';
          return (
            <div
              key={tab.label}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-gray-400"
              style={{ position: 'relative' }}
            >
              <Icon
                size={20}
                strokeWidth={1.8}
                style={{ color: isPremium ? '#F59E0B' : '#9CA3AF' }}
              />
              <span
                className="text-xs"
                style={{
                  color: isPremium ? '#F59E0B' : '#9CA3AF',
                  fontSize: '0.6rem',
                  fontWeight: 500,
                }}
              >
                {tab.label}
              </span>
              {isPremium && (
                <span
                  className="absolute top-1 right-3 w-1.5 h-1.5 rounded-full"
                  style={{ background: '#F59E0B' }}
                />
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default LoginPage;
