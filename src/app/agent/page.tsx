"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useEffect } from "react";
import { useClerkAuth } from "@/hooks/useClerkAuth";
import { useTheme } from "@/context/ThemeContext";
import {
  Send,
  Loader2,
  Sparkles,
  User,
  Bot,
  Zap,
  Shield,
  Cpu,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

const SYSTEM_PROMPT = `You are Hermes, the ultimate AI agent for LiTree Lab Studios. You are powered by Gemini 2.5 Flash.
Your goal is to be the most helpful, proactive, and intelligent partner for the user.
You have deep knowledge of the LiTree Lab Studios platform, including agent building, 360 world generation, and no-code workflows.
Be concise but insightful. Be proactive in offering solutions.
If the user asks for technical help, be precise. If they want to create, be imaginative.
You are the "best agent" the user has access to.`;

export default function HermesAgent() {
  const { isSignedIn, isLoaded } = useClerkAuth();
  const { resolvedColors: T } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am Hermes, your primary AI agent. How can I assist you in LiTree Lab Studios today?",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      role: "user",
      content: input.trim(),
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          systemPrompt: SYSTEM_PROMPT,
          task: "chat",
        }),
      });

      const data = await res.json();
      const assistantMsg: Message = {
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't process that request.",
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection error. Please try again.",
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <div className="p-8 text-center">Loading...</div>;

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <Shield size={48} className="mb-4 opacity-20" />
        <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
        <p className="opacity-60 mb-6">
          Please sign in to talk to the best agent.
        </p>
        <button
          onClick={() => (window.location.href = "/sign-in")}
          className="px-6 py-2 rounded-lg font-bold"
          style={{ backgroundColor: T.accentColor, color: T.bgColor }}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-[calc(100vh-3.5rem)]"
      style={{ backgroundColor: T.bgColor }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{
          borderColor: T.borderColor + "40",
          background: `linear-gradient(to right, ${T.accentColor}10, transparent)`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border-2"
            style={{
              borderColor: T.accentColor,
              backgroundColor: T.accentColor + "10",
            }}
          >
            <Zap size={20} style={{ color: T.accentColor }} />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: T.textColor }}>
              Hermes
            </h1>
            <div className="flex items-center gap-2 text-[10px] opacity-60">
              <span className="flex items-center gap-1">
                <Cpu size={10} /> Gemini 2.5 Flash
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>Primary Agent Online</span>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="text-[10px] uppercase tracking-widest opacity-40">
            System Status: Optimal
          </div>
          <Sparkles size={16} style={{ color: T.accentColor }} />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex gap-3 max-w-[90%] sm:max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${msg.role === "user" ? "bg-zinc-800" : ""}`}
                style={{
                  borderColor:
                    msg.role === "user" ? T.borderColor : T.accentColor + "40",
                }}
              >
                {msg.role === "user" ? (
                  <User size={16} />
                ) : (
                  <Bot size={16} style={{ color: T.accentColor }} />
                )}
              </div>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "rounded-tr-none" : "rounded-tl-none"}`}
                style={{
                  backgroundColor:
                    msg.role === "user" ? T.boxBg : T.accentColor + "08",
                  border: `1px solid ${msg.role === "user" ? T.borderColor + "40" : T.accentColor + "20"}`,
                  color: T.textColor,
                }}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div
                className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border animate-pulse"
                style={{ borderColor: T.accentColor + "40" }}
              >
                <Bot size={16} style={{ color: T.accentColor }} />
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2"
                style={{
                  backgroundColor: T.accentColor + "05",
                  border: `1px solid ${T.accentColor}10`,
                }}
              >
                <Loader2
                  size={14}
                  className="animate-spin"
                  style={{ color: T.accentColor }}
                />
                <span className="text-xs opacity-50 italic">
                  Hermes is thinking...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className="p-4 sm:p-6 border-t"
        style={{ borderColor: T.borderColor + "40" }}
      >
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Talk to Hermes..."
            rows={1}
            className="w-full pl-4 pr-12 py-3 rounded-xl bg-transparent border outline-none resize-none transition-all focus:ring-1"
            style={
              {
                borderColor: T.borderColor + "60",
                color: T.textColor,
                "--tw-ring-color": T.accentColor,
              } as any
            }
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all disabled:opacity-30"
            style={{ backgroundColor: T.accentColor, color: T.bgColor }}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
        <p className="text-[10px] text-center mt-3 opacity-30 uppercase tracking-widest">
          Secure Neural Link Established • Powered by Gemini
        </p>
      </div>
    </div>
  );
}
