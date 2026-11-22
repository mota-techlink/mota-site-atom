"use client";
import { useState } from "react";
import Image from "next/image";
import { useDeckLocale } from "@/components/pitch-deck";
import { useContent, useNav } from "../hooks";
import { ProjectDetailModal } from "./ProjectDetailModal";
import type { ContentType } from "../constants";

type Project = ContentType["projects"][number];
const caseSlugs = ["Lingjii-Lighting-AI", "AI-Voice-USB", "Lingjii-Pet-AI", "AI-Smart-Cane", "GenAI-Driven", "Textile-Logo-QA"];
const caseIcons = ["☼", "◉", "◇", "⌁", "▣", "◎"];
const panel = "rounded-2xl border border-white/10 bg-white/[0.04] p-5";
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300";

function ExternalLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`inline-flex items-center gap-1 text-sm font-semibold text-cyan-200 underline decoration-cyan-200/40 underline-offset-4 hover:decoration-current ${focus}`}>{children}<span aria-hidden="true"> ↗</span></a>;
}

function PersonButton({ label, role, onClick }: { label: string; role: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-label={`${label} · ${role}`} className={`flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left hover:bg-white/10 ${focus}`}>
    {label === "Harling Sun" ? <Image src="/images/team/Harling.jpg" alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" /> : <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 text-xl text-white/70">?</span>}
    <span><span className="block font-bold text-white">{label}</span><span className="block text-sm text-white/65">{role}</span></span>
  </button>;
}

export function MotaSection({ index, goTo: navigate }: { index: number; goTo?: (idx: number) => void }) {
  const c = useContent();
  const { deckLocale } = useDeckLocale();
  const fallback = useNav();
  const goTo = navigate ?? fallback;
  const [selected, setSelected] = useState<Project | null>(null);
  const e = c.editorial;
  const d = c.sections[index === 7 ? 8 : index];
  const activeProject = index >= 2 && index <= 5 ? c.projects[index - 2] : null;
  const showcaseLocale = ["en", "zh", "ja"].includes(deckLocale) ? deckLocale : "en";
  const showcase = `/${showcaseLocale}/showcase`;
  const projectUrl = (slug: string) => `https://github.com/mota-techlink/mota-site-atom/blob/main/content/showcase/${slug}${showcaseLocale === "en" ? "" : `.${showcaseLocale}`}.md`;
  const synthetic = (name: string, mark: string, logo: string | undefined, summary: string, body: string, points: string[], pending: string[], isPerson = false): Project => ({
    id: name, name, mark, logo, url: showcase, summary,
    overview: { title: name, body, points },
    capabilities: points.map((point, i) => ({ title: (isPerson ? [c.gallery.capabilities, c.gallery.team] : [e.missionLabel, e.modelLabel, e.techLabel])[i] ?? c.gallery.overview, body: point })),
    team: isPerson ? [{ name, role: summary }] : [{ name: "Harling Sun", role: e.founderRole }, { name: "Franklin Ng", role: e.franklinRole }],
    sources: isPerson && name === "Franklin Ng" ? [e.source] : [e.source, e.harlingDetail], pending,
  });
  const mota = () => setSelected(synthetic("MOTA TECH LINK", "M", "/logos/mota-techlink-logo-v2.webp", e.mission, e.vision, [e.mission, e.model, e.tech], [e.casesNote, e.franklinBio]));
  const person = (franklin = false) => setSelected(synthetic(
    franklin ? "Franklin Ng" : "Harling Sun",
    franklin ? "?" : "HS",
    franklin ? undefined : "/images/team/Harling.jpg",
    franklin ? e.franklinRole : e.founderRole,
    franklin ? e.franklinBio : e.harlingBio,
    franklin ? [e.franklinBio] : [e.harlingSkills, e.harlingExperience],
    [franklin ? e.franklinBio : e.casesNote], true,
  ));
  const back = () => {
    setSelected(null);
    goTo(1);
    requestAnimationFrame(() => document.querySelector<HTMLElement>('.mtl-slide[data-state="active"] h1')?.focus());
  };

  return <section className="relative h-full w-full overflow-y-auto overscroll-contain px-5 pb-24 pt-20 sm:px-10 lg:px-20 xl:px-28">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] bg-gradient-to-br from-cyan-400/10 via-transparent to-violet-500/10" />
    <div className="relative mx-auto w-full max-w-7xl">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">{String(index + 1).padStart(2, "0")} · {d.eyebrow}</p>
        {index > 1 && <button type="button" onClick={() => goTo(1)} className={`rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/75 ${focus}`}>↩ {e.back}</button>}
      </div>

      {index === 1 ? <>
        <div className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[1.25fr_.75fr]">
          <div>
            <button type="button" onClick={mota} aria-label={`${e.details}: MOTA TECH LINK`} className={`mb-7 rounded-xl bg-white p-3 ${focus}`}><Image src="/logos/mota-techlink-logo-v2.webp" alt="MOTA TECH LINK" width={240} height={70} className="h-12 w-auto object-contain sm:h-16" /></button>
            <h1 tabIndex={-1} className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">{d.title}</h1>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-cyan-200">{e.missionLabel}</p>
            <p className="mt-2 max-w-3xl text-lg leading-8 text-white/75">{e.mission}</p>
            <button type="button" onClick={mota} className={`mt-5 text-sm font-semibold text-cyan-200 underline underline-offset-4 ${focus}`}>{e.details} →</button>
          </div>
          <div className="grid gap-4">
            {[[e.visionLabel, e.vision], [e.modelLabel, e.model], [e.techLabel, e.tech]].map(([title, body]) => <div key={title} className="border-l-2 border-cyan-300/60 pl-5"><h2 className="text-sm font-bold uppercase tracking-wider text-cyan-200">{title}</h2><p className="mt-1 text-sm leading-6 text-white/75">{body}</p></div>)}
          </div>
        </div>
        <div className="grid gap-5 border-b border-white/10 py-9 md:grid-cols-[.35fr_1fr]">
          <h2 className="text-2xl font-bold text-white">{e.founders}</h2>
          <div className="grid gap-3 sm:grid-cols-2"><PersonButton label="Harling Sun" role={e.founderRole} onClick={() => person()} /><PersonButton label="Franklin Ng" role={e.franklinRole} onClick={() => person(true)} /></div>
        </div>
        <div className="border-b border-white/10 py-10">
          <h2 className="text-3xl font-bold text-white">{e.portfolio}</h2><p className="mt-2 text-sm text-white/65">{e.portfolioNote}</p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">{c.projects.map((project, i) => <article key={project.id} className={`${panel} flex flex-col gap-3`}>
            <div className="flex items-center gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white p-1 text-sm font-bold text-slate-900">{project.logo ? <Image src={project.logo} alt="" width={44} height={44} className="h-full w-full object-contain" /> : project.mark}</span><h3 className="text-lg font-bold text-white">{project.name}</h3></div>
            <p className="flex-1 text-sm leading-6 text-white/70">{project.summary}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2"><button type="button" aria-label={`${e.explore}: ${project.name}`} onClick={() => goTo(i + 2)} className={`text-sm font-semibold text-cyan-200 underline underline-offset-4 ${focus}`}>{e.explore} →</button><button type="button" aria-label={`${e.details}: ${project.name}`} onClick={() => setSelected(project)} className={`text-sm font-semibold text-cyan-200 underline underline-offset-4 ${focus}`}>{e.details} →</button><ExternalLink href={project.url} label={`${c.gallery.website}: ${project.name}`}>{c.gallery.website}</ExternalLink></div>
          </article>)}</div>
        </div>
        <div className="py-10"><h2 className="text-3xl font-bold text-white">{e.cases}</h2><p className="mt-2 text-sm text-white/65">{e.casesNote}</p>
          <div className="mt-6 grid gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-3">{caseSlugs.map((slug, i) => <article key={slug} className="flex gap-3 border-t border-white/10 pt-4"><span aria-hidden="true" className="text-2xl text-cyan-200">{caseIcons[i]}</span><div><h3 className="font-bold text-white">{c.sections[7].items[i]}</h3><p className="mt-1 text-sm leading-6 text-white/70">{e.caseDescriptions[i]}</p><ExternalLink href={projectUrl(slug)} label={`${e.caseLink}: ${c.sections[7].items[i]}`}>{e.caseLink}</ExternalLink></div></article>)}</div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6"><p className="max-w-3xl text-xs leading-5 text-white/65">{e.source}</p><ExternalLink href={`/${showcaseLocale}/contact`} label={`${e.cta}: MOTA TECH LINK`}>{e.cta}</ExternalLink></div>
      </> : activeProject ? <>
        <div className={`grid gap-8 border-b border-white/10 pb-10 lg:items-end ${index % 2 ? "lg:grid-cols-[.8fr_1.2fr]" : "lg:grid-cols-[1.2fr_.8fr]"}`}>
          <div className={index % 2 ? "lg:order-2" : ""}><h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">{d.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">{activeProject.overview.body}</p></div>
          <div className={`${panel} ${index % 2 ? "lg:order-1" : ""}`}><p className="text-xs font-bold uppercase tracking-widest text-cyan-200">{activeProject.name}</p><h2 className="mt-3 text-2xl font-bold text-white">{activeProject.overview.title}</h2><p className="mt-3 text-sm leading-6 text-white/70">{activeProject.summary}</p><div className="mt-5 flex flex-wrap gap-4"><button type="button" onClick={() => setSelected(activeProject)} className={`text-sm font-semibold text-cyan-200 underline underline-offset-4 ${focus}`}>{e.details} →</button><ExternalLink href={activeProject.url} label={`${c.gallery.website}: ${activeProject.name}`}>{c.gallery.website}</ExternalLink>{index === 5 && <ExternalLink href="https://drive.google.com/file/d/1ckJ0lmtw3F9C1dkobx1Zz4UfzwRKJRK-/view" label={`${e.document}: ${activeProject.name}`}>{e.document}</ExternalLink>}{index === 2 && <ExternalLink href={`/${showcaseLocale}/pitch-deck/ireland-gateway`} label={`${e.document}: Ireland Gateway`}>Ireland Gateway</ExternalLink>}</div></div>
        </div>
        <div className="grid gap-8 py-9 lg:grid-cols-[.35fr_1fr]"><div><h2 className="text-2xl font-bold text-white">{e.flow}</h2><p className="mt-3 text-sm leading-6 text-white/65">{activeProject.summary}</p></div><ol className={`grid gap-3 ${index === 4 ? "sm:grid-cols-2" : ""}`}>{activeProject.capabilities.map((capability, i) => <li key={capability.title} className="flex gap-4 border-t border-white/10 pt-4"><span className="text-sm font-bold text-cyan-200">0{i + 1}</span><div><h3 className="font-bold text-white">{capability.title}</h3><p className="mt-1 text-sm leading-6 text-white/70">{capability.body}</p></div></li>)}</ol></div>
        <div className="grid gap-5 border-t border-white/10 py-9 lg:grid-cols-[1fr_1fr_.7fr]">
          <div><h2 className="text-xl font-bold text-white">{e.evidence}</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-white/70">{activeProject.sources.map(source => <li key={source}>• {source}</li>)}</ul></div>
          <div><h2 className="text-xl font-bold text-white">{c.gallery.pending}</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-white/70">{activeProject.pending.map(item => <li key={item}>• {item}</li>)}</ul></div>
          <div><h2 className="mb-4 text-xl font-bold text-white">{e.person}</h2><PersonButton label="Harling Sun" role={index === 5 ? e.videoRole : e.role} onClick={() => person()} /></div>
        </div>
      </> : <div className="grid min-h-[65vh] items-center gap-10 lg:grid-cols-2"><div><h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">{d.title}</h1><p className="mt-6 text-lg leading-8 text-white/70">{d.body}</p><button type="button" onClick={() => goTo(1)} className={`mt-8 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 mtl-primary ${focus}`}>{e.coverAction} →</button></div><div className={`${panel} grid gap-4 sm:grid-cols-2`}>{d.items.map(item => <p key={item} className="border-l-2 border-cyan-300/60 pl-4 text-sm font-semibold leading-6 text-white/80">{item}</p>)}</div></div>}
    </div>
    {selected && <ProjectDetailModal project={selected} labels={c.gallery} onClose={() => setSelected(null)} onBack={back} backLabel={e.back} />}
  </section>;
}
