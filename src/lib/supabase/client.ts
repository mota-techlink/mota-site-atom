// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import { createFetchWithSchema } from './fetch-with-schema'

export function createClient() {
  const schema = process.env.NEXT_PUBLIC_SUPABASE_DB_SCHEMA || 'public';
  const fetchWithSchema = createFetchWithSchema(schema);
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { fetch: fetchWithSchema },
      db: { schema },
    }
  )
}