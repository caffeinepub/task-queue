import React, { useState } from 'react';
import { Check, Crown, Star, Zap, Users, BarChart2, Dumbbell, Brain } from 'lucide-react';
import { toast } from 'sonner';

const FREE_FEATURES = [
  'Exercise library (500+)',
  'Basic workout logging',
  'Workout builder',
  'Body weight tracking',
  'Workout streak tracker',
  'Basic statistics',
  'Leaderboard access',
  '3 workout programs',
];

const PREMIUM_FEATURES = [
  'Everything in Free',
  'Unlimited workout programs',
  'AI-powered coaching',
  'Advanced analytics & charts',
  'Custom workout plans',
  'Priority support',
  'Nutrition tracking & macros',
  'No ads ever',
  'Early access to new features',
  'Personal record tracking (1RM)',
];

const COMPARE_SECTIONS = [
  {
    title: 'Equipment & Exercises',
    rows: [
      { feature: 'Exercise library',         free: '500+',     premium: '1,200+' },
      { feature: 'Custom exercises',         free: false,      premium: true },
      { feature: 'Exercise video tutorials', free: '∞',        premium: '∞' },
      { feature: 'Equipment filter',         free: true,       premium: true },
    ],
  },
  {
    title: 'Tracking & Analytics',
    rows: [
      { feature: 'Workout logging',           free: true,       premium: true },
      { feature: 'Weight progress chart',     free: 'Basic',    premium: 'Advanced' },
      { feature: 'Volume tracking',           free: false,      premium: true },
      { feature: '1RM calculator & tracking', free: 'Basic',    premium: 'Full history' },
      { feature: 'Body measurements',         free: false,      premium: true },
    ],
  },
  {
    title: 'Programs & AI',
    rows: [
      { feature: 'Workout programs',       free: '3',    premium: 'Unlimited' },
      { feature: 'AI workout generation',  free: false,  premium: true },
      { feature: 'AI nutrition coaching',  free: false,  premium: true },
      { feature: 'Recovery optimization',  free: false,  premium: true },
    ],
  },
];

