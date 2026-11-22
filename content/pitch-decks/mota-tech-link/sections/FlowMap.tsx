"use client";
import { useState } from "react";
import { flagSrc } from "./FlagText";

type Key = "na" | "uk" | "ie" | "cn" | "jp" | "th" | "sg" | "oc";

const NODE_FLAG: Record<Key, string> = { na: "us", uk: "gb", ie: "ie", cn: "cn", jp: "jp", th: "th", sg: "sg", oc: "au" };

const NODES: Record<Key, { x: number; y: number; anchor: "above" | "below" }> = {
  na: { x: 112, y: 128, anchor: "below" },
  uk: { x: 392, y: 104, anchor: "above" },
  ie: { x: 344, y: 166, anchor: "below" },
  cn: { x: 690, y: 178, anchor: "below" },
  jp: { x: 818, y: 146, anchor: "above" },
  th: { x: 648, y: 258, anchor: "below" },
  sg: { x: 706, y: 316, anchor: "below" },
  oc: { x: 846, y: 356, anchor: "below" },
};

const C = { elms: "#3fc7a8", video: "#ffbe72", vflux: "#c77dff", aura: "#ff9a3d" };

type Leg = { id: string; from: Key; to: Key; color: string; bend: number };

const LEGS: Leg[] = [
  /* ELMSFLOW: China to Ireland */
  { id: "elms", from: "cn", to: "ie", color: C.elms, bend: -96 },
  /* China–Japan AI matchmaking */
  { id: "video", from: "cn", to: "jp", color: C.video, bend: -40 },
  /* VFLUX: global venues settle through Singapore */
  { id: "v1", from: "na", to: "sg", color: C.vflux, bend: 74 },
  { id: "v2", from: "uk", to: "sg", color: C.vflux, bend: 84 },
  { id: "v3", from: "jp", to: "sg", color: C.vflux, bend: -46 },
  /* Auraight: patients flow into China and Japan */
  { id: "a1", from: "na", to: "cn", color: C.aura, bend: -58 },
  { id: "a2", from: "uk", to: "cn", color: C.aura, bend: -44 },
  { id: "a3", from: "ie", to: "jp", color: C.aura, bend: 62 },
  { id: "a4", from: "th", to: "cn", color: C.aura, bend: 34 },
  { id: "a5", from: "oc", to: "jp", color: C.aura, bend: 52 },
];

function curve(leg: Leg) {
  const a = NODES[leg.from];
  const b = NODES[leg.to];
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * leg.bend;
  const cy = my + (dx / len) * leg.bend;
  return `M${a.x} ${a.y}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x} ${b.y}`;
}

export function FlowMap({ labels }: { labels: { title: string; nodes: Record<Key, string> } }) {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className="mtl-flowmap">
      <svg viewBox="0 0 1000 420" role="img" aria-label={labels.title} preserveAspectRatio="xMidYMid meet">
        <defs>
          {Object.entries(C).map(([k, color]) => (
            <marker key={k} id={`fm-arr-${k}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
              <path d="M0 1L9 5L0 9z" fill={color} />
            </marker>
          ))}
          <radialGradient id="fm-glow">
            <stop offset="0" stopColor="#77e4df" stopOpacity=".55" />
            <stop offset="1" stopColor="#77e4df" stopOpacity="0" />
          </radialGradient>
        </defs>

        {LEGS.map((leg) => {
          const d = curve(leg);
          const colorKey = leg.color === C.elms ? "elms" : leg.color === C.video ? "video" : leg.color === C.vflux ? "vflux" : "aura";
          const on = hover === leg.id;
          return (
            <g key={leg.id} className={on ? "mtl-fm-leg is-on" : "mtl-fm-leg"} onMouseEnter={() => setHover(leg.id)} onMouseLeave={() => setHover(null)}>
              <path id={`fm-p-${leg.id}`} d={d} fill="none" stroke={leg.color} strokeWidth={on ? 3 : 1.6} strokeOpacity={on ? 0.45 : 0.24} strokeLinecap="round" />
              <path d={d} fill="none" stroke={leg.color} strokeWidth={on ? 3.6 : 2.6} strokeLinecap="round" strokeDasharray="7 11" className="mtl-fm-line" markerEnd={`url(#fm-arr-${colorKey})`} style={{ opacity: hover && !on ? 0.35 : 1 }} />
              <circle r="3.6" fill={leg.color} className="mtl-fm-runner">
                <animateMotion dur="3.4s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                  <mpath href={`#fm-p-${leg.id}`} />
                </animateMotion>
              </circle>
            </g>
          );
        })}

        {(Object.keys(NODES) as Key[]).map((k) => {
          const n = NODES[k];
          const isHub = k === "cn" || k === "jp" || k === "sg" || k === "ie";
          return (
            <g key={k} className={isHub ? "mtl-fm-node is-hub" : "mtl-fm-node"}>
              {isHub ? <circle cx={n.x} cy={n.y} r="22" fill="url(#fm-glow)" /> : null}
              <circle cx={n.x} cy={n.y} r={isHub ? 5.4 : 4.2} className="mtl-fm-dot" />
              <image href={flagSrc(NODE_FLAG[k])} x={n.x - 10} y={(n.anchor === "above" ? n.y - 13 : n.y + 22) - 15} width={20} height={13} opacity={0.95} />
              <text x={n.x} y={n.anchor === "above" ? n.y - 3 : n.y + 34} textAnchor="middle" className={isHub ? "mtl-fm-label is-hub" : "mtl-fm-label"}>
                {labels.nodes[k]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export const FLOW_LEGEND_COLORS = C;
