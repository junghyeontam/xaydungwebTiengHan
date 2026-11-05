"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { learningProfileSchema, LearningProfileFormValues } from "@/features/profile/schemas";
import { useSettingsContext } from "@/features/profile/context/SettingsContext";
import { SectionCard } from "@/features/profile/components/SectionCard";
import {
  LEARNING_GOAL_OPTIONS,
  STUDY_TIME_OPTIONS,
  HOW_DID_YOU_HEAR_OPTIONS,
} from "@/features/profile/reference-data";
import { formatDate } from "@/lib/format";
import {
  Target,
  Clock,
  Sparkles,
  Award,
  Layers,
  CheckCircle2,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export default function LearningSettingsPage() {
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
    resolver: zodResolver(learningProfileSchema) as any,
    defaultValues: {
      learningGoals: profile.learningGoals || ["topik_exam"],
      targetTopikLevel: profile.targetTopikLevel || 3,
      targetExamDate: profile.targetExamDate || "",
      currentLevel: profile.currentLevel || "topik-1-2",
      dailyGoalMinutes: profile.dailyGoalMinutes || 20,
      preferredStudyTimes: profile.preferredStudyTimes || ["evening"],
      translationPreference: profile.translationPreference || "both",
      showRomanization: profile.showRomanization ?? true,
      howDidYouHear: profile.howDidYouHear || "google",
    },
  });

  useEffect(() => {
    setIsDirty(formIsDirty && isEditing);
  }, [formIsDirty, isEditing, setIsDirty]);

  const watchedGoals = watch("learningGoals") || [];
  const watchedTimes = watch("preferredStudyTimes") || [];
  const watchedTopik = watch("targetTopikLevel");
  const watchedDaily = watch("dailyGoalMinutes");
  const watchedTrans = watch("translationPreference");
  const watchedRomaja = watch("showRomanization");

  const toggleGoal = (goalId: string) => {
    const exists = watchedGoals.includes(goalId);
    let next: string[];
    if (exists) {
      if (watchedGoals.length === 1) return; // Keep at least one
      next = watchedGoals.filter((g: string) => g !== goalId);
    } else {
      next = [...watchedGoals, goalId];
    }
    setValue("learningGoals", next, { shouldDirty: true, shouldValidate: true });
  };

  const toggleTime = (timeId: string) => {
    const exists = watchedTimes.includes(timeId);
    let next: string[];
    if (exists) {
      if (watchedTimes.length === 1) return;
      next = watchedTimes.filter((t: string) => t !== timeId);
    } else {
      next = [...watchedTimes, timeId];
    }
    setValue("preferredStudyTimes", next, { shouldDirty: true });
  };

  const handleResetForm = useCallback(() => {
    reset({
      learningGoals: profile.learningGoals || ["topik_exam"],
      targetTopikLevel: profile.targetTopikLevel || 3,
      targetExamDate: profile.targetExamDate || "",
      currentLevel: profile.currentLevel || "topik-1-2",
      dailyGoalMinutes: profile.dailyGoalMinutes || 20,
      preferredStudyTimes: profile.preferredStudyTimes || ["evening"],
      translationPreference: profile.translationPreference || "both",
      showRomanization: profile.showRomanization ?? true,
      howDidYouHear: profile.howDidYouHear || "google",
    });
    setIsEditing(false);
    setIsDirty(false);
  }, [profile, reset, setIsDirty]);

  const onSubmit = (data: LearningProfileFormValues) => {
    updateProfileState(
      {
        learningGoals: data.learningGoals,
        targetTopikLevel: data.targetTopikLevel,
        targetExamDate: data.targetExamDate,
        currentLevel: data.currentLevel,
        dailyGoalMinutes: data.dailyGoalMinutes,
        preferredStudyTimes: data.preferredStudyTimes,
        translationPreference: data.translationPreference,
        showRomanization: data.showRomanization,
        howDidYouHear: data.howDidYouHear,
      },
      "learning_profile"
    );

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

  const levelLabels: Record<string, string> = {
    zero: "Nhập môn từ con số 0",
    hangul: "Bảng chữ cái Hangul",
    "topik-1-2": "Sơ cấp 1-2 (TOPIK 1-2)",
    "topik-3-4": "Trung cấp 3-4 (TOPIK 3-4)",
    "topik-5-6": "Cao cấp 5-6 (TOPIK 5-6)",
  };

  return (
    <SectionCard
      id="learning-card"
      title="Mục tiêu & Định hướng Lộ trình"
      description="Tùy biến mục tiêu thi TOPIK, cam kết thời gian học mỗi ngày và chế độ hiển thị từ vựng."
      icon={<Target className="w-5 h-5" />}
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      onEditClick={() => setIsEditing(true)}
      onCancelClick={handleResetForm}
      onSaveClick={handleSubmit(onSubmit)}
    >
      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>Đã lưu thành công định hướng học tập!</span>
        </div>
      )}

      {!isEditing ? (
        /* ================= VIEW MODE ================= */
        <div className="space-y-6 text-xs">
          {/* Goals Chips */}
          <div className="space-y-2">
            <span className="text-brand-muted font-semibold uppercase text-[11px] tracking-wider">
              Mục tiêu học tiếng Hàn chính
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.learningGoals.map((gId) => {
                const goal = LEARNING_GOAL_OPTIONS.find((opt) => opt.id === gId);
                return (
                  <span
                    key={gId}
                    className="px-3 py-1.5 rounded-xl bg-brand-primary/10 border border-brand-primary/30 text-brand-primary font-bold text-xs"
                  >
                    🎯 {goal?.labelVi || gId}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 pt-2">
            <div className="space-y-1">
              <span className="text-brand-muted font-semibold uppercase text-[11px] tracking-wider">
                Mục tiêu chứng chỉ
              </span>
              <div className="text-sm font-bold text-brand-navy dark:text-white">
                TOPIK Cấp {profile.targetTopikLevel}
                {profile.targetExamDate && (
                  <span className="text-xs font-normal text-brand-secondary ml-2">
                    (Thi ngày {formatDate(profile.targetExamDate)})
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-brand-muted font-semibold uppercase text-[11px] tracking-wider">
                Trình độ hiện tại
              </span>
              <div className="text-sm font-bold text-brand-navy dark:text-white flex items-center gap-2">
                <span>{levelLabels[profile.currentLevel] || profile.currentLevel}</span>
                <Link
                  href="/roadmap"
                  className="text-xs text-brand-primary hover:underline font-semibold"
                >
                  Kiểm tra xếp lớp →
                </Link>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-brand-muted font-semibold uppercase text-[11px] tracking-wider">
                Cam kết mỗi ngày
              </span>
              <div className="text-sm font-bold text-brand-navy dark:text-white">
                ⏱️ {profile.dailyGoalMinutes} phút / ngày
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-brand-muted font-semibold uppercase text-[11px] tracking-wider">
                Khung giờ học ưa thích
              </span>
              <div className="text-sm font-bold text-brand-navy dark:text-white">
                {profile.preferredStudyTimes
                  .map((t) => STUDY_TIME_OPTIONS.find((opt) => opt.id === t)?.labelVi.split("(")[0].trim() || t)
                  .join(", ")}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-brand-muted font-semibold uppercase text-[11px] tracking-wider">
                Hiển thị bản dịch bài giảng
              </span>
              <div className="text-sm font-bold text-brand-navy dark:text-white">
                {profile.translationPreference === "both"
                  ? "Cả Tiếng Việt & Tiếng Anh"
                  : profile.translationPreference === "vi"
                  ? "Chỉ Tiếng Việt"
                  : "Chỉ Tiếng Anh"}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-brand-muted font-semibold uppercase text-[11px] tracking-wider">
                Phiên âm Romaja
              </span>
              <div className="text-sm font-bold text-brand-navy dark:text-white">
                {profile.showRomanization ? "Đang bật (Hiển thị phát âm chữ la-tinh)" : "Đang tắt (Thuần chữ Hangul)"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= EDIT MODE ================= */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 1. Multi-select Goals Chips */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-brand-navy dark:text-white flex items-center justify-between">
              <span>Mục tiêu học tiếng Hàn của bạn (chọn nhiều) *</span>
              <span className="text-[10px] text-brand-muted">Ít nhất 1 mục tiêu</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {LEARNING_GOAL_OPTIONS.map((g) => {
                const isSelected = watchedGoals.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleGoal(g.id)}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-brand-primary bg-brand-primary/10 text-brand-primary shadow-2xs"
                        : "border-brand-border bg-brand-bg text-brand-secondary hover:text-brand-navy"
                    }`}
                  >
                    <span>{g.labelVi}</span>
                    <span className="text-xs">{isSelected ? "✓" : "+"}</span>
                  </button>
                );
              })}
            </div>
            {errors.learningGoals && (
              <p className="text-[11px] text-red-500 font-medium">
                {String(errors.learningGoals.message || "")}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* 2. Target TOPIK Level (1-6 Segmented) */}
            <div className="space-y-1.5 text-left sm:col-span-2">
              <label className="text-xs font-bold text-brand-navy dark:text-white">
                Mục tiêu Cấp độ TOPIK
              </label>
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setValue("targetTopikLevel", lvl, { shouldDirty: true })}
                    className={`h-11 rounded-xl border text-xs font-black transition-all ${
                      watchedTopik === lvl
                        ? "border-brand-primary bg-brand-primary text-white shadow-xs"
                        : "border-brand-border bg-brand-bg text-brand-secondary hover:text-brand-navy"
                    }`}
                  >
                    Cấp {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Target Exam Date */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-brand-navy dark:text-white flex items-center justify-between">
                <span>Ngày dự kiến thi TOPIK</span>
                <span className="text-[10px] text-brand-muted">Tùy chọn</span>
              </label>
              <input
                type="date"
                {...register("targetExamDate")}
                className="w-full h-11 px-3.5 rounded-xl border border-brand-border text-xs text-brand-navy dark:text-white bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            {/* 4. Current Level */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-brand-navy dark:text-white">
                Trình độ xuất phát hiện tại
              </label>
              <select
                {...register("currentLevel")}
                className="w-full h-11 px-3.5 rounded-xl border border-brand-border text-xs text-brand-navy dark:text-white bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="zero">Nhập môn từ con số 0</option>
                <option value="hangul">Đã biết sơ bảng chữ cái Hangul</option>
                <option value="topik-1-2">Sơ cấp 1-2 (TOPIK 1-2)</option>
                <option value="topik-3-4">Trung cấp 3-4 (TOPIK 3-4)</option>
                <option value="topik-5-6">Cao cấp 5-6 (TOPIK 5-6)</option>
              </select>
            </div>

            {/* 5. Daily Commitment Minutes */}
            <div className="space-y-1.5 text-left sm:col-span-2">
              <label className="text-xs font-bold text-brand-navy dark:text-white">
                Thời gian cam kết học mỗi ngày
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 10, label: "10 phút (Nhẹ nhàng)" },
                  { value: 20, label: "20 phút (Chuẩn)" },
                  { value: 30, label: "30 phút (Tập trung)" },
                  { value: 45, label: "45 phút (Cấp tốc)" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setValue("dailyGoalMinutes", item.value, { shouldDirty: true })}
                    className={`h-11 px-2 rounded-xl border text-xs font-bold transition-all ${
                      watchedDaily === item.value
                        ? "border-brand-primary bg-brand-primary/10 text-brand-primary shadow-2xs"
                        : "border-brand-border bg-brand-bg text-brand-secondary hover:text-brand-navy"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Preferred Study Times */}
            <div className="space-y-1.5 text-left sm:col-span-2">
              <label className="text-xs font-bold text-brand-navy dark:text-white">
                Khung giờ nhắc nhở học phù hợp với bạn
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STUDY_TIME_OPTIONS.map((time) => {
                  const isSelected = watchedTimes.includes(time.id);
                  return (
                    <button
                      key={time.id}
                      type="button"
                      onClick={() => toggleTime(time.id)}
                      className={`h-11 px-2 rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? "border-brand-primary bg-brand-primary/10 text-brand-primary shadow-2xs"
                          : "border-brand-border bg-brand-bg text-brand-secondary hover:text-brand-navy"
                      }`}
                    >
                      {time.labelVi.split("(")[0].trim()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 7. Translation Preference */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-brand-navy dark:text-white">
                Dịch nghĩa bài học
              </label>
              <select
                {...register("translationPreference")}
                className="w-full h-11 px-3.5 rounded-xl border border-brand-border text-xs text-brand-navy dark:text-white bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="both">Hiển thị cả Tiếng Việt & Tiếng Anh</option>
                <option value="vi">Chỉ hiển thị Tiếng Việt</option>
                <option value="en">Chỉ hiển thị Tiếng Anh</option>
              </select>
            </div>

            {/* 8. Romanization Toggle */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-brand-navy dark:text-white">
                Phiên âm phát âm (Romaja)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setValue("showRomanization", true, { shouldDirty: true })}
                  className={`h-11 px-3 rounded-xl border text-xs font-bold transition-all ${
                    watchedRomaja
                      ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                      : "border-brand-border bg-brand-bg text-brand-secondary"
                  }`}
                >
                  Bật Romaja
                </button>
                <button
                  type="button"
                  onClick={() => setValue("showRomanization", false, { shouldDirty: true })}
                  className={`h-11 px-3 rounded-xl border text-xs font-bold transition-all ${
                    !watchedRomaja
                      ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                      : "border-brand-border bg-brand-bg text-brand-secondary"
                  }`}
                >
                  Tắt (Thuần Hàn)
                </button>
              </div>
            </div>

            {/* 9. How did you hear */}
            <div className="space-y-1.5 text-left sm:col-span-2">
              <label className="text-xs font-bold text-brand-navy dark:text-white">
                Bạn biết đến Tiếng Hàn JungHyeon qua đâu?
              </label>
              <select
                {...register("howDidYouHear")}
                className="w-full h-11 px-3.5 rounded-xl border border-brand-border text-xs text-brand-navy dark:text-white bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                {HOW_DID_YOU_HEAR_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.labelVi}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      )}
    </SectionCard>
  );
}
