"use client";
import { useState } from "react";
import Image from "next/image";
import { useDeckLocale } from "@/components/pitch-deck";
import { useNav } from "../hooks";
import { Avatar } from "./Avatar";
import { FlowMap, FLOW_LEGEND_COLORS } from "./FlowMap";
import { PersonModal, type Person } from "./PersonModal";
import { OfficialModal, type Official } from "./OfficialModal";
import en from "../i18n/en.json";
import zh from "../i18n/zh.json";
import ja from "../i18n/ja.json";
import es from "../i18n/es.json";

type Deck = typeof en;
const DECKS: Record<string, Deck> = { en, zh, ja, es };

type ProjectCard = { key: string; page: number; name: string; logo?: string; logoLight?: string; wordmark?: string };
const PROJECTS: ProjectCard[] = [
  { key: "elms", page: 2, name: "ELMSFLOW", logo: "/images/pitch-deck/elmsflow-logo.png" },
  { key: "aura", page: 3, name: "Auraight", logo: "/images/pitch-deck/auraight-icon-dark.svg", logoLight: "/images/pitch-deck/auraight-icon-light.svg" },
  { key: "vflux", page: 4, name: "VFlux", logo: "/images/pitch-deck/vflux-logo.png" },
  { key: "video", page: 5, name: "吉晟 YOSHI SEI", logo: "/images/pitch-deck/yoshisei-logo-dark.svg", logoLight: "/images/pitch-deck/yoshisei-logo-light.svg" },
];

const AURA_LOGO = { dark: "/images/pitch-deck/auraight-icon-dark.svg", light: "/images/pitch-deck/auraight-icon-light.svg" };


function LinkOut({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className="mtl-link" href={href} target="_blank" rel="noopener noreferrer">{children} ↗</a>;
}
function PersonChip({ person, onOpen, size = 60 }: { person: Person; onOpen: () => void; size?: number }) {
  return (
    <button type="button" className="mtl-chip-person" onClick={onOpen} title={person.name} aria-label={`${person.name} — ${person.role}`}>
      <Avatar name={person.name} photo={person.photo} size={size} ring />
    </button>
  );
}
function SectionHead({ eyebrow, title, lead, links }: { eyebrow: string; title: string; lead: string; links?: { label: string; href: string }[] }) {
  return (
    <header className="mtl-head">
      <p className="mtl-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="mtl-lead">{lead}</p>
      {links?.length ? <div className="mtl-head-links">{links.map((l) => <LinkOut key={l.href + l.label} href={l.href}>{l.label}</LinkOut>)}</div> : null}
    </header>
  );
}

/* ---------- donut with labels + percentages on the chart ---------- */
function Donut({ slices }: { slices: { label: string; pct: number }[] }) {
  const [active, setActive] = useState<number | null>(null);
  const size = 420, cx = 210, cy = 210, R = 132, r = 84;
  const colors = ["#77e4df", "#c77dff", "#ffbe72", "#6ea7ff"];
  let angle = -90;
  const arc = (a0: number, a1: number, rad: number) => {
    const p = (a: number) => [cx + rad * Math.cos((a * Math.PI) / 180), cy + rad * Math.sin((a * Math.PI) / 180)];
    const q = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
    const large = a1 - a0 > 180 ? 1 : 0;
    const [x1, y1] = p(a0), [x2, y2] = p(a1), [x3, y3] = q(a1), [x4, y4] = q(a0);
    return `M${x1} ${y1}A${rad} ${rad} 0 ${large} 1 ${x2} ${y2}L${x3} ${y3}A${r} ${r} 0 ${large} 0 ${x4} ${y4}Z`;
  };
  const cur = active !== null ? slices[active] : null;
  return (
    <svg
      className="mtl-donut" viewBox={`0 0 ${size} ${size}`}
      role="group" aria-label={slices.map((s) => `${s.label} ${s.pct}%`).join(", ")}
      onMouseLeave={() => setActive(null)}
    >
      {slices.map((s, i) => {
        const a0 = angle + 1.2;
        const a1 = angle + (s.pct / 100) * 360 - 1.2;
        angle += (s.pct / 100) * 360;
        const mid = ((a0 + a1) / 2) * (Math.PI / 180);
        const isActive = active === i;
        const rad = isActive ? R + 10 : R;
        const dim = active !== null && !isActive;
        return (
          <g
            key={s.label}
            className={isActive ? "mtl-slice is-active" : "mtl-slice"}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(isActive ? null : i)}
            onFocus={() => setActive(i)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(isActive ? null : i); } }}
            tabIndex={0} role="button"
            aria-label={`${s.label} ${s.pct}%`}
          >
            <path d={arc(a0, a1, rad)} fill={colors[i % 4]} opacity={dim ? 0.26 : 1} />
            <line
              x1={cx + (rad + 4) * Math.cos(mid)} y1={cy + (rad + 4) * Math.sin(mid)}
              x2={cx + 162 * Math.cos(mid)} y2={cy + 162 * Math.sin(mid)}
              stroke={colors[i % 4]} strokeWidth="1.5" opacity={dim ? 0.2 : 0.85}
            />
            <text x={cx + 176 * Math.cos(mid)} y={cy + 176 * Math.sin(mid)}
              textAnchor={Math.cos(mid) >= 0 ? "start" : "end"} dominantBaseline="middle"
              className="mtl-donut-label" opacity={dim ? 0.3 : 1}>
              {s.label} <tspan className="mtl-donut-pct">{s.pct}%</tspan>
            </text>
          </g>
        );
      })}
      {cur ? (
        <g className="mtl-donut-center" aria-hidden="true">
          <text x={cx} y={cy - 4} textAnchor="middle" className="mtl-donut-big">{cur.pct}%</text>
          <text x={cx} y={cy + 30} textAnchor="middle" className="mtl-donut-center-label">{cur.label}</text>
        </g>
      ) : null}
    </svg>
  );
}

