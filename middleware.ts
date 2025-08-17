import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTokenFromReq, verifyToken } from "./src/lib/auth";

export function middleware(req: NextRequest) {
  const token = getTokenFromReq(req);
  const isAuthenticated = token && verifyToken(token);

  const { pathname } = req.nextUrl;

  // مسیرهای auth (مثل login یا register)
  const authRoutes = ["/login"];
  // مسیرهای محافظت‌شده
  const protectedRoutes = ["/resumes"]; // یا مسیرهای دلخواه مثل /dashboard, /profile

  // اگر کاربر auth هست و میخواد بره به صفحه login، هدایتش به داشبورد
  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/resumes", req.url));
  }

  // اگر کاربر auth نیست و مسیر محافظت‌شده میخواد، هدایت به login
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
