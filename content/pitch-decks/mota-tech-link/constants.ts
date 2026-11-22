import en from "./locale/en.json";
import zh from "./locale/zh.json";
import ja from "./locale/ja.json";
import es from "./locale/es.json";

export const SECTION_IDS = [
  "s-cover","s-map","s-elmsflow","s-auraight","s-vflux","s-ai-video","s-network","s-cta",
] as const;
export type SectionId = (typeof SECTION_IDS)[number];
export const LOCALES = ["en","zh","ja","es"] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_LABELS: Record<string,string> = { en:"EN", zh:"中文", ja:"日本語", es:"Español" };
export const contentMap = { en, zh, ja, es };
export type ContentType = typeof en;
