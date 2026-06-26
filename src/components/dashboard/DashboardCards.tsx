"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import {
  Music,
  Gamepad2,
  Radio,
  Clapperboard,
  Zap,
  Sparkles,
  ShoppingBag,
  Send,
  Image as ImageIcon,
  Video,
  Mic,
  FileText,
  ArrowRight,
  Play,
  ExternalLink,
} from "lucide-react";
import {
  RADIO,
  GAMES,
  WATCH,
  TOOLS,
  type IconComponent,
} from "./dashboard-data";
import dynamic from "next/dynamic";
import SocialFeed from "@/components/SocialFeed";

/* Lazy-load heavy panes */
const DashboardContent = dynamic(() => import("./DashboardContent"), {
  ssr: false,
  loading: () => (
    <div className="h-48 rounded-xl animate-pulse bg-slate-800/30 border border-slate-700/30" />
  ),
});
const SocialPageContent = dynamic(
  () => import("@/components/SocialPageContent"),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 rounded-xl animate-pulse bg-slate-800/30 border border-slate-700/30" />
    ),
  },
);
const JarvisTerminal = dynamic(() => import("./JarvisTerminal"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 min-h-0 rounded-xl animate-pulse bg-slate-800/30 border border-slate-700/30" />
  ),
});

/* ── Shared primitives ─────────────────────────────────────────────── */

export function HeroCard({
  title,
  subtitle,
  color,
}: {
  title: string;
  subtitle: string;
  color: string;
}) {
  const { resolvedColors: T } = useTheme();
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 lg:p-8"
      style={{
        background: `linear-gradient(135deg, ${color}10 0%, ${T.boxBg} 100%)`,
        border: `1px solid ${color}25`,
      }}
    >
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
      <h2
        className="text-2xl lg:text-3xl font-black tracking-tight mb-2"
        style={{ color: T.textColor }}
      >
        {title}
      </h2>
      <p className="text-sm max-w-lg" style={{ color: T.textMuted }}>
        {subtitle}
      </p>
    </div>
  );
}

