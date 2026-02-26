import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface OnboardingData {
    age: bigint;
    weight: number;
    height: number;
    trainingExperience: string;
    activityLevel: string;
    primaryGoal: string;
    stressLevel: string;
    userId: UserId;
    preferredWorkoutDuration: string;
    secondaryGoal: string;
    dietType: string;
    foodAllergies: string;
    mealsPerDay: bigint;
    availableDaysPerWeek: bigint;
    biologicalSex: string;
    sleepDuration: number;
}
export type UserId = Principal;
export interface WorkoutLog {
    userId: UserId;
    reps: bigint;
    sets: bigint;
    weightKg: number;
    notes: string;
    exerciseName: string;
    muscleGroup: string;
    loggedAt: Time;
}
export type Time = bigint;
export interface NotificationPreferences {
    mealReminders: boolean;
    userId: UserId;
    reminderTime: string;
    hydrationReminders: boolean;
    workoutReminders: boolean;
}
export interface LeaderboardEntry {
    displayName: string;
    userId: UserId;
    workoutCount: bigint;
    memberSince: Time;
}
export interface ProgressEntry {
    chestCm: number;
    userId: UserId;
    date: string;
    hipsCm: number;
    weightKg: number;
    notes: string;
    armsCm: number;
    waistCm: number;
}
export interface UserProfile {
    verificationCode: string;
    displayName: string;
    createdAt: Time;
    email: string;
    isVerified: boolean;
    passwordHash: string;
    lastName: string;
    hasCompletedOnboarding: boolean;
    firstName: string;
}
export interface backendInterface {
    checkEmailExists(email: string): Promise<boolean>;
    getLeaderboard(_period: string, topN: bigint): Promise<Array<LeaderboardEntry>>;
    getNotificationPreferences(): Promise<NotificationPreferences | null>;
    getOnboardingData(): Promise<OnboardingData | null>;
    getProgressEntries(): Promise<Array<ProgressEntry>>;
    getUserProfile(): Promise<UserProfile | null>;
    getWorkoutLogs(): Promise<Array<WorkoutLog>>;
    getWorkoutLogsInRange(startTime: Time, endTime: Time): Promise<Array<WorkoutLog>>;
    logWorkout(exerciseName: string, muscleGroup: string, sets: bigint, reps: bigint, weightKg: number, notes: string): Promise<boolean>;
    loginUser(email: string, passwordHash: string): Promise<boolean>;
    markUserVerified(): Promise<boolean>;
    registerUser(firstName: string, lastName: string, email: string, passwordHash: string, displayName: string): Promise<boolean>;
    saveNotificationPreferences(prefs: NotificationPreferences): Promise<boolean>;
    saveOnboardingData(data: OnboardingData): Promise<boolean>;
    saveProgressEntry(entry: ProgressEntry): Promise<boolean>;
    setVerificationCode(code: string): Promise<boolean>;
    updateOnboardingCompletion(): Promise<boolean>;
    updateUserProfile(profile: UserProfile): Promise<boolean>;
}
