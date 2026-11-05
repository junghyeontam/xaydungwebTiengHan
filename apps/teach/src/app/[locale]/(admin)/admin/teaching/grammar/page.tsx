"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  TheoryCollectionCard,
  TheoryGrammarItem,
  INITIAL_THEORY_COLLECTIONS,
} from "@/lib/data/theory-collections-data";
import {
  loadTheoryCollections,
  addGrammarToChapter,
  deleteGrammarFromChapter,
  resetTheoryCollectionsToDefault,
} from "@/lib/services/theory-storage-service";
import {
  Plus,
  Search,
  Check,
  ChevronDown,
  Layers,
  Volume2,
  X,
  BookOpen,
  Trash2,
  PenTool,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/shared/Button";

export default function TeacherGrammarPage() {
  const [collections, setCollections] = useState<TheoryCollectionCard[]>(INITIAL_THEORY_COLLECTIONS);
  const [levelFilter, setLevelFilter] = useState<string>("topik-1");
  const [search, setSearch] = useState("");
  const [selectedGrammar, setSelectedGrammar] = useState<{
    item: TheoryGrammarItem;
    chapterId: string;
    collectionId: string;
  } | null>(null);

  // Add grammar modal state
  const [isAddGrammarOpen, setIsAddGrammarOpen] = useState(false);
  const [newKoreanPattern, setNewKoreanPattern] = useState("");
  const [newTitleVi, setNewTitleVi] = useState("");
  const [newFormula, setNewFormula] = useState("");
  const [newExplanationVi, setNewExplanationVi] = useState("");

  // Dynamic rules list
  const [rules, setRules] = useState<{ condition: string; example: string }[]>([
    { condition: "Danh từ / Động từ có patchim", example: "" },
    { condition: "Danh từ / Động từ không có patchim", example: "" },
  ]);

  // Dynamic examples list
  const [examples, setExamples] = useState<{ korean: string; romaja: string; meaningVi: string }[]>([
    { korean: "", romaja: "", meaningVi: "" },
  ]);

  // Dynamic practice drill
  const [drillPrompt, setDrillPrompt] = useState("");
  const [drillOption1, setDrillOption1] = useState("");
  const [drillOption2, setDrillOption2] = useState("");
  const [drillOption3, setDrillOption3] = useState("");
  const [drillOption4, setDrillOption4] = useState("");
  const [drillExplanation, setDrillExplanation] = useState("");

  useEffect(() => {
    const data = loadTheoryCollections();
    setCollections(data);

    const handleUpdate = () => {
      setCollections(loadTheoryCollections());
    };
    window.addEventListener("jh_theory_updated", handleUpdate);
    return () => window.removeEventListener("jh_theory_updated", handleUpdate);
  }, []);

  const currentCol = useMemo(() => {
    return (
      collections.find((c) => c.type === "grammar" && c.topikLevel === levelFilter) ||
      collections.find((c) => c.type === "grammar") ||
      collections[2]
    );
  }, [collections, levelFilter]);

  const allGrammarItems = useMemo(() => {
    if (!currentCol) return [];
    const list: { item: TheoryGrammarItem; chapterId: string; collectionId: string }[] = [];
    currentCol.chapters.forEach((ch) => {
      ch.items.forEach((it) => {
        list.push({
          item: it as TheoryGrammarItem,
          chapterId: ch.id,
          collectionId: currentCol.id,
        });
      });
    });
    return list;
  }, [currentCol]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return allGrammarItems;
    const q = search.toLowerCase();
    return allGrammarItems.filter(
      ({ item }) =>
        item.koreanPattern.toLowerCase().includes(q) ||
        item.titleVi.toLowerCase().includes(q) ||
        item.explanationVi.toLowerCase().includes(q)
    );
  }, [allGrammarItems, search]);

  const playKorean = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  const handleSaveGrammar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKoreanPattern.trim() || !newTitleVi.trim() || !currentCol) {
      return;
    }

    const targetChapter = currentCol.chapters[0];
    const targetChapterId = targetChapter ? targetChapter.id : "g1-ch1";
    const targetChapterTitle = targetChapter ? targetChapter.titleVi : "Chương 1";

    const validRules = rules.filter((r) => r.condition.trim() || r.example.trim());
    const validExamples = examples.filter((ex) => ex.korean.trim());

    const practiceDrills =
      drillPrompt.trim() && drillOption1.trim()
        ? [
            {
              id: "d-" + Date.now(),
              type: "conjugation" as const,
              prompt: drillPrompt.trim(),
              options: [
                drillOption1.trim(),
                drillOption2.trim() || "Đáp án B",
                drillOption3.trim() || "Đáp án C",
                drillOption4.trim() || "Đáp án D",
              ],
              correctAnswer: drillOption1.trim(),
              explanationVi:
                drillExplanation.trim() || "Áp dụng đúng quy tắc chia cấu trúc ngữ pháp.",
            },
          ]
        : [];

    const updated = addGrammarToChapter(currentCol.id, targetChapterId, {
      koreanPattern: newKoreanPattern.trim(),
      titleVi: newTitleVi.trim(),
      formula: newFormula.trim() || newKoreanPattern.trim(),
      explanationVi: newExplanationVi.trim() || `Cấu trúc ${newKoreanPattern.trim()} mang nghĩa '${newTitleVi.trim()}'.`,
      attachmentRules: validRules,
      examples:
        validExamples.length > 0
          ? validExamples
          : [{ korean: newKoreanPattern.trim(), romaja: "", meaningVi: newTitleVi.trim() }],
      practiceDrills,
      isLearned: false,
      topikLevel: (currentCol.topikLevel as any) || "topik-1",
      chapterId: targetChapterId,
      chapterTitleVi: targetChapterTitle,
    });

    setCollections(updated);
    setNewKoreanPattern("");
    setNewTitleVi("");
    setNewFormula("");
    setNewExplanationVi("");
    setDrillPrompt("");
    setDrillOption1("");
    setDrillOption2("");
    setDrillOption3("");
    setDrillOption4("");
    setDrillExplanation("");
    setIsAddGrammarOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="p-6 rounded-2xl bg-white border border-brand-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-primary/10 text-brand-primary">
              Đồng bộ trực tiếp với Lộ trình Học viên
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand-navy">
            Quản lý Kho Ngữ Pháp Theo Lộ Trình TOPIK
          </h1>
          <p className="text-xs text-brand-secondary">
            Bổ sung cấu trúc ngữ pháp, bảng cách chia, câu ví dụ và bài tập luyện tập cho từng cấp độ.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => {
              const reset = resetTheoryCollectionsToDefault();
              setCollections(reset);
              setSelectedGrammar(null);
            }}
          >
            Khôi phục dữ liệu chuẩn
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddGrammarOpen(true)}
          >
            + Thêm ngữ pháp mới
          </Button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-extrabold text-brand-navy">{currentCol?.titleVi}</h2>
          <div className="relative">
            <select
              value={levelFilter}
              onChange={(e) => {
                setLevelFilter(e.target.value);
                setSelectedGrammar(null);
              }}
              className="appearance-none pl-4 pr-8 py-1.5 rounded-full text-xs font-bold bg-white border border-brand-primary/40 text-brand-primary shadow-2xs focus:outline-none cursor-pointer"
            >
              <option value="topik-1">Cấp độ 1 (TOPIK 1)</option>
              <option value="topik-2">Cấp độ 2 (TOPIK 2)</option>
              <option value="topik-3">Cấp độ 3 (TOPIK 3)</option>
              <option value="topik-4">Cấp độ 4 (TOPIK 4)</option>
              <option value="topik-5">Cấp độ 5 (TOPIK 5)</option>
              <option value="topik-6">Cấp độ 6 (TOPIK 6)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-brand-primary absolute right-2.5 top-2 pointer-events-none" />
          </div>
          <span className="text-xs font-semibold text-brand-secondary">
            ({filteredItems.length} cấu trúc)
          </span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm cấu trúc, ý nghĩa..."
            className="pl-8 pr-3 py-1.5 rounded-full text-xs bg-white border border-brand-border text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30 w-60"
          />
        </div>
      </div>

      {/* Selected Grammar Preview & Detail Panel */}
      {selectedGrammar && (
        <div className="p-6 rounded-2xl bg-white border-2 border-brand-primary/30 shadow-card space-y-5">
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-brand-border">
            <div>
              <span className="text-xs font-bold text-brand-primary uppercase">
                Chi tiết cấu trúc ngữ pháp
              </span>
              <h3 className="text-xl font-extrabold text-brand-navy font-korean mt-0.5">
                {selectedGrammar.item.koreanPattern} — {selectedGrammar.item.titleVi}
              </h3>
              <p className="text-xs text-brand-secondary mt-1">
                Công thức: <strong className="text-brand-navy">{selectedGrammar.item.formula}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const updated = deleteGrammarFromChapter(
                    selectedGrammar.collectionId,
                    selectedGrammar.chapterId,
                    selectedGrammar.item.id
                  );
                  setCollections(updated);
                  setSelectedGrammar(null);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedGrammar(null)}
                className="p-1.5 rounded-xl text-brand-secondary hover:bg-brand-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-brand-surface/50 border border-brand-border space-y-2">
              <div className="font-extrabold text-brand-navy flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-brand-primary" />
                <span>Giải thích & Cách chia</span>
              </div>
              <p className="text-brand-body leading-relaxed">{selectedGrammar.item.explanationVi}</p>
              {selectedGrammar.item.attachmentRules?.map((r, i) => (
                <div key={i} className="pt-1 border-t border-brand-border/60">
                  <div className="font-bold text-brand-navy">{r.condition}:</div>
                  <div className="text-brand-primary font-korean">{r.example}</div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-brand-surface/50 border border-brand-border space-y-2">
              <div className="font-extrabold text-brand-navy flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-brand-primary" />
                <span>Ví dụ minh họa ({selectedGrammar.item.examples.length})</span>
              </div>
              {selectedGrammar.item.examples.map((ex, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-white border border-brand-border space-y-0.5">
                  <div className="font-bold text-brand-navy font-korean flex items-center justify-between">
                    <span>{ex.korean}</span>
                    <button
                      type="button"
                      onClick={() => playKorean(ex.korean)}
                      className="text-brand-primary hover:text-brand-navy"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-brand-secondary">{ex.meaningVi}</div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-brand-surface/50 border border-brand-border space-y-2">
              <div className="font-extrabold text-brand-navy flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-brand-primary" />
                <span>Bài tập luyện tập ({selectedGrammar.item.practiceDrills?.length || 0})</span>
              </div>
              {selectedGrammar.item.practiceDrills?.map((d, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-white border border-brand-border space-y-1">
                  <div className="font-bold text-brand-navy">{d.prompt}</div>
                  <div className="text-emerald-700 font-semibold">Đáp án đúng: {d.correctAnswer}</div>
                  <div className="text-brand-muted">{d.explanationVi}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3-Column Grammar Cards Grid matching Image 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredItems.map((entry) => {
          const { item } = entry;
          const isSelected = selectedGrammar?.item.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedGrammar(entry)}
              className={`group p-5 rounded-2xl bg-white border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                isSelected
                  ? "border-brand-primary ring-2 ring-brand-primary/20 shadow-md"
                  : "border-brand-border/80 hover:border-brand-primary/50 shadow-xs hover:shadow-md"
              }`}
            >
              <div className="mt-0.5 text-emerald-600 shrink-0">
                <Check className="w-5 h-5 stroke-[2.75]" />
              </div>
              <div className="min-w-0 space-y-1 flex-1">
                <h3 className="text-sm sm:text-base font-extrabold text-brand-navy group-hover:text-brand-primary transition-colors">
                  {item.koreanPattern}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-brand-secondary line-clamp-1">
                  {item.titleVi}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Thêm cấu trúc ngữ pháp mới */}
      {isAddGrammarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-brand-border shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="text-lg font-extrabold text-brand-navy">
                Thêm Cấu Trúc Ngữ Pháp Mới ({currentCol?.titleVi})
              </h3>
              <button
                type="button"
                onClick={() => setIsAddGrammarOpen(false)}
                className="p-1.5 rounded-lg text-brand-secondary hover:bg-brand-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrammar} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-brand-navy">
                    Tên cấu trúc ngữ pháp (Hiển thị trên thẻ) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newKoreanPattern}
                    onChange={(e) => setNewKoreanPattern(e.target.value)}
                    placeholder="VD: Danh từ + 하고"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border font-korean font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-brand-navy">
                    Nghĩa tiếng Việt ngắn gọn *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitleVi}
                    onChange={(e) => setNewTitleVi(e.target.value)}
                    placeholder="VD: Và, cùng với"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-navy">Công thức cấu tạo</label>
                <input
                  type="text"
                  value={newFormula}
                  onChange={(e) => setNewFormula(e.target.value)}
                  placeholder="VD: Danh từ 1 + 하고 + Danh từ 2"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-navy">Giải thích cách dùng chi tiết</label>
                <textarea
                  rows={3}
                  value={newExplanationVi}
                  onChange={(e) => setNewExplanationVi(e.target.value)}
                  placeholder="Nhập giải thích ý nghĩa, ngữ cảnh sử dụng..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border"
                />
              </div>

              {/* Quy tắc chia */}
              <div className="space-y-2 p-3.5 rounded-xl bg-brand-surface/50 border border-brand-border">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-brand-navy">Cách chia ngữ pháp</span>
                  <button
                    type="button"
                    onClick={() => setRules([...rules, { condition: "", example: "" }])}
                    className="text-brand-primary font-bold"
                  >
                    + Thêm dòng quy tắc
                  </button>
                </div>
                {rules.map((r, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={r.condition}
                      onChange={(e) => {
                        const next = [...rules];
                        next[idx].condition = e.target.value;
                        setRules(next);
                      }}
                      placeholder="Điều kiện (VD: Có patchim)"
                      className="px-3 py-2 rounded-lg border border-brand-border bg-white"
                    />
                    <input
                      type="text"
                      value={r.example}
                      onChange={(e) => {
                        const next = [...rules];
                        next[idx].example = e.target.value;
                        setRules(next);
                      }}
                      placeholder="Ví dụ chia (VD: 빵 + 하고 → 빵하고)"
                      className="px-3 py-2 rounded-lg border border-brand-border bg-white font-korean"
                    />
                  </div>
                ))}
              </div>

              {/* Câu ví dụ */}
              <div className="space-y-2 p-3.5 rounded-xl bg-brand-surface/50 border border-brand-border">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-brand-navy">Ví dụ minh họa</span>
                  <button
                    type="button"
                    onClick={() =>
                      setExamples([...examples, { korean: "", romaja: "", meaningVi: "" }])
                    }
                    className="text-brand-primary font-bold"
                  >
                    + Thêm câu ví dụ
                  </button>
                </div>
                {examples.map((ex, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={ex.korean}
                      onChange={(e) => {
                        const next = [...examples];
                        next[idx].korean = e.target.value;
                        setExamples(next);
                      }}
                      placeholder="Câu tiếng Hàn"
                      className="px-3 py-2 rounded-lg border border-brand-border bg-white font-korean"
                    />
                    <input
                      type="text"
                      value={ex.romaja}
                      onChange={(e) => {
                        const next = [...examples];
                        next[idx].romaja = e.target.value;
                        setExamples(next);
                      }}
                      placeholder="Phiên âm Romaja"
                      className="px-3 py-2 rounded-lg border border-brand-border bg-white"
                    />
                    <input
                      type="text"
                      value={ex.meaningVi}
                      onChange={(e) => {
                        const next = [...examples];
                        next[idx].meaningVi = e.target.value;
                        setExamples(next);
                      }}
                      placeholder="Nghĩa tiếng Việt"
                      className="px-3 py-2 rounded-lg border border-brand-border bg-white"
                    />
                  </div>
                ))}
              </div>

              {/* Bài tập luyện tập */}
              <div className="space-y-2 p-3.5 rounded-xl bg-brand-surface/50 border border-brand-border">
                <span className="font-extrabold text-brand-navy block">
                  Bài tập luyện tập đi kèm (Tùy chọn)
                </span>
                <input
                  type="text"
                  value={drillPrompt}
                  onChange={(e) => setDrillPrompt(e.target.value)}
                  placeholder="Câu hỏi bài tập (VD: Điền vào chỗ trống: 빵___ 우유를 먹어요.)"
                  className="w-full px-3 py-2 rounded-lg border border-brand-border bg-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={drillOption1}
                    onChange={(e) => setDrillOption1(e.target.value)}
                    placeholder="Đáp án ĐÚNG *"
                    className="px-3 py-2 rounded-lg border border-emerald-400 bg-white font-korean"
                  />
                  <input
                    type="text"
                    value={drillOption2}
                    onChange={(e) => setDrillOption2(e.target.value)}
                    placeholder="Đáp án nhiễu 2"
                    className="px-3 py-2 rounded-lg border border-brand-border bg-white font-korean"
                  />
                  <input
                    type="text"
                    value={drillOption3}
                    onChange={(e) => setDrillOption3(e.target.value)}
                    placeholder="Đáp án nhiễu 3"
                    className="px-3 py-2 rounded-lg border border-brand-border bg-white font-korean"
                  />
                  <input
                    type="text"
                    value={drillOption4}
                    onChange={(e) => setDrillOption4(e.target.value)}
                    placeholder="Đáp án nhiễu 4"
                    className="px-3 py-2 rounded-lg border border-brand-border bg-white font-korean"
                  />
                </div>
                <input
                  type="text"
                  value={drillExplanation}
                  onChange={(e) => setDrillExplanation(e.target.value)}
                  placeholder="Lời giải thích khi học viên chọn đáp án..."
                  className="w-full px-3 py-2 rounded-lg border border-brand-border bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddGrammarOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Lưu cấu trúc ngữ pháp
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
