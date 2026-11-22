"use client";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useEffect, useRef } from "react";

export type Official = { name: string; role: string; photo: string; link: string };

export function OfficialModal({ official, onClose, labels }: { official: Official; onClose: () => void; labels: { close: string; officialTitle: string } }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); onClose(); } };
    document.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("keydown", onKey); document.body.style.overflow = old; previous?.focus(); };
  }, [onClose]);

  return createPortal(
    <div className="mtl-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mtl-modal is-official" role="dialog" aria-modal="true" aria-labelledby="mtl-official-name">
        <button ref={closeRef} type="button" className="mtl-modal-close" onClick={onClose} aria-label={labels.close}>×</button>
        <div className="mtl-official-photo">
          <Image src={official.photo} alt={official.name} width={320} height={320} />
        </div>
        <p className="mtl-modal-kicker">{labels.officialTitle}</p>
        <h2 id="mtl-official-name">{official.name}</h2>
        <p className="mtl-official-role">{official.role}</p>
        <a className="mtl-link" href={official.link} target="_blank" rel="noopener noreferrer">elmsflo.com ↗</a>
      </div>
    </div>, document.body,
  );
}
