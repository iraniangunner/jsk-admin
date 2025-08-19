// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const isProd = process.env.NODE_ENV === 'production';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // فقط login بدون توکن باز باشه
  if (pathname === '/login') {
    return NextResponse.next();
  }

  const access = req.cookies.get('access_token')?.value;
  const expStr = req.cookies.get('expires_at')?.value;

  // اگر توکن وجود ندارد → هدایت به login
  if (!access || !expStr) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const now = Date.now();
  const exp = Number(expStr || 0);
  const thresholdMs = 60_000; // 1 دقیقه مانده به انقضا

  if (Number.isFinite(exp) && now >= exp - thresholdMs) {
    // نزدیک انقضا → درخواست refresh داخلی
    try {
      const refreshRes = await fetch(new URL('/api/auth/refresh', req.url).toString(), {
        method: 'GET',
        headers: { cookie: req.headers.get('cookie') || '' },
      });

      if (refreshRes.ok) {
        const { access_token, expires_at } = (await refreshRes.json()) as {
          access_token: string;
          expires_at: number;
        };

        const res = NextResponse.next();
        res.cookies.set('access_token', access_token, {
          httpOnly: true,
          sameSite: 'lax',
          // secure: isProd,
          path: '/',
          maxAge: 60 * 60,
        });
        res.cookies.set('expires_at', String(expires_at), {
          httpOnly: true,
          sameSite: 'lax',
          // secure: isProd,
          path: '/',
          maxAge: 60 * 60,
        });
        return res;
      } else {
        // رفرش نشد → هدایت به login
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // همه مسیرها به جز API و _next/static/image و favicon.ico
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
