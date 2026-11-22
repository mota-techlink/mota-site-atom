"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ContentType } from "../constants";

type Project = ContentType["projects"][number];
type GalleryLabels = ContentType["gallery"];
type SlideId = keyof Pick<GalleryLabels, "overview" | "capabilities" | "team" | "sources" | "pending">;

const SLIDE_IDS: SlideId[] = ["overview", "capabilities", "team", "sources", "pending"];

export function ProjectDetailModal({
  project,
  labels,
  onClose,
  onBack,
  backLabel,
}: {
  project: Project;
  labels: GalleryLabels;
  onClose: () => void;
  onBack?: () => void;
  backLabel?: string;
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveSlide((current) => Math.max(0, current - 1));
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveSlide((current) => Math.min(SLIDE_IDS.length - 1, current + 1));
      } else if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  const slideId = SLIDE_IDS[activeSlide];
  const slideTitle = labels[slideId];

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onTouchStart={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" aria-hidden="true" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mtl-project-title"
        aria-describedby="mtl-project-summary"
        aria-label={`${project.name} · ${slideTitle}`}
        className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-slate-950 text-white shadow-2xl shadow-cyan-950/50"
      >
        <header className="flex items-start gap-4 border-b border-white/10 px-4 py-4 pr-14 sm:px-7 sm:py-6">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/30 bg-white/90 p-1 text-center text-sm font-black tracking-tight text-cyan-100 sm:h-14 sm:w-14 sm:text-base"
          >
            {project.logo ? <Image src={project.logo} alt="" width={56} height={56} className="h-full w-full object-contain" /> : <span className="text-slate-800">{project.mark}</span>}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
              {slideTitle}
            </p>
            <h2 id="mtl-project-title" className="mt-1 text-xl font-black leading-tight sm:text-3xl">
              {project.name}
            </h2>
            <p id="mtl-project-summary" className="mt-1 text-sm leading-5 text-white/65 sm:text-base">
              {project.summary}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-2xl text-white/80 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 sm:right-5 sm:top-5"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <nav aria-label={`${project.name} · ${labels.open}`} className="flex gap-2 overflow-x-auto border-b border-white/10 px-4 py-3 sm:px-7">
          {SLIDE_IDS.map((id, index) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-current={activeSlide === index ? "step" : undefined}
              className={`shrink-0 rounded-full border px-3 py-2 text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 ${
                activeSlide === index
                  ? "border-cyan-200/50 bg-cyan-200/15 text-cyan-100"
                  : "border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {labels[id]}
            </button>
          ))}
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-7 sm:py-7" aria-live="polite">
          {slideId === "overview" && (
            <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
              <div>
                <h3 className="text-2xl font-bold sm:text-3xl">{project.overview.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">{project.overview.body}</p>
              </div>
              <ul className="grid content-start gap-3">
                {project.overview.points.map((point) => (
                  <li key={point} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/75">
                    <span className="mr-2 text-cyan-200" aria-hidden="true">◆</span>{point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {slideId === "capabilities" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {project.capabilities.map((capability, index) => (
                <article key={capability.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                  <p className="text-xs font-semibold tracking-widest text-cyan-200/80">0{index + 1}</p>
                  <h3 className="mt-2 text-lg font-bold">{capability.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">{capability.body}</p>
                </article>
              ))}
            </div>
          )}

          {slideId === "team" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {project.team.map((member) => (
                <article key={member.name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">{member.role}</p>
                </article>
              ))}
            </div>
          )}

          {slideId === "sources" && (
            <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <h3 className="text-xl font-bold">{labels.sourceNote}</h3>
                <ul className="mt-4 grid gap-3">
                  {project.sources.map((source) => (
                    <li key={source} className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/70">
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${labels.website}: ${project.name}`}
                className="inline-flex h-fit items-center justify-center gap-2 rounded-full border border-cyan-200/35 bg-cyan-200/10 px-5 py-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-200/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
              >
                {labels.website}<span aria-hidden="true">↗</span>
              </a>
            </div>
          )}

          {slideId === "pending" && (
            <div>
              <h3 className="text-xl font-bold">{labels.pending}</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {project.pending.map((item) => (
                  <li key={item} className="rounded-2xl border border-amber-200/15 bg-amber-100/[0.04] p-4 text-sm leading-6 text-white/70">
                    <span className="mr-2 text-amber-200" aria-hidden="true">◷</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-white/10 px-4 py-3 sm:px-7">
          <button
            type="button"
            onClick={() => setActiveSlide((current) => Math.max(0, current - 1))}
            disabled={activeSlide === 0}
            aria-label={labels.previous}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/75 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            <span aria-hidden="true">←</span><span className="ml-2 hidden sm:inline">{labels.previous}</span>
          </button>
          {onBack && <button type="button" onClick={onBack} className="rounded-full border border-white/15 px-3 py-2 text-xs text-white/80 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">{backLabel}</button>}
          <span className="text-xs tabular-nums text-white/50">{activeSlide + 1} / {SLIDE_IDS.length}</span>
          <button
            type="button"
            onClick={() => setActiveSlide((current) => Math.min(SLIDE_IDS.length - 1, current + 1))}
            disabled={activeSlide === SLIDE_IDS.length - 1}
            aria-label={labels.next}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/75 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            <span className="mr-2 hidden sm:inline">{labels.next}</span><span aria-hidden="true">→</span>
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
