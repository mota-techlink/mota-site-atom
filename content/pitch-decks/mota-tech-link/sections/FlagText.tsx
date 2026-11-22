"use client";

/** Self-hosted flag artwork, so country flags render identically on every OS. */
export const FLAG_CODE: Record<string, string> = {
  "🇨🇳": "cn", "🇯🇵": "jp", "🇬🇧": "gb", "🇮🇪": "ie", "🇳🇬": "ng",
  "🇳🇿": "nz", "🇹🇭": "th", "🇺🇸": "us", "🇸🇬": "sg", "🇦🇺": "au", "🇪🇺": "eu",
};

export function flagSrc(code: string) {
  return `/images/flags/flag_${code}.svg`;
}

/** Split a leading emoji flag off a localised label. */
export function splitFlag(text: string): { code: string | null; label: string } {
  const m = text.match(/^([\u{1F1E6}-\u{1F1FF}]{2})\s*/u);
  if (!m) return { code: null, label: text };
  return { code: FLAG_CODE[m[1]] ?? null, label: text.slice(m[0].length) };
}

export function Flag({ code, size = 18 }: { code: string | null | undefined; size?: number }) {
  if (!code) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="mtl-flag" src={flagSrc(code)} alt="" width={size} height={Math.round(size * 0.7)} loading="lazy" aria-hidden="true" />;
}

/** Renders a label with an optional leading flag, as crisp SVG artwork. */
export function FlagText({ text, flagCode, children }: { text: string; flagCode?: string | null; children?: React.ReactNode }) {
  const parsed = splitFlag(text);
  const code = flagCode ?? parsed.code;
  const label = flagCode ? text : parsed.label;
  return (
    <span className="mtl-flagtext">
      <Flag code={code} />
      <span>{children ?? label}</span>
    </span>
  );
}
