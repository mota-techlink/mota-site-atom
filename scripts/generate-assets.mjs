// generate-assets.mjs
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob'; 
// 🟢 新增：引入序列化工具和插件
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

// ── 读取语言配置 (来源: src/generated/content-config/i18n.json；源头: content/site/i18n.yml) ──
const i18nConfig = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'src/generated/content-config/i18n.json'), 'utf-8')
);
const LOCALES = i18nConfig.locales;

// ---------------------------------------------------------
// 配置路径
// ---------------------------------------------------------
const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const OUTPUT_FILE = path.join(process.cwd(), 'src/generated/assets-manifest.json');
const OUTPUT_DIR = path.dirname(OUTPUT_FILE);

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ---------------------------------------------------------
// 清洗逻辑
// ---------------------------------------------------------
function cleanMDXContent(content, metadata) {
  let cleaned = content;
  cleaned = cleaned.replace(/<br\s*\/?>/gi, '<br />');
  cleaned = cleaned.replace(/<hr\s*\/?>/gi, '<hr />');
  cleaned = cleaned.replace(/<img([^>]*?)(?<!\/)>/gi, (match, attributes) => {
     if (match.endsWith('/>')) return match;
     return `<img${attributes} />`;
  });
  cleaned = cleaned.replace(
    /<div\s+align="left">([\s\S]*?)<\/div>/gi, 
    (match, innerContent) => {
      const inlineContent = innerContent
        .replace(/\r?\n/g, ' ')
        .replace(/<br\s*\/?>/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      return `<div className="flex flex-wrap gap-2 items-center text-sm text-blue-600 dark:text-blue-400 my-4 leading-none">${inlineContent}</div>`;
    }
  );
  cleaned = cleaned.replace(/align="center"/gi, 'className="text-center"');
  cleaned = cleaned.replace(/align="right"/gi, 'className="text-right"');
  cleaned = cleaned.replace(/^\s*#\s+.+$/m, '');
  if (metadata.image) {
    const escapedImage = metadata.image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const htmlImgRegex = new RegExp(`(<p[^>]*>\\s*)?<img[^>]*src=["']${escapedImage}["'][^>]*\\/?>(\\s*<\\/p>)?`, 'gi');
    cleaned = cleaned.replace(htmlImgRegex, '');
    const mdImgRegex = new RegExp(`!\\[.*?\\]\\(${escapedImage}\\)`, 'gi');
    cleaned = cleaned.replace(mdImgRegex, '');
  }
  return cleaned;
}

// ---------------------------------------------------------
// 任务 A: 扫描内容 (修改为异步函数以支持 await serialize)
// ---------------------------------------------------------
async function scanContent() {
  const contentMap = {};
  const types = ['blog', 'showcase', 'pages', 'legal', 'products', 'mota-ai', 'docs'];

  for (const type of types) {
    const typeDir = path.join(CONTENT_DIR, type);
    
    // 如果目录不存在，跳过
    if (!fs.existsSync(typeDir)) {
      contentMap[type] = [];
      continue;
    }

    // 🟢 1. 使用 glob 递归扫描所有 .md/.mdx 文件
    // pattern: content/docs/**/*.mdx
    // windows 下路径分隔符需要处理，glob 倾向于 '/'
    const pattern = path.join(typeDir, '**/*.{md,mdx}').replace(/\\/g, '/');
    const files = await glob(pattern);

    const items = [];

    for (const filePath of files) {
      // 读取文件内容
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      // 🟢 2. 计算相对路径 Slug
      // 例子: 
      // typeDir  = /usr/project/content/docs
      // filePath = /usr/project/content/docs/getting-started/installation.mdx
      // relative = getting-started/installation.mdx
      const relativePath = path.relative(typeDir, filePath);
      
      // 生成基础 slug (去掉扩展名) -> getting-started/installation
      // 并在 Windows 上强制把反斜杠转为正斜杠，保证 URL 一致性
      // 语言后缀模式由 i18n.json 配置动态生成 (如 .zh, .en)
      const localeSuffixRegex = new RegExp(`\\.(${LOCALES.join('|')})$`);
      const slug = relativePath
        .replace(/\.(md|mdx)$/, '')
        .replace(localeSuffixRegex, '') // 去掉语言后缀 (基于 i18n.json)
        .replace(/\\/g, '/');       // Windows 兼容

      // 处理文件名 (用于判断 locale)
      const filename = path.basename(filePath);

      // 3. 清洗内容
      const cleanedContent = cleanMDXContent(content, data);

      // 4. 编译 MDX
      const compiledSource = await serialize(cleanedContent, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeHighlight],
          format: 'mdx',
        },
        parseFrontmatter: false,
      });

      items.push({
        filename, // 保留文件名 (e.g. installation.zh.mdx)
        slug,     // 保留完整路径 Slug (e.g. getting-started/installation)
        metadata: data,
        content: compiledSource,
      });
    }

    contentMap[type] = items;
  }

  return contentMap;
}

