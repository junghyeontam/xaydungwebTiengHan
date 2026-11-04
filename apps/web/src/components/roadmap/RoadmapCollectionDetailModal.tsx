"use client";

import React, { useState, useEffect } from "react";
import {
  TheoryCollectionCard,
  TheoryVocabWord,
  TheoryGrammarItem,
  TheoryChapter,
  GrammarPracticeDrill,
} from "@/lib/data/theory-collections-data";
import {
  toggleTheoryItemLearned,
  loadTheoryCollections,
} from "@/lib/services/theory-storage-service";
import {
  X,
  Volume2,
  CheckCircle2,
  Circle,
  Search,
  BookOpen,
  Filter,
  Sparkles,
  Play,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Layers,
  Award,
  ArrowLeft,
  ArrowRight,
  PenTool,
  HelpCircle,
  Check,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";

interface Props {
  collection: TheoryCollectionCard;
  onClose: () => void;
  onCollectionUpdated?: (updated: TheoryCollectionCard) => void;
}

export function RoadmapCollectionDetailModal({
  collection,
  onClose,
  onCollectionUpdated,
}: Props) {
  const [currentCol, setCurrentCol] = useState<TheoryCollectionCard>(collection);
  const [activeTab, setActiveTab] = useState<"all" | "unlearned" | "learned">("all");
  const [search, setSearch] = useState("");
  const [expandedChapterIds, setExpandedChapterIds] = useState<string[]>([]);
  const [isPlayingAudioId, setIsPlayingAudioId] = useState<string | null>(null);

  // Detail View State for Grammar Drill-down
  const [selectedGrammarItem, setSelectedGrammarItem] = useState<TheoryGrammarItem | null>(null);
  const [grammarSubTab, setGrammarSubTab] = useState<"theory" | "practice">("theory");

  // Practice state
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [practiceFeedback, setPracticeFeedback] = useState<
    Record<string, { isCorrect: boolean; show: boolean }>
  >({});
  const [isDrillCompleted, setIsDrillCompleted] = useState(false);

  // Sync when prop changes or on mount
  useEffect(() => {
    setCurrentCol(collection);
    setSelectedGrammarItem(null);
    setGrammarSubTab("theory");
    if (collection.chapters && collection.chapters.length > 0) {
      setExpandedChapterIds(collection.chapters.map((c) => c.id));
    }
  }, [collection]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapterIds((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  // Pronunciation with browser Web Speech API (ko-KR)
  const playKoreanSpeech = (text: string, id: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 0.85; // Slightly slower for clear pronunciation
      setIsPlayingAudioId(id);
      utterance.onend = () => setIsPlayingAudioId(null);
      utterance.onerror = () => setIsPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlayingAudioId(null);
    }
  };

  const handleToggleLearned = (chapterId: string, itemId: string) => {
    const updatedCollections = toggleTheoryItemLearned(currentCol.id, chapterId, itemId);
    const refreshed = updatedCollections.find((c) => c.id === currentCol.id);
    if (refreshed) {
      setCurrentCol(refreshed);
      // Update selected item if currently viewing it
      if (selectedGrammarItem && selectedGrammarItem.id === itemId) {
        setSelectedGrammarItem((prev) => (prev ? { ...prev, isLearned: !prev.isLearned } : null));
      }
      if (onCollectionUpdated) {
        onCollectionUpdated(refreshed);
      }
    }
  };

  // Practice answer handling
  const handleSelectPracticeOption = (
    drill: GrammarPracticeDrill,
    selectedOption: string,
    chapterId: string
  ) => {
    const isCorrect = selectedOption === drill.correctAnswer;
    setPracticeAnswers((prev) => ({ ...prev, [drill.id]: selectedOption }));
    setPracticeFeedback((prev) => ({
      ...prev,
      [drill.id]: { isCorrect, show: true },
    }));

    // If all drills for this grammar item are answered correctly, auto mark as mastered!
    if (selectedGrammarItem && selectedGrammarItem.practiceDrills) {
      const allDrills = selectedGrammarItem.practiceDrills;
      const willBeAllCorrect = allDrills.every((d) => {
        if (d.id === drill.id) return isCorrect;
        return practiceAnswers[d.id] === d.correctAnswer;
      });

      if (willBeAllCorrect && !isDrillCompleted) {
        setIsDrillCompleted(true);
        if (!selectedGrammarItem.isLearned) {
          handleToggleLearned(chapterId, selectedGrammarItem.id);
        }
      }
    }
  };

  // Find next and previous grammar items in the current collection
  const allGrammarItems: { item: TheoryGrammarItem; chapterId: string }[] = [];
  if (currentCol.type === "grammar") {
    currentCol.chapters.forEach((ch) => {
      ch.items.forEach((it) => {
        allGrammarItems.push({ item: it as TheoryGrammarItem, chapterId: ch.id });
      });
    });
  }

  const currentGrammarIndex = selectedGrammarItem
    ? allGrammarItems.findIndex((x) => x.item.id === selectedGrammarItem.id)
    : -1;

  const goToNextGrammar = () => {
    if (currentGrammarIndex >= 0 && currentGrammarIndex < allGrammarItems.length - 1) {
      const next = allGrammarItems[currentGrammarIndex + 1];
      setSelectedGrammarItem(next.item);
      setGrammarSubTab("theory");
      setIsDrillCompleted(false);
      setPracticeAnswers({});
      setPracticeFeedback({});
    }
  };

  const goToPrevGrammar = () => {
    if (currentGrammarIndex > 0) {
      const prev = allGrammarItems[currentGrammarIndex - 1];
      setSelectedGrammarItem(prev.item);
      setGrammarSubTab("theory");
      setIsDrillCompleted(false);
      setPracticeAnswers({});
      setPracticeFeedback({});
    }
  };

  const isVocab = currentCol.type === "vocab" || currentCol.type === "topic";
  const isGrammar = currentCol.type === "grammar";
  const progressPercent =
    currentCol.totalCount > 0
      ? Math.round((currentCol.completedCount / currentCol.totalCount) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-brand-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================================================================
            MODAL TOP HEADER
            ========================================================================= */}
        <div className="px-6 py-4 border-b border-brand-border flex items-start justify-between bg-brand-surface/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
                {currentCol.levelBadge}
              </span>
              <span className="text-xs text-brand-secondary font-medium font-korean">
                {currentCol.koreanTitle}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy tracking-tight">
              {currentCol.titleVi}
            </h2>

            <div className="flex items-center gap-3 pt-1 text-xs text-brand-secondary">
              <span className="font-semibold text-brand-navy">
                Tiến độ:{" "}
                <span className="text-brand-primary font-bold">
                  {currentCol.completedCount}/{currentCol.totalCount}
                </span>{" "}
                ({progressPercent}%)
              </span>
              <div className="w-28 h-2 bg-brand-border/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-primary rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-brand-secondary hover:text-brand-navy hover:bg-brand-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =========================================================================
            CASE A: GRAMMAR DETAIL & PRACTICE VIEW (KHI ĐÃ BẤM VÀO 1 NGỮ PHÁP CỤ THỂ)
            ========================================================================= */}
        {isGrammar && selectedGrammarItem ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-brand-surface/20">
            {/* Top Navigation Bar: Back to list + Prev/Next buttons */}
            <div className="px-6 py-3 border-b border-brand-border bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedGrammarItem(null);
                  setIsDrillCompleted(false);
                }}
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-primary hover:text-brand-navy transition-colors self-start"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại danh sách ngữ pháp ({currentCol.levelBadge})</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentGrammarIndex <= 0}
                  onClick={goToPrevGrammar}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-brand-border bg-white text-brand-navy hover:bg-brand-surface disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  &larr; Mục trước
                </button>
                <span className="text-xs text-brand-secondary font-medium">
                  {currentGrammarIndex + 1} / {allGrammarItems.length}
                </span>
                <button
                  type="button"
                  disabled={currentGrammarIndex >= allGrammarItems.length - 1}
                  onClick={goToNextGrammar}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-brand-border bg-white text-brand-navy hover:bg-brand-surface disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Mục sau &rarr;
                </button>
              </div>
            </div>

            {/* Grammar Title & Tabs Bar */}
            <div className="px-6 py-3 bg-white border-b border-brand-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg text-sm font-extrabold font-korean bg-brand-primary/10 text-brand-primary">
                  {selectedGrammarItem.koreanPattern}
                </span>
                <h3 className="font-extrabold text-base sm:text-lg text-brand-navy">
                  {selectedGrammarItem.titleVi}
                </h3>
              </div>

              {/* Tabs Switcher: Lý thuyết vs Luyện tập */}
              <div className="flex items-center gap-1.5 bg-brand-surface p-1 rounded-xl border border-brand-border/80 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setGrammarSubTab("theory")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    grammarSubTab === "theory"
                      ? "bg-white text-brand-navy shadow-xs"
                      : "text-brand-secondary hover:text-brand-navy"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>1. Lý thuyết & Ví dụ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGrammarSubTab("practice")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    grammarSubTab === "practice"
                      ? "bg-brand-primary text-white shadow-xs"
                      : "text-brand-secondary hover:text-brand-navy"
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>2. Luyện tập tương tác</span>
                  {selectedGrammarItem.practiceDrills && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-bold">
                      {selectedGrammarItem.practiceDrills.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Grammar Detail Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {grammarSubTab === "theory" ? (
                /* TAB 1: LÝ THUYẾT, CÔNG THỨC & VÍ DỤ */
                <div className="space-y-5 animate-fade-in">
                  {/* 1. Formula Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100 space-y-2">
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                      Công thức ngữ pháp (Formula)
                    </span>
                    <div className="text-base sm:text-lg font-extrabold text-blue-950 font-korean tracking-wide">
                      {selectedGrammarItem.formula}
                    </div>
                  </div>

                  {/* 2. Usage & Explanation */}
                  <div className="p-5 rounded-2xl bg-white border border-brand-border space-y-2 shadow-xs">
                    <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-brand-primary" />
                      <span>Ý nghĩa & Cách dùng</span>
                    </h4>
                    <p className="text-sm text-brand-navy leading-relaxed">
                      {selectedGrammarItem.explanationVi}
                    </p>
                  </div>

                  {/* 3. Attachment Rules Table */}
                  {selectedGrammarItem.attachmentRules &&
                    selectedGrammarItem.attachmentRules.length > 0 && (
                      <div className="p-5 rounded-2xl bg-white border border-brand-border space-y-3 shadow-xs">
                        <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                          Quy tắc kết hợp 받침 (Conjugation Rules)
                        </h4>
                        <div className="rounded-xl border border-brand-border overflow-hidden">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-brand-surface text-brand-secondary font-semibold">
                              <tr>
                                <th className="py-2.5 px-4">Điều kiện ghép</th>
                                <th className="py-2.5 px-4">Ví dụ minh hoạ</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-border">
                              {selectedGrammarItem.attachmentRules.map((rule, idx) => (
                                <tr key={idx} className="hover:bg-brand-surface/40">
                                  <td className="py-2.5 px-4 text-brand-secondary font-medium">
                                    {rule.condition}
                                  </td>
                                  <td className="py-2.5 px-4 font-korean font-bold text-brand-navy text-sm">
                                    {rule.example}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                  {/* 4. Real-life Conversational Examples with Seoul Audio */}
                  {selectedGrammarItem.examples && selectedGrammarItem.examples.length > 0 && (
                    <div className="p-5 rounded-2xl bg-white border border-brand-border space-y-3 shadow-xs">
                      <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center justify-between">
                        <span>Ví dụ thực tế & Nghe phát âm</span>
                        <span className="text-[11px] text-brand-secondary font-normal">
                          Bấm loa để nghe giọng chuẩn Seoul
                        </span>
                      </h4>

                      <div className="space-y-2.5">
                        {selectedGrammarItem.examples.map((ex, exIdx) => {
                          const isPlaying = isPlayingAudioId === `${selectedGrammarItem.id}-${exIdx}`;
                          return (
                            <div
                              key={exIdx}
                              className="p-3.5 rounded-xl bg-brand-surface/50 border border-brand-border flex items-center justify-between gap-3 hover:bg-brand-surface/80 transition-colors"
                            >
                              <div className="space-y-0.5">
                                <p className="font-korean font-extrabold text-base text-brand-navy">
                                  {ex.korean}
                                </p>
                                <p className="text-xs text-brand-secondary">
                                  {ex.meaningVi}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  playKoreanSpeech(ex.korean, `${selectedGrammarItem.id}-${exIdx}`)
                                }
                                className={`p-2.5 rounded-full transition-all ${
                                  isPlaying
                                    ? "bg-brand-primary text-white scale-110 shadow-xs"
                                    : "bg-white border border-brand-border text-brand-navy hover:bg-brand-primary/10 hover:text-brand-primary"
                                }`}
                                title="Phát âm tiếng Hàn"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* CTA button to jump directly to practice */}
                  <div className="p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-brand-navy">
                      Đã nắm vững lý thuyết? Hãy làm bài tập luyện tập chia cấu trúc và điền từ ngay!
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<PenTool className="w-3.5 h-3.5" />}
                      onClick={() => setGrammarSubTab("practice")}
                    >
                      Bắt đầu phần luyện tập &rarr;
                    </Button>
                  </div>
                </div>
              ) : (
                /* TAB 2: PHẦN LUYỆN TẬP TƯƠNG TÁC (CHIA CẤU TRÚC & ĐIỀN TỪ) */
                <div className="space-y-6 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/20 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-brand-navy">
                        Bài tập vận dụng: {selectedGrammarItem.koreanPattern}
                      </h4>
                      <p className="text-xs text-brand-secondary">
                        Luyện chia cấu trúc và điền từ chính xác vào câu
                      </p>
                    </div>

                    <div className="text-xs font-bold text-brand-primary bg-white px-3 py-1 rounded-full border border-brand-primary/30">
                      {selectedGrammarItem.practiceDrills?.length || 0} câu hỏi
                    </div>
                  </div>

                  {/* Interactive Drills */}
                  {(!selectedGrammarItem.practiceDrills ||
                    selectedGrammarItem.practiceDrills.length === 0) ? (
                    <div className="text-center py-10 bg-white rounded-2xl border border-brand-border p-6 space-y-2">
                      <Layers className="w-10 h-10 text-brand-muted mx-auto" />
                      <p className="text-sm font-bold text-brand-navy">
                        Đang cập nhật bài tập cho mục này
                      </p>
                      <p className="text-xs text-brand-secondary">
                        Giáo viên sẽ sớm bổ sung thêm các câu hỏi chia cấu trúc cho ngữ pháp này.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {selectedGrammarItem.practiceDrills.map((drill, drillIdx) => {
                        const currentAnswer = practiceAnswers[drill.id];
                        const feedback = practiceFeedback[drill.id];

                        return (
                          <div
                            key={drill.id}
                            className={`p-5 rounded-2xl bg-white border transition-all ${
                              feedback?.show
                                ? feedback.isCorrect
                                  ? "border-emerald-500 ring-2 ring-emerald-500/10"
                                  : "border-rose-400 ring-2 ring-rose-400/10"
                                : "border-brand-border shadow-xs"
                            } space-y-3.5`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-surface text-brand-secondary border border-brand-border">
                                {drill.type === "conjugation"
                                  ? "1. Luyện chia cấu trúc"
                                  : "2. Điền từ vào câu"}
                              </span>

                              <span className="text-xs font-bold text-brand-secondary">
                                Câu {drillIdx + 1}
                              </span>
                            </div>

                            {/* Prompt Question */}
                            <div className="p-3.5 rounded-xl bg-brand-surface/60 border border-brand-border/60">
                              <p className="text-sm sm:text-base font-extrabold text-brand-navy font-korean tracking-wide">
                                {drill.prompt}
                              </p>
                            </div>

                            {/* Options Buttons */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                              {drill.options.map((opt) => {
                                const isSelected = currentAnswer === opt;
                                const isThisCorrect = opt === drill.correctAnswer;
                                const showResult = feedback?.show;

                                let btnStyle =
                                  "bg-white border-brand-border text-brand-navy hover:bg-brand-surface";
                                if (showResult) {
                                  if (isThisCorrect) {
                                    btnStyle = "bg-emerald-600 text-white border-emerald-600 shadow-xs";
                                  } else if (isSelected && !isThisCorrect) {
                                    btnStyle = "bg-rose-600 text-white border-rose-600 shadow-xs";
                                  }
                                } else if (isSelected) {
                                  btnStyle = "bg-brand-primary text-white border-brand-primary";
                                }

                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() =>
                                      handleSelectPracticeOption(
                                        drill,
                                        opt,
                                        allGrammarItems[currentGrammarIndex]?.chapterId || ""
                                      )
                                    }
                                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold font-korean transition-all duration-150 flex items-center justify-center gap-1.5 ${btnStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {showResult && isThisCorrect && (
                                      <Check className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Feedback & Explanation Alert */}
                            {feedback?.show && (
                              <div
                                className={`p-3 rounded-xl text-xs flex items-start gap-2.5 animate-fade-in ${
                                  feedback.isCorrect
                                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                                    : "bg-rose-50 text-rose-900 border border-rose-200"
                                }`}
                              >
                                {feedback.isCorrect ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <p className="font-bold">
                                    {feedback.isCorrect ? "Chính xác!" : "Chưa chính xác"}
                                  </p>
                                  <p className="text-[11px] leading-relaxed mt-0.5">
                                    {drill.explanationVi}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Completion Celebration Card */}
                  {isDrillCompleted && (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md space-y-3 animate-fade-in">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-300" />
                        <h4 className="font-extrabold text-base">
                          Chúc mừng! Bạn đã hoàn thành toàn bộ bài tập mục này!
                        </h4>
                      </div>
                      <p className="text-xs text-white/90">
                        Ngữ pháp <strong>{selectedGrammarItem.koreanPattern}</strong> đã được đánh dấu là <strong>Đã nắm vững</strong> và tự động cập nhật vào tiến độ học tập của bạn (+15 XP).
                      </p>

                      <div className="flex items-center gap-2 pt-2">
                        {currentGrammarIndex < allGrammarItems.length - 1 ? (
                          <button
                            type="button"
                            onClick={goToNextGrammar}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-emerald-800 shadow-xs hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
                          >
                            <span>Sang ngữ pháp tiếp theo</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedGrammarItem(null)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-emerald-800 shadow-xs hover:bg-emerald-50 transition-colors"
                          >
                            Quay lại danh sách
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* =========================================================================
              CASE B: MASTER LIST VIEW (DANH SÁCH TOÀN BỘ NGỮ PHÁP / TỪ VỰNG CỦA CẤP ĐỘ)
              ========================================================================= */
          <>
            {/* Filter and Search Bar */}
            <div className="px-6 py-3.5 border-b border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "all"
                      ? "bg-brand-navy text-white shadow-xs"
                      : "bg-brand-surface text-brand-secondary hover:text-brand-navy"
                  }`}
                >
                  Tất cả ({currentCol.totalCount})
                </button>
                <button
                  onClick={() => setActiveTab("unlearned")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "unlearned"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-brand-surface text-brand-secondary hover:text-brand-navy"
                  }`}
                >
                  Chưa thuộc ({Math.max(0, currentCol.totalCount - currentCol.completedCount)})
                </button>
                <button
                  onClick={() => setActiveTab("learned")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "learned"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-brand-surface text-brand-secondary hover:text-brand-navy"
                  }`}
                >
                  Đã thuộc ({currentCol.completedCount})
                </button>
              </div>

              {/* Search Input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-brand-muted absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    isVocab
                      ? "Tìm theo từ tiếng Hàn, nghĩa..."
                      : "Tìm kiếm mẫu ngữ pháp, ý nghĩa..."
                  }
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-brand-border bg-white text-brand-navy placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-brand-surface/20">
              {currentCol.chapters.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Layers className="w-12 h-12 text-brand-muted mx-auto" />
                  <h3 className="text-sm font-bold text-brand-navy">
                    Chưa có nội dung cho cấp độ này
                  </h3>
                  <p className="text-xs text-brand-secondary max-w-sm mx-auto">
                    Giáo viên và Admin đang hoàn thiện các chương và mục cho phần này. Vui lòng quay lại sau!
                  </p>
                </div>
              ) : (
                currentCol.chapters.map((chapter) => {
                  const isExpanded = expandedChapterIds.includes(chapter.id);

                  // Filter items
                  const filteredItems = chapter.items.filter((item: any) => {
                    // Tab filter
                    if (activeTab === "unlearned" && item.isLearned) return false;
                    if (activeTab === "learned" && !item.isLearned) return false;

                    // Search query
                    if (!search) return true;
                    const query = search.toLowerCase();
                    if (isVocab) {
                      const v = item as TheoryVocabWord;
                      return (
                        v.korean.toLowerCase().includes(query) ||
                        v.romaja.toLowerCase().includes(query) ||
                        v.meaningVi.toLowerCase().includes(query)
                      );
                    } else {
                      const g = item as TheoryGrammarItem;
                      return (
                        g.titleVi.toLowerCase().includes(query) ||
                        g.koreanPattern.toLowerCase().includes(query) ||
                        g.explanationVi.toLowerCase().includes(query)
                      );
                    }
                  });

                  return (
                    <div
                      key={chapter.id}
                      className="bg-white rounded-xl border border-brand-border shadow-xs overflow-hidden transition-all"
                    >
                      {/* Chapter Header */}
                      <div
                        onClick={() => toggleChapter(chapter.id)}
                        className="p-4 bg-brand-surface/50 border-b border-brand-border/60 flex items-center justify-between cursor-pointer hover:bg-brand-surface/80 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-brand-navy">
                              {chapter.titleVi}
                            </span>
                            <span className="text-xs text-brand-secondary font-korean font-medium">
                              {chapter.koreanSubtitle}
                            </span>
                          </div>
                          <p className="text-xs text-brand-secondary line-clamp-1">
                            {chapter.descriptionVi}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-brand-secondary bg-white px-2.5 py-1 rounded-full border border-brand-border font-medium">
                            {filteredItems.length} mục
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-brand-secondary" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-brand-secondary" />
                          )}
                        </div>
                      </div>

                      {/* Chapter Content: Either Grammar List or Vocabulary Grid */}
                      {isExpanded && (
                        <div className="p-4">
                          {filteredItems.length === 0 ? (
                            <div className="text-center py-6 text-xs text-brand-secondary">
                              Không tìm thấy mục nào phù hợp với bộ lọc hiện tại.
                            </div>
                          ) : isGrammar ? (
                            /* =======================================================
                               LIST OF GRAMMAR POINTS (THEO YÊU CẦU NGƯỜI DÙNG)
                               Bấm vào bất kỳ mục nào để mở Công thức, Cách dùng & Luyện tập
                               ======================================================= */
                            <div className="divide-y divide-brand-border/60">
                              {filteredItems.map((item: any, idx: number) => {
                                const grammar = item as TheoryGrammarItem;

                                return (
                                  <div
                                    key={grammar.id}
                                    onClick={() => {
                                      setSelectedGrammarItem(grammar);
                                      setGrammarSubTab("theory");
                                      setIsDrillCompleted(false);
                                      setPracticeAnswers({});
                                      setPracticeFeedback({});
                                    }}
                                    className="py-3.5 px-3 rounded-xl hover:bg-brand-surface/60 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                                  >
                                    <div className="flex items-center gap-3">
                                      {/* Index Badge */}
                                      <span className="w-7 h-7 rounded-lg bg-brand-surface text-brand-secondary text-xs font-bold flex items-center justify-center border border-brand-border/60 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                        #{idx + 1}
                                      </span>

                                      {/* Korean Pattern pill */}
                                      <span className="px-2.5 py-1 rounded-md text-xs font-bold font-korean bg-brand-primary/10 text-brand-primary">
                                        {grammar.koreanPattern}
                                      </span>

                                      {/* Title & Formula preview */}
                                      <div>
                                        <h4 className="font-bold text-sm text-brand-navy group-hover:text-brand-primary transition-colors">
                                          {grammar.titleVi}
                                        </h4>
                                        <p className="text-xs text-brand-secondary line-clamp-1">
                                          Công thức: {grammar.formula}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Right Side: Status Badge & Action Button */}
                                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                                      {grammar.isLearned ? (
                                        <span className="text-xs font-semibold flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                          <span>Đã nắm vững</span>
                                        </span>
                                      ) : (
                                        <span className="text-xs font-semibold flex items-center gap-1 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                          <Circle className="w-3.5 h-3.5 text-amber-600" />
                                          <span>Cần luyện tập</span>
                                        </span>
                                      )}

                                      <button
                                        type="button"
                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-primary text-white shadow-xs group-hover:scale-105 transition-all flex items-center gap-1"
                                      >
                                        <span>Học & Luyện tập</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            /* VOCABULARY TILES GRID */
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                              {filteredItems.map((item: any) => {
                                const word = item as TheoryVocabWord;
                                const isPlaying = isPlayingAudioId === word.id;

                                return (
                                  <div
                                    key={word.id}
                                    className={`p-4 rounded-xl border transition-all ${
                                      word.isLearned
                                        ? "bg-white border-brand-border hover:border-brand-primary/40"
                                        : "bg-amber-50/20 border-amber-200/60 hover:border-amber-400"
                                    } shadow-xs flex flex-col justify-between gap-3`}
                                  >
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-surface text-brand-secondary border border-brand-border/60">
                                          {word.partOfSpeech}
                                        </span>

                                        <button
                                          type="button"
                                          onClick={() => handleToggleLearned(chapter.id, word.id)}
                                          className={`text-xs font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                                            word.isLearned
                                              ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                                              : "text-amber-800 bg-amber-100 hover:bg-amber-200"
                                          }`}
                                        >
                                          {word.isLearned ? (
                                            <>
                                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                              <span>Đã thuộc</span>
                                            </>
                                          ) : (
                                            <>
                                              <Circle className="w-3.5 h-3.5 text-amber-600" />
                                              <span>Chưa thuộc</span>
                                            </>
                                          )}
                                        </button>
                                      </div>

                                      <div className="flex items-center justify-between gap-2">
                                        <div>
                                          <h4 className="text-xl font-extrabold text-brand-navy font-korean tracking-wide">
                                            {word.korean}
                                          </h4>
                                          <span className="text-xs text-brand-secondary font-medium">
                                            /{word.romaja}/
                                          </span>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => playKoreanSpeech(word.korean, word.id)}
                                          className={`p-2.5 rounded-full transition-all ${
                                            isPlaying
                                              ? "bg-brand-primary text-white scale-110 shadow-xs"
                                              : "bg-brand-surface text-brand-navy hover:bg-brand-primary/10 hover:text-brand-primary"
                                          }`}
                                          title="Phát âm tiếng Hàn chuẩn Seoul"
                                        >
                                          <Volume2 className="w-4 h-4" />
                                        </button>
                                      </div>

                                      <p className="text-sm font-semibold text-brand-navy">
                                        {word.meaningVi}
                                      </p>

                                      {word.exampleKo && (
                                        <div className="pt-2 border-t border-brand-border/60 space-y-1 bg-brand-surface/30 p-2.5 rounded-lg">
                                          <div className="flex items-center justify-between">
                                            <p className="text-xs font-korean font-semibold text-brand-navy">
                                              {word.exampleKo}
                                            </p>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                playKoreanSpeech(word.exampleKo, `${word.id}-ex`)
                                              }
                                              className="p-1 rounded text-brand-secondary hover:text-brand-primary"
                                              title="Nghe câu ví dụ"
                                            >
                                              <Volume2 className="w-3 h-3" />
                                            </button>
                                          </div>
                                          <p className="text-[11px] text-brand-secondary">
                                            {word.exampleVi}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Bottom Footer */}
            <div className="px-6 py-4 border-t border-brand-border bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-brand-secondary">
                Nội dung được thẩm định và biên soạn chuẩn khung TOPIK Viện Ngôn ngữ Seoul.
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button variant="secondary" size="sm" onClick={onClose}>
                  Đóng
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                  onClick={() => {
                    alert(
                      `Bắt đầu bài kiểm tra luyện tập cho "${currentCol.titleVi}". Toàn bộ từ vựng và ngữ pháp sẽ được kiểm tra!`
                    );
                  }}
                >
                  Luyện tập bộ này
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
