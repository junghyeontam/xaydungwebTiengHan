import { NextRequest, NextResponse } from "next/server";
import {
  createCoupon,
  toggleCoupon,
  validateCoupon,
  updateAnnouncementBanner,
  getActiveBanner,
  getAllCoupons,
} from "@/features/marketing/marketing-service";

import { checkPermission } from "@/features/auth-rbac/require-permission";
import { AdminRole } from "@/features/auth-rbac/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const code = searchParams.get("code");

  if (type === "banner") {
    return NextResponse.json({ success: true, banner: getActiveBanner() });
  }

  if (code) {
    const result = validateCoupon(code);
    return NextResponse.json(result);
  }

  return NextResponse.json({
    success: true,
    coupons: getAllCoupons(),
    banner: getActiveBanner(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, actorEmail = "marketing@junghyeon.vn", actorRole = "marketing" } = body;

    // Mutating marketing actions require marketing.manage permission
    if (["create_coupon", "toggle_coupon", "update_banner"].includes(action)) {
      const perm = checkPermission(actorRole as AdminRole, "marketing", "manage");
      if (!perm.authorized) {
        return NextResponse.json(
          { error: perm.error || "Forbidden: Role lacks marketing.manage permission", code: perm.code },
          { status: 403 }
        );
      }
    }

    switch (action) {
      case "create_coupon": {
        const coupon = await createCoupon({
          code: body.code,
          discountPercent: Number(body.discountPercent),
          description: body.description || "",
          actorEmail,
          actorRole,
        });
        return NextResponse.json({ success: true, coupon }, { status: 201 });
      }

      case "toggle_coupon": {
        const coupon = await toggleCoupon({
          code: body.code,
          isActive: Boolean(body.isActive),
          actorEmail,
          actorRole,
        });
        return NextResponse.json({ success: true, coupon });
      }

      case "validate_coupon": {
        const result = validateCoupon(body.code);
        return NextResponse.json(result);
      }

      case "update_banner": {
        const banner = await updateAnnouncementBanner({
          textVi: body.textVi,
          textEn: body.textEn,
          link: body.link,
          isActive: Boolean(body.isActive),
          actorEmail,
          actorRole,
        });
        return NextResponse.json({ success: true, banner });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
