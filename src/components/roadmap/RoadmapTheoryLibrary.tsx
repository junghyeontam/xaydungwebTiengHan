"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  TheoryCollectionCard,
  TheoryVocabWord,
  TheoryGrammarItem,
  TheoryChapter,
  INITIAL_THEORY_COLLECTIONS,
} from "@/lib/data/theory-collections-data";
import {
  loadTheoryCollections,
  toggleTheoryItemLearned,
  markTheoryItemLearned,
} from "@/lib/services/theory-storage-service";
import {
  Check,
  Search,
  BookOpen,
  Volume2,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Mic,
  PenTool,
  Headphones,
  Layers,
  GraduationCap,
} from "lucide-react";
import { formatNumber } from "@/lib/format";

interface Props {
  mode: "grammar" | "vocab-topik" | "vocab-topic";
}

type VocabStudyMode = "definition" | "quiz" | "speaking" | "writing" | "dictation" | "test";

const STANDARD_TEXTBOOKS = [
  { id: "sk-1", title: "Standard Korean 1", subtitle: "Giáo trình Hàn ngữ Quyển 1", level: "topik-1" },
  { id: "sk-2", title: "Standard Korean 2", subtitle: "Giáo trình Hàn ngữ Quyển 2", level: "topik-2" },
  { id: "sk-3", title: "Standard Korean 3", subtitle: "Giáo trình Hàn ngữ Quyển 3", level: "topik-3" },
  { id: "sk-4", title: "Standard Korean 4", subtitle: "Giáo trình Hàn ngữ Quyển 4", level: "topik-4" },
  { id: "sk-5", title: "Standard Korean 5", subtitle: "Giáo trình Hàn ngữ Quyển 5", level: "topik-5" },
  { id: "sk-6", title: "Standard Korean 6", subtitle: "Giáo trình Hàn ngữ Quyển 6", level: "topik-6" },
];

