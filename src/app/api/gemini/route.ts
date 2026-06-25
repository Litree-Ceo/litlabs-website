import { NextRequest, NextResponse } from "next/server";
import { withRateLimit } from "@/lib/rate-limiter";
import { generateText, llmHealth } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 60;

const DEMO_RESPONSES = [
  "I'm Jarvis, your AI agent for LiTTree Lab Studios. I can help you build agents, generate images, analyze data, write content, and automate workflows. What would you like to create today?",
  "Great question! Our platform lets you deploy specialized AI agents for coding, writing, data analysis, social media growth, and more. Each agent is finely tuned for its domain and can be deployed with one click.",
  "You can get started by heading to the Studio to build your first agent, or browse the Marketplace for pre-built solutions. Both are available from the navigation bar above.",
  "The Studio is our creative hub. You'll find tools for image generation, audio production, video creation, and a visual pipeline builder for complex multi-agent workflows.",
  "Our agents include Director (orchestration), Champion (general tasks), Code Champ (software engineering), Social Dom (growth hacking), Data Slayer (analytics), and Writer (content creation). Each has unique capabilities.",
  "Yes! You can earn LitCoins through platform activity and use them to unlock premium agents and features. It's our way of rewarding the community.",
  "Security is a top priority. We use Clerk for authentication, encrypt all data in transit and at rest, and enforce rate limiting and RLS policies on all API routes.",
];

function demoResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi ") || lower.includes("hey")) {
    return "Hey there! I'm Jarvis, your AI command center. What can I help you build today?";
  }
  if (lower.includes("what") && (lower.includes("do") || lower.includes("can"))) {
    return DEMO_RESPONSES[0];
  }
  if (lower.includes("how") && (lower.includes("start") || lower.includes("begin") || lower.includes("get"))) {
    return DEMO_RESPONSES[2];
  }
  if (lower.includes("agent") || lower.includes("workflow")) {
    return DEMO_RESPONSES[1];
  }
  if (lower.includes("studio") || lower.includes("create") || lower.includes("build")) {
    return DEMO_RESPONSES[3];
  }
  if (lower.includes("coin") || lower.includes("earn") || lower.includes("token")) {
    return DEMO_RESPONSES[5];
  }
  if (lower.includes("security") || lower.includes("safe") || lower.includes("privacy")) {
    return DEMO_RESPONSES[6];
  }
  return DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
}

async function handler(req: NextRequest) {
  try {
    const { message, systemPrompt, task, preferFree } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const health = llmHealth();
    if (!health.gemini.available && !health.openrouter.available) {
      return NextResponse.json({
        response: demoResponse(message),
        provider: "demo",
        model: "jarvis-demo",
        latencyMs: 0,
        failover: [],
      });
    }

    const r = await generateText(
      message,
      {
        task: task || "creative",
        preferFree: !!preferFree,
        maxTokens: 1024,
      },
      systemPrompt,
    );
    return NextResponse.json({
      response: r.text,
      provider: r.provider,
      model: r.model,
      latencyMs: r.latencyMs,
      failover: r.failover,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export const POST = withRateLimit(handler, 60, 60);
