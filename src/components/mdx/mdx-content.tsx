'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import remarkGfm from 'remark-gfm';
import React from 'react';
import NextLink from 'next/link';
import { ArrowRight } from 'lucide-react';

// 引入自定义组件
import { CodeBlock } from './code-block';
import { YouTube } from './youtube';
import { ImageSlider } from './image-slider';
import { GradientText } from './gradient-text';
import { GifVideo } from './gif-video';
import { ColorText } from './color-text';
import { BionicText } from './bionic-text';
import { BionicWrapper } from './bionic-wrapper';
import { Steps, Step } from "@/components/mdx/steps";

// -----------------------------------------------------------------------------
// 1. 定义辅助组件 (CustomHighlight, CustomCallout, ContactCTA)
// -----------------------------------------------------------------------------

export function CustomHighlight({ children, color = "yellow" }: { children: React.ReactNode, color?: string }) {
  const colorMap: Record<string, string> = {
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  };
  return (
    <span className={`px-1 rounded-md font-medium ${colorMap[color] || colorMap.yellow}`}>
      {children}
    </span>
  );
}

export function CustomCallout({ children, type = "default" }: { children: React.ReactNode, type?: "default" | "warning" | "danger" }) {
    const style = {
        default: "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20",
        warning: "border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
        danger: "border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20",
    }
    return (
        <div className={`p-4 my-4 rounded-r-md ${style[type]}`}>
            {children}
        </div>
    )
}

/**
 * ContactCTA — 突出显示的联系按钮块，点击跳转到 /contact 页面。
 * 通常由 ProductLayout 通过 frontmatter `contactCta:` 自动渲染，
 * 也可在 MDX 中直接使用：<ContactCTA label="..." subtitle="..." buttonText="..." />
 */
export function ContactCTA({
  label,
  subtitle,
  buttonText,
}: {
  label?: string;
  subtitle?: string;
  buttonText?: string;
}) {
  return (
    <div className="not-prose my-8 rounded-2xl bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-center sm:text-left">
        <p className="text-base font-semibold text-foreground">
          {label ?? "准备好开始了吗？"}
        </p>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      <NextLink
        href="/contact"
        className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 active:scale-95 transition-all"
      >
        {buttonText ?? "Contact Us"}
        <ArrowRight className="w-4 h-4" />
      </NextLink>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 2. 定义 Shared Components (MDX 组件映射)
// -----------------------------------------------------------------------------
// 使用泛型或具体类型替换 'any' 以通过 Lint 检查
const sharedComponents = {
  // 基础 HTML 覆盖
  pre: CodeBlock,
  
  // 自定义组件
  Callout: CustomCallout,
  Highlight: CustomHighlight,
  YouTube: YouTube,
  Slider: ImageSlider,  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Gradient: (props: any) => (
    <span data-no-bionic="true">
      <GradientText {...props} />
    </span>
  ),
  GifVideo: GifVideo,
  ColorText: ColorText,
  Bionic: BionicText,
  Steps: Steps,
  Step: Step,
  ContactCTA: ContactCTA,

  // 🟢 拦截标准 HTML 标签 (解决 any 报错，使用 HTMLAttributes)
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <BionicWrapper as="p" {...props} />,
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <BionicWrapper as="li" {...props} />,
  
  // 引用块
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <BionicWrapper 
      as="blockquote" 
      className="mt-6 border-l-2 border-slate-300 pl-6 italic" 
      {...props} 
    />
  ),
};

// -----------------------------------------------------------------------------
// 3. 主组件 MdxContent
// -----------------------------------------------------------------------------

interface MdxContentProps {
  content: MDXRemoteSerializeResult;
  className?: string;
}

export function MdxContent({ content, className }: MdxContentProps) {
  // 🛡️ 防御性检查
  if (!content) return null;

  return (
    <div className={`blog-content ${className || ''}`}>
      {/* 使用 MDXRemote 而不是 compileMDX。
        在 Next.js App Router 中，MDXRemote 也是在服务端运行的，
        但它的内部实现机制对 Edge 更友好。
      */}
      <MDXRemote {...content} components={sharedComponents} />
    </div>
  );
}