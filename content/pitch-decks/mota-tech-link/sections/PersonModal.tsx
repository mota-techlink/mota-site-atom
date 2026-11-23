"use client";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "./Avatar";

export type Person = {
  name: string; role: string; roleDesc: string;
  caps: string[]; exp: string[]; photo?: string; link?: string;
};
type Labels = { tabs: string[]; close: string; previous: string; next: string };

export function PersonModal({ person, labels, onClose }: { person: Person; labels: Labels; onClose: () => void }) {
  const [tab, setTab] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key === "ArrowLeft") setTab((n) => Math.max(0, n - 1));
      if (event.key === "ArrowRight") setTab((n) => Math.min(2, n + 1));
      if (event.key === "Tab") {
        const items = dialogRef.current?.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),[tabindex]:not([tabindex="-1"])');
        if (!items?.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("keydown", onKey); document.body.style.overflow = old; previous?.focus(); };
  }, [onClose]);

  const body = tab === 0
    ? <p className="mtl-modal-text">{person.roleDesc}</p>
    : <ul className="mtl-modal-list">{(tab === 1 ? person.caps : person.exp).map((item) => <li key={item}><span aria-hidden="true">◆</span>{item}</li>)}</ul>;

  return createPortal(
    <div className="mtl-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mtl-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="mtl-person-name">
        <header className="mtl-modal-head">
          <Avatar name={person.name} photo={person.photo} size={64} ring />
          <div className="mtl-modal-id">
            <p className="mtl-modal-kicker">{labels.tabs[tab]}</p>
            <h2 id="mtl-person-name">{person.name}</h2>
            <p className="mtl-modal-role">{person.role}</p>
            {person.link ? <a className="mtl-modal-src" href={person.link} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a> : null}
          </div>
          <button ref={closeRef} type="button" className="mtl-modal-close" onClick={onClose} aria-label={labels.close}>×</button>
        </header>
        <nav className="mtl-modal-tabs" aria-label={person.name}>
          {labels.tabs.map((label, i) => (
            <button key={label} type="button" aria-current={tab === i ? "step" : undefined} onClick={() => setTab(i)}>{label}</button>
          ))}
        </nav>
        <div className="mtl-modal-body">{body}</div>
        <footer className="mtl-modal-foot">
          <button type="button" onClick={() => setTab((n) => Math.max(0, n - 1))} disabled={tab === 0}>← {labels.previous}</button>
          <span>{tab + 1} / 3</span>
          <button type="button" onClick={() => setTab((n) => Math.min(2, n + 1))} disabled={tab === 2}>{labels.next} →</button>
        </footer>
      </div>
    </div>, document.body,
  );
}
