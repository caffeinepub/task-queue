import React, { useEffect, useState } from 'react';
import { Zap, Lock, TrendingUp, Award, BarChart3, Activity } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

type AppView = 'dashboard' | 'workouts' | 'statistics' | 'programs' | 'tools' | 'leaderboard' | 'plans' | 'settings';

interface Props {
  onNavigate: (view: AppView) => void;
}

const WEIGHT_DATA = [
  { week: 'W1', weight: 82   }, { week: 'W2', weight: 81.2 }, { week: 'W3', weight: 80.8 },
  { week: 'W4', weight: 80.1 }, { week: 'W5', weight: 79.5 }, { week: 'W6', weight: 79.0 },
  { week: 'W7', weight: 78.5 }, { week: 'W8', weight: 78.2 },
];

const FREQ_DATA = [
  { week: 'Wk 1', workouts: 3 }, { week: 'Wk 2', workouts: 5 }, { week: 'Wk 3', workouts: 4 },
  { week: 'Wk 4', workouts: 5 }, { week: 'Wk 5', workouts: 6 }, { week: 'Wk 6', workouts: 4 },
  { week: 'Wk 7', workouts: 5 }, { week: 'Wk 8', workouts: 4 },
];

interface StreakDay { weekIdx: number; dayIdx: number; value: number }

function generateStreakCalendar(): StreakDay[][] {
  const weeks = 12;
  const days = 7;
  const data: StreakDay[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: StreakDay[] = [];
    for (let d = 0; d < days; d++) {
      const r = Math.random();
      let value = 0;
      if (r > 0.65) value = Math.floor(Math.random() * 3) + 2;
      else if (r > 0.3) value = 1;
      week.push({ weekIdx: w, dayIdx: d, value });
    }
    data.push(week);
  }
  return data;
}

