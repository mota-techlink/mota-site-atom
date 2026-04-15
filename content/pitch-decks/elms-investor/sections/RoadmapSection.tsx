"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { Map, X } from "lucide-react";

// ─── Track colors ────────────────────────────────────────────────
const TRACK_COLORS = [
  { bg: "bg-blue-500/10", border: "border-blue-500/25", text: "text-blue-400", dot: "bg-blue-500" },
  { bg: "bg-violet-500/10", border: "border-violet-500/25", text: "text-violet-400", dot: "bg-violet-500" },
  { bg: "bg-emerald-500/10", border: "border-emerald-500/25", text: "text-emerald-400", dot: "bg-emerald-500" },
];

const STATUS_COLORS: Record<string, string> = {
  done: "bg-emerald-500",
  active: "bg-blue-500",
  planned: "bg-amber-500",
  vision: "bg-violet-500",
};

// ─── Main Section ────────────────────────────────────────────────
export function RoadmapSection() {
  const content = useContent();
  const c = content.slide8;
  const [selected, setSelected] = useState<{
    title: string;
    desc: string;
    detail?: string;
    track: string;
    period: string;
    status: string;
    trackColor: (typeof TRACK_COLORS)[number];
    statusKey: string;
  } | null>(null);

  const statuses = ["done", "active", "planned", "vision"];

  return (
    <section
      className={`${SECTION} bg-[#f0f4f8] dark:bg-linear-to-b dark:from-[#0a0e15] dark:via-[#0d1320] dark:to-[#0a0e15]`}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center px-4 md:px-8 py-6 text-white overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-blue-600/[0.04] blur-[120px] rounded-full pointer-events-none" />

        {/* Badge */}
        <motion.div
          className="ei-child inline-flex items-center gap-2 mb-3 md:mb-4 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/[0.08]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Map className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] md:text-sm font-mono tracking-[0.2em] uppercase text-blue-400/90">
            {c.badge}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="ei-child text-2xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold tracking-tight text-center mb-1"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {c.title}{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-300">
            {c.titleHighlight}
          </span>
        </motion.h2>
        <motion.p
          className="ei-child text-xs md:text-base text-white/50 text-center max-w-xl mb-4 md:mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {c.subtitle}
        </motion.p>

        {/* Time columns header */}
        <div className="ei-child w-full max-w-4xl 2xl:max-w-6xl mb-2 hidden md:grid grid-cols-[clamp(100px,8vw,200px)_repeat(4,1fr)] gap-2">
          <div /> {/* spacer for track labels */}
          {c.timeColumns.map((col: { period: string; label: string }, i: number) => (
            <motion.div
              key={col.period}
              className="text-center"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
            >
              <div className="text-[10px] md:text-xs font-mono text-white/40 uppercase">
                {col.period}
              </div>
              <div className="text-[9px] md:text-[11px] text-white/25">
                {col.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Track rows */}
        <div className="ei-child w-full max-w-4xl 2xl:max-w-6xl flex flex-col gap-2 md:gap-3">
          {c.tracks.map(
            (
              track: {
                label: string;
                milestones: { title: string; desc: string }[];
              },
              ti: number,
            ) => {
              const tc = TRACK_COLORS[ti % TRACK_COLORS.length];
              return (
                <motion.div
                  key={track.label}
                  className="grid grid-cols-1 md:grid-cols-[clamp(100px,8vw,200px)_repeat(4,1fr)] gap-2"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + ti * 0.12 }}
                >
                  {/* Track label */}
                  <div className="flex items-center gap-2 md:pr-2">
                    <div className={`w-2 h-2 rounded-full ${tc.dot} shrink-0`} />
                    <span className={`text-[10px] md:text-xs font-bold ${tc.text} truncate`}>
                      {track.label}
                    </span>
                  </div>

                  {/* Milestones */}
                  {track.milestones.map(
                    (
                      ms: { title: string; desc: string; detail?: string },
                      mi: number,
                    ) => (
                      <button
                        key={ms.title}
                        onClick={() =>
                          setSelected({
                            title: ms.title,
                            desc: ms.desc,
                            detail: ms.detail,
                            track: track.label,
                            period: c.timeColumns[mi]?.period ?? "",
                            status: (c.statusLabels as Record<string, string>)[statuses[mi]] ?? statuses[mi],
                            trackColor: tc,
                            statusKey: statuses[mi],
                          })
                        }
                        className={`rounded-lg border ${tc.border} ${tc.bg} px-3 py-2.5 md:px-4 md:py-3 text-left cursor-pointer transition-all duration-200 hover:brightness-125 hover:scale-[1.02] active:scale-[0.98]`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[statuses[mi]] || STATUS_COLORS.planned}`}
                          />
                          <span className="text-[9px] md:text-xs font-bold text-white/80 truncate">
                            {ms.title}
                          </span>
                        </div>
                        <p className="text-[8px] md:text-[10px] text-white/40 leading-snug">
                          {ms.desc}
                        </p>
                      </button>
                    ),
                  )}
                </motion.div>
              );
            },
          )}
        </div>

        {/* Status legend */}
        <motion.div
          className="ei-child flex items-center gap-4 mt-3 md:mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {Object.entries(c.statusLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${STATUS_COLORS[key] || "bg-white/20"}`}
              />
              <span className="text-[9px] md:text-xs text-white/40 font-mono">
                {label as string}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── Milestone Detail Popup ── */}
        <AnimatePresence>
          {selected && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setSelected(null)}
              />

              {/* Popup card */}
              <motion.div
                className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {/* Header */}
                <div className={`px-5 py-4 border-b border-white/10 ${selected.trackColor.bg}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[selected.statusKey] || "bg-white/20"}`} />
                        <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
                          {selected.track}
                        </span>
                      </div>
                      <h3 className={`text-lg md:text-xl font-bold ${selected.trackColor.text}`}>
                        {selected.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-white/40 font-mono">{selected.period}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${STATUS_COLORS[selected.statusKey] || "bg-white/20"} text-white/90`}>
                          {selected.status}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white/80"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="px-5 py-4">
                  <p className="text-xs md:text-sm text-white/50 font-medium mb-3">
                    {selected.desc}
                  </p>
                  {selected.detail && (
                    <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                      {selected.detail}
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
