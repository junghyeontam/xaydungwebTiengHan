export type GenderType = "male" | "female" | "other" | "undisclosed";
export type UiLanguage = "vi" | "en";
export type TranslationPreference = "vi" | "en" | "both";
export type ProfileVisibility = "public" | "friends" | "private";

export type SettingsTabId =
  | "personal"
  | "learning"
  | "account"
  | "notifications"
  | "privacy";

export interface CountryOption {
  code: string;
  nameVi: string;
  nameEn: string;
  flagEmoji: string;
  dialCode: string;
}

export interface ProvinceOption {
  code: string;
  nameVi: string;
  nameEn: string;
  region: "north" | "central" | "south";
}

export interface NotificationPreferences {
  dailyReminder: boolean;
  streakAtRisk: boolean;
  srsDueCards: boolean;
  newLessons: boolean;
  promotions: boolean;
  productNews: boolean;
  reminderTime: string; // HH:mm:ss
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:mm:ss
  quietHoursEnd: string; // HH:mm:ss
  unsubscribeMarketing: boolean;
}

export interface ProfileChangeLogItem {
  id: string;
  fieldName: string;
  fieldLabel: string;
  oldValueMasked?: string;
  newValueMasked: string;
  ipAddress?: string;
  changedAt: string;
}

export interface DataExportRequest {
  id: string;
  format: "json" | "csv";
  status: "pending" | "processing" | "completed" | "expired";
  downloadUrl?: string;
  requestedAt: string;
  completedAt?: string;
}

export interface AccountDeletionRequest {
  id: string;
  reason?: string;
  status: "scheduled" | "cancelled" | "completed";
  requestedAt: string;
  scheduledFor: string;
  cancelledAt?: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface CompletenessCheckItem {
  id: string;
  label: string;
  labelEn: string;
  percent: number;
  completed: boolean;
  tabTarget: SettingsTabId;
}

export interface ExtendedUserProfile {
  id: string;
  email: string;
  fullName: string;
  displayName?: string;
  avatarUrl?: string;
  avatarKind?: "upload" | "preset";
  gender: GenderType;
  dateOfBirth?: string; // YYYY-MM-DD
  nationalityCode: string;
  countryCode: string;
  provinceCode?: string;
  uiLanguage: UiLanguage;
  timezone: string;
  phoneE164?: string;
  phoneVerified: boolean;
  learningGoals: string[];
  targetTopikLevel: number;
  targetExamDate?: string;
  currentLevel: string;
  dailyGoalMinutes: number;
  preferredStudyTimes: string[];
  translationPreference: TranslationPreference;
  showRomanization: boolean;
  howDidYouHear?: string;
  profileVisibility: ProfileVisibility;
  showOnLeaderboard: boolean;
  showStreakPublic: boolean;
  profileCompleteness: number;
  isVip: boolean;
  totalXp: number;
  streakDays: number;
  createdAt: string;
  updatedAt: string;
  deletionRequestedAt?: string;
}
