"use client";

import { ExtendedUserProfile } from "./types";
import { calculateProfileCompleteness } from "./completeness";
import { trackAnalyticsEvent } from "@/features/analytics/tracker";

const STORAGE_KEY = "jh_extended_learner_profile_v1";

export const DEFAULT_EXTENDED_PROFILE: ExtendedUserProfile = {
  id: "usr-google-demo-01",
  email: "google.user@junghyeon.vn",
  fullName: "Học viên Google",
  displayName: "junghyeon_pro",
  avatarUrl: "",
  avatarKind: "preset",
  gender: "male",
  dateOfBirth: "2000-05-15",
  nationalityCode: "VN",
  countryCode: "VN",
  provinceCode: "HN",
  uiLanguage: "vi",
  timezone: "Asia/Ho_Chi_Minh",
  phoneE164: "0988 112 233",
  phoneVerified: true,
  learningGoals: ["topik_exam", "work_in_korea"],
  targetTopikLevel: 3,
  targetExamDate: "2026-12-15",
  currentLevel: "topik-1-2",
  dailyGoalMinutes: 20,
  preferredStudyTimes: ["evening", "night"],
  translationPreference: "both",
  showRomanization: true,
  howDidYouHear: "google",
  profileVisibility: "public",
  showOnLeaderboard: true,
  showStreakPublic: true,
  profileCompleteness: 78,
  isVip: false,
  totalXp: 485,
  streakDays: 7,
  createdAt: "2026-10-01T08:00:00.000Z",
  updatedAt: new Date().toISOString(),
};

/**
 * Loads learner profile from local storage or session, with computed completeness.
 */
export function loadLearnerProfile(): ExtendedUserProfile {
  if (typeof window === "undefined") {
    return DEFAULT_EXTENDED_PROFILE;
  }

  try {
    // 1. Try extended profile
    const raw = localStorage.getItem(STORAGE_KEY);
    let profile: ExtendedUserProfile;

    if (raw) {
      profile = JSON.parse(raw);
    } else {
      // 2. Check basic user profile from AuthContext
      const basicRaw = localStorage.getItem("junghyeon_current_user");
      if (basicRaw) {
        const basic = JSON.parse(basicRaw);
        profile = {
          ...DEFAULT_EXTENDED_PROFILE,
          id: basic.id || DEFAULT_EXTENDED_PROFILE.id,
          email: basic.email || DEFAULT_EXTENDED_PROFILE.email,
          fullName: basic.fullName || DEFAULT_EXTENDED_PROFILE.fullName,
          avatarUrl: basic.avatarUrl || DEFAULT_EXTENDED_PROFILE.avatarUrl,
          isVip: basic.isVip ?? DEFAULT_EXTENDED_PROFILE.isVip,
          totalXp: basic.totalXp ?? DEFAULT_EXTENDED_PROFILE.totalXp,
          streakDays: basic.streakDays ?? DEFAULT_EXTENDED_PROFILE.streakDays,
        };
      } else {
        profile = DEFAULT_EXTENDED_PROFILE;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }

    // Always ensure completeness is freshly calculated
    const comp = calculateProfileCompleteness(profile);
    profile.profileCompleteness = comp.percent;

    return profile;
  } catch (err) {
    console.error("Error loading learner profile:", err);
    return DEFAULT_EXTENDED_PROFILE;
  }
}

/**
 * Saves profile updates with optimistic UI, logging, and events.
 */
export function saveLearnerProfile(
  updates: Partial<ExtendedUserProfile>,
  sectionId?: string
): ExtendedUserProfile {
  const current = loadLearnerProfile();
  const nextProfile: ExtendedUserProfile = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Recalculate completeness
  const comp = calculateProfileCompleteness(nextProfile);
  nextProfile.profileCompleteness = comp.percent;

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));

      // Also sync basic info to junghyeon_current_user for global navbar sync
      const basicRaw = localStorage.getItem("junghyeon_current_user");
      if (basicRaw) {
        const basic = JSON.parse(basicRaw);
        const updatedBasic = {
          ...basic,
          fullName: nextProfile.fullName,
          avatarUrl: nextProfile.avatarUrl,
        };
        localStorage.setItem("junghyeon_current_user", JSON.stringify(updatedBasic));
      }

      // Record field changes in local change log
      const logs = JSON.parse(localStorage.getItem("jh_profile_change_logs") || "[]");
      Object.keys(updates).forEach((k) => {
        const rawVal = (updates as any)[k];
        const masked = k === "avatarUrl" ? "[Ảnh đại diện mới]" : String(rawVal ?? "");
        logs.unshift({
          id: `log-${Date.now()}-${k}`,
          fieldName: k,
          fieldLabel: k,
          newValueMasked: masked,
          changedAt: new Date().toISOString(),
        });
      });
      localStorage.setItem("jh_profile_change_logs", JSON.stringify(logs.slice(0, 50)));

      // Dispatch custom event for real-time subscribers
      window.dispatchEvent(new Event("jh_profile_updated"));
      window.dispatchEvent(new Event("jh_user_updated"));

      // Emit analytics
      trackAnalyticsEvent("profile_field_saved", {
        userId: nextProfile.id,
        metadata: {
          sectionId,
          fieldsUpdated: Object.keys(updates),
          completeness: nextProfile.profileCompleteness,
        },
      });
    } catch (err) {
      console.error("Error persisting profile updates:", err);
    }
  }

  return nextProfile;
}
