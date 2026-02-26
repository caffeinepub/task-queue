import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Shuffle, CheckCircle, PlayCircle, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { backend } from '../utils/backendService';

const EQUIPMENT_LIST = [
  { id: 'bodyweight', label: 'Bodyweight', icon: '💪' },
  { id: 'dumbbell',   label: 'Dumbbell',   icon: '🏋️' },
  { id: 'barbell',    label: 'Barbell',    icon: '🔩' },
  { id: 'kettlebell', label: 'Kettlebell', icon: '⚙️' },
  { id: 'band',       label: 'Band',       icon: '🎗️' },
  { id: 'plate',      label: 'Weight Plate', icon: '⭕' },
  { id: 'pullup_bar', label: 'Pull-up Bar', icon: '🔗' },
  { id: 'bench',      label: 'Bench',      icon: '🛋️' },
];

const MUSCLE_GROUPS = [
  { id: 'chest',        label: 'Chest',       x: 42, y: 28, w: 16, h: 12, side: 'front' },
  { id: 'shoulders',    label: 'Shoulders',   x: 28, y: 22, w: 10, h: 10, side: 'front' },
  { id: 'shoulders_r',  label: 'Shoulders',   x: 62, y: 22, w: 10, h: 10, side: 'front', groupId: 'shoulders' },
  { id: 'biceps',       label: 'Biceps',      x: 20, y: 35, w: 9,  h: 14, side: 'front' },
  { id: 'biceps_r',     label: 'Biceps',      x: 71, y: 35, w: 9,  h: 14, side: 'front', groupId: 'biceps' },
  { id: 'abs',          label: 'Abs',         x: 40, y: 42, w: 20, h: 16, side: 'front' },
  { id: 'quads',        label: 'Quads',       x: 34, y: 62, w: 13, h: 18, side: 'front' },
  { id: 'quads_r',      label: 'Quads',       x: 53, y: 62, w: 13, h: 18, side: 'front', groupId: 'quads' },
  { id: 'calves',       label: 'Calves',      x: 35, y: 82, w: 11, h: 12, side: 'front' },
  { id: 'calves_r',     label: 'Calves',      x: 54, y: 82, w: 11, h: 12, side: 'front', groupId: 'calves' },
  { id: 'back',         label: 'Back',        x: 32, y: 26, w: 36, h: 20, side: 'back' },
  { id: 'triceps',      label: 'Triceps',     x: 20, y: 35, w: 9,  h: 14, side: 'back' },
  { id: 'triceps_r',    label: 'Triceps',     x: 71, y: 35, w: 9,  h: 14, side: 'back', groupId: 'triceps' },
  { id: 'glutes',       label: 'Glutes',      x: 34, y: 48, w: 32, h: 14, side: 'back' },
  { id: 'hamstrings',   label: 'Hamstrings',  x: 34, y: 64, w: 13, h: 16, side: 'back' },
  { id: 'hamstrings_r', label: 'Hamstrings',  x: 53, y: 64, w: 13, h: 16, side: 'back', groupId: 'hamstrings' },
];

interface Exercise {
  id: string;
  name: string;
  muscle: string;
  sets: string;
  reps: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  youtubeId: string;
  description: string;
  rest: string;
  completed: boolean;
}

