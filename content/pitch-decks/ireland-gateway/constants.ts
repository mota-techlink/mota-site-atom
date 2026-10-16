import en from "./locale/en.json";
import zh from "./locale/zh.json";

export const SECTION_IDS = [
  "s-hero",
  "s-why",
  "s-platform",
  "s-tax",
  "s-waterford",
  "s-sectors",
  "s-food",
  "s-medical",
  "s-cold",
  "s-construction",
  "s-cases",
  "s-compliance",
  "s-risk",
  "s-elmsflow",
  "s-cta",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** Maps section ID to slide index */
export const SECTION_MAP = Object.fromEntries(
  SECTION_IDS.map((id, i) => [id, i]),
) as Record<string, number>;

export const LOCALES = ["en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

/** English is the deck default; Chinese is the alternate. */
export const DEFAULT_LOCALE = "en";

export const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  zh: "中文",
};

export const contentMap = { en, zh };
export type ContentType = typeof en;
