const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL as string;

type Options = RequestInit & { 
  json?: unknown;
  params?: Record<string, string>;
};

export async function api(path: string, opts: Options = {}) {
  const { json, headers, params, ...rest } = opts;

  let url = `${API_BASE}${path}`;
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value);
      }
    });
    url += `?${searchParams.toString()}`;
  }

  const body = (rest.method === 'GET' || rest.method === 'HEAD') 
    ? undefined 
    : json ? JSON.stringify(json) : rest.body;

  const res = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body,
    cache: "no-store",
  });

  const text = await res.text();
  let data: unknown = text;
  try { data = JSON.parse(text); } catch {}
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${JSON.stringify(data)}`);
  }
  return data;
}