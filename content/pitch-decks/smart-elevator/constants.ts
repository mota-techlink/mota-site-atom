import en from "./locale/en.json";
import zh from "./locale/zh.json";

export const SECTION_IDS = [
  "s-hero",
  "s-problem",
  "s-solution",
  "s-features",
  "s-access-control",
  "s-display",
  "s-schedule",
  "s-energy",
  "s-howworks",
  "s-value",
  "s-bizmodel",
  "s-roadmap",
  "s-cta",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_MAP = Object.fromEntries(
  SECTION_IDS.map((id, i) => [id, i])
) as Record<string, number>;

export const LOCALES = ["zh", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<string, string> = {
  zh: "中文",
  en: "EN",
};

export const contentMap = { zh, en };
export type ContentType = typeof zh;

export const SECTION = "h-full flex flex-col justify-center overflow-y-auto py-12 sm:py-0";
