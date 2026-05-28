import { NextRequest, NextResponse } from "next/server";
import { createUserFromRegister } from "@/lib/db";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 }
    );
  }

  try {
    const user = await createUserFromRegister(email, password, name);

    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
    res.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return res;
  } catch (err) {
    const msg = (err as Error)?.message || "Unknown";
    if (msg.includes("UNIQUE") || msg.includes("duplicate")) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: `Registration failed: ${msg}` },
      { status: 500 }
    );
  }
}
