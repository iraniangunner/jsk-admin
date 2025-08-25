import { NextResponse } from "next/server";

export function middleware(req: any) {
  const { pathname } = req.nextUrl;

  // اجازه به فایل‌های استاتیک و API
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  // اگر نه access token داریم و نه refresh token → redirect به login
  if (!accessToken && !refreshToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // در غیر این صورت اجازه به SPA داده می‌شود
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)"
  ],
};
