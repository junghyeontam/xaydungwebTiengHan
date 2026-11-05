"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  TheoryCollectionCard,
  TheoryVocabWord,
  TheoryChapter,
  INITIAL_THEORY_COLLECTIONS,
} from "@/lib/data/theory-collections-data";
import {
  loadTheoryCollections,
  addVocabToChapter,
  deleteVocabFromChapter,
  addChapterToTheoryCollection,
  resetTheoryCollectionsToDefault,
} from "@/lib/services/theory-storage-service";
import {
  Plus,
  Search,
  Volume2,
  Check,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  FileSpreadsheet,
  Trash2,
  X,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { formatNumber } from "@/lib/format";

export default function TeacherVocabularyPage() {
  const [collections, setCollections] = useState<TheoryCollectionCard[]>(INITIAL_THEORY_COLLECTIONS);
  const [selectedColId, setSelectedColId] = useState<string>("vocab-topik-1");
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Modals
  const [isAddWordOpen, setIsAddWordOpen] = useState(false);
  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false);
  const [isBatchImportOpen, setIsBatchImportOpen] = useState(false);

  // Add word form state
  const [targetChapterId, setTargetChapterId] = useState<string>("");
  const [newKorean, setNewKorean] = useState("");
  const [newRomaja, setNewRomaja] = useState("");
  const [newPartOfSpeech, setNewPartOfSpeech] = useState("Danh từ");
  const [newMeaningVi, setNewMeaningVi] = useState("");
  const [newExampleKo, setNewExampleKo] = useState("");
  const [newExampleVi, setNewExampleVi] = useState("");

  // Add chapter form state
  const [newChapterTitleVi, setNewChapterTitleVi] = useState("");
  const [newChapterSubtitleKo, setNewChapterSubtitleKo] = useState("");
  const [newChapterDescVi, setNewChapterDescVi] = useState("");
  const [newChapterTargetCount, setNewChapterTargetCount] = useState<number>(35);

  // Batch import text
  const [batchRawText, setBatchRawText] = useState("");

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
    return collections.find((c) => c.id === selectedColId) || collections[0];
  }, [collections, selectedColId]);

  const chapters = (currentCol?.chapters || []) as TheoryChapter<TheoryVocabWord>[];

  const activeChapter = useMemo(() => {
    if (!activeChapterId) return null;
    return chapters.find((ch) => ch.id === activeChapterId) || null;
  }, [activeChapterId, chapters]);

  useEffect(() => {
    if (activeChapterId) {
      setTargetChapterId(activeChapterId);
    } else if (chapters.length > 0) {
      setTargetChapterId(chapters[0].id);
    }
  }, [activeChapterId, chapters]);

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

  const handleSaveWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKorean.trim() || !newMeaningVi.trim() || !currentCol) return;

    const chId = targetChapterId || chapters[0]?.id;
    const selectedChapter = chapters.find((ch) => ch.id === chId);
    const chapterName = selectedChapter ? selectedChapter.titleVi : "Bài 1A: Giới thiệu";

    const updated = addVocabToChapter(currentCol.id, chId, {
      korean: newKorean.trim(),
      romaja: newRomaja.trim() || newKorean.trim(),
      partOfSpeech: newPartOfSpeech,
      meaningVi: newMeaningVi.trim(),
      exampleKo: newExampleKo.trim(),
      exampleVi: newExampleVi.trim(),
      isLearned: false,
      topikLevel: (currentCol.topikLevel as any) || "topik-1",
      chapterId: chId,
      chapterTitleVi: chapterName,
    });

    setCollections(updated);
    setNewKorean("");
    setNewRomaja("");
    setNewMeaningVi("");
    setNewExampleKo("");
    setNewExampleVi("");
    setIsAddWordOpen(false);
  };

  const handleSaveChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitleVi.trim() || !currentCol) return;

    const updated = addChapterToTheoryCollection(currentCol.id, {
      titleVi: newChapterTitleVi.trim(),
      koreanSubtitle: newChapterSubtitleKo.trim() || "단원",
      descriptionVi: newChapterDescVi.trim() || "Bài học từ vựng biên soạn bởi giáo viên.",
      targetWordCount: Number(newChapterTargetCount) || 35,
    });

    setCollections(updated);
    setNewChapterTitleVi("");
    setNewChapterSubtitleKo("");
    setNewChapterDescVi("");
    setIsAddChapterOpen(false);
  };

  const handleBatchImport = () => {
    if (!batchRawText.trim() || !currentCol) return;
    const chId = targetChapterId || chapters[0]?.id;
    const selectedChapter = chapters.find((ch) => ch.id === chId);
    const chapterName = selectedChapter ? selectedChapter.titleVi : "Bài học";

    const lines = batchRawText.split("\n").filter((l) => l.trim().length > 0);
    for (const line of lines) {
      const parts = line.split(/[|,\t]/).map((p) => p.trim());
      if (parts.length >= 2) {
        addVocabToChapter(currentCol.id, chId, {
          korean: parts[0],
          meaningVi: parts[1],
          romaja: parts[2] || parts[0],
          partOfSpeech: "Danh từ",
          exampleKo: parts[3] || "",
          exampleVi: parts[4] || "",
          isLearned: false,
          topikLevel: (currentCol.topikLevel as any) || "topik-1",
          chapterId: chId,
          chapterTitleVi: chapterName,
        });
      }
    }

    setCollections(loadTheoryCollections());
    setBatchRawText("");
    setIsBatchImportOpen(false);
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
            Quản Lý Thư Mục & Từ Vựng Theo Lộ Trình
          </h1>
          <p className="text-xs text-brand-secondary">
            Tạo các bài học (thư mục) và bổ sung từ vựng cho từng cấp độ TOPIK hoặc chủ đề giao tiếp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => {
              const reset = resetTheoryCollectionsToDefault();
              setCollections(reset);
              setActiveChapterId(null);
            }}
          >
            Khôi phục chuẩn
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<FileSpreadsheet className="w-3.5 h-3.5" />}
            onClick={() => setIsBatchImportOpen(true)}
          >
            Nhập nhanh danh sách
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddChapterOpen(true)}
          >
            + Tạo thư mục bài học
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddWordOpen(true)}
          >
            + Thêm từ vựng mới
          </Button>
        </div>
      </div>

      {/* Top Level Selector & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {activeChapter ? (
            <nav className="flex items-center gap-1.5 text-sm font-medium text-brand-secondary">
              <button
                type="button"
                onClick={() => setActiveChapterId(null)}
                className="hover:text-brand-primary font-bold text-brand-navy"
              >
                {currentCol?.titleVi}
              </button>
              <ChevronRight className="w-4 h-4 text-brand-muted" />
              <span className="font-extrabold text-brand-primary">{activeChapter.titleVi}</span>
            </nav>
          ) : (
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-extrabold text-brand-navy">{currentCol?.titleVi}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-primary/10 text-brand-primary">
                Tổng: {formatNumber(chapters.reduce((sum, ch) => sum + ch.items.length, 0))} từ ({formatNumber(chapters.length)} bài)
              </span>
            </div>
          )}

          <div className="relative">
            <select
              value={selectedColId}
              onChange={(e) => {
                setSelectedColId(e.target.value);
                setActiveChapterId(null);
              }}
              className="appearance-none pl-4 pr-8 py-1.5 rounded-full text-xs font-bold bg-white border border-brand-primary/40 text-brand-primary shadow-2xs focus:outline-none cursor-pointer"
            >
              <option value="vocab-topik-1">Từ vựng cấp độ TOPIK 1</option>
              <option value="vocab-topik-2">Từ vựng cấp độ TOPIK 2</option>
              <option value="vocab-topik-3">Từ vựng cấp độ TOPIK 3</option>
              <option value="vocab-topik-4">Từ vựng cấp độ TOPIK 4</option>
              <option value="vocab-topik-5">Từ vựng cấp độ TOPIK 5</option>
              <option value="vocab-topik-6">Từ vựng cấp độ TOPIK 6</option>
              <option value="topic-daily-korea">Từ vựng theo Chủ đề thực chiến</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-brand-primary absolute right-2.5 top-2 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeChapter && (
            <button
              type="button"
              onClick={() => setActiveChapterId(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-brand-border text-brand-navy hover:bg-brand-surface"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Tất cả thư mục</span>
            </button>
          )}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm thư mục, từ vựng..."
              className="pl-8 pr-3 py-1.5 rounded-full text-xs bg-white border border-brand-border text-brand-navy focus:outline-none w-52"
            />
          </div>
        </div>
      </div>

      {/* VIEW A: 3-COLUMN FOLDER GRID (MATCHING IMAGE 1) */}
      {!activeChapter ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {chapters
            .filter(
              (ch) =>
                !search.trim() ||
                ch.titleVi.toLowerCase().includes(search.toLowerCase()) ||
                ch.items.some((w) => w.korean.includes(search) || w.meaningVi.toLowerCase().includes(search.toLowerCase()))
            )
            .map((chapter) => {
              const wordCount = chapter.items.length;
              return (
                <div
                  key={chapter.id}
                  onClick={() => setActiveChapterId(chapter.id)}
                  className="group p-5 rounded-2xl bg-white border border-brand-border/80 hover:border-brand-primary/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Stacked Aa Document Icon matching Image 1 */}
                    <div className="relative w-12 h-14 shrink-0">
                      <div
                        className="absolute top-1.5 left-1.5 w-10 h-12 bg-brand-border/80"
                        style={{ borderRadius: "8px" }}
                      />
                      <div
                        className="relative w-10 h-12 bg-white border border-brand-border shadow-2xs overflow-hidden flex flex-col"
                        style={{ borderRadius: "8px" }}
                      >
                        <div className="h-7 bg-brand-primary text-white flex items-center justify-center font-extrabold text-sm">
                          Aa
                        </div>
                        <div className="flex-1 p-1.5 flex flex-col justify-center gap-1 bg-white">
                          <div className="w-full h-0.5 bg-brand-navy/70" />
                          <div className="w-2/3 h-0.5 bg-brand-navy/40" />
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0 space-y-1">
                      <h3 className="text-sm sm:text-base font-extrabold text-brand-navy group-hover:text-brand-primary transition-colors truncate">
                        {chapter.titleVi}
                      </h3>
                      <p className="text-xs font-medium text-brand-secondary">
                        {formatNumber(wordCount)} từ đã nhập
                      </p>
                    </div>
                  </div>

                  <Check className="w-5 h-5 text-emerald-600 stroke-[2.75] shrink-0" />
                </div>
              );
            })}
        </div>
      ) : (
        /* VIEW B: INSIDE A FOLDER — 3-COLUMN VOCAB CARDS (MATCHING IMAGE 2) */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {activeChapter.items
              .filter(
                (w) =>
                  !search.trim() ||
                  w.korean.includes(search) ||
                  w.meaningVi.toLowerCase().includes(search.toLowerCase())
              )
              .map((word) => (
                <div
                  key={word.id}
                  className="group p-5 rounded-2xl bg-white border border-brand-border/80 hover:border-brand-primary/40 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <button
                      type="button"
                      onClick={() => playKorean(word.korean)}
                      className="w-11 h-11 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white flex items-center justify-center shrink-0 shadow-xs"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>

                    <div className="min-w-0 space-y-0.5">
                      <div className="text-base sm:text-lg font-extrabold text-brand-navy font-korean truncate">
                        {word.korean}
                      </div>
                      <div className="text-xs text-brand-muted truncate">({word.romaja})</div>
                      <div className="text-xs sm:text-sm font-semibold text-brand-body truncate pt-0.5">
                        {word.meaningVi}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = deleteVocabFromChapter(
                        currentCol.id,
                        activeChapter.id,
                        word.id
                      );
                      setCollections(updated);
                    }}
                    className="p-1.5 rounded-lg text-brand-muted hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                    title="Xóa từ vựng này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* MODAL 1: THÊM TỪ VỰNG MỚI */}
      {isAddWordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-brand-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="text-lg font-extrabold text-brand-navy">Thêm Từ Vựng Mới</h3>
              <button
                type="button"
                onClick={() => setIsAddWordOpen(false)}
                className="p-1.5 rounded-lg text-brand-secondary hover:bg-brand-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWord} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-brand-navy">Chọn thư mục bài học *</label>
                <select
                  value={targetChapterId}
                  onChange={(e) => setTargetChapterId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border font-semibold"
                >
                  {chapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.titleVi}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-brand-navy">Từ tiếng Hàn *</label>
                  <input
                    type="text"
                    required
                    value={newKorean}
                    onChange={(e) => setNewKorean(e.target.value)}
                    placeholder="VD: 오이"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border font-korean font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-brand-navy">Phiên âm (Romaja)</label>
                  <input
                    type="text"
                    value={newRomaja}
                    onChange={(e) => setNewRomaja(e.target.value)}
                    placeholder="VD: Oi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-brand-navy">Nghĩa tiếng Việt *</label>
                  <input
                    type="text"
                    required
                    value={newMeaningVi}
                    onChange={(e) => setNewMeaningVi(e.target.value)}
                    placeholder="VD: Quả dưa chuột"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-brand-navy">Từ loại</label>
                  <select
                    value={newPartOfSpeech}
                    onChange={(e) => setNewPartOfSpeech(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border"
                  >
                    <option value="Danh từ">Danh từ</option>
                    <option value="Động từ">Động từ</option>
                    <option value="Tính từ">Tính từ</option>
                    <option value="Phó từ">Phó từ</option>
                    <option value="Thán từ">Thán từ</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-navy">Câu ví dụ tiếng Hàn</label>
                <input
                  type="text"
                  value={newExampleKo}
                  onChange={(e) => setNewExampleKo(e.target.value)}
                  placeholder="VD: 오이가 아주 신선해요."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border font-korean"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-navy">Dịch nghĩa câu ví dụ</label>
                <input
                  type="text"
                  value={newExampleVi}
                  onChange={(e) => setNewExampleVi(e.target.value)}
                  placeholder="VD: Quả dưa chuột rất tươi."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddWordOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Lưu từ vựng
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TẠO THƯ MỤC BÀI HỌC MỚI */}
      {isAddChapterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-brand-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="text-lg font-extrabold text-brand-navy">
                Tạo Thư Mục Bài Học Mới ({currentCol?.titleVi})
              </h3>
              <button
                type="button"
                onClick={() => setIsAddChapterOpen(false)}
                className="p-1.5 rounded-lg text-brand-secondary hover:bg-brand-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChapter} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-brand-navy">Tên thư mục / Bài học *</label>
                <input
                  type="text"
                  required
                  value={newChapterTitleVi}
                  onChange={(e) => setNewChapterTitleVi(e.target.value)}
                  placeholder="VD: Bài 16: Bệnh viện & Hiệu thuốc"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-navy">Tiêu đề phụ tiếng Hàn</label>
                <input
                  type="text"
                  value={newChapterSubtitleKo}
                  onChange={(e) => setNewChapterSubtitleKo(e.target.value)}
                  placeholder="VD: 16과: 병원과 약국"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border font-korean"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-navy">Mô tả ngắn</label>
                <input
                  type="text"
                  value={newChapterDescVi}
                  onChange={(e) => setNewChapterDescVi(e.target.value)}
                  placeholder="Mô tả nội dung bài học..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddChapterOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Tạo thư mục
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: NHẬP NHANH DANH SÁCH (BATCH IMPORT) */}
      {isBatchImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-brand-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="text-lg font-extrabold text-brand-navy">
                Nhập Nhanh Danh Sách Từ Vựng
              </h3>
              <button
                type="button"
                onClick={() => setIsBatchImportOpen(false)}
                className="p-1.5 rounded-lg text-brand-secondary hover:bg-brand-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-brand-navy">Nhập vào thư mục bài học:</label>
                <select
                  value={targetChapterId}
                  onChange={(e) => setTargetChapterId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border font-semibold"
                >
                  {chapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.titleVi}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-brand-secondary">
                Mỗi dòng 1 từ theo cú pháp: <strong>Tiếng Hàn | Nghĩa Việt | Phiên âm | Câu ví dụ</strong>
              </p>
              <textarea
                rows={6}
                value={batchRawText}
                onChange={(e) => setBatchRawText(e.target.value)}
                placeholder={"오이 | Quả dưa chuột | Oi | 오이가 신선해요.\n우유 | Sữa | Uyu | 우유를 마셔요."}
                className="w-full p-3.5 rounded-xl border border-brand-border font-korean"
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsBatchImportOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="button" variant="primary" size="sm" onClick={handleBatchImport}>
                  Nhập dữ liệu
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
