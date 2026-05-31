import { NextRequest, NextResponse } from "next/server";
import { getAgents, createAgent } from "@/lib/agents";

export async function GET() {
  const agents = await getAgents();
  return NextResponse.json(agents);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, personality, skills } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const agent = await createAgent({
      name,
      description,
      personality,
      skills,
    });

    return NextResponse.json(agent);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}
