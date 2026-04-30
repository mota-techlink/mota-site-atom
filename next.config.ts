import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  // 1. ✅ 正确的配置位置：顶层配置
  // 允许通过 IP 访问开发服务器
  allowedDevOrigins: ["localhost:3000", "192.168.50.188:3000", "192.168.50.188", "192.168.50.*"],

  // 2. 依然保留 Server Actions 的允许源 (双保险)
  // 因为表单提交 (Server Actions) 有独立的安全检查
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "motaiot.com","dev.motaiot.com","192.168.50.188:3000"],
    },
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'framer-motion',
      '@radix-ui/react-icons',
      'react-syntax-highlighter',
      '@ai-sdk/react',
      'embla-carousel-react',
      'react-markdown',
      'next-mdx-remote',
    ],
  },

  // 3. 响应头：CORS + CSP + 缓存策略
  async headers() {
    // Content Security Policy
    // - script-src: 'unsafe-inline' 为 GA4/Next.js inline script 所需
    // - connect-src: 覆盖 Supabase (auth + realtime)、Stripe、Google Analytics
    // - frame-src: Stripe Elements iframe
    // - img-src: 允许 data: / https: 以兼容各类第三方图片
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://js.stripe.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://api.stripe.com wss://ws.stripe.com https://www.googletagmanager.com",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "media-src 'self' blob: https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    // 所有路由共用的安全头
    const securityHeaders = [
      { key: "Access-Control-Allow-Origin", value: "*" },
      { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
    ];

    return [
      // ── 1. Next.js 构建产物：文件名含 hash，永久不变 ──────────────────
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },

      // ── 2. Public 静态文件：图片/图标/视频，缓存 1 天，后台 7 天更新 ──
      {
        source: "/:dir(icons|images|logos|videos)/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },

      // ── 3. 所有路由：基准安全头 + 公开页面 SSR 缓存 60s ──────────────
      //    私有路由（下方）会覆盖 Cache-Control
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          // Cloudflare 缓存 SSR 结果 60s；stale-while-revalidate 5 分钟内
          // 返回旧缓存同时后台重新生成，对用户无感知
          { key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=300" },
        ],
      },

      // ── 4. API 路由：绝不缓存 ─────────────────────────────────────────
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },

      // ── 5. Auth 回调：绝不缓存 ────────────────────────────────────────
      {
        source: "/auth/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },

      // ── 6. 需要登录的页面：私有，绝不缓存 ────────────────────────────
      // dashboard（用户订单/设置/支付）
      {
        source: "/:locale/dashboard/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
      // admin 后台
      {
        source: "/:locale/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
      // 登录/注册/重置密码/找回密码
      {
        source: "/:locale/login",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
      {
        source: "/:locale/forgot-password",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
      {
        source: "/:locale/reset-password",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
      // pitch-deck（仅邀请查看）
      {
        source: "/:locale/pitch-deck/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com', // 预防性添加，有些 GitHub 图片也是这个域名
      },
    ],
  },
  // 🟢 核心修复
  webpack: (config) => {
    // 使用 require.resolve 获取绝对路径
    // 这比简单的字符串 'zod' 更强硬，直接指向文件，绕过 package.json 检查
    try {
      config.resolve.alias['zod/v3'] = require.resolve('zod');
    } catch (e) {
      // 容错处理：如果 require.resolve 失败，回退到字符串
      config.resolve.alias['zod/v3'] = 'zod';
    }
    return config;
  },
  // 🔴 Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 🔴 Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default async function config() {
 // 开发环境初始化 Cloudflare Platform (如果有)
  if (process.env.NODE_ENV === 'development') {
    // 加上 try-catch 防止因为这个函数报错导致整个配置挂掉
    try {
      await setupDevPlatform();
    } catch (e) {
      console.warn('Failed to setup Cloudflare Dev Platform:', e);
    }
  }

  // 返回被 next-intl 包裹后的配置对象
  return withNextIntl(nextConfig);
}