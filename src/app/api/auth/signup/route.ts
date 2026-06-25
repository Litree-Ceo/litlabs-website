import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getAdminSupabase } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, password, firstName, lastName } = body;

  if (!email || !password || !firstName) {
    return NextResponse.json(
      { error: "First name, email, and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
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

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        name: `${firstName}${lastName ? ` ${lastName}` : ""}`,
        first_name: firstName,
        last_name: lastName || "",
      },
    },
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  if (!data.user) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }

  // Create user record in public.users table
  try {
    const admin = getAdminSupabase();
    const displayName = `${firstName}${lastName ? ` ${lastName}` : ""}`;
    const username = email.trim().split("@")[0];

    await admin.from("users").insert({
      auth_id: data.user.id,
      email: email.trim(),
      name: displayName,
      username,
    });

    await admin.from("user_preferences").insert({ user_id: data.user.id });
    await admin.from("wallets").insert({ user_id: data.user.id, balance: 500 });
  } catch {
    // User created in auth but DB insert failed — still return success
    // Webhook or periodic sync will handle this
  }

  return NextResponse.json({
    user: {
      id: data.user.id,
      email: data.user.email,
      name: `${firstName}${lastName ? ` ${lastName}` : ""}`,
    },
    message: "Check your email for the confirmation link",
  });
}
