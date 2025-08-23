"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
};

type LoginInput = { email: string; password: string };
type LoginResp = {
  access_token: string;
  refresh_token: string;
  expires_in: number; // ثانیه
};

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Basic validation
  if (!email || !password) {
    return { isSuccess: false, error: "نام کاربری و رمز عبور را وارد کنید" };
  }

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      return { isSuccess: false, error: "Invalid credentials" };
    }

    const data = (await res.json()) as LoginResp;
    const c = await cookies();

    const expiresAt = Date.now() + data.expires_in * 1000;

    // ست کردن کوکی‌ها
    c.set("access_token", data.access_token, {
      ...cookieBase,
      maxAge: data.expires_in,
    });
    c.set("refresh_token", data.refresh_token, {
      ...cookieBase,
      maxAge: 7 * 24 * 60 * 60,
    });
    c.set("expires_at", String(expiresAt), {
      ...cookieBase,
      maxAge: data.expires_in,
    });

    return { isSuccess: true, error: "" };
  } catch (error) {
    return { isSuccess: false, error: "Login failed" };
  }
}

// تابع کمکی refresh token
export async function refreshAccessToken(refreshToken: string) {
  try {
    const res = await fetch(`${API_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return null;

    const data: LoginResp = await res.json();
    const c = await cookies();
    const expiresAt = Date.now() + data.expires_in * 1000;

    c.set("access_token", data.access_token, {
      ...cookieBase,
      maxAge: data.expires_in,
    });
    c.set("expires_at", String(expiresAt), {
      ...cookieBase,
      maxAge: data.expires_in,
    });

    return data.access_token;
  } catch (err) {
    console.error("Refresh failed:", err);
    return null;
  }
}
