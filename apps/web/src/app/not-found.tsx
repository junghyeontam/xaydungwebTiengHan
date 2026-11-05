"use client";

import React from "react";
import Link from "next/link";
import { MascotHoney } from "@/components/ui/MascotHoney";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Home, Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-korean-pattern">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Chú hổ Honey bối rối */}
        <div className="relative inline-block">
          <div className="w-36 h-36 rounded-full bg-amber-100 dark:bg-amber-950/40 border border-border flex items-center justify-center mx-auto shadow-soft">
            <MascotHoney mood="lost" size={110} />
          </div>
          <span className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-junghyeon-coral text-white font-extrabold text-sm shadow-coral-glow">
            404
          </span>
        </div>

        {/* Thông điệp lỗi */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {t("notFound.title")}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("notFound.subtitle")}
          </p>
        </div>

        {/* Nút điều hướng về an toàn */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-junghyeon-coral hover:bg-junghyeon-coral-hover text-white font-bold text-sm shadow-coral-glow transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>{t("notFound.backHome")}</span>
          </Link>

          <Link
            href="/roadmap"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-card hover:bg-secondary border border-border text-foreground font-bold text-sm shadow-soft transition-all active:scale-95"
          >
            <Compass className="w-4 h-4 text-junghyeon-teal" />
            <span>Xem lộ trình học</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
