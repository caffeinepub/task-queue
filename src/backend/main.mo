import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";

actor {
  // Persistent Data Structures
  let users = Map.empty<Principal, UserProfile>();
  let onboardingData = Map.empty<Principal, OnboardingData>();
  let workoutLogs = Map.empty<Principal, [WorkoutLog]>();
  let progressEntries = Map.empty<Principal, [ProgressEntry]>();
  let notificationPreferences = Map.empty<Principal, NotificationPreferences>();

  // Types
  type UserId = Principal;

  type UserProfile = {
    firstName : Text;
    lastName : Text;
    email : Text;
    passwordHash : Text;
    isVerified : Bool;
    verificationCode : Text;
    hasCompletedOnboarding : Bool;
    createdAt : Time.Time;
    displayName : Text;
  };

  type OnboardingData = {
    userId : UserId;
    height : Float;
    weight : Float;
    age : Nat;
    biologicalSex : Text;
    activityLevel : Text;
    sleepDuration : Float;
    stressLevel : Text;
    primaryGoal : Text;
    secondaryGoal : Text;
    trainingExperience : Text;
    availableDaysPerWeek : Nat;
    preferredWorkoutDuration : Text;
    dietType : Text;
    foodAllergies : Text;
    mealsPerDay : Nat;
  };

  type WorkoutLog = {
    userId : UserId;
    exerciseName : Text;
    muscleGroup : Text;
    sets : Nat;
    reps : Nat;
    weightKg : Float;
    notes : Text;
    loggedAt : Time.Time;
  };

  type ProgressEntry = {
    userId : UserId;
    date : Text;
    weightKg : Float;
    chestCm : Float;
    waistCm : Float;
    hipsCm : Float;
    armsCm : Float;
    notes : Text;
  };

  type NotificationPreferences = {
    userId : UserId;
    workoutReminders : Bool;
    mealReminders : Bool;
    hydrationReminders : Bool;
    reminderTime : Text;
  };

  type LeaderboardEntry = {
    userId : UserId;
    displayName : Text;
    workoutCount : Nat;
    memberSince : Time.Time;
  };

  public shared ({ caller }) func registerUser(firstName : Text, lastName : Text, email : Text, passwordHash : Text, displayName : Text) : async Bool {
    let userId = caller;

    switch (users.get(userId)) {
      case (?_) { false };
      case (null) {
        let newUser : UserProfile = {
          firstName;
          lastName;
          email;
          passwordHash;
          isVerified = false;
          verificationCode = "";
          hasCompletedOnboarding = false;
          createdAt = Time.now();
          displayName;
        };
        users.add(userId, newUser);
        true;
      };
    };
  };

  public shared ({ caller }) func loginUser(email : Text, passwordHash : Text) : async Bool {
    let userId = caller;
    switch (users.get(userId)) {
      case (null) { false };
      case (?user) { user.passwordHash == passwordHash };
    };
  };

  public query ({ caller }) func getUserProfile() : async ?UserProfile {
    users.get(caller);
  };

  public shared ({ caller }) func updateUserProfile(profile : UserProfile) : async Bool {
    users.add(caller, profile);
    true;
  };

  // Onboarding Data Handling
  public shared ({ caller }) func saveOnboardingData(data : OnboardingData) : async Bool {
    onboardingData.add(caller, data);
    true;
  };

  public query ({ caller }) func getOnboardingData() : async ?OnboardingData {
    onboardingData.get(caller);
  };

  // Workout Logs
  public shared ({ caller }) func logWorkout(exerciseName : Text, muscleGroup : Text, sets : Nat, reps : Nat, weightKg : Float, notes : Text) : async Bool {
    let log : WorkoutLog = {
      userId = caller;
      exerciseName;
      muscleGroup;
      sets;
      reps;
      weightKg;
      notes;
      loggedAt = Time.now();
    };

    let userLogs = switch (workoutLogs.get(caller)) {
      case (null) { [] };
      case (?logs) { logs };
    };
    workoutLogs.add(caller, userLogs.concat([log]));
    true;
  };

  public query ({ caller }) func getWorkoutLogs() : async [WorkoutLog] {
    switch (workoutLogs.get(caller)) {
      case (null) { [] };
      case (?logs) { logs };
    };
  };

  public query ({ caller }) func getWorkoutLogsInRange(startTime : Time.Time, endTime : Time.Time) : async [WorkoutLog] {
    switch (workoutLogs.get(caller)) {
      case (null) { [] };
      case (?logs) {
        logs.filter(
          func(log) {
            log.loggedAt >= startTime and log.loggedAt <= endTime
          }
        );
      };
    };
  };

  // Progress Entries
  public shared ({ caller }) func saveProgressEntry(entry : ProgressEntry) : async Bool {
    let userEntries = switch (progressEntries.get(caller)) {
      case (null) { [] };
      case (?entries) { entries };
    };
    progressEntries.add(caller, userEntries.concat([entry]));
    true;
  };

  public query ({ caller }) func getProgressEntries() : async [ProgressEntry] {
    switch (progressEntries.get(caller)) {
      case (null) { [] };
      case (?entries) { entries };
    };
  };

  // Notification Preferences
  public shared ({ caller }) func saveNotificationPreferences(prefs : NotificationPreferences) : async Bool {
    notificationPreferences.add(caller, prefs);
    true;
  };

  public query ({ caller }) func getNotificationPreferences() : async ?NotificationPreferences {
    notificationPreferences.get(caller);
  };

  // Leaderboard
  public query ({ caller }) func getLeaderboard(_period : Text, topN : Nat) : async [LeaderboardEntry] {
    let allEntries = users.toArray().map(
      func((userId, user)) {
        let workoutCount = switch (workoutLogs.get(userId)) {
          case (null) { 0 };
          case (?logs) { logs.size() };
        };
        {
          userId;
          displayName = user.displayName;
          workoutCount;
          memberSince = user.createdAt;
        };
      }
    );

    let sortedEntries = allEntries.sort(
      func(a, b) {
        Nat.compare(b.workoutCount, a.workoutCount);
      }
    );

    sortedEntries.sliceToArray(0, Nat.min(topN, sortedEntries.size()));
  };

  // Utility Functions
  public query ({ caller }) func checkEmailExists(email : Text) : async Bool {
    users.values().any(
      func(user) {
        user.email == email
      }
    );
  };

  public shared ({ caller }) func markUserVerified() : async Bool {
    switch (users.get(caller)) {
      case (null) { false };
      case (?user) {
        let updatedUser = { user with isVerified = true };
        users.add(caller, updatedUser);
        true;
      };
    };
  };

  public shared ({ caller }) func setVerificationCode(code : Text) : async Bool {
    switch (users.get(caller)) {
      case (null) { false };
      case (?user) {
        let updatedUser = { user with verificationCode = code };
        users.add(caller, updatedUser);
        true;
      };
    };
  };

  public shared ({ caller }) func updateOnboardingCompletion() : async Bool {
    switch (users.get(caller)) {
      case (null) { false };
      case (?user) {
        let updatedUser = { user with hasCompletedOnboarding = true };
        users.add(caller, updatedUser);
        true;
      };
    };
  };
};
