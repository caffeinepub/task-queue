import React, { useState } from 'react';
import { X, Calculator, Scale, Beef, Zap, Activity, Percent } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

const TOOLS: Tool[] = [
  { id: 'calorie', name: 'Calorie Calculator',  description: 'Calculate your daily caloric needs (TDEE) based on activity level and goals.', icon: Calculator, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  { id: 'bmi',     name: 'BMI Calculator',       description: 'Calculate your Body Mass Index and understand your weight category.',           icon: Scale,      color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  { id: 'protein', name: 'Protein Calculator',   description: 'Find your optimal daily protein intake based on weight and fitness goal.',       icon: Beef,       color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  { id: 'macros',  name: 'Macros Calculator',    description: 'Calculate your optimal macro split (protein, carbs, fat) for your goal.',        icon: Zap,        color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  { id: 'orm',     name: '1RM Calculator',       description: 'Estimate your one-rep max from any set using the Epley formula.',                icon: Activity,   color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  { id: 'bodyfat', name: 'Body Fat %',           description: 'Estimate your body fat percentage using body measurements.',                     icon: Percent,    color: '#14B8A6', bg: 'rgba(20,184,166,0.1)' },
];

const ACTIVITY_MULTIPLIERS = [
  { label: 'Sedentary',                  value: 1.2 },
  { label: 'Lightly Active (1-3/week)',  value: 1.375 },
  { label: 'Moderately Active (3-5/week)', value: 1.55 },
  { label: 'Very Active (6-7/week)',     value: 1.725 },
  { label: 'Athlete (2x/day)',           value: 1.9 },
];

const ToolsPage: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  // Shared fields
  const [weight, setWeight]     = useState(75);
  const [height, setHeight]     = useState(175);
  const [age, setAge]           = useState(25);
  const [sex, setSex]           = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState(1.55);
  const [goal, setGoal]         = useState('maintain');
  const [reps, setReps]         = useState(8);
  const [liftWeight, setLiftWeight] = useState(100);
  const [neck, setNeck]         = useState(38);
  const [waist, setWaist]       = useState(80);
  const [hips, setHips]         = useState(95);

  const calculate = (toolId: string) => {
    switch (toolId) {
      case 'calorie': {
        let bmr: number;
        if (sex === 'male') {
          bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
          bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        const tdee = bmr * activity;
        let goalCalories = tdee;
        if (goal === 'lose') goalCalories = tdee - 500;
        if (goal === 'gain') goalCalories = tdee + 300;
        setResult(`BMR: ${Math.round(bmr)} kcal/day\nTDEE (Maintenance): ${Math.round(tdee)} kcal/day\n${goal === 'lose' ? 'Fat Loss Target' : goal === 'gain' ? 'Muscle Gain Target' : 'Maintenance'}: ${Math.round(goalCalories)} kcal/day`);
        break;
      }
      case 'bmi': {
        const bmi = weight / Math.pow(height / 100, 2);
        let category = '';
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal weight';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obese';
        setResult(`BMI: ${bmi.toFixed(1)}\nCategory: ${category}`);
        break;
      }
      case 'protein': {
        let multiplier = 1.6;
        if (goal === 'gain') multiplier = 2.2;
        else if (goal === 'lose') multiplier = 1.8;
        const proteinG = weight * multiplier;
        setResult(`Daily Protein: ${Math.round(proteinG)}g (${multiplier}g/kg body weight)\nPer meal (3 meals): ${Math.round(proteinG / 3)}g`);
        break;
      }
      case 'macros': {
        const calories = goal === 'lose' ? 2000 : goal === 'gain' ? 2800 : 2400;
        const proteinCals = weight * 1.8 * 4;
        const fatCals = calories * 0.25;
        const carbCals = calories - proteinCals - fatCals;
        setResult(`Calories: ${calories} kcal/day\nProtein: ${Math.round(proteinCals / 4)}g (${Math.round(proteinCals / calories * 100)}%)\nCarbohydrates: ${Math.round(carbCals / 4)}g (${Math.round(carbCals / calories * 100)}%)\nFat: ${Math.round(fatCals / 9)}g (${Math.round(fatCals / calories * 100)}%)`);
        break;
      }
      case 'orm': {
        const orm = liftWeight * (1 + reps / 30);
        setResult(`Estimated 1RM: ${orm.toFixed(1)} kg\n85% 1RM (5x): ${(orm * 0.85).toFixed(1)} kg\n75% 1RM (8x): ${(orm * 0.75).toFixed(1)} kg\n65% 1RM (12x): ${(orm * 0.65).toFixed(1)} kg`);
        break;
      }
      case 'bodyfat': {
        let bf: number;
        if (sex === 'male') {
          bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
        } else {
          bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.22100 * Math.log10(height)) - 450;
        }
        bf = Math.max(3, Math.min(50, bf));
        let category = '';
        if (sex === 'male') {
          if (bf < 6) category = 'Essential Fat';
          else if (bf < 14) category = 'Athletic';
          else if (bf < 18) category = 'Fitness';
          else if (bf < 25) category = 'Average';
          else category = 'Obese';
        } else {
          if (bf < 14) category = 'Essential Fat';
          else if (bf < 21) category = 'Athletic';
          else if (bf < 25) category = 'Fitness';
          else if (bf < 32) category = 'Average';
          else category = 'Obese';
        }
        setResult(`Body Fat: ${bf.toFixed(1)}%\nCategory: ${category}\nLean Mass: ${(weight * (1 - bf / 100)).toFixed(1)} kg`);
        break;
      }
    }
  };

  const renderForm = (toolId: string) => {
    switch (toolId) {
      case 'calorie':
      case 'macros':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="tool-weight" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Weight (kg)</label>
                <input id="tool-weight" type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="ic-input" />
              </div>
              <div>
                <label htmlFor="tool-height" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Height (cm)</label>
                <input id="tool-height" type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="ic-input" />
              </div>
              <div>
                <label htmlFor="tool-age" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Age</label>
                <input id="tool-age" type="number" value={age} onChange={e => setAge(Number(e.target.value))} className="ic-input" />
              </div>
              <div>
                <label htmlFor="tool-sex" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Sex</label>
                <select id="tool-sex" value={sex} onChange={e => setSex(e.target.value as 'male' | 'female')} className="ic-input">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="tool-activity" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Activity Level</label>
              <select id="tool-activity" value={activity} onChange={e => setActivity(Number(e.target.value))} className="ic-input">
                {ACTIVITY_MULTIPLIERS.map(a => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="tool-goal" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Goal</label>
              <select id="tool-goal" value={goal} onChange={e => setGoal(e.target.value)} className="ic-input">
                <option value="lose">Lose Weight (−500 kcal)</option>
                <option value="maintain">Maintain</option>
                <option value="gain">Build Muscle (+300 kcal)</option>
              </select>
            </div>
          </div>
        );
      case 'bmi':
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="bmi-weight" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Weight (kg)</label>
              <input id="bmi-weight" type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="ic-input" />
            </div>
            <div>
              <label htmlFor="bmi-height" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Height (cm)</label>
              <input id="bmi-height" type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="ic-input" />
            </div>
          </div>
        );
      case 'protein':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="prot-weight" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Weight (kg)</label>
                <input id="prot-weight" type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="ic-input" />
              </div>
              <div>
                <label htmlFor="prot-goal" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Goal</label>
                <select id="prot-goal" value={goal} onChange={e => setGoal(e.target.value)} className="ic-input">
                  <option value="lose">Lose Weight</option>
                  <option value="maintain">Maintain</option>
                  <option value="gain">Build Muscle</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'orm':
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="orm-weight" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Weight Lifted (kg)</label>
              <input id="orm-weight" type="number" value={liftWeight} onChange={e => setLiftWeight(Number(e.target.value))} className="ic-input" />
            </div>
            <div>
              <label htmlFor="orm-reps" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Reps Performed</label>
              <input id="orm-reps" type="number" value={reps} onChange={e => setReps(Number(e.target.value))} className="ic-input" min={1} max={20} />
            </div>
          </div>
        );
      case 'bodyfat':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="bf-height" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Height (cm)</label>
                <input id="bf-height" type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="ic-input" />
              </div>
              <div>
                <label htmlFor="bf-sex" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Sex</label>
                <select id="bf-sex" value={sex} onChange={e => setSex(e.target.value as 'male' | 'female')} className="ic-input">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label htmlFor="bf-neck" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Neck (cm)</label>
                <input id="bf-neck" type="number" step="0.5" value={neck} onChange={e => setNeck(Number(e.target.value))} className="ic-input" />
              </div>
              <div>
                <label htmlFor="bf-waist" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Waist (cm)</label>
                <input id="bf-waist" type="number" step="0.5" value={waist} onChange={e => setWaist(Number(e.target.value))} className="ic-input" />
              </div>
              {sex === 'female' && (
                <div>
                  <label htmlFor="bf-hips" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Hips (cm)</label>
                  <input id="bf-hips" type="number" step="0.5" value={hips} onChange={e => setHips(Number(e.target.value))} className="ic-input" />
                </div>
              )}
              <div>
                <label htmlFor="bf-weight" className="block text-xs font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Weight (kg)</label>
                <input id="bf-weight" type="number" step="0.5" value={weight} onChange={e => setWeight(Number(e.target.value))} className="ic-input" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const tool = TOOLS.find(t => t.id === activeTool);

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1
          className="font-heading text-3xl font-bold mb-1"
          style={{ color: '#14B8A6' }}
        >
          Fitness Tools
        </h1>
        <p className="text-sm" style={{ color: 'var(--ic-text-secondary)' }}>
          Essential calculators to optimize your training and nutrition
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              className="ic-card p-5 card-hover cursor-pointer text-left w-full"
              onClick={() => { setActiveTool(t.id); setResult(null); }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: t.bg }}
                >
                  <Icon size={22} style={{ color: t.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-sm mb-1" style={{ color: 'var(--ic-text-primary)' }}>
                    {t.name}
                  </h3>
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--ic-text-secondary)' }}>
                    {t.description}
                  </p>
                  <span className="text-xs font-heading font-bold transition-all" style={{ color: t.color }}>
                    Try now →
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Calculator Modal */}
      {activeTool && tool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="ic-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: tool.bg }}
                >
                  <tool.icon size={18} style={{ color: tool.color }} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg" style={{ color: 'var(--ic-text-primary)' }}>{tool.name}</h3>
                </div>
              </div>
              <button type="button" onClick={() => { setActiveTool(null); setResult(null); }} aria-label="Close calculator">
                <X size={20} style={{ color: 'var(--ic-text-secondary)' }} />
              </button>
            </div>

            <div className="mb-5">
              {renderForm(activeTool)}
            </div>

            <button
              type="button"
              onClick={() => calculate(activeTool)}
              className="w-full py-3 rounded-xl font-heading font-bold text-sm transition-all hover:opacity-90 mb-4"
              style={{ background: tool.color, color: '#fff' }}
            >
              CALCULATE
            </button>

            {result && (
              <div
                className="rounded-xl p-4"
                style={{ background: `${tool.color}0f`, border: `1px solid ${tool.color}33` }}
              >
                <p className="text-xs font-heading font-semibold uppercase tracking-wide mb-2" style={{ color: tool.color }}>Result</p>
                <pre className="text-sm whitespace-pre-line font-mono" style={{ color: 'var(--ic-text-primary)' }}>
                  {result}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolsPage;
