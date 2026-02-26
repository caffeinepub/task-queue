import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import { backend } from '../utils/backendService';
import type { OnboardingData } from '../backend.d';

interface Props {
  onComplete: () => void;
  userPrincipal?: string;
}

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise', icon: '🛋️' },
  { id: 'lightly_active', label: 'Lightly Active', desc: '1–3 days/week', icon: '🚶' },
  { id: 'moderately_active', label: 'Moderately Active', desc: '3–5 days/week', icon: '🏃' },
  { id: 'very_active', label: 'Very Active', desc: '6–7 days/week', icon: '⚡' },
  { id: 'athlete', label: 'Athlete', desc: 'Twice a day', icon: '🏆' },
];

const PRIMARY_GOALS = [
  { id: 'lose_weight', label: 'Lose Weight', icon: '⚖️' },
  { id: 'build_muscle', label: 'Build Muscle', icon: '💪' },
  { id: 'improve_endurance', label: 'Improve Endurance', icon: '🏅' },
  { id: 'maintain_fitness', label: 'Maintain Fitness', icon: '🎯' },
  { id: 'increase_flexibility', label: 'Increase Flexibility', icon: '🧘' },
];

const DIET_TYPES = ['No Restrictions', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Gluten-Free', 'Dairy-Free', 'Halal', 'Kosher'];

const OnboardingPage: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  const [age, setAge] = useState(25);
  const [sex, setSex] = useState('prefer_not_to_say');

  // Step 2
  const [activityLevel, setActivityLevel] = useState('moderately_active');
  const [sleepHours, setSleepHours] = useState(7);
  const [stressLevel, setStressLevel] = useState('medium');

  // Step 3
  const [primaryGoal, setPrimaryGoal] = useState('build_muscle');
  const [experience, setExperience] = useState('beginner');
  const [availableDays, setAvailableDays] = useState(4);
  const [workoutDuration, setWorkoutDuration] = useState('60');

  // Step 4
  const [dietTypes, setDietTypes] = useState<string[]>(['No Restrictions']);
  const [foodAllergies, setFoodAllergies] = useState('');
  const [mealsPerDay, setMealsPerDay] = useState(3);

  const totalSteps = 4;

  const toggleDiet = (d: string) => {
    if (d === 'No Restrictions') {
      setDietTypes(['No Restrictions']);
      return;
    }
    setDietTypes(prev => {
      const without = prev.filter(x => x !== 'No Restrictions');
      if (without.includes(d)) return without.filter(x => x !== d);
      return [...without, d];
    });
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const data: OnboardingData = {
        height: heightCm,
        weight: weightKg,
        age: BigInt(age),
        biologicalSex: sex,
        activityLevel,
        sleepDuration: sleepHours,
        stressLevel,
        primaryGoal,
        secondaryGoal: '',
        trainingExperience: experience,
        availableDaysPerWeek: BigInt(availableDays),
        preferredWorkoutDuration: workoutDuration,
        dietType: dietTypes.join(','),
        foodAllergies,
        mealsPerDay: BigInt(mealsPerDay),
        userId: undefined as unknown as import('../backend.d').UserId,
      };
      await backend.saveOnboardingData(data);
      await backend.updateOnboardingCompletion();
      toast.success("Let's get started!");
      onComplete();
    } catch {
      toast.error('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 page-enter" style={{ background: 'var(--ic-bg)' }}>
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/assets/uploads/Brand-1.png" alt="IRONCLAD brand logo" className="w-12 h-auto mx-auto mb-3" />
          <h1 className="font-display text-3xl tracking-widest mb-1" style={{ color: '#22C55E' }}>IRONCLAD</h1>
          <p className="text-sm font-heading" style={{ color: 'var(--ic-text-secondary)' }}>Let's set up your profile</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-heading font-semibold" style={{ color: 'var(--ic-text-secondary)' }}>
              Step {step} of {totalSteps}
            </span>
            <span className="text-xs font-mono" style={{ color: '#22C55E' }}>
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: '#E5E7EB' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%`, background: '#22C55E' }} />
          </div>
          <div className="flex justify-between mt-2">
            {['Physical Stats', 'Lifestyle', 'Fitness Goals', 'Diet'].map((label, i) => (
              <span key={label} className="text-xs font-heading"
                style={{ color: i + 1 <= step ? '#22C55E' : 'var(--ic-text-secondary)' }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="ic-card p-8">
          {/* Step 1: Physical Stats */}
          {step === 1 && (
            <div className="animate-page-enter">
              <h2 className="font-heading text-2xl font-bold mb-1" style={{ color: 'var(--ic-text-primary)' }}>Physical Stats</h2>
              <p className="text-sm mb-8" style={{ color: 'var(--ic-text-secondary)' }}>Help us personalize your experience</p>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="onb-height" className="block text-sm font-heading font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>
                      Height (cm)
                    </label>
                    <input id="onb-height" type="number" value={heightCm} onChange={e => setHeightCm(Number(e.target.value))}
                      min={100} max={250} className="ic-input" />
                    <p className="text-xs mt-1" style={{ color: 'var(--ic-text-secondary)' }}>
                      ≈ {Math.floor(heightCm / 30.48)}'{Math.round((heightCm / 2.54) % 12)}"
                    </p>
                  </div>
                  <div>
                    <label htmlFor="onb-weight" className="block text-sm font-heading font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>
                      Weight (kg)
                    </label>
                    <input id="onb-weight" type="number" value={weightKg} onChange={e => setWeightKg(Number(e.target.value))}
                      min={30} max={300} className="ic-input" />
                    <p className="text-xs mt-1" style={{ color: 'var(--ic-text-secondary)' }}>
                      ≈ {Math.round(weightKg * 2.205)} lbs
                    </p>
                  </div>
                </div>

                <div>
                  <label htmlFor="onb-age" className="block text-sm font-heading font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>
                    Age
                  </label>
                  <input id="onb-age" type="number" value={age} onChange={e => setAge(Number(e.target.value))}
                    min={13} max={100} className="ic-input w-32" />
                </div>

                <div>
                  <p className="text-sm font-heading font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>
                    Biological Sex
                  </p>
                  <div className="flex gap-3">
                    {[['male', '♂ Male'], ['female', '♀ Female'], ['prefer_not_to_say', 'Prefer not to say']].map(([val, label]) => (
                      <button type="button" key={val} onClick={() => setSex(val)}
                        className="px-4 py-2 rounded-lg text-sm font-heading font-semibold transition-all"
                        style={{
                          background: sex === val ? '#3B82F6' : '#F3F4F6',
                          color: sex === val ? '#fff' : 'var(--ic-text-secondary)',
                          border: `1px solid ${sex === val ? '#3B82F6' : 'rgba(0,0,0,0.08)'}`,
                        }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Lifestyle */}
          {step === 2 && (
            <div>
              <h2 className="font-heading text-2xl font-bold mb-1" style={{ color: 'var(--ic-text-primary)' }}>Lifestyle</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--ic-text-secondary)' }}>Tell us about your daily routine</p>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-heading font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Activity Level</p>
                  <div className="space-y-2">
                    {ACTIVITY_LEVELS.map(al => (
                      <button type="button" key={al.id} onClick={() => setActivityLevel(al.id)}
                        className="w-full flex items-center gap-4 p-3 rounded-xl transition-all"
                        style={{
                          background: activityLevel === al.id ? 'rgba(34,197,94,0.08)' : '#F9FAFB',
                          border: `1.5px solid ${activityLevel === al.id ? '#22C55E' : 'rgba(0,0,0,0.08)'}`,
                        }}>
                         <span className="text-xl">{al.icon}</span>
                         <div className="flex-1 text-left">
                           <p className="font-heading font-semibold text-sm" style={{ color: activityLevel === al.id ? '#22C55E' : 'var(--ic-text-primary)' }}>
                             {al.label}
                           </p>
                           <p className="text-xs" style={{ color: 'var(--ic-text-secondary)' }}>{al.desc}</p>
                         </div>
                         {activityLevel === al.id && <Check size={16} style={{ color: '#22C55E' }} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="sleep-slider" className="block text-sm font-heading font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>
                    Sleep Duration: <span style={{ color: '#3B82F6' }}>{sleepHours}h</span>
                  </label>
                  <input id="sleep-slider" type="range" min={4} max={10} step={0.5} value={sleepHours}
                    onChange={e => setSleepHours(Number(e.target.value))}
                    className="w-full" style={{ accentColor: '#3B82F6' }} />
                  <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--ic-text-secondary)' }}>
                    <span>4h</span><span>10h</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-heading font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Stress Level</p>
                  <div className="flex gap-3">
                    {[['low', '😌 Low'], ['medium', '😐 Medium'], ['high', '😰 High']].map(([val, label]) => (
                      <button type="button" key={val} onClick={() => setStressLevel(val)}
                        className="flex-1 py-3 rounded-xl text-sm font-heading font-semibold transition-all"
                        style={{
                          background: stressLevel === val ? 'rgba(59,130,246,0.1)' : '#F3F4F6',
                          color: stressLevel === val ? '#3B82F6' : 'var(--ic-text-secondary)',
                          border: `1.5px solid ${stressLevel === val ? '#3B82F6' : 'rgba(0,0,0,0.08)'}`,
                        }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Fitness Goals */}
          {step === 3 && (
            <div>
              <h2 className="font-heading text-2xl font-bold mb-1" style={{ color: 'var(--ic-text-primary)' }}>Fitness Goals</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--ic-text-secondary)' }}>Define what you want to achieve</p>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-heading font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Primary Goal</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {PRIMARY_GOALS.map(g => (
                      <button type="button" key={g.id} onClick={() => setPrimaryGoal(g.id)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
                        style={{
                          background: primaryGoal === g.id ? 'rgba(34,197,94,0.08)' : '#F9FAFB',
                          border: `1.5px solid ${primaryGoal === g.id ? '#22C55E' : 'rgba(0,0,0,0.08)'}`,
                        }}>
                         <span className="text-2xl">{g.icon}</span>
                         <span className="text-xs font-heading font-semibold text-center" style={{ color: primaryGoal === g.id ? '#22C55E' : 'var(--ic-text-primary)' }}>
                          {g.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-heading font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Training Experience</p>
                  <div className="flex gap-3">
                    {[['beginner', '🌱 Beginner'], ['intermediate', '⚡ Intermediate'], ['advanced', '🔥 Advanced']].map(([val, label]) => (
                      <button type="button" key={val} onClick={() => setExperience(val)}
                        className="flex-1 py-3 rounded-xl text-sm font-heading font-semibold transition-all"
                        style={{
                          background: experience === val ? 'rgba(59,130,246,0.1)' : '#F3F4F6',
                          color: experience === val ? '#3B82F6' : 'var(--ic-text-secondary)',
                          border: `1.5px solid ${experience === val ? '#3B82F6' : 'rgba(0,0,0,0.08)'}`,
                        }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-heading font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>
                     Available Days per Week: <span style={{ color: '#3B82F6' }}>{availableDays}</span>
                  </p>
                  <div className="flex gap-2">
                    {[1,2,3,4,5,6,7].map(d => (
                      <button type="button" key={d} onClick={() => setAvailableDays(d)}
                        className="w-10 h-10 rounded-full text-sm font-heading font-semibold transition-all"
                        style={{
                          background: availableDays >= d ? '#3B82F6' : '#F3F4F6',
                          color: availableDays >= d ? '#fff' : 'var(--ic-text-secondary)',
                          border: `1.5px solid ${availableDays >= d ? '#3B82F6' : 'rgba(0,0,0,0.08)'}`,
                        }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-heading font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Workout Duration</p>
                  <div className="flex gap-3">
                    {[['30', '30 min'], ['45', '45 min'], ['60', '60 min'], ['90', '90 min']].map(([val, label]) => (
                      <button type="button" key={val} onClick={() => setWorkoutDuration(val)}
                        className="flex-1 py-3 rounded-xl text-sm font-heading font-semibold transition-all"
                        style={{
                          background: workoutDuration === val ? 'rgba(34,197,94,0.08)' : '#F3F4F6',
                          color: workoutDuration === val ? '#22C55E' : 'var(--ic-text-secondary)',
                          border: `1.5px solid ${workoutDuration === val ? '#22C55E' : 'rgba(0,0,0,0.08)'}`,
                        }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Diet */}
          {step === 4 && (
            <div>
              <h2 className="font-heading text-2xl font-bold mb-1" style={{ color: 'var(--ic-text-primary)' }}>Dietary Preferences</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--ic-text-secondary)' }}>Customize your nutrition plan</p>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-heading font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Diet Type (select all that apply)</p>
                  <div className="flex flex-wrap gap-2">
                    {DIET_TYPES.map(d => (
                      <button type="button" key={d} onClick={() => toggleDiet(d)}
                        className="px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all"
                        style={{
                          background: dietTypes.includes(d) ? '#22C55E' : '#F3F4F6',
                          color: dietTypes.includes(d) ? '#fff' : 'var(--ic-text-secondary)',
                          border: `1.5px solid ${dietTypes.includes(d) ? '#22C55E' : 'rgba(0,0,0,0.08)'}`,
                        }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="onb-allergies" className="block text-sm font-heading font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>
                    Food Allergies or Intolerances
                  </label>
                  <input id="onb-allergies" type="text" value={foodAllergies} onChange={e => setFoodAllergies(e.target.value)}
                    placeholder="e.g. peanuts, shellfish, lactose..." className="ic-input" />
                </div>

                <div>
                  <p className="text-sm font-heading font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>
                     Meals per Day: <span style={{ color: '#22C55E' }}>{mealsPerDay}</span>
                  </p>
                  <div className="flex gap-2">
                    {[2,3,4,5,6].map(m => (
                      <button type="button" key={m} onClick={() => setMealsPerDay(m)}
                        className="w-12 h-12 rounded-xl text-sm font-heading font-semibold transition-all"
                        style={{
                          background: mealsPerDay === m ? '#22C55E' : '#F3F4F6',
                          color: mealsPerDay === m ? '#fff' : 'var(--ic-text-secondary)',
                          border: `1.5px solid ${mealsPerDay === m ? '#22C55E' : 'rgba(0,0,0,0.08)'}`,
                        }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 1}
              className="ic-btn-ghost flex items-center gap-2 px-6 py-3"
              style={{ opacity: step === 1 ? 0.4 : 1, cursor: step === 1 ? 'not-allowed' : 'pointer' }}>
              <ChevronLeft size={16} />
              Previous
            </button>

            {step < totalSteps ? (
              <button type="button" onClick={() => setStep(s => s + 1)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-heading font-bold text-sm transition-all hover:opacity-90"
                style={{ background: '#3B82F6', color: '#fff' }}>
                Continue
                <ChevronRight size={16} />
              </button>
            ) : (
              <button type="button" onClick={handleComplete} disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-heading font-bold text-sm transition-all hover:opacity-90"
                style={{ background: '#22C55E', color: '#fff', opacity: loading ? 0.7 : 1 }}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Complete Setup
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
