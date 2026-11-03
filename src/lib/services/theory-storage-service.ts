"use client";

import {
  TheoryCollectionCard,
  INITIAL_THEORY_COLLECTIONS,
  TheoryVocabWord,
  TheoryGrammarItem,
  TheoryChapter,
} from "@/lib/data/theory-collections-data";

const STORAGE_KEY = "jh_theory_collections_v1";

export function loadTheoryCollections(): TheoryCollectionCard[] {
  if (typeof window === "undefined") {
    return INITIAL_THEORY_COLLECTIONS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_THEORY_COLLECTIONS));
      return INITIAL_THEORY_COLLECTIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_THEORY_COLLECTIONS;
  } catch (err) {
    console.error("Error loading theory collections from storage:", err);
    return INITIAL_THEORY_COLLECTIONS;
  }
}

export function saveTheoryCollections(data: TheoryCollectionCard[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("jh_theory_updated"));
  } catch (err) {
    console.error("Error saving theory collections:", err);
  }
}

export function toggleTheoryItemLearned(
  collectionId: string,
  chapterId: string,
  itemId: string
): TheoryCollectionCard[] {
  const current = loadTheoryCollections();
  const updated = current.map((col) => {
    if (col.id !== collectionId) return col;

    let learnedDelta = 0;
    const nextChapters = col.chapters.map((ch) => {
      if (ch.id !== chapterId) return ch;
      const nextItems = ch.items.map((item) => {
        if (item.id !== itemId) return item;
        const nextStatus = !item.isLearned;
        learnedDelta += nextStatus ? 1 : -1;
        return { ...item, isLearned: nextStatus };
      });
      return { ...ch, items: nextItems };
    });

    const newCompleted = Math.max(0, Math.min(col.totalCount, col.completedCount + learnedDelta));
    return {
      ...col,
      completedCount: newCompleted,
      chapters: nextChapters,
    };
  });

  saveTheoryCollections(updated);
  return updated;
}

export function addVocabToChapter(
  collectionId: string,
  chapterId: string,
  word: Omit<TheoryVocabWord, "id">
): TheoryCollectionCard[] {
  const current = loadTheoryCollections();
  const newId = "v-" + Date.now();
  const newWord: TheoryVocabWord = {
    ...word,
    id: newId,
  };

  const updated = current.map((col) => {
    if (col.id !== collectionId) return col;

    const nextChapters = col.chapters.map((ch) => {
      if (ch.id !== chapterId) return ch;
      return {
        ...ch,
        items: [...ch.items, newWord],
      };
    });

    return {
      ...col,
      totalCount: col.totalCount + 1,
      completedCount: word.isLearned ? col.completedCount + 1 : col.completedCount,
      chapters: nextChapters,
    };
  });

  saveTheoryCollections(updated);
  return updated;
}

export function addGrammarToChapter(
  collectionId: string,
  chapterId: string,
  grammar: Omit<TheoryGrammarItem, "id">
): TheoryCollectionCard[] {
  const current = loadTheoryCollections();
  const newId = "g-" + Date.now();
  const newGrammar: TheoryGrammarItem = {
    ...grammar,
    id: newId,
  };

  const updated = current.map((col) => {
    if (col.id !== collectionId) return col;

    const nextChapters = col.chapters.map((ch) => {
      if (ch.id !== chapterId) return ch;
      return {
        ...ch,
        items: [...ch.items, newGrammar],
      };
    });

    return {
      ...col,
      totalCount: col.totalCount + 1,
      completedCount: grammar.isLearned ? col.completedCount + 1 : col.completedCount,
      chapters: nextChapters,
    };
  });

  saveTheoryCollections(updated);
  return updated;
}

export function addChapterToTheoryCollection(
  collectionId: string,
  chapter: {
    titleVi: string;
    koreanSubtitle: string;
    descriptionVi: string;
  }
): TheoryCollectionCard[] {
  const current = loadTheoryCollections();
  const newChapterId = "ch-" + Date.now();
  const newChapter: TheoryChapter<TheoryVocabWord | TheoryGrammarItem> = {
    id: newChapterId,
    titleVi: chapter.titleVi,
    koreanSubtitle: chapter.koreanSubtitle,
    descriptionVi: chapter.descriptionVi,
    items: [],
  };

  const updated = current.map((col) => {
    if (col.id !== collectionId) return col;
    return {
      ...col,
      chapters: [...col.chapters, newChapter],
    };
  });

  saveTheoryCollections(updated);
  return updated;
}
