import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const sb = getSupabase();

  try {
    const { data: existing } = await sb
      .from("users")
      .select("id, auth_id, username")
      .eq("auth_id", userId)
      .single();

    if (existing) {
      return NextResponse.json({
        success: true,
        user: existing,
        message: "User already exists",
      });
    }

    const shortId = userId.slice(-8);
    const username = `user_${shortId}`;
    const displayName = `LiTBit User ${shortId}`;

    const { data: newUser, error } = await sb
      .from("users")
      .insert({
        auth_id: userId,
        username: username,
        display_name: displayName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 },
      );
    }

    await sb.from("wallets").insert({
      user_id: newUser.id,
      balance: 500,
      lifetime_earned: 500,
    });

    return NextResponse.json({
      success: true,
      user: newUser,
      message: "User created successfully",
      startingBalance: 500,
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { exists: false, error: "Not authenticated" },
      { status: 401 },
    );
  }

  const sb = getSupabase();

  const { data: user } = await sb
    .from("users")
    .select("id, username, display_name")
    .eq("auth_id", userId)
    .single();

  return NextResponse.json({
    exists: !!user,
    user: user || null,
  });
}
