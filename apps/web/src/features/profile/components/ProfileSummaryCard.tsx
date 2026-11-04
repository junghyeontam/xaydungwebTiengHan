"use client";

import React from "react";
import Link from "next/link";
import { ExtendedUserProfile } from "../types";
import { calculateProfileCompleteness } from "../completeness";
import { formatDate } from "@/lib/format";
import {
  Camera,
  Crown,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface ProfileSummaryCardProps {
  profile: ExtendedUserProfile;
  onOpenAvatarModal?: () => void;
  onSelectTab?: (tab: string) => void;
}

export function ProfileSummaryCard({
  profile,
  onOpenAvatarModal,
  onSelectTab,
}: ProfileSummaryCardProps) {
  const completeness = calculateProfileCompleteness(profile);
  const percent = completeness.percent;

  // SVG Circular Ring parameters
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="rounded-3xl bg-white dark:bg-brand-surface border border-brand-border shadow-xs overflow-hidden flex flex-col">
      {/* 1. Header with Soft Sky Gradient Cover */}
      <div className="h-28 bg-gradient-to-r from-sky-400/20 via-brand-primary/15 to-emerald-400/20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
      </div>

      {/* 2. Avatar & Core Identity (Overlapping cover) */}
      <div className="px-5 pb-5 -mt-14 flex flex-col items-center text-center space-y-3 relative z-10">
        {/* Avatar Circular 112px */}
        <div className="relative group">
          <div className="w-28 h-28 rounded-full border-4 border-white dark:border-brand-surface bg-gradient-to-tr from-brand-navy to-brand-primary text-white flex items-center justify-center font-black text-3xl shadow-md overflow-hidden relative">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{profile.fullName ? profile.fullName.substring(0, 2).toUpperCase() : "JH"}</span>
            )}

            {/* Hover overlay for changing avatar */}
            <button
              type="button"
              onClick={onOpenAvatarModal}
              className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
              aria-label="Đổi ảnh đại diện"
            >
              <Camera className="w-5 h-5 mb-0.5" />
              <span>Đổi ảnh</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenAvatarModal}
            className="absolute bottom-1 right-1 p-2 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white shadow-md border-2 border-white dark:border-brand-surface transition-transform active:scale-90"
            title="Đổi ảnh đại diện"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Names & Level */}
        <div className="space-y-1">
          <h2 className="text-lg font-black text-brand-navy dark:text-white tracking-tight">
            {profile.fullName || "Học viên JungHyeon"}
          </h2>
          {profile.displayName && (
            <p className="text-xs text-brand-secondary font-medium">
              @{profile.displayName}
            </p>
          )}

          <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary font-bold text-[11px]">
              Level 3 • Cây con 🪴
            </span>

            {profile.isVip ? (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-yellow-400 font-bold text-[11px] inline-flex items-center gap-1">
                <Crown className="w-3 h-3 fill-amber-500" />
                <span>VIP</span>
              </span>
            ) : (
              <Link
                href="/products"
                className="px-2 py-0.5 rounded-full bg-brand-surface hover:bg-brand-tint border border-brand-border text-brand-muted hover:text-brand-primary text-[10px] font-semibold transition-colors"
              >
                Gói Miễn phí
              </Link>
            )}
          </div>
        </div>

        <div className="text-[11px] text-brand-muted pt-1">
          Tham gia: {formatDate(profile.createdAt || new Date())}
        </div>
      </div>

      {/* 3. Profile Completeness Ring & Checklist */}
      <div className="px-5 pb-5 pt-3 border-t border-brand-border space-y-3.5 bg-brand-bg/50">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-brand-navy dark:text-white">
              Độ hoàn thiện hồ sơ
            </span>
            <p className="text-[11px] text-brand-muted">
              {percent === 100
                ? "Hồ sơ đã đạt 100% xuất sắc!"
                : `${completeness.completedCount}/${completeness.totalChecks} thông tin đã điền`}
            </p>
          </div>

          {/* SVG Progress Ring */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-brand-border/60"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-brand-primary transition-all duration-700 ease-out"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <span className="absolute font-black text-xs text-brand-navy dark:text-white">
              {percent}%
            </span>
          </div>
        </div>

        {/* Missing Action Checklist */}
        {percent < 100 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider">
              Gợi ý bổ sung điểm:
            </span>
            <div className="space-y-1">
              {completeness.items
                .filter((item) => !item.completed)
                .slice(0, 3)
                .map((item) => (
                  <Link
                    key={item.id}
                    href={`/profile/settings/${item.tabTarget}`}
                    onClick={() => onSelectTab && onSelectTab(item.tabTarget)}
                    className="p-2 rounded-xl bg-white dark:bg-brand-surface border border-brand-border hover:border-brand-primary/40 hover:bg-brand-tint transition-all flex items-center justify-between text-xs text-brand-body group"
                  >
                    <span className="font-medium truncate pr-1">
                      {item.label}
                    </span>
                    <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px] group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      +{item.percent}%
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
