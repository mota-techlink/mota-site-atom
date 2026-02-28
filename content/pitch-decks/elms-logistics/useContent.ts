"use client";

import { useDeckLocale } from "@/components/pitch-deck";
import en from "./locale/en.json";
import zh from "./locale/zh.json";
import ja from "./locale/ja.json";
import ar from "./locale/ar.json";
import ko from "./locale/ko.json";

const contentMap = { en, zh, ja, ar, ko };

export function useContent(): typeof en {
  const { deckLocale } = useDeckLocale();
  return (contentMap as unknown as Record<string, typeof en>)[deckLocale] ?? en;
}
