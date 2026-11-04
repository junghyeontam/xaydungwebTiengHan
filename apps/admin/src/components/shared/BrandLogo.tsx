"use client";

import React from "react";
import Link from "next/link";
import { BRAND_CONFIG } from "@/config/brand";
import { useI18n } from "@/lib/i18n/I18nContext";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  className?: string;
  href?: string;
  adminBadge?: boolean;
}

export function BrandLogo({
  size = "md",
  showSubtitle = true,
  className = "",
  href = "/",
  adminBadge = false,
}: BrandLogoProps) {
  const { locale } = useI18n();
  const slogan = locale === "en" ? BRAND_CONFIG.sloganEn : BRAND_CONFIG.sloganVi;

  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl sm:text-4xl",
  };

  const koreanSizeClasses = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <Link
      href={href}
      className={`inline-flex flex-col group transition-transform active:scale-95 ${className}`}
      aria-label="Tiếng Hàn JungHyeon"
    >
      <div className="flex items-center gap-1.5 leading-none">
        {/* Biểu tượng JungHyeon */}
        <div className="w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center shadow-xs group-hover:rotate-6 transition-transform">
          <span className="font-korean font-bold text-sm">정</span>
        </div>

        {/* Chữ JungHyeon kèm dấu chấm san hô */}
        <span
          className={`font-sans font-extrabold tracking-tight text-brand-navy ${sizeClasses[size]}`}
        >
          {BRAND_CONFIG.shortName}
          <span className="text-brand-coral inline-block transition-transform group-hover:scale-125 duration-300">
            .
          </span>
        </span>

        {adminBadge && (
          <span className="ml-1.5 px-2 py-0.5 rounded-full bg-brand-tint text-brand-primary border border-brand-frame/60 text-[10px] font-extrabold tracking-wide uppercase">
            Admin
          </span>
        )}
      </div>

      {/* Chữ Hàn 정현 + Slogan nhỏ */}
      {showSubtitle && (
        <div className="flex items-center gap-1.5 pl-9 mt-0.5">
          <span
            className={`font-korean font-semibold tracking-wider text-brand-primary ${koreanSizeClasses[size]}`}
          >
            {BRAND_CONFIG.koreanName}
          </span>
          <span className="text-[10px] text-brand-muted hidden sm:inline">
            • {slogan}
          </span>
        </div>
      )}
    </Link>
  );
}
