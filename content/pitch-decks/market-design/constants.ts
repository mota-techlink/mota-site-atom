import zh from "./locale/zh.json";
import en from "./locale/en.json";

export const SECTION_IDS = [
  "s-background",
  "s-cover",
  "s-analysis",
  "s-scanners",
  "s-mining",
  "s-reply",
  "s-partner",
  "s-erd",
  "s-edge",
  "s-billing",
  "s-dashboard",
  "s-schedule",
  "s-i18n",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** Maps section ID → slide index */
export const SECTION_MAP = Object.fromEntries(
  SECTION_IDS.map((id, i) => [id, i])
) as Record<string, number>;

/** Number of free pages for unauthenticated users */
export const FREE_PAGE_LIMIT = 3;

export const LOCALES = ["zh", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<string, string> = {
  zh: "中文",
  en: "EN",
};

export const contentMap = { zh, en };
export type ContentType = typeof zh;

/**
 * Base class for section content wrapper.
 * Scrollable page with consistent padding.
 */
export const PAGE =
  "h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent";

/**
 * Inner content container with max-width and padding.
 */
export const PAGE_INNER =
  "w-[85%] mx-auto py-8 sm:py-12";

/* ─── Theme token maps ─────────────────────────────────────────────────────── */
export const THEME = {
  dark: {
    // Shell
    bg: "bg-[#14161E]",
    text: "text-white",
    sidebarBg: "bg-[#14161E]",
    sidebarBorder: "border-white/10",
    // Content
    cardBg: "bg-white/[0.06]",
    cardBorder: "border-white/10",
    heading: "text-white",
    subheading: "text-white/70",
    body: "text-white/60",
    muted: "text-white/45",
    // Table
    thText: "text-white/55",
    trBorder: "border-white/8",
    trHover: "hover:bg-white/[0.04]",
    // Nav
    navActive: "bg-indigo-500/15 text-indigo-300",
    navInactive: "text-white/60 hover:text-white/85 hover:bg-white/5",
    navLocked: "text-white/25",
    // Overlay
    overlay: "bg-black/60",
    // Accent badge
    badgeBg: "bg-white/[0.06]",
    badgeText: "text-white/50",
    // Divider
    divider: "border-white/10",
  },
  light: {
    bg: "bg-[#EEEBF7]",
    text: "text-[#1E1536]",
    sidebarBg: "bg-[#E8E3F3]",
    sidebarBorder: "border-[#D0C8E4]",
    cardBg: "bg-[#E2DCF0]",
    cardBorder: "border-[#D0C8E4]",
    heading: "text-[#1A1230]",
    subheading: "text-[#4A3D66]",
    body: "text-[#37294F]",
    muted: "text-[#7A6E96]",
    thText: "text-[#7A6E96]",
    trBorder: "border-[#D6CEE8]",
    trHover: "hover:bg-[#DBD3ED]",
    navActive: "bg-[#D6CBF0] text-[#4A18A8]",
    navInactive: "text-[#4A3D66] hover:text-[#1A1230] hover:bg-[#DBD3ED]",
    navLocked: "text-[#B0A7C4]",
    overlay: "bg-black/30",
    badgeBg: "bg-[#D6CEE8]",
    badgeText: "text-[#4A3D66]",
    divider: "border-[#D0C8E4]",
  },
} as const;

export type ThemeTokens = (typeof THEME)[keyof typeof THEME];

