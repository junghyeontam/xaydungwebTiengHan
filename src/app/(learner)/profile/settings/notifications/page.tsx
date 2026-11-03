"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notificationsSchema, NotificationsFormValues } from "@/features/profile/schemas";
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
  CheckCircle2,
  Check,
} from "lucide-react";

export default function NotificationsSettingsPage() {
  const { profile, updateProfileState, setIsDirty, registerSaveHandler, registerDiscardHandler } =
    useSettingsContext();

  const [isEditing, setIsEditing] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty: formIsDirty, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(notificationsSchema) as any,
    defaultValues: {
      dailyReminder: true,
      streakAtRisk: true,
      srsDueCards: true,
      newLessons: true,
      promotions: false,
      productNews: true,
      reminderTime: "20:00",
      quietHoursEnabled: true,
      quietHoursStart: "22:30",
      quietHoursEnd: "07:00",
      unsubscribeMarketing: false,
    },
  });

  useEffect(() => {
    setIsDirty(formIsDirty && isEditing);
  }, [formIsDirty, isEditing, setIsDirty]);

  const watchedValues = watch();

  const handleResetForm = useCallback(() => {
    reset();
    setIsEditing(false);
    setIsDirty(false);
  }, [reset, setIsDirty]);

  const onSubmit = (data: NotificationsFormValues) => {
    // Save to settings
    updateProfileState({}, "notifications");
    setIsEditing(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  useEffect(() => {
    if (isEditing) {
      registerSaveHandler(() => {
        return new Promise<boolean>((resolve) => {
          handleSubmit((data) => {
            onSubmit(data);
            resolve(true);
          })();
        });
      });
      registerDiscardHandler(handleResetForm);
    }
  }, [isEditing, handleSubmit, handleResetForm, registerSaveHandler, registerDiscardHandler]);

  const toggleSwitch = (key: keyof NotificationsFormValues) => {
    if (!isEditing) return;
    const current = Boolean(watchedValues[key]);
    setValue(key, !current as any, { shouldDirty: true });
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
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      onEditClick={() => setIsEditing(true)}
      onCancelClick={handleResetForm}
      onSaveClick={handleSubmit(onSubmit)}
    >
      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>Đã lưu thành công cài đặt thông báo!</span>
        </div>
      )}

      {/* 1. Notifications Channel Toggles */}
      <div className="space-y-3">
        {notificationChannels.map((item) => {
          const Icon = item.icon;
          const isChecked = Boolean(watchedValues[item.key]);

          return (
            <div
              key={item.key}
              onClick={() => toggleSwitch(item.key)}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                isEditing ? "cursor-pointer hover:border-brand-primary/40" : ""
              } ${
                isChecked
                  ? "border-brand-border bg-white dark:bg-brand-bg/40"
                  : "border-brand-border/60 bg-brand-bg/30 opacity-70"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isChecked
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "bg-brand-border text-brand-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 text-left">
                  <div className="text-xs font-bold text-brand-navy dark:text-white">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-brand-secondary">
                    {item.desc}
                  </div>
                </div>
              </div>

              {/* iOS-Style Toggle Switch */}
              <div
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                  isChecked ? "bg-brand-primary" : "bg-brand-border"
                } ${!isEditing ? "opacity-60" : ""}`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                    isChecked ? "left-5.5 translate-x-0" : "left-0.5"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Reminder Time & Quiet Hours Grid */}
      <div className="pt-6 border-t border-brand-border/60 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-bold text-brand-navy dark:text-white flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-primary" />
            <span>Giờ nhắc nhở học hàng ngày</span>
          </label>
          <input
            type="time"
            disabled={!isEditing}
            {...register("reminderTime")}
            className="w-full h-11 px-3.5 rounded-xl border border-brand-border text-xs text-brand-navy dark:text-white bg-brand-bg disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
          />
        </div>

        <div className="space-y-1.5 text-left">
          <label className="text-xs font-bold text-brand-navy dark:text-white flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-brand-primary" />
            <span>Khung giờ yên tĩnh (Không gửi âm báo)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="time"
              disabled={!isEditing}
              {...register("quietHoursStart")}
              className="w-full h-11 px-2.5 rounded-xl border border-brand-border text-xs text-brand-navy dark:text-white bg-brand-bg disabled:opacity-70"
            />
            <input
              type="time"
              disabled={!isEditing}
              {...register("quietHoursEnd")}
              className="w-full h-11 px-2.5 rounded-xl border border-brand-border text-xs text-brand-navy dark:text-white bg-brand-bg disabled:opacity-70"
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
