'use client';

import { OAuthButton } from "@/components/oauth-button";
import { OAuthProviderConfig } from "@/config/site"; // 引入类型
import { createClient } from '@/lib/supabase/client';
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
      onClick={async () => {
        if (isNavigating) return;

        // 1. 检查是否启用
        if (!provider.enable) return;

        // 2. 设置 loading 状态 (防止重复点击)
        setIsNavigating(true);

        try {
          // 3. 在浏览器内直接发起 Supabase OAuth，确保 PKCE/verifier cookie 由同一浏览器上下文保存
          const supabase = createClient();
          const params = new URLSearchParams(window.location.search);
          const next = params.get('next');
          const redirectTo = `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`;

          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider.id as any,
            options: {
              redirectTo,
            },
          });

          if (error) {
            throw error;
          }

          if (data?.url) {
            window.location.assign(data.url);
            return;
          }

          window.location.href = `/zh/login?error=oauth_url_missing`;
        } catch (error: any) {
          console.error('[OAuth] signInWithOAuth failed:', error);
          const message = encodeURIComponent(error?.message || 'oauth_failed');
          window.location.href = `/zh/login?error=${message}`;
        }
      }}
    />
  );
}