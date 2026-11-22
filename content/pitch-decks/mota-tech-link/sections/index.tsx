"use client";
import { useState } from "react";
import Image from "next/image";
import { useDeckLocale } from "@/components/pitch-deck";
import { useNav } from "../hooks";
import { Avatar } from "./Avatar";
import { PersonModal, type Person } from "./PersonModal";
import { OfficialModal, type Official } from "./OfficialModal";
import en from "../i18n/en.json";
import zh from "../i18n/zh.json";
import ja from "../i18n/ja.json";
import es from "../i18n/es.json";

type Deck = typeof en;
const DECKS: Record<string, Deck> = { en, zh, ja, es };

const PROJECTS = [
  { key: "elms", page: 2, logo: "/images/pitch-deck/elmsflow-logo.png", name: "ELMSFLOW", wordmark: "" },
  { key: "aura", page: 3, logo: "", name: "Auraight", wordmark: "" },
  { key: "vflux", page: 4, logo: "/images/pitch-deck/vflux-logo.png", name: "VFlux", wordmark: "" },
  { key: "video", page: 5, logo: "", name: "吉晟", wordmark: "YOSHI SEI" },
] as const;

const AURA_THEME_LOGO = { dark: "/images/pitch-deck/auraight-logo-dark.svg", light: "/images/pitch-deck/auraight-logo-light.svg" };

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
      {links?.length ? <div className="mtl-head-links">{links.map((l) => <LinkOut key={l.href} href={l.href}>{l.label}</LinkOut>)}</div> : null}
    </header>
  );
}