export function MotaSection({ index, goTo: navigate }: { index: number; goTo?: (idx: number) => void }) {
  const { deckLocale } = useDeckLocale();
  const fallback = useNav();
  const goTo = navigate || fallback;
  const t: Deck = DECKS[deckLocale] || en;
  const [person, setPerson] = useState<Person | null>(null);
  const [official, setOfficial] = useState<Official | null>(null);
  const labels = t.modal;

  const page = (() => {
    if (index === 0) return <Cover t={t} goTo={goTo} />;
    if (index === 1) return <Mota t={t} open={setPerson} />;
    if (index === 2) return <Elms t={t} open={setPerson} openOfficial={setOfficial} />;
    if (index === 3) return <Aura t={t} open={setPerson} />;
    if (index === 4) return <Vflux t={t} open={setPerson} />;
    if (index === 5) return <Video t={t} open={setPerson} />;
    return <Cta t={t} goTo={goTo} />;
  })();

  return (
    <section className="mtl-section">
      <div className="mtl-content">
        <div className="mtl-kicker">
          {index > 0 && <span className="mtl-progress">{t.nav.page} {index + 1}/{7}</span>}
        </div>
        {page}
      </div>
      {person && <PersonModal person={person} labels={labels} onClose={() => setPerson(null)} />}
      {official && <OfficialModal official={official} labels={{ close: labels.close, officialTitle: labels.officialTitle }} onClose={() => setOfficial(null)} />}
    </section>
  );
}

