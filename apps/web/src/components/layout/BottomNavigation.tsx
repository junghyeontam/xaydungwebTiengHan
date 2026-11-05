"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Home, Compass, Repeat, Crown, HelpCircle } from "lucide-react";

export function BottomNavigation() {
  const pathname = usePathname();
  const { t } = useI18n();

  const tabs = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/roadmap", label: t("nav.roadmap"), icon: Compass },
    { href: "/review", label: t("nav.review"), icon: Repeat },
    {
      href: "/products",
      label: t("nav.premium") || "Premium",
      icon: Crown,
      isPremium: true,
    },
    { href: "/consultation", label: t("nav.consultation"), icon: HelpCircle },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border/80 px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <nav className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
                tab.isPremium
                  ? isActive
                    ? "text-amber-500 font-bold scale-105"
                    : "text-amber-600 dark:text-yellow-400 font-semibold"
                  : isActive
                  ? "text-junghyeon-coral dark:text-junghyeon-teal font-semibold scale-105"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "stroke-[2.5]" : "stroke-2"
                  } ${tab.isPremium ? "text-amber-500 fill-amber-500/20" : ""}`}
                />
                {isActive && (
                  <span
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                      tab.isPremium
                        ? "bg-amber-500"
                        : "bg-junghyeon-coral dark:bg-junghyeon-teal"
                    }`}
                  />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-[64px]">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
