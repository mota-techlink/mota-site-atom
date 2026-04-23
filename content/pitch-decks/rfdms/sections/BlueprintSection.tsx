"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "../hooks";
import { SECTION } from "../constants";

const ZONE_STYLES: Record<string, { border: string; bg: string; text: string; accent: string; dot: string }> = {
  cyan:   { border: "border-cyan-400/50",   bg: "bg-cyan-400/10",   text: "text-cyan-300",   accent: "bg-cyan-400/20",   dot: "bg-cyan-400" },
  emerald:{ border: "border-emerald-400/50", bg: "bg-emerald-400/10", text: "text-emerald-300", accent: "bg-emerald-400/20", dot: "bg-emerald-400" },
  violet: { border: "border-violet-400/50",  bg: "bg-violet-400/10",  text: "text-violet-300",  accent: "bg-violet-400/20",  dot: "bg-violet-400" },
  red:    { border: "border-red-400/50",     bg: "bg-red-400/10",     text: "text-red-300",     accent: "bg-red-400/20",     dot: "bg-red-400" },
  orange: { border: "border-orange-400/50",  bg: "bg-orange-400/10",  text: "text-orange-300",  accent: "bg-orange-400/20",  dot: "bg-orange-400" },
  amber:  { border: "border-amber-400/50",   bg: "bg-amber-400/10",   text: "text-amber-300",   accent: "bg-amber-400/20",   dot: "bg-amber-400" },
};

const ZONE_EMOJI: Record<string, string> = {
  "eccf-cfs":    "📦",
  "ftz":         "🏭",
  "rfdms":       "💻",
  "sf-express":  "🚀",
  "yun-express": "✈️",
  "uni-uni":     "🔄",
};

interface Zone {
  id: string;
  label: string;
  operator: string;
  color: string;
  description: string;
  features: string[];
}

function BlueprintFloorPlan({
  zones,
  selectedZone,
  onSelect,
}: {
  zones: Zone[];
  selectedZone: Zone | null;
  onSelect: (zone: Zone) => void;
}) {
  // Map zone ids to grid positions
  const LAYOUT = [
    { id: "eccf-cfs",   col: "col-span-2",            row: "row-span-1" },
    { id: "ftz",        col: "col-span-1",            row: "row-span-2" },
    { id: "rfdms",      col: "col-span-1",            row: "row-span-2" },
    { id: "sf-express", col: "col-span-1",            row: "row-span-1" },
    { id: "yun-express",col: "col-span-1",            row: "row-span-1" },
    { id: "uni-uni",    col: "col-span-2",            row: "row-span-1" },
  ];

  return (
    <div className="relative w-full h-full min-h-[260px]">
      {/* Blueprint grid background */}
      <div
        className="absolute inset-0 rounded-xl overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
          background: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(10,15,30,0.98) 100%)",
        }}
      />
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Building outline */}
      <div className="relative h-full grid grid-cols-3 grid-rows-3 gap-1.5 p-2 rounded-xl border border-cyan-400/20">
        {/* Building label */}
        <div className="absolute -top-3 left-4 bg-slate-900 px-2 text-[10px] font-bold text-cyan-400 tracking-widest uppercase">
          BUILDING 176 · RFD
        </div>

        {zones.map((zone, i) => {
          const layout = LAYOUT[i];
          const style = ZONE_STYLES[zone.color] ?? ZONE_STYLES.cyan;
          const isSelected = selectedZone?.id === zone.id;
          const emoji = ZONE_EMOJI[zone.id] ?? "🔹";

          return (
            <motion.button
              key={zone.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => onSelect(zone)}
              className={`
                relative rounded-lg border ${style.border} ${style.bg}
                flex flex-col items-start justify-between p-3
                cursor-pointer transition-all duration-200 text-left
                ${layout.col} ${layout.row}
                ${isSelected ? "ring-1 ring-white/20 scale-[1.02] shadow-lg" : "hover:scale-[1.01] hover:brightness-110"}
              `}
            >
              {/* Zone title with emoji */}
              <div className="w-full">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-base leading-none">{emoji}</span>
                  <span className={`text-xs font-bold uppercase tracking-wide ${style.text}`}>
                    {zone.label}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300 line-clamp-2 mb-1">
                  {zone.description}
                </p>
                {/* Show features for taller zones */}
                {(layout.row === "row-span-2") && zone.features.slice(0, 3).map((f, fi) => (
                  <div key={fi} className="flex items-start gap-1 mt-0.5">
                    <div className={`w-1 h-1 rounded-full mt-1 flex-shrink-0 ${style.dot}`} />
                    <span className="text-[10px] text-slate-400 leading-tight">{f}</span>
                  </div>
                ))}
              </div>
              {/* Operator */}
              <span className="text-[9px] text-slate-500 mt-1 self-end font-medium">{zone.operator}</span>

              {/* Selected overlay */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-lg border-2 border-white/20"
                  layoutId="zone-selector"
                />
              )}
            </motion.button>
          );
        })}

        {/* Central connector visual */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-px h-full absolute left-[33.33%] bg-cyan-400/5" />
          <div className="w-px h-full absolute left-[66.66%] bg-cyan-400/5" />
          <div className="h-px w-full absolute top-[33.33%] bg-cyan-400/5" />
          <div className="h-px w-full absolute top-[66.66%] bg-cyan-400/5" />
        </div>
      </div>
    </div>
  );
}

