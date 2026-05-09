import { createClient } from '@supabase/supabase-js';
import { createFetchWithSchema } from './fetch-with-schema';

export function createAdminClient() {
  const schema = process.env.NEXT_PUBLIC_SUPABASE_DB_SCHEMA || 'public';
  const fetchWithSchema = createFetchWithSchema(schema);
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: { fetch: fetchWithSchema },
      db: { schema },  // Provide schema in config
    }
  );
}
