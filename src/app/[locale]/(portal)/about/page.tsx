import { Metadata } from "next"
import { siteConfig } from "@/config/site"
import Image from "next/image"
import { getTranslations } from "next-intl/server"
import aboutContent from "@/generated/content-config/about.json"
import { buildContentPageMetadata } from "@/lib/page-metadata"

type AboutContent = {
  metadata: {
    titleKey: string;
    descriptionKey: string;
  };
  hero: {
    titlePrefixKey: string;
    titleHighlight: string;
    subtitleKey: string;
  };
  story: {
    titleKey: string;
    paragraphs: string[];
  };
  stats: {
    value: string;
    labelKey: string;
  }[];
};

const typedAbout = aboutContent as AboutContent;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildContentPageMetadata({
    locale,
    namespace: "AboutPage",
    config: typedAbout,
  });
}

export default async function AboutPage() {
  const t = await getTranslations("AboutPage");

  return (
    // 🟢 修复: 添加 mx-auto
    <div className="container mx-auto  px-4 md:px-6 py-5 ">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          {t(typedAbout.hero.titlePrefixKey)} <span className="text-blue-600">{typedAbout.hero.titleHighlight}</span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          {t(typedAbout.hero.subtitleKey)}
        </p>
      </div>

      {/* Story Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
          <h2 className="text-3xl font-bold text-foreground">{t(typedAbout.story.titleKey)}</h2>
          {typedAbout.story.paragraphs.map((paragraphKey) => (
            <p key={paragraphKey}>{t(paragraphKey)}</p>
          ))}
        </div>
        <div className="relative aspect-square md:aspect-video overflow-hidden rounded-2xl border bg-muted/50">
           <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">            
            
                  <Image 
                    src={siteConfig.banner}
                    alt="Mota Techlink" 
                    fill 
                    className="object-contain object-center" 
                    priority
                  />
            
           </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 md:p-12 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {typedAbout.stats.map((stat) => (
            <div key={stat.labelKey} className="space-y-2">
              <h3 className="text-4xl font-bold text-blue-600">{stat.value}</h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t(stat.labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}