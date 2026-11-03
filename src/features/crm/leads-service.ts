import { recordAuditLog } from "@/features/audit/audit-service";
import { getServiceSupabase } from "@/lib/supabase";

export interface ConsultationLead {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  goal: string;
  source: string;
  status: "new" | "contacted" | "enrolled" | "cancelled";
  notes?: string[];
  createdAt: string;
}

export interface ContentReportTicket {
  id: string;
  userEmail?: string;
  lessonId?: string;
  contextText?: string;
  issueCategory: "audio_error" | "typo" | "grammar_mistake" | "bug" | "other";
  description: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
  staffNotes?: string;
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  type: "lead" | "report" | "publish" | "order" | "system";
  title: string;
  description: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

interface GlobalCrmState {
  memoryLeads: ConsultationLead[];
  memoryReports: ContentReportTicket[];
  memoryNotifications: AdminNotification[];
}

const globalForCrm = globalThis as unknown as { __jh_crm?: GlobalCrmState };

if (!globalForCrm.__jh_crm) {
  globalForCrm.__jh_crm = {
    memoryLeads: [
      {
        id: "ld-seed-1",
        fullName: "Nguyễn Hải Đăng",
        phone: "0988 112 233",
        email: "haidang@gmail.com",
        goal: "Luyện thi TOPIK 4 để du học D2",
        source: "Form tư vấn nhanh",
        status: "new",
        createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      },
      {
        id: "ld-seed-2",
        fullName: "Lê Phương Thảo",
        phone: "0912 334 455",
        email: "thao.le@company.vn",
        goal: "Học từ đầu để phỏng vấn công ty Hàn",
        source: "Banner trang chủ",
        status: "new",
        createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
      },
      {
        id: "ld-seed-3",
        fullName: "Trần Minh Quân",
        phone: "0903 778 899",
        email: "quan.tran@gmail.com",
        goal: "Đi xuất khẩu lao động EPS-TOPIK",
        source: "Khảo sát lộ trình",
        status: "contacted",
        createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
      },
    ],
    memoryReports: [
      {
        id: "rep-seed-1",
        userEmail: "learner@gmail.com",
        lessonId: "beginner-1-lesson-3-ayo-eoyo-endings",
        issueCategory: "audio_error",
        description: "Âm thanh phát âm câu ví dụ 2 hơi nhỏ",
        status: "open",
        createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
      },
    ],
    memoryNotifications: [
      {
        id: "notif-seed-1",
        type: "lead",
        title: "Lead tư vấn mới",
        description: "Nguyễn Hải Đăng (0988 112 233) vừa đăng ký nhận tư vấn lộ trình du học.",
        isRead: false,
        link: "/admin/sales/leads",
        createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      },
    ],
  };
}

const memoryLeads = globalForCrm.__jh_crm.memoryLeads;
const memoryReports = globalForCrm.__jh_crm.memoryReports;
const memoryNotifications = globalForCrm.__jh_crm.memoryNotifications;

export async function submitConsultationLead(params: {
  fullName: string;
  phone: string;
  email?: string;
  goal?: string;
  source?: string;
}): Promise<ConsultationLead> {
  const lead: ConsultationLead = {
    id: `lead-${Date.now()}`,
    fullName: params.fullName,
    phone: params.phone,
    email: params.email || "",
    goal: params.goal || "du-hoc",
    source: params.source || "web_consultation",
    status: "new",
    createdAt: new Date().toISOString(),
  };

  memoryLeads.unshift(lead);

  // Push realtime notification to admin center
  memoryNotifications.unshift({
    id: `notif-${Date.now()}`,
    type: "lead",
    title: "Học viên đăng ký tư vấn mới",
    description: `${lead.fullName} (${lead.phone}) cần tư vấn: ${lead.goal}`,
    isRead: false,
    link: "/admin/sales/leads",
    createdAt: new Date().toISOString(),
  });

  await recordAuditLog({
    actorEmail: "guest@junghyeon.vn",
    actorRole: "learner",
    action: "lead:submit",
    entityType: "lead",
    entityId: lead.id,
    details: { fullName: lead.fullName, phone: lead.phone, goal: lead.goal },
  });

  return lead;
}

export async function updateLeadStatus(
  leadId: string,
  newStatus: "new" | "contacted" | "enrolled" | "cancelled",
  note?: string,
  actorEmail: string = "staff@junghyeon.vn",
  actorRole: string = "sales_crm"
): Promise<ConsultationLead | null> {
  const lead = memoryLeads.find((l) => l.id === leadId);
  if (!lead) return null;

  const oldStatus = lead.status;
  lead.status = newStatus;
  if (note) {
    lead.notes = lead.notes || [];
    lead.notes.push(`[${new Date().toLocaleTimeString("vi-VN")}] ${note}`);
  }

  await recordAuditLog({
    actorEmail,
    actorRole,
    action: "lead:update_status",
    entityType: "lead",
    entityId: lead.id,
    details: { oldStatus, newStatus, note },
  });

  return lead;
}

export async function deleteLead(
  leadId: string,
  actorEmail: string = "admin@junghyeon.vn",
  actorRole: string = "admin"
): Promise<boolean> {
  const index = memoryLeads.findIndex((l) => l.id === leadId);
  if (index === -1) return false;

  const deleted = memoryLeads.splice(index, 1)[0];

  await recordAuditLog({
    actorEmail,
    actorRole,
    action: "lead:delete",
    entityType: "lead",
    entityId: deleted.id,
    details: { fullName: deleted.fullName, phone: deleted.phone },
  });

  return true;
}

export async function submitContentReport(params: {
  userEmail?: string;
  lessonId?: string;
  contextText?: string;
  issueCategory: "audio_error" | "typo" | "grammar_mistake" | "bug" | "other";
  description: string;
}): Promise<ContentReportTicket> {
  const ticket: ContentReportTicket = {
    id: `rep-${Date.now()}`,
    userEmail: params.userEmail || "anonymous_student@junghyeon.vn",
    lessonId: params.lessonId || "general",
    contextText: params.contextText || "",
    issueCategory: params.issueCategory,
    description: params.description,
    status: "open",
    createdAt: new Date().toISOString(),
  };

  memoryReports.unshift(ticket);

  // Push notification to admin center
  memoryNotifications.unshift({
    id: `notif-${Date.now()}`,
    type: "report",
    title: "Báo lỗi nội dung bài học mới",
    description: `[${ticket.issueCategory.toUpperCase()}] ${ticket.description.substring(0, 75)}...`,
    isRead: false,
    link: "/admin/sales/leads",
    createdAt: new Date().toISOString(),
  });

  await recordAuditLog({
    actorEmail: ticket.userEmail || "anonymous",
    actorRole: "learner",
    action: "content_report:create",
    entityType: "content_report",
    entityId: ticket.id,
    details: { category: ticket.issueCategory, lessonId: ticket.lessonId },
  });

  return ticket;
}

export function getLeads(): ConsultationLead[] {
  return memoryLeads;
}

export function getContentReports(): ContentReportTicket[] {
  return memoryReports;
}

export function getAdminNotifications(): AdminNotification[] {
  return memoryNotifications;
}
