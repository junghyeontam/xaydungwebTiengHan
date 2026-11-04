"use client";

import React from "react";
import Link from "next/link";
import { BRAND_CONFIG } from "@junghyeon/config";
import { useI18n } from "@junghyeon/i18n";

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
      aria-label="Tiáº¿ng HÃ n JungHyeon"
    >
      <div className="flex items-center gap-1.5 leading-none">
        {/* Biá»ƒu tÆ°á»£ng JungHyeon */}
        <div className="w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center shadow-xs group-hover:rotate-6 transition-transform">
          <span className="font-korean font-bold text-sm">ì •</span>
        </div>

        {/* Chá»¯ JungHyeon kÃ¨m dáº¥u cháº¥m san hÃ´ */}
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

      {/* Chá»¯ HÃ n ì •í˜„ + Slogan nhá» */}
      {showSubtitle && (
        <div className="flex items-center gap-1.5 pl-9 mt-0.5">
          <span
            className={`font-korean font-semibold tracking-wider text-brand-primary ${koreanSizeClasses[size]}`}
          >
            {BRAND_CONFIG.koreanName}
          </span>
          <span className="text-[10px] text-brand-muted hidden sm:inline">
            â€¢ {slogan}
          </span>
        </div>
      )}
    </Link>
  );
}

