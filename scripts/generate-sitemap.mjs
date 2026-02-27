// scripts/generate-sitemap.mjs
// ── 构建时自动生成 sitemap.xml ──────────────────────────
// 在 build 时自动扫描：
//   1. src/app/[locale]/(portal)/ 下的所有公开页面路由
//   2. content/ 目录下的所有 MDX 动态内容 (blog, products, showcase, docs, mota-ai)
//   3. content/pitch-decks/ 下的所有 pitch deck
//
// 语言策略：
//   - 静态页面 (通过 next-intl 翻译): 所有 locale 都生成
//   - MDX 内容: 只为实际存在翻译文件的 locale 生成
//     例: blog/foo.md           → /en/blog/foo ✅  /zh/blog/foo ✗
//         blog/foo.md + foo.zh.md → /en/blog/foo ✅  /zh/blog/foo ✅
//
// 输出: public/sitemap.xml — 标准 <urlset> 格式，pretty-printed XML
// 风格参考: resend.com/sitemap.xml
// ─────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import dotenv from 'dotenv';

// 加载 .env.local (确保 NEXT_PUBLIC_BASE_URL 可用)
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// ── 读取语言配置 (唯一真相来源: content/site/i18n.json) ──
const i18nConfig = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'content/site/i18n.json'), 'utf-8')
);

// ── 配置 ────────────────────────────────────────────────
const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://atom.motaiot.com').replace(/\/+$/, '');
const LOCALES = i18nConfig.locales;
const DEFAULT_LOCALE = i18nConfig.defaultLocale;
const NON_DEFAULT_LOCALES = LOCALES.filter(l => l !== DEFAULT_LOCALE);
const NOW = new Date().toISOString();

const APP_DIR = path.join(process.cwd(), 'src/app/[locale]');
const CONTENT_DIR = path.join(process.cwd(), 'content');
const OUTPUT_FILE = path.join(process.cwd(), 'public/sitemap.xml');

// ── 需要排除的路由（后台、认证、结账等） ────────────────
const EXCLUDED_ROUTES = new Set([
  '/admin',
  '/admin/console',
  '/admin/orders',
  '/admin/pitch-decks',
  '/admin/users',
  '/dashboard',
  '/dashboard/orders',
  '/dashboard/profile',
  '/dashboard/settings',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/checkout/cancel',
  '/checkout/success',
  '/tags', // tags/[tag] 是动态的，不好枚举
]);

// ── 1. 扫描 app 目录获取静态页面路由 ────────────────────
// 静态页面通过 next-intl 翻译，所有语言都有内容 → 全量生成
function scanAppRoutes() {
  const routes = new Set();

  // 扫描 (portal) 组下的页面 — 这些是公开页面
  const portalDir = path.join(APP_DIR, '(portal)');
  if (fs.existsSync(portalDir)) {
    const pages = glob.sync('**/page.tsx', { cwd: portalDir });
    for (const p of pages) {
      const dir = path.dirname(p);
      if (dir === '.') {
        routes.add('/');
      } else {
        // 跳过动态路由 [slug] — 这些由 MDX content 填充
        if (dir.includes('[') && dir.includes(']')) continue;
        routes.add('/' + dir);
      }
    }
  }

  // 也扫描直接在 [locale] 下的页面
  const directPages = glob.sync('*/page.tsx', { cwd: APP_DIR });
  for (const p of directPages) {
    const dir = path.dirname(p);
    if (dir.includes('[') || dir.includes('(')) continue;
    routes.add('/' + dir);
  }

  return routes;
}

