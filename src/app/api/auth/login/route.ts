import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  let email = "";
  let password = "";

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    email = body.email || "";
    password = body.password || "";
  } else {
    const formData = await req.formData();
    email = (formData.get("email") as string) || "";
    password = (formData.get("password") as string) || "";
  }

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {}
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.session) {
    return NextResponse.json(
      { error: error?.message || "Invalid credentials" },
      { status: 401 }
    );
  }

  const user = data.session.user;

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split("@")[0] || null,
    },
  });
}
