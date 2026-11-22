"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ContentType } from "../constants";

type Project = ContentType["projects"][number] & { photo?: string };
type GalleryLabels = ContentType["gallery"];
type SlideId = "overview" | "capabilities" | "team";
const SLIDE_IDS: SlideId[] = ["overview", "capabilities", "team"];

export function ProjectDetailModal({ project, labels, onClose, onBack, backLabel }: {
  project: Project; labels: GalleryLabels; onClose: () => void; onBack?: () => void; backLabel?: string;
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key === "ArrowLeft") setActiveSlide((n) => Math.max(0, n - 1));
      if (event.key === "ArrowRight") setActiveSlide((n) => Math.min(2, n + 1));
      if (event.key === "Tab") {
        const items = dialogRef.current?.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),[tabindex]:not([tabindex="-1"])');
        if (!items?.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", key);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("keydown", key); document.body.style.overflow = oldOverflow; previous?.focus(); };
  }, [onClose]);
  const slide = SLIDE_IDS[activeSlide];
  const title = labels[slide];
  return createPortal(
    <div className="mtl-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mtl-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="mtl-person-title">
        <header className="mtl-modal-head">
          <div className="mtl-modal-avatar">
            {project.photo ? <Image src={project.photo} alt="" width={72} height={72} /> : project.logo ? <Image src={project.logo} alt="" width={72} height={72} /> : project.mark}
          </div>
          <div><p className="mtl-eyebrow">{title}</p><h2 id="mtl-person-title">{project.name}</h2><p>{project.summary}</p></div>
          <button ref={closeRef} type="button" className="mtl-modal-close" onClick={onClose} aria-label={labels.close}>×</button>
        </header>
        <nav className="mtl-modal-tabs" aria-label={`${project.name} · ${labels.open}`}>
          {SLIDE_IDS.map((id, i) => <button key={id} type="button" aria-current={activeSlide === i ? "step" : undefined} onClick={() => setActiveSlide(i)}>{labels[id]}</button>)}
        </nav>
        <div className="mtl-modal-body" aria-live="polite">
          {slide === "overview" && <div className="mtl-modal-role"><span className="mtl-orbit-number">01</span><div><h3>{project.overview.title}</h3><p>{project.overview.body}</p></div></div>}
          {slide === "capabilities" && <div className="mtl-modal-capabilities">{project.capabilities.map((item, i) => <article key={item.title}><span>{String(i + 1).padStart(2, "0")}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div>}
          {slide === "team" && <div className="mtl-modal-experience"><div className="mtl-modal-story"><h3>{labels.team}</h3><ul>{project.overview.points.map((point) => <li key={point}>✦ {point}</li>)}</ul></div><div className="mtl-modal-case"><h3>{labels.sourceNote}</h3><ul>{[...project.sources, ...project.pending].slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul></div></div>}
        </div>
        <footer className="mtl-modal-foot"><button type="button" onClick={() => setActiveSlide((n) => Math.max(0, n - 1))} disabled={activeSlide === 0}>← {labels.previous}</button>{onBack && <button type="button" onClick={onBack}>{backLabel}</button>}<span>{activeSlide + 1} / 3</span><button type="button" onClick={() => setActiveSlide((n) => Math.min(2, n + 1))} disabled={activeSlide === 2}>{labels.next} →</button></footer>
      </div>
    </div>, document.body,
  );
}