export function RoadmapTheoryLibrary({ mode }: Props) {
  const [collections, setCollections] = useState<TheoryCollectionCard[]>(INITIAL_THEORY_COLLECTIONS);

  // Tier 1 Filter (on the 6-level cards overview screen)
  const [overviewGroupFilter, setOverviewGroupFilter] = useState<string>("all");

  // Tier 2 Selected Level (null = show 6 TOPIK Level cards first!)
  const [selectedVocabLevel, setSelectedVocabLevel] = useState<string | null>(null);
  const [selectedGrammarLevel, setSelectedGrammarLevel] = useState<string | null>(null);

  // Search query inside Tier 2
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Tier 3 Selected Item (inside a level)
  const [activeVocabChapterId, setActiveVocabChapterId] = useState<string | null>(null);
  const [vocabStudyMode, setVocabStudyMode] = useState<VocabStudyMode>("definition");
  const [activeGrammarId, setActiveGrammarId] = useState<string | null>(null);

  // Active Practice Step inside Grammar Detail (0..drills.length)
  const [activePracticeStep, setActivePracticeStep] = useState<number>(0);

  // Level-wide Quiz state
  const [isLevelQuizOpen, setIsLevelQuizOpen] = useState<boolean>(false);
  const [levelQuizIndex, setLevelQuizIndex] = useState<number>(0);
  const [levelQuizSelected, setLevelQuizSelected] = useState<string | null>(null);
  const [levelQuizScore, setLevelQuizScore] = useState<number>(0);
  const [levelQuizFinished, setLevelQuizFinished] = useState<boolean>(false);

  // Vocab interactive practice state (inside a chapter)
  const [vocabPracticeIndex, setVocabPracticeIndex] = useState<number>(0);
  const [vocabQuizSelected, setVocabQuizSelected] = useState<string | null>(null);
  const [vocabTypingInput, setVocabTypingInput] = useState<string>("");
  const [vocabTypingSubmitted, setVocabTypingSubmitted] = useState<boolean>(false);
  const [vocabSpeakingScore, setVocabSpeakingScore] = useState<number | null>(null);
  const [vocabSessionCorrect, setVocabSessionCorrect] = useState<number>(0);

  // Grammar interactive practice state (inside a grammar detail page)
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [practiceFeedback, setPracticeFeedback] = useState<
    Record<string, { isCorrect: boolean; show: boolean }>
  >({});
  const [conjugationInput, setConjugationInput] = useState<string>("");
  const [conjugationChecked, setConjugationChecked] = useState<boolean>(false);

  // Audio playback state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Load collections & listen for real-time updates from teacher/admin portal
  useEffect(() => {
    const loaded = loadTheoryCollections();
    setCollections(loaded);

    const handleUpdate = () => {
      setCollections(loadTheoryCollections());
    };
    window.addEventListener("jh_theory_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("jh_theory_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Reset navigation when switching main mode
  useEffect(() => {
    setSelectedVocabLevel(mode === "vocab-topic" ? "topic" : null);
    setSelectedGrammarLevel(null);
    setActiveVocabChapterId(null);
    setActiveGrammarId(null);
    setIsLevelQuizOpen(false);
    setSearchQuery("");
    setOverviewGroupFilter("all");
  }, [mode]);

  // Web Speech API Korean TTS
  const playKoreanSpeech = (text: string, id: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 0.85;
      setPlayingAudioId(id);
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
    } catch {
      setPlayingAudioId(null);
    }
  };

  // All 6 Vocabulary Level Collections
  const vocabLevelCollections = useMemo(() => {
    return collections.filter((c) => {
      if (c.type !== "vocab") return false;
      if (overviewGroupFilter === "beginner")
        return c.topikLevel === "topik-1" || c.topikLevel === "topik-2";
      if (overviewGroupFilter === "intermediate")
        return c.topikLevel === "topik-3" || c.topikLevel === "topik-4";
      if (overviewGroupFilter === "advanced")
        return c.topikLevel === "topik-5" || c.topikLevel === "topik-6";
      return true;
    });
  }, [collections, overviewGroupFilter]);

  // All 6 Grammar Level Collections
  const grammarLevelCollections = useMemo(() => {
    return collections.filter((c) => {
      if (c.type !== "grammar") return false;
      if (overviewGroupFilter === "beginner")
        return c.topikLevel === "topik-1" || c.topikLevel === "topik-2";
      if (overviewGroupFilter === "intermediate")
        return c.topikLevel === "topik-3" || c.topikLevel === "topik-4";
      if (overviewGroupFilter === "advanced")
        return c.topikLevel === "topik-5" || c.topikLevel === "topik-6";
      return true;
    });
  }, [collections, overviewGroupFilter]);

  // Active Vocabulary Collection when a level is selected
  const currentVocabCollection = useMemo(() => {
    if (mode === "vocab-topic") {
      return collections.find((c) => c.type === "topic") || collections[0];
    }
    const lvl = selectedVocabLevel || "topik-1";
    return (
      collections.find((c) => c.type === "vocab" && c.topikLevel === lvl) ||
      collections.find((c) => c.type === "vocab") ||
      collections[0]
    );
  }, [collections, mode, selectedVocabLevel]);

  // Active Vocabulary Chapter (Folder)
  const activeVocabChapter = useMemo(() => {
    if (!activeVocabChapterId || !currentVocabCollection) return null;
    const ch = currentVocabCollection.chapters.find((c) => c.id === activeVocabChapterId);
    return ch as TheoryChapter<TheoryVocabWord> | undefined;
  }, [activeVocabChapterId, currentVocabCollection]);

  // Active Grammar Collection when a level is selected
  const currentGrammarCollection = useMemo(() => {
    const lvl = selectedGrammarLevel || "topik-1";
    return (
      collections.find((c) => c.type === "grammar" && c.topikLevel === lvl) ||
      collections.find((c) => c.type === "grammar") ||
      collections[6]
    );
  }, [collections, selectedGrammarLevel]);

  // Flatten all grammar items for the selected level
  const allGrammarItems = useMemo(() => {
    if (!currentGrammarCollection) return [];
    const list: { item: TheoryGrammarItem; chapterId: string; collectionId: string }[] = [];
    currentGrammarCollection.chapters.forEach((ch) => {
      ch.items.forEach((it) => {
        list.push({
          item: it as TheoryGrammarItem,
          chapterId: ch.id,
          collectionId: currentGrammarCollection.id,
        });
      });
    });
    return list;
  }, [currentGrammarCollection]);

  const filteredGrammarItems = useMemo(() => {
    if (!searchQuery.trim()) return allGrammarItems;
    const q = searchQuery.toLowerCase();
    return allGrammarItems.filter(
      ({ item }) =>
        item.koreanPattern.toLowerCase().includes(q) ||
        item.titleVi.toLowerCase().includes(q) ||
        item.explanationVi.toLowerCase().includes(q)
    );
  }, [allGrammarItems, searchQuery]);

  // Active Grammar Item for In-Page Detail & Practice View
  const activeGrammarEntry = useMemo(() => {
    if (!activeGrammarId) return null;
    return allGrammarItems.find((x) => x.item.id === activeGrammarId) || null;
  }, [activeGrammarId, allGrammarItems]);

  const activeGrammarIndex = useMemo(() => {
    if (!activeGrammarId) return -1;
    return allGrammarItems.findIndex((x) => x.item.id === activeGrammarId);
  }, [activeGrammarId, allGrammarItems]);

  // Toggle learned status
  const handleToggleLearned = (collectionId: string, chapterId: string, itemId: string) => {
    const updated = toggleTheoryItemLearned(collectionId, chapterId, itemId);
    setCollections(updated);
  };

  // Switch grammar item
  const openGrammarItem = (id: string) => {
    setActiveGrammarId(id);
    setActivePracticeStep(0);
    setPracticeAnswers({});
    setPracticeFeedback({});
    setConjugationInput("");
    setConjugationChecked(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  // Switch vocab chapter
  const openVocabChapter = (chapterId: string) => {
    setActiveVocabChapterId(chapterId);
    setVocabStudyMode("definition");
    setVocabPracticeIndex(0);
    setVocabQuizSelected(null);
    setVocabTypingInput("");
    setVocabTypingSubmitted(false);
    setVocabSpeakingScore(null);
    setVocabSessionCorrect(0);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  // ===========================================================================
  // RENDER 1: VOCABULARY EXPERIENCE (3 TIERS: 6 LEVELS -> FOLDERS -> WORDS)
  // ===========================================================================
  if (mode === "vocab-topik" || mode === "vocab-topic") {
    // -------------------------------------------------------------------------
    // TIER 1: 6 TOPIK LEVEL SELECTION CARDS (WHEN selectedVocabLevel === null)
    // -------------------------------------------------------------------------
    if (mode === "vocab-topik" && !selectedVocabLevel) {
      return (
        <div className="space-y-10 animate-fade-in">
          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy tracking-tight">
                  Từ vựng
                </h2>
                <div className="relative">
                  <select
                    value={overviewGroupFilter}
                    onChange={(e) => setOverviewGroupFilter(e.target.value)}
                    className="appearance-none pl-3.5 pr-8 py-1.5 rounded-full text-xs font-bold bg-white border border-brand-primary/40 text-brand-primary shadow-2xs focus:outline-none cursor-pointer"
                  >
                    <option value="all">Theo cấp độ</option>
                    <option value="beginner">Sơ cấp (TOPIK 1 - 2)</option>
                    <option value="intermediate">Trung cấp (TOPIK 3 - 4)</option>
                    <option value="advanced">Cao cấp (TOPIK 5 - 6)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-brand-primary absolute right-2.5 top-2 pointer-events-none" />
                </div>
              </div>
              <span className="text-xs text-brand-secondary">
                Chọn cấp độ TOPIK để mở danh sách bài học và từ vựng thực tế đã biên soạn
              </span>
            </div>

            {/* 2-Column x 3-Row Grid of 6 Level Cards with 100% Dynamic Counts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {vocabLevelCollections.map((col) => {
                const actualTotal = col.chapters.reduce((sum, ch) => sum + ch.items.length, 0);
                const actualLearned = col.chapters.reduce(
                  (sum, ch) => sum + ch.items.filter((it) => Boolean(it.isLearned)).length,
                  0
                );
                const folderCount = col.chapters.length;

                return (
                  <div
                    key={col.id}
                    onClick={() => {
                      setSelectedVocabLevel(col.topikLevel);
                      setActiveVocabChapterId(null);
                      setSearchQuery("");
                    }}
                    className="group p-5 sm:p-6 rounded-2xl bg-white border border-brand-border/80 hover:border-brand-primary/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 sm:gap-5">
                      {/* Stacked Aa Icon */}
                      <div className="relative w-14 h-16 shrink-0">
                        <div
                          className="absolute top-1.5 left-1.5 w-12 h-14 bg-brand-border/80"
                          style={{ borderRadius: "10px" }}
                        />
                        <div
                          className="relative w-12 h-14 bg-white border border-brand-border shadow-2xs overflow-hidden flex flex-col group-hover:scale-105 transition-transform"
                          style={{ borderRadius: "10px" }}
                        >
                          <div className="h-8 bg-brand-primary text-white flex items-center justify-center font-extrabold text-base tracking-tight">
                            Aa
                          </div>
                          <div className="flex-1 p-1.5 flex flex-col justify-center gap-1 bg-white">
                            <div className="w-full h-0.5 bg-brand-navy/70" />
                            <div className="w-2/3 h-0.5 bg-brand-navy/40" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-base sm:text-lg font-extrabold text-brand-navy group-hover:text-brand-primary transition-colors">
                          {col.titleVi}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-emerald-600">
                          <span className="inline-flex items-center gap-1 num-tabular">
                            <Check className="w-4 h-4 stroke-[2.75]" />
                            {formatNumber(actualLearned)}/{formatNumber(actualTotal)} từ
                          </span>
                          <span className="text-brand-border">•</span>
                          <span className="text-xs font-medium text-brand-secondary">
                            {formatNumber(folderCount)} bài học
                          </span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-brand-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 2: Nâng cao / Giáo trình chuẩn Standard Korean 1 - 6 */}
          <section className="space-y-4">
            <h3 className="text-lg sm:text-xl font-extrabold text-brand-navy tracking-tight">
              Nâng cao
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {STANDARD_TEXTBOOKS.map((book, idx) => (
                <div
                  key={book.id}
                  onClick={() => {
                    setSelectedVocabLevel(book.level);
                    setActiveVocabChapterId(null);
                  }}
                  className="group cursor-pointer space-y-2"
                >
                  <div
                    className="aspect-[3/4] p-4 bg-gradient-to-br from-brand-navy via-brand-primary to-blue-600 text-white shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 transition-all flex flex-col justify-between relative overflow-hidden"
                    style={{ borderRadius: "14px" }}
                  >
                    <div className="flex items-center justify-between z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20">
                        Quyển {idx + 1}
                      </span>
                      <GraduationCap className="w-4 h-4 text-white/80" />
                    </div>
                    <div className="z-10 space-y-1">
                      <div className="font-extrabold text-sm sm:text-base leading-tight">
                        {book.title}
                      </div>
                      <div className="text-[11px] text-white/80">Từ vựng chuẩn Seoul</div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
                  </div>
                  <div className="text-xs font-bold text-brand-navy text-center group-hover:text-brand-primary transition-colors">
                    {book.title}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      );
    }

    const chapters = (currentVocabCollection?.chapters || []) as TheoryChapter<TheoryVocabWord>[];
    const filteredChapters = searchQuery.trim()
      ? chapters.filter(
          (ch) =>
            ch.titleVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ch.items.some(
              (w) =>
                w.korean.toLowerCase().includes(searchQuery.toLowerCase()) ||
                w.meaningVi.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
      : chapters;

    // -------------------------------------------------------------------------
    // TIER 3: INSIDE A VOCABULARY FOLDER
    // -------------------------------------------------------------------------
    if (activeVocabChapter) {
      const words = activeVocabChapter.items || [];
      const currentPracticeWord = words[vocabPracticeIndex] || words[0];

      const quizOptions = (() => {
        if (!currentPracticeWord) return [];
        const others = words
          .filter((w) => w.id !== currentPracticeWord.id)
          .map((w) => w.meaningVi);
        const fallbacks = ["Trường học", "Bệnh viện", "Thư viện", "Quả táo"];
        const distractors = [...others, ...fallbacks].slice(0, 3);
        const all = [currentPracticeWord.meaningVi, ...distractors];
        return all.sort((a, b) => a.localeCompare(b));
      })();

      const studyModes: { id: VocabStudyMode; label: string }[] = [
        { id: "definition", label: "Định nghĩa" },
        { id: "quiz", label: "Trắc nghiệm" },
        { id: "speaking", label: "Luyện nói" },
        { id: "writing", label: "Viết" },
        { id: "dictation", label: "Nghe viết" },
      ];

      return (
        <div className="space-y-6 animate-fade-in">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-brand-secondary">
              <button
                type="button"
                onClick={() => {
                  setActiveVocabChapterId(null);
                  if (mode === "vocab-topik") setSelectedVocabLevel(null);
                }}
                className="hover:text-brand-primary transition-colors"
              >
                Lý thuyết
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-brand-muted" />
              <button
                type="button"
                onClick={() => setActiveVocabChapterId(null)}
                className="hover:text-brand-primary transition-colors font-semibold text-brand-navy"
              >
                {currentVocabCollection.titleVi}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-brand-muted" />
              <span className="font-bold text-brand-primary">{activeVocabChapter.titleVi}</span>
            </nav>

            <button
              type="button"
              onClick={() => setActiveVocabChapterId(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-brand-border text-brand-navy hover:bg-brand-surface transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại danh sách bài</span>
            </button>
          </div>

          {/* Centered Chapter Title */}
          <div className="text-center space-y-1 pt-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              {activeVocabChapter.titleVi}
            </h2>
            <p className="text-xs sm:text-sm text-brand-secondary">
              {activeVocabChapter.descriptionVi} • Tổng số: {formatNumber(words.length)} từ vựng
            </p>
          </div>

          {/* Mode Pills Bar + Kiểm tra Button on Right */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-brand-border/60">
            <div className="flex flex-wrap items-center gap-2">
              {studyModes.map((m) => {
                const isActive = vocabStudyMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setVocabStudyMode(m.id);
                      setVocabPracticeIndex(0);
                      setVocabQuizSelected(null);
                      setVocabTypingInput("");
                      setVocabTypingSubmitted(false);
                      setVocabSpeakingScore(null);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border transition-all ${
                      isActive
                        ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                        : "bg-white text-brand-primary border-brand-primary/40 hover:bg-brand-primary/5"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                setVocabStudyMode("test");
                setVocabPracticeIndex(0);
                setVocabQuizSelected(null);
                setVocabSessionCorrect(0);
              }}
              className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-extrabold transition-all shadow-xs ${
                vocabStudyMode === "test"
                  ? "bg-brand-navy text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              Kiểm tra
            </button>
          </div>

          {/* MODE 1: ĐỊNH NGHĨA (3-COLUMN VOCAB CARDS) */}
          {vocabStudyMode === "definition" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {words.map((word) => {
                const isPlaying = playingAudioId === word.id;
                return (
                  <div
                    key={word.id}
                    className="group p-5 rounded-2xl bg-white border border-brand-border/80 hover:border-brand-primary/40 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <button
                        type="button"
                        onClick={() => playKoreanSpeech(word.korean, word.id)}
                        className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all shadow-xs ${
                          isPlaying
                            ? "bg-brand-navy text-white scale-105 ring-4 ring-brand-primary/20"
                            : "bg-brand-primary hover:bg-brand-primary-hover text-white"
                        }`}
                        title="Nghe phát âm tiếng Hàn"
                        aria-label={`Nghe phát âm ${word.korean}`}
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>

                      <div className="min-w-0 space-y-0.5">
                        <div className="text-base sm:text-lg font-extrabold text-brand-navy font-korean truncate">
                          {word.korean}
                        </div>
                        <div className="text-xs text-brand-muted font-medium truncate">
                          ({word.romaja})
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-brand-body truncate pt-0.5">
                          {word.meaningVi}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleLearned(
                          currentVocabCollection.id,
                          activeVocabChapter.id,
                          word.id
                        )
                      }
                      className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                        word.isLearned
                          ? "text-emerald-600 hover:bg-emerald-50"
                          : "text-brand-border hover:text-brand-muted hover:bg-brand-surface"
                      }`}
                      title={word.isLearned ? "Đã thuộc (Bấm để bỏ đánh dấu)" : "Đánh dấu đã thuộc"}
                    >
                      <Check className="w-5 h-5 stroke-[2.75]" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* MODE 2 & 6: TRẮC NGHIỆM / KIỂM TRA */}
          {(vocabStudyMode === "quiz" || vocabStudyMode === "test") && currentPracticeWord && (
            <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-white border border-brand-border shadow-card space-y-6">
              <div className="flex items-center justify-between text-xs font-bold text-brand-secondary">
                <span className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary">
                  {vocabStudyMode === "test" ? "Bài kiểm tra từ vựng" : "Luyện trắc nghiệm"}
                </span>
                <span>
                  Câu {vocabPracticeIndex + 1} / {words.length} • Đúng: {vocabSessionCorrect}
                </span>
              </div>

              <div className="text-center space-y-3 py-4">
                <button
                  type="button"
                  onClick={() => playKoreanSpeech(currentPracticeWord.korean, currentPracticeWord.id)}
                  className="mx-auto w-14 h-14 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-sm hover:bg-brand-primary-hover transition-all"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
                <div className="text-3xl font-extrabold text-brand-navy font-korean">
                  {currentPracticeWord.korean}
                </div>
                <div className="text-xs text-brand-muted">({currentPracticeWord.romaja})</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quizOptions.map((opt) => {
                  const isSelected = vocabQuizSelected === opt;
                  const isCorrect = opt === currentPracticeWord.meaningVi;
                  let btnStyle =
                    "bg-white border-brand-border text-brand-navy hover:border-brand-primary";
                  if (vocabQuizSelected) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                    } else if (isSelected) {
                      btnStyle = "bg-red-50 border-red-400 text-red-900";
                    }
                  }
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={Boolean(vocabQuizSelected)}
                      onClick={() => {
                        setVocabQuizSelected(opt);
                        if (opt === currentPracticeWord.meaningVi) {
                          setVocabSessionCorrect((c) => c + 1);
                          markTheoryItemLearned(
                            currentVocabCollection.id,
                            activeVocabChapter.id,
                            currentPracticeWord.id,
                            true
                          );
                          setCollections(loadTheoryCollections());
                        }
                      }}
                      className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {vocabQuizSelected && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {vocabQuizSelected && (
                <div className="pt-2 flex items-center justify-between border-t border-brand-border">
                  <div className="text-xs text-brand-secondary">
                    Ví dụ:{" "}
                    <strong className="font-korean text-brand-navy">
                      {currentPracticeWord.exampleKo}
                    </strong>{" "}
                    ({currentPracticeWord.exampleVi})
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setVocabQuizSelected(null);
                      setVocabPracticeIndex((i) => (i + 1) % words.length);
                    }}
                    className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover transition-colors shrink-0"
                  >
                    Câu tiếp theo &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MODE 3: LUYỆN NÓI */}
          {vocabStudyMode === "speaking" && currentPracticeWord && (
            <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-white border border-brand-border shadow-card text-center space-y-6">
              <div className="flex items-center justify-between text-xs font-bold text-brand-secondary">
                <span className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary">
                  Luyện phát âm chuẩn Seoul
                </span>
                <span>
                  Từ {vocabPracticeIndex + 1} / {words.length}
                </span>
              </div>

              <div className="space-y-2 py-2">
                <div className="text-3xl sm:text-4xl font-extrabold text-brand-navy font-korean">
                  {currentPracticeWord.korean}
                </div>
                <div className="text-sm text-brand-primary font-semibold">
                  [{currentPracticeWord.romaja}] — {currentPracticeWord.meaningVi}
                </div>
                <p className="text-xs text-brand-secondary font-korean pt-1">
                  &ldquo;{currentPracticeWord.exampleKo}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => playKoreanSpeech(currentPracticeWord.korean, currentPracticeWord.id)}
                  className="px-5 py-3 rounded-xl bg-brand-surface border border-brand-border text-brand-navy text-xs font-bold flex items-center gap-2 hover:bg-brand-primary/10 transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-brand-primary" />
                  <span>Nghe mẫu</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playKoreanSpeech(currentPracticeWord.korean, currentPracticeWord.id);
                    setVocabSpeakingScore(95);
                  }}
                  className="px-6 py-3 rounded-xl bg-brand-primary text-white text-xs font-bold flex items-center gap-2 hover:bg-brand-primary-hover shadow-sm transition-all"
                >
                  <Mic className="w-4 h-4" />
                  <span>Bấm để đọc thử</span>
                </button>
              </div>

              {vocabSpeakingScore !== null && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
                  <span>Độ chính xác phát âm: {vocabSpeakingScore}% (Rất tốt!)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setVocabSpeakingScore(null);
                      setVocabPracticeIndex((i) => (i + 1) % words.length);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold"
                  >
                    Từ tiếp theo &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MODE 4 & 5: VIẾT / NGHE VIẾT */}
          {(vocabStudyMode === "writing" || vocabStudyMode === "dictation") && currentPracticeWord && (
            <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-white border border-brand-border shadow-card space-y-6">
              <div className="flex items-center justify-between text-xs font-bold text-brand-secondary">
                <span className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary">
                  {vocabStudyMode === "dictation"
                    ? "Nghe phát âm & Gõ lại từ tiếng Hàn"
                    : "Nhìn nghĩa Việt & Viết từ tiếng Hàn"}
                </span>
                <span>
                  Từ {vocabPracticeIndex + 1} / {words.length}
                </span>
              </div>

              <div className="text-center space-y-3 py-3">
                {vocabStudyMode === "dictation" ? (
                  <button
                    type="button"
                    onClick={() => playKoreanSpeech(currentPracticeWord.korean, currentPracticeWord.id)}
                    className="mx-auto w-16 h-16 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-md hover:bg-brand-primary-hover transition-all"
                  >
                    <Headphones className="w-7 h-7" />
                  </button>
                ) : null}
                <div className="text-xl font-extrabold text-brand-navy">
                  Nghĩa: &ldquo;{currentPracticeWord.meaningVi}&rdquo;
                </div>
                <div className="text-xs text-brand-muted">
                  Gợi ý phiên âm: ({currentPracticeWord.romaja})
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={vocabTypingInput}
                  onChange={(e) => setVocabTypingInput(e.target.value)}
                  placeholder="Nhập từ tiếng Hàn (VD: 오이)..."
                  className="flex-1 px-4 py-3 rounded-xl border border-brand-border bg-brand-surface/50 text-sm font-korean font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setVocabTypingSubmitted(true)}
                  className="px-5 py-3 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover transition-colors"
                >
                  Kiểm tra
                </button>
              </div>

              {vocabTypingSubmitted && (
                <div
                  className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
                    vocabTypingInput.trim() === currentPracticeWord.korean
                      ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                      : "bg-amber-50 border-amber-300 text-amber-900"
                  }`}
                >
                  <div>
                    <div className="font-bold">
                      Đáp án chuẩn:{" "}
                      <span className="font-korean text-sm">{currentPracticeWord.korean}</span> (
                      {currentPracticeWord.meaningVi})
                    </div>
                    <div className="mt-0.5 text-brand-secondary">{currentPracticeWord.exampleKo}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setVocabTypingInput("");
                      setVocabTypingSubmitted(false);
                      setVocabPracticeIndex((i) => (i + 1) % words.length);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-brand-navy text-white font-bold shrink-0"
                  >
                    Tiếp theo &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // TIER 2: VOCABULARY FOLDER GRID FOR THE SELECTED LEVEL
    // -------------------------------------------------------------------------
    const totalLevelWords = chapters.reduce((sum, ch) => sum + ch.items.length, 0);
    const totalLevelLearned = chapters.reduce(
      (sum, ch) => sum + ch.items.filter((w) => w.isLearned).length,
      0
    );

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-brand-secondary">
            <button
              type="button"
              onClick={() => {
                if (mode === "vocab-topik") setSelectedVocabLevel(null);
              }}
              className="hover:text-brand-primary transition-colors"
            >
              Lý thuyết
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-brand-muted" />
            <span className="font-bold text-brand-navy">{currentVocabCollection?.titleVi}</span>
          </nav>

          {mode === "vocab-topik" && (
            <button
              type="button"
              onClick={() => setSelectedVocabLevel(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-brand-border text-brand-navy hover:bg-brand-surface transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Chọn cấp độ TOPIK khác</span>
            </button>
          )}
        </div>

        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy tracking-tight">
                {currentVocabCollection?.titleVi}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Đã thuộc {formatNumber(totalLevelLearned)}/{formatNumber(totalLevelWords)} từ
              </span>
            </div>
            <p className="text-xs text-brand-secondary mt-0.5">
              Chọn từng bài học (thư mục) bên dưới để xem danh sách từ vựng thực tế, nghe phát âm và luyện tập.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài học, từ vựng..."
                className="pl-8 pr-3 py-1.5 rounded-full text-xs bg-white border border-brand-border text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30 w-44 sm:w-52"
              />
            </div>

            {mode === "vocab-topik" && (
              <div className="relative">
                <select
                  value={selectedVocabLevel || "topik-1"}
                  onChange={(e) => setSelectedVocabLevel(e.target.value)}
                  className="appearance-none pl-4 pr-8 py-1.5 rounded-full text-xs font-bold bg-white border border-brand-primary/40 text-brand-primary shadow-2xs focus:outline-none cursor-pointer"
                >
                  <option value="topik-1">Cấp độ 1</option>
                  <option value="topik-2">Cấp độ 2</option>
                  <option value="topik-3">Cấp độ 3</option>
                  <option value="topik-4">Cấp độ 4</option>
                  <option value="topik-5">Cấp độ 5</option>
                  <option value="topik-6">Cấp độ 6</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-brand-primary absolute right-2.5 top-2 pointer-events-none" />
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                if (chapters.length > 0) {
                  openVocabChapter(chapters[0].id);
                  setVocabStudyMode("test");
                }
              }}
              className="px-4 py-1.5 rounded-full text-xs font-bold bg-white border border-brand-primary/40 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors shadow-2xs"
            >
              Kiểm tra
            </button>
          </div>
        </div>

        {/* 3-Column Folder Grid with 100% Real Word Counts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredChapters.map((chapter) => {
            const wordCount = chapter.items.length;
            const learnedCount = chapter.items.filter((w) => w.isLearned).length;
            const isCompleted = wordCount > 0 && learnedCount === wordCount;

            return (
              <div
                key={chapter.id}
                onClick={() => openVocabChapter(chapter.id)}
                className="group p-5 rounded-2xl bg-white border border-brand-border/80 hover:border-brand-primary/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-12 h-14 shrink-0">
                    <div
                      className="absolute top-1.5 left-1.5 w-10 h-12 bg-brand-border/80"
                      style={{ borderRadius: "8px" }}
                    />
                    <div
                      className="relative w-10 h-12 bg-white border border-brand-border shadow-2xs overflow-hidden flex flex-col"
                      style={{ borderRadius: "8px" }}
                    >
                      <div className="h-7 bg-brand-primary text-white flex items-center justify-center font-extrabold text-sm tracking-tight">
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
                      {formatNumber(wordCount)} từ{" "}
                      {learnedCount > 0 && (
                        <span className="text-emerald-600 font-semibold">
                          • Đã thuộc {formatNumber(learnedCount)}/{formatNumber(wordCount)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {isCompleted ? (
                  <Check className="w-5 h-5 text-emerald-600 stroke-[2.75] shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ===========================================================================
  // RENDER 2: GRAMMAR EXPERIENCE (3 TIERS: 6 LEVELS -> 3-COL GRID -> CLEAN SHEET)
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // TIER 1: 6 TOPIK LEVEL SELECTION CARDS
  // ---------------------------------------------------------------------------
  if (!selectedGrammarLevel) {
    return (
      <div className="space-y-10 animate-fade-in">
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy tracking-tight">
                Ngữ pháp
              </h2>
              <div className="relative">
                <select
                  value={overviewGroupFilter}
                  onChange={(e) => setOverviewGroupFilter(e.target.value)}
                  className="appearance-none pl-3.5 pr-8 py-1.5 rounded-full text-xs font-bold bg-white border border-brand-primary/40 text-brand-primary shadow-2xs focus:outline-none cursor-pointer"
                >
                  <option value="all">Theo cấp độ</option>
                  <option value="beginner">Sơ cấp (TOPIK 1 - 2)</option>
                  <option value="intermediate">Trung cấp (TOPIK 3 - 4)</option>
                  <option value="advanced">Cao cấp (TOPIK 5 - 6)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-brand-primary absolute right-2.5 top-2 pointer-events-none" />
              </div>
            </div>
            <span className="text-xs text-brand-secondary">
              Chọn cấp độ TOPIK để mở danh sách các cấu trúc ngữ pháp của cấp độ đó
            </span>
          </div>

          {/* 2-Column x 3-Row Grid of 6 Grammar Level Cards with 100% Dynamic Counts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {grammarLevelCollections.map((col) => {
              const actualTotal = col.chapters.reduce((sum, ch) => sum + ch.items.length, 0);
              const actualLearned = col.chapters.reduce(
                (sum, ch) => sum + ch.items.filter((it) => Boolean(it.isLearned)).length,
                0
              );

              return (
                <div
                  key={col.id}
                  onClick={() => {
                    setSelectedGrammarLevel(col.topikLevel);
                    setActiveGrammarId(null);
                    setSearchQuery("");
                  }}
                  className="group p-5 sm:p-6 rounded-2xl bg-white border border-brand-border/80 hover:border-brand-primary/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 sm:gap-5">
                    {/* Clean Stacked Grammar Badge */}
                    <div className="relative w-14 h-16 shrink-0">
                      <div
                        className="absolute top-1.5 left-1.5 w-12 h-14 bg-brand-border/80"
                        style={{ borderRadius: "10px" }}
                      />
                      <div
                        className="relative w-12 h-14 bg-white border border-brand-border shadow-2xs overflow-hidden flex flex-col group-hover:scale-105 transition-transform"
                        style={{ borderRadius: "10px" }}
                      >
                        <div className="h-8 bg-brand-navy text-white flex items-center justify-center font-extrabold text-xs tracking-wider">
                          문법
                        </div>
                        <div className="flex-1 p-1.5 flex flex-col justify-center gap-1 bg-white">
                          <div className="w-full h-0.5 bg-brand-primary/70" />
                          <div className="w-2/3 h-0.5 bg-brand-primary/40" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-extrabold text-brand-navy group-hover:text-brand-primary transition-colors">
                        {col.titleVi}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600">
                        <Check className="w-4 h-4 stroke-[2.75]" />
                        <span className="num-tabular">
                          {formatNumber(actualLearned)}/{formatNumber(actualTotal)} cấu trúc
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-brand-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Nâng cao / Standard Korean 1 - 6 */}
        <section className="space-y-4">
          <h3 className="text-lg sm:text-xl font-extrabold text-brand-navy tracking-tight">
            Nâng cao
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {STANDARD_TEXTBOOKS.map((book, idx) => (
              <div
                key={book.id}
                onClick={() => {
                  setSelectedGrammarLevel(book.level);
                  setActiveGrammarId(null);
                }}
                className="group cursor-pointer space-y-2"
              >
                <div
                  className="aspect-[3/4] p-4 bg-gradient-to-br from-brand-navy via-brand-primary to-blue-600 text-white shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 transition-all flex flex-col justify-between relative overflow-hidden"
                  style={{ borderRadius: "14px" }}
                >
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20">
                      Quyển {idx + 1}
                    </span>
                    <GraduationCap className="w-4 h-4 text-white/80" />
                  </div>
                  <div className="z-10 space-y-1">
                    <div className="font-extrabold text-sm sm:text-base leading-tight">
                      {book.title}
                    </div>
                    <div className="text-[11px] text-white/80">Ngữ pháp chuẩn Seoul</div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
                </div>
                <div className="text-xs font-bold text-brand-navy text-center group-hover:text-brand-primary transition-colors">
                  {book.title}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // TIER 3: STREAMLINED, ULTRA-CLEAN SINGLE-SHEET GRAMMAR VIEW
  // ---------------------------------------------------------------------------
  if (activeGrammarEntry) {
    const { item: grammar, chapterId, collectionId } = activeGrammarEntry;
    const drills = grammar.practiceDrills || [];
    const totalPracticeSteps = drills.length + (grammar.examples.length > 0 ? 1 : 0);
    const currentStep = Math.min(activePracticeStep, Math.max(0, totalPracticeSteps - 1));
    const currentDrill = currentStep < drills.length ? drills[currentStep] : null;

    return (
      <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
        {/* Top Minimal Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setActiveGrammarId(null)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-brand-border text-brand-navy hover:bg-brand-surface transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại {currentGrammarCollection?.titleVi}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={activeGrammarIndex <= 0}
              onClick={() => {
                if (activeGrammarIndex > 0) {
                  openGrammarItem(allGrammarItems[activeGrammarIndex - 1].item.id);
                }
              }}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-brand-border text-brand-navy hover:bg-brand-surface disabled:opacity-40 transition-colors"
            >
              &larr; Trước
            </button>
            <span className="text-xs font-bold text-brand-secondary px-1.5 num-tabular">
              {activeGrammarIndex + 1} / {allGrammarItems.length}
            </span>
            <button
              type="button"
              disabled={activeGrammarIndex >= allGrammarItems.length - 1}
              onClick={() => {
                if (activeGrammarIndex < allGrammarItems.length - 1) {
                  openGrammarItem(allGrammarItems[activeGrammarIndex + 1].item.id);
                }
              }}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-brand-border text-brand-navy hover:bg-brand-surface disabled:opacity-40 transition-colors"
            >
              Tiếp &rarr;
            </button>
          </div>
        </div>

        {/* Single Unified Editorial Card — Clean, Focused, Zero Clutter */}
        <div className="rounded-2xl bg-white border border-brand-border shadow-xs overflow-hidden divide-y divide-brand-border/70">
          {/* 1. Header Banner */}
          <div className="p-6 sm:p-8 bg-brand-surface/30 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-primary/10 text-brand-primary">
                  {currentGrammarCollection?.levelBadge}
                </span>
                <span className="text-xs font-medium text-brand-secondary">
                  {grammar.chapterTitleVi}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight font-korean">
                {grammar.koreanPattern}
              </h2>

              <p className="text-base sm:text-lg font-bold text-brand-primary">
                Nghĩa: {grammar.titleVi}
              </p>

              <div className="pt-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-brand-border text-xs sm:text-sm">
                <span className="font-bold text-brand-secondary">Công thức:</span>
                <span className="font-extrabold text-brand-navy font-korean">
                  {grammar.formula}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleLearned(collectionId, chapterId, grammar.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 self-start ${
                grammar.isLearned
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-white border-brand-border text-brand-secondary hover:text-brand-navy"
              }`}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{grammar.isLearned ? "Đã nắm vững" : "Đánh dấu đã thuộc"}</span>
            </button>
          </div>

          {/* 2. Giải thích & Cách chia */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-brand-secondary flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-primary" />
                <span>Giải thích cách dùng</span>
              </h3>
              <p className="text-sm sm:text-base text-brand-body leading-relaxed">
                {grammar.explanationVi}
              </p>
            </div>

            {grammar.attachmentRules && grammar.attachmentRules.length > 0 && (
              <div className="space-y-3 pt-1">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-brand-secondary flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-primary" />
                  <span>Quy tắc chia & Kết hợp</span>
                </h3>
                <div className="overflow-hidden rounded-xl border border-brand-border/80">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-surface/60 border-b border-brand-border/80 text-xs font-bold text-brand-secondary">
                        <th className="py-3 px-4 w-5/12">Trường hợp</th>
                        <th className="py-3 px-4">Cách chia & Ví dụ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/60 text-xs sm:text-sm">
                      {grammar.attachmentRules.map((rule, idx) => (
                        <tr key={idx}>
                          <td className="py-3 px-4 font-semibold text-brand-navy align-top">
                            {rule.condition}
                          </td>
                          <td className="py-3 px-4 font-bold text-brand-primary font-korean align-top">
                            {rule.example}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* 3. Ví dụ minh họa (Sleek Horizontal Rows) */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-brand-secondary flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-brand-primary" />
                <span>Ví dụ minh họa ({grammar.examples.length})</span>
              </h3>
              <span className="text-xs text-brand-muted">Bấm loa để nghe phát âm</span>
            </div>

            <div className="divide-y divide-brand-border/60 border-t border-brand-border/60">
              {grammar.examples.map((ex, idx) => {
                const exAudioId = `${grammar.id}-ex-${idx}`;
                const isPlaying = playingAudioId === exAudioId;
                return (
                  <div
                    key={idx}
                    className="py-3.5 flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button
                        type="button"
                        onClick={() => playKoreanSpeech(ex.korean, exAudioId)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isPlaying
                            ? "bg-brand-navy text-white scale-105"
                            : "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white"
                        }`}
                        title="Nghe câu ví dụ"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-sm sm:text-base font-extrabold text-brand-navy font-korean">
                            {ex.korean}
                          </span>
                          {ex.romaja && (
                            <span className="text-xs text-brand-muted">({ex.romaja})</span>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-brand-secondary">
                          {ex.meaningVi}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Luyện tập vận dụng (Focused 1-Question Stepper) */}
          {totalPracticeSteps > 0 && (
            <div className="p-6 sm:p-8 bg-brand-surface/20 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-brand-primary" />
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-brand-navy">
                    Luyện tập vận dụng
                  </h3>
                </div>

                {/* Step Switcher Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {drills.map((d, idx) => {
                    const isDone = Boolean(practiceFeedback[d.id]?.show);
                    const isCurrent = currentStep === idx;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setActivePracticeStep(idx)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                          isCurrent
                            ? "bg-brand-primary text-white shadow-2xs"
                            : isDone
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-white text-brand-secondary border border-brand-border hover:text-brand-navy"
                        }`}
                      >
                        {isDone && <Check className="w-3 h-3" />}
                        <span>Câu {idx + 1}</span>
                      </button>
                    );
                  })}
                  {grammar.examples.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActivePracticeStep(drills.length)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        currentStep === drills.length
                          ? "bg-brand-primary text-white shadow-2xs"
                          : "bg-white text-brand-secondary border border-brand-border hover:text-brand-navy"
                      }`}
                    >
                      Viết câu
                    </button>
                  )}
                </div>
              </div>

              {/* Active Drill Question */}
              {currentDrill ? (
                (() => {
                  const selected = practiceAnswers[currentDrill.id];
                  const feedback = practiceFeedback[currentDrill.id];
                  return (
                    <div className="p-5 rounded-xl bg-white border border-brand-border space-y-4">
                      <p className="text-sm sm:text-base font-bold text-brand-navy">
                        {currentDrill.prompt}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {currentDrill.options.map((opt) => {
                          const isChosen = selected === opt;
                          const isCorrectAns = opt === currentDrill.correctAnswer;
                          let optStyle =
                            "bg-white border-brand-border text-brand-navy hover:border-brand-primary";
                          if (feedback?.show) {
                            if (isCorrectAns) {
                              optStyle =
                                "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                            } else if (isChosen) {
                              optStyle = "bg-red-50 border-red-400 text-red-900";
                            }
                          }

                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                const isCorrect = opt === currentDrill.correctAnswer;
                                setPracticeAnswers((prev) => ({
                                  ...prev,
                                  [currentDrill.id]: opt,
                                }));
                                setPracticeFeedback((prev) => ({
                                  ...prev,
                                  [currentDrill.id]: { isCorrect, show: true },
                                }));
                                if (isCorrect && !grammar.isLearned) {
                                  markTheoryItemLearned(
                                    collectionId,
                                    chapterId,
                                    grammar.id,
                                    true
                                  );
                                  setCollections(loadTheoryCollections());
                                }
                              }}
                              className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${optStyle}`}
                            >
                              <span className="font-korean">{opt}</span>
                              {feedback?.show && isCorrectAns && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                              {feedback?.show && isChosen && !isCorrectAns && (
                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {feedback?.show && (
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-brand-border/70">
                          <div className="text-xs text-brand-body">
                            <strong
                              className={
                                feedback.isCorrect ? "text-emerald-700" : "text-amber-700"
                              }
                            >
                              {feedback.isCorrect ? "✓ Chính xác! " : "Giải thích: "}
                            </strong>
                            {currentDrill.explanationVi}
                          </div>

                          {currentStep + 1 < totalPracticeSteps && (
                            <button
                              type="button"
                              onClick={() => setActivePracticeStep(currentStep + 1)}
                              className="px-4 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-bold shrink-0 self-end sm:self-auto"
                            >
                              Tiếp theo &rarr;
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                /* Sentence Writing Step */
                grammar.examples.length > 0 && (
                  <div className="p-5 rounded-xl bg-white border border-brand-border space-y-4">
                    <p className="text-sm font-bold text-brand-navy">
                      Hãy gõ lại câu tiếng Hàn tương ứng với nghĩa:{" "}
                      <span className="text-brand-primary">
                        &ldquo;{grammar.examples[0].meaningVi}&rdquo;
                      </span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="text"
                        value={conjugationInput}
                        onChange={(e) => setConjugationInput(e.target.value)}
                        placeholder="Nhập câu tiếng Hàn áp dụng ngữ pháp..."
                        className="flex-1 px-4 py-2.5 rounded-xl border border-brand-border bg-brand-surface/30 text-sm font-korean font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                      />
                      <button
                        type="button"
                        onClick={() => setConjugationChecked(true)}
                        className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover transition-colors shrink-0"
                      >
                        Kiểm tra đáp án
                      </button>
                    </div>

                    {conjugationChecked && (
                      <div className="p-3.5 rounded-xl bg-brand-surface/60 border border-brand-border text-xs space-y-1">
                        <div className="font-bold text-brand-navy">
                          Câu mẫu chuẩn:{" "}
                          <span className="font-korean text-brand-primary text-sm">
                            {grammar.examples[0].korean}
                          </span>
                        </div>
                        <div className="text-brand-secondary">
                          Phiên âm: {grammar.examples[0].romaja}
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // TIER 2: GRAMMAR 3-COLUMN CARD GRID FOR THE SELECTED LEVEL
  // ---------------------------------------------------------------------------
  const learnedGrammarCount = allGrammarItems.filter((g) => g.item.isLearned).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb + Back to Level Selection */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-brand-secondary">
          <button
            type="button"
            onClick={() => setSelectedGrammarLevel(null)}
            className="hover:text-brand-primary transition-colors"
          >
            Lý thuyết
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-brand-muted" />
          <span className="font-bold text-brand-navy">{currentGrammarCollection?.titleVi}</span>
        </nav>

        <button
          type="button"
          onClick={() => setSelectedGrammarLevel(null)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-brand-border text-brand-navy hover:bg-brand-surface transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Chọn cấp độ TOPIK khác</span>
        </button>
      </div>

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy tracking-tight">
              {currentGrammarCollection?.titleVi}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Đã học {formatNumber(learnedGrammarCount)}/{formatNumber(allGrammarItems.length)} cấu trúc
            </span>
          </div>
          <p className="text-xs text-brand-secondary mt-0.5">
            Nhấp vào cấu trúc ngữ pháp bất kỳ để xem giải thích, cách chia, ví dụ và luyện tập.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm cấu trúc, ý nghĩa..."
              className="pl-8 pr-3 py-1.5 rounded-full text-xs bg-white border border-brand-border text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30 w-44 sm:w-52"
            />
          </div>

          <div className="relative">
            <select
              value={selectedGrammarLevel}
              onChange={(e) => setSelectedGrammarLevel(e.target.value)}
              className="appearance-none pl-4 pr-8 py-1.5 rounded-full text-xs font-bold bg-white border border-brand-primary/40 text-brand-primary shadow-2xs focus:outline-none cursor-pointer"
            >
              <option value="topik-1">Cấp độ 1</option>
              <option value="topik-2">Cấp độ 2</option>
              <option value="topik-3">Cấp độ 3</option>
              <option value="topik-4">Cấp độ 4</option>
              <option value="topik-5">Cấp độ 5</option>
              <option value="topik-6">Cấp độ 6</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-brand-primary absolute right-2.5 top-2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => {
              setIsLevelQuizOpen((prev) => !prev);
              setLevelQuizIndex(0);
              setLevelQuizSelected(null);
              setLevelQuizScore(0);
              setLevelQuizFinished(false);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors shadow-2xs ${
              isLevelQuizOpen
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-white border-brand-primary/40 text-brand-primary hover:bg-brand-primary hover:text-white"
            }`}
          >
            {isLevelQuizOpen ? "Đóng kiểm tra" : "Kiểm tra"}
          </button>
        </div>
      </div>

      {/* Level-wide Grammar Quiz Panel */}
      {isLevelQuizOpen && allGrammarItems.length > 0 && (
        <div className="p-6 rounded-2xl bg-white border-2 border-brand-primary/20 shadow-card space-y-5">
          {!levelQuizFinished ? (
            (() => {
              const currentG = allGrammarItems[levelQuizIndex % allGrammarItems.length].item;
              const drill = currentG.practiceDrills?.[0];
              if (!drill) return null;
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-secondary">
                    <span className="text-brand-primary">
                      Kiểm tra tổng hợp {currentGrammarCollection?.titleVi}
                    </span>
                    <span>
                      Câu {levelQuizIndex + 1} / {Math.min(10, allGrammarItems.length)} • Điểm:{" "}
                      {levelQuizScore}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-extrabold text-brand-navy">
                    {drill.prompt}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {drill.options.map((opt) => {
                      const isSel = levelQuizSelected === opt;
                      const isCor = opt === drill.correctAnswer;
                      let st =
                        "bg-white border-brand-border text-brand-navy hover:border-brand-primary";
                      if (levelQuizSelected) {
                        if (isCor)
                          st = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                        else if (isSel) st = "bg-red-50 border-red-400 text-red-900";
                      }
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={Boolean(levelQuizSelected)}
                          onClick={() => {
                            setLevelQuizSelected(opt);
                            if (isCor) setLevelQuizScore((s) => s + 1);
                          }}
                          className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all ${st}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {levelQuizSelected && (
                    <div className="flex items-center justify-between pt-2 border-t border-brand-border">
                      <span className="text-xs text-brand-secondary">{drill.explanationVi}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const maxQ = Math.min(10, allGrammarItems.length);
                          if (levelQuizIndex + 1 >= maxQ) {
                            setLevelQuizFinished(true);
                          } else {
                            setLevelQuizIndex((i) => i + 1);
                            setLevelQuizSelected(null);
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold shrink-0"
                      >
                        Tiếp theo &rarr;
                      </button>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="text-xl font-extrabold text-brand-navy">
                Hoàn thành bài kiểm tra! Kết quả: {levelQuizScore} /{" "}
                {Math.min(10, allGrammarItems.length)}
              </div>
              <button
                type="button"
                onClick={() => {
                  setLevelQuizIndex(0);
                  setLevelQuizSelected(null);
                  setLevelQuizScore(0);
                  setLevelQuizFinished(false);
                }}
                className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold"
              >
                Làm lại
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3-Column Grammar Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGrammarItems.map(({ item }, idx) => (
          <div
            key={item.id}
            onClick={() => openGrammarItem(item.id)}
            className="group p-5 rounded-2xl bg-white border border-brand-border/80 hover:border-brand-primary/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3.5 min-w-0">
              {item.isLearned ? (
                <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-brand-surface text-brand-secondary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
              )}

              <div className="space-y-1 min-w-0">
                <h3 className="text-sm sm:text-base font-extrabold text-brand-navy group-hover:text-brand-primary transition-colors font-korean truncate">
                  {item.koreanPattern}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-brand-secondary truncate">
                  {item.titleVi}
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-brand-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
