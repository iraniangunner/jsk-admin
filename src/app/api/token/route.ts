import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "No token found" }), {
      status: 401,
    });
  }

  return Response.json({ token });
}
