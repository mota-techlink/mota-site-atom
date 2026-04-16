import en from "./locale/en.json";
import zh from "./locale/zh.json";

export const SECTION_IDS = [
  "s-hero",
  "s-role",
  "s-structure",
  "s-design",
  "s-components",
  "s-bootstrap",
  "s-workflow",
  "s-cta",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_MAP = Object.fromEntries(
  SECTION_IDS.map((id, i) => [id, i])
) as Record<string, number>;

export const LOCALES = ["en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  zh: "中文",
};

export const contentMap = { en, zh };
export type ContentType = typeof en;

/** Base class for section page wrapper */
export const PAGE =
  "h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent";

/** Inner content container */
export const PAGE_INNER = "w-[85%] mx-auto py-8 sm:py-12";

export const THEME = {
  dark: {
    bg: "bg-[#0B0D14]",
    text: "text-white",
    sidebarBg: "bg-[#0E1020]",
    sidebarBorder: "border-white/15",
    cardBg: "bg-[#1c1f2e]",
    cardBorder: "border-white/15",
    heading: "text-white",
    subheading: "text-white/85",
    body: "text-white/75",
    muted: "text-white/60",
    thText: "text-white/65",
    trBorder: "border-white/12",
    trHover: "hover:bg-white/[0.06]",
    navActive: "bg-indigo-500/20 text-indigo-200",
    navInactive: "text-white/70 hover:text-white hover:bg-white/8",
    navLocked: "text-white/30",
    overlay: "bg-black/60",
    badgeBg: "bg-white/[0.14]",
    badgeText: "text-white/80",
    divider: "border-white/12",
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
