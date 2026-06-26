const BASE_URL = import.meta.env.VITE_EDGE_FN_URL as string;

function getInitData(): string {
  try {
    const raw = window.Telegram?.WebApp?.initData;
    if (raw) return raw;
    if (import.meta.env.DEV) return "mock";
    return "";
  } catch {
    return import.meta.env.DEV ? "mock" : "";
  }
}

interface ApiResult<T = unknown> {
  status: number;
  data: T;
  ok: boolean;
}

export async function apiFetch<T = unknown>(
  path: string,
  method: "GET" | "POST" | "DELETE" = "GET",
  body?: Record<string, unknown>
): Promise<ApiResult<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-telegram-init-data": getInitData(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = (await res.json()) as T;
  return { status: res.status, data, ok: res.ok };
}
