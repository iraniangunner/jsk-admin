import { type NextRequest, NextResponse } from "next/server";
import { refreshAccessToken } from "./app/_actions/login-action";

const THRESHOLD_MS = 5 * 60 * 1000; // ۵ دقیقه قبل از انقضا

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // اجازه دسترسی به فایل‌های استاتیک و API
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const access = req.cookies.get("access_token")?.value;
  const refresh = req.cookies.get("refresh_token")?.value;
  const expStr = req.cookies.get("expires_at")?.value;
  const now = Date.now();

  // صفحه login
  // جلوگیری از کش صفحات حساس

  const res = NextResponse.next();
  if (pathname === "/" || pathname === "/login") {
    res.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
  }

  // صفحه login
  if (pathname === "/login") {
    if (access && expStr && Number(expStr) > now) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return res;
  }

  // اگر access token موجود نیست یا منقضی شده
  if (!access || !expStr || Number(expStr) <= now) {
    if (refresh) {
      const newToken = await refreshAccessToken(refresh);
      if (newToken) return NextResponse.next(); // refresh موفق
    }

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // نزدیک انقضا → refresh خودکار
  if (Number(expStr) - now <= THRESHOLD_MS && refresh) {
    const newToken = await refreshAccessToken(refresh);
    if (newToken) return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