// ── 2. 扫描 MDX content 获取动态页面 ───────────────────
// 只为实际存在翻译文件的 locale 生成 URL
// 返回: { path, date, locales: ['en'] | ['en', 'zh'] }
function scanContentRoutes() {
  const routes = [];

  /**
   * 扫描一个 content 子目录，返回按 slug 分组的路由
   * @param {string} contentGlob  - glob 模式 (相对于 CONTENT_DIR)
   * @param {function} pathBuilder - (slug) => URL 路径
   * @param {boolean} nested      - 是否支持嵌套目录 (如 docs/getting-started/installation)
   */
  function scanCategory(contentGlob, pathBuilder, nested = false) {
    const allFiles = glob.sync(contentGlob, { cwd: CONTENT_DIR });

    // 按 slug 分组，找出每个 slug 有哪些语言
    const slugMap = new Map(); // slug → { date, locales: Set }

    for (const f of allFiles) {
      let slug;
      if (nested) {
        // docs/getting-started/installation.mdx → getting-started/installation
        const relative = f.replace(/^[^/]+\//, ''); // 去掉顶层目录名
        slug = relative.replace(/(\.[a-z]{2})?\.(mdx?|md)$/, '');
      } else {
        slug = path.basename(f).replace(/(\.[a-z]{2})?\.(mdx?|md)$/, '');
      }

      // 判断是哪个语言的文件
      const isNonDefault = NON_DEFAULT_LOCALES.some(l => f.includes(`.${l}.`));
      const locale = isNonDefault
        ? NON_DEFAULT_LOCALES.find(l => f.includes(`.${l}.`))
        : DEFAULT_LOCALE;

      if (!slugMap.has(slug)) {
        slugMap.set(slug, {
          date: getFileMtime(path.join(CONTENT_DIR, f)),
          locales: new Set([DEFAULT_LOCALE]), // 默认语言始终存在
        });
      }

      const entry = slugMap.get(slug);
      entry.locales.add(locale);

      // 用最新的文件修改时间
      const mtime = getFileMtime(path.join(CONTENT_DIR, f));
      if (mtime > entry.date) entry.date = mtime;
    }

    for (const [slug, { date, locales }] of slugMap) {
      routes.push({
        path: pathBuilder(slug),
        date,
        locales: [...locales],
      });
    }
  }

  // Blog: /blog/{slug}
  scanCategory('blog/*.{md,mdx}', (slug) => `/blog/${slug}`);

  // Showcase: /showcase/{slug}
  scanCategory('showcase/*.{md,mdx}', (slug) => `/showcase/${slug}`);

  // Products: /products/{slug}
  scanCategory('products/*.{md,mdx}', (slug) => `/products/${slug}`);

  // Mota AI Products: /products/mota-ai/{slug}
  scanCategory('mota-ai/*.{md,mdx}', (slug) => `/products/mota-ai/${slug}`);

  // Docs: /docs/{slug} (嵌套目录)
  scanCategory('docs/**/*.{md,mdx}', (slug) => `/docs/${slug}`, true);

  // Pitch Decks: /pitch-deck/{slug}
  const pitchDeckDirs = glob.sync('pitch-decks/*/meta.json', { cwd: CONTENT_DIR });
  for (const f of pitchDeckDirs) {
    try {
      const meta = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), 'utf-8'));
      if (meta.status === 'published' && meta.slug) {
        routes.push({
          path: `/pitch-deck/${meta.slug}`,
          date: meta.date || getFileMtime(path.join(CONTENT_DIR, f)),
          locales: [...LOCALES], // pitch-deck 通过组件翻译，全量
        });
      }
    } catch { /* skip */ }
  }

  return routes;
}

// ── 辅助函数 ────────────────────────────────────────────
function getFileMtime(filePath) {
  try {
    const stat = fs.statSync(filePath);
    return stat.mtime.toISOString();
  } catch {
    return NOW;
  }
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ── 3. 组合所有 URL 并生成 XML ─────────────────────────
function generateSitemap() {
  const staticRoutes = scanAppRoutes();
  const contentRoutes = scanContentRoutes();

  const urls = [];

  // 静态页面 — next-intl 翻译，所有 locale 都有
  for (const route of staticRoutes) {
    const routePath = route === '/' ? '' : route;
    if (EXCLUDED_ROUTES.has(routePath || '/')) continue;

    for (const locale of LOCALES) {
      urls.push({ loc: `${BASE_URL}/${locale}${routePath}`, lastmod: NOW });
    }
  }

  // 动态内容页面 — 只为有翻译的 locale 生成
  for (const { path: routePath, date, locales } of contentRoutes) {
    for (const locale of locales) {
      urls.push({ loc: `${BASE_URL}/${locale}${routePath}`, lastmod: date });
    }
  }

  // 按 URL 字母排序 (方便调试)
  urls.sort((a, b) => a.loc.localeCompare(b.loc));

  // 生成 pretty-printed XML (Resend 风格)
  const urlEntries = urls
    .map(
      (u) =>
        `  <url>\n` +
        `    <loc>${escapeXml(u.loc)}</loc>\n` +
        `    <lastmod>${u.lastmod}</lastmod>\n` +
        `  </url>`
    )
    .join('\n');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urlEntries + '\n' +
    `</urlset>\n`;

  // 统计信息
  const staticCount = urls.filter(u => !contentRoutes.some(r => u.loc.includes(r.path))).length;
  const contentCount = urls.length - staticCount;
  const bilingualContent = contentRoutes.filter(r => r.locales.length > 1).length;
  const monoContent = contentRoutes.filter(r => r.locales.length === 1).length;

  return { xml, count: urls.length, staticCount, bilingualContent, monoContent };
}

// ── 4. 写入文件 ────────────────────────────────────────
const { xml, count, staticCount, bilingualContent, monoContent } = generateSitemap();
fs.writeFileSync(OUTPUT_FILE, xml, 'utf-8');
console.log(`✅ sitemap.xml generated → ${count} URLs → public/sitemap.xml`);
console.log(`   Base URL: ${BASE_URL}`);
console.log(`   📄 Static pages: all bilingual (${LOCALES.join(', ')})`);
console.log(`   📝 MDX bilingual: ${bilingualContent} slugs (have .zh.md)`);
console.log(`   📝 MDX monolingual: ${monoContent} slugs (${DEFAULT_LOCALE} only)`);