function generateExercises(muscles: string[], equipment: string[]): Exercise[] {
  const db: Exercise[] = [
    { id: 'bp', name: 'Barbell Bench Press', muscle: 'chest', sets: '4', reps: '8-10', difficulty: 'Intermediate', youtubeId: 'rT7DgCr-3pg', description: 'Classic compound movement for chest development. Keep shoulder blades retracted and feet flat.', rest: '90s', completed: false },
    { id: 'inc', name: 'Incline Dumbbell Press', muscle: 'chest', sets: '3', reps: '10-12', difficulty: 'Intermediate', youtubeId: 'jKgGMGFhvwg', description: 'Targets upper chest. Set bench to 30-45 degrees.', rest: '75s', completed: false },
    { id: 'push', name: 'Push-ups', muscle: 'chest', sets: '3', reps: '15-20', difficulty: 'Beginner', youtubeId: '0pkjOk0EiAk', description: 'Fundamental pushing movement. Keep core tight throughout.', rest: '60s', completed: false },
    { id: 'pull', name: 'Pull-ups', muscle: 'back', sets: '4', reps: '6-10', difficulty: 'Intermediate', youtubeId: 'eGo4IYlbE5g', description: 'King of back exercises. Full range of motion is key.', rest: '90s', completed: false },
    { id: 'row', name: 'Bent-over Barbell Row', muscle: 'back', sets: '4', reps: '8-10', difficulty: 'Intermediate', youtubeId: 'FWJR5Ve8bnQ', description: 'Compound movement for back thickness. Keep back neutral.', rest: '90s', completed: false },
    { id: 'dl', name: 'Romanian Deadlift', muscle: 'hamstrings', sets: '3', reps: '10-12', difficulty: 'Intermediate', youtubeId: 'JCXUYuzwNrM', description: 'Hip hinge movement targeting hamstrings and glutes.', rest: '90s', completed: false },
    { id: 'sq', name: 'Barbell Back Squat', muscle: 'quads', sets: '4', reps: '6-8', difficulty: 'Advanced', youtubeId: 'ultWZbUMPL8', description: 'King of all exercises. Compound movement for full lower body.', rest: '2min', completed: false },
    { id: 'lunges', name: 'Walking Lunges', muscle: 'quads', sets: '3', reps: '12 each', difficulty: 'Beginner', youtubeId: 'L8fvypPrzzs', description: 'Excellent unilateral leg exercise for balance and strength.', rest: '60s', completed: false },
    { id: 'curl', name: 'Barbell Bicep Curl', muscle: 'biceps', sets: '3', reps: '10-12', difficulty: 'Beginner', youtubeId: 'ykJmrZ5v0Oo', description: 'Classic bicep builder. Keep elbows fixed at your sides.', rest: '60s', completed: false },
    { id: 'hdip', name: 'Tricep Dips', muscle: 'triceps', sets: '3', reps: '12-15', difficulty: 'Beginner', youtubeId: '0326dy_-CzM', description: 'Compound movement targeting all three tricep heads.', rest: '60s', completed: false },
    { id: 'ohp', name: 'Overhead Press', muscle: 'shoulders', sets: '4', reps: '8-10', difficulty: 'Intermediate', youtubeId: '2yjwXTZQDDI', description: 'Best compound movement for shoulder development.', rest: '90s', completed: false },
    { id: 'crunch', name: 'Cable Crunch', muscle: 'abs', sets: '3', reps: '15-20', difficulty: 'Beginner', youtubeId: 'NhFB5fGPLxk', description: 'Isolating ab exercise with constant tension throughout.', rest: '45s', completed: false },
    { id: 'calf', name: 'Standing Calf Raise', muscle: 'calves', sets: '4', reps: '15-20', difficulty: 'Beginner', youtubeId: 'gwLzBJYoWlI', description: 'Essential for developing calf muscle size and strength.', rest: '45s', completed: false },
    { id: 'glute', name: 'Hip Thrust', muscle: 'glutes', sets: '4', reps: '12-15', difficulty: 'Intermediate', youtubeId: 'SEdqd1n0cvg', description: 'Most effective glute isolation exercise.', rest: '75s', completed: false },
  ];

  let selected = db.filter(e => muscles.length === 0 || muscles.includes(e.muscle) || muscles.includes(e.muscle + '_r'));
  if (selected.length === 0) selected = db.slice(0, 6);
  if (equipment.includes('bodyweight') && !equipment.includes('barbell') && !equipment.includes('dumbbell')) {
    selected = selected.filter(e => !['bp', 'row', 'sq', 'curl', 'ohp'].includes(e.id));
  }
  return selected.slice(0, 8);
}

const DISCOVER_TAGS = ['Full Body', 'Upper/Lower Split', 'Push Pull Legs', 'HIIT', 'Calisthenics', 'Powerlifting', 'Hypertrophy', 'Core Focus'];

const WorkoutsPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [expandedEx, setExpandedEx] = useState<string | null>(null);
  const [showLogModal, setShowLogModal] = useState<Exercise | null>(null);
  const [logData, setLogData] = useState({ sets: '3', reps: '10', weight: '60', notes: '' });
  const [logging, setLogging] = useState(false);

  const toggleEquip = (id: string) => {
    setSelectedEquipment(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const toggleMuscle = (id: string) => {
    const group = MUSCLE_GROUPS.find(m => m.id === id);
    const groupId = (group as { groupId?: string })?.groupId || id;
    const allInGroup = MUSCLE_GROUPS.filter(m => m.id === groupId || (m as { groupId?: string }).groupId === groupId).map(m => m.id);

    setSelectedMuscles(prev => {
      const anySelected = allInGroup.some(mid => prev.includes(mid));
      if (anySelected) return prev.filter(m => !allInGroup.includes(m));
      return [...prev, ...allInGroup.filter(mid => !prev.includes(mid))];
    });
  };

  const isMuscleSelected = (id: string) => {
    const group = MUSCLE_GROUPS.find(m => m.id === id);
    const groupId = (group as { groupId?: string })?.groupId || id;
    return selectedMuscles.includes(id) || selectedMuscles.some(s => {
      const sg = MUSCLE_GROUPS.find(m => m.id === s);
      return (sg as { groupId?: string })?.groupId === groupId || s === groupId;
    });
  };

  const goToStep3 = () => {
    const muscleNames = [...new Set(selectedMuscles.map(id => {
      const g = MUSCLE_GROUPS.find(m => m.id === id);
      return (g as { groupId?: string })?.groupId || id;
    }))];
    setExercises(generateExercises(muscleNames, selectedEquipment));
    setStep(3);
  };

  const shuffleExercise = (exId: string) => {
    setExercises(prev => {
      const idx = prev.findIndex(e => e.id === exId);
      if (idx === -1) return prev;
      const newExs = [...prev];
      const all = generateExercises([], selectedEquipment);
      const unused = all.filter(e => !prev.some(pe => pe.id === e.id));
      if (unused.length > 0) {
        newExs[idx] = { ...unused[0], completed: false };
      }
      return newExs;
    });
  };

  const toggleComplete = (exId: string) => {
    setExercises(prev => prev.map(e => e.id === exId ? { ...e, completed: !e.completed } : e));
  };

  const handleLogWorkout = async () => {
    if (!showLogModal) return;
    setLogging(true);
    try {
      await backend.logWorkout(
        showLogModal.name,
        showLogModal.muscle,
        BigInt(parseInt(logData.sets) || 3),
        BigInt(parseInt(logData.reps) || 10),
        parseFloat(logData.weight) || 0,
        logData.notes
      );
      toast.success(`${showLogModal.name} logged successfully!`);
      toggleComplete(showLogModal.id);
      setShowLogModal(null);
    } catch {
      toast.error('Failed to log workout. Please try again.');
    } finally {
      setLogging(false);
    }
  };

  const getDifficultyColor = (d: string) => {
    if (d === 'Beginner') return '#22C55E';
    if (d === 'Intermediate') return '#F59E0B';
    return '#EF4444';
  };

  // Step indicator styles
  const getStepStyle = (s: number) => {
    const done = step > s;
    const active = step === s;
    if (done) return { background: '#22C55E', color: '#fff' };
    if (active) return { background: '#3B82F6', color: '#fff' };
    return { background: '#E5E7EB', color: '#6B7280' };
  };

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="font-heading text-3xl font-bold mb-1" style={{ color: 'var(--ic-text-primary)' }}>
          Workout Builder
        </h1>
        <p className="text-sm" style={{ color: 'var(--ic-text-secondary)' }}>
          Build your perfect workout in 3 steps
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {['Equipment', 'Muscles', 'Exercises'].map((label, i) => {
          const s = i + 1;
          const done = step > s;
          const active = step === s;
          return (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-heading"
                  style={getStepStyle(s)}
                >
                  {done ? '✓' : s}
                </div>
                <span
                  className="text-sm font-heading font-semibold hidden sm:block"
                  style={{ color: active ? '#3B82F6' : done ? '#22C55E' : 'var(--ic-text-secondary)' }}
                >
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div
                  className="flex-1 h-px"
                  style={{ background: step > s ? '#22C55E' : 'var(--ic-border)' }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step 1: Equipment */}
      {step === 1 && (
        <div className="ic-card p-6">
          <h2 className="font-heading text-xl font-bold mb-2" style={{ color: 'var(--ic-text-primary)' }}>
            Select Your Equipment
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ic-text-secondary)' }}>
            Choose all available equipment (multi-select)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {EQUIPMENT_LIST.map(eq => {
              const sel = selectedEquipment.includes(eq.id);
              return (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => toggleEquip(eq.id)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all card-hover"
                  style={{
                    background: sel ? 'rgba(34,197,94,0.08)' : '#F9FAFB',
                    border: `1.5px solid ${sel ? '#22C55E' : 'rgba(0,0,0,0.08)'}`,
                  }}
                >
                  <span className="text-3xl">{eq.icon}</span>
                  <span
                    className="text-xs font-heading font-semibold text-center"
                    style={{ color: sel ? '#22C55E' : 'var(--ic-text-primary)' }}
                  >
                    {eq.label}
                  </span>
                  {sel && <div className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />}
                </button>
              );
            })}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-sm transition-all hover:opacity-90"
              style={{ background: '#3B82F6', color: '#fff' }}
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Muscles */}
      {step === 2 && (
        <div className="ic-card p-6">
          <h2 className="font-heading text-xl font-bold mb-2" style={{ color: 'var(--ic-text-primary)' }}>
            Target Muscle Groups
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ic-text-secondary)' }}>
            Click on muscle groups to select
          </p>

          <div className="flex flex-col lg:flex-row gap-8 mb-6">
            {/* Front Body */}
            <div className="flex-1">
              <p className="text-center text-xs font-heading font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Front</p>
              <div className="relative mx-auto" style={{ width: 140, height: 280 }}>
                <svg viewBox="0 0 100 200" className="w-full h-full" aria-label="Front body muscle diagram">
                  {/* Light body outline */}
                  <ellipse cx="50" cy="15" rx="12" ry="14" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
                  <line x1="38" y1="26" x2="30" y2="28" stroke="#CBD5E1" strokeWidth="1.5" />
                  <line x1="62" y1="26" x2="70" y2="28" stroke="#CBD5E1" strokeWidth="1.5" />
                  <rect x="33" y="28" width="34" height="36" rx="8" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
                  <line x1="25" y1="28" x2="18" y2="65" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="75" y1="28" x2="82" y2="65" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                  <rect x="35" y="64" width="12" height="48" rx="6" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
                  <rect x="53" y="64" width="12" height="48" rx="6" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
                  <rect x="36" y="114" width="10" height="36" rx="5" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
                  <rect x="54" y="114" width="10" height="36" rx="5" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
                  {/* Clickable muscle regions */}
                  {MUSCLE_GROUPS.filter(m => m.side === 'front').map(m => {
                    const sel = isMuscleSelected(m.id);
                    return (
                      <g
                        key={m.id}
                        role="button"
                        aria-label={`Select ${m.label}`}
                        tabIndex={0}
                        onClick={() => toggleMuscle(m.id)}
                        onKeyDown={e => e.key === 'Enter' && toggleMuscle(m.id)}
                      >
                        <rect
                          x={m.x} y={m.y} width={m.w} height={m.h} rx={3}
                          className={`muscle-region ${sel ? 'selected' : ''}`}
                          style={{
                            fill: sel ? '#3B82F6' : '#CBD5E1',
                            opacity: sel ? 0.85 : 0.7,
                          }}
                        />
                        <title>{`Select ${m.label}`}</title>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Back Body */}
            <div className="flex-1">
              <p className="text-center text-xs font-heading font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Back</p>
              <div className="relative mx-auto" style={{ width: 140, height: 280 }}>
                <svg viewBox="0 0 100 200" className="w-full h-full" aria-label="Back body muscle diagram">
                  <ellipse cx="50" cy="15" rx="12" ry="14" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
                  <rect x="33" y="28" width="34" height="36" rx="8" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
                  <line x1="25" y1="28" x2="18" y2="65" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="75" y1="28" x2="82" y2="65" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                  <rect x="35" y="64" width="12" height="48" rx="6" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
                  <rect x="53" y="64" width="12" height="48" rx="6" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
                  <rect x="36" y="114" width="10" height="36" rx="5" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
                  <rect x="54" y="114" width="10" height="36" rx="5" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
                  {MUSCLE_GROUPS.filter(m => m.side === 'back').map(m => {
                    const sel = isMuscleSelected(m.id);
                    return (
                      <g
                        key={m.id}
                        role="button"
                        aria-label={`Select ${m.label}`}
                        tabIndex={0}
                        onClick={() => toggleMuscle(m.id)}
                        onKeyDown={e => e.key === 'Enter' && toggleMuscle(m.id)}
                      >
                        <rect
                          x={m.x} y={m.y} width={m.w} height={m.h} rx={3}
                          className={`muscle-region ${sel ? 'selected' : ''}`}
                          style={{
                            fill: sel ? '#3B82F6' : '#CBD5E1',
                            opacity: sel ? 0.85 : 0.7,
                          }}
                        />
                        <title>{`Select ${m.label}`}</title>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Selected muscles list */}
            <div className="flex-1">
              <p className="text-sm font-heading font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>
                Selected ({selectedMuscles.length})
              </p>
              {selectedMuscles.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--ic-text-secondary)' }}>Click on muscles to select</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {[...new Set(selectedMuscles.map(id => {
                    const g = MUSCLE_GROUPS.find(m => m.id === id);
                    return g?.label || id;
                  }))].map(label => (
                    <span
                      key={label}
                      className="px-3 py-1 rounded-full text-xs font-heading font-semibold"
                      style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.25)' }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="ic-btn-ghost flex items-center gap-2"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              type="button"
              onClick={goToStep3}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-sm transition-all hover:opacity-90"
              style={{ background: '#3B82F6', color: '#fff' }}
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Exercises */}
      {step === 3 && (
        <div className="ic-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-heading text-xl font-bold" style={{ color: 'var(--ic-text-primary)' }}>
              Your Exercises
            </h2>
            <span
              className="text-xs font-heading font-semibold px-3 py-1 rounded-full"
              style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              {exercises.filter(e => e.completed).length}/{exercises.length} Done
            </span>
          </div>
          <p className="text-sm mb-6" style={{ color: 'var(--ic-text-secondary)' }}>
            {exercises.length} exercises based on your selection
          </p>

          <div className="space-y-3 mb-6">
            {exercises.map(ex => (
              <div
                key={ex.id}
                className="rounded-xl overflow-hidden"
                style={{
                  background: '#FFFFFF',
                  border: `1.5px solid ${ex.completed ? '#22C55E' : 'rgba(0,0,0,0.08)'}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div className="flex items-center gap-3 p-4">
                  <button
                    type="button"
                    onClick={() => toggleComplete(ex.id)}
                    aria-label={ex.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    <CheckCircle
                      size={20}
                      style={{ color: ex.completed ? '#22C55E' : '#D1D5DB' }}
                      fill={ex.completed ? '#22C55E' : 'none'}
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="font-heading font-bold text-sm"
                        style={{
                          color: ex.completed ? 'var(--ic-text-secondary)' : 'var(--ic-text-primary)',
                          textDecoration: ex.completed ? 'line-through' : 'none',
                        }}
                      >
                        {ex.name}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-heading"
                        style={{ background: `${getDifficultyColor(ex.difficulty)}18`, color: getDifficultyColor(ex.difficulty) }}
                      >
                        {ex.difficulty}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-heading capitalize"
                        style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}
                      >
                        {ex.muscle}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--ic-text-secondary)' }}>
                      {ex.sets} sets × {ex.reps} reps · Rest {ex.rest}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => shuffleExercise(ex.id)}
                      className="p-2 rounded-lg transition-colors hover:bg-[rgba(0,0,0,0.06)]"
                      title="Shuffle exercise"
                      aria-label="Shuffle exercise"
                    >
                      <Shuffle size={14} style={{ color: 'var(--ic-text-secondary)' }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedEx(expandedEx === ex.id ? null : ex.id)}
                      className="p-2 rounded-lg transition-colors hover:bg-[rgba(59,130,246,0.08)]"
                      title="Expand exercise"
                      aria-label="Expand exercise details"
                    >
                      <PlayCircle size={14} style={{ color: '#3B82F6' }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowLogModal(ex); setLogData({ sets: ex.sets, reps: ex.reps.split('-')[0], weight: '60', notes: '' }); }}
                      className="p-2 rounded-lg transition-all hover:opacity-90"
                      style={{ background: '#3B82F6', color: '#fff', borderRadius: '0.5rem' }}
                      title="Log this exercise"
                      aria-label="Log this exercise"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded view */}
                {expandedEx === ex.id && (
                  <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                    <p className="text-sm mt-3 mb-3" style={{ color: 'var(--ic-text-secondary)' }}>{ex.description}</p>
                    <div className="rounded-xl overflow-hidden" style={{ background: '#000', aspectRatio: '16/9', maxHeight: 200 }}>
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${ex.youtubeId}?modestbranding=1&rel=0`}
                        title={`${ex.name} tutorial`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Discover more tags */}
          <div className="mb-6">
            <p className="text-xs font-heading font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--ic-text-secondary)' }}>
              Discover More
            </p>
            <div className="flex flex-wrap gap-2">
              {DISCOVER_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className="px-3 py-1.5 rounded-full text-xs font-heading font-semibold transition-all hover:bg-[rgba(59,130,246,0.08)] hover:text-[#3B82F6] hover:border-[rgba(59,130,246,0.3)]"
                  style={{ background: '#F3F4F6', color: 'var(--ic-text-secondary)', border: '1px solid rgba(0,0,0,0.08)' }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="ic-btn-ghost flex items-center gap-2"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              type="button"
              onClick={() => { setStep(1); setSelectedEquipment([]); setSelectedMuscles([]); setExercises([]); }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-sm transition-all hover:opacity-90"
              style={{ background: '#22C55E', color: '#fff' }}
            >
              New Workout <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="ic-card p-6 w-full max-w-md animate-scale-in">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="font-heading text-xl font-bold" style={{ color: 'var(--ic-text-primary)' }}>Log Exercise</h3>
                <p className="text-sm mt-1" style={{ color: '#3B82F6' }}>{showLogModal.name}</p>
              </div>
              <button type="button" onClick={() => setShowLogModal(null)} aria-label="Close modal">
                <X size={20} style={{ color: 'var(--ic-text-secondary)' }} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label htmlFor="log-sets" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Sets</label>
                <input id="log-sets" type="number" value={logData.sets} onChange={e => setLogData(p => ({ ...p, sets: e.target.value }))} className="ic-input text-center" />
              </div>
              <div>
                <label htmlFor="log-reps" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Reps</label>
                <input id="log-reps" type="number" value={logData.reps} onChange={e => setLogData(p => ({ ...p, reps: e.target.value }))} className="ic-input text-center" />
              </div>
              <div>
                <label htmlFor="log-weight" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Weight (kg)</label>
                <input id="log-weight" type="number" step="0.5" value={logData.weight} onChange={e => setLogData(p => ({ ...p, weight: e.target.value }))} className="ic-input text-center" />
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="log-notes" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Notes (optional)</label>
              <textarea
                id="log-notes"
                value={logData.notes}
                onChange={e => setLogData(p => ({ ...p, notes: e.target.value }))}
                placeholder="How did it feel?"
                rows={2}
                className="ic-input resize-none"
              />
            </div>

            <button
              type="button"
              onClick={handleLogWorkout}
              disabled={logging}
              className="w-full py-3 rounded-xl font-heading font-bold text-sm transition-all hover:opacity-90"
              style={{ background: '#3B82F6', color: '#fff', opacity: logging ? 0.7 : 1 }}
            >
              {logging ? 'Logging...' : 'LOG EXERCISE'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutsPage;
