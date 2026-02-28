import { notFound } from "next/navigation";
import { getDocBySlug } from "@/lib/mdx";
import { MdxContent } from "@/components/mdx/mdx-content";
import { DocsPager } from "@/components/docs/docs-pager";
import { getTableOfContents } from "@/lib/toc"; // 引入提取工具
import { DashboardTableOfContents } from "@/components/docs/toc"; // 引入 UI
import { generatePostParams } from "@/lib/static-helper";

export function generateStaticParams() {
  return generatePostParams('docs'); // 👈 只需要改个参数
}

interface DocPageProps {
  params: Promise<{
    slug?: string[]; // 注意：[[...slug]] 捕获的是数组，且可能是 undefined
    locale: string;
  }>;
}

export default async function DocPage({ params }: DocPageProps) {
  
  const { slug: slugArray, locale } = await params;
  const slug = slugArray ? slugArray.join("/") : "index";

  const doc = getDocBySlug(slug, locale);

  if (!doc) {
    return notFound();
  }
  
  const toc = await getTableOfContents(doc.rawContent);

  return (
    <div className="max-w-none">
      
      <div className="xl:grid xl:grid-cols-[1fr_250px] gap-8">
      
        {/* 左栏：文章主体 */}
        <div className="min-w-0">
            <div className="mb-4 text-sm text-muted-foreground">Docs &gt; {doc.metadata.title}</div>
            <h1 className="text-4xl font-bold mb-8">{doc.metadata.title}</h1>
            
            <article className="prose prose-slate dark:prose-invert max-w-none">
                <MdxContent content={doc.content} />
            </article>

            
        </div>

        {/* 右栏：目录 (Desktop Only) */}
        <div className="hidden xl:block text-sm not-prose">
            <div className="sticky top-20 max-h-[calc(100vh-8rem)] overflow-y-auto py-2 pr-4">
              <DashboardTableOfContents toc={toc} />
            </div>            
        </div>

        {/* DocsPager 放在 grid 左栏内，保持右栏 sticky 不断 */}
        <div className="col-span-1">
          <DocsPager />
        </div>

        </div>
    </div>
  );
}