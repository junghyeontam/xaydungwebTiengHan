"use client";

import {
  TheoryCollectionCard,
  INITIAL_THEORY_COLLECTIONS,
  TheoryVocabWord,
  TheoryGrammarItem,
  TheoryChapter,
  syncCollectionStats,
} from "./theory-collections-data";

const STORAGE_KEY = "jh_theory_collections_v4";

export function loadTheoryCollections(): TheoryCollectionCard[] {
  if (typeof window === "undefined") {
    return INITIAL_THEORY_COLLECTIONS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const normalized = INITIAL_THEORY_COLLECTIONS.map(syncCollectionStats);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(syncCollectionStats);
    }
    return INITIAL_THEORY_COLLECTIONS;
  } catch (err) {
    console.error("Error loading theory collections from storage:", err);
    return INITIAL_THEORY_COLLECTIONS;
  }
}

export function saveTheoryCollections(data: TheoryCollectionCard[]): void {
  if (typeof window === "undefined") return;
  try {
    const normalized = data.map(syncCollectionStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new Event("jh_theory_updated"));
  } catch (err) {
    console.error("Error saving theory collections:", err);
  }
}

export function resetTheoryCollectionsToDefault(): TheoryCollectionCard[] {
  const normalized = INITIAL_THEORY_COLLECTIONS.map(syncCollectionStats);
  saveTheoryCollections(normalized);
  return normalized;
}

export function toggleTheoryItemLearned(
  collectionId: string,
  chapterId: string,
  itemId: string
): TheoryCollectionCard[] {
  const current = loadTheoryCollections();
  const updated = current.map((col) => {
    if (col.id !== collectionId) return col;

    const nextChapters = col.chapters.map((ch) => {
      if (ch.id !== chapterId) return ch;
      const nextItems = ch.items.map((item) => {
        if (item.id !== itemId) return item;
        return { ...item, isLearned: !item.isLearned };
      });
      return { ...ch, items: nextItems };
    });

    return syncCollectionStats({
      ...col,
      chapters: nextChapters,
    });
  });

  saveTheoryCollections(updated);
  return updated;
}

export function markTheoryItemLearned(
  collectionId: string,
  chapterId: string,
  itemId: string,
  isLearned: boolean = true
): TheoryCollectionCard[] {
  const current = loadTheoryCollections();
  const updated = current.map((col) => {
    if (col.id !== collectionId) return col;

    const nextChapters = col.chapters.map((ch) => {
      if (ch.id !== chapterId) return ch;
      const nextItems = ch.items.map((item) => {
        if (item.id !== itemId) return item;
        return { ...item, isLearned };
      });
      return { ...ch, items: nextItems };
    });

    return syncCollectionStats({
      ...col,
      chapters: nextChapters,
    });
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
  const newId = "v-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
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

    return syncCollectionStats({
      ...col,
      chapters: nextChapters,
    });
  });

  saveTheoryCollections(updated);
  return updated;
}

export function deleteVocabFromChapter(
  collectionId: string,
  chapterId: string,
  wordId: string
): TheoryCollectionCard[] {
  const current = loadTheoryCollections();
  const updated = current.map((col) => {
    if (col.id !== collectionId) return col;

    const nextChapters = col.chapters.map((ch) => {
      if (ch.id !== chapterId) return ch;
      return {
        ...ch,
        items: ch.items.filter((i) => i.id !== wordId),
      };
    });

    return syncCollectionStats({
      ...col,
      chapters: nextChapters,
    });
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
  const newId = "g-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
  const newGrammar: TheoryGrammarItem = {
    ...grammar,
    id: newId,
  };

  const updated = current.map((col) => {
    if (col.id !== collectionId) return col;

    const targetChId = chapterId || (col.chapters[0]?.id ?? "g-default");
    const nextChapters = col.chapters.map((ch) => {
      if (ch.id !== targetChId) return ch;
      return {
        ...ch,
        items: [...ch.items, newGrammar],
      };
    });

    return syncCollectionStats({
      ...col,
      chapters: nextChapters,
    });
  });

  saveTheoryCollections(updated);
  return updated;
}

export function updateGrammarInChapter(
  collectionId: string,
  chapterId: string,
  grammarId: string,
  updates: Partial<TheoryGrammarItem>
): TheoryCollectionCard[] {
  const current = loadTheoryCollections();
  const updated = current.map((col) => {
    if (col.id !== collectionId) return col;
    const nextChapters = col.chapters.map((ch) => {
      if (ch.id !== chapterId) return ch;
      return {
        ...ch,
        items: ch.items.map((it) => (it.id === grammarId ? { ...it, ...updates } : it)),
      };
    });
    return syncCollectionStats({
      ...col,
      chapters: nextChapters,
    });
  });

  saveTheoryCollections(updated);
  return updated;
}

export function deleteGrammarFromChapter(
  collectionId: string,
  chapterId: string,
  grammarId: string
): TheoryCollectionCard[] {
  const current = loadTheoryCollections();
  const updated = current.map((col) => {
    if (col.id !== collectionId) return col;

    const nextChapters = col.chapters.map((ch) => {
      if (ch.id !== chapterId) return ch;
      return {
        ...ch,
        items: ch.items.filter((i) => i.id !== grammarId),
      };
    });

    return syncCollectionStats({
      ...col,
      chapters: nextChapters,
    });
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
    targetWordCount?: number;
  }
): TheoryCollectionCard[] {
  const current = loadTheoryCollections();
  const newChapterId = "ch-" + Date.now();
  const newChapter: TheoryChapter<TheoryVocabWord | TheoryGrammarItem> = {
    id: newChapterId,
    titleVi: chapter.titleVi,
    koreanSubtitle: chapter.koreanSubtitle,
    descriptionVi: chapter.descriptionVi,
    targetWordCount: 0,
    items: [],
  };

  const updated = current.map((col) => {
    if (col.id !== collectionId) return col;
    return syncCollectionStats({
      ...col,
      chapters: [...col.chapters, newChapter],
    });
  });

  saveTheoryCollections(updated);
  return updated;
}
