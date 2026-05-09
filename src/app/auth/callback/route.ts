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
import { cookies } from 'next/headers';
import {
  isExternalLoginNextTarget,
  localizeInternalPath,
  resolveLoginNextTarget,
} from '@/lib/auth/login-redirect';

export const runtime = 'edge';
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const nextTarget = resolveLoginNextTarget(searchParams.get('next'));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
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