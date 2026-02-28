"use client";

import * as React from "react";
import { Link } from "@/navigation";
import { cn } from "@/lib/utils";
import { TableOfContents } from "@/lib/toc";

interface DashboardTableOfContentsProps {
  toc: TableOfContents;
}

export function DashboardTableOfContents({ toc }: DashboardTableOfContentsProps) {
  // 简单的滚动监听逻辑可以后续加，这里先做静态渲染
  const activeHash = useActiveItem(toc.items.map((item) => item.url));

  if (!toc.items.length) return null;

  return (
    <div className="space-y-2">
      <p className="font-medium text-sm">On this page</p>
      <Tree tree={toc} activeItem={activeHash} />
    </div>
  );
}

function Tree({ tree, level = 1, activeItem }: { tree: TableOfContents; level?: number; activeItem?: string }) {
  return (
    <ul className={cn("m-0 list-none", { "pl-4": level !== 1 })}>
      {tree.items.map((item, index) => {
        return (
          <li key={index} className="mt-0 pt-2">
            <a
                href={item.url}
                className={cn(
                    "block no-underline transition-colors text-sm truncate max-w-50",
                    item.url === activeItem
                    ? "font-medium text-blue-600 dark:text-blue-400 border-l-2 border-blue-600 pl-3 -ml-3" // 🟢 激活状态：加颜色 + 左侧边框指示条
                    : "text-muted-foreground hover:text-foreground" // 普通状态
                )}
                title={item.title}
                >
                {item.title}
            </a>
            {item.items?.length ? (
              <Tree tree={{ items: item.items }} level={level + 1} activeItem={activeItem} />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

// === Hook: 监听滚动高亮当前标题 ===
function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );

    itemIds.forEach((id) => {
      // 移除 # 号查找 ID
      const element = document.getElementById(id.substring(1));
      if (element) observer.observe(element);
    });

    return () => {
      itemIds.forEach((id) => {
        const element = document.getElementById(id.substring(1));
        if (element) observer.unobserve(element);
      });
    };
  }, [itemIds]);

  return activeId;
}