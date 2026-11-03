"use client";

import React, { useState } from "react";
import { BRAND_CONFIG } from "@/config/brand";
import { PlacementTestModal } from "@/components/consultation/PlacementTestModal";
import { HoneyChatbot } from "@/components/consultation/HoneyChatbot";
import { MascotHoney } from "@/components/ui/MascotHoney";
import {
  Sparkles,
  Phone,
  Calendar,
  MessageSquare,
  Bot,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  ExternalLink,
} from "lucide-react";

export default function ConsultationPage() {
  const [activeTab, setActiveTab] = useState<"form" | "booking" | "ai-chat">("form");
  const [isPlacementTestOpen, setIsPlacementTestOpen] = useState(false);

  // Full consultation inquiry form
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("study_abroad");
  const [currentLevel, setCurrentLevel] = useState("zero");
  const [studyMode, setStudyMode] = useState("online");
  const [preferredTime, setPreferredTime] = useState("evening");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // 1-on-1 advisor consultation booking form
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTimeSlot, setBookingTimeSlot] = useState("19:30 - 20:00");
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const validateVnPhone = (p: string) => /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(p.trim().replace(/\s|\./g, ""));

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (honeypot) return; // Prevent bot spam
    if (!fullName.trim()) {
      setFormError("Vui lòng nhập họ và tên của bạn.");
      return;
    }
    if (!validateVnPhone(phone)) {
      setFormError("Vui lòng nhập số điện thoại Việt Nam hợp lệ (ví dụ: 0988123456).");
      return;
    }

    // Call public leads API & save to LocalStorage fallback
    try {
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          goal: `${goal} (${currentLevel}, ${studyMode})`,
          source: "Trang tư vấn chuyên sâu (/consultation)",
        }),
      }).catch(() => {});
    } catch {}

    const existingLeads = JSON.parse(localStorage.getItem("junghyeon_leads") || "[]");
    existingLeads.unshift({
      id: `lead-${Date.now()}`,
      fullName,
      phone,
      email,
      goal: `${goal} (${currentLevel}, ${studyMode})`,
      currentLevel,
      studyMode,
      preferredTime,
      notes,
      source: "Trang tư vấn chuyên sâu (/consultation)",
      status: "new",
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("junghyeon_leads", JSON.stringify(existingLeads));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("jh_leads_updated"));
    }

    setFormSuccess(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateVnPhone(bookingPhone) || !bookingName.trim() || !bookingDate) {
      alert("Vui lòng điền đầy đủ ngày, họ tên và số điện thoại.");
      return;
    }

    const appointments = JSON.parse(localStorage.getItem("junghyeon_appointments") || "[]");
    appointments.push({
      id: `app-${Date.now()}`,
      fullName: bookingName,
      phone: bookingPhone,
      date: bookingDate,
      timeSlot: bookingTimeSlot,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("junghyeon_appointments", JSON.stringify(appointments));

    setBookingSuccess(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* 1. Consultation Page Header Banner */}
      <div className="rounded-[32px] sm:rounded-[40px] bg-[#EEF5FF] dark:bg-[#111F36] border border-[#D5E5FA] dark:border-[#1E3252] p-8 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 text-xs font-semibold text-brand-primary border border-[#D5E5FA] dark:border-white/10 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              <span>Tư vấn cá nhân hoá 1 kèm 1</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
              Lộ trình riêng biệt cho mục tiêu của bạn
            </h1>
            <p className="text-sm text-brand-secondary leading-relaxed">
              Bạn muốn du học, thi chứng chỉ TOPIK hay đi làm tại tập đoàn Hàn Quốc? Đội ngũ giảng viên Thạc sĩ JungHyeon sẽ phân tích và lập kế hoạch rõ ràng nhất.
            </p>
          </div>

          {/* Placement test banner */}
          <div className="p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-brand-surface border border-[#D5E5FA] dark:border-brand-border text-center space-y-2.5 shrink-0 w-full md:w-auto shadow-2xs">
            <span className="text-xs font-bold text-brand-navy block">
              Chưa biết mình ở trình độ nào?
            </span>
            <button
              onClick={() => setIsPlacementTestOpen(true)}
              className="w-full px-6 py-3 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              Làm bài Test xếp lớp miễn phí (12 câu)
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-3">
        <button
          onClick={() => setActiveTab("form")}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "form"
              ? "bg-brand-primary text-white shadow-xs"
              : "bg-white dark:bg-brand-surface border border-[#D5E5FA] dark:border-brand-border text-brand-secondary hover:text-brand-navy"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Gửi yêu cầu tư vấn</span>
        </button>

        <button
          onClick={() => setActiveTab("booking")}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "booking"
              ? "bg-brand-primary text-white shadow-xs"
              : "bg-white dark:bg-brand-surface border border-[#D5E5FA] dark:border-brand-border text-brand-secondary hover:text-brand-navy"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Đặt lịch hẹn 1 kèm 1</span>
        </button>

        <button
          onClick={() => setActiveTab("ai-chat")}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "ai-chat"
              ? "bg-brand-primary text-white shadow-xs"
              : "bg-white dark:bg-brand-surface border border-[#D5E5FA] dark:border-brand-border text-brand-secondary hover:text-brand-navy"
          }`}
        >
          <Bot className="w-4 h-4 text-amber-500" />
          <span>Chat AI Honey</span>
        </button>
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form / Booking / AI Chat (8/12 cols) */}
        <div className="lg:col-span-8">
          {/* TAB 1: CONSULTATION FORM */}
          {activeTab === "form" && (
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-bold text-brand-navy">
                  Đăng ký nhận tư vấn lộ trình học miễn phí
                </h3>
                <p className="text-xs text-brand-secondary mt-1">
                  Điền các thông tin cơ bản để cố vấn định hướng khoá học và giáo trình sát nhất.
                </p>
              </div>

              {formSuccess ? (
                <div className="p-8 text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-2xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-brand-navy">
                    Gửi thông tin thành công!
                  </h4>
                  <p className="text-xs text-brand-secondary max-w-md mx-auto">
                    Cảm ơn bạn! Đội ngũ tư vấn viên JungHyeon đã nhận được thông tin và sẽ gọi điện hỗ trợ bạn sớm nhất.
                  </p>
                  <button
                    onClick={() => setFormSuccess(false)}
                    className="px-6 py-2.5 rounded-full bg-white dark:bg-brand-surface border border-brand-border text-xs font-bold text-brand-navy shadow-2xs hover:bg-[#F7F9FC]"
                  >
                    Đăng ký cho người khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                  />

                  {formError && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-navy">Họ và tên *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-navy">Số điện thoại (Zalo) *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0988 123 456"
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-background text-xs sm:text-sm font-num text-foreground focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-navy">Email nhận tài liệu</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="hocvien@gmail.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-navy">Mục tiêu học</label>
                      <select
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                      >
                        <option value="study_abroad">Du học Hàn Quốc</option>
                        <option value="employment">Xuất khẩu lao động / Doanh nghiệp Hàn</option>
                        <option value="topik">Lấy chứng chỉ TOPIK 1 - 6</option>
                        <option value="kpop_culture">Giao tiếp, xem phim, đu idol K-Pop</option>
                        <option value="travel">Du lịch & Giao tiếp cơ bản</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-navy">Hình thức học mong muốn</label>
                      <select
                        value={studyMode}
                        onChange={(e) => setStudyMode(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                      >
                        <option value="online">Học Online linh hoạt qua website / PWA</option>
                        <option value="offline">Học kèm 1:1 cùng giáo viên</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-navy">Thời gian tiện nghe máy</label>
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                      >
                        <option value="immediate">Gọi ngay bây giờ</option>
                        <option value="morning">Buổi sáng (08:30 - 11:30)</option>
                        <option value="afternoon">Buổi chiều (14:00 - 17:30)</option>
                        <option value="evening">Buổi tối (18:30 - 21:00)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-navy">Ghi chú thêm (nếu có)</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Bạn đã học tiếng Hàn bao giờ chưa? Bạn muốn đạt chứng chỉ vào tháng mấy?..."
                      className="w-full p-3 rounded-xl border border-brand-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    Gửi yêu cầu tư vấn ngay
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: SCHEDULE 1-ON-1 BOOKING */}
          {activeTab === "booking" && (
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-bold text-brand-navy">
                  Đặt lịch trao đổi 1 kèm 1 với Cố vấn học thuật
                </h3>
                <p className="text-xs text-brand-secondary mt-1">
                  Chọn khung giờ bạn rảnh để giáo viên gọi video tư vấn kỹ lưỡng qua Google Meet / Zalo.
                </p>
              </div>

              {bookingSuccess ? (
                <div className="p-8 text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-2xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-brand-navy">
                    Đặt lịch thành công!
                  </h4>
                  <p className="text-xs text-brand-secondary">
                    Lịch hẹn lúc <strong>{bookingTimeSlot}</strong> ngày <strong>{bookingDate}</strong> đã được ghi nhận. Thầy cô sẽ liên hệ bạn đúng giờ!
                  </p>
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="px-6 py-2.5 rounded-full bg-white dark:bg-brand-surface border border-brand-border text-xs font-bold text-brand-navy shadow-2xs hover:bg-[#F7F9FC]"
                  >
                    Đặt thêm lịch khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-navy">Chọn ngày *</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-navy">Chọn khung giờ rảnh *</label>
                      <select
                        value={bookingTimeSlot}
                        onChange={(e) => setBookingTimeSlot(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                      >
                        <option value="09:00 - 09:30">09:00 - 09:30 (Sáng)</option>
                        <option value="10:30 - 11:00">10:30 - 11:00 (Sáng)</option>
                        <option value="14:30 - 15:00">14:30 - 15:00 (Chiều)</option>
                        <option value="16:00 - 16:30">16:00 - 16:30 (Chiều)</option>
                        <option value="19:30 - 20:00">19:30 - 20:00 (Tối - Khuyên dùng)</option>
                        <option value="20:30 - 21:00">20:30 - 21:00 (Tối)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-navy">Họ và tên bạn *</label>
                      <input
                        type="text"
                        required
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder="Trần Thị B"
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-navy">Số điện thoại *</label>
                      <input
                        type="tel"
                        required
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        placeholder="0912 345 678"
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-background text-xs sm:text-sm font-num text-foreground focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    Xác nhận đặt lịch hẹn
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: HONEY AI ASSISTANT CHATBOT */}
          {activeTab === "ai-chat" && (
            <HoneyChatbot
              onMeetHumanAdvisor={() => setActiveTab("form")}
            />
          )}
        </div>

        {/* Right Column: Contact Channels & Office Info (4/12 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-brand-navy uppercase tracking-wider">
              Kênh kết nối tức thì
            </h3>

            <div className="space-y-2.5 text-xs">
              <a
                href={`tel:${BRAND_CONFIG.contact.hotline.replace(/\./g, "")}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#EEF5FF] hover:bg-[#E3EFFF] border border-[#D5E5FA] text-brand-primary font-bold transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-brand-primary flex items-center justify-center shrink-0 shadow-2xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-brand-secondary font-normal">Hotline tư vấn 24/7</div>
                  <div className="text-sm font-num font-bold text-brand-navy">{BRAND_CONFIG.contact.hotlineDisplay}</div>
                </div>
              </a>

              <a
                href={BRAND_CONFIG.contact.zaloUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-brand-surface hover:bg-[#F7F9FC] border border-brand-border/80 font-bold text-brand-navy transition-all shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xs font-bold">ZL</span>
                  <span className="text-xs">Chat qua Zalo Official</span>
                </div>
                <ExternalLink className="w-4 h-4 text-brand-secondary" />
              </a>

              <a
                href={BRAND_CONFIG.contact.messengerUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-brand-surface hover:bg-[#F7F9FC] border border-brand-border/80 font-bold text-brand-navy transition-all shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-xs">💬</span>
                  <span className="text-xs">Nhắn tin Facebook Messenger</span>
                </div>
                <ExternalLink className="w-4 h-4 text-brand-secondary" />
              </a>
            </div>
          </div>

          <div className="p-5 rounded-2xl sm:rounded-3xl bg-[#F7F9FC] dark:bg-brand-surface border border-brand-border/80 text-xs space-y-2.5 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-brand-navy">
              <MapPin className="w-4 h-4 text-brand-primary" />
              <span>Văn phòng Trung tâm:</span>
            </div>
            <p className="text-brand-secondary leading-relaxed pl-6">
              {BRAND_CONFIG.contact.address}
            </p>
            <div className="flex items-center gap-2 font-bold text-brand-navy pt-1">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Giờ tiếp đón:</span>
            </div>
            <p className="text-brand-secondary pl-6">
              {BRAND_CONFIG.contact.workingHours}
            </p>
          </div>
        </div>
      </div>

      {/* Placement Test Modal */}
      <PlacementTestModal
        isOpen={isPlacementTestOpen}
        onClose={() => setIsPlacementTestOpen(false)}
        onGoToConsultation={() => setActiveTab("form")}
      />
    </div>
  );
}
