"use client";

import React from "react";
import { GraduationCap, Users, BookOpen, CheckCircle2 } from "lucide-react";
import { Num, Percent } from "@/components/shared";

const ASSIGNED_CLASSES = [
  {
    id: "cls-topik1-a",
    name: "TOPIK 1 — Sơ cấp 1A (Tối 2-4-6)",
    level: "TOPIK 1",
    studentsCount: 32,
    avgProgress: 0.84,
    activeLesson: "Bài 3: Đuôi câu thân mật -아요 / -어요",
  },
  {
    id: "cls-topik2-b",
    name: "TOPIK 2 — Sơ cấp 2B (Tối 3-5-7)",
    level: "TOPIK 2",
    studentsCount: 28,
    avgProgress: 0.76,
    activeLesson: "Bài 8: Bất quy tắc ㅂ & Đuôi câu -(으)니까",
  },
  {
    id: "cls-topik3-intensive",
    name: "TOPIK 3 — Trung cấp Thực chiến",
    level: "TOPIK 3",
    studentsCount: 24,
    avgProgress: 0.68,
    activeLesson: "Cấu trúc biểu đạt nguyên nhân -느라고 & -기 때문에",
  },
];

export default function TeacherClassesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-admin-text-primary flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-brand-primary" />
          <span>Lớp học phụ trách (Assigned Classes)</span>
        </h1>
        <p className="text-xs text-admin-text-secondary mt-1">
          Theo dõi tiến độ học viên trong phạm vi lớp học được phân công (RLS Scoped).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ASSIGNED_CLASSES.map((cls) => (
          <div
            key={cls.id}
            className="p-5 rounded-card bg-admin-surface border border-admin-border shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-tint text-brand-primary">
                {cls.level}
              </span>
              <span className="text-xs text-admin-text-muted flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <Num value={cls.studentsCount} /> học viên
              </span>
            </div>
            <h2 className="text-sm font-bold text-admin-text-primary">{cls.name}</h2>
            <div className="text-xs text-admin-text-secondary flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-brand-primary shrink-0" />
              <span className="truncate">{cls.activeLesson}</span>
            </div>
            <div className="pt-2 border-t border-admin-border flex items-center justify-between text-xs">
              <span className="text-admin-text-muted">Tiến độ trung bình:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <Percent value={cls.avgProgress} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
