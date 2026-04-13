import en from "./locale/en.json";
import zh from "./locale/zh.json";
import ja from "./locale/ja.json";
import ko from "./locale/ko.json";

export const SECTION_IDS = [
  "s-hero",
  "s-problem",
  "s-howitworks",
  "s-platforms",
  "s-pricing",
  "s-topup",
  "s-earlybird",
  "s-whymota",
  "s-cta",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** Maps section ID → slide index */
export const SECTION_MAP = Object.fromEntries(
  SECTION_IDS.map((id, i) => [id, i])
) as Record<string, number>;

export const LOCALES = ["en", "zh", "ja", "ko"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
};

export const contentMap = { en, zh, ja, ko };
export type ContentType = typeof en;

/**
 * Base className for each section's content wrapper.
 * The slide wrapper (absolute, inset-0) is added by deck.tsx.
 */
export const SECTION = "h-full flex flex-col justify-center overflow-hidden";
