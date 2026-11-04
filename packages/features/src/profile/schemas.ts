import { z } from "zod";

// Profanity / Reserved word filter for display names
const RESERVED_DISPLAY_NAMES = new Set([
  "admin",
  "administrator",
  "junghyeon",
  "root",
  "system",
  "moderator",
  "teacher",
  "support",
  "staff",
  "official",
  "god",
]);

// 1. Personal Information Schema
export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Họ và tên tối thiểu 2 ký tự" })
    .max(60, { message: "Họ và tên tối đa 60 ký tự" })
    .regex(
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/,
      { message: "Họ và tên chỉ được chứa chữ cái và khoảng trắng" }
    ),
  displayName: z
    .string()
    .trim()
    .min(3, { message: "Tên hiển thị tối thiểu 3 ký tự" })
    .max(24, { message: "Tên hiển thị tối đa 24 ký tự" })
    .regex(/^[a-zA-Z0-9_.-]+$/, {
      message: "Tên hiển thị chỉ chứa chữ cái, chữ số, dấu gạch dưới hoặc gạch ngang",
    })
    .refine((val) => !RESERVED_DISPLAY_NAMES.has(val.toLowerCase()), {
      message: "Tên hiển thị này đã được hệ thống bảo lưu, vui lòng chọn tên khác",
    }),
  gender: z.enum(["male", "female", "other", "undisclosed"]),
  dateOfBirth: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const d = new Date(val);
        if (isNaN(d.getTime())) return false;
        const now = new Date();
        const age = now.getFullYear() - d.getFullYear();
        return age >= 8 && age <= 100;
      },
      { message: "Độ tuổi hợp lệ từ 8 đến 100 tuổi" }
    ),
  nationalityCode: z.string().min(2).max(2).default("VN"),
  countryCode: z.string().min(2).max(2).default("VN"),
  provinceCode: z.string().optional(),
  uiLanguage: z.enum(["vi", "en"]).default("vi"),
  timezone: z.string().default("Asia/Ho_Chi_Minh"),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

// 2. Contact & Account Schema
export const contactAccountSchema = z.object({
  email: z.string().email({ message: "Địa chỉ email không hợp lệ" }),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        const cleaned = val.replace(/[\s.-]/g, "");
        // Accept VN 10-11 digit format or international E.164 (+84...)
        return /^(\+84|0)(3|5|7|8|9)[0-9]{8}$/.test(cleaned);
      },
      { message: "Số điện thoại Việt Nam không hợp lệ (ví dụ: 0988 112 233 hoặc +84...)" }
    ),
});

export type ContactAccountFormValues = z.infer<typeof contactAccountSchema>;

// Email Change Request Schema
export const changeEmailSchema = z.object({
  newEmail: z.string().email({ message: "Địa chỉ email mới không hợp lệ" }),
  currentPassword: z.string().min(6, { message: "Vui lòng nhập mật khẩu xác thực" }),
});

export type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>;

// Password Change Schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, { message: "Mật khẩu hiện tại tối thiểu 6 ký tự" }),
    newPassword: z
      .string()
      .min(8, { message: "Mật khẩu mới tối thiểu 8 ký tự" })
      .regex(/[A-Z]/, { message: "Mật khẩu mới phải có ít nhất 1 chữ in hoa" })
      .regex(/[0-9]/, { message: "Mật khẩu mới phải có ít nhất 1 chữ số" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Xác nhận mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

// 3. Learning Profile Schema
export const learningProfileSchema = z.object({
  learningGoals: z
    .array(z.string())
    .min(1, { message: "Vui lòng chọn ít nhất 1 mục tiêu học tập" }),
  targetTopikLevel: z.number().int().min(1).max(6).default(3),
  targetExamDate: z.string().optional(),
  currentLevel: z.string().default("zero"),
  dailyGoalMinutes: z.number().int().refine((val) => [10, 20, 30, 45].includes(val), {
    message: "Mục tiêu học mỗi ngày là 10, 20, 30 hoặc 45 phút",
  }),
  preferredStudyTimes: z.array(z.string()).default(["evening"]),
  translationPreference: z.enum(["vi", "en", "both"]).default("both"),
  showRomanization: z.boolean().default(true),
  howDidYouHear: z.string().optional(),
});

export type LearningProfileFormValues = z.infer<typeof learningProfileSchema>;

// 4. Notifications Schema
export const notificationsSchema = z.object({
  dailyReminder: z.boolean().default(true),
  streakAtRisk: z.boolean().default(true),
  srsDueCards: z.boolean().default(true),
  newLessons: z.boolean().default(true),
  promotions: z.boolean().default(false),
  productNews: z.boolean().default(true),
  reminderTime: z.string().default("20:00"),
  quietHoursEnabled: z.boolean().default(true),
  quietHoursStart: z.string().default("22:30"),
  quietHoursEnd: z.string().default("07:00"),
  unsubscribeMarketing: z.boolean().default(false),
});

export type NotificationsFormValues = z.infer<typeof notificationsSchema>;

// 5. Privacy & Data Schema
export const privacyDataSchema = z.object({
  profileVisibility: z.enum(["public", "friends", "private"]).default("public"),
  showOnLeaderboard: z.boolean().default(true),
  showStreakPublic: z.boolean().default(true),
});

export type PrivacyDataFormValues = z.infer<typeof privacyDataSchema>;

// 6. Account Deletion Confirmation Schema
export const accountDeletionSchema = z.object({
  confirmText: z.string().refine((val) => val === "XÓA TÀI KHOẢN" || val === "DELETE ACCOUNT", {
    message: "Vui lòng gõ chính xác cụm từ 'XÓA TÀI KHOẢN' để xác nhận",
  }),
  reason: z.string().optional(),
});

export type AccountDeletionFormValues = z.infer<typeof accountDeletionSchema>;
