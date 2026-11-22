"use client";
import Image from "next/image";

export function initials(name: string) {
  const latin = name.replace(/[^\x20-\x7E]/g, "").trim();
  const cjk = name.replace(/[\x20-\x7E]/g, "").trim();
  if (cjk.length >= 1 && cjk.length <= 4) return cjk.slice(-2);
  const parts = latin.split(/\s+/).filter(Boolean);
  if (!parts.length) return cjk.slice(0, 2) || "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name, photo, size = 56, ring }: { name: string; photo?: string; size?: number; ring?: boolean }) {
  return (
    <span className={`mtl-avatar${ring ? " is-ring" : ""}`} style={{ width: size, height: size }} aria-hidden="true">
      {photo ? <Image src={photo} alt="" width={size} height={size} /> : <b>{initials(name)}</b>}
    </span>
  );
}
