import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const expiresAt = req.cookies.get("expires_at")
    ? Number(req.cookies.get("expires_at")?.value)
    : 0;
  const now = Date.now();

  if (accessToken && expiresAt > now) {
    return NextResponse.json({ token: accessToken });
  }

  return NextResponse.json({ error: "No valid token" }, { status: 401 });
}
