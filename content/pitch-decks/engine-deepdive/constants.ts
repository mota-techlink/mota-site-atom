import zh from "./locale/zh.json";
import en from "./locale/en.json";

export const SECTION_IDS = [
  "s-overview",
  "s-flow",
  "s-prompt-fields",
  "s-task-fields",
  "s-trigger",
  "s-back",
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
