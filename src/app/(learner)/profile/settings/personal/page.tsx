"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, PersonalInfoFormValues } from "@/features/profile/schemas";
import { useSettingsContext } from "@/features/profile/context/SettingsContext";
import { SectionCard } from "@/features/profile/components/SectionCard";
import { COUNTRIES_LIST, VN_PROVINCES_LIST, TIMEZONES_LIST } from "@/features/profile/reference-data";
import { formatDate } from "@/lib/format";
import {
  User,
  Globe,
  MapPin,
  Calendar,
  Languages,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";

export default function PersonalSettingsPage() {
  const { profile, updateProfileState, setIsDirty, registerSaveHandler, registerDiscardHandler, openAvatarModal } =
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
    resolver: zodResolver(personalInfoSchema) as any,
    defaultValues: {
      fullName: profile.fullName || "",
      displayName: profile.displayName || "",
      gender: profile.gender || "undisclosed",
      dateOfBirth: profile.dateOfBirth || "",
      nationalityCode: profile.nationalityCode || "VN",
      countryCode: profile.countryCode || "VN",
      provinceCode: profile.provinceCode || "HN",
      uiLanguage: profile.uiLanguage || "vi",
      timezone: profile.timezone || "Asia/Ho_Chi_Minh",
    },
  });

  // Sync dirty state with global settings context
  useEffect(() => {
    setIsDirty(formIsDirty && isEditing);
  }, [formIsDirty, isEditing, setIsDirty]);

  // Selected date of birth for age check
  const watchedDob = watch("dateOfBirth");
  let isUnder16 = false;
  if (watchedDob) {
    const d = new Date(watchedDob);
    if (!isNaN(d.getTime())) {
      const age = new Date().getFullYear() - d.getFullYear();
      isUnder16 = age < 16;
    }
  }

  const selectedGender = watch("gender");
  const selectedLang = watch("uiLanguage");

  // Reset form when profile changes or on cancel
  const handleResetForm = useCallback(() => {
    reset({
      fullName: profile.fullName || "",
      displayName: profile.displayName || "",
      gender: profile.gender || "undisclosed",
      dateOfBirth: profile.dateOfBirth || "",
      nationalityCode: profile.nationalityCode || "VN",
      countryCode: profile.countryCode || "VN",
      provinceCode: profile.provinceCode || "HN",
      uiLanguage: profile.uiLanguage || "vi",
      timezone: profile.timezone || "Asia/Ho_Chi_Minh",
    });
    setIsEditing(false);
    setIsDirty(false);
  }, [profile, reset, setIsDirty]);

  // Submit handler
  const onSubmit = (data: PersonalInfoFormValues) => {
    updateProfileState(
      {
        fullName: data.fullName,
        displayName: data.displayName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        nationalityCode: data.nationalityCode,
        countryCode: data.countryCode,
        provinceCode: data.provinceCode,
        uiLanguage: data.uiLanguage,
        timezone: data.timezone,
      },
      "personal_info"
    );

    setIsEditing(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  // Register global save / discard delegates for Ctrl+S & sticky save bar
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

  // Country & Province lookup for view mode
  const currentCountry = COUNTRIES_LIST.find((c) => c.code === profile.countryCode) || COUNTRIES_LIST[0];
  const currentProvince = VN_PROVINCES_LIST.find((p) => p.code === profile.provinceCode);
  const currentTimezone = TIMEZONES_LIST.find((t) => t.value === profile.timezone) || TIMEZONES_LIST[0];

  const genderLabels: Record<string, string> = {
    male: "Nam (Male)",
    female: "Nữ (Female)",
    other: "Khác (Other)",
    undisclosed: "Không tiết lộ",
  };

  return (
    <SectionCard
      id="personal-card"
      title="Thông tin cá nhân cơ bản"
      description="Quản lý họ tên, hình đại diện, ngày sinh và khu vực sinh sống của học viên."
      icon={<User className="w-5 h-5" />}
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      onEditClick={() => setIsEditing(true)}
      onCancelClick={handleResetForm}
      onSaveClick={handleSubmit(onSubmit)}
      footerNotice={
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-brand-primary shrink-0" />
          <span>
            Tên hiển thị (Nickname) sẽ xuất hiện trên Bảng vinh danh và phần bình luận bài giảng. Họ tên thật chỉ dùng trong chứng chỉ hoàn thành khóa học.
          </span>
        </div>
      }
    >
      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>Đã lưu thành công thông tin cá nhân!</span>
        </div>
      )}

      {!isEditing ? (
        /* ================= VIEW MODE ================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-xs">
          <div className="space-y-1">
            <span className="text-brand-muted font-semibold uppercase text-[11px] tracking-wider">
              Họ và tên thật
            </span>
            <div className="text-sm font-bold text-brand-navy dark:text-white">
              {profile.fullName || <span className="text-brand-muted italic">Chưa cập nhật</span>}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-brand-muted font-semibold uppercase text-[11px] tracking-wider">
              Tên hiển thị công khai (Nickname)
            </span>
            <div className="text-sm font-bold text-brand-navy dark:text-white flex items-center gap-1.5">
              <span>{profile.displayName ? `@${profile.displayName}` : <span className="text-brand-muted italic">Chưa đặt</span>}</span>
              <span className="px-1.5 py-0.5 rounded bg-brand-bg text-[10px] text-brand-secondary font-medium">
                Công khai
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-brand-muted font-semibold uppercase text-[11px] tracking-wider">
              Giới tính
            </span>
            <div className="text-sm font-bold text-brand-navy dark:text-white">
              {genderLabels[profile.gender] || "Không tiết lộ"}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-brand-muted font-semibold uppercase text-[11px] tracking-wider">
              Ngày sinh nhật
            </span>
            <div className="text-sm font-bold text-brand-navy dark:text-white">
              {profile.dateOfBirth ? formatDate(profile.dateOfBirth) : <span className="text-brand-muted italic">Chưa cập nhật</span>}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-brand-muted font-semibold uppercase text-[11px] tracking-wider">
              Quốc tịch & Nơi ở hiện tại
            </span>
            <div className="text-sm font-bold text-brand-navy dark:text-white flex items-center gap-1.5">
              <span>{currentCountry.flagEmoji}</span>
              <span>{currentCountry.nameVi}</span>
              {currentProvince && (
                <span className="text-brand-secondary font-medium">
                  • {currentProvince.nameVi}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-brand-muted font-semibold uppercase text-[11px] tracking-wider">
              Ngôn ngữ giao diện & Múi giờ
            </span>
            <div className="text-sm font-bold text-brand-navy dark:text-white">
              {profile.uiLanguage === "vi" ? "Tiếng Việt" : "English"} • {currentTimezone.labelVi}
            </div>
          </div>
        </div>
      ) : (
        /* ================= EDIT MODE (Two-Column Grid) ================= */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* 1. Full Name */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-brand-navy dark:text-white flex items-center justify-between">
                <span>Họ và tên thật *</span>
                <span className="text-[10px] text-brand-muted">Dùng trên chứng chỉ</span>
              </label>
              <input
                type="text"
                {...register("fullName")}
                placeholder="Nguyễn Văn A"
                className={`w-full h-11 px-3.5 rounded-xl border text-xs text-brand-navy dark:text-white bg-brand-bg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30 ${
                  errors.fullName ? "border-red-500" : "border-brand-border focus:border-brand-primary"
                }`}
              />
              {errors.fullName && (
                <p className="text-[11px] text-red-500 font-medium">
                  {String(errors.fullName.message || "")}
                </p>
              )}
            </div>

            {/* 2. Display Name */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-brand-navy dark:text-white flex items-center justify-between">
                <span>Tên hiển thị (Nickname) *</span>
                <span className="text-[10px] text-brand-muted">3-24 ký tự</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-xs text-brand-muted font-bold">@</span>
                <input
                  type="text"
                  {...register("displayName")}
                  placeholder="nickname_topik"
                  className={`w-full h-11 pl-8 pr-3.5 rounded-xl border text-xs text-brand-navy dark:text-white bg-brand-bg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30 ${
                    errors.displayName ? "border-red-500" : "border-brand-border focus:border-brand-primary"
                  }`}
                />
              </div>
              {errors.displayName && (
                <p className="text-[11px] text-red-500 font-medium">
                  {String(errors.displayName.message || "")}
                </p>
              )}
            </div>

            {/* 3. Gender (Segmented Control) */}
            <div className="space-y-1.5 text-left sm:col-span-2">
              <label className="text-xs font-bold text-brand-navy dark:text-white">
                Giới tính
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: "male", label: "Nam" },
                  { value: "female", label: "Nữ" },
                  { value: "other", label: "Khác" },
                  { value: "undisclosed", label: "Không tiết lộ" },
                ].map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setValue("gender", g.value as any, { shouldDirty: true })}
                    className={`h-10 px-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedGender === g.value
                        ? "border-brand-primary bg-brand-primary/10 text-brand-primary shadow-2xs"
                        : "border-brand-border bg-brand-bg text-brand-secondary hover:text-brand-navy hover:bg-brand-surface"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Date of Birth */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-brand-navy dark:text-white flex items-center justify-between">
                <span>Ngày sinh</span>
                <span className="text-[10px] text-brand-muted">Độ tuổi từ 8-100</span>
              </label>
              <input
                type="date"
                {...register("dateOfBirth")}
                className={`w-full h-11 px-3.5 rounded-xl border text-xs text-brand-navy dark:text-white bg-brand-bg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30 ${
                  errors.dateOfBirth ? "border-red-500" : "border-brand-border focus:border-brand-primary"
                }`}
              />
              {isUnder16 && (
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[11px] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>Học viên dưới 16 tuổi cần được phụ huynh đồng thuận bảo mật dữ liệu.</span>
                </div>
              )}
              {errors.dateOfBirth && (
                <p className="text-[11px] text-red-500 font-medium">
                  {String(errors.dateOfBirth.message || "")}
                </p>
              )}
            </div>

            {/* 5. Nationality */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-brand-navy dark:text-white">
                Quốc tịch
              </label>
              <select
                {...register("nationalityCode")}
                className="w-full h-11 px-3.5 rounded-xl border border-brand-border text-xs text-brand-navy dark:text-white bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                {COUNTRIES_LIST.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flagEmoji} {c.nameVi} ({c.nameEn})
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Current Location Province */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-brand-navy dark:text-white">
                Tỉnh / Thành phố đang sinh sống
              </label>
              <select
                {...register("provinceCode")}
                className="w-full h-11 px-3.5 rounded-xl border border-brand-border text-xs text-brand-navy dark:text-white bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="">-- Chọn tỉnh thành --</option>
                {VN_PROVINCES_LIST.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.nameVi}
                  </option>
                ))}
              </select>
            </div>

            {/* 7. Preferred UI Language */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-brand-navy dark:text-white">
                Ngôn ngữ giao diện chính
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setValue("uiLanguage", "vi", { shouldDirty: true })}
                  className={`h-11 px-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedLang === "vi"
                      ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                      : "border-brand-border bg-brand-bg text-brand-secondary"
                  }`}
                >
                  🇻🇳 Tiếng Việt
                </button>
                <button
                  type="button"
                  onClick={() => setValue("uiLanguage", "en", { shouldDirty: true })}
                  className={`h-11 px-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedLang === "en"
                      ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                      : "border-brand-border bg-brand-bg text-brand-secondary"
                  }`}
                >
                  🇺🇸 English
                </button>
              </div>
            </div>

            {/* 8. Timezone */}
            <div className="space-y-1.5 text-left sm:col-span-2">
              <label className="text-xs font-bold text-brand-navy dark:text-white flex items-center justify-between">
                <span>Múi giờ nhắc nhở học tập</span>
                <span className="text-[10px] text-brand-muted">Căn cứ tính giờ streak ngày</span>
              </label>
              <select
                {...register("timezone")}
                className="w-full h-11 px-3.5 rounded-xl border border-brand-border text-xs text-brand-navy dark:text-white bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                {TIMEZONES_LIST.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.labelVi}
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
