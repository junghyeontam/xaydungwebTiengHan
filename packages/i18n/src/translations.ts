import viMessages from "./vi.json";
import enMessages from "./en.json";

export type Locale = "vi" | "en";

export const translations = {
  vi: viMessages,
  en: enMessages,
};

export type TranslationSchema = typeof viMessages;
