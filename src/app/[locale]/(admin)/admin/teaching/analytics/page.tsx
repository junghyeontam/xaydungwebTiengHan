"use client";

import React from "react";
import {
  LineChart,
  Users,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Award,
  BookOpen,
} from "lucide-react";

export default function TeacherAnalyticsPage() {
  const kpiStats = [
    { label: "Lượt học viên bắt đầu bài học", value: "3.420", change: "+14% tuần này" },
    { label: "Tỷ lệ hoàn thành trung bình", value: "86.4%", change: "+2.1% so với mục tiêu" },
    { label: "Đánh giá sao trung bình", value: "4.92 / 5.0", change: "Từ 520 học viên" },
    { label: "Số lượng từ vựng đã nhớ (SRS)", value: "14.280", change: "Cập nhật hôm nay" },
  ];

  const lessonPerformances = [
    {
      title: "Bài 1: Giới thiệu bản thân (은/는 & 이에요/예요)",
      starts: "1.240",
      completionRate: "92%",
      hardestExercise: "Phân biệt 은/는 vs 이/가",
      avgMinutes: "18.5p",
    },
    {
      title: "Bài 2: Tồn tại & Sở hữu (이/가 & 있어요/없어요)",
      starts: "980",
      completionRate: "88%",
      hardestExercise: "Chia 있어요 khi hỏi địa điểm",
      avgMinutes: "21.2p",
    },
    {
      title: "Bài 3: Đuôi câu thân mật (-아요 / -어요 / -여요)",
      starts: "650",
      completionRate: "79%",
      hardestExercise: "Chia âm nguyên âm đặc biệt ㅗ / ㅜ",
      avgMinutes: "26.0p",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
              Phân tích học tập
            </span>
            <span className="text-xs text-brand-secondary">
              Dữ liệu thực tế từ học viên học các bài giảng của bạn
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-brand-navy">
            Hiệu Quả Bài Giảng & Điểm Rơi Kiến Thức
          </h2>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((kpi, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs space-y-1"
          >
            <p className="text-xs text-brand-secondary font-medium">{kpi.label}</p>
            <h3 className="text-2xl font-extrabold text-brand-navy num-tabular">
              {kpi.value}
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold">{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Table: Lesson Completion & Drop-offs */}
      <div className="rounded-2xl bg-white border border-brand-border shadow-xs overflow-hidden">
        <div className="p-4 border-b border-brand-border bg-brand-surface/40">
          <h3 className="font-bold text-sm text-brand-navy">
            Chi tiết hiệu quả từng bài giảng & Câu hỏi cần tối ưu
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-brand-border bg-brand-surface/60 text-brand-secondary font-semibold">
                <th className="py-3 px-4">Bài học</th>
                <th className="py-3 px-4">Lượt bắt đầu</th>
                <th className="py-3 px-4">Tỷ lệ hoàn thành</th>
                <th className="py-3 px-4">Thời gian TB</th>
                <th className="py-3 px-4">Câu hỏi học viên hay sai nhất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {lessonPerformances.map((lp, idx) => (
                <tr key={idx} className="hover:bg-brand-surface/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-brand-navy max-w-xs">
                    {lp.title}
                  </td>
                  <td className="py-3.5 px-4 num-tabular font-semibold text-brand-navy">
                    {lp.starts}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {lp.completionRate}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-brand-secondary">{lp.avgMinutes}</td>
                  <td className="py-3.5 px-4 text-amber-700 font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{lp.hardestExercise}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
