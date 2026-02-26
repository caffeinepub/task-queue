/**
 * localStorage-based backend service for IRONCLAD.
 *
 * The ICP backend uses `caller` (Principal) as the user key, but since the
 * app runs without Internet Identity every user shares the same anonymous
 * principal.  All auth / profile data is therefore stored in localStorage
 * keyed by email so each user has an isolated account.
 *
 * Non-auth data (workout logs, progress, onboarding, etc.) is also stored
 * in localStorage keyed by email so it stays per-user.
 */

import type {
  UserProfile,
  OnboardingData,
  NotificationPreferences,
  ProgressEntry,
  LeaderboardEntry,
  WorkoutLog,
} from '../backend.d';

// ─── Storage helpers ─────────────────────────────────────────────────────────

const LS_USERS_KEY = 'ironclad_users';          // Map<email, StoredUser>
const LS_SESSION_KEY = 'ironclad_session';       // currently logged-in email
const LS_ONBOARDING_KEY = 'ironclad_onboarding'; // Map<email, OnboardingData>
const LS_WORKOUTS_KEY = 'ironclad_workouts';     // Map<email, WorkoutLog[]>
const LS_PROGRESS_KEY = 'ironclad_progress';     // Map<email, ProgressEntry[]>
const LS_NOTIF_KEY = 'ironclad_notif';           // Map<email, NotificationPreferences>

interface StoredUser {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  isVerified: boolean;
  verificationCode: string;
  hasCompletedOnboarding: boolean;
  createdAt: number; // unix ms
  displayName: string;
}

function readMap<T>(key: string): Record<string, T> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeMap<T>(key: string, map: Record<string, T>): void {
  localStorage.setItem(key, JSON.stringify(map));
}

function getUsers(): Record<string, StoredUser> {
  return readMap<StoredUser>(LS_USERS_KEY);
}

function saveUsers(users: Record<string, StoredUser>): void {
  writeMap(LS_USERS_KEY, users);
}

function currentEmail(): string | null {
  return localStorage.getItem(LS_SESSION_KEY);
}

// ─── Public API (mirrors backendInterface) ────────────────────────────────────

