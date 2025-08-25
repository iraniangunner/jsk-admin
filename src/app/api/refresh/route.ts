import { cookies } from "next/headers";

export async function POST() {
  const c = cookies();
  const refreshToken = c.get("refresh_token")?.value;

  if (!refreshToken) {
    return new Response(JSON.stringify({ error: "No refresh token" }), { status: 401 });
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await res.json();

  if (!res.ok) {
    return new Response(JSON.stringify(data), { status: res.status });
  }

 // بروز رسانی cookie ها
  const cookieBase = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: false,
  };

//   const cookieBase = {
//   httpOnly: true,
//   sameSite: "none" as const,
//   path: "/",
//   secure: true,
//   domain: ".jsk-co.com",
// };

  const expiresAt = Date.now() + data.expires_in * 1000;

  c.set("access_token", data.access_token, { ...cookieBase, maxAge: data.expires_in });
  c.set("expires_at", String(expiresAt), { ...cookieBase, maxAge: data.expires_in });

  return new Response(JSON.stringify(data), { status: 200 });
}
