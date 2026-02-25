import React, { useState } from 'react';
import { signup } from '../utils/auth';
import CustomPopup from '../components/CustomPopup';
import VerificationModal from '../components/VerificationModal';

interface SignupProps {
  onSignupSuccess: () => void;
  onGoToLogin: () => void;
}

const EyeIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {open ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
    ) : (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </>
    )}
  </svg>
);

const Signup: React.FC<SignupProps> = ({ onSignupSuccess, onGoToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [popup, setPopup] = useState<{ title: string; message: string } | null>(null);
  const [verification, setVerification] = useState<{ email: string; code: string } | null>(null);

  // Real-time password validation state
  const passwordTouched = password.length > 0;
  const passwordValid = password.length >= 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side password length check before calling auth
    if (password.length > 0 && password.length < 6) {
      setPopup({ title: 'Password Too Short', message: 'Password must be at least 6 characters.' });
      return;
    }

    const result = signup(name, email, phone, password, confirmPassword);
    if (result.success && result.verificationCode && result.email) {
      setVerification({ email: result.email, code: result.verificationCode });
    } else if (!result.success) {
      setPopup({ title: 'Signup Error', message: result.error || 'An error occurred.' });
    }
  };

  const handleVerified = () => {
    setVerification(null);
    onSignupSuccess();
  };

  const fields = [
    {
      label: 'Full Name',
      type: 'text',
      value: name,
      onChange: (v: string) => setName(v),
      placeholder: 'Enter your full name',
    },
    {
      label: 'Email Address',
      type: 'email',
      value: email,
      onChange: (v: string) => setEmail(v),
      placeholder: 'Enter your email',
    },
    {
      label: 'Phone Number',
      type: 'tel',
      value: phone,
      onChange: (v: string) => setPhone(v),
      placeholder: 'Enter your phone number',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 flex items-center justify-center p-4">
      {popup && (
        <CustomPopup
          type="error"
          title={popup.title}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}

      {verification && (
        <VerificationModal
          email={verification.email}
          verificationCode={verification.code}
          onVerified={handleVerified}
        />
      )}

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo — same as DashboardHeader */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img
              src="/assets/generated/task-queue-logo.dim_256x256.png"
              alt="Task Queue Logo"
              className="w-16 h-16 rounded-2xl object-cover shadow-lg"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            {/* Fallback icon (hidden by default) */}
            <div
              className="w-16 h-16 rounded-2xl bg-sky-500 shadow-lg items-center justify-center"
              style={{ display: 'none' }}
            >
              <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Task Queue</h1>
          <p className="text-navy-300 mt-1 text-sm">Your productivity hub</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-card p-8">
          <h2 className="text-xl font-semibold text-navy-900 mb-6">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(field => (
              <div key={field.label}>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all text-sm"
                />
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className={`w-full px-4 py-3 rounded-xl border text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm pr-12 ${
                    passwordTouched && !passwordValid
                      ? 'border-red-400 focus:ring-red-400'
                      : passwordTouched && passwordValid
                      ? 'border-green-400 focus:ring-green-400'
                      : 'border-gray-200 focus:ring-sky-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {/* Password criteria hint */}
              <div className="flex items-center gap-1.5 mt-1.5">
                {passwordTouched ? (
                  passwordValid ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs text-green-600 font-medium">Minimum 6 characters ✓</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                      </svg>
                      <span className="text-xs text-red-500 font-medium">
                        Minimum 6 characters ({password.length}/6)
                      </span>
                    </>
                  )
                ) : (
                  <span className="text-xs text-gray-400">Minimum 6 characters required</span>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-navy-800 text-white font-semibold text-sm hover:bg-navy-700 active:scale-95 transition-all shadow-md mt-2"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <button
              onClick={onGoToLogin}
              className="text-sky-500 font-semibold hover:text-sky-600 transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
