"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "../hooks";
import { SECTION } from "../constants";

const ROUTE_STYLES: Record<string, { border: string; bg: string; text: string; dot: string; line: string }> = {
  uk:       { border: "border-blue-400/50",    bg: "bg-blue-400/10",    text: "text-blue-300",    dot: "bg-blue-400",    line: "#60a5fa" },
  eu:       { border: "border-indigo-400/50",  bg: "bg-indigo-400/10",  text: "text-indigo-300",  dot: "bg-indigo-400",  line: "#818cf8" },
  gcc:      { border: "border-amber-400/50",   bg: "bg-amber-400/10",   text: "text-amber-300",   dot: "bg-amber-400",   line: "#fbbf24" },
  "se-asia":{ border: "border-emerald-400/50", bg: "bg-emerald-400/10", text: "text-emerald-300", dot: "bg-emerald-400", line: "#34d399" },
  china:    { border: "border-red-400/50",     bg: "bg-red-400/10",     text: "text-red-300",     dot: "bg-red-400",     line: "#f87171" },
};

// ViewBox 0 0 800 400, Plate Carrée projection
// x = (lon + 180) / 360 * 800
// y = (90 - lat) / 180 * 400
function WorldMapSVG({
  routes,
  selectedRoute,
  onSelect,
}: {
  routes: { id: string; from: string; to: string; type: string }[];
  selectedRoute: string | null;
  onSelect: (id: string) => void;
}) {
  const NODES: Record<string, [number, number]> = {
    rfd:       [201, 107],  // Rockford IL  lon=-89 lat=42
    uk:        [397,  89],  // London       lon=-2  lat=51
    eu:        [422,  89],  // Frankfurt    lon=9   lat=50
    gcc:       [523, 144],  // Dubai        lon=55  lat=25
    "se-asia": [631, 197],  // Singapore    lon=104 lat=1
    china:     [669, 131],  // Shanghai     lon=122 lat=31
  };
  const RFD = NODES.rfd;
  const routeNodes: { id: string; target: [number, number]; color: string; label: string }[] = [
    { id: "uk",       target: NODES.uk,         color: "#60a5fa", label: "UK"   },
    { id: "eu",       target: NODES.eu,         color: "#818cf8", label: "EU"   },
    { id: "gcc",      target: NODES.gcc,        color: "#fbbf24", label: "GCC"  },
    { id: "se-asia",  target: NODES["se-asia"], color: "#34d399", label: "APAC" },
    { id: "china",    target: NODES.china,      color: "#f87171", label: "CN"   },
  ];

  return (
    <svg viewBox="0 0 800 400" className="w-full h-full" style={{ display: "block" }}>
      {/* Ocean */}
      <rect width="800" height="400" fill="rgba(6,16,35,0.98)" />

      {/* Graticule */}
      <g stroke="rgba(34,211,238,0.06)" strokeWidth="0.5">
        {[0,45,90,135,180,225,270,315,360].map(x => (
          <line key={`v${x}`} x1={x*800/360} y1={0} x2={x*800/360} y2={400} />
        ))}
        {[0,30,60,90,120,150,180].map(d => (
          <line key={`h${d}`} x1={0} y1={d*400/180} x2={800} y2={d*400/180} />
        ))}
        <line x1={0} y1={200} x2={800} y2={200} stroke="rgba(34,211,238,0.12)" strokeWidth="0.8" />
        <line x1={0} y1={166} x2={800} y2={166} stroke="rgba(251,191,36,0.05)" strokeDasharray="3 5" />
        <line x1={0} y1={233} x2={800} y2={233} stroke="rgba(251,191,36,0.05)" strokeDasharray="3 5" />
      </g>

      {/* Continents */}
      <g fill="rgba(80,105,148,0.22)" stroke="rgba(148,163,184,0.28)" strokeWidth="0.7" strokeLinejoin="round">
        {/* North America main */}
        <polygon points="35,33 88,33 100,50 130,68 132,122 144,133 178,150 200,167 218,178 220,144 228,132 236,116 246,100 262,96 280,89 278,78 255,62 230,44 170,33 35,33" />
        {/* Mexico tongue */}
        <polygon points="132,122 145,133 148,155 136,165 124,150 132,122" />
        {/* Florida */}
        <polygon points="222,144 228,150 222,163 215,155 222,144" />
        {/* Greenland */}
        <polygon points="282,22 312,16 322,28 310,40 290,43 268,38 265,28 282,22" />
        {/* Cuba */}
        <polygon points="210,160 220,158 224,163 214,167 210,160" />

        {/* South America */}
        <polygon points="222,178 218,200 217,215 222,244 232,278 238,300 244,318 268,290 285,280 300,255 320,220 300,196 275,178 255,178 222,178" />

        {/* Europe */}
        <polygon points="376,33 420,33 458,50 464,60 444,72 422,78 398,89 386,116 416,116 434,116 450,117 484,100 468,93 440,89 420,89 398,89 384,72 376,82 376,33" />
        {/* UK */}
        <polygon points="380,72 392,67 396,75 388,83 380,78 380,72" />
        {/* Ireland */}
        <polygon points="373,78 380,74 378,85 371,83 373,78" />
        {/* Scandinavia */}
        <polygon points="419,33 456,50 460,60 442,72 428,60 418,55 419,33" />
        {/* Iceland */}
        <polygon points="340,44 358,38 362,50 348,55 336,50 340,44" />

        {/* Africa */}
        <polygon points="378,118 484,116 480,133 514,175 493,204 478,244 440,278 420,278 400,244 418,200 418,178 360,167 388,122 378,118" />
        {/* Madagascar */}
        <polygon points="490,222 500,229 495,248 483,242 490,222" />

        {/* Russia / Siberia */}
        <polygon points="464,60 524,50 562,44 622,33 692,33 758,55 762,62 740,68 700,72 660,60 620,55 578,55 540,60 500,68 464,60" />

        {/* Asia main */}
        <polygon points="484,100 544,100 562,78 600,67 642,60 692,55 758,78 762,85 740,95 720,100 700,110 680,116 660,122 640,111 624,122 622,167 600,178 578,182 556,167 540,155 534,144 500,133 484,116 484,100" />
        {/* Indian subcontinent */}
        <polygon points="556,133 582,155 578,182 560,200 544,185 540,155 556,133" />
        {/* Arabian peninsula */}
        <polygon points="484,116 516,116 532,133 526,155 508,167 490,155 484,133 484,116" />
        {/* SE Asia / Indochina */}
        <polygon points="622,155 640,145 650,155 646,178 634,197 620,185 610,167 622,155" />
        {/* Japan */}
        <polygon points="700,122 716,116 722,128 708,136 700,128 700,122" />
        {/* Taiwan */}
        <polygon points="667,152 673,147 677,155 670,160 667,152" />
        {/* Sri Lanka */}
        <polygon points="578,185 584,190 580,197 574,192 578,185" />

        {/* Australia */}
        <polygon points="622,268 660,255 714,260 734,278 734,300 716,316 690,316 660,312 635,296 618,278 622,268" />
        {/* New Zealand */}
        <polygon points="757,310 764,304 768,316 759,320 757,310" />
      </g>

      {/* Route arcs */}
      {routeNodes.map(({ id, target, color }) => {
        const isSelected = selectedRoute === id;
        const [x1, y1] = RFD;
        const [x2, y2] = target;
        const cx = (x1 + x2) / 2;
        const cy = Math.min(y1, y2) - 55;
        return (
          <motion.path
            key={id}
            d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
            fill="none"
            stroke={color}
            strokeWidth={isSelected ? 2.5 : 1.2}
            strokeDasharray={isSelected ? "none" : "5 4"}
            opacity={isSelected ? 0.95 : 0.28}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: isSelected ? 0.95 : 0.28 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(id)}
          />
        );
      })}

      {/* Animated travel dot on selected route */}
      {routeNodes.map(({ id, target, color }) => {
        if (selectedRoute !== id) return null;
        const [x1, y1] = RFD;
        const [x2, y2] = target;
        const cx = (x1 + x2) / 2;
        const cy = Math.min(y1, y2) - 55;
        return (
          <circle key={`dot-${id}`} r={4} fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
            <animateMotion dur="2.8s" repeatCount="indefinite"
              path={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`} />
          </circle>
        );
      })}

      {/* Destination nodes */}
      {routeNodes.map(({ id, target, color, label }) => {
        const isSelected = selectedRoute === id;
        return (
          <g key={id} onClick={() => onSelect(id)} style={{ cursor: "pointer" }}>
            {isSelected && (
              <motion.circle cx={target[0]} cy={target[1]} r={14} fill={color} opacity={0.15}
                animate={{ r: [14, 20, 14] }} transition={{ repeat: Infinity, duration: 2 }} />
            )}
            <circle cx={target[0]} cy={target[1]} r={isSelected ? 6 : 4}
              fill={color} opacity={isSelected ? 1 : 0.65}
              style={{ filter: isSelected ? `drop-shadow(0 0 8px ${color})` : "none" }} />
            <text x={target[0] + 9} y={target[1] - 5} fontSize="8" fill={color}
              opacity={isSelected ? 1 : 0.5} fontWeight={isSelected ? "700" : "400"}
              fontFamily="monospace" style={{ userSelect: "none" as const }}>
              {label}
            </text>
          </g>
        );
      })}

      {/* RFD hub ring */}
      <motion.circle cx={RFD[0]} cy={RFD[1]} r={20} fill="rgba(34,211,238,0.06)"
        stroke="rgba(34,211,238,0.3)" strokeWidth={1.2}
        animate={{ r: [20, 27, 20] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} />
      <circle cx={RFD[0]} cy={RFD[1]} r={8} fill="rgba(34,211,238,0.2)" stroke="#22d3ee" strokeWidth={1.5} />
      <circle cx={RFD[0]} cy={RFD[1]} r={4} fill="#22d3ee" />
      <text x={RFD[0]} y={RFD[1]+19} textAnchor="middle" fontSize="9" fill="#22d3ee"
        fontWeight="800" fontFamily="monospace" style={{ userSelect: "none" as const }}>RFD</text>
      <text x={RFD[0]} y={RFD[1]+29} textAnchor="middle" fontSize="6" fill="rgba(34,211,238,0.45)"
        fontFamily="monospace" style={{ userSelect: "none" as const }}>ROCKFORD IL</text>

      {/* Edge labels */}
      <text x="6"   y="396" fontSize="6.5" fill="rgba(148,163,184,0.25)" fontFamily="monospace">180°W</text>
      <text x="390" y="396" fontSize="6.5" fill="rgba(148,163,184,0.25)" fontFamily="monospace">0°</text>
      <text x="775" y="396" fontSize="6.5" fill="rgba(148,163,184,0.25)" fontFamily="monospace">180°E</text>
    </svg>
  );
}

interface Route {
  id?: string;
  from: string;
  to: string;
  agent: string;
  type: string;
  description: string;
  volume: string;
}

export function GlobalReachSection() {
  const c = useContent();
  const slide = c.slide6;
  const routes: Route[] = (slide.routes ?? []).map((r: Route, i: number) => ({
    ...r,
    id: ["uk", "eu", "gcc", "se-asia", "china"][i] ?? `route-${i}`,
  }));
  const stats = slide.globalStats ?? [];
  const [selectedId, setSelectedId] = useState<string>(routes[0]?.id ?? "");

  const selectedRoute = routes.find((r) => r.id === selectedId) ?? null;
  const selectedStyle = selectedRoute ? (ROUTE_STYLES[selectedRoute.id ?? ""] ?? ROUTE_STYLES.uk) : ROUTE_STYLES.uk;

  return (
    <section id="s-global-reach" className={SECTION}>
      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-3">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-block text-xs font-semibold tracking-widest text-cyan-400/80 uppercase mb-1.5">
            {slide.badge}
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            {slide.title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              {slide.titleHighlight}
            </span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="text-sm text-slate-400 mt-1 max-w-2xl mx-auto">
            {slide.subtitle}
          </motion.p>
        </div>

        {/* Main layout */}
        <div className="flex gap-4 flex-1 min-h-0 max-h-[500px]">

          {/* Map — takes ~70% */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }} className="flex-[3] flex flex-col min-w-0">

            <div className="flex-1 rounded-xl border border-cyan-400/15 overflow-hidden">
              <WorldMapSVG
                routes={routes.map((r) => ({ id: r.id ?? "", from: r.from, to: r.to, type: r.type }))}
                selectedRoute={selectedId}
                onSelect={setSelectedId}
              />
            </div>

            {/* DDP banner moved below map */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
              className="mt-2 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-2.5 flex items-start gap-2 min-w-0 overflow-hidden">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
              <div className="min-w-0">
                <p className="text-[11px] leading-relaxed whitespace-normal break-words">
                  <span className="font-semibold text-emerald-300">{slide.ddpLabel}: </span>
                  <span
                    className="font-medium bg-clip-text text-transparent"
                    style={{
                      backgroundImage: "linear-gradient(90deg, #34d399, #60a5fa, #a78bfa, #f472b6, #fbbf24, #34d399)",
                      backgroundSize: "300% 100%",
                      animation: "ddpScroll 6s linear infinite",
                    }}
                  >
                    {slide.ddpDescription}
                  </span>
                  <style>{`
                    @keyframes ddpScroll {
                      0%   { background-position: 0% 50%; }
                      100% { background-position: 300% 50%; }
                    }
                  `}</style>
                </p>
              </div>
            </motion.div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mt-2 min-w-0">
              {stats.map((stat: { value: string; label: string }, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="rounded-lg border border-slate-700/50 bg-slate-800/30 px-2 py-2 text-center min-w-0">
                  <div className="text-sm font-bold text-cyan-400">{stat.value}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5 leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Route panel */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }} className="w-56 flex-shrink-0 flex flex-col gap-2">

            <div className="rounded-xl border border-slate-700/50 bg-slate-800/20 p-2 space-y-1">
              {routes.map((route) => {
                const rs = ROUTE_STYLES[route.id ?? ""] ?? ROUTE_STYLES.uk;
                const isActive = selectedId === route.id;
                return (
                  <button key={route.id} onClick={() => setSelectedId(route.id ?? "")}
                    className={`w-full flex items-center gap-2 text-left px-2.5 py-2 rounded-lg transition-all duration-150
                      ${isActive ? rs.bg + " " + rs.border + " border" : "hover:bg-slate-700/30 border border-transparent"}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${rs.dot}`} />
                    <div className="min-w-0 flex-1">
                      <div className={`text-xs font-semibold truncate ${isActive ? rs.text : "text-slate-300"}`}>
                        {route.from} → {route.to}
                      </div>
                      <div className="text-[9px] text-slate-500 truncate">{route.agent}</div>
                    </div>
                    <div className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold flex-shrink-0 ${isActive ? rs.text + " " + rs.bg : "text-slate-600"}`}>
                      {route.type}
                    </div>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {selectedRoute && (
                <motion.div key={selectedRoute.id} initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className={`flex-1 rounded-xl border ${selectedStyle.border} ${selectedStyle.bg} p-3`}>
                  <div className={`text-xs font-bold ${selectedStyle.text} mb-2 uppercase tracking-wide`}>
                    {selectedRoute.from} → {selectedRoute.to}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{selectedRoute.description}</p>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] text-slate-500 w-12 flex-shrink-0">Agent</span>
                      <span className="text-[10px] text-white leading-tight">{selectedRoute.agent}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 w-12 flex-shrink-0">Type</span>
                      <span className={`text-[10px] font-semibold ${selectedStyle.text} uppercase`}>{selectedRoute.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 w-12 flex-shrink-0">Volume</span>
                      <span className="text-[10px] text-emerald-300 font-semibold">{selectedRoute.volume}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
