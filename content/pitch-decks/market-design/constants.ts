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
  "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12";

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
    bg: "bg-[#F5F6FA]",
    text: "text-gray-900",
    sidebarBg: "bg-white",
    sidebarBorder: "border-gray-200",
    cardBg: "bg-white",
    cardBorder: "border-gray-200",
    heading: "text-gray-900",
    subheading: "text-gray-500",
    body: "text-gray-600",
    muted: "text-gray-400",
    thText: "text-gray-400",
    trBorder: "border-gray-100",
    trHover: "hover:bg-gray-50",
    navActive: "bg-indigo-50 text-indigo-700",
    navInactive: "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
    navLocked: "text-gray-300",
    overlay: "bg-black/30",
    badgeBg: "bg-gray-100",
    badgeText: "text-gray-500",
    divider: "border-gray-200",
  },
} as const;

export type ThemeTokens = (typeof THEME)[keyof typeof THEME];

