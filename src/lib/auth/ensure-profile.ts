import { createAdminClient } from '@/lib/supabase/admin';

type MinimalUser = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, any>;
};

export async function ensureUserProfile(user: MinimalUser) {
  const admin = createAdminClient();
  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Member';

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

  return { error };
}
