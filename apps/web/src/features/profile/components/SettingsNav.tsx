"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Target,
  ShieldCheck,
  Bell,
  Lock,
  ChevronRight,
} from "lucide-react";
import { SettingsTabId } from "../types";

interface SettingsNavProps {
  activeTab?: SettingsTabId;
}

export function SettingsNav({ activeTab }: SettingsNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      id: "personal",
      labelVi: "Thông tin cá nhân",
      labelEn: "Personal Info",
      descVi: "Họ tên, ảnh đại diện, ngày sinh, địa chỉ",
      href: "/profile/settings/personal",
      icon: User,
    },
    {
      id: "learning",
      labelVi: "Mục tiêu học tập",
      labelEn: "Learning Goals",
      descVi: "TOPIK, thời gian học, hiển thị phụ đề",
      href: "/profile/settings/learning",
      icon: Target,
    },
    {
      id: "account",
      labelVi: "Tài khoản & Bảo mật",
      labelEn: "Account & Security",
      descVi: "Email, số điện thoại, đổi mật khẩu, thiết bị",
      href: "/profile/settings/account",
      icon: ShieldCheck,
    },
    {
      id: "notifications",
      labelVi: "Tùy chọn thông báo",
      labelEn: "Notifications",
      descVi: "Nhắc nhở học hàng ngày, giờ yên tĩnh",
      href: "/profile/settings/notifications",
      icon: Bell,
    },
    {
      id: "privacy",
      labelVi: "Quyền riêng tư & Dữ liệu",
      labelEn: "Privacy & Data",
      descVi: "Hiển thị BXH, tải dữ liệu, xóa tài khoản",
      href: "/profile/settings/privacy",
      icon: Lock,
    },
  ];

  return (
    <>
      {/* Desktop Vertical Nav (>=1280px) */}
      <nav className="hidden xl:flex flex-col rounded-3xl bg-white dark:bg-brand-surface border border-brand-border p-2 shadow-xs space-y-1">
        {navItems.map((item) => {
          const isActive =
            activeTab === item.id ||
            pathname === item.href ||
            (item.id === "personal" && pathname === "/profile/settings");

          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`p-3 rounded-2xl flex items-center justify-between text-xs font-bold transition-all group ${
                isActive
                  ? "bg-brand-primary/10 text-brand-primary"
                  : "text-brand-body hover:bg-brand-bg hover:text-brand-navy"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? "bg-brand-primary text-white"
                      : "bg-brand-bg text-brand-muted group-hover:text-brand-primary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left min-w-0">
                  <div className="truncate">{item.labelVi}</div>
                  <div className="text-[10px] font-normal text-brand-muted truncate">
                    {item.descVi}
                  </div>
                </div>
              </div>

              <ChevronRight
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive
                    ? "text-brand-primary translate-x-0.5"
                    : "text-brand-muted/40 group-hover:text-brand-muted"
                }`}
              />
            </Link>
          );
        })}
      </nav>

      {/* Horizontal Tabs (<1280px Tablet & Mobile) */}
      <div className="xl:hidden w-full overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-brand-surface border border-brand-border min-w-max shadow-xs">
          {navItems.map((item) => {
            const isActive =
              activeTab === item.id ||
              pathname === item.href ||
              (item.id === "personal" && pathname === "/profile/settings");

            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-brand-primary text-white shadow-xs"
                    : "text-brand-secondary hover:text-brand-navy hover:bg-brand-bg"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.labelVi}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
