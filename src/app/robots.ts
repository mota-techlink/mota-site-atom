// src/app/robots.ts
// ── Robots.txt 配置 ─────────────────────────────────────
// Q: robots.ts 和 robots.txt 有什么区别？
// A: 没有区别！外部爬虫访问的始终是 /robots.txt
//    Next.js 只是让你用 TypeScript 来「生成」这个文本文件
//    好处：可以根据环境变量动态切换规则（比如预览环境全禁止）
//
// Q: 这能阻止 AI 爬虫吗？
// A: robots.txt 是「君子协议」，主流搜索引擎和大型 AI 公司（OpenAI、Google、Anthropic）
//    的爬虫会遵守。但无法阻止恶意爬虫，如需强制阻止需要在 WAF/Cloudflare 层面处理。
// ─────────────────────────────────────────────────────────

import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  // 🔴 预览/开发环境：禁止所有爬虫抓取，防止测试页面被索引
  // CF_PAGES_BRANCH 由 Cloudflare Pages 构建时注入：
  //   - 生产部署 (main / release): CF_PAGES_BRANCH = 'main' 或 'release'
  //   - 预览部署 (feature / content …): CF_PAGES_BRANCH = 其他分支名
  //   - 本地开发: CF_PAGES_BRANCH 未设置，回退到 NEXT_PUBLIC_BASE_URL 判断
  const cfBranch = process.env.CF_PAGES_BRANCH;
  const isProduction = process.env.NODE_ENV === 'production' && (
    cfBranch !== undefined
      ? cfBranch === 'main' || cfBranch === 'release'
      : process.env.NEXT_PUBLIC_BASE_URL === 'https://motaiot.com'
  );

  if (!isProduction) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  // 🟢 生产环境规则
  return {
    rules: [
      // ── 1. 屏蔽 AI/LLM 爬虫 ──────────────────────────
      // 这些爬虫抓取内容用于训练模型，而非搜索索引
      // 如果你希望允许某个 AI 爬虫，将其注释掉即可
      // {
      //   userAgent: 'GPTBot',            // OpenAI (GPT 训练数据)
      //   disallow: '/',
      // },
      // {
      //   userAgent: 'ChatGPT-User',      // ChatGPT 浏览插件
      //   disallow: '/',
      // },
      // {
      //   userAgent: 'OAI-SearchBot',     // OpenAI SearchBot
      //   disallow: '/',
      // },
      // {
      //   userAgent: 'CCBot',             // Common Crawl (大量 AI 公司的数据源)
      //   disallow: '/',
      // },
      // {
      //   userAgent: 'Google-Extended',   // Google AI/ML 训练（不影响搜索索引）
      //   disallow: '/',
      // },
      // {
      //   userAgent: 'anthropic-ai',      // Anthropic (Claude)
      //   disallow: '/',
      // },
      // {
      //   userAgent: 'ClaudeBot',         // Anthropic Claude 爬虫
      //   disallow: '/',
      // },
      // {
      //   userAgent: 'Bytespider',        // 字节跳动爬虫
      //   disallow: '/',
      // },
      {
        userAgent: 'Amazonbot',         // Amazon AI
        disallow: '/',
      },
      // {
      //   userAgent: 'FacebookBot',       // Meta AI 训练
      //   disallow: '/',
      // },
      // {
      //   userAgent: 'cohere-ai',         // Cohere AI
      //   disallow: '/',
      // },
      // {
      //   userAgent: 'PerplexityBot',     // Perplexity AI 爬虫
      //   disallow: '/',
      // },
      // {
      //   userAgent: 'Perplexity-User',   // Perplexity AI 用户插件
      //   disallow: '/',
      // },
      // {
      //   userAgent: 'Applebot-Extended', // Apple AI 训练（不影响 Siri/Spotlight 索引）
      //   disallow: '/',
      // },
      // {
      //   userAgent: 'AnchorBot',         // Anchor/Spotify 播客 AI
      //   disallow: '/',
      // },
      // {
      //   userAgent: 'Diffbot',           // Diffbot AI 数据抓取
      //   disallow: '/',
      // },
      // {
      //   userAgent: 'ImagesiftBot',      // AI 图像训练
      //   disallow: '/',
      // },

      // ── 2. 搜索引擎爬虫：允许抓取公开内容 ───────────────
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',              // API 路由
          '/admin/',            // 管理后台
          '/dashboard/',        // 用户仪表盘
          '/login',             // 登录页
          '/forgot-password',   // 重置密码
          '/reset-password',
          '/auth/',             // 认证回调
          '/checkout/',         // 结账流程
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
