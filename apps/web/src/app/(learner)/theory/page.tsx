"use client";

import React, { useState } from "react";
import { RoadmapTheoryLibrary } from "@/components/roadmap/RoadmapTheoryLibrary";

export default function TheoryPage() {
  const [activeTab, setActiveTab] = useState<"grammar" | "vocab-topik" | "vocab-topic">("grammar");

  return (
    <div className="min-h-screen bg-brand-bg py-8 sm:py-12">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
        <div className="space-y-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-primary/10 text-brand-primary">
            Kho Lý Thuyết TOPIK 1 – 6
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
            Ngữ pháp & Từ vựng theo lộ trình chuẩn Seoul
          </h1>
          <p className="text-xs sm:text-sm text-brand-secondary">
            Chọn cấp độ TOPIK để tra cứu cấu trúc ngữ pháp, thư mục bài học từ vựng và luyện tập vận dụng.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-brand-border">
          <button
            type="button"
            onClick={() => setActiveTab("grammar")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all ${
              activeTab === "grammar"
                ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                : "bg-white text-brand-navy border-brand-border hover:border-brand-primary/50"
            }`}
          >
            Ngữ pháp theo lộ trình
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("vocab-topik")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all ${
              activeTab === "vocab-topik"
                ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                : "bg-white text-brand-navy border-brand-border hover:border-brand-primary/50"
            }`}
          >
            Từ vựng theo lộ trình
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("vocab-topic")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all ${
              activeTab === "vocab-topic"
                ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                : "bg-white text-brand-navy border-brand-border hover:border-brand-primary/50"
            }`}
          >
            Từ vựng theo chủ đề
          </button>
        </div>

        <RoadmapTheoryLibrary mode={activeTab} />
      </div>
    </div>
  );
}
