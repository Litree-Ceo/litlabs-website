"use client";

import { useTheme } from "@/context/ThemeContext";
import {
  Coins,
  Music,
  Activity,
  Users,
  Plus,
  Monitor,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { AGENTS, CREATORS } from "./dashboard-data";

export function TelemetryDot({
  label,
  status,
  color,
}: {
  label: string;
  status: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="relative w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      >
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: color }}
        />
      </span>
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color }}>
          {label}
        </div>
        <div className="text-[9px] opacity-60" style={{ color }}>
          {status}
        </div>
      </div>
    </div>
  );
}

export default function DashboardWidgets({
  displayName,
  balance,
  claimed,
  visitors,
  onClaim,
}: {
  displayName: string;
  balance: number;
  claimed: boolean;
  visitors: number;
  onClaim: () => void;
}) {
  const { resolvedColors: T } = useTheme();

  return (
    <aside
      className="hidden xl:flex flex-col gap-4 w-80 shrink-0 p-4 border-l overflow-y-auto"
      style={{
        borderColor: `${T.borderColor}30`,
        backgroundColor: `${T.bgColor}60`,
      }}
    >
      {/* Profile Mini */}
      <GlassCard variant="flat" padding="sm" radius="lg">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black"
            style={{
              backgroundColor: `${T.accentColor}20`,
              border: `1px solid ${T.accentColor}40`,
              color: T.accentColor,
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold truncate" style={{ color: T.textColor }}>
              {displayName}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: T.textMuted }}>
              Creator
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs font-bold" style={{ color: T.accentColor }}>
            <Coins size={12} /> {balance.toLocaleString()}
          </div>
        </div>
      </GlassCard>

      {/* Now Playing */}
      <GlassCard
        variant="flat"
        padding="sm"
        radius="lg"
        header={
          <div className="text-[10px] font-mono uppercase tracking-wider flex items-center gap-2" style={{ color: T.textMuted }}>
            <Music size={12} /> Now Playing
          </div>
        }
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: `${T.accentColor}15`,
              border: `1px solid ${T.accentColor}30`,
            }}
          >
            <Music size={20} style={{ color: T.accentColor }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold truncate" style={{ color: T.headerColor }}>
              Neon Horizon
            </div>
            <div className="text-[10px]" style={{ color: T.textMuted }}>
              Synthwave Radio
            </div>
          </div>
          <div className="flex gap-1">
            <span className="w-1 h-3 rounded-full animate-pulse" style={{ backgroundColor: T.accentColor }} />
            <span className="w-1 h-3 rounded-full animate-pulse" style={{ backgroundColor: T.accentColor, animationDelay: "0.1s" }} />
            <span className="w-1 h-3 rounded-full animate-pulse" style={{ backgroundColor: T.accentColor, animationDelay: "0.2s" }} />
          </div>
        </div>
      </GlassCard>

      {/* Agent Queue */}
      <GlassCard
        variant="flat"
        padding="sm"
        radius="lg"
        header={
          <div className="text-[10px] font-mono uppercase tracking-wider flex items-center gap-2" style={{ color: T.textMuted }}>
            <Activity size={12} /> Agent Queue
          </div>
        }
      >
        <div className="space-y-3">
          {AGENTS.map((a) => (
            <div key={a.name} className="flex items-center gap-3">
              <span className="relative w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: a.color }}>
                {a.status === "working" && (
                  <span className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: a.color }} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold" style={{ color: T.textColor }}>
                  {a.name}
                </div>
                <div className="text-[10px]" style={{ color: T.textMuted }}>
                  {a.task}
                </div>
              </div>
              <span
                className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: `${a.color}15`,
                  color: a.color,
                  border: `1px solid ${a.color}30`,
                }}
              >
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Daily Reward */}
      <GlassCard variant="flat" padding="sm" radius="lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold" style={{ color: T.textColor }}>
              Daily Reward
            </div>
            <div className="text-[10px]" style={{ color: T.textMuted }}>
              Claim 100 coins
            </div>
          </div>
          <button
            onClick={onClaim}
            disabled={claimed}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              backgroundColor: claimed ? `${T.success}15` : `${T.accentColor}20`,
              color: claimed ? T.success : T.accentColor,
              border: `1px solid ${claimed ? `${T.success}40` : `${T.accentColor}40`}`,
              opacity: claimed ? 0.7 : 1,
            }}
          >
            {claimed ? "Claimed" : "Claim"}
          </button>
        </div>
      </GlassCard>

      {/* Suggested Creators */}
      <GlassCard
        variant="flat"
        padding="sm"
        radius="lg"
        header={
          <div className="text-[10px] font-mono uppercase tracking-wider flex items-center gap-2" style={{ color: T.textMuted }}>
            <Users size={12} /> Creators
          </div>
        }
      >
        <div className="space-y-3">
          {CREATORS.map((c) => (
            <div key={c.handle} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                style={{
                  backgroundColor: `${c.color}15`,
                  color: c.color,
                  border: `1px solid ${c.color}30`,
                }}
              >
                {c.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold" style={{ color: T.textColor }}>
                  {c.name}
                </div>
                <div className="text-[10px]" style={{ color: T.textMuted }}>
                  {c.handle}
                </div>
              </div>
              <button className="p-1 rounded-md transition-colors hover:opacity-80" style={{ color: T.textMuted }}>
                <Plus size={14} />
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Telemetry */}
      <GlassCard variant="flat" padding="sm" radius="lg">
        <div className="grid grid-cols-2 gap-3">
          <TelemetryDot label="AI Models" status="Online" color={T.success} />
          <TelemetryDot label="Agent Chat" status="Online" color={T.success} />
          <TelemetryDot label="Image Gen" status="Online" color={T.success} />
          <TelemetryDot label="Market" status="Online" color={T.success} />
        </div>
      </GlassCard>

      {/* Visitor Counter */}
      <GlassCard variant="flat" padding="sm" radius="lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor size={12} style={{ color: T.textMuted }} />
            <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: T.textMuted }}>
              Visitors
            </span>
          </div>
          <span className="text-sm font-mono font-bold" style={{ color: T.headerColor }}>
            {visitors.toLocaleString()}
          </span>
        </div>
      </GlassCard>
    </aside>
  );
}
