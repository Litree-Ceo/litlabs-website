import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/db";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  const { email, password, rememberMe } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const user = await verifyPassword(email, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signToken({ id: user.id, email: user.email, name: user.name });
  const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });

  // Cookie: 7 days default, 30 days if remember me
  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;

  res.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });

  return res;
}
