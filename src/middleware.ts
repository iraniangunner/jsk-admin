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

  const res = NextResponse.next();

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

// ==== چک session واقعی با GET و x-api-key ====
// if (access) {
//   try {
//     const verifyRes = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/session/verify`,
//       {
//         method: "GET",
//         headers: {
//           "x-api-key": access,
//         },
//         cache: "no-store", // خیلی مهم: جلوی کش رو می‌گیره
//       }
//     );

//     if (!verifyRes.ok) {
//       throw new Error(`Verify API returned ${verifyRes.status}`);
//     }

//     const data = await verifyRes.json();

//     if (data.status !== "valid") {
//       const logoutRes = NextResponse.redirect(new URL("/login", req.url));
//       logoutRes.cookies.set("access_token", "", { path: "/", maxAge: 0 });
//       logoutRes.cookies.set("refresh_token", "", { path: "/", maxAge: 0 });
//       logoutRes.cookies.set("expires_at", "", { path: "/", maxAge: 0 });
//       return logoutRes;
//     }
//   } catch (err) {
//     console.error("Session verification failed:", err);
//     const logoutRes = NextResponse.redirect(new URL("/login", req.url));
//     logoutRes.cookies.set("access_token", "", { path: "/", maxAge: 0 });
//     logoutRes.cookies.set("refresh_token", "", { path: "/", maxAge: 0 });
//     logoutRes.cookies.set("expires_at", "", { path: "/", maxAge: 0 });
//     return logoutRes;
//   }
// }


  // اگر access token موجود نیست یا منقضی شده
  if (!access || !expStr || Number(expStr) <= now) {
    if (refresh) {
      const newToken = await refreshAccessToken(refresh);
      if (newToken) return res; // refresh موفق
    }

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // نزدیک انقضا → refresh خودکار
  if (Number(expStr) - now <= THRESHOLD_MS && refresh) {
    const newToken = await refreshAccessToken(refresh);
    if (newToken) return res;
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
