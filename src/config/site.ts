import { Provider } from "@supabase/supabase-js";
import siteContent from "@/generated/content-config/site.json";


export type ExtendedProvider = Provider | 'wechat' | 'feishu' | 'alibaba';

export type OAuthProviderConfig = {
  id: ExtendedProvider ; 
  label: string;
  icon: string; // 图标路径
  enable: boolean;
};

type SiteContent = {
  name: string;
  logoLight: string;
  logoDark: string;
  Icon: string;
  logo: string;
  banner: string;
  description: string;
  contact: {
    email: string;
    toMail: string;
    phone: string;
    address: string;
  };
  google_map: {
    mapCoordinates: {
      lat: number;
      lng: number;
    };
    mapEnable: boolean;
    mapZoom: number;
    mapMarker: string;
    mapURL: string;
  };
  links: {
    twitter: string;
    github: string;
  };
  oauth: {
    common: OAuthProviderConfig[];
    regionSpecific: Record<string, OAuthProviderConfig[]>;
  };
};

// ── 动态 Base URL ──────────────────────────────────────
// 优先读取 NEXT_PUBLIC_BASE_URL 环境变量：
//   - 开发环境 (.env.local): http://127.0.0.1:3000
//   - 生产环境 (服务器配置): https://atom.motaiot.com
// 如果未设置，回退到硬编码值
const BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL ||
  'https://atom.motaiot.com'
).replace(/\/+$/, ''); // 去掉末尾斜杠

export const siteConfig = {
  ...(siteContent as SiteContent),
  url: BASE_URL, 
  ogImage: `${BASE_URL}/images/og.webp`,
}

export type SiteConfig = typeof siteConfig