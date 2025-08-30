const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL as string;

type Options = RequestInit & { json?: unknown };

export async function api(path: string, opts: Options = {}) {
  const { json, headers, ...rest } = opts;
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: json ? JSON.stringify(json) : rest.body,
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
