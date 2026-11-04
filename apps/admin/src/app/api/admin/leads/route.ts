import { NextRequest, NextResponse } from "next/server";
import {
  submitConsultationLead,
  submitContentReport,
  updateLeadStatus,
  deleteLead,
  getLeads,
  getContentReports,
  getAdminNotifications,
} from "@/features/crm/leads-service";
import { checkPermission } from "@/features/auth-rbac/require-permission";
import { AdminRole } from "@/features/auth-rbac/types";
import { maskEmail, maskPhone, maskName } from "@/lib/utils/masking";
import { recordAuditLog } from "@/features/audit/audit-service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const role =
    (req.cookies.get("jh_admin_role")?.value as AdminRole) ||
    (req.headers.get("x-admin-role") as AdminRole) ||
    (searchParams.get("role") as AdminRole) ||
    "super_admin";
  const actorEmail = req.headers.get("x-admin-email") || "admin@junghyeon.vn";

  if (type === "notifications") {
    return NextResponse.json({ success: true, notifications: getAdminNotifications() });
  }

  if (type === "reports") {
    return NextResponse.json({ success: true, reports: getContentReports() });
  }

  // Permission check for viewing leads
  const permLeads = checkPermission(role, "leads", "view");
  if (!permLeads.authorized) {
    return NextResponse.json(
      { error: permLeads.error || "Forbidden: Role lacks leads.view", code: permLeads.code },
      { status: 403 }
    );
  }

  const canViewPii = checkPermission(role, "learners", "view_pii").authorized;
  const rawLeads = getLeads();

  // If user can view PII and explicitly unmasked, log an audit entry
  if (canViewPii && searchParams.get("unmasked") === "true") {
    await recordAuditLog({
      actorEmail,
      actorRole: role,
      action: "leads:view_pii_unmasked",
      entityType: "leads",
      entityId: "all",
      details: { recordCount: rawLeads.length },
    });
  }

  const processedLeads = rawLeads.map((lead) => ({
    ...lead,
    fullName: canViewPii ? lead.fullName : maskName(lead.fullName),
    phone: canViewPii ? lead.phone : maskPhone(lead.phone),
    email: canViewPii ? lead.email : maskEmail(lead.email),
  }));

  return NextResponse.json({
    success: true,
    leads: processedLeads,
    reports: getContentReports(),
    notifications: getAdminNotifications(),
    isPiiMasked: !canViewPii,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "submit_lead") {
      const lead = await submitConsultationLead({
        fullName: body.fullName,
        phone: body.phone,
        email: body.email,
        goal: body.goal,
        source: body.source,
      });
      return NextResponse.json({ success: true, lead }, { status: 201 });
    }

    if (action === "submit_report") {
      const report = await submitContentReport({
        userEmail: body.userEmail,
        lessonId: body.lessonId,
        contextText: body.contextText,
        issueCategory: body.issueCategory || "other",
        description: body.description,
      });
      return NextResponse.json({ success: true, report }, { status: 201 });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const role =
      (req.cookies.get("jh_admin_role")?.value as AdminRole) ||
      (req.headers.get("x-admin-role") as AdminRole) ||
      "sales_crm";
    const actorEmail = req.headers.get("x-admin-email") || "sales@junghyeon.vn";

    const perm = checkPermission(role, "leads", "manage");
    if (!perm.authorized) {
      return NextResponse.json(
        { error: perm.error || "Forbidden: Role lacks leads.manage", code: perm.code },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, status, note } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing lead id or status" }, { status: 400 });
    }

    const updated = await updateLeadStatus(id, status, note, actorEmail, role);
    if (!updated) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const role =
      (req.cookies.get("jh_admin_role")?.value as AdminRole) ||
      (req.headers.get("x-admin-role") as AdminRole) ||
      "admin";
    const actorEmail = req.headers.get("x-admin-email") || "admin@junghyeon.vn";

    const perm = checkPermission(role, "leads", "manage");
    if (!perm.authorized) {
      return NextResponse.json(
        { error: perm.error || "Forbidden: Role lacks leads.manage", code: perm.code },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing lead id" }, { status: 400 });
    }

    const success = await deleteLead(id, actorEmail, role);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
