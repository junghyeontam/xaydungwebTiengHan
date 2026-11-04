"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { MascotHoney } from "@/components/shared/MascotHoney";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  User,
  Target,
  Sparkles,
} from "lucide-react";

export function QuickConsultationBlock() {
  const { locale, t } = useI18n();
  const isEn = locale === "en";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("du-hoc");
  const [honeypot, setHoneypot] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateVietnamesePhone = (phoneStr: string) => {
    const vnPhoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    return vnPhoneRegex.test(phoneStr.trim().replace(/\s|\./g, ""));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (honeypot) return;

    if (!fullName.trim()) {
      setErrorMsg(
        isEn
          ? "Please enter your full name."
          : "Vui lòng nhập họ và tên của bạn."
      );
      return;
    }

    if (!validateVietnamesePhone(phone)) {
      setErrorMsg(
        isEn
          ? "Please enter a valid phone number (e.g. 0988123456)."
          : "Vui lòng nhập số điện thoại hợp lệ (ví dụ: 0988123456)."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          goal,
          source: "homepage_quick_consult",
        }),
      }).catch(() => {});
    } catch {}

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      const leads = JSON.parse(
        localStorage.getItem("junghyeon_leads") || "[]"
      );
      leads.unshift({
        id: `lead-${Date.now()}`,
        fullName,
        phone,
        email,
        goal,
        source: "Form tư vấn nhanh (Trang chủ)",
        status: "new",
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("junghyeon_leads", JSON.stringify(leads));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("jh_leads_updated"));
      }
    }, 600);
  };

  return (
    <section id="tu-van-nhanh" className="py-20 sm:py-24 bg-brand-surface/50 transition-colors">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="rounded-container bg-brand-tint border border-brand-frame/70 p-6 sm:p-10 lg:p-14 shadow-xs relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Headings & Mascot */}
            <ScrollReveal animation="fade-right" distance={24} className="lg:col-span-5 space-y-6">
              <Badge variant="tint">{t("quickConsult.badge") || (isEn ? "1-on-1 Consultation" : "Tư vấn lộ trình")}</Badge>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
                {t("quickConsult.title")}
              </h2>

              <p className="text-sm sm:text-base text-brand-secondary leading-relaxed">
                {t("quickConsult.subtitle")}
              </p>

              {/* Honey Message Card */}
              <div className="p-4 rounded-card bg-brand-bg border border-brand-border flex items-center gap-3.5 shadow-2xs max-w-md">
                <div className="w-12 h-12 rounded-full bg-brand-tint flex items-center justify-center shrink-0">
                  <MascotHoney mood="wave" size={44} />
                </div>
                <div className="text-xs text-brand-body leading-relaxed">
                  <p className="font-bold text-brand-navy">
                    {isEn ? "Honey's Advice:" : "Honey nhắn nhủ:"}
                  </p>
                  <p className="text-brand-muted mt-0.5">
                    {isEn
                      ? '"Learning Korean is fun when you have the right roadmap from day one!"'
                      : '"Học tiếng Hàn không khó, chỉ cần bạn có lộ trình đúng ngay từ ngày đầu tiên!"'}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Column: Form Container */}
            <ScrollReveal animation="fade-left" distance={24} delay={0.15} className="lg:col-span-7 rounded-card bg-brand-bg border border-brand-border p-6 sm:p-8 shadow-card">
              {isSuccess ? (
                <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 rounded-full bg-brand-success/10 text-brand-success flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-navy">
                    {isEn ? "Request Submitted Successfully!" : "Gửi thông tin thành công!"}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-secondary max-w-md mx-auto">
                    {t("quickConsult.successMsg")}
                  </p>
                  <div className="pt-2">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => setIsSuccess(false)}
                    >
                      {isEn ? "Send Another Request" : "Gửi thêm yêu cầu khác"}
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-control bg-brand-danger/10 border border-brand-danger/20 text-brand-danger text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <input
                    type="text"
                    name="website_url_check"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-brand-navy flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-brand-muted" />
                        <span>{t("quickConsult.nameLabel")} *</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-control border border-brand-border bg-brand-surface text-brand-body placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-brand-navy flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-brand-muted" />
                        <span>{t("quickConsult.phoneLabel")} *</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="0988 123 456"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-control border border-brand-border bg-brand-surface text-brand-body placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all num"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-navy flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-brand-muted" />
                      <span>{t("quickConsult.emailLabel")}</span>
                    </label>
                    <input
                      type="email"
                      placeholder="ban@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-control border border-brand-border bg-brand-surface text-brand-body placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-navy flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-brand-muted" />
                      <span>{t("quickConsult.goalLabel")}</span>
                    </label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-control border border-brand-border bg-brand-surface text-brand-body focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                    >
                      <option value="du-hoc">Du học Hàn Quốc (Visa D2, D4-1)</option>
                      <option value="topik-1-2">Lấy chứng chỉ TOPIK 1 - 2 (Sơ cấp)</option>
                      <option value="topik-3-4">Luyện thi TOPIK 3 - 4 (Đi làm)</option>
                      <option value="topik-5-6">Thi TOPIK 5 - 6 (Biên phiên dịch)</option>
                      <option value="giao-tiep-nhanh">Học giao tiếp đi du lịch / kết hôn</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="cta"
                      size="lg"
                      loading={isSubmitting}
                      iconRight={<Send className="w-4 h-4" />}
                      className="w-full justify-center"
                    >
                      {t("quickConsult.submitBtn")}
                    </Button>
                  </div>
                </form>
              )}
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuickConsultationBlock;
