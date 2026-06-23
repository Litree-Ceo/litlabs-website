"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
import {
  Activity,
  Shield,
  TrendingUp,
  Bot,
  Maximize2,
  Layers,
  Network,
  Settings,
} from "lucide-react";
import YoutubeWidget from "./YoutubeWidget";
import SpotifyWidget from "./SpotifyWidget";
import DashboardGrid from "./DashboardGrid";

const TELEMETRY = [
  { label: "CPU LOAD", value: "12%", color: "#00f0ff" },
  { label: "MEM USAGE", value: "4.2GB", color: "#ff00a0" },
  { label: "NET THREADS", value: "1024", color: "#00ff41" },
  { label: "LATENCY", value: "14ms", color: "#ffd93d" },
];

const NETWORK_NODES = [
  { label: "Supabase Cluster", status: "Online", load: "12%" },
  { label: "Gemini Inference", status: "Online", load: "24%" },
  { label: "Stripe Gateway", status: "Stable", load: "2%" },
  { label: "Vercel Edge", status: "Optimal", load: "45%" },
];

const ASSET_REFS = [
  "FILE_REF: 0x42a9... (IMAGE)",
  "FILE_REF: 0xbc22... (AUDIO)",
  "FILE_REF: 0x11e4... (MODEL)",
  "FILE_REF: 0xfa39... (CONFIG)",
  "FILE_REF: 0x88d1... (SCHEMA)",
];

