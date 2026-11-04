"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { calculateSM2, ReviewGrade, SM2Item } from "@/lib/srs/sm2";

export interface SrsCard extends SM2Item {
  id: string;
  deckId: string;
  korean: string;
  vietnamese: string;
  meaning?: string;
  romaja?: string;
  exampleKorean?: string;
  exampleVietnamese?: string;
  exampleMeaning?: string;
  createdAt: string;
}

export interface SrsDeck {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  isCurated?: boolean; // Bộ thẻ mẫu chuẩn bị sẵn
  createdAt: string;
}

interface SrsStats {
  total: number;
  newCards: number; // repetitions === 0
  learning: number; // repetitions between 1 and 2
  mastered: number; // repetitions >= 3
  dueToday: number;
}

interface SrsContextType {
  decks: SrsDeck[];
  cards: SrsCard[];
  stats: SrsStats;
  createDeck: (title: string, desc: string, category: string) => SrsDeck;
  addCard: (
    deckId: string,
    korean: string,
    vietnamese: string,
    romaja?: string,
    exampleKorean?: string,
    exampleVietnamese?: string
  ) => void;
  importCardsFromText: (
    deckId: string,
    rawText: string,
    delimiter?: string
  ) => { count: number };
  reviewCard: (cardId: string, grade: ReviewGrade) => void;
  getDeckStats: (deckId: string) => SrsStats;
  getDueCardsForDeck: (deckId: string) => SrsCard[];
}

const SrsContext = createContext<SrsContextType | undefined>(undefined);

