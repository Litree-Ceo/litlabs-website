import { generateText } from "./llm";

export type LayoutTheme = "cyber" | "neon" | "glitch" | "minimal" | "dark";
export type LayoutType = "grid" | "feed" | "dashboard" | "profile";

export interface LayoutWidget {
  id: string;
  type: "KodiStreamPlayer" | "SocialFeed" | "MediaGrid" | "ChatPanel" |
        "AgentStatus" | "StatsPanel" | "ProfileHeader" | "HeroBanner";
  props: Record<string, unknown>;
}

export interface LayoutSchema {
  version: "1.0";
  layout: LayoutType;
  theme: LayoutTheme;
  widgets: LayoutWidget[];
  userId?: string;
  agentId?: string;
}

export const EXAMPLE_LAYOUT: LayoutSchema = {
  version: "1.0",
  layout: "dashboard",
  theme: "neon",
  userId: "highlife4real1989@gmail.com",
  agentId: "social-dominator",
  widgets: [
    { id: "w1", type: "ProfileHeader", props: { username: "Larry B", avatar: "\uD83C\uDFA7", bio: "Trap Music Curator", stats: { agents: 12, plays: "1.8K" } } },
    { id: "w2", type: "KodiStreamPlayer", props: { source: "usr_folder/media/trap_mixes", autoplay: false, showTracklist: true } },
    { id: "w3", type: "SocialFeed", props: { display: "latest_tracks", limit: 20 } },
  ],
};

const WIDGET_TYPES: LayoutWidget["type"][] = [
  "ProfileHeader", "HeroBanner", "StatsPanel", "SocialFeed",
  "MediaGrid", "AgentStatus", "ChatPanel", "KodiStreamPlayer",
];

function inferWidgetsFromPrompt(prompt: string): LayoutWidget[] {
  const lower = prompt.toLowerCase();
  const widgets: LayoutWidget[] = [];
  let id = 1;

  if (lower.includes("profile") || lower.includes("bio") || lower.includes("about")) {
    widgets.push({ id: `w${id++}`, type: "ProfileHeader", props: {} });
  }
  if (lower.includes("hero") || lower.includes("banner") || lower.includes("landing")) {
    widgets.push({ id: `w${id++}`, type: "HeroBanner", props: {} });
  }
  if (lower.includes("stat") || lower.includes("metric") || lower.includes("analytics")) {
    widgets.push({ id: `w${id++}`, type: "StatsPanel", props: {} });
  }
  if (lower.includes("social") || lower.includes("feed") || lower.includes("post")) {
    widgets.push({ id: `w${id++}`, type: "SocialFeed", props: { display: "latest", limit: 20 } });
  }
  if (lower.includes("media") || lower.includes("gallery") || lower.includes("image")) {
    widgets.push({ id: `w${id++}`, type: "MediaGrid", props: {} });
  }
  if (lower.includes("agent") || lower.includes("bot") || lower.includes("ai")) {
    widgets.push({ id: `w${id++}`, type: "AgentStatus", props: {} });
  }
  if (lower.includes("chat") || lower.includes("message") || lower.includes("talk")) {
    widgets.push({ id: `w${id++}`, type: "ChatPanel", props: {} });
  }
  if (lower.includes("player") || lower.includes("music") || lower.includes("stream") || lower.includes("video")) {
    widgets.push({ id: `w${id++}`, type: "KodiStreamPlayer", props: { autoplay: false } });
  }

  if (widgets.length === 0) {
    widgets.push({ id: "w1", type: "ProfileHeader", props: {} });
    widgets.push({ id: "w2", type: "StatsPanel", props: {} });
  }

  return widgets;
}

function inferLayoutType(prompt: string): LayoutType {
  const lower = prompt.toLowerCase();
  if (lower.includes("profile") || lower.includes("user")) return "profile";
  if (lower.includes("dashboard") || lower.includes("admin")) return "dashboard";
  if (lower.includes("feed") || lower.includes("social")) return "feed";
  return "grid";
}

function inferTheme(prompt: string): LayoutTheme {
  const lower = prompt.toLowerCase();
  if (lower.includes("neon") || lower.includes("bright")) return "neon";
  if (lower.includes("glitch") || lower.includes("hacker") || lower.includes("matrix")) return "glitch";
  if (lower.includes("minimal") || lower.includes("clean") || lower.includes("simple")) return "minimal";
  if (lower.includes("dark") || lower.includes("night") || lower.includes("black")) return "dark";
  return "cyber";
}

function buildLayoutSchema(userPrompt: string, user: string, agent: string): LayoutSchema {
  return {
    version: "1.0",
    layout: inferLayoutType(userPrompt),
    theme: inferTheme(userPrompt),
    userId: user,
    agentId: agent,
    widgets: inferWidgetsFromPrompt(userPrompt),
  };
}

export async function generateLayout(userPrompt: string, user: string, agent: string): Promise<LayoutSchema> {
  try {
    const prompt = `You are a UI layout generator. Given a user request, output ONLY valid JSON matching this TypeScript type:

type LayoutSchema = {
  version: "1.0";
  layout: "grid" | "feed" | "dashboard" | "profile";
  theme: "cyber" | "neon" | "glitch" | "minimal" | "dark";
  widgets: Array<{
    id: string;
    type: "KodiStreamPlayer" | "SocialFeed" | "MediaGrid" | "ChatPanel" | "AgentStatus" | "StatsPanel" | "ProfileHeader" | "HeroBanner";
    props: Record<string, unknown>;
  }>;
};

User request: "${userPrompt}"
Agent: ${agent}

Output only the JSON, no explanation.`;

    const response = await generateText(prompt, { temperature: 0.3, maxTokens: 1000 });
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as LayoutSchema;
      parsed.userId = user;
      parsed.agentId = agent;
      return parsed;
    }
  } catch {
    // LLM failed, fall back to rule-based
  }

  return buildLayoutSchema(userPrompt, user, agent);
}
