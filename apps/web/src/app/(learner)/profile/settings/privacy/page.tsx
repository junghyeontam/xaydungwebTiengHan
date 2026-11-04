"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  privacyDataSchema,
  PrivacyDataFormValues,
  accountDeletionSchema,
  AccountDeletionFormValues,
} from "@/features/profile/schemas";
import { useSettingsContext } from "@/features/profile/context/SettingsContext";
import { SectionCard } from "@/features/profile/components/SectionCard";
import {
  Lock,
  Globe,
  Users,
  EyeOff,
  Trophy,
  Flame,
  Download,
  Trash2,
  AlertTriangle,
  FileSpreadsheet,
  FileCode2,
  CheckCircle2,
  X,
  ShieldAlert,
} from "lucide-react";

export default function PrivacySettingsPage() {
  const { profile, updateProfileState, setIsDirty, registerSaveHandler, registerDiscardHandler } =
    useSettingsContext();

  const [isEditing, setIsEditing] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Export Modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");
  const [exporting, setExporting] = useState(false);

  // Deletion Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPendingDeletion, setIsPendingDeletion] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty: formIsDirty, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(privacyDataSchema) as any,
    defaultValues: {
      profileVisibility: profile.profileVisibility || "public",
      showOnLeaderboard: profile.showOnLeaderboard ?? true,
      showStreakPublic: profile.showStreakPublic ?? true,
    },
  });

  const {
    register: registerDelete,
    handleSubmit: handleSubmitDelete,
    reset: resetDelete,
    formState: { errors: deleteErrors },
  } = useForm<any>({
    resolver: zodResolver(accountDeletionSchema) as any,
    defaultValues: {
      confirmText: "",
      reason: "",
    },
  });

  useEffect(() => {
    reset({
      profileVisibility: profile.profileVisibility || "public",
      showOnLeaderboard: profile.showOnLeaderboard ?? true,
      showStreakPublic: profile.showStreakPublic ?? true,
    });
  }, [profile, reset]);

  useEffect(() => {
    setIsDirty(formIsDirty && isEditing);
  }, [formIsDirty, isEditing, setIsDirty]);

  const watchedValues = watch();

  const handleResetForm = useCallback(() => {
    reset({
      profileVisibility: profile.profileVisibility || "public",
      showOnLeaderboard: profile.showOnLeaderboard ?? true,
      showStreakPublic: profile.showStreakPublic ?? true,
    });
    setIsEditing(false);
    setIsDirty(false);
  }, [profile, reset, setIsDirty]);

  const onSubmit = (data: PrivacyDataFormValues) => {
    updateProfileState(
      {
        profileVisibility: data.profileVisibility,
        showOnLeaderboard: data.showOnLeaderboard,
        showStreakPublic: data.showStreakPublic,
      },
      "privacy"
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

  // Handle Data Export (GDPR)
  const handleExportData = () => {
    setExporting(true);
    setTimeout(() => {
      const exportData = {
        exportedAt: new Date().toISOString(),
        system: "Tiếng Hàn JungHyeon - Personal Data Export",
        userProfile: profile,
        studyStats: {
          totalXp: profile.totalXp,
          streakDays: profile.streakDays,
          currentLevel: profile.currentLevel,
          targetTopikLevel: profile.targetTopikLevel,
        },
      };

      let blob: Blob;
      let filename: string;

      if (exportFormat === "json") {
        blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        filename = `junghyeon_profile_export_${new Date().toISOString().slice(0, 10)}.json`;
      } else {
        const csvRows = [
          ["Field", "Value"],
          ["Full Name", profile.fullName],
          ["Display Name", profile.displayName],
          ["Email", profile.email],
          ["Phone", profile.phoneE164 || ""],
          ["Gender", profile.gender || ""],
          ["Date of Birth", profile.dateOfBirth || ""],
          ["Nationality", profile.nationalityCode],
          ["Country", profile.countryCode],
          ["Province", profile.provinceCode || ""],
          ["Total XP", String(profile.totalXp)],
          ["Streak Days", String(profile.streakDays)],
          ["Current Level", profile.currentLevel],
          ["Target TOPIK", String(profile.targetTopikLevel)],
          ["Exported At", new Date().toISOString()],
        ];
        const csvContent = csvRows.map((e) => e.map((val) => `"${val}"`).join(",")).join("\n");
        blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        filename = `junghyeon_profile_export_${new Date().toISOString().slice(0, 10)}.csv`;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExporting(false);
      setShowExportModal(false);
    }, 700);
  };

  // Handle Account Deletion Request
  const onSubmitDelete = (data: AccountDeletionFormValues) => {
    setIsPendingDeletion(true);
    setShowDeleteModal(false);
    resetDelete();
  };

  const handleCancelDeletion = () => {
    setIsPendingDeletion(false);
  };

  const visibilityOptions = [
    {
      value: "public" as const,
      icon: Globe,
      title: "Công khai (Mặc định)",
      desc: "Mọi học viên đều có thể xem hồ sơ, huy hiệu thành tích và cấp độ cây của bạn",
    },
    {
      value: "friends" as const,
      icon: Users,
      title: "Chỉ bạn học",
      desc: "Chỉ những học viên có liên kết bạn bè hoặc trong cùng nhóm học mới xem được",
    },
    {
      value: "private" as const,
      icon: EyeOff,
      title: "Riêng tư",
      desc: "Chỉ một mình bạn xem được hồ sơ. Ẩn thông tin khỏi các danh sách công khai",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Cập nhật tùy chọn quyền riêng tư thành công!</span>
        </div>
      )}

      {/* Pending Deletion Alert Banner */}
      {isPendingDeletion && (
        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Tài khoản đang trong thời gian ân hạn xóa (còn 14 ngày)</span>
            </div>
            <button
              onClick={handleCancelDeletion}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              Hủy yêu cầu xóa
            </button>
          </div>
          <p className="text-[11px] text-amber-800 dark:text-amber-300">
            Yêu cầu xóa tài khoản đã được ghi nhận. Trong vòng 14 ngày tới, bạn có thể hủy yêu cầu này bất cứ lúc nào. Sau 14 ngày, dữ liệu của bạn sẽ bị xóa vĩnh viễn.
          </p>
        </div>
      )}

      {/* SECTION 1: Profile Visibility & Public Leaderboard */}
      <SectionCard
        id="privacy-card"
        title="Quyền riêng tư hồ sơ & Bảng xếp hạng"
        description="Kiểm soát ai có thể xem hồ sơ cá nhân và hiển thị điểm số trên bảng thi đua"
        icon={<Lock className="w-5 h-5" />}
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        onEditClick={() => setIsEditing(true)}
        onCancelClick={handleResetForm}
        onSaveClick={handleSubmit(onSubmit)}
      >
        {!isEditing ? (
          /* View Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-brand-surface dark:bg-brand-bg border border-brand-border space-y-1">
              <div className="text-[11px] font-semibold text-brand-muted">Chế độ hiển thị hồ sơ</div>
              <div className="text-xs font-bold text-brand-navy dark:text-white flex items-center gap-2">
                {profile.profileVisibility === "public" && (
                  <>
                    <Globe className="w-4 h-4 text-brand-primary" />
                    <span>Công khai (Tất cả mọi người)</span>
                  </>
                )}
                {profile.profileVisibility === "friends" && (
                  <>
                    <Users className="w-4 h-4 text-brand-coral" />
                    <span>Chỉ bạn học</span>
                  </>
                )}
                {profile.profileVisibility === "private" && (
                  <>
                    <EyeOff className="w-4 h-4 text-brand-muted" />
                    <span>Riêng tư (Chỉ mình tôi)</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-brand-surface dark:bg-brand-bg border border-brand-border space-y-1">
              <div className="text-[11px] font-semibold text-brand-muted">Bảng xếp hạng tuần (Leaderboard)</div>
              <div className="text-xs font-bold text-brand-navy dark:text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>
                  {profile.showOnLeaderboard !== false ? "Đang bật (Hiển thị điểm thi đua)" : "Đã tắt (Ẩn danh)"}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-brand-surface dark:bg-brand-bg border border-brand-border space-y-1 md:col-span-2">
              <div className="text-[11px] font-semibold text-brand-muted">Chuỗi học liên tục (Streak)</div>
              <div className="text-xs font-bold text-brand-navy dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>
                  {profile.showStreakPublic !== false
                    ? "Hiển thị công khai ngọn lửa Streak cạnh ảnh đại diện"
                    : "Ẩn ngọn lửa Streak công khai"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Visibility Radio Cards */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-navy">Chế độ hiển thị hồ sơ</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {visibilityOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = watchedValues.profileVisibility === opt.value;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue("profileVisibility", opt.value, { shouldDirty: true })}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary"
                          : "border-brand-border bg-brand-bg hover:bg-brand-surface"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isSelected ? "text-brand-primary" : "text-brand-muted"
                          }`}
                        />
                        <span className="text-xs font-bold text-brand-navy">{opt.title}</span>
                      </div>
                      <p className="text-[11px] text-brand-muted leading-relaxed">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="space-y-3 pt-2 border-t border-brand-border">
              {/* Show on Leaderboard */}
              <div
                onClick={() =>
                  setValue("showOnLeaderboard", !watchedValues.showOnLeaderboard, {
                    shouldDirty: true,
                  })
                }
                className="p-3.5 rounded-2xl border border-brand-border bg-brand-bg hover:bg-brand-surface transition-colors cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-brand-navy">Hiển thị trên Bảng xếp hạng tuần</div>
                    <div className="text-[11px] text-brand-muted">
                      Cho phép bạn bè và cộng đồng nhìn thấy thứ hạng và điểm XP học tập của bạn
                    </div>
                  </div>
                </div>

                <div
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    watchedValues.showOnLeaderboard ? "bg-brand-primary" : "bg-neutral-300 dark:bg-neutral-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                      watchedValues.showOnLeaderboard ? "left-5.5" : "left-0.5"
                    }`}
                  />
                </div>
              </div>

              {/* Show Streak Public */}
              <div
                onClick={() =>
                  setValue("showStreakPublic", !watchedValues.showStreakPublic, {
                    shouldDirty: true,
                  })
                }
                className="p-3.5 rounded-2xl border border-brand-border bg-brand-bg hover:bg-brand-surface transition-colors cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4 fill-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-brand-navy">Hiển thị chuỗi Streak công khai</div>
                    <div className="text-[11px] text-brand-muted">
                      Huy hiệu số ngày học liên tục được hiển thị bên cạnh tên trên diễn đàn và bảng điểm
                    </div>
                  </div>
                </div>

                <div
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    watchedValues.showStreakPublic ? "bg-brand-primary" : "bg-neutral-300 dark:bg-neutral-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                      watchedValues.showStreakPublic ? "left-5.5" : "left-0.5"
                    }`}
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      </SectionCard>

      {/* SECTION 2: Data Export (GDPR Portability) */}
      <div className="rounded-3xl bg-white dark:bg-brand-surface border border-brand-border p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-brand-navy flex items-center gap-2">
              <Download className="w-4 h-4 text-brand-primary" />
              <span>Xuất & Tải xuống dữ liệu học tập cá nhân</span>
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Tải bản sao toàn bộ thông tin hồ sơ, kho từ vựng đã thuộc, thẻ SRS và lịch sử tiến độ học
            </p>
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2.5 rounded-xl border border-brand-border bg-brand-bg hover:bg-brand-surface text-xs font-bold text-brand-navy transition-all shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-brand-primary" />
            <span>Tải xuống dữ liệu</span>
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-brand-surface dark:bg-brand-bg border border-brand-border text-xs text-brand-muted leading-relaxed">
          💡 Bản sao dữ liệu chứa đầy đủ các thông tin theo chuẩn bảo vệ dữ liệu cá nhân (GDPR & PDPA): hồ sơ học viên, lộ trình ngữ pháp đã hoàn thành, danh sách từ vựng SRS theo từng cấp độ TOPIK.
        </div>
      </div>

      {/* SECTION 3: Danger Zone - Account Deletion */}
      <div className="rounded-3xl bg-white dark:bg-brand-surface border border-destructive/20 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-destructive flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-destructive" />
              <span>Vùng nguy hiểm: Yêu cầu xóa tài khoản</span>
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Xóa vĩnh viễn tài khoản và toàn bộ lịch sử tiến độ học tập trên Tiếng Hàn JungHyeon
            </p>
          </div>

          {!isPendingDeletion ? (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2.5 rounded-xl bg-destructive hover:bg-destructive/90 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Yêu cầu xóa tài khoản</span>
            </button>
          ) : (
            <button
              onClick={handleCancelDeletion}
              className="px-4 py-2.5 rounded-xl border border-brand-border bg-brand-bg hover:bg-brand-surface text-xs font-bold text-brand-navy transition-all shadow-xs shrink-0"
            >
              Hủy yêu cầu xóa
            </button>
          )}
        </div>

        <div className="p-3.5 rounded-2xl bg-destructive/5 border border-destructive/15 text-xs text-destructive/90 leading-relaxed">
          ⚠️ <strong>Quy định xóa tài khoản:</strong> Sau khi bạn gửi yêu cầu, hệ thống sẽ kích hoạt <strong>thời gian ân hạn 14 ngày</strong>. Bạn có thể đăng nhập lại bất cứ lúc nào trong 14 ngày để hủy xóa. Khi hết 14 ngày, dữ liệu (XP, Streak, Lộ trình, Thẻ từ vựng) sẽ bị xóa vĩnh viễn và không thể khôi phục.
        </div>
      </div>

      {/* MODAL: Data Export */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in-50">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-brand-surface border border-brand-border shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-brand-navy">Tải xuống dữ liệu cá nhân</h3>
                  <p className="text-[11px] text-brand-muted">Chọn định dạng file xuất</p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-8 h-8 rounded-full hover:bg-brand-bg flex items-center justify-center text-brand-muted hover:text-brand-navy transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat("json")}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  exportFormat === "json"
                    ? "border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary"
                    : "border-brand-border bg-brand-bg hover:bg-brand-surface"
                }`}
              >
                <FileCode2 className="w-5 h-5 text-brand-primary mb-1.5" />
                <div className="text-xs font-bold text-brand-navy">File JSON</div>
                <div className="text-[10px] text-brand-muted">Đầy đủ cấu trúc trường dữ liệu</div>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat("csv")}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  exportFormat === "csv"
                    ? "border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary"
                    : "border-brand-border bg-brand-bg hover:bg-brand-surface"
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 mb-1.5" />
                <div className="text-xs font-bold text-brand-navy">File CSV / Excel</div>
                <div className="text-[10px] text-brand-muted">Dễ xem dạng bảng tính</div>
              </button>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-xl border border-brand-border text-xs font-bold text-brand-body hover:bg-brand-bg transition-colors"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleExportData}
                disabled={exporting}
                className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {exporting ? (
                  <span>Đang khởi tạo tệp...</span>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải về ngay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Account Deletion Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-brand-surface border border-brand-border shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-brand-navy">Xác nhận yêu cầu xóa tài khoản</h3>
                  <p className="text-[11px] text-brand-muted">Hành động này có thể đảo ngược trong 14 ngày</p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-8 h-8 rounded-full hover:bg-brand-bg flex items-center justify-center text-brand-muted hover:text-brand-navy transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-brand-body leading-relaxed">
              Vui lòng gõ chính xác cụm từ <strong className="text-destructive font-mono">XÓA TÀI KHOẢN</strong> vào ô bên dưới để xác nhận yêu cầu xóa vĩnh viễn hồ sơ và dữ liệu.
            </p>

            <form onSubmit={handleSubmitDelete(onSubmitDelete)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-brand-navy">Cụm từ xác nhận</label>
                <input
                  type="text"
                  placeholder="XÓA TÀI KHOẢN"
                  {...registerDelete("confirmText")}
                  className={`w-full h-11 px-3.5 rounded-xl border text-xs text-brand-navy bg-white dark:bg-brand-bg focus:outline-hidden focus:ring-2 focus:ring-destructive/30 transition-all ${
                    deleteErrors.confirmText ? "border-destructive" : "border-brand-border"
                  }`}
                />
                {deleteErrors.confirmText && (
                  <p className="text-[11px] text-destructive">{String(deleteErrors.confirmText.message || "")}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-brand-navy">Lý do rời đi (tùy chọn)</label>
                <textarea
                  rows={2}
                  placeholder="Chia sẻ lý do để JungHyeon hoàn thiện tốt hơn..."
                  {...registerDelete("reason")}
                  className="w-full p-3 rounded-xl border border-brand-border text-xs text-brand-navy bg-white dark:bg-brand-bg focus:outline-hidden focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-xl border border-brand-border text-xs font-bold text-brand-body hover:bg-brand-bg transition-colors"
                >
                  Hủy thao tác
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-destructive hover:bg-destructive/90 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Xác nhận yêu cầu xóa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
