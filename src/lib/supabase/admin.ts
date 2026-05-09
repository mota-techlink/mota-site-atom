import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  const schema = process.env.NEXT_PUBLIC_SUPABASE_DB_SCHEMA || 'public';

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      db: { schema },
    }
  );
}
