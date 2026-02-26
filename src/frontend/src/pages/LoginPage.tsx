import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { SiGoogle, SiFacebook, SiX } from 'react-icons/si';
import { toast } from 'sonner';
import { backend } from '../utils/backendService';
import { hashPassword } from '../utils/crypto';

interface Props {
  onLoginSuccess: (profile: { firstName: string; lastName: string; email: string; hasCompletedOnboarding: boolean }) => void;
  onGoToSignup: () => void;
  onGoToForgotPassword: () => void;
}

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

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login is not available on this platform. Please use email/password.`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#f0f4f8' }}>
      {/* Top nav bar */}
      <div className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between fixed top-0 left-0 z-10">
        <div className="flex items-center gap-2">
          <img src="/assets/uploads/Brand-1.png" alt="IRONCLAD logo" className="w-8 h-8 object-contain" />
          <span className="font-bold text-gray-900 text-base">IRONCLAD</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="cursor-pointer hover:text-gray-700">Remove Ads</span>
        </div>
      </div>

      {/* Form container */}
      <div className="w-full max-w-sm mx-auto px-6 pt-24 pb-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Login to your account</h1>
        <p className="text-sm text-gray-500 text-center mb-8">Enter your credentials below to login</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {errors.general && (
            <div className="p-3 rounded-lg text-sm bg-red-50 text-red-600 border border-red-200">
              {errors.general}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
              placeholder="m@example.com"
              className="w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
              style={errors.email ? { borderColor: '#ef4444' } : { borderColor: '#d1d5db' }}
              autoComplete="email"
            />
            {errors.email && <p className="text-xs mt-1 text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
              <button type="button" onClick={onGoToForgotPassword}
                className="text-xs text-orange-500 hover:underline transition-all">
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
                style={errors.password ? { borderColor: '#ef4444' } : { borderColor: '#d1d5db' }}
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs mt-1 text-red-500">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
            style={{ background: loading ? '#60a5fa' : '#3b82f6', opacity: loading ? 0.8 : 1 }}>
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

        {/* Google button (prominent) */}
        <button type="button" onClick={() => handleSocialLogin('Google')}
          className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-blue-500 text-blue-600 text-sm font-medium transition-all hover:bg-blue-50 bg-white mb-3">
          <SiGoogle size={16} style={{ color: '#DB4437' }} />
          Sign in with Google
        </button>

        {/* Facebook & Twitter row */}
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => handleSocialLogin('Facebook')}
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium transition-all hover:bg-gray-50 bg-white">
            <SiFacebook size={15} style={{ color: '#1877F2' }} />
            Facebook
          </button>
          <button type="button" onClick={() => handleSocialLogin('Twitter')}
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium transition-all hover:bg-gray-50 bg-white">
            <SiX size={15} style={{ color: '#000000' }} />
            Twitter
          </button>
        </div>

        <p className="text-center text-sm mt-6 text-gray-600">
          Don't have an account?{' '}
          <button type="button" onClick={onGoToSignup} className="text-blue-600 font-semibold hover:underline">
            Sign up
          </button>
        </p>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 text-xs text-gray-400">
        {[
          { label: 'Workouts', icon: '🏋️' },
          { label: 'Programs', icon: '📋' },
          { label: 'Statistics', icon: '📊' },
          { label: 'Tools', icon: '🔧' },
          { label: 'Leaderboard', icon: '🏆' },
          { label: 'Premium', icon: '⭐' },
        ].map(item => (
          <div key={item.label} className="flex flex-col items-center gap-0.5 px-2">
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoginPage;
