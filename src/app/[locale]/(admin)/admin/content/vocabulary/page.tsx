"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Languages, Plus, Search, Volume2, X, Check, BookOpen } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { playKoreanSpeech } from "@/lib/utils/speech";
import {
  loadTheoryCollections,
  addVocabToChapter,
} from "@/lib/services/theory-storage-service";
import { TheoryVocabWord } from "@/lib/data/theory-collections-data";

interface DisplayVocab {
  id: string;
  korean: string;
  romaja: string;
  meaning: string;
  topic: string;
  exampleKorean?: string;
  exampleVietnamese?: string;
}

const DEFAULT_VOCAB: DisplayVocab[] = [
  { id: "v1", korean: "선생님", romaja: "seonsaengnim", meaning: "Giáo viên / Thầy cô", topic: "Nghề nghiệp" },
  { id: "v2", korean: "학생", romaja: "haksaeng", meaning: "Học sinh / Sinh viên", topic: "Trường học" },
  { id: "v3", korean: "한국어", romaja: "hangugeo", meaning: "Tiếng Hàn Quốc", topic: "Ngôn ngữ" },
  { id: "v4", korean: "안녕하세요", romaja: "annyeonghaseyo", meaning: "Xin chào (trang trọng)", topic: "Giao tiếp" },
  { id: "v5", korean: "감사합니다", romaja: "gamsahamnida", meaning: "Xin cảm ơn", topic: "Giao tiếp" },
  { id: "v6", korean: "도서관", romaja: "doseogwan", meaning: "Thư viện", topic: "Địa điểm" },
  { id: "v7", korean: "식당", romaja: "sikdang", meaning: "Nhà hàng / Quán ăn", topic: "Địa điểm" },
  { id: "v8", korean: "친구", romaja: "chingu", meaning: "Bạn bè", topic: "Mối quan hệ" },
  { id: "v9", korean: "가족", romaja: "gajok", meaning: "Gia đình", topic: "Gia đình" },
  { id: "v10", korean: "회사", romaja: "hoesa", meaning: "Công ty", topic: "Công việc" },
];