/* ================= pages ================= */
function Cover({ t, goTo }: { t: Deck; goTo: (i: number) => void }) {
  return (
    <div className="mtl-cover">
      <p className="mtl-eyebrow">{t.cover.eyebrow}</p>
      <h1 className="mtl-hero">{t.cover.title}</h1>
      <p className="mtl-lead mtl-center">{t.cover.lead}</p>
      <div className="mtl-pillars">
        {t.cover.pillars.map((p) => (
          <div className="mtl-pillar" key={p.label}>
            <span className="mtl-pillar-icon" aria-hidden="true">{p.icon}</span>
            <b>{p.label}</b>
            <small>{p.note}</small>
          </div>
        ))}
      </div>
      <p className="mtl-label mtl-center">{t.cover.enter}</p>
      <div className="mtl-project-row">
        {PROJECTS.map((p) => (
          <button type="button" key={p.key} className="mtl-project-card" onClick={() => goTo(p.page)} aria-label={p.name}>
            {p.logo && p.logoLight ? (
              <>
                <Image className="only-dark" src={p.logo} alt="" width={80} height={64} />
                <Image className="only-light" src={p.logoLight} alt="" width={80} height={64} />
              </>
            ) : p.logo ? (
              <Image src={p.logo} alt="" width={168} height={64} />
            ) : (
              <span className="mtl-wordmark-wrap">
                <span className="mtl-wordmark">{p.name}</span>
                {p.wordmark ? <small>{p.wordmark}</small> : null}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function Mota({ t, open }: { t: Deck; open: (p: Person) => void }) {
  const ppl = t.people as unknown as Record<string, Person>;
  return (
    <>
      <div className="mtl-head mtl-head-row mtl-head-mota">
        <span className="mtl-logo is-mota">
          <Image className="only-dark" src="/logos/mota-techlink-logo-wht.webp" alt="MOTA TECH LINK" width={210} height={92} />
          <Image className="only-light" src="/logos/mota-techlink-logo-blk.webp" alt="MOTA TECH LINK" width={210} height={92} />
        </span>
        <div>
          <p className="mtl-eyebrow">{t.mota.eyebrow}</p>
          <h1>{t.mota.title}</h1>
          <p className="mtl-lead">{t.mota.lead}</p>
          <div className="mtl-head-links">
            <LinkOut href="https://motaiot.com">{t.mota.siteLabel}</LinkOut>
          </div>
        </div>
        <div className="mtl-core">
          <p className="mtl-label">{t.mota.coreLabel}</p>
          <ul className="mtl-ticks">{t.mota.core.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      </div>
      <div className="mtl-mota-grid">
        <div className="mtl-hexes">
          {[{ icon: "🧠", title: t.mota.missionTitle, body: t.mota.mission },
            { icon: "🚀", title: t.mota.visionTitle, body: t.mota.vision },
            { icon: "🔌", title: t.mota.itTitle, body: t.mota.it },
            { icon: "⚡", title: t.mota.aiTitle, body: t.mota.ai }].map((h) => (
            <div className="mtl-hex" key={h.title}>
              <div className="mtl-hex-inner">
                <b>{h.icon} {h.title}</b>
                <p>{h.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mtl-tech">
          <p className="mtl-label">{t.mota.techTag}</p>
          <h2>{t.mota.techTitle}</h2>
          <p className="mtl-hint">{t.mota.techLead}</p>
          <div className="mtl-tech-grid">
            {t.mota.techGroups.map((g) => (
              <article key={g.title}>
                <b><span aria-hidden="true">{g.icon}</span> {g.title}</b>
                <ul>{g.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="mtl-tech-spot">
            <b>✨ {t.mota.techHighlight}</b>
            <p>{t.mota.techHighlightBody}</p>
            <LinkOut href="https://motaiot.com/zh/showcase/GenAI-Driven">{t.mota.caseLink}</LinkOut>
          </div>
        </div>
      </div>
      <div className="mtl-teambar">
        <div>
          <p className="mtl-label">{t.mota.teamTitle}</p>
          <p className="mtl-hint">{t.mota.teamNote}</p>
        </div>
        <div className="mtl-people">
          <PersonChip person={ppl.harling} onOpen={() => open(ppl.harling)} />
          <PersonChip person={ppl.franklin} onOpen={() => open(ppl.franklin)} />
        </div>
      </div>
    </>
  );
}

function Elms({ t, open, openOfficial }: { t: Deck; open: (p: Person) => void; openOfficial: (o: Official) => void }) {
  const ppl = t.people as unknown as Record<string, Person>;
  const offs = t.officials as unknown as Record<string, Official>;
  return (
    <>
      <div className="mtl-head mtl-head-row">
        <span className="mtl-logo"><Image src="/images/pitch-deck/elmsflow-logo.png" alt="ELMSFLOW" width={200} height={72} /></span>
        <div>
          <p className="mtl-eyebrow">{t.elms.eyebrow}</p>
          <h1>{t.elms.title}</h1>
          <p className="mtl-lead">{t.elms.lead}</p>
          <div className="mtl-head-links">
            <LinkOut href="https://elmsflo.com/about">{t.elms.links[0]}</LinkOut>
            <LinkOut href="https://elmsflo.com/why-ireland">{t.elms.links[1]}</LinkOut>
          </div>
        </div>
      </div>
      <div className="mtl-programmes">
        {t.elms.programmes.map((p) => (
          <a className="mtl-programme" key={p.title} href={p.link} target="_blank" rel="noopener noreferrer">
            <span className="mtl-programme-img"><Image src={p.image} alt={p.title} width={400} height={225} /></span>
            <b>{p.title}</b>
            <small>{p.desc}</small>
            <em aria-hidden="true">↗</em>
          </a>
        ))}
      </div>
      <div className="mtl-elms-lower">
        <div className="mtl-globe">
          <p className="mtl-label">{t.elms.mapTitle}</p>
          <div className="mtl-globe-inner">
            <span className="mtl-globe-ring" />
            <b className="mtl-globe-core">🇮🇪 {t.elms.mapNodes[0]}</b>
            <i className="mtl-globe-node n1">🇬🇧 {t.elms.mapNodes[1]}</i>
            <i className="mtl-globe-node n2">🇪🇺 {t.elms.mapNodes[2]}</i>
            <i className="mtl-globe-node n3">🇺🇸 {t.elms.mapNodes[3]}</i>
            <i className="mtl-globe-node n4">🇨🇳 {t.elms.mapNodes[4]}</i>
          </div>
          <p className="mtl-hint">{t.elms.mapNote}</p>
        </div>
        <div className="mtl-elms-side">
          <div>
            <p className="mtl-label">{t.elms.teamTitle}</p>
            <div className="mtl-people">
              <PersonChip person={ppl.paul} onOpen={() => open(ppl.paul)} />
              <PersonChip person={ppl.turlough} onOpen={() => open(ppl.turlough)} />
              <PersonChip person={ppl.harling} onOpen={() => open(ppl.harling)} />
            </div>
          </div>
          <div>
            <p className="mtl-label">{t.elms.officialsTitle}</p>
            <div className="mtl-official-row">
              {Object.values(offs).map((o) => (
                <button type="button" key={o.name} className="mtl-official-thumb" onClick={() => openOfficial(o)} aria-label={`${o.name} — ${o.role}`}>
                  <Image src={o.photo} alt={o.name} width={64} height={64} />
                </button>
              ))}
            </div>
            <p className="mtl-hint">{t.elms.officialsNote}</p>
          </div>
        </div>
      </div>
      <div className="mtl-tax-band">
        <div className="mtl-tax-lead">
          <p className="mtl-label">{t.elms.taxLabel}</p>
          <b>{t.elms.taxTitle}</b>
        </div>
        <p className="mtl-tax-body">{t.elms.taxBody}</p>
        <ul>{t.elms.taxItems.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
    </>
  );
}

function Aura({ t, open }: { t: Deck; open: (p: Person) => void }) {
  const ppl = t.people as unknown as Record<string, Person>;
  return (
    <>
      <div className="mtl-head mtl-head-row">
        <span className="mtl-logo mtl-logo-card">
          <Image className="only-dark" src={AURA_LOGO.dark} alt="Auraight" width={84} height={64} />
          <Image className="only-light" src={AURA_LOGO.light} alt="Auraight" width={84} height={64} />
        </span>
        <div>
          <p className="mtl-eyebrow">{t.aura.eyebrow}</p>
          <h1>{t.aura.title}</h1>
          <p className="mtl-lead">{t.aura.lead}</p>
          <div className="mtl-head-links">
            <LinkOut href="https://auraight.com/zh/showcase">{t.aura.links[0]}</LinkOut>
            <LinkOut href="https://auraight.com/zh/showcase">{t.aura.links[1]}</LinkOut>
          </div>
        </div>
      </div>
      <div className="mtl-aura-grid">
        <div className="mtl-panel">
          <p className="mtl-label">{t.aura.mixTitle}</p>
          <Donut slices={t.aura.mix.map((m) => ({ label: m.label, pct: m.pct }))} />
          <p className="mtl-hint mtl-center">{t.aura.mixNote}</p>
        </div>
        <div className="mtl-panel">
          <p className="mtl-label">{t.aura.mapTitle}</p>
          <div className="mtl-hubs">
            <div className="mtl-hubs-block is-resource">
              <p className="mtl-hubs-head"><i />{t.aura.resourceLabel}</p>
              {t.aura.resources.map((r) => (
                <div className="mtl-hub-card" key={r.name}>
                  <span className="mtl-hub-flag">{r.flag}</span>
                  <div>
                    <b>{r.name}</b>
                    <small>{r.note}</small>
                  </div>
                </div>
              ))}
            </div>
            <div className="mtl-hub-arrow" aria-hidden="true">↦</div>
            <div className="mtl-hubs-block is-client">
              <p className="mtl-hubs-head"><i />{t.aura.clientLabel}</p>
              <div className="mtl-client-grid">
                {t.aura.clients.map((c) => (
                  <div className="mtl-client-chip" key={c.name}>
                    <span>{c.flag}</span>{c.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mtl-why">
        <p className="mtl-label">{t.aura.whyTitle}</p>
        <div className="mtl-why-grid">
          {t.aura.why.map((w) => (
            <article key={w.title}>
              <b>{w.title}</b>
              <p>{w.body}</p>
              <LinkOut href={w.link}>{t.aura.links[1]}</LinkOut>
            </article>
          ))}
        </div>
      </div>
      <div className="mtl-aura-foot">
        <div className="mtl-service-chips">
          <p className="mtl-label">{t.aura.servicesTitle}</p>
          <div>{t.aura.services.map((s) => <span key={s}>{s}</span>)}</div>
        </div>
        <div>
          <p className="mtl-label">{t.aura.teamTitle}</p>
          <div className="mtl-people">
            <PersonChip person={ppl.vivian} onOpen={() => open(ppl.vivian)} />
            <PersonChip person={ppl.ethan} onOpen={() => open(ppl.ethan)} />
            <PersonChip person={ppl.harling} onOpen={() => open(ppl.harling)} />
          </div>
        </div>
      </div>
    </>
  );
}

function Vflux({ t, open }: { t: Deck; open: (p: Person) => void }) {
  const ppl = t.people as unknown as Record<string, Person>;
  return (
    <>
      <div className="mtl-head mtl-head-row">
        <span className="mtl-logo is-vflux-logo">
          <Image src="/images/pitch-deck/vflux-logo.png" alt="VFlux" width={132} height={84} />
        </span>
        <div>
          <p className="mtl-eyebrow">{t.vflux.eyebrow}</p>
          <h1>{t.vflux.title}</h1>
          <p className="mtl-lead">{t.vflux.lead}</p>
          <div className="mtl-head-links">
            <LinkOut href="https://vflux.ai/en">{t.vflux.links[0]}</LinkOut>
            <LinkOut href="https://vflux.ai/en/docs">{t.vflux.links[1]}</LinkOut>
          </div>
        </div>
      </div>
      <div className="mtl-vflow">
        <div className="mtl-vcol">
          <p className="mtl-label">{t.vflux.venueLabel}</p>
          {t.vflux.venue.map((v, i) => <div className="mtl-vbox" key={v}><span>{["🏦", "🔁", "🤝"][i]}</span>{v}</div>)}
        </div>
        <div className="mtl-vmid">
          <div className="mtl-vglobe" aria-hidden="true"><span /><span className="mtl-vglobe-ring" /></div>
          <div className="mtl-vcore">
            <b>VFLUX</b>
            <ul>{t.vflux.platform.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
        </div>
        <div className="mtl-vcol">
          <p className="mtl-label">{t.vflux.assetLabel}</p>
          {t.vflux.assets.map((a, i) => <div className="mtl-vbox" key={a}><span>{["📈", "🥇", "🛢️", "📊"][i]}</span>{a}</div>)}
        </div>
      </div>
      <div className="mtl-teambar">
        <div>
          <p className="mtl-label">{t.vflux.teamTitle}</p>
          <p className="mtl-hint">{t.vflux.note}</p>
        </div>
        <div className="mtl-people">
          <PersonChip person={ppl.harling} onOpen={() => open(ppl.harling)} />
          <PersonChip person={ppl.chris} onOpen={() => open(ppl.chris)} />
          <PersonChip person={ppl.anthony} onOpen={() => open(ppl.anthony)} />
        </div>
      </div>
    </>
  );
}

function Video({ t, open }: { t: Deck; open: (p: Person) => void }) {
  const ppl = t.people as unknown as Record<string, Person>;
  return (
    <>
      <div className="mtl-head mtl-head-row">
        <span className="mtl-logo">
          <Image className="only-dark" src="/images/pitch-deck/yoshisei-logo-dark.svg" alt="吉晟 YOSHI SEI" width={84} height={84} />
          <Image className="only-light" src="/images/pitch-deck/yoshisei-logo-light.svg" alt="吉晟 YOSHI SEI" width={84} height={84} />
        </span>
        <div>
          <p className="mtl-eyebrow">{t.video.eyebrow}</p>
          <h1>{t.video.title}</h1>
          <p className="mtl-lead">{t.video.lead}</p>
          <div className="mtl-head-links">
            <LinkOut href="https://yoshisei.jp">{t.video.links[0]}</LinkOut>
            <LinkOut href="https://drive.google.com/file/d/1ckJ0lmtw3F9C1dkobx1Zz4UfzwRKJRK-/view">{t.video.links[1]}</LinkOut>
          </div>
        </div>
      </div>
      <div className="mtl-video-top">
        <div className="mtl-panel">
          <p className="mtl-label">{t.video.demandTitle}</p>
          <ul className="mtl-ticks">{t.video.demand.map((d) => <li key={d}>{d}</li>)}</ul>
        </div>
        <div className="mtl-bridge" aria-hidden="true"><span>⇄</span></div>
        <div className="mtl-panel">
          <p className="mtl-label">{t.video.supplyTitle}</p>
          <ul className="mtl-ticks">{t.video.supply.map((d) => <li key={d}>{d}</li>)}</ul>
        </div>
      </div>
      <div className="mtl-market">
        <p className="mtl-label">{t.video.marketTitle}</p>
        <p className="mtl-hint">{t.video.marketLead}</p>
        <table className="mtl-mtable">
          <thead><tr>{t.video.cols.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
          <tbody>
            {t.video.rows.map((r) => <tr key={r[0]}><th scope="row">{r[0]}</th><td>{r[1]}</td><td>{r[2]}</td></tr>)}
          </tbody>
        </table>
        <div className="mtl-market-foot">
          <p className="mtl-label">{t.video.gapTitle}</p>
          <div className="mtl-gap-row">
            {t.video.gap.map((g, i) => (
              <div className={`mtl-gap-card g${i}`} key={g}>
                <span aria-hidden="true">{["🧩", "🗣️", "💱"][i]}</span>
                <b>{g}</b>
              </div>
            ))}
          </div>
          <p className="mtl-hint">{t.video.srcNote}</p>
        </div>
      </div>
      <div className="mtl-video-foot">
        <div>
          <p className="mtl-label">{t.video.linesTitle}</p>
          <div className="mtl-lines">
            {t.video.lines.map((l) => <article key={l.title}><span aria-hidden="true">{l.icon}</span><b>{l.title}</b><p>{l.body}</p></article>)}
          </div>
        </div>
        <div>
          <p className="mtl-label">{t.video.teamTitle}</p>
          <div className="mtl-people">
            <PersonChip person={ppl.vito} onOpen={() => open(ppl.vito)} />
            <PersonChip person={ppl.allen} onOpen={() => open(ppl.allen)} />
            <PersonChip person={ppl.kuri} onOpen={() => open(ppl.kuri)} />
            <PersonChip person={ppl.harling} onOpen={() => open(ppl.harling)} />
          </div>
        </div>
      </div>
    </>
  );
}

function Cta({ t, goTo }: { t: Deck; goTo: (i: number) => void }) {
  return (
    <div className="mtl-cta">
      <span className="mtl-cta-logo">
        <Image className="only-dark" src="/logos/mota-techlink-logo-wht.webp" alt="MOTA TECH LINK" width={320} height={140} />
        <Image className="only-light" src="/logos/mota-techlink-logo-blk.webp" alt="MOTA TECH LINK" width={320} height={140} />
      </span>
      <p className="mtl-eyebrow">{t.cta.eyebrow}</p>
      <h1 className="mtl-hero">{t.cta.title}</h1>
      <p className="mtl-lead mtl-center">{t.cta.lead}</p>
      <FlowMap labels={{ title: t.cta.flow.title, nodes: t.cta.flow.nodes }} />
      <ul className="mtl-fm-legend">
        {[
          { c: FLOW_LEGEND_COLORS.elms, label: t.cta.flow.elms },
          { c: FLOW_LEGEND_COLORS.video, label: t.cta.flow.video },
          { c: FLOW_LEGEND_COLORS.vflux, label: t.cta.flow.vflux },
          { c: FLOW_LEGEND_COLORS.aura, label: t.cta.flow.aura },
        ].map((l) => (
          <li key={l.label}><i style={{ background: l.c }} aria-hidden="true" />{l.label}</li>
        ))}
      </ul>
      <div className="mtl-contact">
        <div><b>{t.cta.contact}</b><a href={`mailto:${t.cta.email}`}>{t.cta.email}</a></div>
        <div><b>{t.cta.addressLabel}</b><span>{t.cta.address}</span></div>
        <div><b>{t.cta.websiteLabel}</b><LinkOut href="https://motaiot.com">motaiot.com</LinkOut></div>
      </div>
      <p className="mtl-hint mtl-center">{t.cta.copyright}</p>
    </div>
  );
}
