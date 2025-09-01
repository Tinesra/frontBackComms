import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function handler(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname.replace(/^\/api\/proxy/, "");
    const searchParams = req.nextUrl.searchParams.toString();
    const fullPath = searchParams ? `${path}?${searchParams}` : path;

    const res = await fetch(`${API_BASE}${fullPath}`, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
    });
    
    const text = await res.text();
    console.log(`Response status: ${res.status}`);
    
    return new NextResponse(text, 
      { 
        status: res.status, 
        headers: { "Content-Type": "application/json" } 
      });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to connect to backend service" }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;