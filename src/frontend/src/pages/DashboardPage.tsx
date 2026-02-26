import React, { useEffect, useState, useCallback } from 'react';
import { Flame, Dumbbell, Target, Scale, ChevronRight, TrendingUp, Calendar } from 'lucide-react';
import { backend } from '../utils/backendService';
import type { WorkoutLog } from '../backend.d';

interface UserInfo {
  firstName: string;
  lastName: string;
}

type AppView = 'dashboard' | 'workouts' | 'statistics' | 'programs' | 'tools' | 'leaderboard' | 'plans' | 'settings';

interface Props {
  user: UserInfo;
  onNavigate: (view: AppView) => void;
}

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const RECENT_WORKOUTS_MOCK = [
  { name: 'Chest & Triceps', duration: '52 min', sets: 18, date: 'Today', icon: '💪' },
  { name: 'Back & Biceps',   duration: '48 min', sets: 16, date: 'Yesterday', icon: '🏋️' },
  { name: 'Legs Day',        duration: '61 min', sets: 20, date: '2 days ago', icon: '🦵' },
  { name: 'Shoulder & Core', duration: '44 min', sets: 14, date: '3 days ago', icon: '⚡' },
];

const DashboardPage: React.FC<Props> = ({ user, onNavigate }) => {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const logs = await backend.getWorkoutLogs();
      setWorkoutLogs(logs);
    } catch {
      // use mock data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalWorkouts = workoutLogs.length;
  const streak = 7;
  const weeklyGoal = 5;
  const weeklyDone = Math.min(4, totalWorkouts);

  const caloriesConsumed = useCountUp(1840);
  const caloriesGoal = 2200;
  const streakCount = useCountUp(streak);
  const weeklyCount = useCountUp(weeklyDone);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = [
    {
      icon: Flame,
      color: '#EF4444',
      bg: 'rgba(239,68,68,0.08)',
      label: "Today's Calories",
      value: `${caloriesConsumed.toLocaleString()} / ${caloriesGoal.toLocaleString()}`,
      sub: `${Math.round((caloriesConsumed / caloriesGoal) * 100)}% of goal`,
      progress: caloriesConsumed / caloriesGoal,
      progressColor: '#EF4444',
    },
    {
      icon: Dumbbell,
      color: '#22C55E',
      bg: 'rgba(34,197,94,0.08)',
      label: 'Workout Streak',
      value: `${streakCount} days`,
      sub: 'Keep it going! 🔥',
      progress: null,
      progressColor: '#22C55E',
    },
    {
      icon: Target,
      color: '#3B82F6',
      bg: 'rgba(59,130,246,0.08)',
      label: 'Weekly Workouts',
      value: `${weeklyCount} / ${weeklyGoal}`,
      sub: `${weeklyGoal - weeklyDone} more to hit your goal`,
      progress: weeklyDone / weeklyGoal,
      progressColor: '#3B82F6',
    },
    {
      icon: Scale,
      color: '#14B8A6',
      bg: 'rgba(20,184,166,0.08)',
      label: 'Current Weight',
      value: '78.5 kg',
      sub: 'Target: 75 kg',
      progress: null,
      progressColor: '#14B8A6',
    },
  ];

  return (
    <div className="space-y-6 page-enter">
      {/* Welcome */}
      <div>
        <h1 className="font-heading text-3xl font-bold mb-1" style={{ color: 'var(--ic-text-primary)' }}>
          {greeting()}, <span style={{ color: '#22C55E' }}>{user.firstName}</span> 👋
        </h1>
        <p className="text-sm" style={{ color: 'var(--ic-text-secondary)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="ic-card p-5 card-hover"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: card.bg }}
                >
                  <Icon size={18} style={{ color: card.color }} />
                </div>
                <TrendingUp size={14} style={{ color: '#22C55E' }} />
              </div>
              <p
                className="text-xs font-heading font-semibold uppercase tracking-wide mb-1"
                style={{ color: 'var(--ic-text-secondary)' }}
              >
                {card.label}
              </p>
              <p className="font-heading font-bold text-xl mb-1" style={{ color: 'var(--ic-text-primary)' }}>
                {card.value}
              </p>
              <p className="text-xs" style={{ color: 'var(--ic-text-secondary)' }}>{card.sub}</p>
              {card.progress !== null && (
                <div className="mt-3 h-1.5 rounded-full" style={{ background: '#F3F4F6' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(card.progress * 100, 100)}%`, background: card.progressColor }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-heading text-lg font-bold mb-3" style={{ color: 'var(--ic-text-primary)' }}>Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('workouts')}
            className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02] text-left"
            style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)', color: '#fff' }}
          >
            <Dumbbell size={24} />
            <div>
              <p className="font-heading font-bold text-sm">LOG WORKOUT</p>
              <p className="text-xs opacity-80">Start a new session</p>
            </div>
            <ChevronRight size={16} className="ml-auto" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('statistics')}
            className="ic-card flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02] text-left"
            style={{ color: 'var(--ic-text-primary)' }}
          >
            <TrendingUp size={24} style={{ color: '#3B82F6' }} />
            <div>
              <p className="font-heading font-bold text-sm">STATISTICS</p>
              <p className="text-xs" style={{ color: 'var(--ic-text-secondary)' }}>View progress</p>
            </div>
            <ChevronRight size={16} className="ml-auto" style={{ color: 'var(--ic-text-secondary)' }} />
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-lg font-bold" style={{ color: 'var(--ic-text-primary)' }}>Recent Workouts</h2>
          <button
            type="button"
            onClick={() => onNavigate('workouts')}
            className="text-xs font-heading font-semibold flex items-center gap-1"
            style={{ color: '#3B82F6' }}
          >
            View all <ChevronRight size={12} />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="ic-card p-4 shimmer h-16 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {RECENT_WORKOUTS_MOCK.map(workout => (
              <div key={workout.name} className="ic-card p-4 flex items-center gap-4 card-hover">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: '#F3F4F6' }}
                >
                  {workout.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-sm" style={{ color: 'var(--ic-text-primary)' }}>{workout.name}</p>
                  <p className="text-xs" style={{ color: 'var(--ic-text-secondary)' }}>
                    {workout.sets} sets · {workout.duration}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={12} style={{ color: 'var(--ic-text-secondary)' }} />
                  <span className="text-xs font-heading" style={{ color: 'var(--ic-text-secondary)' }}>{workout.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Overview */}
      <div className="ic-card p-5">
        <h2 className="font-heading text-lg font-bold mb-4" style={{ color: 'var(--ic-text-primary)' }}>This Week</h2>
        <div className="flex gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const done = i < 4;
            const today = i === 3;
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-lg flex items-end justify-center pb-2 transition-all"
                  style={{
                    background: done ? 'rgba(34,197,94,0.12)' : '#F3F4F6',
                    border: `1px solid ${today ? '#22C55E' : 'rgba(0,0,0,0.06)'}`,
                    height: done ? `${40 + Math.random() * 30}px` : '30px',
                  }}
                >
                  {done && <Dumbbell size={10} style={{ color: '#22C55E' }} />}
                </div>
                <span
                  className="text-xs font-heading"
                  style={{ color: today ? '#22C55E' : 'var(--ic-text-secondary)', fontWeight: today ? 700 : 500 }}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
