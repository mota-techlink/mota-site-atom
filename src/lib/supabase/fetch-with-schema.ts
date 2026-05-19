/**
 * 创建带有自动 schema header 注入的 fetch 函数
 * 这解决了 Supabase JS 客户端在非公共 schema 下的问题
 */
export function createFetchWithSchema(schema: string) {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    let url = typeof input === 'string' ? input : input instanceof Request ? input.url : input.toString();
    
    // 在 PostgREST 请求和任何 Supabase API 请求上添加 schema header
    if (url.includes('/rest/v1/') || url.includes('/functions/')) {
      // 确保 headers 对象存在
      if (!init) init = {};
      if (!init.headers) init.headers = {};
      
      // 将 headers 转换为普通对象（处理 Headers 实例）
      const headers = init.headers instanceof Headers 
        ? Object.fromEntries(init.headers.entries())
        : { ...init.headers };
      
      // 添加 schema header（GET 使用 Accept-Profile，写操作使用 Content-Profile）
      headers['Accept-Profile'] = schema;
      headers['Content-Profile'] = schema;
      init.headers = headers;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📡 [Supabase Fetch] Schema=${schema}, URL=${url.split('?')[0].substring(url.length - 50)}`);
      }
    }
    
    // 使用原生 fetch
    return fetch(input, init);
  };
}
