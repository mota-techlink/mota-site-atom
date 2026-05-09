"use client";

import React, { useState, type ReactNode } from "react";
import { useDeckTheme } from "../theme";
import { THEME } from "../constants";

/**
 * Collapsible section wrapper — click header to expand/collapse.
 * Default collapsed. Smooth max-height transition.
 */
export function Collapsible({
  title,
  badge,
  children,
  defaultOpen = false,
}: {
  title: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const { theme } = useDeckTheme();
  const t = THEME[theme];

  return (
    <div className={`rounded-xl border ${t.cardBorder} overflow-hidden ${t.cardBg} transition-colors`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer ${theme === "dark" ? "hover:bg-white/5" : "hover:bg-[#DBD3ED]"} transition-colors`}
      >
        {/* Chevron */}
        <svg
          className={`w-5 h-5 shrink-0 ${t.muted} transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className={`flex-1 text-xl font-semibold ${t.subheading}`}>{title}</span>
        {badge && <span className="shrink-0">{badge}</span>}
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-0 pb-3">{children}</div>
      </div>
    </div>
  );
}
