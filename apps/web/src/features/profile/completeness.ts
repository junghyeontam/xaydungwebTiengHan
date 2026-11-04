import { ExtendedUserProfile, CompletenessCheckItem } from "./types";

export interface CompletenessResult {
  percent: number;
  completedCount: number;
  totalChecks: number;
  items: CompletenessCheckItem[];
  nextAction?: CompletenessCheckItem;
}

export function calculateProfileCompleteness(
  profile: Partial<ExtendedUserProfile> | null | undefined
): CompletenessResult {
  const p = profile || {};

  const items: CompletenessCheckItem[] = [
    {
      id: "full_name",
      label: "Họ và tên thật",
      labelEn: "Full Name",
      percent: 20,
      completed: Boolean(p.fullName && p.fullName.trim().length >= 2),
      tabTarget: "personal",
    },
    {
      id: "display_name",
      label: "Tên hiển thị (Nickname)",
      labelEn: "Display Name (Nickname)",
      percent: 15,
      completed: Boolean(p.displayName && p.displayName.trim().length >= 3),
      tabTarget: "personal",
    },
    {
      id: "avatar",
      label: "Ảnh đại diện cá nhân",
      labelEn: "Profile Avatar",
      percent: 15,
      completed: Boolean(p.avatarUrl && p.avatarUrl.trim().length > 0),
      tabTarget: "personal",
    },
    {
      id: "phone",
      label: "Số điện thoại liên lạc",
      labelEn: "Phone Number",
      percent: 15,
      completed: Boolean(p.phoneE164 && p.phoneE164.trim().length >= 8),
      tabTarget: "account",
    },
    {
      id: "dob",
      label: "Ngày sinh nhật",
      labelEn: "Date of Birth",
      percent: 10,
      completed: Boolean(p.dateOfBirth),
      tabTarget: "personal",
    },
    {
      id: "location",
      label: "Tỉnh thành sinh sống",
      labelEn: "Province / City Location",
      percent: 10,
      completed: Boolean(p.provinceCode || (p.countryCode && p.countryCode !== "VN")),
      tabTarget: "personal",
    },
    {
      id: "learning_goals",
      label: "Mục tiêu học tập",
      labelEn: "Learning Goals",
      percent: 10,
      completed: Boolean(p.learningGoals && p.learningGoals.length > 0),
      tabTarget: "learning",
    },
    {
      id: "target_exam_date",
      label: "Ngày dự thi TOPIK",
      labelEn: "Target Exam Date",
      percent: 5,
      completed: Boolean(p.targetExamDate),
      tabTarget: "learning",
    },
  ];

  let totalPercent = 0;
  let completedCount = 0;

  for (const item of items) {
    if (item.completed) {
      totalPercent += item.percent;
      completedCount++;
    }
  }

  // Cap between 0 and 100
  const percent = Math.min(100, Math.max(0, totalPercent));
  const nextAction = items.find((i) => !i.completed);

  return {
    percent,
    completedCount,
    totalChecks: items.length,
    items,
    nextAction,
  };
}
