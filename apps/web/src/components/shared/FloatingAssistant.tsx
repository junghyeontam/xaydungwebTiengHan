"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BRAND_CONFIG } from "@/config/brand";
import { MascotHoney } from "@/components/shared/MascotHoney";
import { useI18n } from "@/lib/i18n/I18nContext";
import {
  X,
  Send,
  Sparkles,
  Phone,
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Bot,
  User,
  ShieldAlert,
} from "lucide-react";

export interface FloatingAssistantProps {
  className?: string;
}

interface ChatMessage {
  id: string;
  sender: "honey" | "user";
  text: string;
  time?: string;
}

/**
 * Universal Unified FloatingAssistant Component:
 * - Single source of truth for AI Assistant & Learner Support across all pages
 * - Smooth royal blue pill with Mascot Honey & online indicator
 * - Collapses into compact 48px circle on scroll to prevent covering page buttons
 * - Interactive AI Chat (connected to /api/ai/honey) + Quick Support (Hotline, Zalo, Issue Report)
 * - Safe area aware on mobile (bottom-20) and desktop (bottom-6)
 */
export function FloatingAssistant({ className = "" }: FloatingAssistantProps) {
  const { locale, t } = useI18n();
  const isEn = locale === "en";

  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "support">("chat");

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "honey",
      text: isEn
        ? "Annyeong! I'm Honey the baby tiger 🐯. Ask me any Korean grammar question or study roadmap details!"
        : "Annyeong! Mình là chú hổ Honey 🐯. Bạn cần mình giải đáp thắc mắc ngữ pháp, học phí hay tư vấn lộ trình học nào hôm nay?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Content Issue Report Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportCategory, setReportCategory] = useState("typo");
  const [reportComment, setReportComment] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (isOpen && activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, activeTab]);

  // Collapse on scroll down, expand when at top or scrolling up
  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > 200 && currentY > lastY) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
      lastY = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/honey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "honey",
            text: data.reply || (isEn ? "Honey is here to support you!" : "Honey luôn sẵn sàng đồng hành cùng bạn! ✨"),
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        throw new Error("Failed to fetch response");
      }
    } catch {
      // Fallback offline answers
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-fb-${Date.now()}`,
            sender: "honey",
            text: isEn
              ? "Honey recorded your question! You can explore the Roadmap tab or contact our teacher directly for 1-on-1 guidance."
              : "Honey đã ghi nhận câu hỏi của bạn! Bạn có thể xem lộ trình tại tab 'Lộ trình' hoặc gọi Hotline 0988 123 456 để được cô giáo hỗ trợ nhanh nhất nhé! 🌺",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_report",
          issueCategory: reportCategory,
          description: reportComment,
          contextText: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: "content_reported",
          metadata: {
            category: reportCategory,
            comment: reportComment,
            url: typeof window !== "undefined" ? window.location.href : "",
          },
        }),
      });
    } catch {}

    setReportSubmitted(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSubmitted(false);
      setReportComment("");
    }, 1600);
  };

  const quickPrompts = isEn
    ? [
        "How to learn Hangul in 3 days?",
        "Difference between 은/는 and 이/가",
        "Lifetime VIP plan perks",
      ]
    : [
        "Cách học bảng chữ cái Hangul?",
        "Phân biệt 은/는 và 이/가",
        "Quyền lợi VIP trọn đời",
      ];

  return (
    <>
      {/* Global Fixed Position Container */}
      <div
        className={`fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-3 select-none transition-all duration-300 ${className}`}
      >
        {/* Main Floating Trigger Button */}
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`group relative flex items-center gap-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white shadow-card hover:shadow-card-hover transition-all duration-300 active:scale-95 cursor-pointer border border-white/20 ${
              isCollapsed
                ? "w-12 h-12 p-0 justify-center rounded-full"
                : "px-4 py-2.5 sm:px-4.5 sm:py-3"
            }`}
            aria-label={isEn ? "Open Honey AI Assistant" : "Mở trợ lý Honey AI"}
            title={isEn ? "Honey AI & 24/7 Support" : "Trợ lý Honey AI & Hỗ trợ 24/7"}
          >
            {/* Status pulsing dot */}
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />

            {/* Mascot Face Icon */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 flex items-center justify-center overflow-hidden shrink-0">
              <MascotHoney size={32} mood="wave" />
            </div>

            {/* Label - hidden when collapsed on scroll */}
            {!isCollapsed && (
              <div className="flex flex-col text-left leading-none pr-1">
                <span className="text-xs font-bold tracking-tight whitespace-nowrap">
                  {isEn ? "Honey AI Tutor" : "Trợ lý Honey"}
                </span>
                <span className="text-[10px] text-white/80 font-medium mt-0.5">
                  {isEn ? "24/7 Support" : "Hỗ trợ 24/7"}
                </span>
              </div>
            )}
          </button>
        )}

        {/* Assistant Window (Chat & Support) */}
        {isOpen && (
          <div className="w-[340px] sm:w-[380px] max-h-[85vh] sm:max-h-[580px] rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-2xl overflow-hidden flex flex-col animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 bg-brand-primary text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  <MascotHoney size={36} mood="celebrate" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5 leading-tight">
                    <span>Honey AI Assistant</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[10px] text-white/80">
                    {isEn ? "Tiếng Hàn JungHyeon • Online 24/7" : "Tiếng Hàn JungHyeon • Hỗ trợ 24/7"}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Đóng trợ lý"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Navigation: Chat vs Hỗ trợ & Báo lỗi */}
            <div className="flex border-b border-brand-border/60 bg-brand-surface/40 text-xs font-bold text-brand-secondary">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                  activeTab === "chat"
                    ? "text-brand-primary border-brand-primary bg-white dark:bg-brand-surface"
                    : "border-transparent hover:text-brand-navy"
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>{isEn ? "AI Chatbot" : "Hỏi đáp AI"}</span>
              </button>
              <button
                onClick={() => setActiveTab("support")}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                  activeTab === "support"
                    ? "text-brand-primary border-brand-primary bg-white dark:bg-brand-surface"
                    : "border-transparent hover:text-brand-navy"
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{isEn ? "Support & Contact" : "Hỗ trợ & Báo lỗi"}</span>
              </button>
            </div>

            {/* Tab 1: AI Chat View */}
            {activeTab === "chat" && (
              <div className="flex-1 flex flex-col min-h-0 bg-brand-bg">
                {/* Messages Container */}
                <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs min-h-[220px] max-h-[300px]">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                          m.sender === "user"
                            ? "bg-brand-primary text-white rounded-tr-xs"
                            : "bg-brand-surface text-brand-body border border-brand-border/60 rounded-tl-xs"
                        }`}
                      >
                        <p>{m.text}</p>
                        {m.time && (
                          <span
                            className={`block text-[9px] mt-1 text-right ${
                              m.sender === "user" ? "text-white/70" : "text-brand-muted"
                            }`}
                          >
                            {m.time}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="p-3 rounded-2xl bg-brand-surface border border-brand-border/60 text-brand-secondary text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-brand-primary animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 rounded-full bg-brand-primary animate-bounce [animation-delay:0.4s]" />
                        <span className="text-[11px] text-brand-muted ml-1">Honey đang suy nghĩ...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestion Chips */}
                <div className="px-3 py-2 flex flex-wrap gap-1.5 border-t border-brand-border/60 bg-brand-surface/30">
                  {quickPrompts.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white dark:bg-brand-surface hover:bg-brand-tint border border-brand-border/60 hover:border-brand-primary text-brand-secondary hover:text-brand-primary transition-colors text-left cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="p-2.5 border-t border-brand-border/60 flex items-center gap-1.5 bg-white dark:bg-brand-surface">
                  <input
                    type="text"
                    placeholder={isEn ? "Ask Honey a question..." : "Hỏi chú hổ Honey..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-brand-border/80 bg-brand-surface text-brand-body placeholder:text-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="p-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-40 text-white transition-colors cursor-pointer"
                    aria-label="Gửi tin nhắn"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Support, Hotline & Report View */}
            {activeTab === "support" && (
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-brand-bg">
                {/* Hotline Card */}
                <a
                  href={`tel:${BRAND_CONFIG.contact.hotline.replace(/\./g, "")}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-xs hover:border-brand-primary transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF5FF] dark:bg-[#15253F] text-brand-primary flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-brand-navy">
                        {isEn ? "Hotline Support" : "Hotline / Zalo tư vấn"}
                      </div>
                      <div className="text-[11px] font-semibold text-brand-primary">
                        {BRAND_CONFIG.contact.hotlineDisplay}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-brand-muted group-hover:text-brand-primary transition-colors" />
                </a>

                {/* Zalo OA */}
                <a
                  href={BRAND_CONFIG.contact.zaloUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-xs hover:border-sky-500 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center shrink-0 font-bold">
                      ZL
                    </div>
                    <div>
                      <div className="font-bold text-brand-navy">Zalo Official Account</div>
                      <div className="text-[11px] text-brand-secondary">
                        {isEn ? "Direct chat with academic staff" : "Nhắn tin trực tiếp với giáo viên"}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-brand-muted group-hover:text-sky-600 transition-colors" />
                </a>

                {/* 1-on-1 Consultation */}
                <Link
                  href="/consultation"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-xs hover:border-brand-primary transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-brand-navy">
                        {isEn ? "Book 1-on-1 Consultation" : "Đặt hẹn Tư vấn lộ trình 1-1"}
                      </div>
                      <div className="text-[11px] text-brand-secondary">
                        {isEn ? "Free roadmap & study plan" : "Đánh giá trình độ và xây dựng lộ trình"}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-brand-muted group-hover:text-brand-primary transition-colors" />
                </Link>

                {/* Report Content Issue */}
                <button
                  type="button"
                  onClick={() => setReportModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-red-50/60 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 text-left hover:border-red-400 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-red-700 dark:text-red-400">
                        {isEn ? "Report a Content Issue" : "Báo lỗi nội dung / Lỗi bài học"}
                      </div>
                      <div className="text-[11px] text-brand-secondary">
                        {isEn ? "Report typos or audio bugs to admin" : "Góp ý chính tả, audio hoặc lỗi hệ thống"}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content Issue Report Dialog Modal */}
      {reportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setReportModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
              <div className="flex items-center gap-2 text-brand-navy font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>{isEn ? "Report a Problem" : "Báo cáo nội dung hoặc lỗi"}</span>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                className="p-1 rounded-lg text-brand-muted hover:text-brand-navy transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-brand-success mx-auto animate-bounce" />
                <h4 className="font-bold text-brand-navy">
                  {isEn ? "Thank you for reporting!" : "Cảm ơn bạn đã đóng góp!"}
                </h4>
                <p className="text-xs text-brand-secondary">
                  {isEn
                    ? "Our content team has received your report and will verify it."
                    : "Đội ngũ chuyên môn JungHyeon đã nhận được thông tin và sẽ kiểm tra ngay."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-navy">
                    {isEn ? "Category" : "Loại phản ánh"}
                  </label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border/80 bg-brand-surface text-brand-body focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  >
                    <option value="typo">{isEn ? "Typo or Grammar Error" : "Sai chính tả / Ngữ pháp"}</option>
                    <option value="audio">{isEn ? "Audio / Pronunciation Issue" : "Lỗi âm thanh phát âm"}</option>
                    <option value="translation">{isEn ? "Translation Inaccuracy" : "Bản dịch tiếng Việt chưa chuẩn"}</option>
                    <option value="technical">{isEn ? "Technical / UI Bug" : "Lỗi hiển thị / Kỹ thuật"}</option>
                    <option value="other">{isEn ? "Other Feedback" : "Góp ý khác"}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-navy">
                    {isEn ? "Detailed Description" : "Mô tả chi tiết"}
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder={
                      isEn
                        ? "Describe the issue or specify the incorrect word..."
                        : "Vui lòng mô tả cụ thể từ ngữ sai hoặc vấn đề bạn gặp phải..."
                    }
                    value={reportComment}
                    onChange={(e) => setReportComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border/80 bg-brand-surface text-brand-body placeholder:text-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-primary resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-brand-border/80 text-xs font-semibold text-brand-secondary hover:bg-brand-surface transition-colors cursor-pointer"
                  >
                    {isEn ? "Cancel" : "Hủy"}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    {isEn ? "Submit Report" : "Gửi phản ánh"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingAssistant;
