// app/auth/callback/route.ts
// import { createClient } from '@/lib/supabase/server';
// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// export const runtime = 'edge'

// export async function GET(request: Request) {
//   const { searchParams, origin } = new URL(request.url);
//   const code = searchParams.get('code');
//   const next = searchParams.get('next') ?? '/dashboard';

//   if (code) {
//     const supabase = await createClient();
//     const { error } = await supabase.auth.exchangeCodeForSession(code);
//     if (!error) {
//       return NextResponse.redirect(`${origin}${next}`);
//     }
//   }

//   // 登录失败，重定向回登录页
//   return NextResponse.redirect(`${origin}/login?error=auth`);
// }
// src/app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';
import {
  isExternalLoginNextTarget,
  localizeInternalPath,
  resolveLoginNextTarget,
} from '@/lib/auth/login-redirect';

export const runtime = 'edge';

async function ensureProfileExists(user: { id: string; email?: string | null; user_metadata?: Record<string, any> }) {
  const admin = createAdminClient();
  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Member';

  const { error } = await admin
    .from('profiles')
    .upsert(
      {
        id: user.id,
        role: 'member',
        full_name: fullName,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

  if (error) {
    console.warn('[auth/callback] Failed to upsert profile:', error);
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const otpType = searchParams.get('type') || 'signup';
  const nextTarget = resolveLoginNextTarget(searchParams.get('next'));

  if (code || tokenHash) {
    const supabase = await createClient();
    const authResult = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : await supabase.auth.verifyOtp({
          type: otpType as any,
          token_hash: tokenHash!,
        });

    const { error } = authResult;

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await ensureProfileExists(user);
      }

      const cookieStore = await cookies();
      const locale = cookieStore.get('NEXT_LOCALE')?.value;

      if (isExternalLoginNextTarget(nextTarget)) {
        return NextResponse.redirect(nextTarget);
      }

      const forwardedUrl = `${origin}${localizeInternalPath(nextTarget, locale)}`;

      return NextResponse.redirect(forwardedUrl);
    }
  }

  // 错误处理
  return NextResponse.redirect(`${origin}/login?error=auth_code_error`);
}