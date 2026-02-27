// src/config/menu.ts
import menuContent from "@/generated/content-config/menu.json";

// 1. 定义允许的图标名称类型 (这能提供很好的智能提示)
export type IconName = 
  | "dashboard"    
  | "settings"     
  | "users" 
  | "logs" 
  | "video" 
  | "eye" 
  | "newspaper"
  | "orderList"
  | "presentation"
  | "x402";

export type NavItem = {
  titleKey: string;
  href: string;
  icon: IconName; // 🔴 改动：这里现在存字符串
};

type MenuContent = {
  userNavItems: NavItem[];
  adminNavItems: NavItem[];
};

const typedMenu = menuContent as MenuContent;

// 2. 修改用户菜单配置
export const userNavItems: NavItem[] = typedMenu.userNavItems;

// 3. 修改管理员菜单配置
export const adminNavItems: NavItem[] = typedMenu.adminNavItems;