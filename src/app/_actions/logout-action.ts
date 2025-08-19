"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function logoutAction() {
  // تماس با بک‌اند برای logout
  try {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
  } catch (err) {
    console.error("Failed to call backend logout:", err);
    // حتی اگه fail شد، کوکی رو پاک می‌کنیم
  }

  // پاک کردن کوکی‌ها
  const c = await cookies();
  c.delete("access_token");
  c.delete("refresh_token");
  c.delete("expires_at");

  return { ok: true };
}
