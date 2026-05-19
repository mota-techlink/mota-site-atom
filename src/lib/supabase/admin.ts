import { createClient } from '@supabase/supabase-js';
import { createFetchWithSchema } from './fetch-with-schema';
import { resolveDbSchema } from './schema-mode';

export function createAdminClient() {
  const schemaResolution = resolveDbSchema();
  const schema = schemaResolution.schema;
  const useCustomSchemaTransport = schemaResolution.mode === 'custom';
  const fetchWithSchema = useCustomSchemaTransport ? createFetchWithSchema(schema) : undefined;
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    useCustomSchemaTransport
      ? {
          global: { fetch: fetchWithSchema },
          db: { schema },
        }
      : undefined
  );
}
