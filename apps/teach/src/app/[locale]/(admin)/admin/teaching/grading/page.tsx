"use client";

import React, { useState } from "react";
import { CheckSquare, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { Num } from "@/components/shared";

interface SubmissionItem {
  id: string;
  studentName: string;
  classCode: string;
  lessonTitle: string;
  submittedAnswer: string;
  status: "pending" | "graded";
  score?: number;
}

const INITIAL_SUBMISSIONS: SubmissionItem[] = [
  {
    id: "sub-101",
    studentName: "Nguyễn Minh Anh",
    classCode: "TOPIK 1A",
    lessonTitle: "Bài 1: Giới thiệu bản thân N은/는 N이에요/예요",
    submittedAnswer: "저는 베트남 사람이에요. 제 이름은 민안이에요.",
    status: "pending",
  },
  {
    id: "sub-102",
    studentName: "Trần Hoàng Nam",
    classCode: "TOPIK 2B",
    lessonTitle: "Bài 3: Đuôi câu thân mật -아요 / -어요",
    submittedAnswer: "주말에 친구하고 같이 한국 영화를 봐요.",
    status: "pending",
  },
  {
    id: "sub-103",
    studentName: "Lê Thu Trang",
    classCode: "TOPIK 1A",
    lessonTitle: "Bài 2: Tồn tại & Sở hữu N이/가 있어요/없어요",
    submittedAnswer: "교실에 책상하고 의자가 있어요.",
    status: "graded",
    score: 95,
  },
];

export default function TeacherGradingPage() {
  const [items, setItems] = useState<SubmissionItem[]>(INITIAL_SUBMISSIONS);

  const handleApproveScore = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "graded", score: 100 } : item))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-admin-text-primary flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-brand-primary" />
          <span>Chấm bài & Đánh giá (Grading Queue)</span>
        </h1>
        <p className="text-xs text-admin-text-secondary mt-1">
          Chấm điểm bài tập tự luận, đặt câu ngữ pháp và luyện phát âm của học viên.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((sub) => (
          <div
            key={sub.id}
            className="p-5 rounded-card bg-admin-surface border border-admin-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-admin-text-primary">{sub.studentName}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-admin-subtle border border-admin-border text-admin-text-secondary">
                  {sub.classCode}
                </span>
                {sub.status === "pending" ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Chờ chấm
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Đã chấm (<Num value={sub.score || 100} /> điểm)
                  </span>
                )}
              </div>
              <div className="text-xs text-admin-text-muted">{sub.lessonTitle}</div>
              <div className="p-3 rounded-xl bg-admin-subtle border border-admin-border font-korean text-sm text-admin-text-primary">
                “{sub.submittedAnswer}”
              </div>
            </div>

            {sub.status === "pending" && (
              <button
                type="button"
                onClick={() => handleApproveScore(sub.id)}
                className="px-4 py-2 rounded-control bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs shrink-0 inline-flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chấm 100đ & Gửi nhận xét</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
