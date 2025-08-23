"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function logoutAction(prevState: any, formData: FormData) {
  const c = await cookies();
  const accessToken = c.get("access_token")?.value;

  try {
    const res = await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    if (res.ok) {
      c.delete("access_token");
      c.delete("refresh_token");
      c.delete("expires_at");
      return { isSuccess: true, error: "" };
    }
    return { isSuccess: false, error: "Logout failed" };
  } catch (err) {
    console.error("Logout failed:", err);
    return { isSuccess: false, error: "Network error occurred" };
  }
}
