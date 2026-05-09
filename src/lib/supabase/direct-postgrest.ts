/**
 * 直接调用 PostgREST API，绕过 Supabase JS 库的 schema cache 限制
 * 这是解决 "Could not find the table 'X' in the schema cache" 错误的方法
 */
export async function queryPostgREST<T>(
  baseUrl: string,
  table: string,
  schema: string,
  anonKey: string,
  queryParams: Record<string, any> = {}
): Promise<{ data: T[] | null; error: Error | null }> {
  try {
    const params = new URLSearchParams();
    
    // 处理 select 参数
    if (queryParams.select) {
      params.set('select', queryParams.select);
    }
    
    // 处理 filter 参数
    for (const [key, value] of Object.entries(queryParams)) {
      if (key !== 'select' && value !== undefined) {
        params.append(key, String(value));
      }
    }

    const url = `${baseUrl}/rest/v1/${table}${params.size > 0 ? '?' + params.toString() : ''}`;
    
    console.log(`\n🔍 [PostgREST Direct Query]`);
    console.log(`   Table: ${table}`);
    console.log(`   Schema: ${schema}`);
    console.log(`   User Filter: user_id=eq.${queryParams['user_id']?.split('.')[1] || 'unknown'}`);
    console.log(`   URL: ${url.substring(0, 80)}...`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Profile': schema,  // 这是关键 - 指定 schema
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ PostgREST Error ${response.status}:`, errorText);
      throw new Error(`PostgREST error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Got ${data?.length || 0} rows from ${schema}.${table}`);
    return { data, error: null };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return { data: null, error: err };
  }
