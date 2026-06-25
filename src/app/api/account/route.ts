import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getOrCreateUser } from "@/lib/user-db";
import { withRateLimit } from "@/lib/rate-limiter";

async function getHandler(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await getOrCreateUser(userId, "", "");

    return NextResponse.json({
      synced: true,
      isNew: result.isNew,
      user: result.user
        ? {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json({ synced: false }, { status: 500 });
  }
}

async function deleteHandler(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: user, error: findError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", userId)
      .single();

    if (findError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", user.id);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete account" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 },
    );
  }
}

export const GET = withRateLimit(getHandler, 100, 60);
export const DELETE = withRateLimit(deleteHandler, 10, 60);
