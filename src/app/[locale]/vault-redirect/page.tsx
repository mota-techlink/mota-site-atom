// src/app/[locale]/vault-redirect/page.tsx
// 登录完成后重定向到 report.motaiot.com，携带 JWT token
import { cookies } from 'next/headers';
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

  // 读取 Supabase cookie
  const cookieStore = await cookies();
  const supabaseCookie = cookieStore.get('sb-ivflrmuylsksagmzufpa-auth-token');

  if (supabaseCookie?.value) {
    try {
      // Supabase cookie 存的是 JSON 数组: ["access_token", "refresh_token"]
      const parsed = JSON.parse(decodeURIComponent(supabaseCookie.value));
      const accessToken = Array.isArray(parsed) ? parsed[0] : parsed;

      if (accessToken && typeof accessToken === 'string' && accessToken.split('.').length === 3) {
        // 重定向到 report.motaiot.com 携带 token
        const reportUrl = new URL('https://report.motaiot.com/auth/check');
        reportUrl.searchParams.set('token', accessToken);
        reportUrl.searchParams.set('redirectFrom', targetPath);
        redirect(reportUrl.toString());
      }
    } catch {
      // cookie 解析失败，继续执行到 fallback
    }
  }

  // Fallback: 跳回主站登录页，让用户在主站重新完成登录流程
  const fallbackUrl = new URL('https://motaiot.com/login');
  fallbackUrl.searchParams.set('next', '/vault-redirect');
  fallbackUrl.searchParams.set('redirectFrom', targetPath);
  redirect(fallbackUrl.toString());
}
