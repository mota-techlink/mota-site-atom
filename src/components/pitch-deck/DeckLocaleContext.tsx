"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocale } from "next-intl";

interface DeckLocaleContextValue {
  /** The locale currently active for this deck (may differ from URL locale) */
  deckLocale: string;
  /** Update the deck-level locale */
  setDeckLocale: (locale: string) => void;
  /** All locales available in this deck */
  availableLocales: string[];
  /** Display labels keyed by locale code */
  localeLabels: Record<string, string>;
}

const DeckLocaleContext = createContext<DeckLocaleContextValue>({
  deckLocale: "en",
  setDeckLocale: () => {},
  availableLocales: ["en"],
  localeLabels: { en: "EN" },
});

interface DeckLocaleProviderProps {
  children: ReactNode;
  /** The locales this deck supports (e.g. ["en", "zh", "ar"]) */
  availableLocales: string[];
  /** Display labels for each locale */
  localeLabels: Record<string, string>;
}

/**
 * Provides a deck-specific locale that can include locales NOT in the global
 * next-intl config (e.g. Arabic only for this deck).
 *
 * Initialises from the URL locale (via next-intl) if it's in the available set,
 * otherwise falls back to the first available locale.
 */
export function DeckLocaleProvider({
  children,
  availableLocales,
  localeLabels,
}: DeckLocaleProviderProps) {
  const globalLocale = useLocale();
  const initial = availableLocales.includes(globalLocale) ? globalLocale : availableLocales[0];
  const [deckLocale, setDeckLocale] = useState(initial);

  // Sync with URL locale changes (e.g. user navigates /en → /zh externally)
  useEffect(() => {
    if (availableLocales.includes(globalLocale)) {
      setDeckLocale(globalLocale);
    }
  }, [globalLocale, availableLocales]);

  return (
    <DeckLocaleContext.Provider
      value={{ deckLocale, setDeckLocale, availableLocales, localeLabels }}
    >
      {children}
    </DeckLocaleContext.Provider>
  );
}

/** Read the current deck-level locale & helpers */
export function useDeckLocale() {
  return useContext(DeckLocaleContext);
}
