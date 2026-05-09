import { ContentType } from "./constants";

// ─── Types ───────────────────────────────────────────────────────────────

export interface SearchHit {
  sectionId: string;
  sectionLabel: string;
  context: string; // snippet of matched text, ~80 chars
  field: string;
}

interface SearchIndex {
  sectionId: string;
  sectionLabel: string;
  /** Flattened plain‑text body of this section */
  text: string;
}

// ─── Index building ──────────────────────────────────────────────────────

const SECTION_ORDER = [
  "cover", "background", "products", "scanning", "engine",
  "pipeline", "billing", "architecture", "portals", "partners",
];

function collectText(value: unknown): string[] {
  const results: string[] = [];
  if (typeof value === "string") {
    results.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === "string") {
        results.push(item);
      } else if (typeof item === "object" && item !== null) {
        for (const v of Object.values(item as Record<string, unknown>)) {
          results.push(...collectText(v));
        }
      }
    }
  } else if (typeof value === "object" && value !== null) {
    for (const v of Object.values(value as Record<string, unknown>)) {
      results.push(...collectText(v));
    }
  }
  return results;
}

function buildIndex(c: ContentType): SearchIndex[] {
  const sections = c.nav.sections as Record<string, string>;
  return SECTION_ORDER.map((key) => {
    const sectionData = (c as Record<string, unknown>)[key];
    const texts = sectionData ? collectText(sectionData) : [];
    return {
      sectionId: `s-${key}`,
      sectionLabel: sections[key] ?? key,
      text: texts.join(" "),
    };
  });
}

// ─── Search ───────────────────────────────────────────────────────────────

/**
 * Returns up to `limit` hits ordered by section order.
 * Matching is case‑insensitive substring match (Chinese characters work natively).
 */
export function searchDeck(query: string, c: ContentType, limit = 20): SearchHit[] {
  if (!query.trim()) return [];

  const q = query.trim().toLowerCase();
  const index = buildIndex(c);
  const results: SearchHit[] = [];

  for (const entry of index) {
    if (results.length >= limit) break;

    const lowerText = entry.text.toLowerCase();
    const pos = lowerText.indexOf(q);
    if (pos === -1) continue;

    const context = extractSnippet(entry.text, pos, q.length);
    results.push({
      sectionId: entry.sectionId,
      sectionLabel: entry.sectionLabel,
      context,
      field: "",
    });
  }

  return results;
}

function extractSnippet(fullText: string, pos: number, queryLen: number): string {
  const start = Math.max(0, pos - 30);
  const end = Math.min(fullText.length, pos + queryLen + 50);
  let snippet = fullText.slice(start, end).replace(/\s+/g, " ").trim();
  if (start > 0) snippet = "…" + snippet;
  if (end < fullText.length) snippet = snippet + "…";
  return snippet;
}
