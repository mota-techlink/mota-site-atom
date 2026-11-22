"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useDeckLocale } from "@/components/pitch-deck";
import { useContent } from "./hooks";
import { LOCALES, LOCALE_LABELS, SECTION_IDS } from "./constants";
import { useTheme } from "next-themes";
import { Languages, Moon, Sun } from "lucide-react";

const subscribe = () => () => {};
const useMounted = () => useSyncExternalStore(subscribe, () => true, () => false);

export function SectionDots({ activeIdx, goTo }: { activeIdx: number; goTo: (i: number) => void }) {
  const c = useContent();
  return <nav aria-label={c.editorial.section} className="mtl-nav mtl-dots fixed right-1.5 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-0.5 rounded-full border border-white/10 bg-slate-950/85 px-1 py-2 backdrop-blur-xl sm:right-3">
    {SECTION_IDS.map((id, i) => <button key={id} type="button" onClick={() => goTo(i)} aria-label={`${c.editorial.section} ${i + 1}`} aria-current={activeIdx === i ? "page" : undefined} className="flex h-7 w-7 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"><span className={`w-1.5 rounded-full transition-all ${activeIdx === i ? "h-5 bg-cyan-300" : "h-1.5 bg-white/50"}`} /></button>)}
  </nav>;
}

export function FloatingNav({ pastHero }: { pastHero: boolean }) {
  const { deckLocale, setDeckLocale } = useDeckLocale();
  const c = useContent();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const isLight = mounted && resolvedTheme === "light";

  useEffect(() => {
    if (!langOpen) return;
    const onDown = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLangOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [langOpen]);

  return <header className={`mtl-nav fixed inset-x-0 top-0 z-50 border-b border-white/10 transition ${pastHero ? "bg-slate-950/90 backdrop-blur-xl" : "bg-slate-950/80"}`}>
    <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4 sm:h-16 sm:px-8">
      <a href={`/${deckLocale}`} className="flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300" aria-label="MOTA TECH LINK home">
        <Image className="only-dark h-6 w-auto sm:h-7" src="/logos/mota-techlink-logo-blk.webp" alt="MOTA TECH LINK" width={150} height={66} />
        <Image className="only-light h-6 w-auto sm:h-7" src="/logos/mota-techlink-logo-wht.webp" alt="MOTA TECH LINK" width={150} height={66} />
      </a>
      <div className="flex items-center gap-1.5">
        <div className="relative" ref={langRef}>
          <button
            type="button"
            aria-label={c.editorial.language}
            aria-haspopup="menu"
            aria-expanded={langOpen}
            onClick={() => setLangOpen((v) => !v)}
            className="mtl-icon-btn"
          >
            <Languages aria-hidden="true" />
          </button>
          {langOpen ? (
            <div role="menu" aria-label={c.editorial.language} className="mtl-lang-menu">
              {LOCALES.map((locale) => (
                <button
                  key={locale}
                  type="button"
                  role="menuitemradio"
                  aria-checked={deckLocale === locale}
                  onClick={() => { setDeckLocale(locale); setLangOpen(false); }}
                  className={deckLocale === locale ? "is-active" : undefined}
                >
                  {LOCALE_LABELS[locale]}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          aria-label={c.editorial.theme}
          aria-pressed={isLight}
          onClick={() => setTheme(isLight ? "dark" : "light")}
          className="mtl-icon-btn"
        >
          {isLight ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
        </button>
      </div>
    </div>
  </header>;
}