export function BlueprintSection() {
  const c = useContent();
  const slide = c.slide5;
  const zones: Zone[] = slide.zones ?? [];
  const [selectedZone, setSelectedZone] = useState<Zone | null>(zones[2] ?? null); // Default to RFDMS core

  const style = selectedZone ? (ZONE_STYLES[selectedZone.color] ?? ZONE_STYLES.cyan) : ZONE_STYLES.cyan;

  return (
    <section id="s-blueprint" className={SECTION}>
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-4 lg:mb-5">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block text-xs font-semibold tracking-widest text-cyan-400/80 uppercase mb-2"
          >
            {slide.badge}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
          >
            {slide.title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              {slide.titleHighlight}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-slate-400 mt-2 max-w-2xl mx-auto"
          >
            {slide.subtitle}
          </motion.p>
        </div>

        {/* Main layout */}
        <div className="flex gap-4 flex-1 min-h-0 max-h-[480px]">
          {/* Floor plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            <BlueprintFloorPlan
              zones={zones}
              selectedZone={selectedZone}
              onSelect={setSelectedZone}
            />
            <p className="text-center text-[10px] text-slate-600 mt-2">
              Click any zone to view details
            </p>
          </motion.div>

          {/* Zone detail panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="w-64 lg:w-72 flex-shrink-0 flex flex-col gap-3"
          >
            <AnimatePresence mode="wait">
              {selectedZone ? (
                <motion.div
                  key={selectedZone.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-xl border ${style.border} ${style.bg} p-4 flex-1`}
                >
                  {/* Zone header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                    <span className={`font-bold text-sm ${style.text} uppercase tracking-wider`}>
                      {selectedZone.label}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mb-3 font-medium">
                    Operated by: <span className="text-white">{selectedZone.operator}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {selectedZone.description}
                  </p>
                  {/* Features */}
                  <div className="space-y-1.5">
                    {selectedZone.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${style.dot}`} />
                        <span className="text-xs text-slate-400">{feat}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 flex-1 flex items-center justify-center"
                >
                  <p className="text-xs text-slate-600 text-center">
                    Select a zone from the floor plan
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Zone list summary */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/20 p-3">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                All Zones
              </p>
              <div className="space-y-1">
                {zones.map((zone) => {
                  const zs = ZONE_STYLES[zone.color] ?? ZONE_STYLES.cyan;
                  return (
                    <button
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className={`
                        w-full flex items-center gap-2 text-left px-2 py-1 rounded-lg
                        transition-all duration-150
                        ${selectedZone?.id === zone.id ? zs.accent + " " + zs.text : "hover:bg-slate-700/30 text-slate-400"}
                      `}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${zs.dot}`} />
                      <span className="text-[10px] font-medium truncate">{zone.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
