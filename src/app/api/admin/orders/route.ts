import { NextRequest, NextResponse } from "next/server";
import {
  getAllOrders,
  proposeOrderRefund,
  approveOrderRefund,
} from "@/features/sales/orders-service";
import { AdminRole } from "@/features/auth-rbac/types";
import { checkPermission } from "@/features/auth-rbac/require-permission";

export async function GET(req: NextRequest) {
  const role =
    (req.headers.get("x-admin-role") as AdminRole) ||
    (req.nextUrl.searchParams.get("role") as AdminRole) ||
    "super_admin";

  const perm = checkPermission(role, "orders", "view");
  if (!perm.authorized) {
    return NextResponse.json(
      { error: perm.error || "Forbidden", code: perm.code },
      { status: 403 }
    );
  }

  const orders = getAllOrders(role);
  return NextResponse.json({ success: true, orders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      action,
      actorEmail = "admin@junghyeon.vn",
      actorRole = "super_admin",
    } = body;

    if (action === "propose_refund") {
      const order = await proposeOrderRefund({
        orderId: body.orderId,
        proposedBy: actorEmail,
        role: actorRole as AdminRole,
        amount: Number(body.amount),
        reason: body.reason,
      });
      return NextResponse.json({ success: true, order });
    }

    if (action === "approve_refund") {
      const order = await approveOrderRefund({
        orderId: body.orderId,
        approvedBy: actorEmail,
        role: actorRole as AdminRole,
        notes: body.notes,
      });
      return NextResponse.json({ success: true, order });
    }

    return NextResponse.json(
      { error: `Unknown action: ${action}` },
      { status: 400 }
    );
  } catch (err: any) {
    const isTwoPerson = err?.message?.includes("Two-person rule");
    const isForbidden = err?.message?.includes("Forbidden") || err?.message?.includes("Permission denied");
    return NextResponse.json(
      {
        error: err?.message || "Internal error",
        code: isTwoPerson ? "TWO_PERSON_RULE_VIOLATION" : isForbidden ? "FORBIDDEN" : "ERROR",
      },
      { status: isTwoPerson || isForbidden ? 403 : 500 }
    );
  }
}