export const backend = {
  // ── Auth ──────────────────────────────────────────────────────────────────

  checkEmailExists: async (email: string): Promise<boolean> => {
    const key = email.toLowerCase().trim();
    return key in getUsers();
  },

  registerUser: async (
    firstName: string,
    lastName: string,
    email: string,
    passwordHash: string,
    displayName: string,
  ): Promise<boolean> => {
    const key = email.toLowerCase().trim();
    const users = getUsers();
    if (key in users) return false;
    const newUser: StoredUser = {
      firstName,
      lastName,
      email: key,
      passwordHash,
      isVerified: false,
      verificationCode: '',
      hasCompletedOnboarding: false,
      createdAt: Date.now(),
      displayName,
    };
    users[key] = newUser;
    saveUsers(users);
    // Set session so subsequent calls (setVerificationCode, markUserVerified) know who we are
    localStorage.setItem(LS_SESSION_KEY, key);
    return true;
  },

  loginUser: async (email: string, passwordHash: string): Promise<boolean> => {
    const key = email.toLowerCase().trim();
    const users = getUsers();
    const user = users[key];
    if (!user) return false;
    if (user.passwordHash !== passwordHash) return false;
    // Don't set session here — caller checks isVerified first and sets session after
    localStorage.setItem(LS_SESSION_KEY, key);
    return true;
  },

  getUserProfile: async (): Promise<UserProfile | null> => {
    const email = currentEmail();
    if (!email) return null;
    const user = getUsers()[email];
    if (!user) return null;
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      passwordHash: user.passwordHash,
      isVerified: user.isVerified,
      verificationCode: user.verificationCode,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
      createdAt: BigInt(user.createdAt) * 1_000_000n, // ms → ns
      displayName: user.displayName,
    };
  },

  updateUserProfile: async (profile: UserProfile): Promise<boolean> => {
    const email = currentEmail();
    if (!email) return false;
    const users = getUsers();
    if (!(email in users)) return false;
    users[email] = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      passwordHash: profile.passwordHash,
      isVerified: profile.isVerified,
      verificationCode: profile.verificationCode,
      hasCompletedOnboarding: profile.hasCompletedOnboarding,
      createdAt: Number(profile.createdAt / 1_000_000n),
      displayName: profile.displayName,
    };
    saveUsers(users);
    return true;
  },

  markUserVerified: async (): Promise<boolean> => {
    const email = currentEmail();
    if (!email) return false;
    const users = getUsers();
    if (!(email in users)) return false;
    users[email] = { ...users[email], isVerified: true };
    saveUsers(users);
    return true;
  },

  setVerificationCode: async (code: string): Promise<boolean> => {
    const email = currentEmail();
    if (!email) return false;
    const users = getUsers();
    if (!(email in users)) return false;
    users[email] = { ...users[email], verificationCode: code };
    saveUsers(users);
    return true;
  },

  updateOnboardingCompletion: async (): Promise<boolean> => {
    const email = currentEmail();
    if (!email) return false;
    const users = getUsers();
    if (!(email in users)) return false;
    users[email] = { ...users[email], hasCompletedOnboarding: true };
    saveUsers(users);
    return true;
  },

  // ── Onboarding ────────────────────────────────────────────────────────────

  saveOnboardingData: async (data: OnboardingData): Promise<boolean> => {
    const email = currentEmail();
    if (!email) return false;
    const map = readMap<OnboardingData>(LS_ONBOARDING_KEY);
    map[email] = data;
    writeMap(LS_ONBOARDING_KEY, map);
    return true;
  },

  getOnboardingData: async (): Promise<OnboardingData | null> => {
    const email = currentEmail();
    if (!email) return null;
    const map = readMap<OnboardingData>(LS_ONBOARDING_KEY);
    return map[email] ?? null;
  },

  // ── Workout Logs ──────────────────────────────────────────────────────────

  logWorkout: async (
    exerciseName: string,
    muscleGroup: string,
    sets: bigint,
    reps: bigint,
    weightKg: number,
    notes: string,
  ): Promise<boolean> => {
    const email = currentEmail();
    if (!email) return false;
    const map = readMap<WorkoutLog[]>(LS_WORKOUTS_KEY);
    const logs: WorkoutLog[] = (map[email] as WorkoutLog[] | undefined) ?? [];
    // Serialize bigints as strings for JSON
    const entry = {
      userId: email as unknown as WorkoutLog['userId'],
      exerciseName,
      muscleGroup,
      sets: sets.toString() as unknown as bigint,
      reps: reps.toString() as unknown as bigint,
      weightKg,
      notes,
      loggedAt: BigInt(Date.now()).toString() as unknown as bigint,
    } as WorkoutLog;
    map[email] = [...logs, entry] as unknown as WorkoutLog[];
    writeMap(LS_WORKOUTS_KEY, map);
    return true;
  },

  getWorkoutLogs: async (): Promise<WorkoutLog[]> => {
    const email = currentEmail();
    if (!email) return [];
    const map = readMap<WorkoutLog[]>(LS_WORKOUTS_KEY);
    return (map[email] as WorkoutLog[] | undefined) ?? [];
  },

  getWorkoutLogsInRange: async (startTime: bigint, endTime: bigint): Promise<WorkoutLog[]> => {
    const email = currentEmail();
    if (!email) return [];
    const map = readMap<WorkoutLog[]>(LS_WORKOUTS_KEY);
    const logs: WorkoutLog[] = (map[email] as WorkoutLog[] | undefined) ?? [];
    return logs.filter(l => {
      const t = BigInt(String(l.loggedAt));
      return t >= startTime && t <= endTime;
    });
  },

  // ── Progress Entries ──────────────────────────────────────────────────────

  saveProgressEntry: async (entry: ProgressEntry): Promise<boolean> => {
    const email = currentEmail();
    if (!email) return false;
    const map = readMap<ProgressEntry[]>(LS_PROGRESS_KEY);
    const entries: ProgressEntry[] = (map[email] as ProgressEntry[] | undefined) ?? [];
    map[email] = [...entries, entry] as unknown as ProgressEntry[];
    writeMap(LS_PROGRESS_KEY, map);
    return true;
  },

  getProgressEntries: async (): Promise<ProgressEntry[]> => {
    const email = currentEmail();
    if (!email) return [];
    const map = readMap<ProgressEntry[]>(LS_PROGRESS_KEY);
    return (map[email] as ProgressEntry[] | undefined) ?? [];
  },

  // ── Notification Preferences ──────────────────────────────────────────────

  saveNotificationPreferences: async (prefs: NotificationPreferences): Promise<boolean> => {
    const email = currentEmail();
    if (!email) return false;
    const map = readMap<NotificationPreferences>(LS_NOTIF_KEY);
    map[email] = prefs;
    writeMap(LS_NOTIF_KEY, map);
    return true;
  },

  getNotificationPreferences: async (): Promise<NotificationPreferences | null> => {
    const email = currentEmail();
    if (!email) return null;
    const map = readMap<NotificationPreferences>(LS_NOTIF_KEY);
    return map[email] ?? null;
  },

  // ── Leaderboard ───────────────────────────────────────────────────────────

  getLeaderboard: async (_period: string, topN: bigint): Promise<LeaderboardEntry[]> => {
    const users = getUsers();
    const workoutsMap = readMap<WorkoutLog[]>(LS_WORKOUTS_KEY);
    const entries: LeaderboardEntry[] = Object.values(users).map(user => ({
      userId: user.email as unknown as LeaderboardEntry['userId'],
      displayName: user.displayName,
      workoutCount: BigInt((workoutsMap[user.email] as WorkoutLog[] | undefined)?.length ?? 0),
      memberSince: BigInt(user.createdAt) * 1_000_000n,
    }));
    entries.sort((a, b) => Number(b.workoutCount - a.workoutCount));
    return entries.slice(0, Number(topN));
  },
};

export function clearActorCache(): void {
  // No-op — kept for API compatibility
}