const PlansPage: React.FC = () => {
  const [yearly, setYearly] = useState(false);

  const handleUpgrade = () => {
    toast.info('Upgrade flow coming soon! Payment integration in progress.');
  };

  return (
    <div className="space-y-6 page-enter">
      {/* Top banner */}
      <div
        className="rounded-xl p-3 text-center text-sm font-heading font-semibold"
        style={{ background: 'linear-gradient(90deg, #22C55E, #16A34A)', color: '#fff' }}
      >
        🏋️ 234 supporters helping the mission · ⚡ Limited early access spots remaining
      </div>

      {/* Hero */}
      <div className="text-center py-4">
        <h1 className="font-heading text-3xl font-bold mb-2" style={{ color: 'var(--ic-text-primary)' }}>
          Train freely, support the mission 💪
        </h1>
        <p className="text-sm" style={{ color: 'var(--ic-text-secondary)' }}>
          VOLT remains free forever. Premium supports development and unlocks advanced features.
        </p>
      </div>

      {/* Stats */}
      <div className="ic-card p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: '#F3F4F6' }}>🏋️</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
            {[
              { icon: Users,    val: '12.4K+', label: 'Active athletes' },
              { icon: Dumbbell, val: '1.2M+',  label: 'Sets recorded' },
              { icon: Star,     val: '4.9/5',  label: 'Community rating' },
              { icon: BarChart2,val: '+23%',   label: 'Avg progression' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-2">
                  <Icon size={14} style={{ color: '#22C55E' }} />
                  <div>
                    <p className="font-heading font-bold text-sm" style={{ color: 'var(--ic-text-primary)' }}>{s.val}</p>
                    <p className="text-xs" style={{ color: 'var(--ic-text-secondary)' }}>{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly/Yearly toggle */}
      <div className="flex justify-center">
        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: '#F3F4F6', border: '1px solid rgba(0,0,0,0.06)' }}
        >
          <button
            type="button"
            onClick={() => setYearly(false)}
            className="px-4 py-2 rounded-lg text-sm font-heading font-semibold transition-all"
            style={{ background: !yearly ? '#3B82F6' : 'transparent', color: !yearly ? '#fff' : 'var(--ic-text-secondary)' }}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setYearly(true)}
            className="px-4 py-2 rounded-lg text-sm font-heading font-semibold transition-all flex items-center gap-2"
            style={{ background: yearly ? '#3B82F6' : 'transparent', color: yearly ? '#fff' : 'var(--ic-text-secondary)' }}
          >
            Yearly
            <span
              className="px-1.5 py-0.5 rounded text-xs font-bold"
              style={{
                background: yearly ? 'rgba(255,255,255,0.2)' : 'rgba(34,197,94,0.15)',
                color: yearly ? '#fff' : '#22C55E',
              }}
            >
              -48%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Free */}
        <div className="ic-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-heading font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }}
                >
                  Open-Source · Always Free
                </span>
              </div>
              <h2 className="font-display text-3xl tracking-wider mt-2" style={{ color: 'var(--ic-text-primary)' }}>FREE</h2>
            </div>
            <div className="text-3xl">🐙</div>
          </div>

          <div className="mb-4">
            <span className="font-display text-4xl" style={{ color: 'var(--ic-text-primary)' }}>$0</span>
            <span className="text-sm ml-1" style={{ color: 'var(--ic-text-secondary)' }}>/forever</span>
          </div>

          <p className="text-sm mb-5" style={{ color: 'var(--ic-text-secondary)' }}>
            All essential functions for training — free, forever.
          </p>

          <div className="space-y-2 mb-6">
            {FREE_FEATURES.map(f => (
              <div key={f} className="flex items-center gap-2.5">
                <Check size={14} style={{ color: '#22C55E', flexShrink: 0 }} />
                <span className="text-sm" style={{ color: 'var(--ic-text-primary)' }}>{f}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="w-full py-3 rounded-xl font-heading font-bold text-sm transition-all"
            style={{ background: '#F3F4F6', color: 'var(--ic-text-secondary)', border: '1px solid rgba(0,0,0,0.08)' }}
          >
            Current Plan
          </button>
        </div>

        {/* Premium — keep the dark card with teal/green accent per screenshots */}
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0e2a1e 100%)', border: '1px solid rgba(20,184,166,0.3)' }}
        >
          {/* Glow */}
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #14B8A6 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
          />

          {/* Most popular header */}
          <div
            className="px-6 py-2 text-center text-xs font-heading font-bold tracking-widest uppercase"
            style={{ background: 'rgba(20,184,166,0.2)', borderBottom: '1px solid rgba(20,184,166,0.25)', color: '#14B8A6' }}
          >
            MOST POPULAR · For enthusiasts
          </div>

          <div className="relative z-10 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-display text-3xl tracking-wider text-white">PREMIUM</h2>
              </div>
              <Crown size={28} style={{ color: '#F59E0B' }} />
            </div>

            <div className="mb-4">
              {yearly ? (
                <div>
                  <span className="font-display text-4xl text-white">$4.99</span>
                  <span className="text-sm ml-1 text-white/60">/month</span>
                  <div className="text-xs mt-0.5" style={{ color: '#22C55E' }}>Billed $59.88/year · Save $56/year</div>
                </div>
              ) : (
                <div>
                  <span className="font-display text-4xl text-white">$9.99</span>
                  <span className="text-sm ml-1 text-white/60">/month</span>
                </div>
              )}
            </div>

            <p className="text-sm mb-5 text-white/70">
              All features + priority support + AI coaching + early access.
            </p>

            <div className="space-y-2 mb-6">
              {PREMIUM_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2.5">
                  <Check size={14} style={{ color: '#22C55E', flexShrink: 0 }} />
                  <span className="text-sm text-white">{f}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleUpgrade}
              className="w-full py-3 rounded-xl font-heading font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)', color: '#fff' }}
            >
              <Zap size={16} />
              Upgrade to Premium
            </button>

            <p className="text-center text-xs mt-2 text-white/50">
              Cancel anytime · Secure payment
            </p>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="ic-card overflow-hidden">
        <div className="p-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <h3 className="font-heading font-bold text-lg" style={{ color: 'var(--ic-text-primary)' }}>Feature Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <th className="text-left p-4 font-heading font-semibold text-sm" style={{ color: 'var(--ic-text-secondary)' }}>Feature</th>
                <th className="text-center p-4 font-heading font-semibold text-sm" style={{ color: 'var(--ic-text-secondary)' }}>FREE</th>
                <th className="text-center p-4 font-heading font-semibold text-sm" style={{ color: '#14B8A6' }}>
                  PREMIUM ⭐
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_SECTIONS.map(section => (
                <React.Fragment key={section.title}>
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-2.5 text-xs font-heading font-bold uppercase tracking-widest"
                      style={{ color: '#14B8A6', background: 'rgba(20,184,166,0.04)' }}
                    >
                      {section.title}
                    </td>
                  </tr>
                  {section.rows.map(row => (
                    <tr key={row.feature} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <td className="p-4 text-sm" style={{ color: 'var(--ic-text-primary)' }}>{row.feature}</td>
                      <td className="p-4 text-center text-sm" style={{ color: 'var(--ic-text-secondary)' }}>
                        {row.free === true
                          ? <Check size={16} className="mx-auto" style={{ color: '#22C55E' }} />
                          : row.free === false
                          ? <span style={{ color: '#D1D5DB' }}>—</span>
                          : row.free}
                      </td>
                      <td className="p-4 text-center text-sm" style={{ color: '#14B8A6' }}>
                        {row.premium === true
                          ? <Check size={16} className="mx-auto" style={{ color: '#22C55E' }} />
                          : row.premium === false
                          ? <span style={{ color: '#D1D5DB' }}>—</span>
                          : row.premium}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-6">
        <p className="font-heading text-lg font-bold mb-2" style={{ color: 'var(--ic-text-primary)' }}>
          Ready to level up your training?
        </p>
        <p className="text-sm mb-4" style={{ color: 'var(--ic-text-secondary)' }}>
          Join 12,400+ athletes who train with VOLT Premium
        </p>
        <button
          type="button"
          onClick={handleUpgrade}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-heading font-bold text-sm transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)', color: '#fff' }}
        >
          <Brain size={16} />
          Start Premium Free Trial
        </button>
      </div>
    </div>
  );
};

export default PlansPage;
