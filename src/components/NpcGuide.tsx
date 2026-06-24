"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useClerkAuth } from "@/hooks/useClerkAuth";
import { Bot, X, ChevronDown, MessageSquare, Sparkles } from "lucide-react";
import { AGENTS } from "@/lib/agents";

const NPC_PERSONAS = [
  {
    id: "director",
    name: "Director",
    color: "#00f0ff",
    greeting: "Welcome to LiTree Lab. I'm Director — I'll get you oriented.",
  },
  {
    id: "champion",
    name: "Champion",
    color: "#ff9ff3",
    greeting: "Hey there! I'm Champion, your go-to guide around here.",
  },
  {
    id: "social",
    name: "Social Dominator",
    color: "#ff00a0",
    greeting: "Yo! I'm Social Dominator. Let me hype you up on what we're building.",
  },
];

const HYPE_MESSAGES = [
  "Create AI agents, generate worlds, and build in public.",
  "Studio has image, video, audio, and code tools — all in one workspace.",
  "The Marketplace lets you discover agents, assets, and workflows.",
  "Gallery is where the community shares their best generations.",
  "Sign up free and start building with your first agent.",
  "Need help? Ask Jarvis in the Agent tab.",
];

export default function NpcGuide() {
  const { resolvedColors: T } = useTheme();
  const { isLoaded, isSignedIn, sessionClaims } = useClerkAuth();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [current, setCurrent] = useState(0);
  const [hasSeen, setHasSeen] = useState(false);

  const persona = NPC_PERSONAS[current % NPC_PERSONAS.length];
  const agent = AGENTS[persona.id];

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setHasSeen(localStorage.getItem("litlabs-npc-seen") === "true");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (isLoaded && !hasSeen) {
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, hasSeen]);

  const dismiss = useCallback(() => {
    setOpen(false);
    setMinimized(false);
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("litlabs-npc-seen", "true");
      setHasSeen(true);
    } catch {
      // ignore
    }
  }, []);

  const rotatePersona = useCallback(() => {
    setCurrent((i) => (i + 1) % NPC_PERSONAS.length);
  }, []);

  if (!isLoaded) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {open && !minimized && (
        <div
          className="pointer-events-auto w-[min(92vw,360px)] rounded-xl border shadow-2xl overflow-hidden"
          style={{
            backgroundColor: T.boxBg + "f0",
            borderColor: persona.color + "40",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 border-b"
            style={{ borderColor: persona.color + "20" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border"
              style={{ borderColor: persona.color + "40", backgroundColor: persona.color + "10" }}
            >
              <Bot size={20} style={{ color: persona.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate" style={{ color: T.textColor }}>
                {persona.name}
              </div>
              <div className="text-xs opacity-60 truncate" style={{ color: T.textMuted }}>
                {agent?.role || "Guide"} • LiTree Labs
              </div>
            </div>
            <button
              onClick={() => setMinimized(true)}
              className="p-1.5 rounded-md hover:opacity-70 transition-opacity"
              style={{ color: T.textMuted }}
              aria-label="Minimize"
            >
              <ChevronDown size={16} />
            </button>
            <button
              onClick={dismiss}
              className="p-1.5 rounded-md hover:opacity-70 transition-opacity"
              style={{ color: T.textMuted }}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-4 py-4 space-y-3">
            <p className="text-sm leading-relaxed" style={{ color: T.textColor }}>
              {isSignedIn
                ? `Hey ${(sessionClaims?.name as string) || "builder"}! ${persona.greeting}`
                : persona.greeting}
            </p>
            <div
              className="p-3 rounded-lg text-sm border"
              style={{
                backgroundColor: persona.color + "08",
                borderColor: persona.color + "20",
                color: T.textColor,
              }}
            >
              <Sparkles size={14} className="inline mr-1.5 mb-0.5" style={{ color: persona.color }} />
              {HYPE_MESSAGES[current % HYPE_MESSAGES.length]}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={rotatePersona}
                className="text-xs px-3 py-1.5 rounded-md border transition-opacity hover:opacity-80"
                style={{ borderColor: T.borderColor + "40", color: T.textMuted }}
              >
                Another guide
              </button>
              <button
                onClick={dismiss}
                className="text-xs px-3 py-1.5 rounded-md font-bold transition-opacity hover:opacity-80"
                style={{ backgroundColor: persona.color, color: T.bgColor }}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => {
          if (minimized) {
            setMinimized(false);
            setOpen(true);
          } else {
            setOpen((o) => !o);
          }
        }}
        className="pointer-events-auto w-12 h-12 rounded-full border shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        style={{
          backgroundColor: T.boxBg + "f0",
          borderColor: persona.color + "50",
          color: persona.color,
          backdropFilter: "blur(8px)",
        }}
        aria-label={open ? "Close guide" : "Open guide"}
      >
        {open && !minimized ? <X size={20} /> : <MessageSquare size={20} />}
      </button>
    </div>
  );
}
