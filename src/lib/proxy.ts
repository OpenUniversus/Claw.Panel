// 后端 API 代理工具

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

// 获取后端 API 地址
export function getBackendUrl(): string {
  return BACKEND_URL;
}

// 代理请求到后端
export async function proxyToBackend(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${BACKEND_URL}/api${path}`;
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  // 转发 Authorization 头
  if (options.headers) {
    const authHeader = (options.headers as Record<string, string>)['Authorization'];
    if (authHeader) {
      headers.set('Authorization', authHeader);
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    return response;
  } catch (error) {
    console.error('Backend proxy error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Backend service unavailable' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// 带超时的代理请求
export async function proxyWithTimeout(
  path: string,
  options: RequestInit = {},
  timeout: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await proxyToBackend(path, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      return new Response(
        JSON.stringify({ success: false, error: 'Request timeout' }),
        { status: 504, headers: { 'Content-Type': 'application/json' } }
      );
    }
    throw error;
  }
}
