import { type NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const THRESHOLD_MS = 5 * 60 * 1000; // ۵ دقیقه قبل از انقضا

// const cookieBase = {
//   httpOnly: true,
//   sameSite: "lax" as const,
//   path: "/",
//   secure: true, // روی هاست: true
//   domain: ".jsk-co.com",
// };

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
};

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

  let res = NextResponse.next();

  // جلوگیری از کش صفحات حساس
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

  // helper برای refresh
  async function tryRefresh(refreshToken: string) {
    try {
      const r = await fetch(`${API_URL}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
        cache: "no-store",
      });

      if (!r.ok) return null;
      const data = await r.json();

      const expiresAt = Date.now() + data.expires_in * 1000;

      res.cookies.delete("access_token");
      res.cookies.delete("expires_at");

      res.cookies.set("access_token", data.access_token, {
        ...cookieBase,
        maxAge: data.expires_in,
      });

      res.cookies.set("expires_at", String(expiresAt), {
        ...cookieBase,
        maxAge: data.expires_in,
      });

      return data.access_token;
    } catch (err) {
      console.error("refresh error:", err);
      return null;
    }
  }

  // اگر access token موجود نیست یا منقضی شده
  if (!access || !expStr || Number(expStr) <= now) {
    if (refresh) {
      const newToken = await tryRefresh(refresh);
      if (newToken) return res;
    }

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // نزدیک انقضا → refresh خودکار
  if (Number(expStr) - now <= THRESHOLD_MS && refresh) {
    const newToken = await tryRefresh(refresh);
    if (newToken) return res;
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
