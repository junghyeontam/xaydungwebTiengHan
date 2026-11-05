import viMessages from "./vi.json";
import enMessages from "./en.json";

export type SupportedLocale = "vi" | "en";

export const MESSAGES: Record<SupportedLocale, Record<string, any>> = {
  vi: viMessages,
  en: enMessages,
};

export { viMessages, enMessages };
export * from "./translations";
export * from "./I18nContext";
