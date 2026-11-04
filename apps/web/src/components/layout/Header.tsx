"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useAuth } from "@/lib/context/AuthContext";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Button, ProBadge } from "@/components/shared";
import { SurfaceSwitcher } from "@junghyeon/ui";
import { getAccessibleSurfaces } from "@junghyeon/rbac";
import {
  Sun,
  Moon,
  User,
  Menu,
  X,
  BookOpen,
  Compass,
  Repeat,
  Mic,
  Award,
  HelpCircle,
  LogOut,
  Layers,
  Sparkles,
  Globe,
  Settings,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();
  const { user, setAuthModalOpen, setOnboardingOpen, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSsoRole, setActiveSsoRole] = useState<string>("guest");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const roleFromQuery = params.get("role");
      const cookieMatch = document.cookie.match(/(?:^|;\s*)(?:jh_active_role|jh_admin_role)=([^;]+)/);
      const roleFromCookie = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
      setActiveSsoRole(roleFromQuery || roleFromCookie || "guest");
    }
  }, [pathname]);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setUserMenuOpen(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setUserMenuOpen(false);
    }, 220);
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);

    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const navLinks = [
    { href: "/", label: t("nav.home"), icon: Compass },
    { href: "/roadmap", label: t("nav.roadmap"), icon: BookOpen },
    { href: "/review", label: t("nav.review"), icon: Repeat },
    { href: "/pronunciation", label: t("nav.pronunciation"), icon: Mic },
    { href: "/topik", label: t("nav.topik"), icon: Award },
    { href: "/consultation", label: t("nav.consultation"), icon: HelpCircle },
    {
      href: "/products",
      label: t("nav.premium") || "Premium",
      isPremium: true,
    },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-brand-bg/95 backdrop-blur-md border-b border-brand-border shadow-xs py-2.5"
          : "bg-brand-bg/90 backdrop-blur-sm border-b border-transparent py-3 sm:py-3.5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 lg:gap-6">
        {/* Brand Logo */}
        <div className="shrink-0">
          <BrandLogo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            if (link.isPremium) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-150 ${
                    isActive
                      ? "bg-brand-gold text-white border-brand-gold shadow-xs"
                      : "bg-brand-gold-tint text-amber-700 dark:text-yellow-400 border-brand-gold/30 hover:border-brand-gold/60"
                  }`}
                  title="Gói Hội viên Premium & VIP Trọn đời"
                >
                  <ProBadge size="sm" variant="pill" label={link.label} />
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? "text-brand-navy font-bold"
                    : "text-brand-secondary hover:text-brand-navy hover:bg-brand-surface"
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-brand-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Toolbar: Surface Switcher (multi-surface staff only), Language Switcher, Theme Switcher, Sign In / Avatar */}
        <div className="flex items-center gap-2">
          <SurfaceSwitcher
            currentSurface="web"
            allowedSurfaces={getAccessibleSurfaces(activeSsoRole)}
            activeRole={activeSsoRole}
            locale={locale === "en" ? "en" : "vi"}
          />

          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setLocale(locale === "vi" ? "en" : "vi")}
            className="h-10 px-3 flex items-center gap-1.5 rounded-control border border-brand-border bg-brand-bg hover:bg-brand-surface text-xs font-semibold text-brand-secondary hover:text-brand-navy transition-colors shadow-2xs"
            title={locale === "vi" ? "Switch to English (EN)" : "Đổi sang Tiếng Việt (VI)"}
            aria-label="Toggle language (VI / EN)"
          >
            <Globe className="w-3.5 h-3.5 text-brand-muted" />
            <span className="uppercase font-bold text-brand-navy">{locale}</span>
          </button>

          {/* Theme Switcher */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-10 h-10 rounded-control border border-brand-border bg-brand-bg hover:bg-brand-surface flex items-center justify-center text-brand-secondary hover:text-brand-navy transition-all shadow-2xs"
              title={theme === "dark" ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"}
              aria-label="Đổi giao diện sáng/tối"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-brand-gold" />
              ) : (
                <Moon className="w-4 h-4 text-brand-navy" />
              )}
            </button>
          )}

          {/* Sign In Button / User Dropdown */}
          {!user ? (
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="md"
                pill
                onClick={() => setAuthModalOpen(true, "login")}
                icon={<User className="w-4 h-4" />}
                className="hidden sm:inline-flex shadow-xs font-semibold"
              >
                {t("nav.login")}
              </Button>
            </div>
          ) : (
            <div
              ref={userMenuRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Circular Avatar Trigger Button */}
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="relative w-10 h-10 rounded-full p-0.5 border border-brand-border hover:border-brand-primary bg-brand-bg hover:bg-brand-surface transition-all shadow-2xs flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                aria-label="Hồ sơ học viên"
                title={user.fullName || "Hồ sơ học viên"}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-brand-navy to-brand-primary text-white flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden">
                  {user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user.fullName ? user.fullName.charAt(0).toUpperCase() : "JH"}</span>
                  )}
                </div>

                {/* Status Dot */}
                <span
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-brand-bg"
                  title="Đang hoạt động"
                />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-card bg-brand-bg border border-brand-border shadow-card p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
                  onClick={() => setUserMenuOpen(false)}
                >
                  {/* Dropdown Header: User info + XP & Streak */}
                  <div className="p-3 border-b border-brand-border space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-navy to-brand-primary text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-xs">
                        {user.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.avatarUrl}
                            alt={user.fullName || "User"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{user.fullName ? user.fullName.charAt(0).toUpperCase() : "JH"}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-brand-navy truncate">
                            {user.fullName}
                          </span>
                          {user.isVip ? (
                            <ProBadge size="sm" label="VIP" />
                          ) : (
                            <span className="px-1.5 py-0.5 rounded-full bg-brand-surface text-brand-secondary font-semibold text-[10px] border border-brand-border shrink-0">
                              {locale === "vi" ? "Miễn phí" : "Free"}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-brand-muted truncate">{user.email}</div>
                      </div>
                    </div>

                    {/* XP & Streak summary pills */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="inline-flex items-center gap-1 font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full text-[10px]">
                        <Sparkles className="w-3 h-3" />
                        {user.totalXp} XP
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full text-[10px]">
                        🔥 {user.streakDays} ngày
                      </span>
                    </div>
                  </div>

                  {/* Quick Upgrade to Premium */}
                  {!user.isVip && (
                    <div className="p-1.5">
                      <Link
                        href="/products"
                        className="flex items-center justify-between p-2 rounded-control bg-brand-gold-tint hover:bg-brand-gold-tint/80 text-amber-800 dark:text-yellow-300 border border-brand-gold/30 text-xs font-bold transition-all"
                      >
                        <div className="flex items-center gap-1.5">
                          <ProBadge size="sm" variant="icon" />
                          <span>{locale === "vi" ? "Nâng cấp Premium" : "Upgrade to Premium"}</span>
                        </div>
                        <span className="text-[10px] bg-brand-gold text-white px-1.5 py-0.5 rounded-full font-black">
                          VIP
                        </span>
                      </Link>
                    </div>
                  )}

                  <div className="py-1 space-y-0.5">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-control text-xs font-medium text-brand-body hover:bg-brand-surface hover:text-brand-navy transition-colors"
                    >
                      <User className="w-4 h-4 text-brand-primary" />
                      <span>{t("nav.profile")}</span>
                    </Link>

                    <Link
                      href="/profile/settings"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-control text-xs font-semibold text-brand-primary hover:bg-brand-primary/10 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-brand-primary" />
                      <span>{locale === "vi" ? "Chỉnh sửa hồ sơ & Cài đặt" : "Edit Profile & Settings"}</span>
                    </Link>

                    <Link
                      href="/profile#decks"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-control text-xs font-medium text-brand-body hover:bg-brand-surface hover:text-brand-navy transition-colors"
                    >
                      <Layers className="w-4 h-4 text-brand-coral" />
                      <span>{t("nav.myDecks")}</span>
                    </Link>

                    <button
                      onClick={() => setOnboardingOpen(true)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-control text-xs font-medium text-brand-body hover:bg-brand-surface hover:text-brand-navy transition-colors text-left"
                    >
                      <Sparkles className="w-4 h-4 text-brand-success" />
                      <span>{locale === "vi" ? "Thiết lập lại mục tiêu" : "Reset Goal"}</span>
                    </button>
                  </div>

                  <div className="h-px bg-brand-border my-1" />

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-control text-xs font-medium text-brand-danger hover:bg-brand-danger/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t("nav.logout")}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-control border border-brand-border bg-brand-surface text-brand-navy"
            aria-label="Mở menu điều hướng"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-border mt-2.5 px-4 py-4 bg-brand-bg/98 backdrop-blur-xl animate-in slide-in-from-top-2 space-y-3">
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3.5 rounded-card bg-brand-gold-tint border border-brand-gold/40 text-amber-900 dark:text-yellow-300 font-bold text-sm shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <ProBadge size="sm" variant="icon" />
              <div>
                <div>{locale === "vi" ? "Gói Hội viên Premium VIP" : "Premium VIP Membership"}</div>
                <div className="text-[11px] text-brand-muted font-normal">
                  {locale === "vi" ? "Mở khoá TOPIK 1-6 & Phát âm AI" : "Unlock TOPIK 1-6 & AI Speech"}
                </div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-brand-coral text-white text-[11px] font-black uppercase">
              {locale === "vi" ? "Xem gói" : "View"}
            </span>
          </Link>

          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              if (link.isPremium) return null;
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-control text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-tint text-brand-primary font-bold"
                      : "text-brand-body hover:bg-brand-surface"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-brand-primary" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {!user && (
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true, "login");
                }}
                className="w-full justify-center"
                icon={<User className="w-4 h-4" />}
              >
                {t("nav.login")}
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
