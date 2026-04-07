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
      // ── 1. 屏蔽纯训练爬虫（无搜索引用价值）────────────
      // 这些爬虫只抓取内容用于训练模型，不会在搜索结果中引用或导流
      // 允许的 AI 搜索爬虫见下方注释说明
      {
        userAgent: 'CCBot',             // Common Crawl — 几乎所有 LLM 的训练数据来源，无引用
        disallow: '/',
      },
      {
        userAgent: 'Bytespider',        // 字节跳动 — 纯训练，不做 AI 搜索引用
        disallow: '/',
      },
      {
        userAgent: 'Amazonbot',         // Amazon — 纯训练，无 AI 搜索产品
        disallow: '/',
      },
      {
        userAgent: 'FacebookBot',       // Meta — 纯训练 Llama，无搜索引用
        disallow: '/',
      },
      {
        userAgent: 'cohere-ai',         // Cohere — 纯 API 训练，无终端搜索产品
        disallow: '/',
      },
      {
        userAgent: 'Applebot-Extended', // Apple AI 训练（Applebot 正常索引不受影响）
        disallow: '/',
      },
      {
        userAgent: 'AnchorBot',         // Spotify/Anchor — 播客 AI，无网页搜索引用
        disallow: '/',
      },
      {
        userAgent: 'Diffbot',           // Diffbot — 商业数据抓取，无引用导流
        disallow: '/',
      },
      {
        userAgent: 'ImagesiftBot',      // 图像训练爬虫
        disallow: '/',
      },

      // ── ✅ 允许的 AI 搜索爬虫（会在结果中引用并导流）──
      // GPTBot / ChatGPT-User / OAI-SearchBot  → ChatGPT Search，有引用链接
      // anthropic-ai / ClaudeBot               → Claude Search，有引用链接
      // PerplexityBot / Perplexity-User        → Perplexity，有引用链接
      // Google-Extended                        → Google AI Overview，有引用链接
      // 以上爬虫均不在屏蔽列表中，默认由下方 * 规则放行

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
