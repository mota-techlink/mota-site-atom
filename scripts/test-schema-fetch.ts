import { createClient } from '@supabase/supabase-js';
import { createFetchWithSchema } from './src/lib/supabase/fetch-with-schema';

async function testSchemaFetch() {
  const url = 'https://ivflrmuylsksagmzufpa.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2ZmxybXV5bHNrc2FnbXp1ZnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxODY3OTYsImV4cCI6MjA4Mzc2Mjc5Nn0.PmU9OdHWPgda3tqgvhr-E6bbCOYcsW0dtON-9CQvySI';

  // Test with custom fetch that injects Content-Profile: test header
  const fetchWithSchema = createFetchWithSchema('test');
  
  const client = createClient(url, anonKey, {
    global: { fetch: fetchWithSchema },
    db: { schema: 'test' },
  });

  console.log('🧪 Testing Supabase client with fetch interceptor for test schema...\n');
  
  const { data, error } = await client
    .from('orders')
    .select('*')
    .limit(1);

  console.log('✅ Result:');
  console.log('   data:', data);
  console.log('   error:', error?.message || 'null');
  
  if (!error) {
    console.log('\n✨ SUCCESS! Fetch interceptor allows test schema queries!');
  } else {
    console.log('\n❌ Still getting error - need debugging');
  }
}

testSchemaFetch().catch(console.error);
