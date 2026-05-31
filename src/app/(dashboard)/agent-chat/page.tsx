"use client";
import { useState, useRef, useEffect, useCallback } from "react";

interface Message { role: "user" | "assistant"; content: string; }

const AGENTS = [
  { id: "champion", name: "LitLabs Agent", emoji: "⚡", greeting: "Hey! I'm the LitLabs agent. I can help you build, chat, and explore AI. What do you need?" },
  { id: "code-champion", name: "Code Champion", emoji: "👨‍💻", greeting: "Code Champion here. Send me your coding problem or project idea. How can I help you build today?" },
  { id: "social-dominator", name: "Social Dominator", emoji: "🎭", greeting: "What's the vibe? Give me a topic and I'll craft something worth sharing." },
  { id: "data-slayer", name: "Data Slayer", emoji: "📊", greeting: "Send me your dataset or analytical question. I'll extract the insights you need." },
  { id: "writing-coach", name: "Writing Coach", emoji: "✍️", greeting: "Ready to refine your writing. What are we working on?" },
  { id: "support-agent", name: "Support Agent", emoji: "🎧", greeting: "Support Agent here. How can I help you or your users today?" },
  { id: "trading-bot", name: "Trading Oracle", emoji: "📈", greeting: "Market analysis ready. What asset or sector do you want me to evaluate?" },
];

export default function AgentChatPage() {
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: AGENTS[0].greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    setMessages((p) => [...p, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, agent: AGENTS[activeIdx].id }),
      });
      const data = await res.json();
      setMessages((p) => [...p, { role: "assistant", content: data.reply || data.message || "No response." }]);
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally { setLoading(false); }
  };

  const switchAgent = useCallback((idx: number) => {
    setActiveIdx(idx);
    setMessages([{ role: "assistant", content: AGENTS[idx].greeting }]);
  }, []);

  const agent = AGENTS[activeIdx];

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-100px)] lg:h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 p-3 sm:p-4 rounded-2xl border border-white/10 bg-white/[0.03] mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-xl shrink-0">
            {agent.emoji}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-blue-500 tracking-[0.2em] uppercase">Status: Active</div>
            <div className="text-base font-bold text-white truncate">{agent.name}</div>
          </div>
        </div>
        <button onClick={() => switchAgent(activeIdx)} className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 hover:text-white border border-white/10 rounded-lg transition-colors shrink-0">
          Clear
        </button>
      </div>

      {/* Agent Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide -mx-1 px-1">
        {AGENTS.map((a, i) => (
          <button
            key={a.id}
            onClick={() => switchAgent(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              i === activeIdx
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white/5 border border-white/10 text-zinc-500 hover:text-white"
            }`}
          >
            <span className="text-lg">{a.emoji}</span>
            <span className="hidden sm:block">{a.name}</span>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 px-1 mb-4 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === "user"
                ? "bg-blue-600/10 border border-blue-500/30 text-white rounded-tr-sm"
                : "bg-white/5 border border-white/10 text-zinc-300 rounded-tl-sm"
            }`}>
              <div className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 opacity-50 ${m.role === "user" ? "text-blue-400" : "text-zinc-500"}`}>
                {m.role === "user" ? "You" : agent.name}
              </div>
              <div className="whitespace-pre-wrap break-words">{m.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] rounded-tl-sm px-4 py-3 text-sm text-zinc-500">
              <span className="mr-2">Thinking</span>
              <span className="inline-flex gap-1 align-middle">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 flex gap-2 items-end"
      >
        <input
          className="flex-1 bg-transparent border-none px-3 py-2.5 text-sm sm:text-base text-white placeholder:text-zinc-600 focus:outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all disabled:opacity-30 shrink-0"
        >
          <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}