// Dữ liệu mẫu ban đầu cho các bộ thẻ được tuyển chọn
const INITIAL_DECKS: SrsDeck[] = [
  {
    id: "deck-essential-30",
    title: "30 Từ vựng Sơ cấp 1 thiết yếu",
    description: "Bộ từ cơ bản nhất về chào hỏi, số đếm, gia đình và ẩm thực.",
    category: "TOPIK 1",
    color: "from-emerald-500 to-teal-600",
    isCurated: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "deck-verbs-daily",
    title: "Động từ giao tiếp thông dụng",
    description: "Học cách dùng 20 động từ xuất hiện nhiều nhất trong K-drama.",
    category: "Giao tiếp",
    color: "from-amber-500 to-orange-600",
    isCurated: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "deck-my-saved",
    title: "Thẻ của tôi (Lưu từ bài học)",
    description: "Các từ vựng bạn đã nhấn nút '+ Ôn tập' trong lúc học lý thuyết.",
    category: "Cá nhân",
    color: "from-junghyeon-coral to-rose-600",
    isCurated: false,
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_CARDS: SrsCard[] = [
  {
    id: "c1",
    deckId: "deck-essential-30",
    korean: "안녕하세요",
    romaja: "an-nyeong-ha-se-yo",
    vietnamese: "Xin chào",
    exampleKorean: "안녕하세요, 저는 민수예요.",
    exampleVietnamese: "Xin chào, tôi là Minsoo.",
    repetitions: 3,
    interval: 6,
    easinessFactor: 2.5,
    nextReviewDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "c2",
    deckId: "deck-essential-30",
    korean: "감사합니다",
    romaja: "gam-sa-ham-ni-da",
    vietnamese: "Cảm ơn",
    exampleKorean: "도와주셔서 감사합니다.",
    exampleVietnamese: "Cảm ơn bạn đã giúp đỡ.",
    repetitions: 2,
    interval: 3,
    easinessFactor: 2.4,
    nextReviewDate: new Date().toISOString(), // Đến hạn hôm nay
    createdAt: new Date().toISOString(),
  },
  {
    id: "c3",
    deckId: "deck-essential-30",
    korean: "사랑해요",
    romaja: "sa-rang-hae-yo",
    vietnamese: "Yêu / Tôi yêu bạn",
    exampleKorean: "엄마, 사랑해요.",
    exampleVietnamese: "Mẹ ơi, con yêu mẹ.",
    repetitions: 3,
    interval: 8,
    easinessFactor: 2.6,
    nextReviewDate: new Date(Date.now() + 86400000 * 6).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "c4",
    deckId: "deck-essential-30",
    korean: "물",
    romaja: "mul",
    vietnamese: "Nước uống",
    exampleKorean: "물 좀 주세요.",
    exampleVietnamese: "Làm ơn cho tôi xin một ít nước.",
    repetitions: 0,
    interval: 0,
    easinessFactor: 2.5,
    nextReviewDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "c5",
    deckId: "deck-essential-30",
    korean: "밥",
    romaja: "bap",
    vietnamese: "Cơm / Bữa ăn",
    exampleKorean: "밥 먹었어요?",
    exampleVietnamese: "Bạn ăn cơm chưa?",
    repetitions: 1,
    interval: 1,
    easinessFactor: 2.5,
    nextReviewDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "c6",
    deckId: "deck-verbs-daily",
    korean: "가다",
    romaja: "ga-da",
    vietnamese: "Đi",
    exampleKorean: "집에 가요.",
    exampleVietnamese: "Tôi đi về nhà.",
    repetitions: 2,
    interval: 3,
    easinessFactor: 2.5,
    nextReviewDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "c7",
    deckId: "deck-verbs-daily",
    korean: "오다",
    romaja: "o-da",
    vietnamese: "Đến, về",
    exampleKorean: "비가 와요.",
    exampleVietnamese: "Trời mưa rồi.",
    repetitions: 1,
    interval: 1,
    easinessFactor: 2.4,
    nextReviewDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export function SrsProvider({ children }: { children: React.ReactNode }) {
  const [decks, setDecks] = useState<SrsDeck[]>(INITIAL_DECKS);
  const [cards, setCards] = useState<SrsCard[]>(INITIAL_CARDS);

  // Khởi tạo từ LocalStorage nếu có
  useEffect(() => {
    try {
      const savedDecks = localStorage.getItem("junghyeon_srs_decks");
      if (savedDecks) {
        setDecks(JSON.parse(savedDecks));
      }
      const savedCards = localStorage.getItem("junghyeon_srs_cards");
      if (savedCards) {
        setCards(JSON.parse(savedCards));
      }

      // Kiểm tra hàng đợi từ vựng vừa thêm từ bài học
      const queueStr = localStorage.getItem("junghyeon_srs_queue");
      if (queueStr) {
        const queue = JSON.parse(queueStr);
        if (queue.length > 0) {
          const newAddedCards: SrsCard[] = queue.map((q: any) => ({
            id: q.id || `card-${Date.now()}-${Math.random()}`,
            deckId: "deck-my-saved",
            korean: q.korean,
            vietnamese: q.vietnamese,
            romaja: q.romaja || "",
            repetitions: 0,
            interval: 0,
            easinessFactor: 2.5,
            nextReviewDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          }));

          setCards((prev) => {
            const merged = [...prev, ...newAddedCards];
            localStorage.setItem("junghyeon_srs_cards", JSON.stringify(merged));
            return merged;
          });
          localStorage.removeItem("junghyeon_srs_queue");
        }
      }
    } catch (e) {
      console.error("Lỗi tải SRS Data:", e);
    }
  }, []);

  const saveDecks = (newDecks: SrsDeck[]) => {
    setDecks(newDecks);
    localStorage.setItem("junghyeon_srs_decks", JSON.stringify(newDecks));
  };

  const saveCards = (newCards: SrsCard[]) => {
    setCards(newCards);
    localStorage.setItem("junghyeon_srs_cards", JSON.stringify(newCards));
  };

  // Tính thống kê tổng quan
  const now = new Date().toISOString();
  const stats: SrsStats = {
    total: cards.length,
    newCards: cards.filter((c) => c.repetitions === 0).length,
    learning: cards.filter((c) => c.repetitions >= 1 && c.repetitions < 3).length,
    mastered: cards.filter((c) => c.repetitions >= 3).length,
    dueToday: cards.filter((c) => c.nextReviewDate <= now).length,
  };

  // Tạo bộ thẻ mới
  const createDeck = (title: string, desc: string, category: string): SrsDeck => {
    const newDeck: SrsDeck = {
      id: `deck-${Date.now()}`,
      title,
      description: desc,
      category,
      color: "from-junghyeon-teal to-emerald-600",
      createdAt: new Date().toISOString(),
    };
    saveDecks([...decks, newDeck]);
    return newDeck;
  };

  // Thêm 1 thẻ mới thủ công
  const addCard = (
    deckId: string,
    korean: string,
    vietnamese: string,
    romaja?: string,
    exampleKorean?: string,
    exampleVietnamese?: string
  ) => {
    const newCard: SrsCard = {
      id: `card-${Date.now()}-${Math.random()}`,
      deckId,
      korean,
      vietnamese,
      romaja,
      exampleKorean,
      exampleVietnamese,
      repetitions: 0,
      interval: 0,
      easinessFactor: 2.5,
      nextReviewDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    saveCards([...cards, newCard]);
  };

  // Import nhiều thẻ từ văn bản (Excel, Sheets, Word copy-paste)
  // Tự động nhận diện ngăn cách bằng phím Tab (\t), dấu gạch ngang (-) hoặc dấu phẩy (,)
  const importCardsFromText = (
    deckId: string,
    rawText: string,
    customDelimiter?: string
  ) => {
    const lines = rawText.split("\n");
    const newCardsToAdd: SrsCard[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      let delimiter = customDelimiter;
      if (!delimiter) {
        if (trimmed.includes("\t")) delimiter = "\t";
        else if (trimmed.includes("-")) delimiter = "-";
        else if (trimmed.includes(",")) delimiter = ",";
        else if (trimmed.includes(":")) delimiter = ":";
        else delimiter = "\t";
      }

      const parts = trimmed.split(delimiter);
      if (parts.length >= 2) {
        const korean = parts[0].trim();
        const vietnamese = parts[1].trim();
        const romaja = parts[2]?.trim() || "";

        if (korean && vietnamese) {
          newCardsToAdd.push({
            id: `card-import-${Date.now()}-${Math.random()}`,
            deckId,
            korean,
            vietnamese,
            romaja,
            repetitions: 0,
            interval: 0,
            easinessFactor: 2.5,
            nextReviewDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    if (newCardsToAdd.length > 0) {
      saveCards([...cards, ...newCardsToAdd]);
    }

    return { count: newCardsToAdd.length };
  };

  // Đánh giá thẻ theo thuật toán SM-2
  const reviewCard = (cardId: string, grade: ReviewGrade) => {
    const targetCard = cards.find((c) => c.id === cardId);
    if (!targetCard) return;

    const sm2Result = calculateSM2(grade, targetCard);
    const updatedCards = cards.map((c) =>
      c.id === cardId ? { ...c, ...sm2Result } : c
    );
    saveCards(updatedCards);
  };

  // Thống kê riêng cho từng bộ thẻ
  const getDeckStats = (deckId: string): SrsStats => {
    const deckCards = cards.filter((c) => c.deckId === deckId);
    const deckNow = new Date().toISOString();
    return {
      total: deckCards.length,
      newCards: deckCards.filter((c) => c.repetitions === 0).length,
      learning: deckCards.filter((c) => c.repetitions >= 1 && c.repetitions < 3).length,
      mastered: deckCards.filter((c) => c.repetitions >= 3).length,
      dueToday: deckCards.filter((c) => c.nextReviewDate <= deckNow).length,
    };
  };

  // Lấy các thẻ cần ôn hôm nay cho 1 bộ thẻ
  const getDueCardsForDeck = (deckId: string): SrsCard[] => {
    const deckNow = new Date().toISOString();
    return cards.filter(
      (c) => c.deckId === deckId && (c.nextReviewDate <= deckNow || c.repetitions === 0)
    );
  };

  return (
    <SrsContext.Provider
      value={{
        decks,
        cards,
        stats,
        createDeck,
        addCard,
        importCardsFromText,
        reviewCard,
        getDeckStats,
        getDueCardsForDeck,
      }}
    >
      {children}
    </SrsContext.Provider>
  );
}

export function useSrs() {
  const context = useContext(SrsContext);
  if (!context) {
    throw new Error("useSrs must be used within an SrsProvider");
  }
  return context;
}
