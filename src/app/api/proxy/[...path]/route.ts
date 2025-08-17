import { NextResponse } from "next/server";
import { getTokenFromReq, verifyToken } from "../../../../lib/auth";

async function forward(req: Request, pathArray: string[]) {
  const headers: Record<string, string> = {
    "Content-Type": req.headers.get("content-type") || "application/json",
  };

  if (req.method !== "GET") {
    const token = getTokenFromReq(req);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = new URL(req.url);
  const laravelUrl = "https://jsk-co.com/api/" + pathArray.join("/") + url.search;

  const res = await fetch(laravelUrl, {
    method: req.method,
    headers,
    body: req.method !== "GET" ? await req.text() : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  return NextResponse.json(data, { status: res.status });
}

// در Next.js 14 باید params رو await کنیم
export async function GET(req: Request, context: any) {
  const { path } = await context.params; // <— اینجا تغییر کلیدی
  return forward(req, path);
}

export async function POST(req: Request, context: any) {
  const { path } = await context.params;
  return forward(req, path);
}

export async function PUT(req: Request, context: any) {
  const { path } = await context.params;
  return forward(req, path);
}

export async function DELETE(req: Request, context: any) {
  const { path } = await context.params;
  return forward(req, path);
}
