"use client";

import React from "react";
import { PAGE, PAGE_INNER, THEME } from "../constants";
import { useDeckTheme } from "../theme";
import { useContent } from "../hooks";

type AnyRecord = Record<string, any>;

function Frame({ badge, title, children }: { badge: string; title: string; children: React.ReactNode }) {
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";
  return <section className={PAGE}><div className={PAGE_INNER}>
    <span className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold tracking-widest mb-4 ${isDark ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400" : "bg-cyan-100 border border-cyan-400/30 text-cyan-700"}`}>{badge}</span>
    {title && <h2 className={`text-3xl sm:text-5xl font-bold ${t.heading} mb-3 max-w-5xl`}>{title}</h2>}
    {children}
  </div></section>;
}

function Card({ title, body, icon }: { title: string; body: string; icon?: string }) {
  const { theme } = useDeckTheme(); const t = THEME[theme];
  return <div className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5`}><h3 className={`text-lg font-semibold ${t.heading} mb-2`}>{icon ? `${icon} ` : ""}{title}</h3><p className={`text-sm ${t.body} leading-relaxed`}>{body}</p></div>;
}

function Metrics({ items = [] }: { items?: AnyRecord[] }) {
  const { theme } = useDeckTheme(); const t = THEME[theme];
  return <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 mb-7">{items.map((x: AnyRecord) => <div key={`${x.value}-${x.label}`} className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} px-4 py-4`}><div className="text-2xl mb-1">{x.icon}</div><div className={`text-xl sm:text-2xl font-bold ${t.heading}`}>{x.value}</div><div className={`text-xs ${t.muted} mt-1`}>{x.label}</div></div>)}</div>;
}

function Intro({ text }: { text?: string }) {
  const { theme } = useDeckTheme(); const t = THEME[theme];
  return text ? <p className={`text-base sm:text-lg ${t.body} max-w-4xl leading-relaxed mb-2`}>{text}</p> : null;
}

export function OverviewSection() {
  const d = useContent().overview as AnyRecord;
  return <Frame badge={d.badge} title={d.title}><figure className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-cyan-950/20 mb-4"><img src={d.image} alt={d.imageAlt} className="block w-full h-36 sm:h-44 object-cover object-center" /></figure><p className="text-xl sm:text-2xl text-slate-300 max-w-4xl leading-relaxed mb-4">{d.subtitle}</p><p className="text-base text-slate-400 max-w-4xl mb-2">{d.description}</p><Metrics items={d.metrics} /><div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{d.highlights.map((x: AnyRecord) => <Card key={x.label} icon={x.icon} title={x.label} body={x.desc} />)}</div><div className="mt-6 border-l-4 border-emerald-400 bg-emerald-400/10 rounded-r-xl p-4 text-emerald-100 text-sm">{d.note}</div></Frame>;
}

export function OpportunitySection() {
  const d = useContent().opportunity as AnyRecord;
  return <Frame badge={d.badge} title={d.title}><Intro text={d.intro} /><Metrics items={d.metrics} /><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">{d.cards.map((x: AnyRecord) => <Card key={x.title} icon={x.icon} title={x.title} body={x.body} />)}</div><div className="mt-7 border-l-4 border-cyan-400 bg-cyan-400/10 rounded-r-xl p-5 text-cyan-100 text-base">🌍 {d.callout}</div></Frame>;
}

export function ProcessSection() {
  const d = useContent().process as AnyRecord; const { theme } = useDeckTheme(); const t = THEME[theme];
  return <Frame badge={d.badge} title={d.title}><Intro text={d.intro} /><div className="flex flex-wrap gap-2 mt-7 mb-8">{d.steps.map((x: AnyRecord, i: number) => <React.Fragment key={x.n}><div className={`flex-1 min-w-[130px] rounded-xl ${t.cardBg} border ${t.cardBorder} p-4`}><div className="text-2xl">{x.icon}</div><div className="text-cyan-400 text-xs font-mono mt-2">{x.n}</div><div className={`font-semibold ${t.heading} mt-1`}>{x.title}</div><div className={`text-xs ${t.muted} mt-1`}>{x.body}</div></div>{i < d.steps.length - 1 && <div className="hidden lg:flex items-center text-cyan-400 text-2xl">›</div>}</React.Fragment>)}</div><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{d.cards.map((x: AnyRecord) => <Card key={x.title} icon={x.icon} title={x.title} body={x.body} />)}</div></Frame>;
}

