import { recordAuditLog } from "@/features/audit/audit-service";
import { revalidatePath } from "next/cache";

export interface CouponItem {
  code: string;
  discountPercent: number;
  description: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

export interface AnnouncementBanner {
  id: string;
  textVi: string;
  textEn: string;
  link: string;
  isActive: boolean;
  updatedAt: string;
}

interface GlobalMarketingState {
  memoryCoupons: Map<string, CouponItem>;
  activeBanner: AnnouncementBanner;
}

const globalForMarketing = globalThis as unknown as { __jh_marketing?: GlobalMarketingState };

if (!globalForMarketing.__jh_marketing) {
  globalForMarketing.__jh_marketing = {
    memoryCoupons: new Map([
      [
        "WELCOME20",
        {
          code: "WELCOME20",
          discountPercent: 20,
          description: "Giảm 20% cho học viên mới",
          isActive: true,
          usageCount: 142,
          createdAt: new Date().toISOString(),
        },
      ],
    ]),
    activeBanner: {
      id: "banner-main",
      textVi: "🎉 Khai giảng lớp luyện thi TOPIK cấp tốc 2026 — Giảm 40% trọn đời!",
      textEn: "🎉 Rapid TOPIK Prep Cohort 2026 is Open — Save 40% Lifetime!",
      link: "/products",
      isActive: false, // Default off
      updatedAt: new Date().toISOString(),
    },
  };
}

const memoryCoupons = globalForMarketing.__jh_marketing.memoryCoupons;

function getActiveBannerRef(): AnnouncementBanner {
  return globalForMarketing.__jh_marketing!.activeBanner;
}

function setActiveBannerRef(banner: AnnouncementBanner) {
  globalForMarketing.__jh_marketing!.activeBanner = banner;
}

/**
 * Create or update a coupon
 */
export async function createCoupon(params: {
  code: string;
  discountPercent: number;
  description: string;
  actorEmail: string;
  actorRole: string;
}): Promise<CouponItem> {
  const upperCode = params.code.trim().toUpperCase();
  const coupon: CouponItem = {
    code: upperCode,
    discountPercent: params.discountPercent,
    description: params.description,
    isActive: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
  };

  memoryCoupons.set(upperCode, coupon);

  await recordAuditLog({
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    action: "coupon:create",
    entityType: "coupon",
    entityId: upperCode,
    details: { discountPercent: params.discountPercent, description: params.description },
  });

  return coupon;
}

/**
 * Toggle coupon active status (or disable)
 */
export async function toggleCoupon(params: {
  code: string;
  isActive: boolean;
  actorEmail: string;
  actorRole: string;
}): Promise<CouponItem> {
  const upperCode = params.code.trim().toUpperCase();
  const coupon = memoryCoupons.get(upperCode);
  if (!coupon) throw new Error(`Coupon '${upperCode}' not found`);

  coupon.isActive = params.isActive;
  memoryCoupons.set(upperCode, coupon);

  await recordAuditLog({
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    action: params.isActive ? "coupon:enable" : "coupon:disable",
    entityType: "coupon",
    entityId: upperCode,
    details: { isActive: params.isActive },
  });

  return coupon;
}

/**
 * Validate coupon code at checkout
 */
export function validateCoupon(code: string): { valid: boolean; discountPercent: number; message: string } {
  const upperCode = code.trim().toUpperCase();
  const coupon = memoryCoupons.get(upperCode);

  if (!coupon || !coupon.isActive) {
    return {
      valid: false,
      discountPercent: 0,
      message: "Mã giảm giá không hợp lệ hoặc đã hết hạn.",
    };
  }

  coupon.usageCount += 1;
  memoryCoupons.set(upperCode, coupon);

  return {
    valid: true,
    discountPercent: coupon.discountPercent,
    message: `Áp dụng thành công mã ${coupon.code} (Giảm ${coupon.discountPercent}%)`,
  };
}

/**
 * Set and toggle announcement banner
 */
export async function updateAnnouncementBanner(params: {
  textVi: string;
  textEn?: string;
  link?: string;
  isActive: boolean;
  actorEmail: string;
  actorRole: string;
}): Promise<AnnouncementBanner> {
  const newBanner: AnnouncementBanner = {
    id: "banner-main",
    textVi: params.textVi,
    textEn: params.textEn || params.textVi,
    link: params.link || "/products",
    isActive: params.isActive,
    updatedAt: new Date().toISOString(),
  };
  setActiveBannerRef(newBanner);

  try {
    revalidatePath("/");
    revalidatePath("/products");
  } catch {}

  await recordAuditLog({
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    action: "banner:update",
    entityType: "banner",
    entityId: "banner-main",
    details: { isActive: params.isActive, text: params.textVi },
  });

  return newBanner;
}

export function getActiveBanner(): AnnouncementBanner {
  return getActiveBannerRef();
}

export function getAllCoupons(): CouponItem[] {
  return Array.from(memoryCoupons.values());
}
