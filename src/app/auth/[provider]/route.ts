// src/app/auth/[provider]/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Provider } from '@supabase/supabase-js';
import { siteConfig } from '@/config/site';
import { resolveLoginNextTarget } from '@/lib/auth/login-redirect';

export const runtime = 'edge'; // 保持 Edge 兼容性

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params; // Next.js 15+ params 是 Promise
  const requestUrl = new URL(request.url);
  const appOrigin = siteConfig.url;
  const supabase = await createClient();

  let actualProvider = provider as Provider;
  let queryParams = {};

  console.log(`--- [OAuth Debug] Starting Sign-In with ${actualProvider} ---`);
  console.log(`[OAuth Debug] Origin: ${appOrigin}`);
  
  // 1. 处理特殊的 Provider 映射 (保留之前的逻辑)

  // 如果你有自定义逻辑，比如 wechat 走 oidc
  if (provider === 'wechat') {
    // actualProvider = 'oidc';
    // queryParams = { ... };
  }

  // 2. 读取 next 参数（如果有），传递到回调 URL
  const next = resolveLoginNextTarget(requestUrl.searchParams.get('next'));

  // 3. 构造 Supabase 回调地址，携带 next 参数
  const redirectTo = `${appOrigin}/auth/callback?next=${encodeURIComponent(next)}`;
  console.log(`[OAuth Debug] RedirectTo: ${redirectTo}`);
  // 3. 调用 Supabase
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: actualProvider,
    options: {
      redirectTo: redirectTo,
      queryParams: queryParams,
    },
  });

  // 4. 处理错误：跳回登录页并带上错误信息
  if (error) {
    console.error(`[OAuth API Error] ${provider}:`, error);
    return NextResponse.redirect(`${appOrigin}/zh/login?error=${encodeURIComponent(error.message)}`);
  }

  // 5. 成功：直接跳转到 Identity Provider (Google/GitHub 等) 的授权页面
  return NextResponse.redirect(data.url);
}