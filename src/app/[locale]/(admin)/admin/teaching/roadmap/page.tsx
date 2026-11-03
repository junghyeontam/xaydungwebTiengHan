"use client";

import React, { useState } from "react";
import {
  Milestone,
  Plus,
  MoveVertical,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";
import { ROADMAP_LEVELS_DATA } from "@/lib/data/roadmap-data";
import { Button } from "@/components/shared/Button";

export default function TeacherRoadmapPlannerPage() {
  const [selectedLevelId, setSelectedLevelId] = useState("topik-1");
  const currentLevel =
    ROADMAP_LEVELS_DATA.find((l) => l.id === selectedLevelId) || ROADMAP_LEVELS_DATA[1];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
              Lộ trình học tập
            </span>
            <span className="text-xs text-brand-secondary">
              Định vị vị trí bài giảng trong chuỗi tiến độ học viên
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-brand-navy">
            Kế Hoạch & Vị Trí Bài Giảng Trên Lộ Trình
          </h2>
        </div>

        {/* Level selector */}
        <div className="flex items-center gap-2">
          {ROADMAP_LEVELS_DATA.slice(0, 3).map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevelId(lvl.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedLevelId === lvl.id
                  ? "bg-brand-primary text-white shadow-xs"
                  : "bg-brand-surface text-brand-secondary hover:text-brand-navy border border-brand-border"
              }`}
            >
              {lvl.name.split("(")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Giáo viên có thể đề xuất chèn bài học mới vào giữa chuỗi bài giảng hiện có. Vị trí đề xuất sẽ được hiển thị dưới dạng <strong>Node bóng mờ (Draft Node)</strong> cho đến khi được Publisher thẩm định và chính thức phát hành.
        </p>
      </div>

      {/* Timeline nodes display */}
      <div className="p-6 rounded-2xl bg-white border border-brand-border shadow-xs space-y-4">
        <h3 className="font-bold text-base text-brand-navy pb-3 border-b border-brand-border">
          Chuỗi bài học hiện tại: {currentLevel.name}
        </h3>

        <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-brand-border">
          {currentLevel.nodes.map((node, idx) => (
            <div
              key={node.id}
              className="relative pl-12 flex items-center justify-between p-3.5 rounded-xl border border-brand-border bg-white hover:border-brand-primary/40 transition-all"
            >
              <div className="absolute left-3 w-5 h-5 rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center">
                {idx + 1}
              </div>

              <div>
                <h4 className="font-bold text-sm text-brand-navy">{node.title}</h4>
                <p className="text-xs text-brand-secondary font-korean">{node.koreanTitle}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Đang hoạt động
                </span>
              </div>
            </div>
          ))}

          {/* Teacher's Proposed Node */}
          <div className="relative pl-12 flex items-center justify-between p-3.5 rounded-xl border-2 border-dashed border-brand-primary/50 bg-brand-primary/5">
            <div className="absolute left-3 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
              +
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-brand-navy">
                  [Đề xuất] Bài 4: Hành động & Địa điểm (-을/를 & -에 가요)
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  Bản nháp của bạn
                </span>
              </div>
              <p className="text-xs text-brand-secondary font-korean">
                목적격 조사 · N을/를 & 장소-에 가요
              </p>
            </div>

            <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-semibold border border-amber-200 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Chờ xếp lịch
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
