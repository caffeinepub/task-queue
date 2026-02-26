import React, { useState } from 'react';
import { Lock, Star, Clock, Calendar, Dumbbell, ChevronRight, Zap } from 'lucide-react';

const DISCOVER_TAGS = ['Strength', 'Hypertrophy', 'Fat Loss', 'Cardio', 'Flexibility', 'Powerlifting', 'Beginner', 'Advanced', 'Home', 'Gym'];

const PROGRAMS = [
  {
    id: 'fbah',
    name: 'Full Body At Home Novice',
    description: 'Build strength and muscle with zero equipment. Perfect for beginners starting their fitness journey.',
    weeks: 8,
    duration: '45 min',
    frequency: '3x/week',
    equipment: ['Bodyweight'],
    level: 'Beginner',
    premium: false,
    gradient: 'linear-gradient(135deg, #14B8A6 0%, #0E7490 100%)',
    badge: '🏆',
  },
  {
    id: 'sb',
    name: 'Strength Builder',
    description: 'Progressive overload program to build raw strength in the big three lifts.',
    weeks: 12,
    duration: '75 min',
    frequency: '4x/week',
    equipment: ['Barbell', 'Rack', 'Bench'],
    level: 'Intermediate',
    premium: true,
    gradient: 'linear-gradient(135deg, #1E3A5F 0%, #3B82F6 100%)',
    badge: '💪',
  },
  {
    id: 'hiit',
    name: 'HIIT Cardio Burn',
    description: 'High-intensity interval training to torch calories and boost metabolic rate.',
    weeks: 6,
    duration: '30 min',
    frequency: '5x/week',
    equipment: ['Bodyweight', 'Jump Rope'],
    level: 'Intermediate',
    premium: true,
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
    badge: '🔥',
  },
  {
    id: 'pf',
    name: 'Powerlifting Foundation',
    description: 'Master the squat, bench, and deadlift with expert technique guidance.',
    weeks: 16,
    duration: '90 min',
    frequency: '4x/week',
    equipment: ['Barbell', 'Rack', 'Bench', 'Belt'],
    level: 'Advanced',
    premium: true,
    gradient: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
    badge: '🏋️',
  },
  {
    id: 'nm',
    name: 'Lean Mass Blueprint',
    description: 'Optimize body composition with a science-backed hypertrophy protocol.',
    weeks: 10,
    duration: '60 min',
    frequency: '5x/week',
    equipment: ['Dumbbells', 'Cables', 'Machines'],
    level: 'Intermediate',
    premium: true,
    gradient: 'linear-gradient(135deg, #065F46 0%, #22C55E 100%)',
    badge: '⚡',
  },
  {
    id: 'flex',
    name: 'Mobility & Flexibility',
    description: 'Improve range of motion, reduce injury risk, and enhance overall athleticism.',
    weeks: 8,
    duration: '30 min',
    frequency: '6x/week',
    equipment: ['Yoga Mat', 'Foam Roller'],
    level: 'Beginner',
    premium: false,
    gradient: 'linear-gradient(135deg, #0891B2 0%, #22D3EE 100%)',
    badge: '🧘',
  },
];

const ProgramsPage: React.FC = () => {
  const [activeTag, setActiveTag] = useState('');

  return (
    <div className="space-y-6 page-enter">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-heading" style={{ color: 'var(--ic-text-secondary)' }}>
        <span>Home</span>
        <ChevronRight size={12} />
        <span style={{ color: '#14B8A6' }}>Workout Programs</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold mb-1" style={{ color: 'var(--ic-text-primary)' }}>Programs</h1>
        <p className="text-sm" style={{ color: 'var(--ic-text-secondary)' }}>Choose your challenge and become stronger</p>
      </div>

      {/* Hero Banner — teal gradient matching screenshot */}
      <div
        className="rounded-2xl overflow-hidden relative p-6 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #0B4D4D 0%, #0D6B5E 60%, #0E7490 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #14B8A6 0, #14B8A6 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="font-heading font-bold text-sm text-white px-2.5 py-0.5 rounded-full"
              style={{ background: '#22C55E' }}
            >
              NEW
            </span>
            <span className="font-heading font-bold text-lg text-white">Workout Programs</span>
          </div>
          <p className="text-sm text-white/70 mb-4">Choose your challenge and become stronger! 💪</p>
          <button
            type="button"
            className="px-4 py-2 rounded-xl text-sm font-heading font-bold transition-all hover:bg-white/20"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}
          >
            Browse All →
          </button>
        </div>
        <div className="hidden sm:flex items-center text-7xl">🏆</div>
      </div>

      {/* Discover Tags */}
      <div className="flex flex-wrap gap-2">
        {DISCOVER_TAGS.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
            className="px-3 py-1.5 rounded-full text-xs font-heading font-semibold transition-all"
            style={{
              background: activeTag === tag ? '#3B82F6' : '#F3F4F6',
              color: activeTag === tag ? '#fff' : 'var(--ic-text-secondary)',
              border: `1px solid ${activeTag === tag ? '#3B82F6' : 'rgba(0,0,0,0.08)'}`,
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PROGRAMS.map(program => (
          <div key={program.id} className="ic-card overflow-hidden card-hover group">
            {/* Hero */}
            <div className="relative h-36 flex items-center justify-center" style={{ background: program.gradient }}>
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-heading font-semibold"
                  style={{
                    background: program.level === 'Beginner' ? 'rgba(34,197,94,0.9)' : program.level === 'Advanced' ? 'rgba(239,68,68,0.9)' : 'rgba(59,130,246,0.9)',
                    color: '#fff',
                  }}
                >
                  {program.level}
                </span>
                {program.premium && (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-heading font-semibold flex items-center gap-1"
                    style={{ background: 'rgba(245,158,11,0.9)', color: '#fff' }}
                  >
                    <Star size={10} fill="currentColor" /> Premium
                  </span>
                )}
              </div>
              {/* Lock */}
              {program.premium && (
                <div
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                >
                  <Lock size={14} style={{ color: '#fff' }} />
                </div>
              )}
              <span className="text-6xl opacity-80">{program.badge}</span>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-heading font-bold text-lg mb-1" style={{ color: 'var(--ic-text-primary)' }}>
                {program.name}
              </h3>
              <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--ic-text-secondary)' }}>
                {program.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} style={{ color: '#14B8A6' }} />
                  <span className="text-xs font-heading" style={{ color: 'var(--ic-text-secondary)' }}>{program.weeks} weeks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} style={{ color: '#14B8A6' }} />
                  <span className="text-xs font-heading" style={{ color: 'var(--ic-text-secondary)' }}>{program.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Dumbbell size={12} style={{ color: '#14B8A6' }} />
                  <span className="text-xs font-heading" style={{ color: 'var(--ic-text-secondary)' }}>{program.frequency}</span>
                </div>
              </div>

              {/* Equipment tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {program.equipment.map(eq => (
                  <span
                    key={eq}
                    className="px-2 py-0.5 rounded-full text-xs font-heading"
                    style={{ background: '#F3F4F6', color: 'var(--ic-text-secondary)', border: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    {eq}
                  </span>
                ))}
              </div>

              {/* CTA */}
              {program.premium ? (
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-heading font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}
                >
                  <Zap size={14} />
                  Unlock Program
                </button>
              ) : (
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-heading font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: '#22C55E', color: '#fff' }}
                >
                  Start Program →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramsPage;
