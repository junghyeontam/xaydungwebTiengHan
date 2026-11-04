"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactAccountSchema, ContactAccountFormValues } from "@/features/profile/schemas";
import { useSettingsContext } from "@/features/profile/context/SettingsContext";
import { SectionCard } from "@/features/profile/components/SectionCard";
import { formatPhoneVN } from "@/lib/format";
import { maskPhone } from "@/lib/utils/masking";
import {
  ShieldCheck,
  Mail,
  Phone,
  Lock,
  KeyRound,
  Laptop,
  Smartphone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LogOut,
} from "lucide-react";

export default function AccountSettingsPage() {
  const { profile, updateProfileState, setIsDirty, registerSaveHandler, registerDiscardHandler } =
    useSettingsContext();

  const [isEditing, setIsEditing] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [showPhoneUnmasked, setShowPhoneUnmasked] = useState(false);

  // Email Change Modal State
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailNotice, setEmailNotice] = useState("");

  // Password Change Modal State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passError, setPassError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty: formIsDirty, isSubmitting },
  } = useForm<ContactAccountFormValues>({
    resolver: zodResolver(contactAccountSchema),
    defaultValues: {
      email: profile.email || "",
      phone: profile.phoneE164 || "",
    },
  });

  useEffect(() => {
    setIsDirty(formIsDirty && isEditing);
  }, [formIsDirty, isEditing, setIsDirty]);

  const handleResetForm = useCallback(() => {
    reset({
      email: profile.email || "",
      phone: profile.phoneE164 || "",
    });
    setIsEditing(false);
    setIsDirty(false);
  }, [profile, reset, setIsDirty]);

  const onSubmit = (data: ContactAccountFormValues) => {
    updateProfileState(
      {
        phoneE164: data.phone,
      },
      "contact_account"
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

  // Password strength score 0-4
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };
  const passScore = getPasswordStrength(newPass);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !emailPassword) return;

    setEmailNotice(`Đã gửi email xác minh tới ${newEmail}. Vui lòng bấm vào liên kết trong thư để hoàn tất đổi địa chỉ.`);
    setTimeout(() => {
      setIsChangeEmailOpen(false);
      setEmailNotice("");
      setNewEmail("");
      setEmailPassword("");
    }, 3500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");

    if (newPass.length < 8) {
      setPassError("Mật khẩu mới tối thiểu 8 ký tự");
      return;
    }
    if (newPass !== confirmPass) {
      setPassError("Mật khẩu xác nhận không khớp");
      return;
    }

    alert("Đổi mật khẩu thành công! Bạn sẽ cần dùng mật khẩu mới trong lần đăng nhập tiếp theo.");
    setIsChangePasswordOpen(false);
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
  };

  // Mock Active Sessions
  const sessions = [
    {
      id: "sess-1",
      device: "Windows PC / Google Chrome",
      location: "Hà Nội, Việt Nam",
      ip: "118.70.124.90",
      lastActive: "Đang hoạt động",
      isCurrent: true,
      icon: Laptop,
    },
    {
      id: "sess-2",
      device: "iPhone 15 Pro / Safari Mobile",
      location: "Hà Nội, Việt Nam",
      ip: "14.162.24.112",
      lastActive: "2 giờ trước",
      isCurrent: false,
      icon: Smartphone,
    },
  ];

  return (
    <SectionCard
      id="account-card"
      title="Tài khoản & Bảo mật Thông tin"
      description="Quản lý địa chỉ email đăng nhập, số điện thoại khôi phục, mật khẩu và các phiên đăng nhập."
      icon={<ShieldCheck className="w-5 h-5" />}
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      onEditClick={() => setIsEditing(true)}
      onCancelClick={handleResetForm}
      onSaveClick={handleSubmit(onSubmit)}
    >
      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>Đã cập nhật thông tin liên hệ thành công!</span>
        </div>
      )}

      {/* 1. Email & Phone row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        {/* Email Field (Always Read-only with Change Email Modal) */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-bold text-brand-navy dark:text-white flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-brand-primary" />
              <span>Địa chỉ Email *</span>
            </span>
            <span className="text-[10px] text-brand-muted flex items-center gap-1">
              <Lock className="w-3 h-3" /> Cố định
            </span>
          </label>
          <div className="h-11 px-3.5 rounded-xl border border-brand-border bg-brand-surface dark:bg-brand-bg flex items-center justify-between">
            <span className="font-semibold text-brand-navy dark:text-white truncate">
              {profile.email}
            </span>
            <button
              type="button"
              onClick={() => setIsChangeEmailOpen(true)}
              className="text-[11px] font-bold text-brand-primary hover:underline shrink-0 ml-2"
            >
              Đổi email
            </button>
          </div>
        </div>

        {/* Phone Field */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-bold text-brand-navy dark:text-white flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-primary" />
              <span>Số điện thoại bảo mật</span>
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
              {profile.phoneVerified ? "Đã liên kết" : "Chưa xác minh"}
            </span>
          </label>

          {!isEditing ? (
            <div className="h-11 px-3.5 rounded-xl border border-brand-border bg-brand-bg flex items-center justify-between">
              <span className="font-bold text-brand-navy dark:text-white">
                {profile.phoneE164 ? (
                  showPhoneUnmasked ? (
                    formatPhoneVN(profile.phoneE164)
                  ) : (
                    maskPhone(profile.phoneE164)
                  )
                ) : (
                  <span className="text-brand-muted italic font-normal">Chưa cập nhật</span>
                )}
              </span>
              {profile.phoneE164 && (
                <button
                  type="button"
                  onClick={() => setShowPhoneUnmasked(!showPhoneUnmasked)}
                  className="p-1 text-brand-muted hover:text-brand-primary"
                  title={showPhoneUnmasked ? "Ẩn số điện thoại" : "Hiện số điện thoại"}
                >
                  {showPhoneUnmasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
          ) : (
            <div>
              <input
                type="text"
                {...register("phone")}
                placeholder="0988 112 233"
                className={`w-full h-11 px-3.5 rounded-xl border text-xs text-brand-navy dark:text-white bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 ${
                  errors.phone ? "border-red-500" : "border-brand-border focus:border-brand-primary"
                }`}
              />
              {errors.phone && (
                <p className="text-[11px] text-red-500 font-medium mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Password & Linked Auth Methods */}
      <div className="pt-6 border-t border-brand-border/60 space-y-4">
        <h4 className="text-xs font-bold text-brand-navy dark:text-white uppercase tracking-wider">
          Phương thức Đăng nhập & Mật khẩu
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-brand-border bg-brand-bg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-brand-surface border border-brand-border flex items-center justify-center font-bold text-brand-primary">
                G
              </div>
              <div>
                <div className="font-bold text-brand-navy dark:text-white text-xs">
                  Tài khoản Google
                </div>
                <div className="text-[11px] text-emerald-600 font-medium">
                  Đã liên kết ({profile.email})
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 text-[10px] font-bold">
              Đang hoạt động
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-brand-border bg-brand-bg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-brand-surface border border-brand-border flex items-center justify-center text-brand-primary">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-brand-navy dark:text-white text-xs">
                  Mật khẩu bảo vệ
                </div>
                <div className="text-[11px] text-brand-muted">
                  Đổi lần cuối: 30 ngày trước
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsChangePasswordOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-brand-border bg-white dark:bg-brand-surface text-xs font-bold text-brand-navy hover:bg-brand-tint transition-colors"
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>

      {/* 3. Active Sessions */}
      <div className="pt-6 border-t border-brand-border/60 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-brand-navy dark:text-white uppercase tracking-wider">
            Thiết bị đăng nhập hoạt động
          </h4>
          <button
            type="button"
            onClick={() => alert("Đã đăng xuất tài khoản khỏi tất cả các thiết bị khác thành công!")}
            className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất tất cả thiết bị khác</span>
          </button>
        </div>

        <div className="space-y-2">
          {sessions.map((sess) => {
            const Icon = sess.icon;
            return (
              <div
                key={sess.id}
                className="p-3.5 rounded-2xl border border-brand-border bg-brand-bg flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-brand-surface border border-brand-border flex items-center justify-center text-brand-primary">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-brand-navy dark:text-white">
                      {sess.device}
                    </div>
                    <div className="text-[11px] text-brand-muted">
                      {sess.location} • IP: {sess.ip}
                    </div>
                  </div>
                </div>

                {sess.isCurrent ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                    Thiết bị này
                  </span>
                ) : (
                  <span className="text-[11px] text-brand-muted font-num">
                    {sess.lastActive}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Change Email Modal */}
      {isChangeEmailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-brand-surface rounded-3xl border border-brand-border shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-brand-navy dark:text-white">
              Yêu cầu đổi địa chỉ Email
            </h3>
            <p className="text-xs text-brand-secondary">
              Hệ thống sẽ gửi mã kích hoạt đến email mới để bảo vệ an toàn tài khoản học viên.
            </p>

            {emailNotice ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-700 text-xs font-semibold">
                {emailNotice}
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium mb-1">Email mới *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="email.moi@gmail.com"
                    className="w-full h-10 px-3 rounded-xl border border-brand-border bg-brand-bg"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Mật khẩu xác thực hiện tại *</label>
                  <input
                    type="password"
                    required
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 px-3 rounded-xl border border-brand-border bg-brand-bg"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsChangeEmailOpen(false)}
                    className="px-3 py-1.5 rounded-xl border text-xs"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-brand-primary text-white text-xs font-bold"
                  >
                    Gửi xác thực
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-brand-surface rounded-3xl border border-brand-border shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-brand-navy dark:text-white">
              Cập nhật Mật khẩu Đăng nhập
            </h3>

            {passError && (
              <div className="p-3 rounded-xl bg-red-500/10 text-red-600 text-xs font-semibold">
                {passError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Mật khẩu hiện tại *</label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 px-3 rounded-xl border border-brand-border bg-brand-bg"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Mật khẩu mới *</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Tối thiểu 8 ký tự, gồm số & chữ in hoa"
                  className="w-full h-10 px-3 rounded-xl border border-brand-border bg-brand-bg"
                />
                {/* Strength Meter */}
                {newPass && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex gap-1 h-1.5">
                      <div className={`flex-1 rounded-full ${passScore >= 1 ? "bg-red-500" : "bg-brand-border"}`} />
                      <div className={`flex-1 rounded-full ${passScore >= 2 ? "bg-amber-500" : "bg-brand-border"}`} />
                      <div className={`flex-1 rounded-full ${passScore >= 3 ? "bg-blue-500" : "bg-brand-border"}`} />
                      <div className={`flex-1 rounded-full ${passScore >= 4 ? "bg-emerald-500" : "bg-brand-border"}`} />
                    </div>
                    <span className="text-[10px] text-brand-muted">
                      Độ mạnh: {passScore < 2 ? "Yếu" : passScore === 3 ? "Khá tốt" : "Rất an toàn"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">Xác nhận mật khẩu mới *</label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full h-10 px-3 rounded-xl border border-brand-border bg-brand-bg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-3 py-1.5 rounded-xl border text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-brand-primary text-white text-xs font-bold"
                >
                  Lưu mật khẩu mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
