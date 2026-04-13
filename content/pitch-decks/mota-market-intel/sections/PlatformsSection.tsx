"use client";

import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";

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

export function PlatformsSection() {
  const c = useContent();
  const p = c.platforms;

  return (
    <section id="s-platforms" className={`${SECTION} bg-zinc-950`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
          {p.badge}
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">{p.title}</h2>
        <p className="text-white/40 mb-10 text-lg">{p.subtitle}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {p.items.map((name, i) => (
            <div
              key={i}
              className="mi-child group rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8 p-5 flex flex-col items-center gap-3 transition-all duration-200"
            >
              <span className="text-2xl">{PLATFORM_ICONS[name] ?? "🔷"}</span>
              <span className="text-sm text-white/70 group-hover:text-white transition-colors font-medium text-center">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
