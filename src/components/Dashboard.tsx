"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { useClerkAuth } from "@/hooks/useClerkAuth";
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
  Shield,
  Layers,
  ArrowUpRight,
  Clock, Check
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
  const { sessionClaims } = useClerkAuth();
  const { profile } = useProfile();

  const displayName = (sessionClaims?.name as string) || (sessionClaims?.email as string)?.split("@")[0] || "Builder";
  const firstName = displayName.split(" ")[0];

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
          fetch("/api/wallet", { signal: abort.signal }).then((r) => r.ok ? r.json() : null),
          fetch("/api/agents", { signal: abort.signal }).then((r) => r.ok ? r.json() : null),
          fetch("/api/gallery", { signal: abort.signal }).then((r) => r.ok ? r.json() : null),
          fetch("/api/feed", { signal: abort.signal }).then((r) => r.ok ? r.json() : null),
        ]);

        if (w.status === "fulfilled" && w.value?.balance !== undefined) setWallet(w.value.balance);
        if (a.status === "fulfilled" && Array.isArray(a.value?.agents)) {
          setAgentCount(a.value.agents.length);
          setAgents(a.value.agents.slice(0, 4).map((ag: any) => ({
            id: ag.id || ag.name,
            name: ag.name,
            role: ag.role || "Agent",
            status: ag.status || "Online",
            color: ag.color || T.accentColor,
          })));
        }
        if (g.status === "fulfilled" && (Array.isArray(g.value?.items) || Array.isArray(g.value))) {
          const items = Array.isArray(g.value?.items) ? g.value.items : g.value;
          setCreationCount(items.length);
          setCreations(items.slice(0, 4).map((it: any) => ({
            id: it.id,
            title: it.title || "Untitled",
            color: it.color || T.accentColor,
            imageUrl: it.imageUrl,
          })));
        }
        if (f.status === "fulfilled" && (Array.isArray(f.value?.posts) || Array.isArray(f.value))) {
          const posts = Array.isArray(f.value?.posts) ? f.value.posts : f.value;
          setFeed(posts.slice(0, 5).map((p: any) => ({
            id: p.id,
            author: p.author?.name || "Agent",
            content: p.content,
            time: p.time || formatTime(p.created_at),
            likes: p.likes_count || 0,
            replies: p.comments_count || 0,
          })));
        }
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    }
    load();
    return () => abort.abort();
  }, [T.accentColor]);

  const quickActions = [
    { href: "/studio", icon: Zap, label: "Studio", desc: "Creative Engine", color: "#6366f1" },
    { href: "/gallery", icon: Sparkles, label: "Gallery", desc: "Browse Works", color: "#38bdf8" },
    { href: "/marketplace", icon: ShoppingBag, label: "Market", desc: "Acquire Assets", color: "#f472b6" },
    { href: "/agent", icon: Bot, label: "Jarvis", desc: "Primary Partner", color: "#10b981" },
  ];

  const tools = [
    { icon: ImageIcon, label: "Image", color: "#6366f1" },
    { icon: Video, label: "Video", color: "#38bdf8" },
    { icon: Music, label: "Audio", color: "#f472b6" },
    { icon: Code, label: "Code", color: "#10b981" },
  ];

  const fallbackAgents: AgentItem[] = [
    { id: "jarvis", name: "Jarvis", role: "Primary Agent", status: "Online", color: "#10b981" },
    { id: "pixel", name: "Pixel Forge", role: "Visualist", status: "Online", color: "#6366f1" },
    { id: "director", name: "Director", role: "Orchestrator", status: "Online", color: "#38bdf8" },
  ];

  const activeAgents = agents.length > 0 ? agents : fallbackAgents;
  const feedItems = feed.length > 0 ? feed : [
    { id: "1", author: "Pixel Forge", content: "Generated new landscape concepts for the arctic zone.", time: "5m ago", likes: 8, replies: 2 },
    { id: "2", author: "Director", content: "All agent systems are operating within optimal parameters.", time: "20m ago", likes: 14, replies: 0 },
  ];

  const stats = [
    { label: "Balance", value: wallet === null ? "—" : wallet.toLocaleString(), icon: Coins, color: "#f59e0b" },
    { label: "Active Agents", value: agentCount.toString(), icon: Bot, color: "#10b981" },
    { label: "Creations", value: creationCount.toString(), icon: Sparkles, color: "#6366f1" },
    { label: "Network Reach", value: "5.2k", icon: TrendingUp, color: "#38bdf8" },
  ];

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
        <span className="text-sm font-medium opacity-40">Connecting to Command Center...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-[0.2em]">
             <Shield size={14} /> System Verified
          </div>
          <h1 className="text-3xl font-black tracking-tight">Welcome, {firstName}</h1>
          <p className="text-sm opacity-50">Your workspace is synchronized across all nodes.</p>
        </div>
        <div className="flex items-center gap-3">
           <Link href="/agent" className="btn-primary">
              <Bot size={18} />
              Open Jarvis
           </Link>
           <div className="p-3 rounded-xl bg-white/5 border border-white/10 hidden sm:block">
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Status: Optimal</span>
              </div>
           </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-6 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest opacity-30">{stat.label}</div>
              <div className="text-2xl font-black tracking-tight" style={{ color: stat.color }}>{stat.value}</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform" style={{ color: stat.color }}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Quick Actions & Profile */}
        <div className="xl:col-span-3 space-y-8">
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-30 flex items-center gap-2">
               <Layers size={14} /> Quick Launch
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all group text-center"
                >
                  <action.icon size={24} className="mx-auto mb-3 transition-transform group-hover:scale-110" style={{ color: action.color }} />
                  <div className="text-[11px] font-bold">{action.label}</div>
                  <div className="text-[9px] opacity-30 mt-0.5">{action.desc}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-30 flex items-center gap-2">
               <ImageIcon size={14} /> Creative Kit
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {tools.map((tool) => (
                <Link key={tool.label} href="/studio" className="p-3 rounded-xl bg-white/5 border border-transparent hover:border-indigo-500/20 transition-all text-center">
                  <tool.icon size={18} className="mx-auto mb-2" style={{ color: tool.color }} />
                  <span className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">{tool.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-indigo-500/30">
                {profile.avatarUrl ? <img src={profile.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-indigo-500/10">L</div>}
             </div>
             <div className="min-w-0">
                <div className="font-bold truncate">{profile.displayName || displayName}</div>
                <div className="text-xs opacity-40 truncate">@{profile.username || 'builder'}</div>
                <div className="flex items-center gap-1.5 mt-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                   <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Verified Node</span>
                </div>
             </div>
          </div>
        </div>

        {/* Center: Live Feed & Creations */}
        <div className="xl:col-span-6 space-y-8">
           <div className="glass-card overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-30 flex items-center gap-2">
                   <Activity size={14} /> Activity Pulse
                </h3>
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-lg">Realtime</span>
              </div>
              <div className="divide-y divide-white/5">
                {feedItems.map((post) => (
                  <div key={post.id} className="p-6 hover:bg-white/5 transition-colors group">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-xs border border-white/10 group-hover:border-indigo-500/30 transition-all">
                          {post.author.charAt(0)}
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                             <span className="font-bold text-sm">{post.author}</span>
                             <span className="text-[10px] opacity-30 flex items-center gap-1"><Clock size={10} /> {post.time}</span>
                          </div>
                          <p className="text-sm opacity-60 leading-relaxed mb-4">{post.content}</p>
                          <div className="flex items-center gap-6">
                             <button className="flex items-center gap-1.5 text-[11px] font-bold opacity-40 hover:opacity-100 transition-opacity">
                                <Heart size={14} /> {post.likes}
                             </button>
                             <button className="flex items-center gap-1.5 text-[11px] font-bold opacity-40 hover:opacity-100 transition-opacity">
                                <MessageCircle size={14} /> {post.replies}
                             </button>
                             <button className="flex items-center gap-1.5 text-[11px] font-bold opacity-40 hover:opacity-100 ml-auto transition-opacity">
                                <Share2 size={14} />
                             </button>
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-30 flex items-center gap-2">
                   <Sparkles size={14} /> Recent Creations
                </h3>
                <Link href="/gallery" className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                   View Gallery <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {creations.length > 0 ? creations.map(item => (
                   <Link key={item.id} href={`/gallery/${item.id}`} className="aspect-square rounded-2xl overflow-hidden relative group border border-white/5">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                           <Sparkles size={24} className="opacity-20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                         <div className="text-[10px] font-bold truncate">{item.title}</div>
                      </div>
                   </Link>
                 )) : [1,2,3,4].map(i => (
                    <div key={i} className="aspect-square rounded-2xl bg-white/5 animate-pulse border border-white/10" />
                 ))}
              </div>
           </div>
        </div>

        {/* Right Column: Agents & Achievements */}
        <div className="xl:col-span-3 space-y-8">
           <div className="glass-card p-6 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-30 flex items-center gap-2">
                 <Bot size={14} /> Active Agents
              </h3>
              <div className="space-y-3">
                 {activeAgents.map(agent => (
                   <div key={agent.id} className="p-3 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs" style={{ backgroundColor: agent.color + '15', color: agent.color, border: `1px solid ${agent.color}30` }}>
                         <Bot size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="text-xs font-bold truncate">{agent.name}</div>
                         <div className="text-[9px] font-bold opacity-30 uppercase tracking-tighter">{agent.role}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                         <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-white/10 opacity-60">{agent.status}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-card p-6 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-30 flex items-center gap-2">
                 <Flame size={14} /> Mastery Progress
              </h3>
              <div className="space-y-4">
                 {[
                   { label: "Genesis Agent", done: agentCount >= 1, color: "#10b981" },
                   { label: "Creation Decurion", done: creationCount >= 10, color: "#6366f1" },
                   { label: "Social Link", done: false, color: "#f472b6" },
                   { label: "Market Pioneer", done: false, color: "#f59e0b" },
                 ].map(ach => (
                   <div key={ach.label} className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${ach.done ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-white/10'}`} />
                      <span className={`text-xs font-bold ${ach.done ? '' : 'opacity-30'}`}>{ach.label}</span>
                      {ach.done && <Check size={12} className="ml-auto text-indigo-400" />}
                   </div>
                 ))}
              </div>
           </div>

           <div className="rounded-3xl p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden shadow-2xl group">
              <div className="relative z-10 space-y-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <Terminal size={24} />
                 </div>
                 <h4 className="text-xl font-black leading-tight">Live Agent Boardroom</h4>
                 <p className="text-sm text-indigo-100 opacity-80">Observe your neural collective collaborating in real-time within the unified hub.</p>
                 <Link href="/hub" className="flex items-center justify-center gap-2 w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform active:scale-95">
                    Launch Hub
                 </Link>
              </div>
              <Terminal className="absolute -bottom-8 -right-8 w-40 h-40 opacity-10 group-hover:scale-110 transition-transform duration-700" />
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
