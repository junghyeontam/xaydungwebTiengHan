"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getActiveBanner, AnnouncementBanner } from "@/features/marketing/marketing-service";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Sparkles, ArrowRight, X } from "lucide-react";

export function TopAnnouncementBanner() {
  const { locale } = useI18n();
  const [banner, setBanner] = useState<AnnouncementBanner | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const active = getActiveBanner();
    if (active && active.isActive) {
      setBanner(active);
    } else {
      setBanner(null);
    }
  }, []);

  if (!banner || !banner.isActive || dismissed) {
    return null;
  }

  const text = locale === "en" ? banner.textEn : banner.textVi;

  return (
    <div className="w-full bg-gradient-to-r from-amber-500 via-junghyeon-coral to-rose-500 text-white py-2 px-4 text-xs font-bold shadow-xs relative z-50 animate-in fade-in slide-in-from-top-1">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 text-center truncate">
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-yellow-200 animate-pulse" />
          <span className="truncate">{text}</span>
          <Link
            href={banner.link || "/products"}
            className="hidden sm:inline-flex items-center gap-1 underline underline-offset-2 hover:text-yellow-200 transition-colors shrink-0 ml-1"
          >
            <span>{locale === "en" ? "Explore details" : "Xem chi tiết ngay"}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-md hover:bg-black/10 transition-colors shrink-0"
          aria-label="Đóng thông báo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