/* ---------- donut with labels + percentages on the chart ---------- */
function Donut({ slices }: { slices: { label: string; pct: number }[] }) {
  const size = 420, cx = 210, cy = 210, R = 132, r = 84;
  const colors = ["#77e4df", "#c77dff", "#ffbe72", "#6ea7ff"];
  let angle = -90;
  const arc = (a0: number, a1: number, outer: number, inner: number) => {
    const p = (a: number) => [cx + outer * Math.cos((a * Math.PI) / 180), cy + outer * Math.sin((a * Math.PI) / 180)];
    const q = (a: number) => [cx + inner * Math.cos((a * Math.PI) / 180), cy + inner * Math.sin((a * Math.PI) / 180)];
    const large = a1 - a0 > 180 ? 1 : 0;
    const [x1, y1] = p(a0), [x2, y2] = p(a1), [x3, y3] = q(a1), [x4, y4] = q(a0);
    return `M${x1} ${y1}A${outer} ${outer} 0 ${large} 1 ${x2} ${y2}L${x3} ${y3}A${inner} ${inner} 0 ${large} 0 ${x4} ${y4}Z`;
  };
  return (
    <svg className="mtl-donut" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={slices.map((s) => `${s.label} ${s.pct}%`).join(", ")}>
      {slices.map((s, i) => {
        const a0 = angle + 1.2;
        const a1 = angle + (s.pct / 100) * 360 - 1.2;
        angle += (s.pct / 100) * 360;
        const mid = ((a0 + a1) / 2) * (Math.PI / 180);
        const lx = cx + 176 * Math.cos(mid);
        const ly = cy + 176 * Math.sin(mid);
        const right = Math.cos(mid) >= 0;
        return (
          <g key={s.label}>
            <path d={arc(a0, a1, R, r)} fill={colors[i % 4]} opacity={0.92} />
            <line x1={cx + (R + 4) * Math.cos(mid)} y1={cy + (R + 4) * Math.sin(mid)} x2={cx + 162 * Math.cos(mid)} y2={cy + 162 * Math.sin(mid)} stroke={colors[i % 4]} strokeWidth="1.5" opacity=".7" />
            <text x={lx} y={ly} textAnchor={right ? "start" : "end"} dominantBaseline="middle" className="mtl-donut-label">
              {s.label} <tspan className="mtl-donut-pct">{s.pct}%</tspan>
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- equirectangular country map ---------- */
const AURA_POINTS = {
  resources: [{ name: "中国 · 上海", lon: 121.5, lat: 31.2, short: "中国" }, { name: "日本", lon: 139.7, lat: 35.7, short: "日本" }],
  clients: [{ name: "英国", lon: -0.1, lat: 51.5, short: "英国" }, { name: "尼日利亚", lon: 3.4, lat: 6.5, short: "尼日利亚" }, { name: "新西兰", lon: 174.8, lat: -36.9, short: "新西兰" }],
};
function project(lon: number, lat: number) {
  return { left: `${Math.min(96, Math.max(4, ((lon + 180) / 360) * 100))}%`, top: `${((90 - lat) / 180) * 100}%` };
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
          {index > 0 && <span>{t.nav.page} {index + 1}/{7}</span>}
          {index > 0 && <button type="button" onClick={() => goTo(1)}>↩ {t.nav.overview}</button>}
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
            {p.logo ? <Image src={p.logo} alt="" width={168} height={64} /> : (
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
  const hexes = [
    { icon: "🧠", title: t.mota.missionTitle, body: t.mota.mission },
    { icon: "🚀", title: t.mota.visionTitle, body: t.mota.vision },
    { icon: "🔌", title: t.mota.itTitle, body: t.mota.it },
    { icon: "⚡", title: t.mota.aiTitle, body: t.mota.ai },
  ];
  return (
    <>
      <SectionHead eyebrow={t.mota.eyebrow} title={t.mota.title} lead={t.mota.lead} />
      <div className="mtl-mota-grid">
        <div className="mtl-hexes">
          {hexes.map((h) => (
            <div className="mtl-hex" key={h.title}>
              <div className="mtl-hex-inner">
                <b>{h.icon} {h.title}</b>
                <p>{h.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mtl-aiot-card">
          <p className="mtl-label">{t.mota.aiotTag}</p>
          <h2>{t.mota.aiotTitle}</h2>
          <p>{t.mota.aiotBody}</p>
          <ul className="mtl-ticks">{t.mota.aiotPoints.map((x) => <li key={x}>{x}</li>)}</ul>
          <LinkOut href="https://motaiot.com/zh/showcase/GenAI-Driven">{t.mota.aiotLink}</LinkOut>
          <div className="mtl-case-chips">{t.mota.cases.map((c) => <span key={c}>{c}</span>)}</div>
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
            <span className="mtl-programme-img"><Image src={p.image} alt={p.title} width={400} height={250} /></span>
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
    </>
  );
}

function Aura({ t, open }: { t: Deck; open: (p: Person) => void }) {
  const ppl = t.people as unknown as Record<string, Person>;
  return (
    <>
      <div className="mtl-head mtl-head-row">
        <span className="mtl-logo">
          <Image className="only-dark" src={AURA_THEME_LOGO.dark} alt="Auraight" width={120} height={90} />
          <Image className="only-light" src={AURA_THEME_LOGO.light} alt="Auraight" width={120} height={90} />
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
          <div className="mtl-worldmap">
            <div className="mtl-worldmap-grid" aria-hidden="true" />
            {AURA_POINTS.resources.map((p) => (
              <span key={p.name} className="mtl-dot is-resource" style={project(p.lon, p.lat)}>
                <i /> {p.short}
              </span>
            ))}
            {AURA_POINTS.clients.map((p) => (
              <span key={p.name} className="mtl-dot is-client" style={project(p.lon, p.lat)}>
                <i /> {p.short}
              </span>
            ))}
          </div>
          <div className="mtl-map-legend">
            <span className="is-resource"><i />{t.aura.resourceLabel}</span>
            <span className="is-client"><i />{t.aura.clientLabel}</span>
          </div>
          <ul className="mtl-resource-list">
            {t.aura.resources.map((r) => <li key={r.name}><b>{r.name}</b><small>{r.note}</small></li>)}
          </ul>
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
      <SectionHead
        eyebrow={t.vflux.eyebrow} title={t.vflux.title} lead={t.vflux.lead}
        links={[{ label: t.vflux.links[0], href: "https://vflux.ai/en" }, { label: t.vflux.links[1], href: "https://vflux.ai/en/docs" }]}
      />
      <div className="mtl-layers">
        {t.vflux.layers.map((l, i) => (
          <article className="mtl-layer" key={l.title}>
            <span className="mtl-layer-num">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <p className="mtl-layer-tag">{l.tag}</p>
              <h3>{l.title}</h3>
              <p>{l.body}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="mtl-flow">
        <p className="mtl-label">{t.vflux.flowTitle}</p>
        <div className="mtl-flow-track">
          {t.vflux.flow.map((f, i) => (
            <span key={f} className={i === 1 ? "is-on" : undefined}>{f}</span>
          ))}
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
      <SectionHead
        eyebrow={t.video.eyebrow} title={t.video.title} lead={t.video.lead}
        links={[{ label: t.video.links[0], href: "https://yoshisei.jp" }, { label: t.video.links[1], href: "https://drive.google.com/file/d/1ckJ0lmtw3F9C1dkobx1Zz4UfzwRKJRK-/view" }]}
      />
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
      <div className="mtl-lines">
        {t.video.lines.map((l) => (
          <article key={l.title}><span aria-hidden="true">{l.icon}</span><b>{l.title}</b><p>{l.body}</p></article>
        ))}
      </div>
      <div className="mtl-steps">
        <p className="mtl-label">{t.video.stepsTitle}</p>
        <ol>
          {t.video.steps.map((s, i) => <li key={s}><b>{i + 1}</b>{s}</li>)}
        </ol>
      </div>
      <div className="mtl-video-foot">
        <div>
          <p className="mtl-label">{t.video.whyTitle}</p>
          <ul className="mtl-ticks">{t.video.why.map((w) => <li key={w}>{w}</li>)}</ul>
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
      <p className="mtl-eyebrow">{t.cta.eyebrow}</p>
      <h1 className="mtl-hero">{t.cta.title}</h1>
      <p className="mtl-lead mtl-center">{t.cta.lead}</p>
      <div className="mtl-contact">
        <div><b>{t.cta.contact}</b><a href={`mailto:${t.cta.email}`}>{t.cta.email}</a></div>
        <div><b>{t.cta.addressLabel}</b><span>{t.cta.address}</span></div>
        <div><b>{t.cta.websiteLabel}</b><LinkOut href="https://motaiot.com">motaiot.com</LinkOut></div>
      </div>
      <button type="button" className="mtl-action" onClick={() => goTo(1)}>{t.cta.back} →</button>
      <Image className="mtl-cta-art" src="/images/pitch-deck/cta-network.svg" alt="" width={520} height={300} />
      <p className="mtl-hint mtl-center">{t.cta.copyright}</p>
    </div>
  );
}
