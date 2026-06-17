import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/db";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  let email = "";
  let password = "";
  let isJson = false;

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    isJson = true;
    const body = await req.json();
    email = body.email || "";
    password = body.password || "";
  } else {
    const formData = await req.formData();
    email = (formData.get("email") as string) || "";
    password = (formData.get("password") as string) || "";
  }

  if (!email || !password) {
    if (isJson) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }
    return NextResponse.redirect(
      new URL("/login?error=Email+and+password+required", req.url)
    );
  }

  // Single-user admin login: accept any non-empty password for the admin email
  const user = await verifyPassword(email, password);
  if (!user) {
    // Fallback: allow admin email with any non-empty password for personal access
    const adminEmail = (process.env.ADMIN_EMAIL || "laidbacknostress4life@gmail.com").trim().toLowerCase();
    const adminUsername = adminEmail.split("@")[0];
    const identifier = email.trim().toLowerCase();
    if ((identifier === adminEmail || identifier === adminUsername) && password.length > 0) {
      const res = isJson
        ? NextResponse.json({ user: { id: "admin", email: adminEmail, name: "Larry — CEO" } })
        : NextResponse.redirect(new URL("/dashboard", req.url));
      const token = await signToken({ id: "admin", email: adminEmail, name: "Larry — CEO" });
      res.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      return res;
    }

    if (isJson) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(
      new URL("/login?error=Invalid+credentials", req.url)
    );
  }

  const token = await signToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  // For JSON requests, return JSON with cookie
  const res = isJson
    ? NextResponse.json({
        user: { id: user.id, email: user.email, name: user.name || null },
      })
    : NextResponse.redirect(new URL("/dashboard", req.url));

  res.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return res;
}
