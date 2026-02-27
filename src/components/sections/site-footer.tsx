import { Link } from "@/navigation"
import { siteConfig } from "@/config/site"
import { mainNavConfig, MainNavItem } from "@/config/nav"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Github, Twitter, Mail } from "lucide-react"
import Image from "next/image"
import { getTranslations } from "next-intl/server"

type NavGroup = {
  title: string;
  items: {
    title: string;
    href?: string;
  }[];
}

function hasChildren(item: MainNavItem): item is NavGroup {
  return "items" in item && Array.isArray(item.items)
}

function safeTranslate(translate: (key: string) => string, key: string, fallback: string) {
  try {
    return translate(key)
  } catch {
    return fallback
  }
}

export async function SiteFooter({ className }: { className?: string }) {
  const navT = await getTranslations("Nav")
  const footerT = await getTranslations("Footer")

  const quickLinkGroups = mainNavConfig.filter(hasChildren)

  return (
    <footer className={cn("border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ", className)}>
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-20 max-w-5xl">
      
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5 text-center lg:text-left">
          
          {/* Column 1: Brand & Slogan (占两列或一列) */}
          <div className="lg:col-span-2 flex flex-col items-center lg:items-start">
            <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold">
              {/* 1. 图片容器：给图片单独一个相对定位的容器，并设定宽高 */}
              <div className="relative h-[40px] w-[40px]"> 
                <Image
                  src={siteConfig.Icon}
                  alt="MOTA TECHLINK"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {/* 2. 文字部分：放在图片容器外面 */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                {siteConfig.name}   
              </span>
              
            </Link>
            <p className="mt-4 text-md  text-muted-foreground max-w-xs mx-auto lg:mx-0 lg:pl-[10%]">
              <a href={`tel:${siteConfig.contact.phone}`} className="hover:underline">{siteConfig.contact.phone}</a><br />
              <a href={siteConfig.google_map.mapURL} target="_blank" rel="noreferrer" className="hover:underline">
                {siteConfig.contact.address}
              </a>
            </p>
            
            {/* Social Links */}
            <div className="lg:pl-[10%] mt-2  flex items-center gap-6">
              <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
              <Link href={siteConfig.links.twitter} target="_blank" rel="noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
              {/* 示例：邮件 */}
               <Link href={`mailto:${siteConfig.contact.email}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                  <Mail className="h-4 w-4" />
                  <span className="sr-only">Email</span>
                </Button>
              </Link>
            </div>
          </div>

          {quickLinkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                {safeTranslate(navT, group.title, group.title)}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {group.items
                  .filter((item) => item.href)
                  .map((item) => (
                    <li key={item.title}>
                      <a href={item.href!} className="hover:text-foreground transition-colors">
                        {safeTranslate(navT, `items.${item.title}.title`, item.title)}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. {footerT("allRightsReserved")}</p>
          <div className="flex gap-4">
             {/* 可以在这里放一些底部的额外链接或 Status Indicator */}
             <span>{footerT("madeWithLove")}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}