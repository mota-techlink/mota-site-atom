"use client";

import { useState } from "react";
import Image from "next/image";
import { useDeckLocale } from "@/components/pitch-deck";
import { useContent, useNav } from "../hooks";
import { ProjectDetailModal } from "./ProjectDetailModal";
import en from "../briefs/en.json";
import zh from "../briefs/zh.json";
import ja from "../briefs/ja.json";
import es from "../briefs/es.json";
import type { ContentType } from "../constants";

type Project = ContentType["projects"][number];
type Brief = typeof en;
type Person = Brief["projects"][number]["people"][number];
const briefs: Record<string, Brief> = { en, zh, ja, es };
const caseSlugs = ["Lingjii-Lighting-AI", "AI-Voice-USB", "Lingjii-Pet-AI", "AI-Smart-Cane", "GenAI-Driven", "Textile-Logo-QA"];
const caseIcons = ["☼", "◉", "◇", "⌁", "▣", "◎"];
const projectLinks = [
  ["https://elmsflo.com/about", "https://elmsflo.com/why-ireland"],
  ["https://auraight.com", "https://auraight.com/zh/showcase"],
  ["https://vflux.ai/en", "/en/contact"],
  ["https://yoshisei.jp", "https://drive.google.com/file/d/1ckJ0lmtw3F9C1dkobx1Zz4UfzwRKJRK-/view"],
];

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className="mtl-link" href={href} target="_blank" rel="noopener noreferrer">{children} <span aria-hidden="true">↗</span></a>;
}

function Logo({ project }: { project: Project }) {
  return <span className="mtl-logo">{project.logo ? <Image src={project.logo} alt={`${project.name} logo`} width={180} height={72} /> : <span aria-label={`${project.name} logo`}>{project.mark}</span>}</span>;
}

function PersonButton({ person, onClick }: { person: Person; onClick: () => void }) {
  const harling = person.name === "Harling Sun";
  return <button type="button" className="mtl-person" onClick={onClick} aria-label={`${person.name} · ${person.role}`}>
    {harling ? <Image src="/images/team/Harling.jpg" alt="" width={48} height={48} /> : <span className="mtl-avatar" aria-hidden="true">{person.name.charAt(0)}</span>}
    <span><strong>{person.name}</strong><small>{person.role}</small></span>
  </button>;
}

