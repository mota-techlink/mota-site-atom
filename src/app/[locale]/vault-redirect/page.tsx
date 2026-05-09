// src/app/[locale]/vault-redirect/page.tsx
// 登录完成后重定向到 report.motaiot.com，携带 JWT token
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

function readAccessTokenFromSupabaseCookies(allCookies: { name: string; value: string }[]): string | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let projectRef = '';

  try {
    projectRef = supabaseUrl ? new URL(supabaseUrl).hostname.split('.')[0] : '';
  } catch {
    projectRef = '';
  }

  const expectedPrefix = projectRef ? `sb-${projectRef}-auth-token` : '';

  const candidates = allCookies
    .filter((cookie) => {
      if (expectedPrefix) return cookie.name === expectedPrefix || cookie.name.startsWith(`${expectedPrefix}.`);
      return cookie.name.includes('-auth-token');
    })
    .sort((a, b) => {
      const aSuffix = a.name.split('.').pop();
      const bSuffix = b.name.split('.').pop();
      const aIndex = /^\d+$/.test(aSuffix || '') ? Number(aSuffix) : -1;
      const bIndex = /^\d+$/.test(bSuffix || '') ? Number(bSuffix) : -1;
      return aIndex - bIndex;
    });

  if (!candidates.length) return null;

  const raw = candidates.map((cookie) => cookie.value).join('');

  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    const token = Array.isArray(parsed) ? parsed[0] : parsed?.access_token;
    return typeof token === 'string' && token.split('.').length === 3 ? token : null;
  } catch {
    return null;
  }
}

export default async function VaultRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { redirectFrom } = await searchParams;
  const targetPath = (typeof redirectFrom === 'string' ? redirectFrom : '/') || '/';
  let accessToken: string | null = null;

  // 通过 Supabase server client 读取 session，避免固定 cookie 名导致读取失败
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    accessToken = session?.access_token ?? null;
  } catch {
    // session 读取失败，继续 cookie 兜底
  }

  if (!accessToken) {
    try {
      const cookieStore = await cookies();
      accessToken = readAccessTokenFromSupabaseCookies(cookieStore.getAll());
    } catch {
      // cookie 兜底读取失败，继续 fallback
    }
  }

  if (accessToken && accessToken.split('.').length === 3) {
    const reportUrl = new URL('https://report.motaiot.com/auth/check');
    reportUrl.searchParams.set('token', accessToken);
    reportUrl.searchParams.set('redirectFrom', targetPath);
    redirect(reportUrl.toString());
  }

  // Fallback: 跳回主站登录页，让用户在主站重新完成登录流程
  const nextParam = `/vault-redirect?redirectFrom=${encodeURIComponent(targetPath)}`;
  const fallbackUrl = new URL('https://motaiot.com/login');
  fallbackUrl.searchParams.set('next', nextParam);
  redirect(fallbackUrl.toString());
}
