import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function handler(req: NextRequest) {
  const path = req.nextUrl.pathname.replace(/^\/api\/proxy/, "");
  const res = await fetch(`${API_BASE}${path}`, {
    method: req.method,
    headers: { "Content-Type": "application/json" },
    body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
  });
  const text = await res.text();
  return new NextResponse(text, 
    { 
        status: res.status, 
        headers: { "Content-Type": "application/json" } });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
