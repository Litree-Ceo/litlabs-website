"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Image, Music, Video, ArrowRight, Zap } from "lucide-react";

const GEN_TOOLS = [
  { id: "image", label: "Image Generation", icon: Image, desc: "Create stunning AI images with multiple providers", color: "#ff9ff3", href: "/studio?tool=image" },
  { id: "video", label: "Video Generation", icon: Video, desc: "Generate videos from text prompts", color: "#00f0ff", href: "/studio?tool=video" },
  { id: "audio", label: "Audio Generation", icon: Music, desc: "Create music and sound effects", color: "#ffd93d", href: "/studio?tool=audio" },
  { id: "agent", label: "Agent Chat", icon: Zap, desc: "Talk to your AI agents", color: "#00ff41", href: "/agents" },
];

export default function GeneratePage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#0a0a0f" }}>
      <div className="w-full max-w-4xl py-12">
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">✨</div>
          <h1 className="text-2xl sm:text-3xl font-black mb-3" style={{ color: "#00f0ff" }}>AI Generation Hub</h1>
          <p className="text-sm opacity-60 max-w-lg mx-auto">Generate images, videos, audio, and more using cutting-edge AI models</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GEN_TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="relative p-6 rounded-xl border-2 transition-all duration-200 group"
              style={{
                borderColor: hoveredId === tool.id ? tool.color : "#1a1a2e",
                backgroundColor: hoveredId === tool.id ? `${tool.color}08` : "#111118",
              }}
              onMouseEnter={() => setHoveredId(tool.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${tool.color}15`, border: `1px solid ${tool.color}30` }}
                >
                  <tool.icon size={24} style={{ color: tool.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold mb-1" style={{ color: tool.color }}>{tool.label}</h3>
                  <p className="text-xs opacity-60">{tool.desc}</p>
                </div>
                <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" style={{ color: tool.color }} />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-xl border text-center" style={{ backgroundColor: "#111118", borderColor: "#1a1a2e" }}>
          <p className="text-xs opacity-50">
            Visit the <Link href="/studio" className="font-bold" style={{ color: "#00f0ff" }}>Studio</Link> for full creative toolset
          </p>
        </div>
      </div>
    </div>
  );
}
