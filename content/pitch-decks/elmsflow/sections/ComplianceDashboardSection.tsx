"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Bot,
  Send,
  X,
  Activity,
  Sparkles,
} from "lucide-react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";

/* ═══════════════════════════════════════════════════════════════
   ADAPTIVE FONT HELPERS
   ═══════════════════════════════════════════════════════════════ */
const F = {
  widgetTitle: "text-[10px] md:text-xs 2xl:text-sm font-mono text-white/45 uppercase tracking-wider",
  statLabel: "text-[9px] md:text-[10px] 2xl:text-xs text-white/35 font-mono uppercase",
  statValue: "text-sm md:text-lg 2xl:text-xl font-bold text-white",
  statChange: "text-[9px] md:text-[10px] 2xl:text-xs text-emerald-400/80 font-mono",
  barLabel: "text-[8px] md:text-[10px] 2xl:text-xs text-white/45",
  pieLabel: "text-[9px] md:text-[10px] 2xl:text-xs text-white/60",
  axisLabel: "fill-white/35 text-[8px] md:text-[10px] 2xl:text-xs",
  tooltip: "text-[9px] md:text-[10px] 2xl:text-xs",
  listDate: "text-[9px] md:text-[10px] 2xl:text-xs text-white/30 font-mono shrink-0 w-14 md:w-16",
  listText: "text-[9px] md:text-[10px] 2xl:text-xs text-white/70 leading-snug",
  riskCell: "text-[7px] md:text-[9px] 2xl:text-[10px] text-white/60 font-mono",
  coverageNum: "text-[9px] md:text-[10px] 2xl:text-xs text-white/50 font-mono",
};

/* ═══════════════════════════════════════════════════════════════
   BAR CHART — filled bars, hover shows detail number
   ═══════════════════════════════════════════════════════════════ */
