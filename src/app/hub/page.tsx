"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Image, Film, Music, Bot, Sparkles, ArrowRight, Terminal, Network } from "lucide-react";

const HUB_TOOLS = [
  { id: "image", label: "Image Generator", desc: "Create stunning AI-generated images and art", icon: Image, href: "/studio?tool=image", color: "#6366f1", shortcut: "Ctrl+1" },
  { id: "video", label: "Video Generator", desc: "Generate videos from text prompts", icon: Film, href: "/studio?tool=video", color: "#ff6b6b", shortcut: "Ctrl+2" },
  { id: "audio", label: "Audio Generator", desc: "Create music and voice from text", icon: Music, href: "/studio?tool=audio", color: "#9b59b6", shortcut: "Ctrl+3" },
  { id: "agents", label: "AI Agents", desc: "Chat with specialized AI assistants", icon: Bot, href: "/studio?tool=agents", color: "#ffff00", shortcut: "Ctrl+4" },
  { id: "terminal", label: "Terminal", desc: "Execute code and commands via AI", icon: Terminal, href: "/studio?tool=terminal", color: "#00ffff", shortcut: "Ctrl+5" },
  { id: "pipeline", label: "Pipeline", desc: "Build multi-agent workflows", icon: Network, href: "/studio?tool=pipeline", color: "#d946ef", shortcut: "Ctrl+6" },
];

export default function HubPage() {
  const { resolvedColors: T } = useTheme();

  return (
    <div style={{ backgroundColor: T.bgColor, minHeight: "100vh", color: T.textColor }}>
      {/* Header */}
      <div style={{ borderBottom: `2px solid ${T.borderColor}`, padding: "40px 24px", textAlign: "center", background: `linear-gradient(180deg, ${T.boxBg} 0%, ${T.bgColor} 100%)` }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles size={32} style={{ color: T.accentColor }} />
          <h1 style={{ color: T.headerColor, fontSize: "36px", fontWeight: "bold", letterSpacing: "3px", margin: 0 }}>
            CREATIVE HUB
          </h1>
        </div>
        <p style={{ color: T.textColor, fontSize: "16px", opacity: 0.7, maxWidth: "600px", margin: "0 auto" }}>
          Quick access to all AI creation tools. Generate images, videos, audio, and orchestrate agents.
        </p>
      </div>

      {/* Tools Grid */}
      <div style={{ padding: "40px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {HUB_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group block transition-all duration-300"
                style={{
                  backgroundColor: T.boxBg,
                  border: `1px solid ${T.borderColor}40`,
                  borderRadius: "12px",
                  padding: "28px",
                  textDecoration: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
                  <div style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    backgroundColor: tool.color + "20",
                    border: `1px solid ${tool.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon size={28} style={{ color: tool.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: T.textColor, fontSize: "18px", fontWeight: "bold", margin: "0 0 6px 0" }}>
                      {tool.label}
                    </h3>
                    <p style={{ color: T.textMuted, fontSize: "13px", opacity: 0.8, margin: 0 }}>
                      {tool.desc}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: T.textMuted, fontSize: "11px", opacity: 0.5 }}>{tool.shortcut}</span>
                  <ArrowRight size={16} style={{ color: T.linkColor, transition: "transform 0.2s" }} className="group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: "48px", display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href="/studio"
            style={{
              padding: "12px 24px",
              backgroundColor: T.accentColor,
              color: T.bgColor,
              textDecoration: "none",
              fontWeight: "bold",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            🚀 Full Studio
          </Link>
          <Link
            href="/gallery"
            style={{
              padding: "12px 24px",
              backgroundColor: T.linkColor + "15",
              color: T.linkColor,
              textDecoration: "none",
              border: `1px solid ${T.linkColor}30`,
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            🎨 View Gallery
          </Link>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div style={{ padding: "40px 24px", borderTop: `1px solid ${T.borderColor}20`, marginTop: "40px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ color: T.accentColor, fontSize: "12px", fontWeight: "bold", marginBottom: "16px", letterSpacing: "2px" }}>
            KEYBOARD SHORTCUTS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
            {HUB_TOOLS.map((tool) => (
              <div key={tool.id} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
                <kbd style={{
                  padding: "4px 8px",
                  backgroundColor: T.bgColor,
                  border: `1px solid ${T.borderColor}30`,
                  borderRadius: "4px",
                  color: T.textColor,
                  fontFamily: "monospace",
                }}>
                  {tool.shortcut.replace("Ctrl+", "")}
                </kbd>
                <span style={{ color: T.textMuted }}>{tool.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}