export function QuickActionGrid({
  actions,
}: {
  actions: {
    label: string;
    icon: IconComponent;
    color: string;
    href: string;
  }[];
}) {
  const { resolvedColors: T } = useTheme();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((a) => {
        const Icon = a.icon;
        return (
          <Link
            key={a.label}
            href={a.href}
            className="group flex flex-col items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: `${T.boxBg}80`,
              border: `1px solid ${a.color}20`,
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
              style={{
                backgroundColor: `${a.color}15`,
                border: `1px solid ${a.color}30`,
              }}
            >
              <Icon size={18} style={{ color: a.color }} />
            </div>
            <span className="text-xs font-bold" style={{ color: T.textColor }}>
              {a.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function GlossyCard({
  title,
  subtitle,
  color,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  color: string;
  icon: IconComponent;
}) {
  const { resolvedColors: T } = useTheme();
  return (
    <div
      className="group relative overflow-hidden rounded-xl p-5 transition-all hover:scale-[1.01] cursor-pointer"
      style={{
        backgroundColor: `${T.boxBg}60`,
        border: `1px solid ${color}20`,
      }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: "blur(30px)",
        }}
      />
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: `${color}15`,
            border: `1px solid ${color}30`,
          }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <div className="min-w-0">
          <div
            className="text-sm font-bold mb-0.5"
            style={{ color: T.textColor }}
          >
            {title}
          </div>
          <div className="text-[11px]" style={{ color: T.textMuted }}>
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Section header with "See all" link */
function SectionHeader({
  title,
  color,
  href,
}: {
  title: string;
  color: string;
  href?: string;
}) {
  const { resolvedColors: T } = useTheme();
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div
          className="w-1 h-5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h3
          className="text-base font-black tracking-tight"
          style={{ color: T.textColor }}
        >
          {title}
        </h3>
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-xs font-bold opacity-40 hover:opacity-100 transition-opacity"
          style={{ color }}
        >
          See all <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}

/* ── Center Stage ────────────────────────────────────────────────── */
export function CenterStage({
  activeApp,
  displayName,
}: {
  activeApp: string;
  displayName: string;
}) {
  const { resolvedColors: T } = useTheme();

  switch (activeApp) {
    /* ── JARVIS ──────────────────────────────────────────────────── */
    case "jarvis":
      return (
        <div className="h-full flex flex-col min-h-0">
          <JarvisTerminal />
        </div>
      );

    /* ── SOCIAL ──────────────────────────────────────────────────── */
    case "social":
      return <SocialPageContent />;

    /* ── STUDIO ──────────────────────────────────────────────────── */
    case "studio":
      return (
        <div className="space-y-8">
          <HeroCard
            title="Studio"
            subtitle="Create images, audio, video & code."
            color="#00f0ff"
          />

          {/* Main tools */}
          <div>
            <SectionHeader title="Create" color="#00f0ff" href="/studio" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Image Gen",
                  icon: ImageIcon,
                  color: "#ff00a0",
                  href: "/studio?tab=image",
                  desc: "Generate stunning visuals",
                },
                {
                  label: "Video Gen",
                  icon: Video,
                  color: "#00f0ff",
                  href: "/studio?tab=video",
                  desc: "AI-powered video creation",
                },
                {
                  label: "Audio Gen",
                  icon: Mic,
                  color: "#8b5cf6",
                  href: "/studio?tab=audio",
                  desc: "Music & soundscape",
                },
                {
                  label: "Code Agent",
                  icon: Zap,
                  color: "#ff9ff3",
                  href: "/studio?tab=code",
                  desc: "Write & debug code",
                },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <Link
                    key={t.label}
                    href={t.href}
                    className="group flex flex-col gap-4 p-5 rounded-2xl transition-all hover:scale-[1.02] hover:shadow-lg"
                    style={{
                      backgroundColor: `${T.boxBg}80`,
                      border: `1px solid ${t.color}25`,
                      boxShadow: `0 0 0 0 ${t.color}00`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${t.color}15`,
                        border: `1px solid ${t.color}30`,
                      }}
                    >
                      <Icon size={22} style={{ color: t.color }} />
                    </div>
                    <div>
                      <div
                        className="text-sm font-black mb-1"
                        style={{ color: T.textColor }}
                      >
                        {t.label}
                      </div>
                      <div
                        className="text-[11px]"
                        style={{ color: T.textMuted }}
                      >
                        {t.desc}
                      </div>
                    </div>
                    <ArrowRight
                      size={14}
                      className="opacity-0 group-hover:opacity-60 transition-opacity mt-auto"
                      style={{ color: t.color }}
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent generations */}
          <div>
            <SectionHeader
              title="Recent Generations"
              color="#00f0ff"
              href="/gallery?filter=me"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=300&h=300&fit=crop",
                "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&h=300&fit=crop",
                "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=300&fit=crop",
                "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=300&h=300&fit=crop",
              ].map((url, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer border border-white/5 hover:border-indigo-500/30 transition-all"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ExternalLink size={18} className="text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Images Created", value: "248", color: "#ff00a0" },
              { label: "Videos Generated", value: "12", color: "#00f0ff" },
              { label: "Audio Tracks", value: "37", color: "#8b5cf6" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-4 text-center"
                style={{
                  backgroundColor: `${T.boxBg}60`,
                  border: `1px solid ${s.color}20`,
                }}
              >
                <div
                  className="text-2xl font-black mb-1"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: T.textMuted }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    /* ── GALLERY ─────────────────────────────────────────────────── */
    case "gallery":
      return (
        <div className="space-y-8">
          <HeroCard
            title="Discovery Gallery"
            subtitle="Explore the peak of AI generation across the LiTree network."
            color="#ff00a0"
          />

          {/* Filter tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {["Top Picks", "Recent", "Following", "Your Drops", "Trending"].map(
              (tab, i) => (
                <Link
                  key={tab}
                  href={`/gallery?filter=${tab.toLowerCase().replace(" ", "-")}`}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? "bg-indigo-500 text-white" : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-white/10"}`}
                >
                  {tab}
                </Link>
              ),
            )}
          </div>

          {/* Masonry preview */}
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
            {[
              {
                url: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=300&h=400&fit=crop",
                title: "Neon Genesis City",
                aspect: "4/5",
              },
              {
                url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&h=200&fit=crop",
                title: "Abstract Flow",
                aspect: "3/2",
              },
              {
                url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=380&fit=crop",
                title: "Neural Network",
                aspect: "4/5",
              },
              {
                url: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=300&h=300&fit=crop",
                title: "Cyber Samurai",
                aspect: "1/1",
              },
              {
                url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=400&fit=crop",
                title: "Ethereal Dream",
                aspect: "3/4",
              },
              {
                url: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=300&h=360&fit=crop",
                title: "Void Entity",
                aspect: "5/6",
              },
              {
                url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=380&fit=crop",
                title: "Neon Portrait",
                aspect: "4/5",
              },
              {
                url: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=300&h=200&fit=crop",
                title: "Plasma Storm",
                aspect: "3/2",
              },
            ].map((item, i) => (
              <Link
                key={i}
                href="/gallery"
                className="block break-inside-avoid mb-3 group"
              >
                <div
                  className="relative overflow-hidden rounded-xl border border-white/5 group-hover:border-indigo-500/30 transition-all"
                  style={{ aspectRatio: item.aspect }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-[10px] font-black text-white truncate">
                      {item.title}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center">
            <Link
              href="/gallery"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-black uppercase tracking-widest hover:bg-indigo-500/20 transition-all"
            >
              Open Full Gallery <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      );

    /* ── MARKETPLACE ─────────────────────────────────────────────── */
    case "marketplace":
      return (
        <div className="space-y-8">
          <HeroCard
            title="Marketplace"
            subtitle="Templates, agents & creator tools."
            color="#ff9ff3"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Agent Packs",
                icon: Zap,
                color: "#00f0ff",
                href: "/marketplace?tab=agents",
                count: "24 packs",
                desc: "Pre-built agent configurations",
              },
              {
                label: "Templates",
                icon: FileText,
                color: "#ff00a0",
                href: "/marketplace?tab=templates",
                count: "140+ templates",
                desc: "Prompts, flows & workflows",
              },
              {
                label: "Subscriptions",
                icon: ShoppingBag,
                color: "#ff9ff3",
                href: "/marketplace?tab=plans",
                count: "3 plans",
                desc: "Pro, Creator & Enterprise",
              },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.label}
                  href={t.href}
                  className="group flex flex-col gap-4 p-6 rounded-2xl transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: `${T.boxBg}80`,
                    border: `1px solid ${t.color}25`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: `${t.color}15`,
                        border: `1px solid ${t.color}30`,
                      }}
                    >
                      <Icon size={22} style={{ color: t.color }} />
                    </div>
                    <span
                      className="text-[10px] font-black px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${t.color}15`,
                        color: t.color,
                      }}
                    >
                      {t.count}
                    </span>
                  </div>
                  <div>
                    <div
                      className="text-sm font-black mb-1"
                      style={{ color: T.textColor }}
                    >
                      {t.label}
                    </div>
                    <div className="text-[11px]" style={{ color: T.textMuted }}>
                      {t.desc}
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="opacity-0 group-hover:opacity-60 transition-opacity"
                    style={{ color: t.color }}
                  />
                </Link>
              );
            })}
          </div>

          {/* Featured items */}
          <div>
            <SectionHeader
              title="Featured This Week"
              color="#ff9ff3"
              href="/marketplace"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  title: "Social Dominator Pack",
                  price: "2,400 LBC",
                  color: "#ff00a0",
                  tag: "HOT",
                },
                {
                  title: "Content Engine v2",
                  price: "1,800 LBC",
                  color: "#00f0ff",
                  tag: "NEW",
                },
                {
                  title: "Visual Workflow Bundle",
                  price: "3,200 LBC",
                  color: "#8b5cf6",
                  tag: "SALE",
                },
                {
                  title: "Creator OS Template",
                  price: "Free",
                  color: "#10b981",
                  tag: "FREE",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:scale-[1.01] transition-all"
                  style={{
                    backgroundColor: `${T.boxBg}60`,
                    border: `1px solid ${item.color}20`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg"
                      style={{
                        backgroundColor: `${item.color}20`,
                        border: `1px solid ${item.color}30`,
                      }}
                    />
                    <div>
                      <div
                        className="text-xs font-black"
                        style={{ color: T.textColor }}
                      >
                        {item.title}
                      </div>
                      <div
                        className="text-[10px] font-bold"
                        style={{ color: T.textMuted }}
                      >
                        {item.price}
                      </div>
                    </div>
                  </div>
                  <span
                    className="text-[9px] font-black px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    /* ── MUSIC ───────────────────────────────────────────────────── */
    case "music":
      return (
        <div className="space-y-8">
          <HeroCard
            title="Music"
            subtitle="Playlists, radios & your library."
            color="#ff2d78"
          />

          {/* Now Playing */}
          <div
            className="relative overflow-hidden rounded-2xl p-6 flex items-center gap-6"
            style={{
              background: "linear-gradient(135deg, #ff2d7820, #8b5cf620)",
              border: "1px solid #ff2d7830",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 animate-pulse"
              style={{
                backgroundColor: "#ff2d7820",
                border: "1px solid #ff2d7840",
              }}
            >
              <Music size={28} style={{ color: "#ff2d78" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-[10px] font-black uppercase tracking-widest mb-1"
                style={{ color: "#ff2d78" }}
              >
                Now Playing
              </div>
              <div className="text-lg font-black text-white truncate">
                Synthwave FM
              </div>
              <div
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                342 live · Synthwave · Neon Horizon
              </div>
            </div>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                backgroundColor: "#ff2d78",
                boxShadow: "0 0 20px #ff2d7850",
              }}
            >
              <Play size={16} className="text-white ml-0.5" />
            </button>
          </div>

          {/* Radio stations */}
          <div>
            <SectionHeader title="Live Radio" color="#ff2d78" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RADIO.map((s) => (
                <div
                  key={s.title}
                  className="group flex items-center gap-4 p-4 rounded-xl cursor-pointer hover:scale-[1.01] transition-all"
                  style={{
                    backgroundColor: `${T.boxBg}60`,
                    border: `1px solid ${s.color}20`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${s.color}15`,
                      border: `1px solid ${s.color}30`,
                    }}
                  >
                    <Radio size={16} style={{ color: s.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-black truncate"
                      style={{ color: T.textColor }}
                    >
                      {s.title}
                    </div>
                    <div
                      className="text-[10px] flex items-center gap-1.5 mt-0.5"
                      style={{ color: T.textMuted }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ backgroundColor: s.color }}
                      />
                      {s.listeners} listening · {s.genre}
                    </div>
                  </div>
                  <Play
                    size={14}
                    className="opacity-0 group-hover:opacity-60 transition-opacity"
                    style={{ color: s.color }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Playlists */}
          <div>
            <SectionHeader title="Your Playlists" color="#ff2d78" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                "Workflow Beats",
                "Late Night Gen",
                "Focus Mode",
                "Hyperpop Mix",
              ].map((name, i) => {
                const colors = ["#ff2d78", "#8b5cf6", "#10b981", "#00f0ff"];
                return (
                  <div
                    key={name}
                    className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-all"
                    style={{
                      backgroundColor: `${colors[i]}15`,
                      border: `1px solid ${colors[i]}25`,
                    }}
                  >
                    <Music size={24} style={{ color: colors[i] }} />
                    <span
                      className="text-[10px] font-black text-center px-2"
                      style={{ color: T.textColor }}
                    >
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );

    /* ── GAMES ───────────────────────────────────────────────────── */
    case "games":
      return (
        <div className="space-y-8">
          <HeroCard
            title="Games Hub"
            subtitle="Arcade, quests & leaderboards."
            color="#8b5cf6"
          />

          {/* Featured game */}
          <div
            className="relative overflow-hidden rounded-2xl p-6 flex items-center gap-6"
            style={{
              background: "linear-gradient(135deg, #8b5cf620, #ff00a020)",
              border: "1px solid #8b5cf630",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "#8b5cf620",
                border: "1px solid #8b5cf640",
              }}
            >
              <Gamepad2 size={28} style={{ color: "#8b5cf6" }} />
            </div>
            <div className="flex-1">
              <div
                className="text-[10px] font-black uppercase tracking-widest mb-1"
                style={{ color: "#8b5cf6" }}
              >
                Most Played
              </div>
              <div className="text-lg font-black text-white">Cyber Drift</div>
              <div
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Racing · 3.1k playing now
              </div>
            </div>
            <Link
              href="/games"
              className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:opacity-80"
              style={{ backgroundColor: "#8b5cf6", color: "white" }}
            >
              Play
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GAMES.map((g) => (
              <Link
                key={g.title}
                href="/games"
                className="group flex items-center gap-4 p-5 rounded-2xl transition-all hover:scale-[1.01]"
                style={{
                  backgroundColor: `${T.boxBg}60`,
                  border: `1px solid ${g.color}20`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${g.color}15`,
                    border: `1px solid ${g.color}30`,
                  }}
                >
                  <Gamepad2 size={20} style={{ color: g.color }} />
                </div>
                <div className="flex-1">
                  <div
                    className="text-sm font-black mb-0.5"
                    style={{ color: T.textColor }}
                  >
                    {g.title}
                  </div>
                  <div
                    className="text-[10px] flex items-center gap-1.5"
                    style={{ color: T.textMuted }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: g.color }}
                    />
                    {g.genre} · {g.players} playing
                  </div>
                </div>
                <Play
                  size={16}
                  className="opacity-0 group-hover:opacity-60 transition-opacity"
                  style={{ color: g.color }}
                />
              </Link>
            ))}
          </div>

          {/* Leaderboard teaser */}
          <div>
            <SectionHeader title="Top Players" color="#8b5cf6" href="/games" />
            <div className="space-y-2">
              {[
                {
                  rank: 1,
                  name: "Pixel Forge",
                  score: "48,200",
                  color: "#ffd700",
                },
                {
                  rank: 2,
                  name: "GlitchKing",
                  score: "41,500",
                  color: "#c0c0c0",
                },
                {
                  rank: 3,
                  name: "DataMancer",
                  score: "38,900",
                  color: "#cd7f32",
                },
              ].map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                  style={{
                    backgroundColor: `${T.boxBg}40`,
                    border: `1px solid ${T.borderColor}20`,
                  }}
                >
                  <span
                    className="w-6 text-sm font-black"
                    style={{ color: p.color }}
                  >
                    #{p.rank}
                  </span>
                  <span
                    className="flex-1 text-xs font-bold"
                    style={{ color: T.textColor }}
                  >
                    {p.name}
                  </span>
                  <span
                    className="text-xs font-black"
                    style={{ color: "#8b5cf6" }}
                  >
                    {p.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    /* ── WATCH ───────────────────────────────────────────────────── */
    case "watch":
      return (
        <div className="space-y-8">
          <HeroCard
            title="Watch Room"
            subtitle="Tutorials, streams & creator content."
            color="#3b82f6"
          />

          {/* Featured video */}
          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer group"
            style={{ aspectRatio: "16/7" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=525&fit=crop"
              alt="Featured"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <Play size={24} className="text-white ml-1" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="text-[10px] font-black uppercase tracking-widest mb-1 text-blue-400">
                FEATURED
              </div>
              <div className="text-xl font-black text-white">
                Studio Deep Dive — Full Walkthrough
              </div>
              <div className="text-xs text-white/50 mt-1">
                LiTree Labs · 8.5k views
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {WATCH.map((w) => (
              <div
                key={w.title}
                className="group cursor-pointer rounded-xl overflow-hidden"
                style={{ border: `1px solid ${w.color}20` }}
              >
                <div className="relative aspect-video bg-black/40 flex items-center justify-center">
                  <Clapperboard
                    size={32}
                    style={{ color: w.color, opacity: 0.5 }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Play size={16} className="text-white ml-0.5" />
                    </div>
                  </div>
                </div>
                <div
                  className="p-3"
                  style={{ backgroundColor: `${T.boxBg}60` }}
                >
                  <div
                    className="text-xs font-black mb-0.5"
                    style={{ color: T.textColor }}
                  >
                    {w.title}
                  </div>
                  <div className="text-[10px]" style={{ color: T.textMuted }}>
                    {w.channel} · {w.views} views
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    /* ── RADIO ───────────────────────────────────────────────────── */
    case "radio":
      return (
        <div className="space-y-8">
          <HeroCard
            title="Radio"
            subtitle="Live stations curated for focus & flow."
            color="#10b981"
          />

          {/* Live player */}
          <div
            className="relative overflow-hidden rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, #10b98120, #00f0ff10)",
              border: "1px solid #10b98130",
            }}
          >
            <div className="flex items-center gap-5">
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: "#10b98120",
                    border: "1px solid #10b98140",
                  }}
                >
                  <Radio size={28} style={{ color: "#10b981" }} />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-black animate-pulse" />
              </div>
              <div className="flex-1">
                <div
                  className="text-[10px] font-black uppercase tracking-widest mb-1"
                  style={{ color: "#10b981" }}
                >
                  ● LIVE NOW
                </div>
                <div className="text-lg font-black text-white">
                  Lo-Fi Lounge
                </div>
                <div
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  891 listening · Lo-Fi Hip Hop
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    backgroundColor: "#10b981",
                    boxShadow: "0 0 20px #10b98150",
                  }}
                >
                  <Play size={16} className="text-white ml-0.5" />
                </button>
              </div>
            </div>
            {/* fake waveform */}
            <div className="flex items-end gap-0.5 mt-4 h-6">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm animate-pulse"
                  style={{
                    height: `${20 + Math.sin(i * 0.5) * 15}%`,
                    backgroundColor: "#10b981",
                    opacity: 0.4 + Math.random() * 0.4,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RADIO.map((s) => (
              <div
                key={s.title}
                className="group flex items-center gap-4 p-4 rounded-xl cursor-pointer hover:scale-[1.01] transition-all"
                style={{
                  backgroundColor: `${T.boxBg}60`,
                  border: `1px solid ${s.color}20`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${s.color}15`,
                    border: `1px solid ${s.color}30`,
                  }}
                >
                  <Radio size={16} style={{ color: s.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-black truncate"
                    style={{ color: T.textColor }}
                  >
                    {s.title}
                  </div>
                  <div
                    className="text-[10px] flex items-center gap-1.5 mt-0.5"
                    style={{ color: T.textMuted }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.listeners} listening · {s.genre}
                  </div>
                </div>
                <Play
                  size={14}
                  className="opacity-0 group-hover:opacity-60 transition-opacity"
                  style={{ color: s.color }}
                />
              </div>
            ))}
          </div>
        </div>
      );

    /* ── TOOLS ───────────────────────────────────────────────────── */
    case "tools":
      return (
        <div className="space-y-8">
          <HeroCard
            title="Tools"
            subtitle="Quick access to your creator stack."
            color="#f59e0b"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOOLS.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.title}
                  className="group flex items-center gap-5 p-5 rounded-2xl cursor-pointer hover:scale-[1.01] transition-all"
                  style={{
                    backgroundColor: `${T.boxBg}60`,
                    border: `1px solid ${t.color}20`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${t.color}15`,
                      border: `1px solid ${t.color}30`,
                    }}
                  >
                    <Icon size={22} style={{ color: t.color }} />
                  </div>
                  <div className="flex-1">
                    <div
                      className="text-sm font-black mb-0.5"
                      style={{ color: T.textColor }}
                    >
                      {t.title}
                    </div>
                    <div className="text-[11px]" style={{ color: T.textMuted }}>
                      {t.desc}
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className="opacity-0 group-hover:opacity-60 transition-opacity"
                    style={{ color: t.color }}
                  />
                </div>
              );
            })}
          </div>

          {/* Usage stats */}
          <div>
            <SectionHeader title="Usage This Month" color="#f59e0b" />
            <div className="space-y-3">
              {[
                {
                  label: "Prompts Saved",
                  value: 84,
                  max: 100,
                  color: "#f59e0b",
                },
                {
                  label: "Assets Stored",
                  value: 63,
                  max: 100,
                  color: "#00f0ff",
                },
                { label: "Batch Runs", value: 12, max: 50, color: "#8b5cf6" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: T.textMuted }}
                    >
                      {s.label}
                    </span>
                    <span
                      className="text-[11px] font-black"
                      style={{ color: s.color }}
                    >
                      {s.value}/{s.max}
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: `${T.borderColor}30` }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(s.value / s.max) * 100}%`,
                        backgroundColor: s.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    /* ── HOME (default) ──────────────────────────────────────────── */
    default:
      return (
        <div className="space-y-10">
          {/* Welcome + quick actions */}
          <div className="space-y-6">
            <div>
              <h2
                className="text-3xl font-black tracking-tight mb-1"
                style={{ color: T.textColor }}
              >
                Welcome back, {displayName}
              </h2>
              <p className="text-sm" style={{ color: T.textMuted }}>
                Your creator OS is live. Ship something today.
              </p>
            </div>
            <QuickActionGrid
              actions={[
                { label: "New Post", icon: Send, color: "#00f0ff", href: "#" },
                {
                  label: "Image Gen",
                  icon: ImageIcon,
                  color: "#ff00a0",
                  href: "/studio?tab=image",
                },
                {
                  label: "Agent Chat",
                  icon: Zap,
                  color: "#8b5cf6",
                  href: "/agent",
                },
                {
                  label: "Marketplace",
                  icon: ShoppingBag,
                  color: "#ff9ff3",
                  href: "/marketplace",
                },
              ]}
            />
          </div>

          {/* Dashboard content (stats, live feed) */}
          <DashboardContent />

          {/* Gallery preview strip */}
          <div>
            <SectionHeader
              title="Latest Creations"
              color="#ff00a0"
              href="/gallery"
            />
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[
                "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=240&h=300&fit=crop",
                "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=240&h=180&fit=crop",
                "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=240&h=300&fit=crop",
                "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=240&h=240&fit=crop",
                "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=240&h=300&fit=crop",
                "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=240&h=300&fit=crop",
              ].map((url, i) => (
                <Link
                  key={i}
                  href="/gallery"
                  className="shrink-0 w-40 rounded-xl overflow-hidden group border border-white/5 hover:border-indigo-500/30 transition-all"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Radio + Music strip */}
          <div>
            <SectionHeader title="Live Radio" color="#ff2d78" href="#" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {RADIO.map((s) => (
                <div
                  key={s.title}
                  className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:scale-[1.01] transition-all"
                  style={{
                    backgroundColor: `${T.boxBg}60`,
                    border: `1px solid ${s.color}20`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${s.color}15`,
                      border: `1px solid ${s.color}30`,
                    }}
                  >
                    <Radio size={14} style={{ color: s.color }} />
                  </div>
                  <div className="min-w-0">
                    <div
                      className="text-[11px] font-black truncate"
                      style={{ color: T.textColor }}
                    >
                      {s.title}
                    </div>
                    <div
                      className="text-[9px] flex items-center gap-1"
                      style={{ color: T.textMuted }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ backgroundColor: s.color }}
                      />
                      {s.listeners}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social feed preview */}
          <div>
            <SectionHeader title="Social Feed" color="#00f0ff" href="/social" />
            <SocialFeed embedded />
          </div>
        </div>
      );
  }
}
