"use client";

import React, { useState, useRef, useEffect } from "react";
import { MascotHoney } from "@/components/ui/MascotHoney";
import { Send, Bot, User, Sparkles, Phone, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

interface HoneyChatbotProps {
  onMeetHumanAdvisor: () => void;
}

export function HoneyChatbot({ onMeetHumanAdvisor }: HoneyChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      role: "assistant",
      content:
        "Xin chào bạn! Mình là chú hổ Honey 🐯 - Trợ lý AI của Tiếng Hàn JungHyeon. Bạn đang thắc mắc về ngữ pháp, học phí, hay muốn tìm lộ trình học phù hợp nhất?",
      time: "Vừa xong",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickQuestions = [
    "Học phí các khoá học?",
    "Phân biệt 은/는 và 이/가",
    "Mất bao lâu để đạt TOPIK 3?",
    "Học từ số 0 bắt đầu từ đâu?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/honey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.reply || "Honey luôn sẵn sàng lắng nghe bạn!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-xs overflow-hidden flex flex-col h-[560px]">
      {/* Header Chatbot */}
      <div className="p-4 bg-[#EEF5FF] dark:bg-[#111F36] border-b border-[#D5E5FA] dark:border-[#1E3252] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-brand-surface border border-[#D5E5FA] dark:border-brand-border flex items-center justify-center shrink-0 shadow-2xs">
            <MascotHoney mood="wave" size={36} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-brand-navy">Trợ lý AI Honey</h3>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] font-bold">
                Online
              </span>
            </div>
            <p className="text-[11px] text-brand-secondary">Giải đáp ngữ pháp & khoá học 24/7</p>
          </div>
        </div>

        {/* Nút gặp tư vấn viên thật */}
        <button
          onClick={onMeetHumanAdvisor}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-brand-surface border border-[#D5E5FA] dark:border-brand-border hover:bg-[#F7F9FC] text-brand-navy text-xs font-bold shadow-2xs transition-all active:scale-95"
        >
          <Phone className="w-3.5 h-3.5 text-brand-primary" />
          <span className="hidden sm:inline">Gặp tư vấn viên thật</span>
        </button>
      </div>

      {/* Danh sách tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {m.role === "assistant" ? (
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 flex items-center justify-center shrink-0">
                <MascotHoney mood="study" size={28} />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-brand-primary text-white rounded-tr-none shadow-xs"
                  : "bg-[#F7F9FC] dark:bg-white/5 text-brand-navy dark:text-white border border-brand-border/70 rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-line">{m.content}</p>
              <span
                className={`text-[9px] block text-right mt-1 ${
                  m.role === "user" ? "text-white/70" : "text-brand-secondary"
                }`}
              >
                {m.time}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-brand-secondary italic pl-11">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" />
            <span>Honey đang soạn câu trả lời...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Gợi ý câu hỏi nhanh */}
      <div className="px-4 py-2 border-t border-brand-border/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-[#EEF5FF] dark:bg-white/5 dark:hover:bg-brand-tint border border-brand-border text-[11px] text-brand-secondary hover:text-brand-primary whitespace-nowrap transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Ô nhập tin nhắn */}
      <div className="p-3 bg-white dark:bg-brand-surface border-t border-brand-border flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Hỏi Honey về ngữ pháp, khoá học, học phí..."
          className="flex-1 px-4 py-2.5 rounded-full border border-brand-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center hover:bg-brand-primary-hover disabled:opacity-50 transition-all active:scale-95 shrink-0 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
