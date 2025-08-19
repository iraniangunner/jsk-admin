"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function logoutAction() {
  const c = await cookies();
  const accessToken = c.get("access_token")?.value;

  try {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), // 👈 هدر اضافه شد
      },
      cache: "no-store",
      credentials: "include", // اگه refresh_token تو کوکی داری
    });
  } catch (err) {
    console.error("Failed to call backend logout:", err);
  }

  // پاک کردن کوکی‌ها (حتی اگر درخواست fail بشه)
  c.delete("access_token");
  c.delete("refresh_token");
  c.delete("expires_at");

  return { ok: true };
}
