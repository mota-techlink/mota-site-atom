"use client";
import { useSyncExternalStore } from "react";
import Image from "next/image";
import { useDeckLocale } from "@/components/pitch-deck";
import { useContent, useNav } from "./hooks";
import { LOCALES, LOCALE_LABELS, SECTION_IDS } from "./constants";
import { useTheme } from "next-themes";

const subscribe = () => () => {};
const useMounted = () => useSyncExternalStore(subscribe, () => true, () => false);

export function SectionDots({ activeIdx, goTo }: { activeIdx: number; goTo: (i: number) => void }) {
  const c = useContent();
  return <nav aria-label={c.editorial.section} className="mtl-nav fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 rounded-full border border-white/10 bg-slate-950/90 px-2 backdrop-blur-xl">
    {SECTION_IDS.map((id, i) => <button key={id} type="button" onClick={() => goTo(i)} aria-label={`${c.editorial.section} ${i + 1}`} aria-current={activeIdx === i ? "page" : undefined} className="flex h-10 min-w-8 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"><span className={`h-1.5 rounded-full transition-all ${activeIdx === i ? "w-6 bg-cyan-300" : "w-2 bg-white/50"}`} /></button>)}
  </nav>;
}

export function FloatingNav({ pastHero }: { pastHero: boolean }) {
  const { deckLocale, setDeckLocale } = useDeckLocale();
  const c = useContent();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const goTo = useNav();
  return <header className={`mtl-nav fixed inset-x-0 top-0 z-50 border-b border-white/10 transition ${pastHero ? "bg-slate-950/90 backdrop-blur-xl" : "bg-slate-950/80"}`}>
    <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4 sm:h-16 sm:px-8">
      <a href={`/${deckLocale}`} className="flex items-center gap-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300" aria-label="MOTA TECH LINK home"><Image src="/logos/mota-icon-v2.webp" alt="MOTA TECH LINK" width={42} height={28} className="h-7 w-auto" /><span className="hidden text-sm font-bold tracking-wide sm:inline">MOTA TECH LINK</span></a>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => goTo(1)} className="hidden rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10 sm:inline">⌂ {c.editorial.back}</button>
        <select aria-label={c.editorial.language} value={deckLocale} onChange={e => setDeckLocale(e.target.value)} className="rounded-full border border-white/15 bg-slate-900 px-2 py-2 text-xs text-white">{LOCALES.map(locale => <option key={locale} value={locale}>{LOCALE_LABELS[locale]}</option>)}</select>
        <button type="button" aria-label={c.editorial.theme} aria-pressed={mounted && resolvedTheme === "light"} onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="h-9 w-9 rounded-full border border-white/15 text-sm text-white/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">{mounted && resolvedTheme === "light" ? "☾" : "☼"}</button>
      </div>
    </div>
  </header>;
}
