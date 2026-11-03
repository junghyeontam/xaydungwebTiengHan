"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { BRAND_CONFIG } from "@/config/brand";
import { MascotHoney } from "@/components/shared/MascotHoney";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";

export default function ContactSupportPage() {
  const { locale } = useI18n();
  const isEn = locale === "en";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg(
        isEn
          ? "Please fill in all required fields (Name, Phone, and Message)."
          : "Vui lòng điền đầy đủ họ tên, số điện thoại và nội dung cần hỗ trợ."
      );
      return;
    }

    setIsSubmitting(true);

    const leadPayload = {
      id: `support-${Date.now()}`,
      fullName,
      phone,
      email,
      goal: `[Hỗ trợ học viên] ${subject}: ${message.substring(0, 80)}`,
      source: "contact_page",
      status: "new" as const,
      createdAt: new Date().toISOString(),
    };

    // 1. Call public API
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload),
      });
    } catch (err) {
      console.warn("Save support inquiry API error:", err);
    }

    // 2. Save ticket to leads in localStorage
    try {
      const leads = JSON.parse(localStorage.getItem("junghyeon_leads") || "[]");
      leads.unshift(leadPayload);
      localStorage.setItem("junghyeon_leads", JSON.stringify(leads));
      window.dispatchEvent(new Event("jh_leads_updated"));
    } catch (err) {
      console.warn("Save support inquiry error:", err);
    }

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-brand-bg py-10 sm:py-14 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-8">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-secondary hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isEn ? "Back to Home" : "Về Trang chủ"}</span>
        </Link>

        {/* Header */}
        <div className="space-y-3 pb-6 border-b border-brand-border">
          <Badge variant="tint">
            <MessageSquare className="w-3.5 h-3.5 mr-1" />
            <span>{isEn ? "Student Helpdesk" : "Trung tâm Trợ giúp Học viên"}</span>
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            {isEn ? "Contact & Learner Support" : "Liên hệ & Hỗ trợ Học viên"}
          </h1>
          <p className="text-xs sm:text-sm text-brand-secondary max-w-2xl leading-relaxed">
            {isEn
              ? "We are here to assist your Korean learning journey. Reach out anytime for roadmap advice, technical issues, or account upgrades."
              : "Đội ngũ chuyên viên sư phạm và kỹ thuật JungHyeon luôn sẵn sàng đồng hành cùng bạn trên chặng đường chinh phục tiếng Hàn."}
          </p>
        </div>

        {/* 2 Columns: Contact Cards (Left) + Direct Ticket Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contact Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-brand-surface border border-brand-border shadow-xs space-y-5">
              <h2 className="text-base font-bold text-brand-navy">
                {isEn ? "Direct Contact Channels" : "Kênh liên hệ trực tiếp"}
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-brand-body">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-tint text-brand-primary flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-brand-muted uppercase">Hotline 24/7</div>
                    <a href={`tel:${BRAND_CONFIG.contact.hotline.replace(/\s/g, "")}`} className="font-bold text-brand-navy hover:text-brand-primary transition-colors">
                      {BRAND_CONFIG.contact.hotlineDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-tint text-brand-primary flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-brand-muted uppercase">Email học vụ</div>
                    <a href={`mailto:${BRAND_CONFIG.contact.email}`} className="font-bold text-brand-navy hover:text-brand-primary transition-colors">
                      {BRAND_CONFIG.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-tint text-brand-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-brand-muted uppercase">Trụ sở học thuật</div>
                    <p className="text-brand-secondary">{BRAND_CONFIG.contact.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-tint text-brand-primary flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-brand-muted uppercase">Thời gian làm việc</div>
                    <p className="text-brand-secondary">{BRAND_CONFIG.contact.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Honey Mascot encouragement card */}
            <div className="p-5 rounded-2xl bg-brand-tint border border-brand-frame/60 flex items-center gap-4 shadow-2xs">
              <div className="w-14 h-14 rounded-full bg-white dark:bg-brand-surface flex items-center justify-center shrink-0 shadow-xs">
                <MascotHoney mood="wave" size={48} />
              </div>
              <div className="text-xs text-brand-body leading-relaxed">
                <p className="font-bold text-brand-navy">Chú hổ Honey 24/7</p>
                <p className="text-brand-secondary text-[11px] mt-0.5">
                  &ldquo;Bạn có thắc mắc bài giảng? Hãy nhấn vào biểu tượng Trợ lý Honey ở góc phải dưới nhé!&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Support Inquiry Form */}
          <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-brand-surface border border-brand-border p-6 sm:p-8 shadow-card">
            {isSuccess ? (
              <div className="py-10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-brand-success/10 text-brand-success flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy">
                  {isEn ? "Inquiry Sent Successfully!" : "Gửi yêu cầu hỗ trợ thành công!"}
                </h3>
                <p className="text-xs sm:text-sm text-brand-secondary max-w-md mx-auto leading-relaxed">
                  {isEn
                    ? "Thank you! Our academic support advisor will reach out to you within 30 minutes."
                    : "Cảm ơn bạn! Ban Học vụ JungHyeon đã tiếp nhận thông tin và sẽ liên hệ hỗ trợ bạn qua điện thoại hoặc Zalo trong vòng 30 phút."}
                </p>
                <div className="pt-2">
                  <Button variant="secondary" size="md" onClick={() => setIsSuccess(false)}>
                    {isEn ? "Send Another Message" : "Gửi thêm yêu cầu khác"}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-bold text-brand-navy mb-2">
                  {isEn ? "Send Support Ticket" : "Gửi yêu cầu hỗ trợ trực tuyến"}
                </h3>

                {errorMsg && (
                  <div className="p-3 rounded-control bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-brand-navy">
                      {isEn ? "Full Name *" : "Họ và tên *"}
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 rounded-control border border-brand-border bg-brand-bg text-xs text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-brand-navy">
                      {isEn ? "Phone Number *" : "Số điện thoại *"}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0988 123 456"
                      className="w-full px-3.5 py-2.5 rounded-control border border-brand-border bg-brand-bg text-xs text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-brand-navy">
                    {isEn ? "Email Address" : "Địa chỉ Email"}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="banhoc@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-control border border-brand-border bg-brand-bg text-xs text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-brand-navy">
                    {isEn ? "Inquiry Category" : "Vấn đề cần hỗ trợ"}
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-control border border-brand-border bg-brand-bg text-xs text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  >
                    <option value="tu-van-lo-trinh">{isEn ? "Course Roadmap Advice" : "Tư vấn lộ trình học từ số 0"}</option>
                    <option value="kich-hoat-vip">{isEn ? "VIP Activation & Payment" : "Kích hoạt tài khoản VIP & Thanh toán"}</option>
                    <option value="ho-tro-bai-tap">{isEn ? "Exercise & Grammar Question" : "Hỏi đáp ngữ pháp & bài tập"}</option>
                    <option value="khac">{isEn ? "Other Inquiry" : "Vấn đề khác"}</option>
                  </select>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-brand-navy">
                    {isEn ? "Detailed Message *" : "Nội dung chi tiết *"}
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Vui lòng mô tả câu hỏi hoặc nội dung bạn cần hỗ trợ..."
                    className="w-full px-3.5 py-2.5 rounded-control border border-brand-border bg-brand-bg text-xs text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  iconRight={<Send className="w-4 h-4" />}
                  className="w-full justify-center font-bold"
                >
                  {isEn ? "Send Support Ticket" : "Gửi yêu cầu hỗ trợ"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