// ---------------------------------------------------------
// 任务 B: 扫描图片 
// ---------------------------------------------------------
function scanImages() {
  const imageMap = {};
  function scanDir(currentPath, relativePath) {
    const files = fs.readdirSync(currentPath, { withFileTypes: true });
    const dirKey = relativePath.replace(/\\/g, '/') || '/'; 
    if (!imageMap[dirKey]) imageMap[dirKey] = [];

    files.forEach(file => {
      if (file.isDirectory()) {
        scanDir(path.join(currentPath, file.name), path.join(relativePath, file.name));
      } else if (file.isFile() && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)) {
        const webPath = path.join(relativePath, file.name).replace(/\\/g, '/');
        const fullWebPath = webPath.startsWith('/') ? webPath : `/${webPath}`;
        const storeKey = path.join('/', relativePath).replace(/\\/g, '/');
        if (!imageMap[storeKey]) imageMap[storeKey] = [];
        imageMap[storeKey].push(fullWebPath);
      }
    });
  }
  if (fs.existsSync(PUBLIC_DIR)) {
    scanDir(PUBLIC_DIR, '');
  }
  return imageMap;
}

// ---------------------------------------------------------
// 🟢 数据增强函数 (关联 Showcase 到 Product)
// ---------------------------------------------------------
function enrichRelationship(contentMap) {
  // 1. 定义需要遍历的产品目录列表
  const productCategories = ['products', 'mota-ai']; 
  
  // 2. 合并所有产品到一个数组中
  let allProducts = [];
  productCategories.forEach(cat => {
    if (contentMap[cat] && Array.isArray(contentMap[cat])) {
      allProducts = allProducts.concat(contentMap[cat]);
    }
  });


  const showcases = contentMap['showcase'];

  if (!allProducts || !showcases) return;

  // 遍历每一个产品
  allProducts.forEach(product => {
    if (!product || !product.metadata) return;
    const relatedSlugs = product.metadata.relatedShowcases;
    if (!relatedSlugs || !Array.isArray(relatedSlugs) || relatedSlugs.length === 0) {
      return; 
    }
    console.log(`${product.metadata.title} relatedSlugs length ${relatedSlugs.length}`);
    // 如果该产品配置了关联案例
    if (Array.isArray(relatedSlugs) && relatedSlugs.length > 0) {
      
      // 在 Showcase 列表中查找对应的数据
      const enrichedData = relatedSlugs.map(slug => {
        // 查找匹配的 showcase (忽略大小写)
        const found = showcases.find(s => s.slug.toLowerCase() === slug.toLowerCase());
        
        if (found) {
          // 只提取前端展示需要的轻量级数据，避免 JSON 太大
          return {
            slug: found.slug,
            title: found.metadata.title,
            description: found.metadata.description,
            cover: found.metadata.image, // 取第一张图做封面
          };
        }else {
          console.warn(`   ⚠️ [Warning] Related showcase not found: "${slug}" (in: ${product.metadata.title})`);
          return null;
        }
        return null;
      }).filter(item => item !== null); // 过滤掉找不到的

      // 🟢 将增强后的数据注入到 metadata 中，供前端直接使用
      product.metadata.relatedShowcasesData = enrichedData;
    }
  });
}



// ---------------------------------------------------------
// 执行并保存
// ---------------------------------------------------------
console.log('📦 Generating assets manifest...');
// 必须在一个 async 函数里执行
(async () => {
  try {
    const content = await scanContent();

    enrichRelationship(content)
    
    const assets = {
      content: content, // 等待编译完成
      images: scanImages(),
      generatedAt: new Date().toISOString()
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(assets, null, 2));
    console.log(`✅ Assets manifest generated at ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('❌ Error generating assets:', error);
    process.exit(1);
  }
})();