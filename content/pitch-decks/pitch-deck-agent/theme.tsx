"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";

export type DeckTheme = "dark" | "light";

interface ThemeCtx {
  theme: DeckTheme;
  toggle: () => void;
  setTheme: (t: DeckTheme) => void;
}

const Ctx = createContext<ThemeCtx>({
  theme: "dark",
  toggle: () => {},
  setTheme: () => {},
});

export const useDeckTheme = () => useContext(Ctx);

const STORAGE_KEY = "pda-deck-theme";

export function DeckThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<DeckTheme>("dark");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as DeckTheme | null;
      if (saved === "light" || saved === "dark") setThemeState(saved);
    } catch {
      /* SSR / privacy */
    }
  }, []);

  const setTheme = useCallback((t: DeckTheme) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* noop */
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({ theme, toggle, setTheme }),
    [theme, toggle, setTheme]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
