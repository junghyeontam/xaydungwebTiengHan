import type { AdminRole, AdminPermission } from "@junghyeon/rbac";
import type { AnalyticsEventType } from "./analytics.types";
export type { AnalyticsEventType };

export interface AdminUserSession {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  permissions: AdminPermission[];
  avatarUrl?: string;
}

export interface AdminNotification {
  id: string;
  type: "lead" | "report" | "publish" | "order" | "system";
  title: string;
  message?: string;
  description?: string;
  read?: boolean;
  isRead?: boolean;
  actionUrl?: string;
  link?: string;
  createdAt: string;
}

export type AdminNotificationItem = AdminNotification;

export interface AdminKpiSummary {
  activeLearners: number;
  activeLearnersChange: number;
  weeklyRevenue: number;
  weeklyRevenueChange: number;
  newLeadsCount: number;
  newLeadsChange: number;
  contentDraftsCount: number;
  openReportsCount: number;
}
