import en from "./locale/en.json";
import zh from "./locale/zh.json";

export const SECTION_IDS = [
  "s-hero",
  "s-problem",
  "s-solution",
  "s-competitive",
  "s-ai-lab",
  "s-tracking",
  "s-target-market",
  "s-ai-marketing",
  "s-security",
  "s-compliance-dashboard",
  "s-pricing",
  "s-financial",
  "s-growth",
  "s-roadmap",
  "s-carbon-credits",
  "s-shareholders",
  "s-cta",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** Maps section ID → slide index */
export const SECTION_MAP = Object.fromEntries(
  SECTION_IDS.map((id, i) => [id, i]),
) as Record<string, number>;

export const LOCALES = ["en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  zh: "中文",
};

export const contentMap = { en, zh };
export type ContentType = typeof en;

/**
 * Base className for each section's content wrapper.
 * Uses py-safe for vertical padding that adapts to viewport height.
 */
export const SECTION =
  "h-full flex flex-col justify-center overflow-y-auto py-12 sm:py-0";
