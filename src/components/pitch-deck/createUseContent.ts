"use client";

import { useDeckLocale } from "./DeckLocaleContext";

/**
 * Factory that creates a `useContent()` hook for a specific deck.
 *
 * Pass a map of locale → JSON content objects; the returned hook
 * reads the current deck-level locale and returns the matching content,
 * falling back to `fallbackLocale` (default: first key in the map).
 *
 * @example
 * ```ts
 * import en from "./locale/en.json";
 * import zh from "./locale/zh.json";
 * export const useContent = createUseContent({ en, zh });
 * ```
 */
export function createUseContent<T>(
  contentMap: Record<string, T>,
  fallbackLocale?: string,
): () => T {
  const fallback = fallbackLocale ?? Object.keys(contentMap)[0];

  return function useContent(): T {
    const { deckLocale } = useDeckLocale();
    return contentMap[deckLocale] ?? contentMap[fallback];
  };
}
