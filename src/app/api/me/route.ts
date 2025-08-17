import { NextResponse } from "next/server";
import { verifyTokenFromCookies } from "../../../lib/auth";
import { pool } from "../../../lib/db";
import { JwtPayload } from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    // بررسی JWT و استخراج payload
    const userPayload = verifyTokenFromCookies(req) as JwtPayload;

    // گرفتن اطلاعات کامل کاربر از DB
    const [rows]: any = await pool.query("SELECT id, username, email FROM users WHERE id = ?", [userPayload.id]);
    const user = rows[0];

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
