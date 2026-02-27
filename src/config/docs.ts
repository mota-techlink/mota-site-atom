// src/config/docs.ts
import docsNavContent from "@/generated/content-config/docs-nav.json";

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: SidebarNavItem[];
    }
);

type DocsNavSectionContent = {
  titleKey: string;
  items: {
    titleKey: string;
    href: string;
  }[];
};

/**
 * 根据翻译函数生成文档侧边栏配置
 * @param t - 翻译函数，对应 "DocsNav" 命名空间
 */
export function getDocsConfig(t: (key: string) => string): { sidebarNav: SidebarNavItem[] } {
  const sections = docsNavContent as DocsNavSectionContent[];

  return {
    sidebarNav: sections.map((section) => ({
      title: t(section.titleKey),
      items: section.items.map((item) => ({
        title: t(item.titleKey),
        href: item.href,
      })),
    })),
  };
}