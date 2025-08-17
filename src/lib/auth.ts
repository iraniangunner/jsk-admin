import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";
const TOKEN_NAME = "token";
const TOKEN_EXP = "1h"; // یک ساعت

// ساخت JWT
export function signToken(payload: object) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_EXP });
}

// بررسی JWT و برگشت payload
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
}

// گرفتن JWT از درخواست (cookie)
export function getTokenFromReq(req: Request | NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map(c => c.trim().split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
  return cookies[TOKEN_NAME] || null;
}

// بررسی JWT از cookie و برگشت payload یا خطا
export function verifyTokenFromCookies(req: Request | NextRequest) {
  const token = getTokenFromReq(req);
  if (!token) throw new Error("No token");

  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  return payload;
}
