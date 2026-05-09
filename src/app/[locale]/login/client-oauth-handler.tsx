'use client';

import { OAuthButton } from "@/components/oauth-button";
import { OAuthProviderConfig } from "@/config/site"; // 引入类型
import { useState } from "react";

export default function ClientOAuthHandler({ 
  provider 
}: { 
  provider: OAuthProviderConfig // 使用新类型
}) {
  const [isNavigating, setIsNavigating] = useState(false);
  return (
    <OAuthButton
      label={provider.label}
      iconUrl={provider.icon}
      enable={provider.enable}
      isLoading={isNavigating} // 传递 loading 状态给按钮
      onClick={() => {
        // 1. 检查是否启用
        if (!provider.enable) return;

        // 2. 设置 loading 状态 (防止重复点击)
        setIsNavigating(true);

        // 3. 导航到 GET API 路由，保留当前页面的 next 参数
        const params = new URLSearchParams(window.location.search);
        const next = params.get('next');
        let target = `/auth/${provider.id}`;
        if (next) target += `?next=${encodeURIComponent(next)}`;
        window.location.href = target;
      }}
    />
  );
}