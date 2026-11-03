"use client";

import React, { useState, useEffect } from "react";
import {
  TheoryCollectionCard,
  TheoryVocabWord,
  INITIAL_THEORY_COLLECTIONS,
} from "@/lib/data/theory-collections-data";
import {
  loadTheoryCollections,
  addVocabToChapter,
  addChapterToTheoryCollection,
} from "@/lib/services/theory-storage-service";
import {
  Plus,
  Search,
  Volume2,
  Check,
  ChevronDown,
  Layers,
  Sparkles,
  FileSpreadsheet,
  Trash2,
  CheckCircle2,
  X,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { formatNumber } from "@/lib/format";

export default function TeacherVocabularyPage() {
  const [collections, setCollections] = useState<TheoryCollectionCard[]>(INITIAL_THEORY_COLLECTIONS);
  const [selectedColId, setSelectedColId] = useState<string>("vocab-topik-1");
  const [levelFilter, setLevelFilter] = useState<string>("topik-1");
  const [search, setSearch] = useState("");

  // Modals
  const [isAddWordOpen, setIsAddWordOpen] = useState(false);
  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false);
  const [isBatchImportOpen, setIsBatchImportOpen] = useState(false);

  // Add word form state
  const [targetCollectionId, setTargetCollectionId] = useState<string>("vocab-topik-1");
  const [targetChapterId, setTargetChapterId] = useState<string>("");
  const [newKorean, setNewKorean] = useState("");
  const [newRomaja, setNewRomaja] = useState("");
  const [newPartOfSpeech, setNewPartOfSpeech] = useState("Danh từ");
  const [newMeaningVi, setNewMeaningVi] = useState("");
  const [newMeaningEn, setNewMeaningEn] = useState("");
  const [newExampleKo, setNewExampleKo] = useState("");
  const [newExampleVi, setNewExampleVi] = useState("");
  const [autoSrs, setAutoSrs] = useState(true);

  // Add chapter form state
  const [newChapterTitleVi, setNewChapterTitleVi] = useState("");
  const [newChapterSubtitleKo, setNewChapterSubtitleKo] = useState("");
  const [newChapterDescVi, setNewChapterDescVi] = useState("");

  // Batch import text
  const [batchRawText, setBatchRawText] = useState("");

  // Speech preview
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

  const currentCol = collections.find((c) => c.id === selectedColId) || collections[0];

  // Set default target chapter when collection changes
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

  const handleSaveWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKorean.trim() || !newMeaningVi.trim()) {
      alert("Vui lòng nhập từ tiếng Hàn và ý nghĩa tiếng Việt.");
      return;
    }

    const selectedChapter = currentCol.chapters.find((ch) => ch.id === targetChapterId);
    const chapterName = selectedChapter ? selectedChapter.titleVi : "Chương tự do";

    addVocabToChapter(targetCollectionId, targetChapterId, {
      korean: newKorean.trim(),
      romaja: newRomaja.trim() || newKorean.trim(),
      partOfSpeech: newPartOfSpeech,
      meaningVi: newMeaningVi.trim(),
      meaningEn: newMeaningEn.trim() || undefined,
      exampleKo: newExampleKo.trim(),
      exampleVi: newExampleVi.trim(),
      isLearned: false,
      topikLevel: (currentCol.topikLevel as any) || "topik-1",
      chapterId: targetChapterId,
      chapterTitleVi: chapterName,
    });

    // Reset form
    setNewKorean("");
    setNewRomaja("");
    setNewMeaningVi("");
    setNewMeaningEn("");
    setNewExampleKo("");
    setNewExampleVi("");
    setIsAddWordOpen(false);
    alert(`Đã thêm từ "${newKorean}" vào ${chapterName}! Học viên có thể học ngay.`);
  };

  const handleSaveChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitleVi.trim()) {
      alert("Vui lòng nhập tên chương.");
      return;
    }

    addChapterToTheoryCollection(targetCollectionId, {
      titleVi: newChapterTitleVi.trim(),
      koreanSubtitle: newChapterSubtitleKo.trim() || "단원",
      descriptionVi: newChapterDescVi.trim() || "Chương mục biên soạn bởi giáo viên.",
    });

    setNewChapterTitleVi("");
    setNewChapterSubtitleKo("");
    setNewChapterDescVi("");
    setIsAddChapterOpen(false);
    alert(`Đã tạo chương mới thành công! Giờ bạn có thể thêm các ô từ vựng vào chương này.`);
  };

  const handleBatchImport = () => {
    if (!batchRawText.trim()) return;
    const lines = batchRawText.split("\n").filter((l) => l.trim().length > 0);
    let count = 0;

    for (const line of lines) {
      // Format: Korean | Romaja | Nghĩa | Ví dụ Ko | Ví dụ Vi
      const parts = line.split(/[|,\t]/).map((p) => p.trim());
      if (parts.length >= 2) {
        const ko = parts[0];
        const vi = parts[1];
        const rom = parts[2] || ko;
        const exKo = parts[3] || "";
        const exVi = parts[4] || "";

        addVocabToChapter(targetCollectionId, targetChapterId, {
          korean: ko,
          romaja: rom,
          partOfSpeech: "Danh từ",
          meaningVi: vi,
          exampleKo: exKo,
          exampleVi: exVi,
          isLearned: false,
          topikLevel: (currentCol.topikLevel as any) || "topik-1",
          chapterId: targetChapterId,
          chapterTitleVi: "Chương nhập tự động",
        });
        count++;
      }
    }

    setBatchRawText("");
    setIsBatchImportOpen(false);
    alert(`Đã nhập nhanh thành công ${count} từ vựng vào hệ thống!`);
  };

  const vocabCollections = collections.filter(
    (c) => c.type === "vocab" || c.type === "topic"
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Controls Bar */}
      <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
              Kho từ vựng chuẩn hoá
            </span>
            <span className="text-xs text-brand-secondary">
              Giao diện đồng bộ với Thư viện học viên (Ảnh mẫu)
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-brand-navy">
            Quản Lý & Thêm Ô Từ Vựng Theo Chương Mục
          </h2>
        </div>

        {/* Action Buttons for Teacher */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<FileSpreadsheet className="w-3.5 h-3.5" />}
            onClick={() => setIsBatchImportOpen(true)}
          >
            Nhập từ Excel/CSV
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => {
              setTargetCollectionId(currentCol.id);
              setIsAddChapterOpen(true);
            }}
          >
            + Thêm chương mới
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => {
              setTargetCollectionId(currentCol.id);
              setIsAddWordOpen(true);
            }}
          >
            + Thêm từ vựng mới
          </Button>
        </div>
      </div>

      {/* =========================================================================
          COLLECTIONS CARDS SECTION (MATCHING IMAGE 2)
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-extrabold text-brand-navy">
              Bộ thẻ từ vựng hệ thống
            </h3>
            {/* Level filter dropdown */}
            <div className="relative">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-semibold bg-white border border-brand-border text-brand-navy shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/30 cursor-pointer"
              >
                <option value="topik-1">Cấp độ 1</option>
                <option value="topik-2">Cấp độ 2</option>
                <option value="all">Tất cả cấp độ</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-brand-muted absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
          <span className="text-xs text-brand-secondary">
            Bấm vào từng thẻ để quản lý danh sách ô từ vựng bên trong
          </span>
        </div>

        {/* 2-column Grid matching Image 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {vocabCollections
            .filter((c) => {
              if (c.id === "vocab-unlearned") return true;
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
                    {/* Aa Card Icon */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex flex-col items-center justify-center text-white shadow-xs">
                      <span className="font-extrabold text-lg sm:text-xl tracking-tighter">Aa</span>
                      <div className="w-6 h-0.5 bg-white/60 rounded-full mt-0.5" />
                      <div className="w-4 h-0.5 bg-white/40 rounded-full mt-0.5" />
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
          SELECTED COLLECTION CHAPTERS & WORD TILES
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-brand-navy">
              Chi tiết các chương mục trong:{" "}
              <span className="text-brand-primary">{currentCol.titleVi}</span>
            </h3>
            <p className="text-xs text-brand-secondary">
              Mỗi chương chứa các ô từ vựng được học viên tương tác và luyện phát âm.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm từ tiếng Hàn, nghĩa..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-brand-border bg-white text-brand-navy placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>
        </div>

        {/* Chapters list */}
        {currentCol.chapters.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-brand-border text-center space-y-3">
            <Layers className="w-10 h-10 text-brand-muted mx-auto" />
            <p className="text-sm font-bold text-brand-navy">Chưa có chương nào trong bộ thẻ này</p>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                setTargetCollectionId(currentCol.id);
                setIsAddChapterOpen(true);
              }}
            >
              Tạo chương đầu tiên
            </Button>
          </div>
        ) : (
          currentCol.chapters.map((chapter) => {
            const filteredWords = (chapter.items as TheoryVocabWord[]).filter((w) => {
              if (!search) return true;
              const q = search.toLowerCase();
              return (
                w.korean.toLowerCase().includes(q) ||
                w.meaningVi.toLowerCase().includes(q) ||
                w.romaja.toLowerCase().includes(q)
              );
            });

            return (
              <div
                key={chapter.id}
                className="rounded-2xl bg-white border border-brand-border shadow-xs overflow-hidden space-y-4 p-5"
              >
                {/* Chapter title header */}
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

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-surface border border-brand-border text-brand-navy">
                      {filteredWords.length} từ vựng
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Plus className="w-3 h-3" />}
                      onClick={() => {
                        setTargetCollectionId(currentCol.id);
                        setTargetChapterId(chapter.id);
                        setIsAddWordOpen(true);
                      }}
                    >
                      Thêm từ vào chương này
                    </Button>
                  </div>
                </div>

                {/* Vocabulary tiles grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredWords.map((word) => {
                    const isPlaying = isPlayingId === word.id;
                    return (
                      <div
                        key={word.id}
                        className="p-4 rounded-xl border border-brand-border bg-white shadow-xs hover:border-brand-primary/40 transition-all flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-surface text-brand-secondary border border-brand-border/60">
                              {word.partOfSpeech}
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                              Đã kiểm định
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="text-xl font-extrabold text-brand-navy font-korean">
                                {word.korean}
                              </h5>
                              <span className="text-xs text-brand-secondary">/{word.romaja}/</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => playKorean(word.korean, word.id)}
                              className={`p-2.5 rounded-full transition-all ${
                                isPlaying
                                  ? "bg-brand-primary text-white scale-110 shadow-xs"
                                  : "bg-brand-surface text-brand-navy hover:bg-brand-primary/10 hover:text-brand-primary"
                              }`}
                              title="Nghe phát âm chuẩn Seoul"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-sm font-semibold text-brand-navy">{word.meaningVi}</p>

                          {word.exampleKo && (
                            <div className="p-2.5 rounded-lg bg-brand-surface/40 border border-brand-border/60 text-xs space-y-1">
                              <p className="font-korean font-semibold text-brand-navy">
                                {word.exampleKo}
                              </p>
                              <p className="text-[11px] text-brand-secondary">{word.exampleVi}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* =========================================================================
          DIALOG: ADD NEW WORD TILE
          ========================================================================= */}
      {isAddWordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-brand-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-brand-surface/50">
              <div>
                <h3 className="font-extrabold text-lg text-brand-navy">
                  Thêm Ô Từ Vựng Mới (Teacher Studio)
                </h3>
                <p className="text-xs text-brand-secondary">
                  Từ vựng sẽ được đồng bộ ngay lập tức vào bài học và thư viện học viên
                </p>
              </div>
              <button
                onClick={() => setIsAddWordOpen(false)}
                className="p-2 rounded-xl text-brand-secondary hover:bg-brand-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveWord} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Select collection & chapter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-navy">Bộ thẻ / Cấp độ:</label>
                  <select
                    value={targetCollectionId}
                    onChange={(e) => setTargetCollectionId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  >
                    {vocabCollections.map((col) => (
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

              {/* Korean Word & Pronunciation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-navy">
                    Từ tiếng Hàn (Hangul) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="vd: 선생님, 책상..."
                      value={newKorean}
                      onChange={(e) => setNewKorean(e.target.value)}
                      className="w-full pl-3 pr-10 py-2 text-sm font-korean font-bold rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    />
                    {newKorean && (
                      <button
                        type="button"
                        onClick={() => playKorean(newKorean, "preview")}
                        className="absolute right-2.5 top-2 p-1 rounded-md text-brand-primary hover:bg-brand-primary/10"
                        title="Nghe thử"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-navy">Phiên âm Romaja:</label>
                  <input
                    type="text"
                    placeholder="vd: seonsaengnim, chaeksang..."
                    value={newRomaja}
                    onChange={(e) => setNewRomaja(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>
              </div>

              {/* Part of speech & Vietnamese Meaning */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-navy">Từ loại:</label>
                  <select
                    value={newPartOfSpeech}
                    onChange={(e) => setNewPartOfSpeech(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  >
                    <option value="Danh từ">Danh từ (명사)</option>
                    <option value="Động từ">Động từ (동사)</option>
                    <option value="Tính từ">Tính từ (형용사)</option>
                    <option value="Phó từ">Phó từ (부사)</option>
                    <option value="Mẫu câu">Mẫu câu / Cụm từ</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-brand-navy">
                    Ý nghĩa tiếng Việt *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="vd: Giáo viên, thầy cô giáo..."
                    value={newMeaningVi}
                    onChange={(e) => setNewMeaningVi(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>
              </div>

              {/* Example sentence */}
              <div className="space-y-2 pt-2 border-t border-brand-border/60">
                <label className="text-xs font-bold text-brand-navy">
                  Câu ví dụ minh hoạ (Khuyên dùng):
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Câu ví dụ tiếng Hàn: 선생님, 질문이 있습니다."
                    value={newExampleKo}
                    onChange={(e) => setNewExampleKo(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-korean rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                  <input
                    type="text"
                    placeholder="Dịch nghĩa tiếng Việt: Thưa thầy, em có câu hỏi ạ."
                    value={newExampleVi}
                    onChange={(e) => setNewExampleVi(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>
              </div>

              {/* SRS Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="autoSrs"
                  checked={autoSrs}
                  onChange={(e) => setAutoSrs(e.target.checked)}
                  className="rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                />
                <label htmlFor="autoSrs" className="text-xs text-brand-navy font-medium">
                  Tự động đưa vào thuật toán ôn tập Spaced Repetition (SRS)
                </label>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-brand-border">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddWordOpen(false)}
                >
                  Huỷ bỏ
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Lưu & Thêm từ vựng
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          DIALOG: ADD NEW CHAPTER
          ========================================================================= */}
      {isAddChapterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-brand-border space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-brand-border">
              <h3 className="font-extrabold text-base text-brand-navy">
                Thêm Chương Mới Cho Bộ Thẻ
              </h3>
              <button
                onClick={() => setIsAddChapterOpen(false)}
                className="p-1 rounded-lg text-brand-secondary hover:bg-brand-surface"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveChapter} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy">Tên chương tiếng Việt *</label>
                <input
                  type="text"
                  required
                  placeholder="vd: Chương 4: Mua sắm & Mặc cả..."
                  value={newChapterTitleVi}
                  onChange={(e) => setNewChapterTitleVi(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy">Phụ đề tiếng Hàn:</label>
                <input
                  type="text"
                  placeholder="vd: 쇼핑과 가격..."
                  value={newChapterSubtitleKo}
                  onChange={(e) => setNewChapterSubtitleKo(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-korean rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy">Mô tả ngắn:</label>
                <textarea
                  rows={2}
                  placeholder="Mục tiêu của chương này giúp học viên nắm được..."
                  value={newChapterDescVi}
                  onChange={(e) => setNewChapterDescVi(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-border">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddChapterOpen(false)}
                >
                  Huỷ
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Tạo chương
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          DIALOG: BATCH IMPORT FROM EXCEL/CSV
          ========================================================================= */}
      {isBatchImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-brand-border space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-brand-navy">
                  Nhập nhanh từ Excel / CSV
                </h3>
              </div>
              <button
                onClick={() => setIsBatchImportOpen(false)}
                className="p-1 rounded-lg text-brand-secondary hover:bg-brand-surface"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-brand-secondary leading-relaxed">
              Dán dữ liệu từ bảng tính (Excel/Sheets) hoặc nhập từng dòng theo định dạng sau:
              <br />
              <code className="text-brand-navy font-semibold bg-brand-surface px-1.5 py-0.5 rounded">
                Từ tiếng Hàn | Nghĩa tiếng Việt | Romaja | Ví dụ Ko | Dịch ví dụ
              </code>
            </p>

            <textarea
              rows={6}
              value={batchRawText}
              onChange={(e) => setBatchRawText(e.target.value)}
              placeholder="ví dụ:&#10;사과 | Quả táo | sagwa | 사과를 먹어요 | Tôi ăn táo&#10;우유 | Sữa tươi | uyu | 우유를 마셔요 | Tôi uống sữa"
              className="w-full p-3 text-xs font-mono rounded-xl border border-brand-border bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-border">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsBatchImportOpen(false)}
              >
                Đóng
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleBatchImport}
              >
                Bắt đầu nhập
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
