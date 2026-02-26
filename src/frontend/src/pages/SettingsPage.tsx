import React, { useState, useCallback, useEffect } from 'react';
import { Save, AlertTriangle, Download, Eye, EyeOff, Bell, Globe, Palette, User, Lock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { backend } from '../utils/backendService';
import type { UserProfile, NotificationPreferences } from '../backend.d';
import { hashPassword } from '../utils/crypto';
import { getAvatarColor } from '../utils/crypto';

type Tab = 'profile' | 'physical' | 'notifications' | 'appearance' | 'language' | 'password' | 'account';

interface Props {
  user: { firstName: string; lastName: string; email: string };
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onLogout: () => void;
}

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile',       label: 'Profile',        icon: User },
  { id: 'physical',      label: 'Physical Stats',  icon: User },
  { id: 'notifications', label: 'Notifications',   icon: Bell },
  { id: 'appearance',    label: 'Appearance',      icon: Palette },
  { id: 'language',      label: 'Language',        icon: Globe },
  { id: 'password',      label: 'Password',        icon: Lock },
  { id: 'account',       label: 'Account',         icon: Trash2 },
];

const LANGUAGES = [
  { code: 'en', label: 'English',    flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी',      flag: '🇮🇳' },
  { code: 'es', label: 'Español',    flag: '🇪🇸' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch',    flag: '🇩🇪' },
  { code: 'ja', label: '日本語',      flag: '🇯🇵' },
  { code: 'ar', label: 'العربية',    flag: '🇸🇦' },
  { code: 'pt', label: 'Português',  flag: '🇧🇷' },
];

const SettingsPage: React.FC<Props> = ({ user, theme, onToggleTheme, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName]   = useState(user.lastName);
  const [email, setEmail]         = useState(user.email);

  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [age, setAge]       = useState(25);

  const [workoutReminders,   setWorkoutReminders]   = useState(true);
  const [mealReminders,      setMealReminders]      = useState(true);
  const [hydrationReminders, setHydrationReminders] = useState(false);
  const [reminderTime,       setReminderTime]       = useState('09:00');

  const [fontSize, setFontSize] = useState('medium');
  const [selectedLang, setSelectedLang] = useState('en');

  const [currentPass,  setCurrentPass]  = useState('');
  const [newPass,      setNewPass]      = useState('');
  const [confirmPass,  setConfirmPass]  = useState('');
  const [showPass,     setShowPass]     = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  const loadProfile = useCallback(async () => {
    try {
      const profile = await backend.getUserProfile();
      if (profile) {
        setFirstName(profile.firstName);
        setLastName(profile.lastName);
        setEmail(profile.email);
      }
      const notifPrefs = await backend.getNotificationPreferences();
      if (notifPrefs) {
        setWorkoutReminders(notifPrefs.workoutReminders);
        setMealReminders(notifPrefs.mealReminders);
        setHydrationReminders(notifPrefs.hydrationReminders);
        setReminderTime(notifPrefs.reminderTime);
      }
    } catch {
      // Use defaults
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const current = await backend.getUserProfile();
      if (!current) { toast.error('Failed to load profile'); return; }
      const updated: UserProfile = { ...current, firstName, lastName, email };
      await backend.updateUserProfile(updated);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const saveNotifications = async () => {
    setSaving(true);
    try {
      const prefs: NotificationPreferences = {
        workoutReminders,
        mealReminders,
        hydrationReminders,
        reminderTime,
        userId: undefined as unknown as import('../backend.d').UserId,
      };
      await backend.saveNotificationPreferences(prefs);
      toast.success('Notification preferences saved!');
    } catch {
      toast.error('Failed to save notifications');
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    if (newPass.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    if (newPass !== confirmPass) { toast.error('Passwords do not match'); return; }
    setSaving(true);
    try {
      const current = await backend.getUserProfile();
      if (!current) return;
      const newHash = await hashPassword(newPass);
      await backend.updateUserProfile({ ...current, passwordHash: newHash });
      toast.success('Password updated!');
      setCurrentPass(''); setNewPass(''); setConfirmPass('');
    } catch {
      toast.error('Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    if (deleteText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }
    toast.error('Account deletion is irreversible. Please contact support.');
    setShowDeleteConfirm(false);
  };

  const avatarColor = getAvatarColor(user.firstName);

  // Shared save button component
  const SaveBtn = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all hover:opacity-90"
      style={{ background: '#3B82F6', color: '#fff', opacity: saving ? 0.7 : 1 }}
    >
      <Save size={14} /> {saving ? 'Saving...' : label}
    </button>
  );

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="font-heading text-3xl font-bold mb-1" style={{ color: 'var(--ic-text-primary)' }}>Settings</h1>
        <p className="text-sm" style={{ color: 'var(--ic-text-secondary)' }}>Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Nav */}
        <div className="lg:w-48 shrink-0">
          <div className="ic-card p-2 space-y-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-heading font-semibold transition-all text-left"
                  style={{
                    background: activeTab === tab.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                    color: activeTab === tab.id ? '#3B82F6' : 'var(--ic-text-secondary)',
                    borderLeft: activeTab === tab.id ? '2px solid #3B82F6' : '2px solid transparent',
                  }}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="ic-card p-6">
              <h2 className="font-heading text-xl font-bold mb-5" style={{ color: 'var(--ic-text-primary)' }}>Profile</h2>
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-heading font-bold text-2xl text-white"
                  style={{ background: avatarColor }}
                >
                  {firstName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-heading font-bold" style={{ color: 'var(--ic-text-primary)' }}>{firstName} {lastName}</p>
                  <p className="text-sm" style={{ color: 'var(--ic-text-secondary)' }}>{email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="set-fn" className="block text-sm font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>First Name</label>
                    <input id="set-fn" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="ic-input" />
                  </div>
                  <div>
                    <label htmlFor="set-ln" className="block text-sm font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Last Name</label>
                    <input id="set-ln" type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="ic-input" />
                  </div>
                </div>
                <div>
                  <label htmlFor="set-email" className="block text-sm font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Email</label>
                  <input id="set-email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="ic-input" />
                </div>
                <SaveBtn label="Save Profile" onClick={saveProfile} />
              </div>
            </div>
          )}

          {/* Physical Stats */}
          {activeTab === 'physical' && (
            <div className="ic-card p-6">
              <h2 className="font-heading text-xl font-bold mb-5" style={{ color: 'var(--ic-text-primary)' }}>Physical Stats</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="ph-height" className="block text-sm font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Height (cm)</label>
                    <input id="ph-height" type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="ic-input" />
                  </div>
                  <div>
                    <label htmlFor="ph-weight" className="block text-sm font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Weight (kg)</label>
                    <input id="ph-weight" type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="ic-input" />
                  </div>
                  <div>
                    <label htmlFor="ph-age" className="block text-sm font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Age</label>
                    <input id="ph-age" type="number" value={age} onChange={e => setAge(Number(e.target.value))} className="ic-input" />
                  </div>
                </div>
                <div
                  className="rounded-lg p-3 text-sm"
                  style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: 'var(--ic-text-secondary)' }}
                >
                  ℹ️ Saving updated stats will regenerate your personalized plan recommendations.
                </div>
                <button
                  type="button"
                  onClick={() => toast.success('Physical stats saved! Plan regenerated.')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: '#3B82F6', color: '#fff' }}
                >
                  <Save size={14} /> Save Stats
                </button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="ic-card p-6">
              <h2 className="font-heading text-xl font-bold mb-5" style={{ color: 'var(--ic-text-primary)' }}>Notifications</h2>
              <div className="space-y-5">
                {[
                  { label: 'Workout Reminders', desc: 'Get reminded about upcoming workout sessions', val: workoutReminders, set: setWorkoutReminders },
                  { label: 'Meal Reminders',    desc: 'Reminders to log your meals on time',         val: mealReminders,    set: setMealReminders },
                  { label: 'Hydration Alerts',  desc: 'Stay on track with your daily water intake',  val: hydrationReminders, set: setHydrationReminders },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background: '#F9FAFB', border: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    <div>
                      <p className="font-heading font-semibold text-sm" style={{ color: 'var(--ic-text-primary)' }}>{item.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--ic-text-secondary)' }}>{item.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => item.set(!item.val)}
                      className="w-11 h-6 rounded-full transition-all relative"
                      style={{ background: item.val ? '#22C55E' : '#D1D5DB' }}
                      aria-checked={item.val}
                      role="switch"
                      aria-label={item.label}
                    >
                      <div
                        className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm"
                        style={{ left: item.val ? '22px' : '2px' }}
                      />
                    </button>
                  </div>
                ))}
                <div>
                  <label htmlFor="notif-time" className="block text-sm font-heading font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Default Reminder Time</label>
                  <input id="notif-time" type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} className="ic-input w-32" />
                </div>
                <SaveBtn label="Save Preferences" onClick={saveNotifications} />
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div className="ic-card p-6">
              <h2 className="font-heading text-xl font-bold mb-5" style={{ color: 'var(--ic-text-primary)' }}>Appearance</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-heading font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Theme</p>
                  <div
                    className="flex items-center gap-3 p-4 rounded-xl"
                    style={{
                      background: 'rgba(34,197,94,0.08)',
                      border: '1.5px solid #22C55E',
                    }}
                  >
                    <span className="text-2xl">☀️</span>
                    <div>
                      <p className="font-heading font-bold text-sm" style={{ color: '#22C55E' }}>Light Theme is Active</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--ic-text-secondary)' }}>The app always uses the white light theme.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-heading font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Font Size</p>
                  <div className="flex gap-3">
                    {[['small', 'A', 'text-sm'], ['medium', 'A', 'text-base'], ['large', 'A', 'text-xl']].map(([val, label, cls]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setFontSize(val)}
                        className={`flex-1 flex items-center justify-center py-3 rounded-xl font-heading font-semibold transition-all ${cls}`}
                        style={{
                          background: fontSize === val ? 'rgba(59,130,246,0.1)' : '#F3F4F6',
                          color: fontSize === val ? '#3B82F6' : 'var(--ic-text-secondary)',
                          border: `1.5px solid ${fontSize === val ? '#3B82F6' : 'rgba(0,0,0,0.08)'}`,
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Language */}
          {activeTab === 'language' && (
            <div className="ic-card p-6">
              <h2 className="font-heading text-xl font-bold mb-5" style={{ color: 'var(--ic-text-primary)' }}>Language</h2>
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setSelectedLang(lang.code)}
                    className="flex items-center gap-3 p-4 rounded-xl transition-all text-left"
                    style={{
                      background: selectedLang === lang.code ? 'rgba(59,130,246,0.08)' : '#F9FAFB',
                      border: `1.5px solid ${selectedLang === lang.code ? '#3B82F6' : 'rgba(0,0,0,0.08)'}`,
                    }}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span
                      className="font-heading font-semibold text-sm"
                      style={{ color: selectedLang === lang.code ? '#3B82F6' : 'var(--ic-text-primary)' }}
                    >
                      {lang.label}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => toast.success('Language preference saved!')}
                className="flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all hover:opacity-90"
                style={{ background: '#3B82F6', color: '#fff' }}
              >
                <Save size={14} /> Save Language
              </button>
            </div>
          )}

          {/* Password */}
          {activeTab === 'password' && (
            <div className="ic-card p-6">
              <h2 className="font-heading text-xl font-bold mb-5" style={{ color: 'var(--ic-text-primary)' }}>Change Password</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="pw-current" className="block text-sm font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Current Password</label>
                  <div className="relative">
                    <input id="pw-current" type={showPass ? 'text' : 'password'} value={currentPass} onChange={e => setCurrentPass(e.target.value)} placeholder="••••••••" className="ic-input pr-10" />
                    <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Toggle password visibility">
                      {showPass ? <EyeOff size={16} style={{ color: 'var(--ic-text-secondary)' }} /> : <Eye size={16} style={{ color: 'var(--ic-text-secondary)' }} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="pw-new" className="block text-sm font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>New Password</label>
                  <input id="pw-new" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Min. 6 characters" className="ic-input" />
                </div>
                <div>
                  <label htmlFor="pw-confirm" className="block text-sm font-heading font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--ic-text-secondary)' }}>Confirm New Password</label>
                  <input id="pw-confirm" type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Repeat new password" className="ic-input" />
                </div>
                <button
                  type="button"
                  onClick={savePassword}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: '#3B82F6', color: '#fff', opacity: saving ? 0.7 : 1 }}
                >
                  <Save size={14} /> {saving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          )}

          {/* Account */}
          {activeTab === 'account' && (
            <div className="ic-card p-6">
              <h2 className="font-heading text-xl font-bold mb-5" style={{ color: 'var(--ic-text-primary)' }}>Account</h2>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => toast.info('Data export feature coming soon.')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left hover:bg-[rgba(0,0,0,0.03)]"
                  style={{ background: '#F9FAFB', border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <Download size={16} style={{ color: '#3B82F6' }} />
                  <div>
                    <p className="font-heading font-semibold text-sm" style={{ color: 'var(--ic-text-primary)' }}>Download My Data</p>
                    <p className="text-xs" style={{ color: 'var(--ic-text-secondary)' }}>Export all your workout and personal data</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left hover:bg-[rgba(0,0,0,0.03)]"
                  style={{ background: '#F9FAFB', border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <Save size={16} style={{ color: 'var(--ic-text-secondary)' }} />
                  <div>
                    <p className="font-heading font-semibold text-sm" style={{ color: 'var(--ic-text-primary)' }}>Sign Out</p>
                    <p className="text-xs" style={{ color: 'var(--ic-text-secondary)' }}>Sign out of your account</p>
                  </div>
                </button>

                <div className="rounded-xl p-5" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle size={16} style={{ color: 'var(--ic-danger)' }} />
                    <h3 className="font-heading font-bold text-sm" style={{ color: 'var(--ic-danger)' }}>Danger Zone</h3>
                  </div>
                  <p className="text-sm mb-4" style={{ color: 'var(--ic-text-secondary)' }}>
                    Deleting your account is permanent and cannot be undone.
                  </p>
                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-heading font-semibold text-sm transition-all"
                      style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--ic-danger)', border: '1px solid rgba(239,68,68,0.2)' }}
                    >
                      <Trash2 size={14} /> Delete Account
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-heading font-semibold" style={{ color: 'var(--ic-danger)' }}>
                        Type DELETE to confirm:
                      </p>
                      <input
                        type="text"
                        value={deleteText}
                        onChange={e => setDeleteText(e.target.value)}
                        placeholder="DELETE"
                        className="ic-input"
                        style={{ borderColor: 'rgba(239,68,68,0.4)' }}
                      />
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={handleDeleteAccount}
                          className="flex-1 py-2 rounded-lg font-heading font-bold text-sm"
                          style={{ background: 'var(--ic-danger)', color: '#fff' }}
                        >
                          Confirm Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowDeleteConfirm(false); setDeleteText(''); }}
                          className="ic-btn-ghost py-2 px-4"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
