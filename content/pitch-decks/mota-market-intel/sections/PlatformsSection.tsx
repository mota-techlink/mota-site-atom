"use client";

import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

const PLATFORM_ICONS: Record<string, string> = {
  // English platforms
  Reddit: "🟠",
  YouTube: "🔴",
  "Amazon Reviews": "🟡",
  Quora: "🟤",
  "Twitter / X": "🐦",
  "App Store": "🍎",
  "Google Play": "🟢",
  "Hacker News": "🔥",
  "Stack Overflow": "📚",
  Trustpilot: "⭐",
  G2: "💼",
  // Multilingual / local platforms
  "Naver 지식iN": "🇰🇷",
  "Yahoo! 知恵袋": "🇯🇵",
  Pikabu: "🇷🇺",
  "Reclame Aqui": "🇧🇷",
  VK: "🇷🇺",
  "Yandex Q": "🔍",
  "Taringa!": "🇦🇷",
  "Kakaku.com": "🛒",
  "価格.com": "🛒",
  Coupang: "🇰🇷",
  // Locale variants for Amazon
  亚马逊评论: "🟡",
  "Amazon レビュー": "🟡",
  Amazonレビュー: "🟡",
  "Amazon 리뷰": "🟡",
};

/** Inline marquee CSS — injected once */
const MARQUEE_CSS = `
  @keyframes marqueeLeft {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes marqueeRight {
    0%   { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  .marquee-left { animation: marqueeLeft 40s linear infinite; }
  .marquee-right { animation: marqueeRight 40s linear infinite; }
  .marquee-track:hover .marquee-left,
  .marquee-track:hover .marquee-right { animation-play-state: paused; }
`;

function MarqueeRow({
  items,
  direction,
}: {
  items: string[];
  direction: "left" | "right";
}) {
  // Double the items to create seamless loop
  const doubled = [...items, ...items];
  const cls = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div className="marquee-track overflow-hidden">
      <div className={`flex gap-2 sm:gap-3 w-max ${cls}`}>
        {doubled.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className="shrink-0 flex items-center gap-1.5 sm:gap-2.5 rounded-full bg-d-fg/5 border border-d-fg/10 hover:border-d-fg/25 hover:bg-d-fg/8 px-3 py-1.5 sm:px-5 sm:py-2.5 transition-all duration-200 cursor-default"
          >
            <span className="text-base sm:text-xl">{PLATFORM_ICONS[name] ?? "🔷"}</span>
            <span className="text-[11px] sm:text-sm text-d-fg/70 font-medium whitespace-nowrap">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlatformsSection() {
  const c = useContent();
  const p = c.platforms;

  // Split items into two rows for dual-direction marquee
  const mid = Math.ceil(p.items.length / 2);
  const row1 = p.items.slice(0, mid);
  const row2 = p.items.slice(mid);

  return (
    <section id="s-platforms" className={`${SECTION} bg-d-bg2 relative`}>
      <DynamicBackground accent="emerald" count={12} />
      <style>{MARQUEE_CSS}</style>

      <div className="w-full relative z-10">
        {/* Header — constrained width */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 sm:px-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-d-emerald text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            {p.badge}
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-d-fg mb-2 sm:mb-3">
            {p.title}
          </h2>
          <p className="text-d-fg/40 mb-6 sm:mb-10 text-sm sm:text-lg">{p.subtitle}</p>
        </div>

        {/* Marquee rows — full width with gradient fade edges */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-linear-to-r from-d-bg2 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-linear-to-l from-d-bg2 to-transparent z-10 pointer-events-none" />

          <div className="space-y-2 sm:space-y-3 px-2">
            <MarqueeRow items={row1} direction="left" />
            <MarqueeRow items={row2} direction="right" />
          </div>
        </div>
      </div>
    </section>
  );
}
