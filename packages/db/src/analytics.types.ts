export type AnalyticsEventType =
  | "lesson_started"
  | "lesson_completed"
  | "exercise_answered"
  | "card_reviewed"
  | "streak_updated"
  | "signup_completed"
  | "consultation_submitted"
  | "checkout_started"
  | "order_paid"
  | "coupon_applied"
  | "level_test_completed"
  | "content_reported"
  | "banner_clicked"
  | "search_executed"
  | "profile_viewed"
  | "profile_field_saved"
  | "avatar_changed"
  | "email_change_requested"
  | "data_export_requested"
  | "account_deletion_requested"
  | string;

export interface AnalyticsEventRecord {
  id: string;
  eventType: AnalyticsEventType;
  userId?: string | null;
  sessionId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}