export function MotaSection({ index, goTo: navigate }: { index: number; goTo?: (idx: number) => void }) {
  const c = useContent();
  const { deckLocale } = useDeckLocale();
  const b = briefs[deckLocale] ?? en;
  const fallback = useNav();
  const goTo = navigate ?? fallback;
  const [selected, setSelected] = useState<Project | null>(null);
  const e = c.editorial;
  const d = c.sections[index === 7 ? 8 : index];
  const projectIndex = index - 2;
  const project = c.projects[projectIndex];
  const brief = b.projects[projectIndex];
  const showcaseLocale = ["en", "zh", "ja"].includes(deckLocale) ? deckLocale : "en";
  const projectUrl = (slug: string) => `https://github.com/mota-techlink/mota-site-atom/blob/main/content/showcase/${slug}${showcaseLocale === "en" ? "" : `.${showcaseLocale}`}.md`;
  const makeProject = (p: Project, detail: Brief["projects"][number]): Project => ({
    ...p,
    summary: detail.lead,
    overview: { title: p.name, body: detail.lead, points: detail.blocks.map(block => block.body) },
    capabilities: detail.blocks,
    team: detail.people,
    sources: [detail.source],
    pending: [detail.blocks[detail.blocks.length - 1].body],
  });
  const openPerson = (person: Person, p?: Project) => {
    const base = p ?? c.projects[0];
    setSelected({
      ...base,
      id: person.name,
      name: person.name,
      mark: person.name.charAt(0),
      logo: person.name === "Harling Sun" ? "/images/team/Harling.jpg" : undefined,
      summary: person.role,
      overview: { title: person.name, body: person.role, points: person.name === "Harling Sun" ? [e.harlingBio, e.harlingSkills] : [person.role] },
      capabilities: [{ title: c.gallery.overview, body: person.role }],
      team: [person],
      sources: [e.source],
      pending: [person.name === "Franklin Ng" ? e.franklinBio : person.role],
    });
  };
  const back = () => {
    setSelected(null);
    goTo(1);
    window.setTimeout(() => document.querySelector<HTMLElement>('.mtl-slide[data-state="active"] h1')?.focus(), 0);
  };
  const founders = [{ name: "Harling Sun", role: e.founderRole }, { name: "Franklin Ng", role: e.franklinRole }];

  return <section className="mtl-section">
    <div className="mtl-content">
      <div className="mtl-kicker"><span>{String(index + 1).padStart(2, "0")} · {d.eyebrow}</span>{index > 1 && <button type="button" onClick={() => goTo(1)}>↩ {e.back}</button>}</div>

      {index === 0 && <>
        <div className="mtl-cover-grid">
          <div className="mtl-cover-main">
            <span className="mtl-mota-logo"><Image src="/logos/mota-techlink-logo-v2.webp" alt="MOTA TECH LINK logo" width={270} height={85} priority /></span>
            <h1 tabIndex={-1}>{d.title}</h1>
            <p className="mtl-lead">{b.cover.thesis}</p>
            <p className="mtl-muted"><strong>{e.missionLabel}:</strong> {e.mission} <strong>{e.visionLabel}:</strong> {e.vision}</p>
            <button type="button" className="mtl-action" onClick={() => goTo(1)}>{e.coverAction} →</button>
          </div>
          <div className="mtl-cover-side">
            <p className="mtl-label">{b.overview.active}</p>
            {c.projects.map((p, i) => <button type="button" key={p.id} onClick={() => goTo(i + 2)} className="mtl-cover-project"><span>0{i + 1}</span><strong>{p.name}</strong><span>↗</span></button>)}
            <p className="mtl-boundary">{b.cover.boundary}</p>
          </div>
        </div>
        <div className="mtl-flow">{b.cover.flow.map((item, i) => <div key={item}><span>0{i + 1}</span><strong>{item}</strong>{i < 2 && <b aria-hidden="true">→</b>}</div>)}</div>
      </>}

      {index === 1 && <>
        <div className="mtl-overview-head">
          <div><span className="mtl-mota-logo mtl-mota-logo-small"><Image src="/logos/mota-techlink-logo-v2.webp" alt="MOTA TECH LINK logo" width={220} height={70} /></span><h1 tabIndex={-1}>{d.title}</h1><p className="mtl-lead">{b.overview.intro}</p></div>
          <div className="mtl-philosophy">{[[e.missionLabel, e.mission], [e.visionLabel, e.vision], [e.modelLabel, e.model], [e.techLabel, e.tech]].map(([title, body]) => <div key={title}><strong>{title}</strong><p>{body}</p></div>)}</div>
        </div>
        <div className="mtl-overview-bar"><strong>{e.founders}</strong><div className="mtl-people">{founders.map(person => <PersonButton key={person.name} person={person} onClick={() => openPerson(person)} />)}</div><span className="mtl-boundary">{b.overview.boundary}</span></div>
        <div className="mtl-portfolio"><h2>{b.overview.active}</h2><div className="mtl-project-grid">{c.projects.map((p, i) => <article className="mtl-project-card" key={p.id}><Logo project={p} /><div><h3>{p.name}</h3><p>{p.summary}</p><div className="mtl-actions"><button type="button" onClick={() => goTo(i + 2)}>{e.explore} →</button><button type="button" onClick={() => setSelected(makeProject(p, b.projects[i]))}>{e.details} →</button><ExternalLink href={p.url}>{c.gallery.website}</ExternalLink></div></div></article>)}</div></div>
        <div className="mtl-cases"><h2>{b.overview.cases}</h2><div>{caseSlugs.map((slug, i) => <article key={slug}><span aria-hidden="true">{caseIcons[i]}</span><p><strong>{c.sections[7].items[i]}</strong> · {e.caseDescriptions[i]} <ExternalLink href={projectUrl(slug)}>{e.caseLink}</ExternalLink></p></article>)}</div></div>
      </>}

      {project && brief && <>
        <div className="mtl-project-head">
          <Logo project={project} />
          <div><h1 tabIndex={-1}>{d.title}</h1><p className="mtl-lead">{brief.lead}</p></div>
          <div className="mtl-project-links"><button type="button" className="mtl-action" onClick={() => setSelected(makeProject(project, brief))}>{e.details} →</button>{brief.links.map((label, i) => <ExternalLink key={label} href={projectIndex === 2 && i === 1 ? `/${showcaseLocale}/contact` : projectLinks[projectIndex][i]}>{label}</ExternalLink>)}</div>
        </div>
        <div className={`mtl-block-grid mtl-project-${projectIndex}`}>{brief.blocks.map((block, i) => <article className="mtl-block" key={block.title}><span className="mtl-block-number">0{i + 1}</span><div><h2>{block.title}</h2><p>{block.body}</p></div></article>)}</div>
        <div className="mtl-team"><div><p className="mtl-label">{c.gallery.team}</p><p className="mtl-boundary">{brief.source}</p></div><div className="mtl-people">{brief.people.map(person => <PersonButton key={person.name} person={person} onClick={() => openPerson(person, project)} />)}</div></div>
      </>}

      {index === 6 && <>
        <div className="mtl-simple-head"><h1 tabIndex={-1}>{d.title}</h1><p className="mtl-lead">{b.network.lead}</p></div>
        <div className="mtl-network-grid">{b.network.blocks.map((item, i) => <article className="mtl-block" key={item}><span className="mtl-block-number">0{i + 1}</span><h2>{item}</h2></article>)}</div>
        <div className="mtl-end-bar"><p className="mtl-boundary">{b.network.boundary}</p><button className="mtl-action" type="button" onClick={() => goTo(7)}>{e.cta} →</button></div>
      </>}

      {index === 7 && <>
        <div className="mtl-simple-head"><span className="mtl-mota-logo mtl-mota-logo-small"><Image src="/logos/mota-techlink-logo-v2.webp" alt="MOTA TECH LINK logo" width={220} height={70} /></span><h1 tabIndex={-1}>{d.title}</h1><p className="mtl-lead">{b.cta.lead}</p><p className="mtl-muted">{e.mission}</p></div>
        <div className="mtl-cta-grid"><div><p className="mtl-label">{b.overview.active}</p>{c.projects.map((p, i) => <button type="button" className="mtl-cover-project" key={p.id} onClick={() => goTo(i + 2)}><span>0{i + 1}</span><strong>{p.name}</strong><span>→</span></button>)}</div><div><p className="mtl-label">{e.cta}</p>{b.cta.entries.map((entry, i) => <div className="mtl-entry" key={entry}><span>0{i + 1}</span>{entry}</div>)}</div></div>
        <div className="mtl-end-bar"><p className="mtl-boundary">{b.cta.boundary}</p><a className="mtl-action" href={`/${showcaseLocale}/contact`} target="_blank" rel="noopener noreferrer">{e.cta} ↗</a></div>
      </>}
    </div>
    {selected && <ProjectDetailModal project={selected} labels={c.gallery} onClose={() => setSelected(null)} onBack={back} backLabel={e.back} />}
  </section>;
}
