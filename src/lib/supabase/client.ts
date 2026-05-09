// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import { createFetchWithSchema } from './fetch-with-schema'
import { resolveDbSchema } from './schema-mode'

export function createClient() {
  const schemaResolution = resolveDbSchema();
  const schema = schemaResolution.schema;
  const useCustomSchemaTransport = schemaResolution.mode === 'custom';
  const fetchWithSchema = useCustomSchemaTransport ? createFetchWithSchema(schema) : undefined;
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    useCustomSchemaTransport
      ? {
          global: { fetch: fetchWithSchema },
          db: { schema },
        }
      : undefined
  )
}