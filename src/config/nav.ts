// import { Icons } from "@/components/icons" // 假设你有图标组件，或者使用 Lucide
import navContent from "@/generated/content-config/nav.json";

export interface NavItem {
  title: string       // 翻译键 (Key)
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: string       // 可选：图标名称
  description?: string // 翻译键 (Key)
  featured?: boolean   // 标记：是否为“推荐”项 (用于桌面端显示大卡片)
}

export interface NavItemWithChildren extends NavItem {
  items: NavItem[]
}

export type MainNavItem = NavItem | NavItemWithChildren

export const mainNavConfig: MainNavItem[] = navContent as MainNavItem[];