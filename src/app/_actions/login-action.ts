"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const RECAPTCHA_SECRET = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY!;

// const cookieBase = {
//   httpOnly: true,
//   sameSite: "lax" as const,
//   path: "/",
//   secure: false,
// };

const cookieBase = {
  httpOnly: true,
  sameSite: "none" as const,
  path: "/",
  secure: true,
  domain: ".jsk-co.com",
};

type LoginResp = {
  access_token: string;
  refresh_token: string;
  expires_in: number; // ثانیه
};

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const token = formData.get("g-recaptcha-response") as string;

  // Basic validation
  if (!email || !password) {
    return { isSuccess: false, error: "نام کاربری و رمز عبور را وارد کنید" };
  }

  if (!token) {
    return { isSuccess: false, error: "لطفا reCAPTCHA را تکمیل کنید" };
  }

  // ✅ مرحله اول: بررسی reCAPTCHA
  try {
    const verifyRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${RECAPTCHA_SECRET}&response=${token}`,
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return { isSuccess: false, error: "تأیید reCAPTCHA ناموفق بود" };
    }
  } catch (err) {
    return { isSuccess: false, error: "خطا در بررسی reCAPTCHA" };
  }

  // ✅ مرحله دوم: لاگین به API
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      return { isSuccess: false, error: "ایمیل یا رمز عبور اشتباه است" };
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
      maxAge: 7 * 24 * 60 * 60, // ۷ روز
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
