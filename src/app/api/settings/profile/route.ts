import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserByAuthId, updateUserProfile, getOrCreateUser } from "@/lib/user-db";
import { withRateLimit } from "@/lib/rate-limiter";

async function getHandler(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByAuthId(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        auth_id: user.auth_id,
        email: user.email,
        name: user.name,
        username: user.username,
        avatar_url: user.avatar_url,
        bio: user.bio,
        website: user.website,
        location: user.location,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

async function postHandler(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const allowedUpdates = {
      ...(typeof body.name === "string" && body.name.trim() && { name: body.name.trim() }),
      ...(typeof body.username === "string" && body.username.trim() && { username: body.username.trim() }),
      ...(typeof body.bio === "string" && { bio: body.bio }),
      ...(typeof body.website === "string" && { website: body.website }),
      ...(typeof body.location === "string" && { location: body.location }),
      ...(typeof body.avatar_url === "string" && { avatar_url: body.avatar_url }),
    };

    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updatedUser = await updateUserProfile(userId, allowedUpdates);

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        auth_id: updatedUser.auth_id,
        email: updatedUser.email,
        name: updatedUser.name,
        username: updatedUser.username,
        avatar_url: updatedUser.avatar_url,
        bio: updatedUser.bio,
        website: updatedUser.website,
        location: updatedUser.location,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(getHandler, 100, 60);
export const POST = withRateLimit(postHandler, 50, 60);
