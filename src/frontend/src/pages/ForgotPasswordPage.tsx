import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

interface Props {
  onGoToLogin: () => void;
}

const ForgotPasswordPage: React.FC<Props> = ({ onGoToLogin }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000)); // simulate network
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 page-enter" style={{ background: 'var(--ic-bg)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/assets/generated/volt-logo.dim_200x200.png" alt="VOLT logo" className="w-16 h-16 mx-auto mb-4 rounded-md object-contain" />
          <h1 className="font-display text-4xl tracking-widest" style={{ color: '#111827' }}>VOLT</h1>
        </div>

        <div className="ic-card p-8">
          {!submitted ? (
            <>
              <div className="mb-6">
                <h2 className="font-heading text-2xl font-bold mb-1" style={{ color: 'var(--ic-text-primary)' }}>Reset Password</h2>
                <p className="text-sm" style={{ color: 'var(--ic-text-secondary)' }}>
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ic-text-secondary)' }} />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      placeholder="your@email.com"
                      className="ic-input pl-10"
                      style={error ? { borderColor: 'var(--ic-danger)' } : {}}
                      autoComplete="email"
                    />
                  </div>
                  {error && <p className="text-xs mt-1" style={{ color: 'var(--ic-danger)' }}>{error}</p>}
                </div>

                <button type="submit" disabled={loading} className="ic-btn-copper w-full" style={{ opacity: loading ? 0.7 : 1 }}>
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : 'SEND RESET LINK'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(76,175,125,0.12)' }}>
                  <CheckCircle size={32} style={{ color: 'var(--ic-success)' }} />
                </div>
              </div>
              <h3 className="font-heading text-xl font-bold mb-2" style={{ color: 'var(--ic-text-primary)' }}>Check Your Inbox</h3>
              <p className="text-sm mb-1" style={{ color: 'var(--ic-text-secondary)' }}>
                We sent a reset link to
              </p>
              <p className="font-heading font-semibold mb-6" style={{ color: 'var(--ic-copper)' }}>{email}</p>
              <p className="text-xs mb-6" style={{ color: 'var(--ic-text-secondary)' }}>
                (Note: Email sending is simulated on this platform)
              </p>
            </div>
          )}

          <button type="button" onClick={onGoToLogin}
            className="flex items-center gap-2 text-sm mt-4 mx-auto hover:underline transition-all"
            style={{ color: 'var(--ic-text-secondary)' }}>
            <ArrowLeft size={14} />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
