"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// const isProd = process.env.NODE_ENV === 'production';
const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  //   secure: isProd,
  path: "/",
};

type LoginInput = { email: string; password: string };
type LoginResp = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
};

export async function loginAction(input: LoginInput) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = "Login failed";
    try {
      const j = await res.json();
      msg = j?.message ?? msg;
    } catch {}
    throw new Error(msg);
  }

  const data = (await res.json()) as LoginResp;
  const c = await cookies();

  // 1 ساعت
  c.set("access_token", data.access_token, { ...cookieBase, maxAge: 60 * 60 });
  // 7 روز
  c.set("refresh_token", data.refresh_token, {
    ...cookieBase,
    maxAge: 7 * 24 * 60 * 60,
  });
  // timestamp انقضا (ms)
  c.set("expires_at", String(data.expires_at), {
    ...cookieBase,
    maxAge: 60 * 60,
  });

  return { ok: true };
}