function BarChartWidget({
  title,
  bars,
}: {
  title: string;
  bars: { label: string; value: number; color: string }[];
}) {
  const max = Math.max(...bars.map((b) => b.value));
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  return (
    <div className="rounded-lg border border-white/8 bg-white/3 p-2 md:p-3 2xl:p-4 relative">
      <div className={`${F.widgetTitle} mb-2`}>{title}</div>
      <div className="flex gap-1 md:gap-1.5 h-20 md:h-28 2xl:h-36">
        {bars.map((bar, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col justify-end items-center gap-0.5 relative cursor-pointer h-full"
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
          >
            {/* Hover tooltip */}
            <AnimatePresence>
              {hoverIdx === i && (
                <motion.div
                  className={`absolute -top-5 z-20 bg-black/85 border border-white/15 rounded px-1.5 py-0.5 ${F.tooltip} text-white whitespace-nowrap`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                >
                  <span className="font-bold">{bar.value}</span>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              className={`w-full rounded-t-sm transition-all ${hoverIdx === i ? "brightness-125" : ""}`}
              style={{
                backgroundColor: bar.color,
                boxShadow: hoverIdx === i ? `0 0 8px ${bar.color}40` : "none",
              }}
              initial={{ height: 0 }}
              animate={{ height: `${(bar.value / max) * 100}%` }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.7, ease: "easeOut" }}
            />
            <span className={`${F.barLabel} truncate w-full text-center leading-none`}>{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PIE CHART — hover highlights segment + legend interaction
   ═══════════════════════════════════════════════════════════════ */
function PieChartWidget({
  title,
  segments,
}: {
  title: string;
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const slices = useMemo(() => {
    const r = 42;
    const cx = 50;
    const cy = 50;
    let cumAngle = -90;
    return segments.map((seg) => {
      const angle = (seg.value / total) * 360;
      const startRad = (cumAngle * Math.PI) / 180;
      const endRad = ((cumAngle + angle) * Math.PI) / 180;
      const largeArc = angle > 180 ? 1 : 0;
      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);
      const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`;
      cumAngle += angle;
      return { d, color: seg.color };
    });
  }, [segments, total]);

  return (
    <div className="rounded-lg border border-white/8 bg-white/3 p-2 md:p-3 2xl:p-4">
      <div className={`${F.widgetTitle} mb-2`}>{title}</div>
      <div className="flex items-center gap-2 2xl:gap-4">
        <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-20 md:h-20 2xl:w-28 2xl:h-28 shrink-0">
          {slices.map((slice, i) => (
            <motion.path
              key={i}
              d={slice.d}
              fill={slice.color}
              className="cursor-pointer transition-all"
              style={{
                opacity: activeIdx !== null && activeIdx !== i ? 0.3 : 1,
                transform: activeIdx === i ? "scale(1.06)" : "scale(1)",
                transformOrigin: "50% 50%",
              }}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + i * 0.05, type: "spring" }}
            />
          ))}
          <circle cx="50" cy="50" r="22" fill="#0d1320" />
          {activeIdx !== null && (
            <text x="50" y="52" textAnchor="middle" className="fill-white text-[10px] font-bold" dominantBaseline="middle">
              {segments[activeIdx].value}%
            </text>
          )}
        </svg>
        <div className="flex flex-col gap-1 2xl:gap-1.5">
          {segments.map((seg, i) => (
            <div
              key={i}
              className={`flex items-center gap-1 cursor-pointer transition-opacity ${activeIdx !== null && activeIdx !== i ? "opacity-30" : "opacity-100"}`}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
            >
              <div className="w-2 h-2 2xl:w-2.5 2xl:h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
              <span className={F.pieLabel}>{seg.label} ({seg.value}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TREND CHART — line + failed-case bars, hover tooltip
   ═══════════════════════════════════════════════════════════════ */
function TrendChartWidget({
  title,
  points,
  failedCases,
  color,
}: {
  title: string;
  points: { label: string; value: number }[];
  failedCases: { label: string; value: number }[];
  color: string;
}) {
  const compMin = Math.min(...points.map((p) => p.value));
  const compMax = Math.max(...points.map((p) => p.value));
  const compRange = compMax - compMin || 1;
  const failMax = Math.max(...failedCases.map((f) => f.value), 1);
  const w = 200;
  const topPad = 20;
  const lineH = 44;
  const barZoneH = 30;
  const labelH = 12;
  const totalH = topPad + lineH + barZoneH + labelH;
  const barTopY = topPad + lineH + 3;
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const coords = points.map((p, i) => ({
    x: 10 + (i / (points.length - 1)) * (w - 20),
    y: topPad + 6 + (1 - (p.value - compMin) / compRange) * (lineH - 12),
  }));
  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
  const areaBottom = topPad + lineH;
  const areaPath = `${linePath} L${coords[coords.length - 1].x},${areaBottom} L${coords[0].x},${areaBottom} Z`;
  const barWidth = (w - 20) / points.length * 0.5;

  return (
    <div className="rounded-lg border border-white/8 bg-white/3 p-2 md:p-3 2xl:p-4 relative">
      <div className="flex items-center justify-between mb-1">
        <div className={F.widgetTitle}>{title}</div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[7px] md:text-[8px] 2xl:text-[10px] text-white/40">Compliance</span>
          </div>
          <div className="flex items-center gap-0.5">
            <div className="w-2 h-1.5 rounded-sm bg-rose-500/50" />
            <span className="text-[7px] md:text-[8px] 2xl:text-[10px] text-white/40">Failed</span>
          </div>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${totalH}`} className="w-full h-20 md:h-28 2xl:h-36">
        <defs>
          <linearGradient id="trendGrad2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Divider between compliance line and failed-case bars */}
        <line x1="10" y1={topPad + lineH + 1} x2={w - 10} y2={topPad + lineH + 1} stroke="rgba(255,255,255,0.06)" />
        {/* Failed-case bars — separate scale for visibility */}
        {failedCases.map((fc, i) => {
          const bx = coords[i]?.x ?? (10 + (i / (points.length - 1)) * (w - 20));
          const bh = (fc.value / failMax) * (barZoneH - 6);
          const by = barTopY + (barZoneH - 6) - bh;
          return (
            <g key={`bar-${i}`}>
              <motion.rect
                x={bx - barWidth / 2}
                y={by}
                width={barWidth}
                height={bh}
                rx={1.5}
                fill={hoverIdx === i ? "rgba(244,63,94,0.85)" : "rgba(244,63,94,0.6)"}
                className="cursor-pointer"
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.08, duration: 0.5 }}
              />
              <motion.text
                x={bx}
                y={by - 1.5}
                textAnchor="middle"
                className="fill-rose-400/80 text-[5px] md:text-[6px] font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 + i * 0.05 }}
              >
                {fc.value}
              </motion.text>
            </g>
          );
        })}

        <motion.path d={areaPath} fill="url(#trendGrad2)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }} />
        <motion.path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 1, ease: "easeOut" }} />

        {coords.map((c, i) => (
          <g key={i} className="cursor-pointer" onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
            <circle cx={c.x} cy={c.y} r="6" fill="transparent" />
            <motion.circle cx={c.x} cy={c.y} r={hoverIdx === i ? 4 : 3} fill={color} stroke="#0d1320" strokeWidth="1" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + i * 0.08 }} />
          </g>
        ))}

        {hoverIdx !== null && (() => {
          const tx = coords[hoverIdx].x;
          const ty = coords[hoverIdx].y;
          const above = ty > topPad + 18;
          const ry = above ? ty - 20 : ty + 8;
          const tty = above ? ty - 9 : ty + 19;
          return (
            <g>
              <rect x={tx - 32} y={ry} width="64" height="16" rx="3" fill="rgba(0,0,0,0.92)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
              <text x={tx} y={tty} textAnchor="middle" className="fill-white text-[7px] 2xl:text-[9px] font-mono">
                {points[hoverIdx].value}% / {failedCases[hoverIdx]?.value ?? 0} fail
              </text>
            </g>
          );
        })()}

        {points.map((p, i) => (
          <text key={i} x={coords[i].x} y={totalH - 1} textAnchor="middle" className="fill-white/35 text-[5.5px] md:text-[7px] 2xl:text-[8.5px]">
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RECENT COMPLIANCE ACTIVITY
   ═══════════════════════════════════════════════════════════════ */
const RECENT_EVENTS = [
  { date: "Apr 14", emoji: "🟢", text: "FreshMart GmbH — BRC Grade A renewed" },
  { date: "Apr 12", emoji: "📋", text: "NordLog AB — IFS Food v8 submitted" },
  { date: "Apr 10", emoji: "✅", text: "GreenChain Ltd — ISO 22000 certified" },
  { date: "Apr 08", emoji: "⚠️", text: "AquaFrost SRL — cold-chain CCP issue" },
  { date: "Apr 05", emoji: "🟢", text: "EuroHarvest — FSSC 22000 v6 passed" },
  { date: "Apr 03", emoji: "📋", text: "AlpineDairy — BRC S&D submitted" },
];

function RecentActivityWidget({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/3 p-2 md:p-3 2xl:p-4 flex flex-col">
      <div className={`${F.widgetTitle} mb-1.5`}>{title}</div>
      <div className="flex-1 space-y-1 max-h-24 md:max-h-32 2xl:max-h-44 overflow-y-auto pr-0.5">
        {RECENT_EVENTS.map((evt, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-1.5 py-0.5 border-b border-white/5 last:border-0 hover:bg-white/3 rounded px-0.5 transition-colors"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.06 }}
          >
            <span className={F.listDate}>{evt.date}</span>
            <span className="shrink-0 text-[10px]">{evt.emoji}</span>
            <span className={F.listText}>{evt.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STANDARDS COVERAGE
   ═══════════════════════════════════════════════════════════════ */
function StackedBarWidget({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: number; color: string }[];
}) {
  const total = items.reduce((s, it) => s + it.value, 0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  return (
    <div className="rounded-lg border border-white/8 bg-white/3 p-2 md:p-3 2xl:p-4">
      <div className={`${F.widgetTitle} mb-2`}>{title}</div>
      <div className="flex rounded-full overflow-hidden h-3 md:h-4 2xl:h-5 mb-2 relative">
        {items.map((it, i) => (
          <motion.div
            key={i}
            className={`h-full cursor-pointer transition-all ${hoverIdx === i ? "brightness-125 z-10" : ""}`}
            style={{
              backgroundColor: it.color,
              boxShadow: hoverIdx === i ? `0 0 8px ${it.color}60` : "none",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${(it.value / total) * 100}%` }}
            transition={{ delay: 0.6 + i * 0.1, duration: 0.7 }}
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
          />
        ))}
      </div>
      <div className="space-y-0.5">
        {items.map((it, i) => {
          const pct = ((it.value / total) * 100).toFixed(1);
          return (
            <motion.div
              key={i}
              className={`flex items-center gap-1.5 py-0.5 px-1 rounded transition-colors ${hoverIdx === i ? "bg-white/5" : ""}`}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.05 }}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: it.color }} />
              <span className={`${F.coverageNum} flex-1`}>{it.label}</span>
              <span className={`${F.coverageNum} font-semibold text-white/70`}>{it.value}</span>
              <span className={`${F.coverageNum} w-10 text-right`}>{pct}%</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RISK HEAT MAP — interactive with hover details
   ═══════════════════════════════════════════════════════════════ */
const RISK_LABELS = {
  rows: ["Storage", "Transport", "Process", "Document"],
  cols: ["BRC", "HACCP", "ISO", "IFS"],
};
const RISK_DETAILS = [
  "Storage × BRC: Low — temperature logs compliant",
  "Storage × HACCP: Low — CCP monitoring active",
  "Storage × ISO: Medium — gap in pest-control SOP",
  "Storage × IFS: High — shelf-life validation overdue",
  "Transport × BRC: Low — vehicle hygiene checks OK",
  "Transport × HACCP: Medium — GPS cold-chain alert",
  "Transport × ISO: Medium — route audit pending",
  "Transport × IFS: High — cross-dock delay risk",
  "Process × BRC: Medium — allergen line changeover",
  "Process × HACCP: High — CCP #3 drift detected",
  "Process × ISO: High — corrective action backlog",
  "Process × IFS: Critical — supplier audit expired",
  "Document × BRC: Low — all records digitized",
  "Document × HACCP: Medium — training certs expiring",
  "Document × ISO: High — management review overdue",
  "Document × IFS: Critical — CAPA closure delayed",
];

function RiskHeatmapWidget({
  title,
  cells,
}: {
  title: string;
  cells: { level: string; color: string }[];
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  return (
    <div className="rounded-lg border border-white/8 bg-white/3 p-2 md:p-3 2xl:p-4 flex flex-col relative">
      <div className={`${F.widgetTitle} mb-1.5`}>{title}</div>
      {/* Column headers */}
      <div className="grid grid-cols-[40px_repeat(4,1fr)] gap-0.5 mb-0.5">
        <div />
        {RISK_LABELS.cols.map((c, i) => (
          <div key={i} className="text-center text-[7px] md:text-[8px] 2xl:text-[10px] text-white/30 font-mono">{c}</div>
        ))}
      </div>
      {/* Grid */}
      {RISK_LABELS.rows.map((row, ri) => (
        <div key={ri} className="grid grid-cols-[40px_repeat(4,1fr)] gap-0.5 mb-0.5">
          <div className="text-[7px] md:text-[8px] 2xl:text-[10px] text-white/30 font-mono pr-0.5 flex items-center truncate">{row}</div>
          {[0, 1, 2, 3].map((ci) => {
            const idx = ri * 4 + ci;
            const cell = cells[idx];
            if (!cell) return <div key={ci} />;
            return (
              <motion.div
                key={ci}
                className={`rounded-sm h-5 md:h-7 2xl:h-9 flex items-center justify-center cursor-pointer transition-all ${hoverIdx === idx ? "ring-1 ring-white/40 brightness-125 scale-110" : ""}`}
                style={{ backgroundColor: cell.color }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + idx * 0.02 }}
                onMouseEnter={() => setHoverIdx(idx)}
                onMouseLeave={() => setHoverIdx(null)}
              >
                <span className={F.riskCell}>{cell.level}</span>
              </motion.div>
            );
          })}
        </div>
      ))}
      {/* Hover tooltip — positioned above the grid */}
      <AnimatePresence>
        {hoverIdx !== null && (
          <motion.div
            className={`absolute -top-1 left-2 right-2 bg-black/90 border border-white/15 rounded-md px-2 py-1 ${F.tooltip} text-white z-30 pointer-events-none`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
          >
            {RISK_DETAILS[hoverIdx] ?? ""}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AI CHAT MODAL — with typewriter effect on all AI messages
   ═══════════════════════════════════════════════════════════════ */
function TypewriterText({ text, speed = 18, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
        onDoneRef.current?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!done && (
        <motion.span
          className="inline-block w-0.5 h-3 bg-cyan-400 ml-0.5 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
    </span>
  );
}

function AIChatModal({
  open,
  onClose,
  messages: defaultMessages,
}: {
  open: boolean;
  onClose: () => void;
  messages: { role: "user" | "ai"; text: string }[];
}) {
  const [msgs, setMsgs] = useState(defaultMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  // Track which AI messages have finished typing so we don't re-animate them
  const [typedIdxs, setTypedIdxs] = useState<Set<number>>(new Set());
  // Track which AI message is currently typing (sequential reveal)
  const [currentTypingIdx, setCurrentTypingIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // When modal opens, reset and start sequential typewriter on initial AI messages
  useEffect(() => {
    if (open) {
      setMsgs(defaultMessages);
      setTypedIdxs(new Set());
      // Find first AI message to start typing
      const firstAiIdx = defaultMessages.findIndex((m) => m.role === "ai");
      setCurrentTypingIdx(firstAiIdx >= 0 ? firstAiIdx : null);
    }
  }, [open, defaultMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, currentTypingIdx]);

  const handleTypingDone = useCallback((idx: number) => {
    setTypedIdxs((prev) => new Set(prev).add(idx));
    // Find next AI message to type
    const nextAiIdx = msgs.findIndex((m, i) => i > idx && m.role === "ai");
    setCurrentTypingIdx(nextAiIdx >= 0 ? nextAiIdx : null);
  }, [msgs]);

  const handleSend = useCallback(() => {
    if (!input.trim() || typing) return;
    const userMsg = input.trim();
    setInput("");
    const newMsgs = [...msgs, { role: "user" as const, text: userMsg }];
    setMsgs(newMsgs);
    setTyping(true);
    setCurrentTypingIdx(null);

    setTimeout(() => {
      const aiReply = `Based on your compliance data, "${userMsg}" relates to BRC/ISO standards. Your current compliance score is 94.2%. I recommend reviewing the HACCP monitoring module for further optimization.`;
      const withReply = [...newMsgs, { role: "ai" as const, text: aiReply }];
      setMsgs(withReply);
      setCurrentTypingIdx(withReply.length - 1);
      setTyping(false);
    }, 1200);
  }, [input, typing, msgs]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#0d1320] overflow-hidden flex flex-col max-h-[80vh]"
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/8">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span className="text-sm font-bold text-slate-800 dark:text-white">AI Compliance Assistant</span>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                <X className="w-4 h-4 text-slate-400 dark:text-white/50" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-48">
              {msgs.map((m, i) => {
                const isAi = m.role === "ai";
                const isCurrentlyTyping = isAi && currentTypingIdx === i;
                const isAlreadyTyped = typedIdxs.has(i);
                // Sequential reveal: user msgs wait for all prior AI msgs to finish
                const shouldShow = isAi
                  ? (isAlreadyTyped || isCurrentlyTyping)
                  : (() => { for (let j = 0; j < i; j++) { if (msgs[j].role === "ai" && !typedIdxs.has(j)) return false; } return true; })();
                if (!shouldShow) return null;

                return (
                  <motion.div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03 }}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        m.role === "user"
                          ? "bg-cyan-50 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-100 border border-cyan-200 dark:border-cyan-500/20"
                          : "bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/80 border border-slate-200 dark:border-white/8"
                      }`}
                    >
                      {isAi && <Bot className="w-3 h-3 text-cyan-600 dark:text-cyan-400 inline mr-1.5 -mt-0.5" />}
                      {isAi && isCurrentlyTyping && !isAlreadyTyped ? (
                        <TypewriterText text={m.text} onDone={() => handleTypingDone(i)} />
                      ) : (
                        m.text
                      )}
                    </div>
                  </motion.div>
                );
              })}
              {typing && (
                <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/8 rounded-xl px-3 py-2 text-xs text-slate-500 dark:text-white/50">
                    <Bot className="w-3 h-3 text-cyan-600 dark:text-cyan-400 inline mr-1.5 -mt-0.5" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }}>
                      Analyzing compliance data...
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 dark:border-white/8 p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about compliance..."
                className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:border-cyan-500/40 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || typing}
                className="px-3 py-2 rounded-lg bg-cyan-50 dark:bg-cyan-500/20 border border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-500/30 transition-colors disabled:opacity-30"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BOUNCE KEYFRAMES (CSS for reliable bounce)
   ═══════════════════════════════════════════════════════════════ */
const bounceStyle = `
@keyframes gentleBounce {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-6px); }
  50% { transform: translateY(0); }
  75% { transform: translateY(-3px); }
}
`;

/* ═══════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════════════════ */
export function ComplianceDashboardSection() {
  const content = useContent();
  const c = content.slide16;
  const [chatOpen, setChatOpen] = useState(false);

  const failedCases = [
    { label: "Q1'25", value: 18 },
    { label: "Q2'25", value: 14 },
    { label: "Q3'25", value: 11 },
    { label: "Q4'25", value: 8 },
    { label: "Q1'26", value: 5 },
    { label: "Q2'26", value: 3 },
  ];

  return (
    <section
      className={`${SECTION} bg-[#f0f4f8] dark:bg-linear-to-b dark:from-[#0a0e15] dark:via-[#0d1320] dark:to-[#0a0e15]`}
    >
      {/* Inject bounce keyframes */}
      <style dangerouslySetInnerHTML={{ __html: bounceStyle }} />

      <div className="relative w-full flex flex-col items-center px-3 md:px-6 py-2 md:py-3 text-slate-800 dark:text-white">
        {/* Ambient glow */}
        <div className="absolute top-1/3 right-1/4 w-100 h-100 bg-cyan-600/4 blur-[120px] rounded-full pointer-events-none" />

        {/* Badge */}
        <motion.div
          className="ei-child inline-flex items-center gap-1.5 mb-1.5 md:mb-2 px-2.5 py-0.5 rounded-full border border-cyan-500/30 dark:border-cyan-500/25 bg-cyan-500/8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BarChart3 className="w-3 h-3 text-cyan-400" />
          <span className="text-[9px] md:text-xs font-mono tracking-[0.2em] uppercase text-cyan-400/90">
            {c.badge}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="ei-child text-xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold tracking-tight text-center mb-0.5 md:mb-1"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {c.title}
        </motion.h2>
        <motion.p
          className="ei-child text-[10px] md:text-sm text-slate-500 dark:text-white/50 text-center max-w-lg mb-2 md:mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {c.subtitle}
        </motion.p>

        {/* Dashboard mock browser */}
        <div className="ei-child w-full max-w-5xl 2xl:max-w-7xl shrink min-h-0">
          <motion.div
            className="rounded-xl border border-slate-200 dark:border-white/8 bg-[#0a0e15]/80 backdrop-blur-sm overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-180px)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            {/* Browser chrome */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-1 px-2.5 py-1.5 border-b border-white/5 bg-[#0a0e15]/95 backdrop-blur-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-rose-500/60" />
                <div className="w-2 h-2 rounded-full bg-amber-500/60" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                <span className="ml-2 text-[8px] md:text-[10px] text-white/25 font-mono">
                  compliance.elmsflow.com/dashboard
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="w-2.5 h-2.5 text-emerald-400" />
                <span className="text-[8px] md:text-[10px] text-emerald-400/70 font-mono">Live</span>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-1.5 md:p-2 lg:p-3 2xl:p-4">
              {/* Top stat cards */}
              <div className="grid grid-cols-4 gap-1.5 md:gap-2 mb-2">
                {c.topStats.map(
                  (st: { label: string; value: string; change: string }, i: number) => (
                    <motion.div
                      key={i}
                      className="rounded-lg bg-white/3 border border-white/6 p-1.5 md:p-2 2xl:p-3 hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                    >
                      <div className={F.statLabel}>{st.label}</div>
                      <div className={F.statValue}>{st.value}</div>
                      <div className={F.statChange}>{st.change}</div>
                    </motion.div>
                  ),
                )}
              </div>

              {/* Charts row 1 */}
              <div className="grid grid-cols-3 gap-1.5 md:gap-2 mb-2">
                <BarChartWidget title={c.charts.barChart.title} bars={c.charts.barChart.bars} />
                <PieChartWidget title={c.charts.pieChart.title} segments={c.charts.pieChart.segments} />
                <TrendChartWidget
                  title={c.charts.trendChart.title}
                  points={c.charts.trendChart.points}
                  failedCases={failedCases}
                  color="#06b6d4"
                />
              </div>

              {/* Charts row 2 */}
              <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                <RecentActivityWidget title="Recent Activity" />
                <StackedBarWidget title={c.charts.stackedBar.title} items={c.charts.stackedBar.items} />
                <RiskHeatmapWidget title={c.charts.riskMatrix.title} cells={c.charts.riskMatrix.cells} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Assistant FAB — CSS bounce for reliability */}
        <button
          className="ei-child absolute bottom-3 right-3 md:bottom-5 md:right-5 2xl:bottom-7 2xl:right-7 z-40 flex items-center gap-1.5 px-3 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 backdrop-blur-sm text-cyan-400 hover:bg-cyan-500/30 transition-all shadow-lg shadow-cyan-500/10 cursor-pointer"
          style={{ animation: "gentleBounce 3s ease-in-out 1.5s infinite" }}
          onClick={() => setChatOpen(true)}
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="text-[10px] md:text-xs font-medium">{c.aiButton}</span>
          <Sparkles className="w-2.5 h-2.5 text-cyan-400/60" />
        </button>

        {/* AI Chat Modal */}
        <AIChatModal
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          messages={c.chatMessages as { role: "user" | "ai"; text: string }[]}
        />
      </div>
    </section>
  );
}