export function CampusSection() {
  const d = useContent().campus as AnyRecord; const { theme } = useDeckTheme(); const t = THEME[theme];
  const list = (items: string[]) => <ul className={`space-y-2 text-sm ${t.body}`}>{items.map(x => <li key={x} className="flex gap-2"><span className="text-cyan-400">•</span><span>{x}</span></li>)}</ul>;
  return <Frame badge={d.badge} title={d.title}><Intro text={d.intro} /><Metrics items={d.metrics} /><div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2"><div className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-6`}><h3 className={`text-xl font-semibold ${t.heading} mb-4`}>🏭 {d.leftTitle}</h3>{list(d.left)}</div><div className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-6`}><h3 className={`text-xl font-semibold ${t.heading} mb-4`}>👥 {d.rightTitle}</h3>{list(d.right)}</div></div><p className={`text-xs ${t.muted} mt-6 max-w-4xl`}>📋 {d.note}</p></Frame>;
}

export function DeliverySection() {
  const d = useContent().delivery as AnyRecord; const { theme } = useDeckTheme(); const t = THEME[theme];
  return <Frame badge={d.badge} title={d.title}><Intro text={d.intro} /><Metrics items={d.metrics} /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">{d.phases.map((x: AnyRecord, i: number) => <div key={x.title} className={`border-t-4 ${i === 1 ? "border-emerald-400" : i === 2 ? "border-amber-400" : "border-cyan-400"} pt-4`}><div className="text-2xl mb-2">{x.icon}</div><h3 className={`font-semibold ${t.heading}`}>{x.title}</h3><p className={`text-sm ${t.body} leading-relaxed mt-2`}>{x.body}</p></div>)}</div><div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.8fr)] gap-5 mt-8 items-stretch"><figure className={`overflow-hidden rounded-2xl ${t.cardBg} border ${t.cardBorder} shadow-2xl shadow-cyan-950/20`}><img src={d.image} alt={d.imageAlt} className="block w-full h-full min-h-[210px] max-h-[300px] object-cover object-center" /></figure><div className="flex items-center"><Card title={d.cards[0].title} body={d.cards[0].body} icon={d.cards[0].icon} /></div></div></Frame>;
}

export function EmploymentSection() {
  const d = useContent().employment as AnyRecord; const { theme } = useDeckTheme(); const t = THEME[theme];
  return <Frame badge={d.badge} title={d.title}><Intro text={d.intro} /><Metrics items={d.metrics} /><div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2"><div className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-6`}><h3 className={`text-xl font-semibold ${t.heading} mb-3`}>👷 {d.jobsTitle}</h3><p className={`text-sm ${t.body} leading-relaxed mb-4`}>{d.jobsBody}</p><div className="flex flex-wrap gap-2">{d.jobs.map((x: string) => <span key={x} className={`px-2 py-1 rounded-full text-xs ${t.badgeBg} ${t.badgeText}`}>{x}</span>)}</div></div><div className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-6`}><h3 className={`text-xl font-semibold ${t.heading} mb-3`}>🏛️ {d.supportTitle}</h3><ul className={`space-y-2 text-sm ${t.body}`}>{d.support.map((x: string) => <li key={x}>✓ {x}</li>)}</ul></div></div><div className="mt-6 border-l-4 border-cyan-400 bg-cyan-400/10 rounded-r-xl p-4 text-cyan-100 text-xs">📊 {d.taxNote}</div><div className="mt-5 border-l-4 border-emerald-400 bg-emerald-400/10 rounded-r-xl p-5 text-emerald-100 text-sm">🤝 {d.callout}</div></Frame>;
}

export function CloseSection() {
  const d = useContent().close as AnyRecord; const { theme } = useDeckTheme(); const t = THEME[theme];
  return <Frame badge={d.badge} title={d.title}><figure className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-cyan-950/20 mb-5"><img src={d.image} alt={d.imageAlt} className="block w-full h-44 sm:h-56 object-cover object-center" /></figure><p className={`text-2xl sm:text-4xl font-semibold leading-tight ${t.heading} max-w-5xl mt-4`}>“{d.quote}”</p><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-9">{d.nextSteps.map((x: AnyRecord) => <Card key={x.title} icon={x.icon} title={x.title} body={x.body} />)}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-7"><Card title={d.leftTitle} body={d.leftBody} icon="📁" /><Card title={d.rightTitle} body={d.rightBody} icon="✅" /></div><p className={`text-xs ${t.muted} mt-7`}>📚 {d.source}</p></Frame>;
}
