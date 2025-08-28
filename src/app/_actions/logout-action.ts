"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function logoutAction(prevState: any, formData: FormData) {
  const c = await cookies();
  const refreshToken = c.get("refresh_token")?.value;

  try {
    const res = await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const domain =
      process.env.NODE_ENV === "production" ? ".jsk-co.com" : undefined;

    if (res.ok) {
      c.set({
        name: "access_token",
        value: "",
        path: "/",
        domain,
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      });
      c.set({
        name: "refresh_token",
        value: "",
        path: "/",
        domain,
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      });
      c.set({
        name: "expires_at",
        value: "",
        path: "/",
        domain,
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      });
      return { isSuccess: true, error: "" };
    }
    return { isSuccess: false, error: "Logout failed" };
  } catch (err) {
    console.error("Logout failed:", err);
    return { isSuccess: false, error: "Network error occurred" };
  }
}
