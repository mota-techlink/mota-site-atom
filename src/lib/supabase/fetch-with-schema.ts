/**
 * 创建带有自动 schema header 注入的 fetch 函数
 * 这解决了 Supabase JS 客户端在非公共 schema 下的问题
 */
export function createFetchWithSchema(schema: string) {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    // 确只在 PostgREST 请求上添加 schema header
    let url = typeof input === 'string' ? input : input instanceof Request ? input.url : input.toString();
    
    if (url.includes('/rest/v1/')) {
      // 确保 headers 对象存在
      if (!init) init = {};
      if (!init.headers) init.headers = {};
      
      // 将 headers 转换为普通对象（处理 Headers 实例）
      const headers = init.headers instanceof Headers 
        ? Object.fromEntries(init.headers.entries())
        : { ...init.headers };
      
      // 添加 schema header
      headers['Content-Profile'] = schema;
      init.headers = headers;
    }
    
    // 使用原生 fetch
    return fetch(input, init);
  };
}
