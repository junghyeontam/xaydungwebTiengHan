"use client";

import React, { useState } from "react";
import { useAuth, AuthModalTab } from "@/lib/context/AuthContext";
import { MascotHoney } from "@/components/ui/MascotHoney";
import { BrandLogo } from "@/components/ui/BrandLogo";
import {
  X,
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Send,
} from "lucide-react";

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalTab,
    setAuthModalOpen,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    loginWithMagicLink,
    resetPassword,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setErrorMsg("");
    setSuccessMsg("");
    setAuthModalOpen(false);
  };

  const handleSwitchTab = (tab: AuthModalTab) => {
    setErrorMsg("");
    setSuccessMsg("");
    setAuthModalOpen(true, tab);
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const res = await loginWithGoogle();
      if (res?.error) {
        setErrorMsg(res.error);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Đăng nhập Google thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      if (authModalTab === "login") {
        const res = await loginWithEmail(email, password);
        if (res.error) setErrorMsg(res.error);
      } else if (authModalTab === "register") {
        if (password.length < 6) {
          setErrorMsg("Mật khẩu cần tối thiểu 6 ký tự.");
          setIsSubmitting(false);
          return;
        }
        const res = await registerWithEmail(email, password, fullName);
        if (res.error) setErrorMsg(res.error);
      } else if (authModalTab === "magic-link") {
        const res = await loginWithMagicLink(email);
        if (res.error) setErrorMsg(res.error);
        if (res.message) setSuccessMsg(res.message);
      } else if (authModalTab === "forgot") {
        const res = await resetPassword(email);
        if (res.error) setErrorMsg(res.error);
        if (res.message) setSuccessMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-card rounded-3xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
          aria-label="Đóng cửa sổ"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header với linh vật Honey */}
        <div className="bg-gradient-to-b from-junghyeon-cream to-card dark:from-junghyeon-dark-card dark:to-card p-6 pb-4 text-center border-b border-border/60">
          <div className="flex justify-center mb-2">
            <MascotHoney
              mood={
                authModalTab === "register"
                  ? "celebrate"
                  : authModalTab === "forgot"
                  ? "thinking"
                  : "wave"
              }
              size={68}
            />
          </div>
          <BrandLogo size="sm" showSubtitle={false} className="justify-center" />
          <p className="text-xs text-muted-foreground mt-1">
            {authModalTab === "login" && "Chào mừng bạn quay lại học tiếng Hàn!"}
            {authModalTab === "register" && "Gia nhập cộng đồng 25.000+ học viên JungHyeon"}
            {authModalTab === "magic-link" && "Đăng nhập nhanh không cần nhớ mật khẩu"}
            {authModalTab === "forgot" && "Khôi phục quyền truy cập vào tài khoản của bạn"}
          </p>
        </div>

        {/* Nội dung Form */}
        <div className="p-6 space-y-4">
          {/* Thông báo lỗi & thành công */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Nút đăng nhập Google OAuth 1-Click */}
          {(authModalTab === "login" || authModalTab === "register") && (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-border bg-background hover:bg-secondary text-xs sm:text-sm font-bold text-foreground transition-all shadow-xs active:scale-95 group disabled:opacity-50 cursor-pointer"
              >
                {/* SVG Google chuẩn */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Tiếp tục với Google</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-border w-full" />
                <span className="bg-card px-3 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                  hoặc bằng email
                </span>
              </div>
            </>
          )}

          {/* Form nhập thông tin */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalTab === "register" && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Họ và tên</label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-junghyeon-teal outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="banhoc@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-junghyeon-teal outline-none transition-all"
                />
              </div>
            </div>

            {(authModalTab === "login" || authModalTab === "register") && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">Mật khẩu</label>
                  {authModalTab === "login" && (
                    <button
                      type="button"
                      onClick={() => handleSwitchTab("forgot")}
                      className="text-[11px] text-junghyeon-teal hover:underline"
                    >
                      Quên mật khẩu?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-junghyeon-teal outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Nút gửi chính */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-2xl bg-junghyeon-coral hover:bg-junghyeon-coral-hover text-white text-xs sm:text-sm font-bold shadow-coral-glow transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {isSubmitting ? (
                <span>Đang xử lý...</span>
              ) : (
                <>
                  <span>
                    {authModalTab === "login" && "Đăng nhập ngay"}
                    {authModalTab === "register" && "Tạo tài khoản (+50 XP)"}
                    {authModalTab === "magic-link" && "Gửi link đăng nhập qua Email"}
                    {authModalTab === "forgot" && "Gửi link đặt lại mật khẩu"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Chuyển đổi qua lại giữa các tab */}
          <div className="pt-2 text-center text-xs text-muted-foreground space-y-2 border-t border-border/60">
            {authModalTab === "login" && (
              <>
                <p>
                  Chưa có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => handleSwitchTab("register")}
                    className="font-bold text-junghyeon-teal hover:underline"
                  >
                    Đăng ký miễn phí
                  </button>
                </p>
                <p>
                  Hoặc{" "}
                  <button
                    type="button"
                    onClick={() => handleSwitchTab("magic-link")}
                    className="text-muted-foreground hover:text-foreground underline"
                  >
                    Đăng nhập bằng Magic Link
                  </button>
                </p>
              </>
            )}

            {authModalTab === "register" && (
              <p>
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => handleSwitchTab("login")}
                  className="font-bold text-junghyeon-teal hover:underline"
                >
                  Đăng nhập
                </button>
              </p>
            )}

            {(authModalTab === "magic-link" || authModalTab === "forgot") && (
              <button
                type="button"
                onClick={() => handleSwitchTab("login")}
                className="font-bold text-junghyeon-teal hover:underline"
              >
                ← Quay lại đăng nhập bằng mật khẩu
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
