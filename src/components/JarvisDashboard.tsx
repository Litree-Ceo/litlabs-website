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

export default function JarvisDashboard() {
  const { profile } = useProfile();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="min-h-screen p-4 lg:p-6 font-mono overflow-hidden"
      style={{ backgroundColor: "#050508", color: "#e0e0e0" }}
    >
      {/* Background HUD Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] grid-bg" />

      {/* Header HUD */}
      <header
        className="relative z-10 flex flex-wrap items-center justify-between mb-6 gap-4 p-4 border"
        style={{
          borderColor: "rgba(0,240,255,0.15)",
          backgroundColor: "rgba(10,10,18,0.8)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 border-2 flex items-center justify-center animate-pulse-slow"
              style={{
                borderColor: "#00f0ff",
                boxShadow: "0 0 15px rgba(0,240,255,0.2)",
              }}
            >
              <Bot size={24} style={{ color: "#00f0ff" }} />
            </div>
            <div>
              <h1
                className="text-xl font-black tracking-tighter"
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
          </div>

          <div
            className="hidden xl:flex items-center gap-8 border-l px-8"
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

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm font-black tracking-widest">
              {time.toLocaleTimeString()}
            </div>
            <div className="text-[10px] opacity-40 uppercase">
              {time.toLocaleDateString()}
            </div>
          </div>
          <div
            className="w-10 h-10 border flex items-center justify-center text-xs"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              "👤"
            )}
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 h-[calc(100vh-140px)]">
        {/* LEFT COLUMN - System & Network */}
        <div className="xl:col-span-3 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
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
              {[
                { label: "Supabase Cluster", status: "Online", load: "12%" },
                { label: "Gemini Inference", status: "Online", load: "24%" },
                { label: "Stripe Gateway", status: "Stable", load: "2%" },
                { label: "Vercel Edge", status: "Optimal", load: "45%" },
              ].map((n) => (
                <div
                  key={n.label}
                  className="flex items-center justify-between"
                >
                  <div className="text-xs opacity-60">{n.label}</div>
                  <div className="flex items-center gap-2">
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

        {/* CENTER - Primary Workspace */}
        <div className="xl:col-span-6 space-y-4 flex flex-col">
          <div
            className="flex-1 border p-1 bg-black/20"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            <div className="h-full w-full relative">
              {/* HUD Ornaments */}
              <div
                className="absolute top-4 left-4 w-24 h-24 border-t-2 border-l-2 opacity-20"
                style={{ borderColor: "#00f0ff" }}
              />
              <div
                className="absolute top-4 right-4 w-24 h-24 border-t-2 border-r-2 opacity-20"
                style={{ borderColor: "#00f0ff" }}
              />
              <div
                className="absolute bottom-4 left-4 w-24 h-24 border-b-2 border-l-2 opacity-20"
                style={{ borderColor: "#00f0ff" }}
              />
              <div
                className="absolute bottom-4 right-4 w-24 h-24 border-b-2 border-r-2 opacity-20"
                style={{ borderColor: "#00f0ff" }}
              />

              <div className="h-full overflow-y-auto p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2
                    className="text-sm font-black uppercase tracking-[0.3em]"
                    style={{ color: "#00f0ff" }}
                  >
                    Mission Dashboard
                  </h2>
                  <div className="flex gap-2">
                    <button
                      className="p-1 border opacity-40 hover:opacity-100"
                      style={{ borderColor: "#00f0ff" }}
                    >
                      <Maximize2 size={12} />
                    </button>
                    <button
                      className="p-1 border opacity-40 hover:opacity-100"
                      style={{ borderColor: "#00f0ff" }}
                    >
                      <Settings size={12} />
                    </button>
                  </div>
                </div>

                <DashboardGrid />
              </div>
            </div>
          </div>

          <div
            className="h-32 border p-4 bg-black/40 flex items-center gap-6"
            style={{ borderColor: "rgba(0,240,255,0.1)" }}
          >
            <div
              className="w-24 h-24 border-2 border-dashed flex items-center justify-center opacity-20"
              style={{ borderColor: "#00f0ff" }}
            >
              <Activity size={32} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1">
                Live Intelligence Stream
              </div>
              <div className="font-mono text-xs text-cyan-400">
                {">"} JARVIS: Orchestrating agent workflows... [SUCCESS]
                <br />
                {">"} DATA: Analyzing social sentiment spikes... [DONE]
                <br />
                {">"} CORE: Neural link stable. Awaiting command, Boss.
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Stats & Assets */}
        <div className="xl:col-span-3 space-y-4 overflow-y-auto pl-2 custom-scrollbar">
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
            <div className="grid grid-cols-2 gap-4">
              <div
                className="text-center p-2 border"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}
              >
                <div
                  className="text-lg font-black"
                  style={{ color: "#00ff41" }}
                >
                  1.2k
                </div>
                <div className="text-[8px] opacity-40">DAILY CALLS</div>
              </div>
              <div
                className="text-center p-2 border"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}
              >
                <div
                  className="text-lg font-black"
                  style={{ color: "#00f0ff" }}
                >
                  98.2%
                </div>
                <div className="text-[8px] opacity-40">ACCURACY</div>
              </div>
            </div>
          </section>

          <section
            className="border p-4 bg-black/40 h-64 overflow-hidden relative"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-40 flex items-center gap-2">
              <Layers size={12} /> Asset Stack
            </div>
            <div className="space-y-2 opacity-50 text-[10px] font-mono">
              <div>FILE_REF: 0x42a9... (IMAGE)</div>
              <div>FILE_REF: 0xbc22... (AUDIO)</div>
              <div>FILE_REF: 0x11e4... (MODEL)</div>
              <div>FILE_REF: 0xfa39... (CONFIG)</div>
              <div>FILE_REF: 0x88d1... (SCHEMA)</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] to-transparent pointer-events-none" />
          </section>

          <div
            className="p-4 border bg-cyan-500/5"
            style={{ borderColor: "#00f0ff30" }}
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

      <style jsx>{`
        .grid-bg {
          background-image:
            linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(0.98);
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 240, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
