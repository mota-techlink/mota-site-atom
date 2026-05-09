// src/app/[locale]/vault-redirect/page.tsx
// 登录完成后重定向到 report.motaiot.com，携带 JWT token
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function VaultRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { redirectFrom } = await searchParams;
  const targetPath = (typeof redirectFrom === 'string' ? redirectFrom : '/') || '/';

  // 通过 Supabase server client 读取 session，避免固定 cookie 名导致读取失败
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const accessToken = session?.access_token;
    if (accessToken && accessToken.split('.').length === 3) {
      const reportUrl = new URL('https://report.motaiot.com/auth/check');
      reportUrl.searchParams.set('token', accessToken);
      reportUrl.searchParams.set('redirectFrom', targetPath);
      redirect(reportUrl.toString());
    }
  } catch {
    // session 读取失败，继续 fallback
  }

  // Fallback: 跳回主站登录页，让用户在主站重新完成登录流程
  const nextParam = `/vault-redirect?redirectFrom=${encodeURIComponent(targetPath)}`;
  const fallbackUrl = new URL('https://motaiot.com/login');
  fallbackUrl.searchParams.set('next', nextParam);
  redirect(fallbackUrl.toString());
}
