import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createFetchWithSchema } from './fetch-with-schema';
import { resolveDbSchema } from './schema-mode';

export async function createClient() {
  const cookieStore = await cookies();
  const schemaResolution = resolveDbSchema();
  const schema = schemaResolution.schema;
  const useCustomSchemaTransport = schemaResolution.mode === 'custom';
  const fetchWithSchema = useCustomSchemaTransport ? createFetchWithSchema(schema) : undefined;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      ...(useCustomSchemaTransport
        ? {
            global: { fetch: fetchWithSchema },
            db: { schema },
          }
        : {}),
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