export default function AdminVocabularyPage() {
  const [search, setSearch] = useState("");
  const [vocabList, setVocabList] = useState<DisplayVocab[]>(DEFAULT_VOCAB);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Form states
  const [newKorean, setNewKorean] = useState("");
  const [newRomaja, setNewRomaja] = useState("");
  const [newMeaning, setNewMeaning] = useState("");
  const [newTopic, setNewTopic] = useState("Từ vựng TOPIK 1");
  const [newExKo, setNewExKo] = useState("");
  const [newExVi, setNewExVi] = useState("");

  const refreshVocabList = useCallback(() => {
    try {
      const collections = loadTheoryCollections();
      const extracted: DisplayVocab[] = [];
      const seenIds = new Set<string>();

      collections.forEach((col) => {
        if (col.type === "vocab" || col.type === "topic") {
          col.chapters.forEach((ch) => {
            ch.items.forEach((item) => {
              if ("romaja" in item && !seenIds.has(item.id)) {
                seenIds.add(item.id);
                const vocab = item as TheoryVocabWord;
                extracted.push({
                  id: vocab.id,
                  korean: vocab.korean,
                  romaja: vocab.romaja,
                  meaning: vocab.meaningVi,
                  topic: ch.titleVi || col.titleVi,
                  exampleKorean: vocab.exampleKo,
                  exampleVietnamese: vocab.exampleVi,
                });
              }
            });
          });
        }
      });

      // Merge with default items if not present
      DEFAULT_VOCAB.forEach((dv) => {
        if (!seenIds.has(dv.id)) {
          extracted.push(dv);
        }
      });

      setVocabList(extracted);
    } catch {
      setVocabList(DEFAULT_VOCAB);
    }
  }, []);

  useEffect(() => {
    refreshVocabList();
    window.addEventListener("jh_theory_updated", refreshVocabList);
    return () => {
      window.removeEventListener("jh_theory_updated", refreshVocabList);
    };
  }, [refreshVocabList]);

  const handlePlayAudio = (korean: string, id: string) => {
    setPlayingId(id);
    playKoreanSpeech(korean);
    setTimeout(() => {
      setPlayingId(null);
    }, 1200);
  };

  const handleAddNewWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKorean.trim() || !newMeaning.trim()) return;

    try {
      const collections = loadTheoryCollections();
      const vocabCol = collections.find((c) => c.type === "vocab" || c.id === "vocab-topik-1");
      if (vocabCol && vocabCol.chapters.length > 0) {
        addVocabToChapter(vocabCol.id, vocabCol.chapters[0].id, {
          korean: newKorean.trim(),
          romaja: newRomaja.trim() || newKorean.trim(),
          meaningVi: newMeaning.trim(),
          exampleKo: newExKo.trim() || "",
          exampleVi: newExVi.trim() || "",
          partOfSpeech: "Danh từ",
          topikLevel: "topik-1",
          chapterId: vocabCol.chapters[0].id,
          chapterTitleVi: vocabCol.chapters[0].titleVi,
          isLearned: false,
        });
      } else {
        // Fallback local state
        const newItem: DisplayVocab = {
          id: `v-${Date.now()}`,
          korean: newKorean.trim(),
          romaja: newRomaja.trim(),
          meaning: newMeaning.trim(),
          topic: newTopic,
          exampleKorean: newExKo.trim(),
          exampleVietnamese: newExVi.trim(),
        };
        setVocabList((prev) => [newItem, ...prev]);
      }
    } catch (err) {
      console.warn("Could not save to theory storage, using local state:", err);
      const newItem: DisplayVocab = {
        id: `v-${Date.now()}`,
        korean: newKorean.trim(),
        romaja: newRomaja.trim(),
        meaning: newMeaning.trim(),
        topic: newTopic,
        exampleKorean: newExKo.trim(),
        exampleVietnamese: newExVi.trim(),
      };
      setVocabList((prev) => [newItem, ...prev]);
    }

    refreshVocabList();

    // Reset form & close
    setNewKorean("");
    setNewRomaja("");
    setNewMeaning("");
    setNewExKo("");
    setNewExVi("");
    setIsAddModalOpen(false);
  };

  const filtered = vocabList.filter(
    (v) =>
      v.korean.includes(search) ||
      v.meaning.toLowerCase().includes(search.toLowerCase()) ||
      v.romaja.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Content & Curriculum"
        title="Vocabulary Bank"
        titleMuted={`· ${vocabList.length} Words`}
        description="Quản lý kho từ vựng toàn hệ thống, phát âm chuẩn Seoul, nghĩa tiếng Việt và ví dụ ngữ cảnh cho thuật toán lặp lại ngắt quãng (SRS)."
        primaryAction={{
          label: "Add New Word",
          icon: Plus,
          onClick: () => setIsAddModalOpen(true),
        }}
      />

      <div className="p-4 rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-admin-text-placeholder absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tra cứu từ vựng tiếng Hàn, romaja hoặc nghĩa..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-admin-control border border-admin-border bg-admin-surface text-admin-text-primary placeholder:text-admin-text-placeholder focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/30 focus:border-admin-brand-teal"
          />
        </div>
        <div className="text-xs text-admin-text-muted">
          Hiển thị <strong>{filtered.length}</strong> / {vocabList.length} từ vựng
        </div>
      </div>

      <div className="rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-admin-border bg-admin-subtle/40 text-admin-text-muted">
                <th className="py-3 px-4 font-medium">Từ tiếng Hàn</th>
                <th className="py-3 px-4 font-medium">Romaja</th>
                <th className="py-3 px-4 font-medium">Ý nghĩa tiếng Việt</th>
                <th className="py-3 px-4 font-medium">Chủ đề</th>
                <th className="py-3 px-4 font-medium">Ví dụ minh họa</th>
                <th className="py-3 px-4 font-medium text-center">Phát âm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-admin-subtle/50 transition-colors">
                  <td className="py-3 px-4 font-korean font-semibold text-base text-admin-text-primary">
                    {item.korean}
                  </td>
                  <td className="py-3 px-4 text-admin-text-secondary">
                    {item.romaja}
                  </td>
                  <td className="py-3 px-4 font-medium text-admin-text-primary">
                    {item.meaning}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-admin-pill bg-admin-subtle border border-admin-border text-[10px] text-admin-text-secondary">
                      {item.topic}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-admin-text-muted max-w-xs truncate">
                    {item.exampleKorean ? (
                      <span>
                        <strong className="text-admin-text-primary">{item.exampleKorean}</strong>
                        {item.exampleVietnamese ? ` · ${item.exampleVietnamese}` : ""}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(item.korean, item.id)}
                      className={`p-1.5 rounded-full transition-colors ${
                        playingId === item.id
                          ? "bg-admin-brand-teal text-white animate-bounce"
                          : "text-admin-brand-teal hover:bg-admin-brand-teal/10"
                      }`}
                      title="Nghe audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Word Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-admin-surface rounded-admin-card border border-admin-border shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-admin-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-admin-brand-teal/10 text-admin-brand-teal flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-admin-text-primary">
                    Thêm từ vựng mới
                  </h3>
                  <p className="text-[11px] text-admin-text-muted">
                    Lưu vào kho từ vựng và tự động đồng bộ sang Lộ trình học viên
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-admin-text-placeholder hover:text-admin-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewWord} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-admin-text-secondary mb-1">
                  Từ tiếng Hàn (Hangul) *
                </label>
                <input
                  type="text"
                  required
                  value={newKorean}
                  onChange={(e) => setNewKorean(e.target.value)}
                  placeholder="Ví dụ: 사과, 친구, 가다..."
                  className="w-full px-3 py-2 rounded-admin-control border border-admin-border bg-admin-subtle/30 text-admin-text-primary focus:outline-none focus:border-admin-brand-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-admin-text-secondary mb-1">
                    Romaja phiên âm
                  </label>
                  <input
                    type="text"
                    value={newRomaja}
                    onChange={(e) => setNewRomaja(e.target.value)}
                    placeholder="sagwa, chingu..."
                    className="w-full px-3 py-2 rounded-admin-control border border-admin-border bg-admin-subtle/30 text-admin-text-primary focus:outline-none focus:border-admin-brand-teal"
                  />
                </div>
                <div>
                  <label className="block font-medium text-admin-text-secondary mb-1">
                    Chủ đề
                  </label>
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Chủ đề từ vựng..."
                    className="w-full px-3 py-2 rounded-admin-control border border-admin-border bg-admin-subtle/30 text-admin-text-primary focus:outline-none focus:border-admin-brand-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-admin-text-secondary mb-1">
                  Ý nghĩa tiếng Việt *
                </label>
                <input
                  type="text"
                  required
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="Quả táo, Bạn bè, Đi..."
                  className="w-full px-3 py-2 rounded-admin-control border border-admin-border bg-admin-subtle/30 text-admin-text-primary focus:outline-none focus:border-admin-brand-teal"
                />
              </div>

              <div className="space-y-1.5 pt-1 border-t border-admin-border/50">
                <label className="block font-medium text-admin-text-secondary">
                  Ví dụ minh họa (tùy chọn)
                </label>
                <input
                  type="text"
                  value={newExKo}
                  onChange={(e) => setNewExKo(e.target.value)}
                  placeholder="Câu tiếng Hàn ví dụ..."
                  className="w-full px-3 py-1.5 rounded-admin-control border border-admin-border bg-admin-subtle/30 text-admin-text-primary text-[11px] focus:outline-none focus:border-admin-brand-teal"
                />
                <input
                  type="text"
                  value={newExVi}
                  onChange={(e) => setNewExVi(e.target.value)}
                  placeholder="Dịch nghĩa tiếng Việt của ví dụ..."
                  className="w-full px-3 py-1.5 rounded-admin-control border border-admin-border bg-admin-subtle/30 text-admin-text-primary text-[11px] focus:outline-none focus:border-admin-brand-teal"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-admin-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 rounded-admin-control border border-admin-border text-admin-text-secondary hover:bg-admin-subtle"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-admin-control bg-admin-brand-teal hover:bg-admin-brand-teal/90 text-white font-bold"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Lưu từ vựng</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
