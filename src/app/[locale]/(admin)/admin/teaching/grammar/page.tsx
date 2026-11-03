"use client";

import React, { useState, useEffect } from "react";
import {
  TheoryCollectionCard,
  TheoryGrammarItem,
  INITIAL_THEORY_COLLECTIONS,
} from "@/lib/data/theory-collections-data";
import {
  loadTheoryCollections,
  addGrammarToChapter,
} from "@/lib/services/theory-storage-service";
import {
  Plus,
  Search,
  Check,
  ChevronDown,
  Layers,
  Sparkles,
  Volume2,
  FileText,
  X,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { formatNumber } from "@/lib/format";

export default function TeacherGrammarPage() {
  const [collections, setCollections] = useState<TheoryCollectionCard[]>(INITIAL_THEORY_COLLECTIONS);
  const [selectedColId, setSelectedColId] = useState<string>("grammar-topik-1");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Add grammar modal state
  const [isAddGrammarOpen, setIsAddGrammarOpen] = useState(false);
  const [targetCollectionId, setTargetCollectionId] = useState<string>("grammar-topik-1");
  const [targetChapterId, setTargetChapterId] = useState<string>("");
  const [newTitleVi, setNewTitleVi] = useState("");
  const [newKoreanPattern, setNewKoreanPattern] = useState("");
  const [newFormula, setNewFormula] = useState("");
  const [newExplanationVi, setNewExplanationVi] = useState("");
  const [newRuleCondition, setNewRuleCondition] = useState("");
  const [newRuleExample, setNewRuleExample] = useState("");
  const [newExampleKo, setNewExampleKo] = useState("");
  const [newExampleVi, setNewExampleVi] = useState("");

  // Speech playback
  const [isPlayingId, setIsPlayingId] = useState<string | null>(null);

  useEffect(() => {
    const data = loadTheoryCollections();
    setCollections(data);

    const handleUpdate = () => {
      setCollections(loadTheoryCollections());
    };
    window.addEventListener("jh_theory_updated", handleUpdate);
    return () => window.removeEventListener("jh_theory_updated", handleUpdate);
  }, []);

  const currentCol = collections.find((c) => c.id === selectedColId) || collections[3];

  useEffect(() => {
    const col = collections.find((c) => c.id === targetCollectionId);
    if (col && col.chapters.length > 0) {
      setTargetChapterId(col.chapters[0].id);
    }
  }, [targetCollectionId, collections]);

  const playKorean = (text: string, id: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 0.85;
      setIsPlayingId(id);
      utterance.onend = () => setIsPlayingId(null);
      utterance.onerror = () => setIsPlayingId(null);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlayingId(null);
    }
  };

  const handleSaveGrammar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKoreanPattern.trim() || !newTitleVi.trim()) {
      alert("Vui lòng nhập mẫu ngữ pháp và tiêu đề giải thích.");
      return;
    }

    const selectedChapter = currentCol.chapters.find((ch) => ch.id === targetChapterId);
    const chapterName = selectedChapter ? selectedChapter.titleVi : "Chương 1: Trợ từ và Đuôi câu";

    const rules = newRuleCondition.trim()
      ? [{ condition: newRuleCondition.trim(), example: newRuleExample.trim() }]
      : undefined;

    const examples = newExampleKo.trim()
      ? [
          {
            korean: newExampleKo.trim(),
            romaja: "",
            meaningVi: newExampleVi.trim() || "Ví dụ minh hoạ",
          },
        ]
      : [];

    addGrammarToChapter(targetCollectionId, targetChapterId, {
      titleVi: newTitleVi.trim(),
      koreanPattern: newKoreanPattern.trim(),
      formula: newFormula.trim() || newKoreanPattern.trim(),
      explanationVi: newExplanationVi.trim() || "Giải thích ngữ pháp cơ bản.",
      attachmentRules: rules,
      examples: examples,
      isLearned: false,
      topikLevel: (currentCol.topikLevel as any) || "topik-1",
      chapterId: targetChapterId,
      chapterTitleVi: chapterName,
    });

    // Reset
    setNewTitleVi("");
    setNewKoreanPattern("");
    setNewFormula("");
    setNewExplanationVi("");
    setNewRuleCondition("");
    setNewRuleExample("");
    setNewExampleKo("");
    setNewExampleVi("");
    setIsAddGrammarOpen(false);
    alert(`Đã thêm mẫu ngữ pháp "${newKoreanPattern}" vào hệ thống thành công!`);
  };

  const grammarCollections = collections.filter((c) => c.type === "grammar");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
              Kho ngữ pháp chuẩn hóa
            </span>
            <span className="text-xs text-brand-secondary">
              Đồng bộ 6 cấp độ TOPIK (TOPIK 1 đến TOPIK 6)
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-brand-navy">
            Quản Lý & Thêm Cấu Trúc Ngữ Pháp Theo Cấp Độ
          </h2>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => {
            setTargetCollectionId(currentCol.id);
            setIsAddGrammarOpen(true);
          }}
        >
          + Thêm điểm ngữ pháp mới
        </Button>
      </div>

      {/* =========================================================================
          GRAMMAR CARDS GRID (MATCHING IMAGE 2)
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-extrabold text-brand-navy">Ngữ pháp theo cấp độ</h3>
            <div className="relative">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-semibold bg-white border border-brand-border text-brand-navy shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/30 cursor-pointer"
              >
                <option value="all">Tất cả cấp độ</option>
                <option value="topik-1">TOPIK 1</option>
                <option value="topik-2">TOPIK 2</option>
                <option value="topik-3">TOPIK 3</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-brand-muted absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
          <span className="text-xs text-brand-secondary">
            Bấm vào từng thẻ để quản lý các mục ngữ pháp bên trong
          </span>
        </div>

        {/* 2-column Grid matching Image 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {grammarCollections
            .filter((c) => {
              if (levelFilter === "all") return true;
              return c.topikLevel === levelFilter;
            })
            .map((col) => {
              const isSelected = col.id === selectedColId;
              return (
                <div
                  key={col.id}
                  onClick={() => setSelectedColId(col.id)}
                  className={`relative p-5 sm:p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? "bg-white border-brand-primary ring-2 ring-brand-primary/20 shadow-md"
                      : "bg-white border-brand-border hover:border-brand-primary/40 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* ABC Search Icon matching Image 2 */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex flex-col items-center justify-center text-white shadow-xs">
                      <span className="font-extrabold text-xs sm:text-sm tracking-tighter">ABC</span>
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center shadow-xs">
                        <Search className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base sm:text-lg font-bold text-brand-navy">
                        {col.titleVi}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-600">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span className="num-tabular">
                          {formatNumber(col.completedCount)}/{formatNumber(col.totalCount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-brand-surface border border-brand-border text-brand-secondary">
                      {col.chapters.length} chương
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">
                        Đang chọn
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* =========================================================================
          SELECTED COLLECTION CHAPTERS & GRAMMAR POINTS
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-brand-navy">
              Cấu trúc ngữ pháp trong:{" "}
              <span className="text-brand-primary">{currentCol.titleVi}</span>
            </h3>
            <p className="text-xs text-brand-secondary">
              Bao gồm công thức, giải thích, bảng quy tắc chia và ví dụ thực tế.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mẫu ngữ pháp, công thức..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-brand-border bg-white text-brand-navy placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>
        </div>

        {/* Chapters list */}
        {currentCol.chapters.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-brand-border text-center space-y-3">
            <Layers className="w-10 h-10 text-brand-muted mx-auto" />
            <p className="text-sm font-bold text-brand-navy">Chưa có chương ngữ pháp nào</p>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                setTargetCollectionId(currentCol.id);
                setIsAddGrammarOpen(true);
              }}
            >
              Thêm điểm ngữ pháp đầu tiên
            </Button>
          </div>
        ) : (
          currentCol.chapters.map((chapter) => {
            const filteredItems = (chapter.items as TheoryGrammarItem[]).filter((g) => {
              if (!search) return true;
              const q = search.toLowerCase();
              return (
                g.titleVi.toLowerCase().includes(q) ||
                g.koreanPattern.toLowerCase().includes(q) ||
                g.formula.toLowerCase().includes(q)
              );
            });

            return (
              <div
                key={chapter.id}
                className="rounded-2xl bg-white border border-brand-border shadow-xs overflow-hidden space-y-4 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brand-border/60">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-brand-navy">
                        {chapter.titleVi}
                      </h4>
                      <span className="text-xs text-brand-secondary font-korean font-semibold">
                        {chapter.koreanSubtitle}
                      </span>
                    </div>
                    <p className="text-xs text-brand-secondary">{chapter.descriptionVi}</p>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-surface border border-brand-border text-brand-navy">
                    {filteredItems.length} cấu trúc
                  </span>
                </div>

                <div className="space-y-3.5">
                  {filteredItems.map((g) => (
                    <div
                      key={g.id}
                      className="p-4 rounded-xl border border-brand-border bg-white shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-1 rounded-md text-xs font-bold font-korean bg-brand-primary/10 text-brand-primary">
                            {g.koreanPattern}
                          </span>
                          <h5 className="font-bold text-sm text-brand-navy">{g.titleVi}</h5>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          Đã thẩm định
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-blue-900 font-semibold">
                        <span className="text-blue-700 font-bold mr-1.5">Công thức:</span>
                        {g.formula}
                      </div>

                      <p className="text-xs text-brand-navy leading-relaxed">{g.explanationVi}</p>

                      {g.examples && g.examples.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          {g.examples.map((ex, exIdx) => (
                            <div
                              key={exIdx}
                              className="p-2.5 rounded-lg bg-brand-surface/40 border border-brand-border/60 flex items-center justify-between text-xs"
                            >
                              <div>
                                <p className="font-korean font-bold text-brand-navy">{ex.korean}</p>
                                <p className="text-[11px] text-brand-secondary">{ex.meaningVi}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => playKorean(ex.korean, g.id + "-" + exIdx)}
                                className="p-1 rounded text-brand-secondary hover:text-brand-primary"
                                title="Nghe phát âm"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* =========================================================================
          DIALOG: ADD NEW GRAMMAR POINT
          ========================================================================= */}
      {isAddGrammarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-brand-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-brand-surface/50">
              <h3 className="font-extrabold text-base text-brand-navy">
                Thêm Điểm Ngữ Pháp Mới (Teacher Studio)
              </h3>
              <button
                onClick={() => setIsAddGrammarOpen(false)}
                className="p-2 rounded-xl text-brand-secondary hover:bg-brand-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrammar} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-navy">Cấp độ TOPIK:</label>
                  <select
                    value={targetCollectionId}
                    onChange={(e) => setTargetCollectionId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  >
                    {grammarCollections.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.titleVi} ({col.levelBadge})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-navy">Chọn chương:</label>
                  <select
                    value={targetChapterId}
                    onChange={(e) => setTargetChapterId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  >
                    {currentCol.chapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.titleVi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-navy">
                    Mẫu ngữ pháp (Pattern) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="vd: -(으)ㄹ 수 있다, -기 때문에..."
                    value={newKoreanPattern}
                    onChange={(e) => setNewKoreanPattern(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-korean font-bold rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-navy">Tiêu đề tiếng Việt *</label>
                  <input
                    type="text"
                    required
                    placeholder="vd: Diễn tả khả năng: Có thể làm gì..."
                    value={newTitleVi}
                    onChange={(e) => setNewTitleVi(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy">Công thức (Formula):</label>
                <input
                  type="text"
                  placeholder="vd: Động từ + (으)ㄹ 수 있다 / 없다"
                  value={newFormula}
                  onChange={(e) => setNewFormula(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy">Giải thích cách dùng:</label>
                <textarea
                  rows={2}
                  placeholder="Dùng để nói về khả năng hoặc hoàn cảnh cho phép người nói làm điều gì đó..."
                  value={newExplanationVi}
                  onChange={(e) => setNewExplanationVi(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-brand-border/60">
                <label className="text-xs font-bold text-brand-navy">Câu ví dụ thực tế:</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Ví dụ tiếng Hàn: 저는 한국어를 할 수 있어요."
                    value={newExampleKo}
                    onChange={(e) => setNewExampleKo(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-korean rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                  <input
                    type="text"
                    placeholder="Dịch nghĩa: Tôi có thể nói được tiếng Hàn."
                    value={newExampleVi}
                    onChange={(e) => setNewExampleVi(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-brand-border">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddGrammarOpen(false)}
                >
                  Huỷ bỏ
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Lưu điểm ngữ pháp
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
