"use client";

import React from "react";
import { PAGE, PAGE_INNER, THEME } from "../constants";
import { useDeckTheme } from "../theme";
import { useContent } from "../hooks";

function Frame({ badge, title, children }: { badge: string; title: string; children: React.ReactNode }) {
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";
  return <section className={PAGE}><div className={PAGE_INNER}>
    <span className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold tracking-widest mb-4 ${isDark ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400" : "bg-cyan-100 border border-cyan-400/30 text-cyan-700"}`}>{badge}</span>
    <h2 className={`text-3xl sm:text-5xl font-bold ${t.heading} mb-3 max-w-5xl`}>{title}</h2>
    {children}
  </div></section>;
}

function Card({ title, body, icon }: { title: string; body: string; icon?: string }) {
  const { theme } = useDeckTheme(); const t = THEME[theme];
  return <div className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5`}><h3 className={`text-lg font-semibold ${t.heading} mb-2`}>{icon ? `${icon} ` : ""}{title}</h3><p className={`text-sm ${t.body} leading-relaxed`}>{body}</p></div>;
}

export function OverviewSection() {
  const d = useContent().overview as any;
  return <Frame badge={d.badge} title={d.title}><p className="text-xl sm:text-2xl text-slate-300 max-w-4xl leading-relaxed mb-4">{d.subtitle}</p><p className="text-base text-slate-400 max-w-3xl mb-8">{d.description}</p><div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{d.highlights.map((x: any) => <Card key={x.label} icon={x.icon} title={x.label} body={x.desc} />)}</div><div className="mt-6 border-l-4 border-emerald-400 bg-emerald-400/10 rounded-r-xl p-4 text-emerald-100 text-sm">{d.note}</div></Frame>;
}

export function OpportunitySection() {
  const d = useContent().opportunity as any;
  return <Frame badge={d.badge} title={d.title}><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-7">{d.cards.map((x: any) => <Card key={x.title} title={x.title} body={x.body} />)}</div><div className="mt-7 border-l-4 border-cyan-400 bg-cyan-400/10 rounded-r-xl p-5 text-cyan-100 text-base">{d.callout}</div></Frame>;
}

export function ProcessSection() {
  const d = useContent().process as any; const { theme } = useDeckTheme(); const t = THEME[theme];
  return <Frame badge={d.badge} title={d.title}><div className="flex flex-wrap gap-2 mt-8 mb-8">{d.steps.map((x: any, i: number) => <React.Fragment key={x.n}><div className={`flex-1 min-w-[130px] rounded-xl ${t.cardBg} border ${t.cardBorder} p-4`}><div className="text-cyan-400 text-xs font-mono">{x.n}</div><div className={`font-semibold ${t.heading} mt-2`}>{x.title}</div><div className={`text-xs ${t.muted} mt-1`}>{x.body}</div></div>{i < d.steps.length - 1 && <div className="hidden lg:flex items-center text-cyan-400 text-2xl">›</div>}</React.Fragment>)}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{d.cards.map((x: any) => <Card key={x.title} title={x.title} body={x.body} />)}</div></Frame>;
}

export function CampusSection() {
  const d = useContent().campus as any; const { theme } = useDeckTheme(); const t = THEME[theme];
  const list = (items: string[]) => <ul className={`space-y-2 text-sm ${t.body}`}>{items.map(x => <li key={x} className="flex gap-2"><span className="text-cyan-400">•</span>{x}</li>)}</ul>;
  return <Frame badge={d.badge} title={d.title}><div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-7"><div className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-6`}><h3 className={`text-xl font-semibold ${t.heading} mb-4`}>{d.leftTitle}</h3>{list(d.left)}</div><div className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-6`}><h3 className={`text-xl font-semibold ${t.heading} mb-4`}>{d.rightTitle}</h3>{list(d.right)}</div></div><p className={`text-xs ${t.muted} mt-6 max-w-4xl`}>{d.note}</p></Frame>;
}

export function DeliverySection() {
  const d = useContent().delivery as any; const { theme } = useDeckTheme(); const t = THEME[theme];
  return <Frame badge={d.badge} title={d.title}><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7">{d.phases.map((x: any, i: number) => <div key={x.title} className={`border-t-4 ${i === 1 ? "border-emerald-400" : i === 2 ? "border-amber-400" : "border-cyan-400"} pt-4`}><h3 className={`font-semibold ${t.heading}`}>{x.title}</h3><p className={`text-sm ${t.body} leading-relaxed mt-2`}>{x.body}</p></div>)}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">{d.cards.map((x: any) => <Card key={x.title} title={x.title} body={x.body} />)}</div></Frame>;
}

export function EmploymentSection() {
  const d = useContent().employment as any; const { theme } = useDeckTheme(); const t = THEME[theme];
  return <Frame badge={d.badge} title={d.title}><div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-7"><div className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-6`}><h3 className={`text-xl font-semibold ${t.heading} mb-3`}>{d.jobsTitle}</h3><p className={`text-sm ${t.body} leading-relaxed mb-4`}>{d.jobsBody}</p><div className="flex flex-wrap gap-2">{d.jobs.map((x: string) => <span key={x} className={`px-2 py-1 rounded-full text-xs ${t.badgeBg} ${t.badgeText}`}>{x}</span>)}</div></div><div className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-6`}><h3 className={`text-xl font-semibold ${t.heading} mb-3`}>{d.supportTitle}</h3><ul className={`space-y-2 text-sm ${t.body}`}>{d.support.map((x: string) => <li key={x}>✓ {x}</li>)}</ul></div></div><div className="mt-7 border-l-4 border-emerald-400 bg-emerald-400/10 rounded-r-xl p-5 text-emerald-100 text-sm">{d.callout}</div></Frame>;
}

export function CloseSection() {
  const d = useContent().close as any; const { theme } = useDeckTheme(); const t = THEME[theme];
  return <Frame badge={d.badge} title=""><p className={`text-2xl sm:text-4xl font-semibold leading-tight ${t.heading} max-w-5xl mt-7`}>“{d.quote}”</p><div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10"><Card title={d.leftTitle} body={d.leftBody} /><Card title={d.rightTitle} body={d.rightBody} /></div><p className={`text-xs ${t.muted} mt-7`}>{d.source}</p></Frame>;
}
