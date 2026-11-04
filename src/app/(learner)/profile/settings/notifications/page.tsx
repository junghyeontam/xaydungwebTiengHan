"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSettingsContext } from "@/features/profile/context/SettingsContext";
import { SectionCard } from "@/features/profile/components/SectionCard";
import {
  Bell,
  Clock,
  Flame,
  Layers,
  Sparkles,
  Tag,
  Moon,
} from "lucide-react";

interface NotificationPreferences {
  dailyReminder: boolean;
  streakAtRisk: boolean;
  srsDueCards: boolean;
  newLessons: boolean;
  promotions: boolean;
  reminderTime: string;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  dailyReminder: true,
  streakAtRisk: true,
  srsDueCards: true,
  newLessons: true,
  promotions: false,
  reminderTime: "20:00",
  quietHoursEnabled: true,
  quietHoursStart: "22:30",
  quietHoursEnd: "07:00",
};

const STORAGE_KEY = "jh_notification_preferences";

export default function NotificationsSettingsPage() {
  const { setIsDirty } = useSettingsContext();

  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);

  // Load preferences from localStorage on mount
  useEffect(() => {
    setIsDirty(false);
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setPrefs({ ...DEFAULT_PREFERENCES, ...JSON.parse(stored) });
        }
      } catch (err) {
        console.error("Error reading notification preferences:", err);
      }
    }
  }, [setIsDirty]);

  // Persist preferences immediately on toggle
  const savePreferences = useCallback(
    (newPrefs: NotificationPreferences) => {
      setPrefs(newPrefs);
      setIsDirty(false); // Notifications save instantly, no dirty state needed
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
        } catch (err) {
          console.error("Error saving notification preferences:", err);
        }
      }
    },
    [setIsDirty]
  );

  // Toggle boolean switches immediately
  const handleToggle = (key: keyof NotificationPreferences) => {
    const nextVal = !prefs[key];
    const updated = {
      ...prefs,
      [key]: nextVal,
    };
    savePreferences(updated);
  };

  // Change time fields immediately
  const handleTimeChange = (key: keyof NotificationPreferences, value: string) => {
    const updated = {
      ...prefs,
      [key]: value,
    };
    savePreferences(updated);
  };

  const notificationChannels = [
    {
      key: "dailyReminder" as const,
      icon: Clock,
      title: "Nhắc nhở học hàng ngày",
      desc: "Thông báo vào khung giờ bạn đã chọn để duy trì thói quen học",
    },
    {
      key: "streakAtRisk" as const,
      icon: Flame,
      title: "Cảnh báo chuỗi Streak sắp đứt",
      desc: "Gửi cảnh báo trước 2 tiếng nếu bạn chưa hoàn thành bài học trong ngày",
    },
    {
      key: "srsDueCards" as const,
      icon: Layers,
      title: "Thẻ Flashcard SRS đến hạn ôn",
      desc: "Thông báo khi có từ vựng cần kích hoạt thuật toán lặp lại ngắt quãng",
    },
    {
      key: "newLessons" as const,
      icon: Sparkles,
      title: "Bài học & Bộ thẻ mới ra mắt",
      desc: "Cập nhật bài ngữ pháp và từ vựng theo giáo trình TOPIK mới nhất",
    },
    {
      key: "promotions" as const,
      icon: Tag,
      title: "Ưu đãi học phí & Quà tặng VIP",
      desc: "Mã giảm giá độc quyền, sách bài tập và sự kiện phòng thi thử",
    },
  ];

  return (
    <SectionCard
      id="notifications-card"
      title="Tùy chọn Nhắc nhở & Thông báo"
      description="Quản lý kênh nhận thông báo học tập, lịch ôn bài SRS và thiết lập khung giờ yên tĩnh."
      icon={<Bell className="w-5 h-5" />}
      hideEditControls={true}
    >
      {/* 1. Notifications Channel Toggles (Direct Smooth iOS Switch) */}
      <div className="space-y-3">
        {notificationChannels.map((item) => {
          const Icon = item.icon;
          const isChecked = Boolean(prefs[item.key]);

          return (
            <div
              key={item.key}
              onClick={() => handleToggle(item.key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleToggle(item.key);
                }
              }}
              className={`p-4 sm:p-4.5 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer select-none active:scale-[0.99] ${
                isChecked
                  ? "border-brand-border bg-white dark:bg-brand-bg/40 shadow-2xs hover:border-brand-primary/40"
                  : "border-brand-border/60 bg-brand-bg/30 opacity-75 hover:opacity-100 hover:border-brand-border"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                    isChecked
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "bg-brand-border/60 text-brand-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 text-left min-w-0">
                  <h4 className="text-sm font-bold text-brand-navy dark:text-white truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-brand-secondary line-clamp-1">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Smooth Slide Toggle Switch (Lệch trái khi tắt, lệch phải khi bật) */}
              <button
                type="button"
                role="switch"
                aria-checked={isChecked}
                aria-label={`Bật/tắt ${item.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(item.key);
                }}
                className={`w-12 h-7 p-1 rounded-full transition-colors duration-300 ease-in-out relative shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary/30 ${
                  isChecked ? "bg-brand-primary" : "bg-neutral-300 dark:bg-neutral-700"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out block ${
                    isChecked ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* 2. Reminder Time & Quiet Hours Grid (Directly Editable with Auto-save) */}
      <div className="pt-6 border-t border-brand-border/60 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        {/* Daily Reminder Time */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-bold text-brand-navy dark:text-white flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-primary" />
            <span>Giờ nhắc nhở học hàng ngày</span>
          </label>
          <input
            type="time"
            value={prefs.reminderTime}
            onChange={(e) => handleTimeChange("reminderTime", e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-brand-border text-xs text-brand-navy dark:text-white bg-brand-bg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30 cursor-pointer"
          />
        </div>

        {/* Quiet Hours */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-bold text-brand-navy dark:text-white flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-brand-primary" />
            <span>Khung giờ yên tĩnh (Không gửi âm báo)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <input
                type="time"
                value={prefs.quietHoursStart}
                onChange={(e) => handleTimeChange("quietHoursStart", e.target.value)}
                className="w-full h-11 px-2.5 rounded-xl border border-brand-border text-xs text-brand-navy dark:text-white bg-brand-bg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30 cursor-pointer"
                title="Bắt đầu khung giờ yên tĩnh"
              />
            </div>
            <div className="relative">
              <input
                type="time"
                value={prefs.quietHoursEnd}
                onChange={(e) => handleTimeChange("quietHoursEnd", e.target.value)}
                className="w-full h-11 px-2.5 rounded-xl border border-brand-border text-xs text-brand-navy dark:text-white bg-brand-bg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30 cursor-pointer"
                title="Kết thúc khung giờ yên tĩnh"
              />
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
