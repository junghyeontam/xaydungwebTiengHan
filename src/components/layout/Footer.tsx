"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { BRAND_CONFIG } from "@/config/brand";
import { useI18n } from "@/lib/i18n/I18nContext";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export function Footer() {
  const { locale, t } = useI18n();
  const isEn = locale === "en";

  return (
    <footer className="w-full bg-brand-surface border-t border-brand-border mt-24 pt-16 pb-24 md:pb-16 text-brand-body transition-colors">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Top Section: Brand & 4 Nav Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          {/* Column 1: Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" />
            <p className="text-sm text-brand-secondary leading-relaxed max-w-sm mt-3">
              {t("footer.aboutText") ||
                (isEn
                  ? "Standardized Korean education platform for Vietnamese learners. Structured roadmap from scratch to TOPIK 6."
                  : "Hệ thống học tiếng Hàn thông minh cho người Việt. Lộ trình khoa học từ số 0 đến TOPIK 6 với thuật toán lặp lại ngắt quãng SRS.")}
            </p>

            {/* Korean Proverb Card */}
            <div className="p-3.5 rounded-card bg-brand-bg border border-brand-border inline-flex items-center gap-2.5 max-w-md shadow-2xs">
              <span className="text-base">🌺</span>
              <p className="text-xs font-medium text-brand-body">
                <span className="font-korean font-bold text-brand-primary">시작이 반이다</span>
                {" — "}
                {isEn
                  ? "Starting is already half the journey."
                  : "Bắt đầu là đã hoàn thành một nửa chặng đường."}
              </p>
            </div>

            {/* Social Channels */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={BRAND_CONFIG.contact.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-control bg-brand-bg border border-brand-border flex items-center justify-center text-blue-600 hover:border-brand-primary hover:text-brand-primary hover:-translate-y-0.5 transition-all shadow-2xs text-xs font-bold"
                title="Facebook Tiếng Hàn JungHyeon"
              >
                FB
              </a>
              <a
                href={BRAND_CONFIG.contact.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-control bg-brand-bg border border-brand-border flex items-center justify-center text-red-600 hover:border-brand-primary hover:text-brand-primary hover:-translate-y-0.5 transition-all shadow-2xs text-xs font-bold"
                title="Youtube JungHyeon"
              >
                YT
              </a>
              <a
                href={BRAND_CONFIG.contact.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-control bg-brand-bg border border-brand-border flex items-center justify-center text-neutral-800 dark:text-neutral-200 hover:border-brand-primary hover:text-brand-primary hover:-translate-y-0.5 transition-all shadow-2xs text-xs font-bold"
                title="Tiktok JungHyeon"
              >
                TT
              </a>
              <a
                href={BRAND_CONFIG.contact.zaloUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-control bg-brand-bg border border-brand-border flex items-center justify-center text-sky-600 hover:border-brand-primary hover:text-brand-primary hover:-translate-y-0.5 transition-all shadow-2xs text-xs font-bold"
                title="Zalo Official Account"
              >
                ZL
              </a>
            </div>
          </div>

          {/* Column 2: Chương trình học */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
              {isEn ? "Curriculum" : "Chương trình học"}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/roadmap?tab=hangul" className="text-brand-secondary hover:text-brand-primary transition-colors">
                  {isEn ? "Hangul Alphabet (Beginner)" : "Bảng chữ cái Hangul (Số 0)"}
                </Link>
              </li>
              <li>
                <Link href="/roadmap?tab=topik1" className="text-brand-secondary hover:text-brand-primary transition-colors">
                  {isEn ? "Beginner Korean (TOPIK 1 - 2)" : "Tiếng Hàn Sơ cấp (TOPIK 1 - 2)"}
                </Link>
              </li>
              <li>
                <Link href="/roadmap?tab=topik3" className="text-brand-secondary hover:text-brand-primary transition-colors">
                  {isEn ? "Intermediate Korean (TOPIK 3 - 4)" : "Tiếng Hàn Trung cấp (TOPIK 3 - 4)"}
                </Link>
              </li>
              <li>
                <Link href="/roadmap?tab=topik5" className="text-brand-secondary hover:text-brand-primary transition-colors">
                  {isEn ? "Advanced Korean (TOPIK 5 - 6)" : "Tiếng Hàn Cao cấp (TOPIK 5 - 6)"}
                </Link>
              </li>
              <li>
                <Link href="/pronunciation" className="text-brand-secondary hover:text-brand-primary transition-colors">
                  {isEn ? "Seoul Standard Pronunciation" : "Luyện phát âm chuẩn Seoul"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Tiện ích & Luyện thi */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
              {isEn ? "Study Tools" : "Tiện ích & Luyện thi"}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/review" className="text-brand-secondary hover:text-brand-primary transition-colors">
                  {isEn ? "SRS Flashcard Memory Decks" : "Bộ thẻ thông minh SRS"}
                </Link>
              </li>
              <li>
                <Link href="/topik" className="text-brand-secondary hover:text-brand-primary transition-colors">
                  {isEn ? "Online TOPIK Mock Exam" : "Phòng luyện thi TOPIK"}
                </Link>
              </li>
              <li>
                <Link href="/consultation#test" className="text-brand-secondary hover:text-brand-primary transition-colors">
                  {isEn ? "Free Level Assessment" : "Kiểm tra trình độ đầu vào"}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-brand-secondary hover:text-brand-primary transition-colors">
                  {isEn ? "Premium VIP Membership" : "Hội viên trọn đời VIP"}
                </Link>
              </li>
              <li>
                <Link href="/consultation" className="text-brand-secondary hover:text-brand-primary transition-colors">
                  {isEn ? "1-on-1 Consultation" : "Đăng ký tư vấn lộ trình"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Về JungHyeon */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
              {isEn ? "About Us" : "Về JungHyeon"}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/consultation#about" className="text-brand-secondary hover:text-brand-primary transition-colors">
                  {isEn ? "Teaching Methodology" : "Phương pháp độc quyền"}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-brand-secondary hover:text-brand-primary transition-colors">
                  {isEn ? "Privacy Policy" : "Chính sách bảo mật"}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-brand-secondary hover:text-brand-primary transition-colors">
                  {isEn ? "Terms of Service" : "Điều khoản & Điều kiện"}
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-brand-secondary hover:text-brand-primary transition-colors">
                  {isEn ? "Payment & Refund Policy" : "Chính sách thanh toán"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-brand-secondary hover:text-brand-primary transition-colors">
                  {isEn ? "Support Center" : "Liên hệ hỗ trợ học viên"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Company Info & Accreditations */}
        <div className="pt-8 border-t border-brand-border/70 grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs text-brand-secondary">
          <div className="space-y-2">
            <p className="font-bold text-brand-navy text-sm">
              {isEn
                ? "JUNGHYEON VIETNAM KOREAN LANGUAGE ACADEMY"
                : "TRUNG TÂM NGOẠI NGỮ & ĐÀO TẠO TIẾNG HÀN JUNGHYEON"}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-brand-muted shrink-0" />
              <span>{BRAND_CONFIG.contact.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-brand-muted shrink-0" />
              <span>Hotline / CSKH: <strong className="text-brand-navy font-semibold">{BRAND_CONFIG.contact.hotlineDisplay}</strong></span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-brand-muted shrink-0" />
              <span>{BRAND_CONFIG.contact.email}</span>
            </p>
          </div>

          <div className="space-y-2 lg:text-right">
            <div className="flex items-center lg:justify-end gap-2 text-brand-success font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>{isEn ? "Seoul Language Standard Certified" : "Giáo trình chuẩn Viện Ngôn ngữ Seoul"}</span>
            </div>
            <p className="text-brand-muted text-[11px] leading-relaxed">
              {isEn
                ? "Licensed online education platform for foreign languages under registration."
                : "Hệ thống học trực tuyến theo tiêu chuẩn khảo thí quốc tế TOPIK."}
            </p>
            <p className="text-brand-muted text-[11px] pt-1">
              © 2026 {BRAND_CONFIG.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
