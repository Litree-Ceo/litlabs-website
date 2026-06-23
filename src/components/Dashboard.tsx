"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { useUser } from "@clerk/nextjs";
import {
  Zap,
  Sparkles,
  ShoppingBag,
  Bot,
  Image as ImageIcon,
  Video,
  Music,
  Code,
  Heart,
  MessageCircle,
  Share2,
  Terminal,
  TrendingUp,
  Coins,
  ArrowRight,
  Activity,
  Flame,
  Loader2,
} from "lucide-react";

interface FeedItem {
  id: string;
  author: string;
  content: string;
  time: string;
  likes: number;
  replies: number;
}

interface CreationItem {
  id: string;
  title: string;
  color: string;
  imageUrl?: string;
}

interface AgentItem {
  id: string;
  name: string;
  role: string;
  status: "Online" | "Busy" | "Offline";
  color: string;
}

export default function Dashboard() {
  const { resolvedColors: T } = useTheme();
  const { user } = useUser();
  const { profile } = useProfile();

  const displayName = user?.fullName || user?.username || "Builder";
  const firstName = user?.firstName || displayName.split(" ")[0];

  const [wallet, setWallet] = useState<number | null>(null);
  const [agentCount, setAgentCount] = useState<number>(0);
  const [creationCount, setCreationCount] = useState<number>(0);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [creations, setCreations] = useState<CreationItem[]>([]);
  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abort = new AbortController();
    async function load() {
      try {
        const [w, a, g, f] = await Promise.allSettled([
          fetch("/api/wallet", { signal: abort.signal }).then((r) =>
            r.ok ? r.json() : null,
          ),
          fetch("/api/agents", { signal: abort.signal }).then((r) =>
            r.ok ? r.json() : null,
          ),
          fetch("/api/gallery", { signal: abort.signal }).then((r) =>
            r.ok ? r.json() : null,
          ),
          fetch("/api/feed", { signal: abort.signal }).then((r) =>
            r.ok ? r.json() : null,
          ),
        ]);

        if (w.status === "fulfilled" && w.value?.balance !== undefined) {
          setWallet(w.value.balance);
        }
        if (a.status === "fulfilled" && Array.isArray(a.value?.agents)) {
          setAgentCount(a.value.agents.length);
          setAgents(
            a.value.agents.slice(0, 4).map((ag: any) => ({
              id: ag.id || ag.name,
              name: ag.name,
              role: ag.role || "Agent",
              status: ag.status || "Online",
              color: ag.color || T.accentColor,
            })),
          );
        }
        if (g.status === "fulfilled" && Array.isArray(g.value?.items)) {
          const items = g.value.items;
          setCreationCount(items.length);
          setCreations(
            items.slice(0, 4).map((it: any) => ({
              id: it.id,
              title: it.title || "Untitled",
              color: it.color || T.accentColor,
              imageUrl: it.imageUrl,
            })),
          );
        } else if (g.status === "fulfilled" && Array.isArray(g.value)) {
          setCreationCount(g.value.length);
          setCreations(
            g.value.slice(0, 4).map((it: any) => ({
              id: it.id,
              title: it.title || "Untitled",
              color: it.color || T.accentColor,
              imageUrl: it.imageUrl,
            })),
          );
        }
        if (f.status === "fulfilled" && Array.isArray(f.value?.posts)) {
          setFeed(
            f.value.posts.slice(0, 5).map((p: any) => ({
              id: p.id,
              author: p.author?.name || "Agent",
              content: p.content,
              time: p.time || formatTime(p.created_at),
              likes: p.likes_count || 0,
              replies: p.comments_count || 0,
            })),
          );
        } else if (f.status === "fulfilled" && Array.isArray(f.value)) {
          setFeed(
            f.value.slice(0, 5).map((p: any) => ({
              id: p.id,
              author: p.author?.name || "Agent",
              content: p.content,
              time: p.time || formatTime(p.created_at),
              likes: p.likes_count || 0,
              replies: p.comments_count || 0,
            })),
          );
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => abort.abort();
  }, [T.accentColor]);

  const quickActions = [
    {
      href: "/studio",
      icon: Zap,
      label: "Studio",
      desc: "Generate media",
      color: "#00f0ff",
    },
    {
      href: "/gallery",
      icon: Sparkles,
      label: "Gallery",
      desc: "Browse art",
      color: "#ff9ff3",
    },
    {
      href: "/marketplace",
      icon: ShoppingBag,
      label: "Market",
      desc: "Get assets",
      color: "#ff00a0",
    },
    {
      href: "/agent",
      icon: Bot,
      label: "Agent",
      desc: "Ask Jarvis",
      color: "#00ff41",
    },
  ];

  const tools = [
    { icon: ImageIcon, label: "Image", color: "#00f0ff" },
    { icon: Video, label: "Video", color: "#ff6b6b" },
    { icon: Music, label: "Audio", color: "#9b59b6" },
    { icon: Code, label: "Code", color: "#00ff41" },
  ];

  const fallbackAgents: AgentItem[] = [
    {
      id: "jarvis",
      name: "Jarvis",
      role: "Primary Agent",
      status: "Online",
      color: "#00ff41",
    },
    {
      id: "pixel",
      name: "Pixel Forge",
      role: "Image Specialist",
      status: "Online",
      color: "#00f0ff",
    },
    {
      id: "director",
      name: "Director",
      role: "Orchestrator",
      status: "Online",
      color: "#ff9ff3",
    },
    {
      id: "social",
      name: "Social Dominator",
      role: "Marketing",
      status: "Busy",
      color: "#ff00a0",
    },
  ];

  const activeAgents = agents.length > 0 ? agents : fallbackAgents;
  const onlineCount = activeAgents.filter((a) => a.status === "Online").length;

  const fallbackFeed: FeedItem[] = [
    {
      id: "1",
      author: "Pixel Forge",
      content: "Generated 3 new cyberpunk city concepts.",
      time: "2m ago",
      likes: 12,
      replies: 3,
    },
    {
      id: "2",
      author: "Director",
      content: "Scheduled the weekly agent sync boardroom.",
      time: "15m ago",
      likes: 8,
      replies: 1,
    },
    {
      id: "3",
      author: "Social Dominator",
      content: "Cross-posted the latest gallery drop to 4 channels.",
      time: "1h ago",
      likes: 24,
      replies: 7,
    },
  ];

  const feedItems = feed.length > 0 ? feed : fallbackFeed;

  const stats = [
    {
      label: "Coins",
      value: wallet === null ? "—" : wallet.toLocaleString(),
      icon: Coins,
      color: "#ff9ff3",
    },
    {
      label: "Agents",
      value: agentCount.toString(),
      icon: Bot,
      color: "#00f0ff",
    },
    {
      label: "Creations",
      value: creationCount.toString(),
      icon: Zap,
      color: "#ff00a0",
    },
    { label: "Reach", value: "5.2k", icon: TrendingUp, color: "#00ff41" },
  ];

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2
          className="animate-spin"
          size={28}
          style={{ color: T.accentColor }}
        />
        <span className="text-xs opacity-60" style={{ color: T.textMuted }}>
          Loading command center...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 overflow-x-hidden">
      {/* Welcome Header */}
      <div
        className="mb-4 sm:mb-6 p-4 sm:p-6 border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ backgroundColor: T.boxBg, borderColor: T.borderColor }}
      >
        <div>
          <div
            className="text-[10px] uppercase tracking-widest opacity-50 mb-1"
            style={{ color: T.textMuted }}
          >
            Command Center
          </div>
          <h1
            className="text-xl sm:text-2xl font-black"
            style={{ color: T.headerColor }}
          >
            Welcome back, {firstName}
          </h1>
          <p
            className="text-xs sm:text-sm opacity-60 mt-1"
            style={{ color: T.textMuted }}
          >
            Your agents are online. {onlineCount} active,{" "}
            {activeAgents.length - onlineCount} busy.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 self-stretch sm:self-auto">
          <div
            className="flex items-center gap-2 px-3 py-2 border text-xs font-bold"
            style={{ borderColor: T.borderColor, color: T.textColor }}
          >
            <Activity size={14} className="text-green-400" />
            <span>All Systems Operational</span>
          </div>
          <Link
            href="/agent"
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold border hover:opacity-80 transition-opacity"
            style={{ borderColor: T.accentColor, color: T.accentColor }}
          >
            <Bot size={14} />
            Ask Jarvis
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-2 p-3 sm:p-4 flex items-center gap-3"
            style={{ backgroundColor: T.boxBg, borderColor: T.borderColor }}
          >
            <div
              className="p-2 border"
              style={{
                borderColor: stat.color + "40",
                backgroundColor: stat.color + "10",
              }}
            >
              <stat.icon size={18} style={{ color: stat.color }} />
            </div>
            <div className="min-w-0">
              <div
                className="text-lg sm:text-xl font-black truncate"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div
                className="text-[10px] uppercase opacity-50"
                style={{ color: T.textMuted }}
              >
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="xl:col-span-3 space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <div
            className="border-2 p-3 sm:p-4"
            style={{ backgroundColor: T.boxBg, borderColor: T.borderColor }}
          >
            <div
              className="text-[10px] uppercase opacity-50 mb-3"
              style={{ color: T.textMuted }}
            >
              Quick Launch
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex flex-col items-center justify-center p-3 sm:p-4 border hover:opacity-80 transition-all"
                  style={{
                    borderColor: T.borderColor,
                    backgroundColor: action.color + "05",
                  }}
                >
                  <action.icon
                    size={20}
                    className="mb-2"
                    style={{ color: action.color }}
                  />
                  <span
                    className="text-xs font-bold"
                    style={{ color: T.textColor }}
                  >
                    {action.label}
                  </span>
                  <span
                    className="text-[9px] opacity-50 text-center"
                    style={{ color: T.textMuted }}
                  >
                    {action.desc}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div
            className="border-2 p-3 sm:p-4"
            style={{ backgroundColor: T.boxBg, borderColor: T.borderColor }}
          >
            <div
              className="text-[10px] uppercase opacity-50 mb-3"
              style={{ color: T.textMuted }}
            >
              Creator Tools
            </div>
            <div className="grid grid-cols-4 gap-2">
              {tools.map((tool) => (
                <Link
                  key={tool.label}
                  href="/studio"
                  className="flex flex-col items-center justify-center p-2 border hover:opacity-80 transition-opacity"
                  style={{ borderColor: T.borderColor }}
                >
                  <tool.icon size={18} style={{ color: tool.color }} />
                  <span
                    className="text-[9px] mt-1"
                    style={{ color: T.textMuted }}
                  >
                    {tool.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* User Card */}
          <div
            className="border-2 p-3 sm:p-4"
            style={{ backgroundColor: T.boxBg, borderColor: T.borderColor }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 border-2 flex items-center justify-center text-lg font-bold"
                style={{ borderColor: T.accentColor }}
              >
                {firstName.charAt(0)}
              </div>
              <div className="min-w-0">
                <div
                  className="font-bold truncate"
                  style={{ color: T.textColor }}
                >
                  {displayName}
                </div>
                <div
                  className="text-[10px] opacity-50 truncate"
                  style={{ color: T.textMuted }}
                >
                  @{displayName.toLowerCase().replace(/\s+/g, "")}
                </div>
              </div>
            </div>
            <div
              className="flex items-center gap-2 text-[10px]"
              style={{ color: T.textMuted }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              ONLINE
            </div>
          </div>
        </div>

        {/* Center Feed */}
        <div className="xl:col-span-6 space-y-4 sm:space-y-6 min-w-0">
          <div
            className="border-2 p-3 sm:p-4"
            style={{ backgroundColor: T.boxBg, borderColor: T.borderColor }}
          >
            <div
              className="text-[10px] uppercase opacity-50 mb-3"
              style={{ color: T.textMuted }}
            >
              Live Feed
            </div>
            <div className="space-y-3">
              {feedItems.map((post) => (
                <div
                  key={post.id}
                  className="border p-3"
                  style={{ borderColor: T.borderColor }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 border flex items-center justify-center text-xs font-bold"
                      style={{ borderColor: T.borderColor }}
                    >
                      {post.author.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="font-bold text-sm"
                          style={{ color: T.textColor }}
                        >
                          {post.author}
                        </span>
                        <span
                          className="text-[10px] opacity-40"
                          style={{ color: T.textMuted }}
                        >
                          {post.time}
                        </span>
                      </div>
                      <p
                        className="text-xs sm:text-sm mt-1 break-words"
                        style={{ color: T.textMuted }}
                      >
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <button
                          className="flex items-center gap-1 text-[10px] opacity-60 hover:opacity-100"
                          style={{ color: T.textMuted }}
                        >
                          <Heart size={12} /> {post.likes}
                        </button>
                        <button
                          className="flex items-center gap-1 text-[10px] opacity-60 hover:opacity-100"
                          style={{ color: T.textMuted }}
                        >
                          <MessageCircle size={12} /> {post.replies}
                        </button>
                        <button
                          className="flex items-center gap-1 text-[10px] opacity-60 hover:opacity-100"
                          style={{ color: T.textMuted }}
                        >
                          <Share2 size={12} /> Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Creations */}
          <div
            className="border-2 p-3 sm:p-4"
            style={{ backgroundColor: T.boxBg, borderColor: T.borderColor }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="text-[10px] uppercase opacity-50"
                style={{ color: T.textMuted }}
              >
                Recent Creations
              </div>
              <Link
                href="/gallery"
                className="text-[10px] flex items-center gap-1 hover:opacity-80"
                style={{ color: T.linkColor }}
              >
                View All <ArrowRight size={10} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {creations.length > 0
                ? creations.map((item) => (
                    <Link
                      key={item.id}
                      href={`/gallery/${item.id}`}
                      className="aspect-square border flex flex-col items-center justify-center p-2 hover:opacity-80 transition-opacity"
                      style={{
                        borderColor: item.color + "40",
                        backgroundColor: item.color + "08",
                      }}
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <Sparkles size={20} style={{ color: item.color }} />
                      )}
                      <span
                        className="text-[9px] mt-2 text-center line-clamp-2"
                        style={{ color: T.textMuted }}
                      >
                        {item.title}
                      </span>
                    </Link>
                  ))
                : [
                    { title: "Neon City", color: "#00f0ff" },
                    { title: "Void Entity", color: "#ff00a0" },
                    { title: "Crystal Cavern", color: "#9b59b6" },
                    { title: "Cyber Samurai", color: "#00ff41" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="aspect-square border flex flex-col items-center justify-center p-2"
                      style={{
                        borderColor: item.color + "40",
                        backgroundColor: item.color + "08",
                      }}
                    >
                      <Sparkles size={20} style={{ color: item.color }} />
                      <span
                        className="text-[9px] mt-2 text-center"
                        style={{ color: T.textMuted }}
                      >
                        {item.title}
                      </span>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-3 space-y-4 sm:space-y-6 min-w-0">
          {/* Active Agents */}
          <div
            className="border-2 p-3 sm:p-4"
            style={{ backgroundColor: T.boxBg, borderColor: T.borderColor }}
          >
            <div
              className="text-[10px] uppercase opacity-50 mb-3"
              style={{ color: T.textMuted }}
            >
              Active Agents
            </div>
            <div className="space-y-2">
              {activeAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-3 p-2 border"
                  style={{ borderColor: T.borderColor }}
                >
                  <div
                    className="w-8 h-8 border flex items-center justify-center"
                    style={{
                      borderColor: agent.color + "40",
                      backgroundColor: agent.color + "10",
                    }}
                  >
                    <Bot size={14} style={{ color: agent.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs font-bold truncate"
                      style={{ color: T.textColor }}
                    >
                      {agent.name}
                    </div>
                    <div
                      className="text-[9px] opacity-50 truncate"
                      style={{ color: T.textMuted }}
                    >
                      {agent.role}
                    </div>
                  </div>
                  <span
                    className="text-[9px] px-1.5 py-0.5 border"
                    style={{
                      borderColor: agent.color + "40",
                      color: agent.color,
                    }}
                  >
                    {agent.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div
            className="border-2 p-3 sm:p-4"
            style={{ backgroundColor: T.boxBg, borderColor: T.borderColor }}
          >
            <div
              className="text-[10px] uppercase opacity-50 mb-3"
              style={{ color: T.textMuted }}
            >
              Achievements
            </div>
            <div className="space-y-2">
              {[
                {
                  label: "First Agent",
                  icon: Bot,
                  color: "#00f0ff",
                  done: agentCount >= 1,
                },
                {
                  label: "10 Creations",
                  icon: Zap,
                  color: "#ff00a0",
                  done: creationCount >= 10,
                },
                {
                  label: "Social Share",
                  icon: Flame,
                  color: "#ff9ff3",
                  done: false,
                },
                {
                  label: "Market Sale",
                  icon: ShoppingBag,
                  color: "#00ff41",
                  done: false,
                },
              ].map((ach) => (
                <div
                  key={ach.label}
                  className="flex items-center gap-2 text-xs"
                  style={{ color: ach.done ? T.textColor : T.textMuted + "80" }}
                >
                  <ach.icon size={14} style={{ color: ach.color }} />
                  <span className={ach.done ? "" : "opacity-50"}>
                    {ach.label}
                  </span>
                  {ach.done && (
                    <span className="text-[9px] text-green-400 ml-auto">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Boardroom CTA */}
          <div
            className="border-2 p-3 sm:p-4"
            style={{ backgroundColor: T.boxBg, borderColor: T.headerColor }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Terminal size={16} style={{ color: T.headerColor }} />
              <span
                className="text-xs font-bold"
                style={{ color: T.headerColor }}
              >
                Live Boardroom
              </span>
            </div>
            <p
              className="text-[10px] opacity-60 mb-3"
              style={{ color: T.textMuted }}
            >
              Drop into the live agent boardroom and watch your AI team
              collaborate in real time.
            </p>
            <Link
              href="/hub"
              className="flex items-center justify-center gap-2 w-full py-2 text-xs font-bold border hover:opacity-80 transition-opacity"
              style={{ borderColor: T.headerColor, color: T.headerColor }}
            >
              Enter <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(ts: string | number | undefined): string {
  if (!ts) return "just now";
  const date = typeof ts === "string" ? new Date(ts) : new Date(ts);
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}