export default function JarvisDashboard() {
  const { profile } = useProfile();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="min-h-screen p-4 lg:p-6 font-mono overflow-x-hidden"
      style={{ backgroundColor: "#050508", color: "#e0e0e0" }}
    >
      {/* Background HUD Grid — pure CSS, no JSX style tag needed */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,240,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,0.1) 1px,transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Header HUD */}
      <header
        className="relative z-10 flex flex-wrap items-center justify-between mb-6 gap-4 p-4 border"
        style={{
          borderColor: "rgba(0,240,255,0.15)",
          backgroundColor: "rgba(10,10,18,0.8)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-4 min-w-0">
          {/* Bot icon */}
          <div
            className="shrink-0 w-12 h-12 border-2 flex items-center justify-center"
            style={{
              borderColor: "#00f0ff",
              boxShadow: "0 0 15px rgba(0,240,255,0.2)",
              animation: "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
            }}
          >
            <Bot size={24} style={{ color: "#00f0ff" }} />
          </div>

          <div className="min-w-0">
            <h1
              className="text-lg sm:text-xl font-black tracking-tighter truncate"
              style={{ color: "#00f0ff" }}
            >
              J.A.R.V.I.S.{" "}
              <span className="text-[10px] opacity-40">v2.6.0</span>
            </h1>
            <div className="flex items-center gap-1.5 text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              SYSTEMS OPERATIONAL
            </div>
          </div>

          {/* Telemetry strip — hidden until xl */}
          <div
            className="hidden xl:flex items-center gap-8 border-l pl-8 ml-2"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            {TELEMETRY.map((stat) => (
              <div key={stat.label}>
                <div className="text-[9px] opacity-40 uppercase tracking-widest">
                  {stat.label}
                </div>
                <div
                  className="text-sm font-black"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clock + avatar */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <div className="text-sm font-black tracking-widest tabular-nums">
              {time.toLocaleTimeString()}
            </div>
            <div className="text-[10px] opacity-40 uppercase">
              {time.toLocaleDateString()}
            </div>
          </div>
          <div
            className="w-10 h-10 border flex items-center justify-center text-xs overflow-hidden"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span aria-label="No avatar">👤</span>
            )}
          </div>
        </div>
      </header>

      {/* Main Grid — auto height on mobile, fixed viewport height on xl */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 xl:h-[calc(100vh-160px)]">
        {/* LEFT COLUMN */}
        <div
          className="xl:col-span-3 space-y-4 overflow-y-auto pr-1"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0,240,255,0.2) transparent",
          }}
        >
          {/* Network Topology */}
          <section
            className="border p-4 bg-black/40"
            style={{ borderColor: "rgba(0,240,255,0.1)" }}
          >
            <div
              className="flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "#00f0ff" }}
            >
              <Network size={12} /> Network Topology
            </div>
            <div className="space-y-3">
              {NETWORK_NODES.map((n) => (
                <div
                  key={n.label}
                  className="flex items-center justify-between"
                >
                  <div className="text-xs opacity-60 truncate mr-2">
                    {n.label}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500"
                        style={{ width: n.load }}
                      />
                    </div>
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: "#00ff41" }}
                    >
                      {n.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Security Matrix */}
          <section
            className="border p-4 bg-black/40"
            style={{ borderColor: "rgba(255,0,160,0.1)" }}
          >
            <div
              className="flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "#ff00a0" }}
            >
              <Shield size={12} /> Security Matrix
            </div>
            <div className="text-[10px] font-mono space-y-1.5 opacity-60">
              <div>[SHIELD] ACTIVE PROTECTION ON</div>
              <div>[SHIELD] RLS POLICIES VERIFIED</div>
              <div>[SHIELD] RATE LIMITS ENFORCED</div>
              <div className="text-pink-500">
                [WARN] 3 BLOCKED ATTEMPTS (IP: 142.xx)
              </div>
              <div>[SHIELD] ENCRYPTION KEYS ROTATED</div>
            </div>
          </section>

          <YoutubeWidget />
          <SpotifyWidget />
        </div>

        {/* CENTER — Primary Workspace */}
        <div className="xl:col-span-6 flex flex-col gap-4 min-h-0">
          <div
            className="flex-1 border p-1 bg-black/20 relative min-h-[400px] xl:min-h-0"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            {/* HUD corner ornaments */}
            {[
              "top-4 left-4 border-t-2 border-l-2",
              "top-4 right-4 border-t-2 border-r-2",
              "bottom-4 left-4 border-b-2 border-l-2",
              "bottom-4 right-4 border-b-2 border-r-2",
            ].map((cls) => (
              <div
                key={cls}
                className={`absolute w-24 h-24 opacity-20 pointer-events-none ${cls}`}
                style={{ borderColor: "#00f0ff" }}
              />
            ))}

            <div className="h-full overflow-y-auto p-4 sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2
                  className="text-sm font-black uppercase tracking-[0.3em]"
                  style={{ color: "#00f0ff" }}
                >
                  Mission Dashboard
                </h2>
                <div className="flex gap-2">
                  <button
                    aria-label="Maximize"
                    className="p-1 border opacity-40 hover:opacity-100 transition-opacity"
                    style={{ borderColor: "#00f0ff" }}
                  >
                    <Maximize2 size={12} />
                  </button>
                  <button
                    aria-label="Settings"
                    className="p-1 border opacity-40 hover:opacity-100 transition-opacity"
                    style={{ borderColor: "#00f0ff" }}
                  >
                    <Settings size={12} />
                  </button>
                </div>
              </div>

              <DashboardGrid />
            </div>
          </div>

          {/* Live Intelligence Stream */}
          <div
            className="border p-4 bg-black/40 flex items-center gap-4"
            style={{ borderColor: "rgba(0,240,255,0.1)" }}
          >
            <div
              className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed flex items-center justify-center opacity-20"
              style={{ borderColor: "#00f0ff" }}
            >
              <Activity size={28} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1">
                Live Intelligence Stream
              </div>
              <div className="font-mono text-xs text-cyan-400 leading-relaxed">
                {">"} JARVIS: Orchestrating agent workflows... [SUCCESS]
                <br />
                {">"} DATA: Analyzing social sentiment spikes... [DONE]
                <br />
                {">"} CORE: Neural link stable. Awaiting command, Boss.
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div
          className="xl:col-span-3 space-y-4 overflow-y-auto pl-1"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0,240,255,0.2) transparent",
          }}
        >
          {/* Performance Ledger */}
          <section
            className="border p-4 bg-black/40"
            style={{ borderColor: "rgba(0,255,65,0.1)" }}
          >
            <div
              className="flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "#00ff41" }}
            >
              <TrendingUp size={12} /> Performance Ledger
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div
                className="text-center p-2 border"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}
              >
                <div
                  className="text-lg font-black tabular-nums"
                  style={{ color: "#00ff41" }}
                >
                  1.2k
                </div>
                <div className="text-[8px] opacity-40 uppercase">
                  Daily Calls
                </div>
              </div>
              <div
                className="text-center p-2 border"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}
              >
                <div
                  className="text-lg font-black tabular-nums"
                  style={{ color: "#00f0ff" }}
                >
                  98.2%
                </div>
                <div className="text-[8px] opacity-40 uppercase">Accuracy</div>
              </div>
            </div>
          </section>

          {/* Asset Stack */}
          <section
            className="border p-4 bg-black/40 relative overflow-hidden"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-40 flex items-center gap-2">
              <Layers size={12} /> Asset Stack
            </div>
            <div className="space-y-2 text-[10px] font-mono opacity-50">
              {ASSET_REFS.map((ref) => (
                <div key={ref}>{ref}</div>
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0a0a12] to-transparent pointer-events-none" />
          </section>

          {/* Quote */}
          <div
            className="p-4 border"
            style={{
              backgroundColor: "rgba(0,240,255,0.03)",
              borderColor: "rgba(0,240,255,0.18)",
            }}
          >
            <h3
              className="text-xs font-black mb-2 italic"
              style={{ color: "#00f0ff" }}
            >
              "The best way to predict the future is to build it."
            </h3>
            <p className="text-[9px] opacity-60">— LiTree Labs Protocol</p>
          </div>
        </div>
      </div>

      {/* Keyframe for the bot icon pulse — scoped via global style tag (App Router safe) */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.98); }
        }
      `}</style>
    </div>
  );
}
