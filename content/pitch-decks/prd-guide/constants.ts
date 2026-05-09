import zh from "./locale/zh.json";
import en from "./locale/en.json";
import {
  PAGE,
  PAGE_INNER,
  THEME,
  LOCALES as SHARED_LOCALES,
  LOCALE_LABELS as SHARED_LABELS,
} from "@/components/pitch-deck/deck/constants";
import type { ThemeTokens } from "@/components/pitch-deck/deck/constants";

export const SECTION_IDS = [
  "s-cover",
  "s-background",
  "s-products",
  "s-scanning",
  "s-engine",
  "s-pipeline",
  "s-billing",
  "s-architecture",
  "s-portals",
  "s-partners",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_MAP = Object.fromEntries(
  SECTION_IDS.map((id, i) => [id, i])
) as Record<string, number>;

export const FREE_PAGE_LIMIT = 3;

export const LOCALES = SHARED_LOCALES;
export const LOCALE_LABELS = SHARED_LABELS;

export const contentMap = { zh, en };
export type ContentType = typeof zh;

export { PAGE, PAGE_INNER, THEME };
export type { ThemeTokens };
