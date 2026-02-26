import React, { useState, useRef } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { SiGoogle, SiFacebook, SiX } from 'react-icons/si';
import { toast } from 'sonner';
import { backend } from '../utils/backendService';
import { hashPassword, generateVerificationCode } from '../utils/crypto';

interface Props {
  onSignupSuccess: () => void;
  onGoToLogin: () => void;
}

function getPasswordStrength(pw: string): { label: string; score: number; color: string } {
  if (!pw) return { label: '', score: 0, color: '' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak', score: 1, color: '#ef4444' };
  if (score === 2) return { label: 'Fair', score: 2, color: '#f59e0b' };
  if (score === 3) return { label: 'Strong', score: 3, color: '#22c55e' };
  return { label: 'Very Strong', score: 4, color: '#06b6d4' };
}

const SignupPage: React.FC<Props> = ({ onSignupSuccess, onGoToLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Refs to read actual DOM values (handles browser autofill that bypasses onChange)
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  // Verification modal
  const [showVerify, setShowVerify] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);

  const strength = getPasswordStrength(password);

  const validate = () => {
    // Read actual DOM values to handle browser autofill that doesn't trigger onChange
    const pwValue = passwordRef.current?.value ?? password;
    const confirmValue = confirmPasswordRef.current?.value ?? confirmPassword;
    // Sync state if DOM differs (autofill case)
    if (pwValue !== password) setPassword(pwValue);
    if (confirmValue !== confirmPassword) setConfirmPassword(confirmValue);

    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'First name is required';
    if (!lastName.trim()) e.lastName = 'Last name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    if (!pwValue) e.password = 'Password is required';
    else if (pwValue.length < 6) e.password = 'Password must be at least 6 characters';
    if (!confirmValue) e.confirmPassword = 'Please confirm your password';
    else if (pwValue !== confirmValue) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    // Read DOM values directly at submit time to handle autofill
    const pwValue = passwordRef.current?.value ?? password;
    const confirmValue = confirmPasswordRef.current?.value ?? confirmPassword;
    if (pwValue !== password) setPassword(pwValue);
    if (confirmValue !== confirmPassword) setConfirmPassword(confirmValue);

    if (!validate()) return;
    setLoading(true);
    try {
      const hashed = await hashPassword(pwValue);
      const displayName = `${firstName.trim()} ${lastName.trim()}`;
      const emailExists = await backend.checkEmailExists(email.toLowerCase().trim());
      if (emailExists) {
        setErrors({ email: 'An account with this email already exists.' });
        setLoading(false);
        return;
      }
      const ok = await backend.registerUser(firstName.trim(), lastName.trim(), email.toLowerCase().trim(), hashed, displayName);
      if (!ok) {
        setErrors({ general: 'Registration failed. Please try again.' });
        setLoading(false);
        return;
      }
      const code = generateVerificationCode();
      setGeneratedCode(code);
      await backend.setVerificationCode(code);
      setShowVerify(true);
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyCode.trim()) {
      setVerifyError('Please enter the verification code.');
      return;
    }
    if (verifyCode.trim() !== generatedCode) {
      setVerifyError('Incorrect code. Please check and try again.');
      return;
    }
    setVerifyLoading(true);
    try {
      await backend.markUserVerified();
      toast.success('Email verified! You can now log in.');
      setShowVerify(false);
      onSignupSuccess();
    } catch {
      setVerifyError('Verification failed. Please try again.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login is not available on this platform.`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: '#f0f4f8' }}>
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
      <div className="w-full max-w-sm mx-auto px-6 pt-24 pb-24">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create an account</h1>
        <p className="text-sm text-gray-500 mb-6">Enter your information below to create your account</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {errors.general && (
            <div className="p-3 rounded-lg text-sm bg-red-50 text-red-600 border border-red-200">
              {errors.general}
            </div>
          )}

          {/* First & Last name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="signup-firstname" className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
              <input
                id="signup-firstname"
                type="text"
                value={firstName}
                onChange={e => { setFirstName(e.target.value); setErrors(p => ({ ...p, firstName: undefined! })); }}
                placeholder="John"
                className="w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                style={errors.firstName ? { borderColor: '#ef4444' } : { borderColor: '#d1d5db' }}
                autoComplete="given-name"
              />
              {errors.firstName && <p className="text-xs mt-1 text-red-500">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="signup-lastname" className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
              <input
                id="signup-lastname"
                type="text"
                value={lastName}
                onChange={e => { setLastName(e.target.value); setErrors(p => ({ ...p, lastName: undefined! })); }}
                placeholder="Doe"
                className="w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                style={errors.lastName ? { borderColor: '#ef4444' } : { borderColor: '#d1d5db' }}
                autoComplete="family-name"
              />
              {errors.lastName && <p className="text-xs mt-1 text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined! })); }}
              placeholder="john@doe.com"
              className="w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
              style={errors.email ? { borderColor: '#ef4444' } : { borderColor: '#d1d5db' }}
              autoComplete="email"
            />
            {errors.email && <p className="text-xs mt-1 text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                ref={passwordRef}
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined! })); }}
                onInput={e => { setPassword((e.target as HTMLInputElement).value); setErrors(p => ({ ...p, password: undefined! })); }}
                placeholder="Min. 6 characters"
                className="w-full px-3 py-2.5 pr-10 text-sm border rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                style={errors.password ? { borderColor: '#ef4444' } : { borderColor: '#d1d5db' }}
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Password strength bars */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{ background: i <= strength.score ? strength.color : '#e5e7eb' }} />
                  ))}
                </div>
                <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
                {password.length < 6 && <p className="text-xs mt-0.5 text-gray-400">Minimum 6 characters required</p>}
              </div>
            )}
            {errors.password && <p className="text-xs mt-1 text-red-500">{errors.password}</p>}
          </div>

          {/* Verify password */}
          <div>
            <label htmlFor="signup-confirm" className="block text-sm font-medium text-gray-700 mb-1.5">Verify password</label>
            <div className="relative">
              <input
                ref={confirmPasswordRef}
                id="signup-confirm"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: undefined! })); }}
                onInput={e => { setConfirmPassword((e.target as HTMLInputElement).value); setErrors(p => ({ ...p, confirmPassword: undefined! })); }}
                placeholder="Repeat password"
                className="w-full px-3 py-2.5 pr-10 text-sm border rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                style={errors.confirmPassword ? { borderColor: '#ef4444' } : (confirmPassword && confirmPassword === password ? { borderColor: '#22c55e' } : { borderColor: '#d1d5db' })}
                autoComplete="off"
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs mt-1 text-red-500">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all mt-1"
            style={{ background: loading ? '#60a5fa' : '#3b82f6', opacity: loading ? 0.8 : 1 }}>
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : 'Submit'}
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
          Sign up with Google
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
          Already have an account?{' '}
          <button type="button" onClick={onGoToLogin} className="text-blue-600 font-semibold hover:underline">
            Login
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

      {/* Verification Modal */}
      {showVerify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Verify Your Email</h3>
                <p className="text-sm text-gray-500">Enter the 6-digit code shown below</p>
              </div>
              <button type="button" onClick={() => setShowVerify(false)} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            {/* Code display */}
            <div className="rounded-xl p-6 mb-6 text-center bg-blue-50 border border-blue-100">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Your verification code (simulated email)</p>
              <p className="font-mono text-3xl font-bold tracking-[0.3em] text-blue-600">{generatedCode}</p>
              <p className="text-xs mt-2 text-gray-400">(In production, this would be sent to {email})</p>
            </div>

            <div className="mb-4">
              <label htmlFor="verify-code" className="block text-sm font-medium text-gray-700 mb-2">Enter Code</label>
              <input
                id="verify-code"
                type="text"
                value={verifyCode}
                onChange={e => { setVerifyCode(e.target.value); setVerifyError(''); }}
                placeholder="000000"
                className="w-full px-3 py-2.5 text-center text-xl font-mono tracking-widest border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={6}
              />
              {verifyError && <p className="text-xs mt-1 text-red-500">{verifyError}</p>}
            </div>

            <button type="button" onClick={handleVerify} disabled={verifyLoading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
              style={{ background: verifyLoading ? '#60a5fa' : '#3b82f6', opacity: verifyLoading ? 0.8 : 1 }}>
              {verifyLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
