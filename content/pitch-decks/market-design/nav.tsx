"use client";

import React, { useState, useContext } from "react";
import Image from "next/image";
import { useDeckLocale, useDeckAccess } from "@/components/pitch-deck";
import { SECTION_IDS, LOCALES, LOCALE_LABELS, THEME } from "./constants";
import { useContent, PageNavCtx, ActivePageCtx } from "./hooks";
import { useDeckTheme } from "./theme";

// ─── Section metadata (icon + nav label key) ─────────────────────────────────
const SECTION_META: { icon: string; key: string }[] = [
  { icon: "🎯", key: "background" },
  { icon: "📋", key: "cover" },
  { icon: "🔍", key: "analysis" },
  { icon: "📡", key: "scanners" },
  { icon: "🔮", key: "mining" },
  { icon: "💬", key: "reply" },
  { icon: "🤝", key: "partner" },
  { icon: "🗄️", key: "erd" },
  { icon: "⚡", key: "edge" },
  { icon: "💰", key: "billing" },
  { icon: "📊", key: "dashboard" },
  { icon: "⏱️", key: "schedule" },
  { icon: "🌐", key: "i18n" },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const c = useContent();
  const goTo = useContext(PageNavCtx);
  const activeIdx = useContext(ActivePageCtx);
  const { canView, showGate, userTier } = useDeckAccess();
  const isAuth = userTier === "admin";
  const { theme } = useDeckTheme();
  const t = THEME[theme];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className={`fixed inset-0 ${t.overlay} z-40 lg:hidden`}
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 w-64 ${t.sidebarBg} border-r ${t.sidebarBorder}
          flex flex-col transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className={`shrink-0 px-4 py-4 border-b ${t.divider}`}>
          <a
            href="https://motaiot.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logos/mota-icon-v2.webp"
              alt="Mota"
              width={80}
              height={28}
              className="h-6 w-auto"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <span className={`${t.subheading} text-sm font-semibold`}>
              {c.nav.title}
            </span>
          </a>

          {/* Version badges */}
          <div className="flex gap-1.5 flex-wrap">
            {c.nav.versions.map((v: { label: string; ver: string }, i: number) => (
              <span
                key={i}
                className={`text-[10px] px-1.5 py-0.5 rounded ${t.badgeBg} ${t.badgeText} font-mono`}
              >
                {v.label} {v.ver}
              </span>
            ))}
          </div>
        </div>

        {/* Nav items — scrollable */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {SECTION_IDS.map((_, idx) => {
            const meta = SECTION_META[idx];
            const isActive = activeIdx === idx;
            const isLocked = !canView(idx);
            const label = (c.nav.sections as Record<string, string>)[meta.key] ?? meta.key;

            return (
              <button
                key={idx}
                onClick={() => {
                  if (isLocked) {
                    showGate();
                  } else {
                    goTo(idx);
                    onClose();
                  }
                }}
                disabled={isLocked}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm
                  transition-all duration-200 mb-0.5 cursor-pointer
                  ${isActive
                    ? `${t.navActive} font-medium`
                    : isLocked
                    ? `${t.navLocked} cursor-not-allowed`
                    : t.navInactive}
                `}
              >
                <span className="text-base shrink-0">{meta.icon}</span>
                <span className="flex-1 truncate">{label}</span>
                {isLocked && (
                  <svg
                    className="w-3.5 h-3.5 text-white/20 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {isActive && (
                  <div className="w-1 h-4 rounded-full bg-indigo-400 shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer — login hint */}
        {!isAuth && (
          <div className={`shrink-0 px-4 py-3 border-t ${t.divider}`}>
            <p className="text-[10px] text-amber-400/60 leading-relaxed">
              🔒 {c.nav.loginHint}
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

// ─── Top-right controls (lang + theme) ───────────────────────────────────────
export function TopControls() {
  const { deckLocale, setDeckLocale } = useDeckLocale();
  const { theme, toggle: toggleTheme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";

  return (
    <div className={`fixed top-2 right-3 z-40 flex items-center gap-1 rounded-full px-1.5 py-1 backdrop-blur-md ${isDark ? "bg-black/30 border border-white/10" : "bg-white/70 border border-gray-200 shadow-sm"}`}>
      {LOCALES.map((locale) => (
        <button
          key={locale}
          onClick={() => setDeckLocale(locale)}
          className={`
            px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer
            ${deckLocale === locale
              ? isDark ? "bg-white/20 text-white" : "bg-gray-800 text-white"
              : `${t.muted} ${isDark ? "hover:text-white hover:bg-white/10" : "hover:text-gray-700 hover:bg-white/40"}`}
          `}
        >
          {LOCALE_LABELS[locale]}
        </button>
      ))}
      <div className={`w-px h-4 ${isDark ? "bg-white/15" : "bg-gray-300"}`} />
      <button
        onClick={toggleTheme}
        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all duration-200 cursor-pointer ${isDark ? "text-white/60 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-900 hover:bg-white/40"}`}
        aria-label="Toggle theme"
      >
        {isDark ? "☀️" : "🌙"}
      </button>
    </div>
  );
}

// ─── Mobile top bar ───────────────────────────────────────────────────────────
export function MobileTopBar({ onToggle }: { onToggle: () => void }) {
  const c = useContent();
  const activeIdx = useContext(ActivePageCtx);
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const meta = SECTION_META[activeIdx];
  const label = (c.nav.sections as Record<string, string>)[meta?.key] ?? "";

  return (
    <header className={`fixed top-0 inset-x-0 z-30 h-12 ${t.sidebarBg}/95 backdrop-blur-md border-b ${t.divider} flex items-center px-3 gap-3 lg:hidden`}>
      <button
        onClick={onToggle}
        className={`w-8 h-8 flex items-center justify-center rounded-lg ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-200"} transition-colors cursor-pointer`}
        aria-label="Toggle navigation"
      >
        <svg
          className={`w-5 h-5 ${t.subheading}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <span className={`text-sm ${t.subheading} truncate`}>
        {meta?.icon} {label}
      </span>
      <span className={`ml-auto text-[10px] ${t.muted} font-mono mr-24`}>
        {activeIdx + 1}/{SECTION_IDS.length}
      </span>
    </header>
  );
}
