import zh from "./locale/zh.json";
import en from "./locale/en.json";

export const SECTION_IDS = [
  "s-background",
  "s-cover",
  "s-analysis",
  "s-scanners",
  "s-mining",
  "s-reply",
  "s-partner",
  "s-erd",
  "s-edge",
  "s-billing",
  "s-dashboard",
  "s-schedule",
  "s-i18n",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** Maps section ID → slide index */
export const SECTION_MAP = Object.fromEntries(
  SECTION_IDS.map((id, i) => [id, i])
) as Record<string, number>;

/** Number of free pages for unauthenticated users */
export const FREE_PAGE_LIMIT = 3;

export const LOCALES = ["zh", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<string, string> = {
  zh: "中文",
  en: "EN",
};

export const contentMap = { zh, en };
export type ContentType = typeof zh;

/**
 * Base class for section content wrapper.
 * Scrollable page with consistent padding.
 */
export const PAGE =
  "h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent";

/**
 * Inner content container with max-width and padding.
 */
export const PAGE_INNER =
  "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12";
