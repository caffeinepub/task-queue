import React, { useState, useEffect, useRef } from 'react';
import { getUserByEmail, updateUser } from '../utils/storage';
import { showNotification } from '../utils/notifications';

interface VerificationModalProps {
  email: string;
  verificationCode: string;
  onVerified: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ email, verificationCode, onVerified }) => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleVerify = () => {
    if (!inputCode.trim()) {
      setError('Please enter the verification code.');
      return;
    }
    if (inputCode.trim() !== verificationCode) {
      setError('Invalid code. Please try again.');
      setInputCode('');
      inputRef.current?.focus();
      return;
    }

    setIsVerifying(true);
    setError('');

    // Mark user as verified
    const user = getUserByEmail(email);
    if (user) {
      updateUser({ ...user, verified: true });
    }

    showNotification('Account verified! You can now log in.', 'success');
    setIsVerifying(false);
    onVerified();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy-900/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-modal p-8 animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="verify-title"
      >
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h2 id="verify-title" className="text-xl font-bold text-navy-900 text-center mb-2">
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-500 text-center mb-1">
          A verification code has been sent to
        </p>
        <p className="text-sm font-semibold text-navy-700 text-center mb-6 break-all">
          {email}
        </p>

        {/* Simulated email notice */}
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-sky-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-sky-700 mb-1">Demo Mode — Code shown on screen</p>
              <p className="text-xs text-sky-600">
                Your verification code is:{' '}
                <span className="font-bold text-sky-800 text-sm tracking-widest">{verificationCode}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Code input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-navy-700 mb-1.5">
            Enter 6-digit verification code
          </label>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={inputCode}
            onChange={e => {
              setError('');
              setInputCode(e.target.value.replace(/\D/g, '').slice(0, 6));
            }}
            onKeyDown={handleKeyDown}
            placeholder="000000"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all text-lg text-center tracking-[0.4em] font-mono"
          />
          {error && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}
        </div>

        <button
          onClick={handleVerify}
          disabled={isVerifying || inputCode.length !== 6}
          className="w-full py-3 rounded-xl bg-navy-800 text-white font-semibold text-sm hover:bg-navy-700 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isVerifying ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Verifying…
            </span>
          ) : (
            'Verify Account'
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Didn't receive the code? Check your spam folder or contact support.
        </p>
      </div>
    </div>
  );
};

export default VerificationModal;
