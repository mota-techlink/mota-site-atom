"use client";

import React from "react";
import { useContent } from "../hooks";

type AnyRecord = Record<string, any>;

// ─── Shared layout primitives ─────────────────────────────────────────────────
function SectionShell({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <section
      id={id}
      data-scrollable
      className="h-full w-full overflow-y-auto overscroll-contain scrollbar-none"
    >
      <div className="min-h-full w-full flex items-center justify-center px-6 sm:px-10 lg:px-16 pt-20 sm:pt-24 pb-20 lg:pb-16">
        <div className="w-full max-w-6xl mx-auto">{children}</div>
      </div>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] bg-emerald-500/10 border border-emerald-400/25 text-emerald-300 mb-5">
      {children}
    </span>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.15] text-white max-w-4xl mb-4 text-balance">
      {children}
    </h2>
  );
}

function Intro({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base sm:text-lg text-white/60 max-w-3xl leading-relaxed mb-10">
      {children}
    </p>
  );
}

function Icon({ children, size = "text-2xl" }: { children: React.ReactNode; size?: string }) {
  return <span className={`${size} leading-none`} aria-hidden="true">{children}</span>;
}

function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 backdrop-blur-sm transition-colors duration-300 hover:border-emerald-400/30 hover:bg-white/[0.06] ${className}`}
    >
      {children}
    </div>
  );
}

function Bullet({ icon, title, body }: { icon?: string; title: string; body: string }) {
  return (
    <div className="flex gap-4">
      {icon ? (
        <span className="shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-lg">
          <Icon>{icon}</Icon>
        </span>
      ) : (
        <span className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-emerald-400" />
      )}
      <div className="min-w-0">
        <h3 className="font-semibold text-white mb-1.5">{title}</h3>
        <p className="text-sm sm:text-[0.95rem] text-white/55 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function Footnote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-8 text-xs text-white/35 leading-relaxed max-w-3xl border-l-2 border-white/10 pl-4">
      {children}
    </p>
  );
}

// ─── 01 · Hero ────────────────────────────────────────────────────────────────
export function HeroSection() {
  const d = useContent().hero as AnyRecord;
  return (
    <SectionShell id="s-hero">
      <div className="relative">
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80 mb-6">
          {d.eyebrow}
        </p>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-white max-w-5xl mb-6 text-balance">
          {d.title}
        </h1>
        <p className="text-base sm:text-xl text-white/60 max-w-3xl leading-relaxed mb-12">
          {d.subtitle}
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {d.stats.map((s: AnyRecord) => (
            <Card key={s.label} className="!p-4 sm:!p-5">
              <div className="text-xl sm:text-2xl font-bold text-emerald-300 mb-1.5 break-words">
                {s.value}
              </div>
              <div className="text-[11px] sm:text-xs text-white/50 leading-snug">{s.label}</div>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="flex items-center gap-2 text-xs text-white/40">
            <span className="inline-block w-4 h-7 rounded-full border border-white/25 relative">
              <span className="absolute left-1/2 -translate-x-1/2 top-1.5 w-0.5 h-2 rounded-full bg-emerald-400 animate-bounce" />
            </span>
            {d.scroll}
          </span>
          <span className="text-xs text-white/35">{d.footer}</span>
        </div>
      </div>
    </SectionShell>
  );
}

// ─── 02 · Why Ireland ─────────────────────────────────────────────────────────
export function WhySection() {
  const d = useContent().why as AnyRecord;
  return (
    <SectionShell id="s-why">
      <Badge>{d.badge}</Badge>
      <Title>{d.title}</Title>
      <Intro>{d.intro}</Intro>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {d.points.map((p: AnyRecord) => (
          <Card key={p.title}>
            <Bullet icon={p.icon} title={p.title} body={p.body} />
          </Card>
        ))}
      </div>
      <Footnote>{d.footnote}</Footnote>
    </SectionShell>
  );
}

// ─── 03 · Market access ───────────────────────────────────────────────────────
export function PlatformSection() {
  const d = useContent().platform as AnyRecord;
  return (
    <SectionShell id="s-platform">
      <Badge>{d.badge}</Badge>
      <Title>{d.title}</Title>
      <Intro>{d.intro}</Intro>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {d.markets.map((m: AnyRecord) => (
          <Card key={m.name}>
            <Icon size="text-3xl">{m.icon}</Icon>
            <h3 className="font-semibold text-white mt-3 mb-2">{m.name}</h3>
            <p className="text-sm text-white/55 leading-relaxed">{m.body}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300/80 mb-5">
          {d.logistics.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {d.logistics.items.map((l: AnyRecord) => (
            <Bullet key={l.title} icon={l.icon} title={l.title} body={l.body} />
          ))}
        </div>
      </Card>
    </SectionShell>
  );
}

// ─── 04 · Tax & investment ────────────────────────────────────────────────────
export function TaxSection() {
  const d = useContent().tax as AnyRecord;
  return (
    <SectionShell id="s-tax">
      <Badge>{d.badge}</Badge>
      <Title>{d.title}</Title>
      <Intro>{d.intro}</Intro>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {d.cards.map((c: AnyRecord) => (
          <Card key={c.label} className="flex flex-col">
            <div className="text-xl sm:text-2xl font-bold text-emerald-300 mb-2 break-words">
              {c.value}
            </div>
            <div className="text-sm font-semibold text-white mb-2">{c.label}</div>
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{c.body}</p>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-sm text-white/60 leading-relaxed max-w-3xl">{d.footnote}</p>
      <Footnote>{d.disclaimer}</Footnote>
    </SectionShell>
  );
}

// ─── 05 · Waterford ───────────────────────────────────────────────────────────
export function WaterfordSection() {
  const d = useContent().waterford as AnyRecord;
  return (
    <SectionShell id="s-waterford">
      <Badge>{d.badge}</Badge>
      <Title>{d.title}</Title>
      <Intro>{d.intro}</Intro>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {d.points.map((p: AnyRecord) => (
          <Card key={p.title}>
            <Bullet icon={p.icon} title={p.title} body={p.body} />
          </Card>
        ))}
      </div>

      <Card className="!border-emerald-400/25 !bg-emerald-500/[0.07]">
        <h3 className="font-semibold text-emerald-200 mb-2">{d.highlight.title}</h3>
        <p className="text-sm sm:text-[0.95rem] text-white/65 leading-relaxed">
          {d.highlight.body}
        </p>
      </Card>
    </SectionShell>
  );
}

// ─── 06 · Priority sectors ────────────────────────────────────────────────────
export function SectorsSection() {
  const d = useContent().sectors as AnyRecord;
  return (
    <SectionShell id="s-sectors">
      <Badge>{d.badge}</Badge>
      <Title>{d.title}</Title>
      <Intro>{d.intro}</Intro>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {d.items.map((s: AnyRecord) => (
          <Card key={s.title}>
            <div className="flex items-start gap-4 mb-4">
              <Icon size="text-3xl">{s.icon}</Icon>
              <div>
                <h3 className="font-semibold text-white mb-1">{s.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{s.body}</p>
              </div>
            </div>
            <ul className="space-y-2 pl-1">
              {s.bullets.map((b: string) => (
                <li key={b} className="flex gap-3 text-xs sm:text-sm text-white/50 leading-relaxed">
                  <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}

// ─── Shared layout for the four sector deep-dives ────────────────────────────
function SectorDetail({
  id,
  data,
}: {
  id: string;
  data: AnyRecord;
}) {
  return (
    <SectionShell id={id}>
      <Badge>{data.badge}</Badge>
      <Title>{data.title}</Title>
      <Intro>{data.intro}</Intro>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.bullets.map((b: AnyRecord) => (
          <Card key={b.title}>
            <Bullet icon={b.icon} title={b.title} body={b.body} />
          </Card>
        ))}
      </div>

      {data.modes && (
        <Card className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300/80 mb-5">
            {data.modes.title}
          </h3>
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.modes.items.map((m: string, i: number) => (
              <li key={m} className="flex items-start gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center text-xs font-bold text-emerald-300">
                  {i + 1}
                </span>
                <span className="text-sm text-white/65 leading-relaxed pt-1">{m}</span>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {data.note && (
        <Card className="mt-6 !border-emerald-400/25 !bg-emerald-500/[0.07]">
          <p className="text-sm text-white/70 leading-relaxed">{data.note}</p>
        </Card>
      )}
    </SectionShell>
  );
}

export function FoodSection() {
  return <SectorDetail id="s-food" data={useContent().food as AnyRecord} />;
}

export function MedicalSection() {
  return <SectorDetail id="s-medical" data={useContent().medical as AnyRecord} />;
}

export function ColdSection() {
  return <SectorDetail id="s-cold" data={useContent().cold as AnyRecord} />;
}

export function ConstructionSection() {
  return <SectorDetail id="s-construction" data={useContent().construction as AnyRecord} />;
}

// ─── 11 · Proven path ─────────────────────────────────────────────────────────
export function CasesSection() {
  const d = useContent().cases as AnyRecord;
  return (
    <SectionShell id="s-cases">
      <Badge>{d.badge}</Badge>
      <Title>{d.title}</Title>
      <Intro>{d.intro}</Intro>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {d.cases.map((c: AnyRecord) => (
          <Card key={c.name}>
            <h3 className="font-semibold text-emerald-200 mb-2">{c.name}</h3>
            <p className="text-sm text-white/55 leading-relaxed">{c.body}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300/80 mb-5">
          {d.path.title}
        </h3>
        <ol className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {d.path.steps.map((s: string, i: number) => (
            <li key={s} className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center text-xs font-bold text-emerald-300">
                {i + 1}
              </span>
              <span className="text-sm text-white/65 leading-relaxed pt-1">{s}</span>
            </li>
          ))}
        </ol>
      </Card>

      <p className="mt-8 text-sm sm:text-base text-white/60 leading-relaxed max-w-3xl">
        {d.insight}
      </p>
    </SectionShell>
  );
}

// ─── 12 · Compliance ──────────────────────────────────────────────────────────
export function ComplianceSection() {
  const d = useContent().compliance as AnyRecord;
  return (
    <SectionShell id="s-compliance">
      <Badge>{d.badge}</Badge>
      <Title>{d.title}</Title>
      <Intro>{d.intro}</Intro>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {d.groups.map((g: AnyRecord) => (
          <Card key={g.title}>
            <div className="flex items-center gap-3 mb-5">
              <Icon>{g.icon}</Icon>
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-300/80">
                {g.title}
              </h3>
            </div>
            <div className="space-y-4">
              {g.items.map((it: AnyRecord) => (
                <div key={it.name}>
                  <div className="text-sm font-semibold text-white mb-1">{it.name}</div>
                  <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{it.body}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Footnote>{d.note}</Footnote>
    </SectionShell>
  );
}

// ─── 13 · Opportunity and risk ────────────────────────────────────────────────
export function RiskSection() {
  const d = useContent().risk as AnyRecord;
  return (
    <SectionShell id="s-risk">
      <Badge>{d.badge}</Badge>
      <Title>{d.title}</Title>
      <Intro>{d.intro}</Intro>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="!border-emerald-400/25">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-300 mb-5">
            ✓ {d.opportunity.title}
          </h3>
          <ul className="space-y-3">
            {d.opportunity.items.map((t: string) => (
              <li key={t} className="flex gap-3 text-sm text-white/65 leading-relaxed">
                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="!border-amber-400/25">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-300 mb-5">
            ! {d.challenges.title}
          </h3>
          <ul className="space-y-3">
            {d.challenges.items.map((t: string) => (
              <li key={t} className="flex gap-3 text-sm text-white/65 leading-relaxed">
                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6 !border-emerald-400/25 !bg-emerald-500/[0.07]">
        <p className="text-sm sm:text-base text-white/75 leading-relaxed">{d.conclusion}</p>
      </Card>
    </SectionShell>
  );
}

// ─── 14 · What ELMSFLOW does ──────────────────────────────────────────────────
export function ElmsflowSection() {
  const d = useContent().elmsflow as AnyRecord;
  return (
    <SectionShell id="s-elmsflow">
      <Badge>{d.badge}</Badge>
      <Title>{d.title}</Title>
      <Intro>{d.intro}</Intro>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8">
        {d.steps.map((s: string, i: number) => (
          <React.Fragment key={s}>
            <span className="px-3 py-1.5 rounded-full text-xs sm:text-sm bg-white/[0.06] border border-white/12 text-white/75">
              {s}
            </span>
            {i < d.steps.length - 1 && (
              <span className="text-emerald-400/60 text-sm" aria-hidden="true">
                →
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {d.pillars.map((p: AnyRecord) => (
          <Card key={p.title}>
            <Bullet icon={p.icon} title={p.title} body={p.body} />
          </Card>
        ))}
      </div>

      <Footnote>{d.note}</Footnote>
    </SectionShell>
  );
}

// ─── 15 · Call to action ──────────────────────────────────────────────────────
export function CtaSection() {
  const d = useContent().cta as AnyRecord;
  return (
    <SectionShell id="s-cta">
      <Badge>{d.badge}</Badge>
      <Title>{d.title}</Title>
      <Intro>{d.intro}</Intro>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {d.actions.map((a: AnyRecord, i: number) => (
          <Card key={a.title}>
            <div className="text-xs font-mono text-emerald-300/70 mb-3">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="font-semibold text-white mb-2">{a.title}</h3>
            <p className="text-sm text-white/55 leading-relaxed">{a.body}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
        <span className="text-base sm:text-lg font-semibold text-white">{d.contact}</span>
        <span className="text-xs text-white/35">motaiot.com</span>
      </div>

      <Footnote>{d.disclaimer}</Footnote>
    </SectionShell>
  );
}
