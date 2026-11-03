import viMessages from "@/messages/vi.json";
import enMessages from "@/messages/en.json";

export type Locale = "vi" | "en";

export const translations = {
  vi: viMessages,
  en: enMessages,
};

export type TranslationSchema = typeof viMessages;
