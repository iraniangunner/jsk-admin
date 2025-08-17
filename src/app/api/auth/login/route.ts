import { NextResponse } from "next/server";
import { pool } from "../../../../lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "../../../../lib/auth";

export async function POST(req: Request) {
  const { username, password } = await req.json();


  const [rows]: any = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
  const user = rows[0];
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const valid = await bcrypt.compare(password, user.password);

//   const hash = await bcrypt.hash("123456", 10);
//   console.log(hash)
//   console.log(valid)
  if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = signToken({ id: user.id, username: user.username });

  const res = NextResponse.json({ message: "Logged in", username: user.username });
  res.headers.set(
    "Set-Cookie",
    `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`
  );
  return res;
}
