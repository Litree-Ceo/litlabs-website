"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Zap,
  Wrench,
  Users,
  Palette,
  Sparkles,
  Settings,
  ArrowRight,
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
  href: string;
}

const actions: QuickAction[] = [
  {
    id: "neural-link",
    title: "Neural Chat",
    subtitle: "Chat with AI agents",
    icon: Zap,
    color: "from-amber-500 to-orange-600",
    href: "/agent-chat",
  },
  {
    id: "bot-forge",
    title: "Bot Forge",
    subtitle: "Browse & acquire agents",
    icon: Wrench,
    color: "from-blue-500 to-indigo-600",
    href: "/marketplace",
  },
  {
    id: "the-matrix",
    title: "The Feed",
    subtitle: "Creator social network",
    icon: Users,
    color: "from-cyan-500 to-blue-600",
    href: "/social",
  },
  {
    id: "forge-agent",
    title: "Studio",
    subtitle: "Create images, music & more",
    icon: Palette,
    color: "from-emerald-500 to-teal-600",
    href: "/studio",
  },
  {
    id: "champions",
    title: "Gallery",
    subtitle: "Explore top agents",
    icon: Sparkles,
    color: "from-purple-500 to-fuchsia-600",
    href: "/gallery",
  },
  {
    id: "system-config",
    title: "Settings",
    subtitle: "Account & workspace",
    icon: Settings,
    color: "from-slate-500 to-slate-700",
    href: "/settings",
  },
];

export default function DashboardGrid() {
  const { user } = useAuth();

  return (
    <div className="w-full px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1">
          Welcome back,{" "}
          <span className="gradient-text">
            {user?.name || user?.email?.split("@")[0] || "Creator"}
          </span>
        </h1>
        <p className="text-sm text-zinc-500">
          Your agents are running. Here&apos;s your workspace.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.id}
              href={action.href}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] hover:border-white/20 transition-all group"
            >
              <div
                className={`w-11 h-11 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform`}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white">
                  {action.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {action.subtitle}
                </p>
              </div>
              <ArrowRight
                size={16}
                className="text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
