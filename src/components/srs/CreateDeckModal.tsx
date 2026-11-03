"use client";

import React, { useState } from "react";
import { useSrs, SrsDeck } from "@/lib/context/SrsContext";
import {
  X,
  Plus,
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDeck?: SrsDeck | null;
}

export function CreateDeckModal({ isOpen, onClose, targetDeck }: CreateDeckModalProps) {
  const { decks, createDeck, addCard, importCardsFromText } = useSrs();

  const [activeTab, setActiveTab] = useState<"create-deck" | "excel-import" | "manual">(
    targetDeck ? "excel-import" : "create-deck"
  );

  // Form tạo bộ thẻ
  const [deckTitle, setDeckTitle] = useState("");
  const [deckDesc, setDeckDesc] = useState("");
  const [deckCategory, setDeckCategory] = useState("Từ vựng");

  // Form dán từ Excel/Sheets
  const [selectedDeckId, setSelectedDeckId] = useState<string>(
    targetDeck?.id || decks[0]?.id || ""
  );
  const [excelPasteText, setExcelPasteText] = useState("");

  // Form nhập tay 1 thẻ
  const [korean, setKorean] = useState("");
  const [vietnamese, setVietnamese] = useState("");
  const [romaja, setRomaja] = useState("");

  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deckTitle.trim()) return;

    const newDeck = createDeck(deckTitle, deckDesc, deckCategory);
    setSelectedDeckId(newDeck.id);
    setFeedback(`Đã tạo thành công bộ thẻ "${newDeck.title}"!`);
    setTimeout(() => {
      setActiveTab("excel-import");
      setFeedback(null);
    }, 1200);
  };

  const handleImportExcel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!excelPasteText.trim() || !selectedDeckId) return;

    const res = importCardsFromText(selectedDeckId, excelPasteText);
    setFeedback(`Đã nhập thành công ${res.count} thẻ mới vào bộ thẻ!`);
    setExcelPasteText("");
    setTimeout(() => {
      onClose();
      setFeedback(null);
    }, 1500);
  };

  const handleAddManualCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!korean.trim() || !vietnamese.trim() || !selectedDeckId) return;

    addCard(selectedDeckId, korean, vietnamese, romaja);
    setFeedback(`Đã thêm thẻ "${korean}" thành công!`);
    setKorean("");
    setVietnamese("");
    setRomaja("");
    setTimeout(() => setFeedback(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-card rounded-3xl border border-border shadow-2xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tiêu đề modal */}
        <div>
          <h3 className="text-xl font-extrabold text-foreground">
            Quản lý Bộ thẻ Flashcard SRS
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tạo bộ thẻ mới hoặc dán nhanh danh sách từ vựng từ Excel / Google Sheets.
          </p>
        </div>

        {/* Tabs chuyển đổi */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-secondary text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("create-deck")}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === "create-deck"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground"
            }`}
          >
            Tạo bộ thẻ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("excel-import")}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === "excel-import"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Dán từ Excel</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === "manual"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground"
            }`}
          >
            Nhập tay
          </button>
        </div>

        {/* Thông báo phản hồi */}
        {feedback && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* TAB 1: TẠO BỘ THẺ */}
        {activeTab === "create-deck" && (
          <form onSubmit={handleCreateDeck} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Tên bộ thẻ *</label>
              <input
                type="text"
                required
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                placeholder="Ví dụ: Từ vựng Du học & Phỏng vấn Visa"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-junghyeon-teal outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Mô tả ngắn</label>
              <input
                type="text"
                value={deckDesc}
                onChange={(e) => setDeckDesc(e.target.value)}
                placeholder="Gồm các từ hay dùng trong kỳ thi phỏng vấn..."
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-junghyeon-teal outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Chủ đề phân loại</label>
              <select
                value={deckCategory}
                onChange={(e) => setDeckCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-junghyeon-teal outline-none"
              >
                <option value="TOPIK 1">TOPIK 1 (Sơ cấp)</option>
                <option value="TOPIK 2">TOPIK 2</option>
                <option value="Giao tiếp">Hội thoại đời sống</option>
                <option value="K-Pop & K-Drama">K-Pop & Idol</option>
                <option value="Công sở">Tiếng Hàn thương mại</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
            >
              Tạo bộ thẻ mới
            </button>
          </form>
        )}

        {/* TAB 2: DÁN TỪ EXCEL / GOOGLE SHEETS / WORD */}
        {activeTab === "excel-import" && (
          <form onSubmit={handleImportExcel} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Chọn bộ thẻ lưu vào:</label>
              <select
                value={selectedDeckId}
                onChange={(e) => setSelectedDeckId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-brand-primary outline-none"
              >
                {decks.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                Sao chép & dán dữ liệu 2 cột từ Excel / Sheets / Word:
              </label>
              <textarea
                rows={5}
                required
                value={excelPasteText}
                onChange={(e) => setExcelPasteText(e.target.value)}
                placeholder={`Mỗi dòng một từ, ngăn cách bằng phím Tab hoặc dấu gạch ngang:\n안녕하세요\tXin chào\n감사합니다\tCảm ơn\n사랑해요\tTôi yêu bạn`}
                className="w-full p-3 rounded-xl border border-border bg-background text-xs font-mono text-foreground focus:ring-2 focus:ring-brand-primary outline-none"
              />
              <p className="text-[11px] text-muted-foreground">
                ✨ Hệ thống tự động nhận diện phím Tab (\t), dấu gạch ngang (-) hoặc dấu phẩy (,) để tách từ.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
            >
              Nhập tự động vào bộ thẻ
            </button>
          </form>
        )}

        {/* TAB 3: NHẬP TAY TỪNG TỪ */}
        {activeTab === "manual" && (
          <form onSubmit={handleAddManualCard} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Chọn bộ thẻ:</label>
              <select
                value={selectedDeckId}
                onChange={(e) => setSelectedDeckId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-brand-primary outline-none"
              >
                {decks.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Tiếng Hàn *</label>
                <input
                  type="text"
                  required
                  value={korean}
                  onChange={(e) => setKorean(e.target.value)}
                  placeholder="Ví dụ: 사과"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm font-korean font-bold text-foreground focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Nghĩa tiếng Việt *</label>
                <input
                  type="text"
                  required
                  value={vietnamese}
                  onChange={(e) => setVietnamese(e.target.value)}
                  placeholder="Quả táo"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Phiên âm Romaja (tùy chọn)</label>
              <input
                type="text"
                value={romaja}
                onChange={(e) => setRomaja(e.target.value)}
                placeholder="sa-gwa"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
            >
              + Thêm thẻ này
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
