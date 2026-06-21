import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    app: "LiTTree Lab Studios",
    version: "1.0.0",
  });
}