const StatisticsPage: React.FC<Props> = ({ onNavigate }) => {
  const [streakData] = useState(() => generateStreakCalendar());
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHasLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="font-heading text-3xl font-bold mb-1" style={{ color: 'var(--ic-text-primary)' }}>Statistics</h1>
        <p className="text-sm" style={{ color: 'var(--ic-text-secondary)' }}>Track your progress and performance</p>
      </div>

      {/* Premium Upsell Card — keep the purple gradient, it's a feature highlight */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #2563EB 50%, #0F172A 100%)', padding: '1.5rem' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #7C3AED 0%, transparent 60%)' }}
        />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={18} style={{ color: '#F59E0B' }} />
                <span className="font-heading font-bold text-sm tracking-widest uppercase text-white">Premium Statistics</span>
              </div>
              <h2 className="font-display text-3xl text-white mb-2">UNLOCK FULL INSIGHTS</h2>
              <p className="text-sm text-white/70">Advanced analytics to accelerate your gains</p>
            </div>
            <div className="hidden sm:block">
              <div className="opacity-50 w-32 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={WEIGHT_DATA}>
                    <Line type="monotone" dataKey="weight" stroke="#F59E0B" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { val: '2,437', label: 'Total Volume' },
              { val: '+12%',  label: 'PR Increase' },
              { val: '75%',   label: 'Weight Progress' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-display text-xl text-white">{s.val}</p>
                <p className="text-xs text-white/60 font-heading">{s.label}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('plans')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-sm tracking-wide transition-all hover:opacity-90"
            style={{ background: '#F59E0B', color: '#000' }}
          >
            <Zap size={14} />
            Upgrade Now →
          </button>
          <p className="text-xs text-white/50 mt-2">4.8/5 rating · No ads · Cancel anytime</p>
        </div>
      </div>

      {/* Free Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, color: '#22C55E', label: 'Total Volume',       value: '24,380 kg',    change: '+8%' },
          { icon: Award,      color: '#F59E0B', label: 'Personal Records',   value: '12 PRs',       change: '+2 this month' },
          { icon: Activity,   color: '#14B8A6', label: 'Consistency',        value: '78%',          change: '+5% vs last month' },
          { icon: BarChart3,  color: '#3B82F6', label: 'Workouts',           value: '47 total',     change: '+4 this week' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="ic-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} style={{ color: s.color }} />
                <span className="text-xs font-heading font-semibold uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>
                  {s.label}
                </span>
              </div>
              <p className="font-heading font-bold text-xl mb-1" style={{ color: 'var(--ic-text-primary)' }}>{s.value}</p>
              <p className="text-xs" style={{ color: s.color }}>{s.change}</p>
            </div>
          );
        })}
      </div>

      {/* Weight Progress Chart */}
      <div className="ic-card p-5">
        <h3 className="font-heading font-bold text-lg mb-4" style={{ color: 'var(--ic-text-primary)' }}>
          Weight Progress
        </h3>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={WEIGHT_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="week" tick={{ fill: '#9CA3AF', fontSize: 11, fontFamily: 'Rajdhani' }} axisLine={false} tickLine={false} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: '#9CA3AF', fontSize: 11, fontFamily: 'Rajdhani' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, fontFamily: 'Rajdhani', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                labelStyle={{ color: 'var(--ic-text-primary)' }}
                itemStyle={{ color: '#3B82F6' }}
              />
              <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={2.5}
                dot={{ fill: '#3B82F6', r: 4 }} activeDot={{ r: 6, fill: '#2563EB' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Workout Frequency */}
      <div className="ic-card p-5">
        <h3 className="font-heading font-bold text-lg mb-4" style={{ color: 'var(--ic-text-primary)' }}>
          Weekly Frequency
        </h3>
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={FREQ_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="week" tick={{ fill: '#9CA3AF', fontSize: 11, fontFamily: 'Rajdhani' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11, fontFamily: 'Rajdhani' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, fontFamily: 'Rajdhani', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                labelStyle={{ color: 'var(--ic-text-primary)' }}
                itemStyle={{ color: '#22C55E' }}
              />
              <Bar dataKey="workouts" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Streak Calendar */}
      <div className="ic-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-lg" style={{ color: 'var(--ic-text-primary)' }}>Workout Streak</h3>
          <span
            className="text-xs font-heading font-semibold px-3 py-1 rounded-full"
            style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            🔥 7 day streak
          </span>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-0">
            {hasLoaded && streakData.map(week => (
              <div key={`week-${week[0].weekIdx}`} className="flex flex-col gap-1">
                {week.map(day => (
                  <div
                    key={`day-${day.weekIdx}-${day.dayIdx}`}
                    className={`streak-day ${day.value > 0 ? `active-${day.value}` : ''}`}
                    title={day.value > 0 ? 'Workout done' : 'Rest day'}
                    style={{ width: 12, height: 12 }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs" style={{ color: 'var(--ic-text-secondary)' }}>Less</span>
            {[0, 1, 2, 3, 4].map(v => (
              <div key={v} className={`streak-day ${v > 0 ? `active-${v}` : ''}`} style={{ width: 12, height: 12 }} />
            ))}
            <span className="text-xs" style={{ color: 'var(--ic-text-secondary)' }}>More</span>
          </div>
        </div>
      </div>

      {/* Premium blur overlay for advanced stats */}
      <div className="relative ic-card p-5 overflow-hidden">
        <div className="premium-blur">
          <h3 className="font-heading font-bold text-lg mb-4" style={{ color: 'var(--ic-text-primary)' }}>
            Advanced Analytics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {['1RM Progress', 'Muscle Volume Split', 'Recovery Score', 'Fatigue Index'].map(item => (
              <div key={item} className="ic-card-elevated p-3 rounded-xl">
                <p className="font-heading font-semibold text-sm" style={{ color: 'var(--ic-text-primary)' }}>{item}</p>
                <div className="h-16 mt-2 rounded shimmer" />
              </div>
            ))}
          </div>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl"
          style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(2px)' }}
        >
          <div className="text-center">
            <Lock size={28} className="mx-auto mb-2" style={{ color: '#3B82F6' }} />
            <p className="font-heading font-bold" style={{ color: 'var(--ic-text-primary)' }}>Premium Only</p>
            <button
              type="button"
              onClick={() => onNavigate('plans')}
              className="mt-3 px-4 py-2 rounded-lg text-sm font-heading font-bold transition-all hover:opacity-90"
              style={{ background: '#3B82F6', color: '#fff' }}
            >
              Unlock Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
