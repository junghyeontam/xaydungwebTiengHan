"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  FileText,
  User,
} from "lucide-react";
import { Button } from "@/components/shared/Button";

interface FeedbackThread {
  id: string;
  lessonTitle: string;
  reviewerName: string;
  reviewerRole: string;
  commentVi: string;
  createdAt: string;
  status: "open" | "resolved";
  replies: { author: string; text: string; time: string }[];
}

export default function TeacherFeedbackPage() {
  const [threads, setThreads] = useState<FeedbackThread[]>([
    {
      id: "fb-1",
      lessonTitle: "Bài 3: Đuôi câu thân mật (-아요 / -어요 / -여요)",
      reviewerName: "Huyền Trang",
      reviewerRole: "Publisher / Ban kiểm duyệt",
      commentVi:
        "Phần giải thích trường hợp bất quy tắc '하다 -> 해요' nên bổ sung thêm 2 ví dụ thực tế về '공부하다' và '운동하다' để học viên dễ nắm bắt hơn nhé thầy.",
      createdAt: "2 giờ trước",
      status: "open",
      replies: [],
    },
    {
      id: "fb-2",
      lessonTitle: "Bài 1: Giới thiệu bản thân (은/는 & 이에요/예요)",
      reviewerName: "Park Min-woo",
      reviewerRole: "Cố vấn chuyên môn Seoul",
      commentVi:
        "Nội dung chuẩn xác và các file phát âm giọng Seoul rất tự nhiên. Đã phê duyệt và xuất bản!",
      createdAt: "3 ngày trước",
      status: "resolved",
      replies: [
        {
          author: "Bạn (Teacher)",
          text: "Cảm ơn thầy Park đã thẩm định kỹ lưỡng!",
          time: "3 ngày trước",
        },
      ],
    },
  ]);

  const [replyInput, setReplyInput] = useState<{ [id: string]: string }>({});

  const handleSendReply = (threadId: string) => {
    const text = replyInput[threadId];
    if (!text || !text.trim()) return;

    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              replies: [
                ...t.replies,
                { author: "Bạn (Teacher)", text: text.trim(), time: "Vừa xong" },
              ],
            }
          : t
      )
    );
    setReplyInput((prev) => ({ ...prev, [threadId]: "" }));
  };

  const handleResolve = (threadId: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, status: "resolved" } : t))
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
              Cơ chế phản hồi kiểm duyệt
            </span>
            <span className="text-xs text-brand-secondary">
              Ý kiến thẩm định từ Ban kiểm duyệt và Cố vấn ngôn ngữ
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-brand-navy">
            Góp Ý & Phản Hồi Bài Học
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        {threads.map((thread) => {
          const isOpen = thread.status === "open";
          return (
            <div
              key={thread.id}
              className={`p-6 rounded-2xl border bg-white shadow-xs space-y-4 transition-all ${
                isOpen ? "border-brand-primary/40" : "border-brand-border"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brand-border/60">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-brand-secondary flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-brand-primary" />
                    {thread.lessonTitle}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-brand-navy">
                      {thread.reviewerName}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-brand-surface border border-brand-border text-brand-secondary">
                      {thread.reviewerRole}
                    </span>
                    <span className="text-xs text-brand-secondary">· {thread.createdAt}</span>
                  </div>
                </div>

                <div>
                  {isOpen ? (
                    <button
                      onClick={() => handleResolve(thread.id)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đánh dấu đã giải quyết
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Đã hoàn tất
                    </span>
                  )}
                </div>
              </div>

              {/* Reviewer Comment */}
              <div className="p-3.5 rounded-xl bg-brand-surface/40 border border-brand-border/60 text-xs text-brand-navy leading-relaxed">
                {thread.commentVi}
              </div>

              {/* Replies */}
              {thread.replies.length > 0 && (
                <div className="space-y-2 pl-4 border-l-2 border-brand-primary/30">
                  {thread.replies.map((reply, idx) => (
                    <div key={idx} className="text-xs space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-brand-navy">{reply.author}</span>
                        <span className="text-[11px] text-brand-secondary">· {reply.time}</span>
                      </div>
                      <p className="text-brand-secondary">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Box */}
              {isOpen && (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={replyInput[thread.id] || ""}
                    onChange={(e) =>
                      setReplyInput((prev) => ({ ...prev, [thread.id]: e.target.value }))
                    }
                    placeholder="Nhập phản hồi trao đổi với người duyệt..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Send className="w-3 h-3" />}
                    onClick={() => handleSendReply(thread.id)}
                  >
                    Gửi
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
