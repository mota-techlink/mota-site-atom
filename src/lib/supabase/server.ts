import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createFetchWithSchema } from './fetch-with-schema';

export async function createClient() {
  const cookieStore = await cookies();
  const schema = process.env.NEXT_PUBLIC_SUPABASE_DB_SCHEMA || 'public';
  const fetchWithSchema = createFetchWithSchema(schema);

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { fetch: fetchWithSchema },
      db: { schema },  // Provide schema in config
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // 在 Server Component 中 set cookie 可能会报错，通常可以忽略
            // 因为 Middleware 已经处理了 Session 刷新
          }
        },
      },
    }
  );
    
}


  