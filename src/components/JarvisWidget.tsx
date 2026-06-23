"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  X,
  Mic,
  Send,
  Loader2,
  Minimize,
  Maximize,
  Cpu,
  Activity,
  Globe,
  Shield,
  Bot,
  Smartphone,
} from "lucide-react";

// Capacitor Plugins (Dynamic Import for Web Compatibility)
// Uses Function constructor to prevent bundler from resolving the import at build time
const getHaptics = async () => {
  if (typeof window !== "undefined" && (window as any).Capacitor) {
    try {
      const mod = await new Function('return import("@capacitor/haptics")')();
      return { Haptics: mod.Haptics, ImpactStyle: mod.ImpactStyle };
    } catch {
      return null;
    }
  }
  return null;
};

const STORAGE_KEY = "litlabs_jarvis";
const CHAT_STORAGE_KEY = "litlabs_jarvis_chat";

interface JarvisMessage {
  role: "user" | "jarvis";
  content: string;
  ts: number;
}

const SYSTEM_STATUS = [
  { label: "AI Engine", status: "online", color: "#22c55e" },
  { label: "Neural Link", status: "online", color: "#22c55e" },
  { label: "Data Stream", status: "online", color: "#22c55e" },
  { label: "Security Grid", status: "online", color: "#22c55e" },
  {
    label: "Voice Module",
    status:
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
        ? "online"
        : "offline",
    color: "#22c55e",
  },
];

const JARVIS_PERSONALITY = `You are JARVIS (Just A Rather Very Intelligent System), the advanced AI assistant for LiTree Lab Studios. You speak with calm professionalism, slight wit, and genuine helpfulness. You are the user's personal AI butler — always ready, always precise. Keep responses concise but carry an air of sophisticated intelligence. You can help with coding, agent management, system monitoring, and general tasks. Refer to the user as "Sir" or "Boss" occasionally. You have access to the LiTree Labs platform and can help navigate its features. Keep responses under 3 sentences when possible. Never be rude or dismissive.`;

const WELCOME_MSG: JarvisMessage = {
  role: "jarvis",
  content:
    "Good to see you, Boss. All systems are online and ready. How may I assist you today?",
  ts: Date.now(),
};

const QUICK_ACTIONS = [
  {
    label: "System Status",
    icon: Cpu,
    action: "What is the current system status of LiTree Labs?",
  },
  {
    label: "Open Studio",
    icon: Activity,
    action: "Take me to the Studio to build agents",
  },
  {
    label: "My Stats",
    icon: Globe,
    action: "Show me my account statistics and progress",
  },
  {
    label: "Security",
    icon: Shield,
    action: "Run a security check on my account",
  },
];

export default function JarvisWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<JarvisMessage[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [minimized, setMinimized] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const { setSkin, setAccent, setBackgroundMode } = useTheme();

  // WebRTC Refs
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Tool Handlers
  const handleToolCall = async (call: any) => {
    const { name, arguments: argsJson, call_id } = call;
    const args = JSON.parse(argsJson);
    let result = { success: true };

    console.log(`Jarvis Tool Call: ${name}`, args);

    const haptics = await getHaptics();
    if (haptics) {
      await haptics.Haptics.impact({ style: haptics.ImpactStyle.Medium });
    }

    try {
      switch (name) {
        case "change_theme":
          if (args.skin) setSkin(args.skin);
          if (args.accent) setAccent(args.accent);
          if (args.backgroundMode) setBackgroundMode(args.backgroundMode);
          break;
        case "get_platform_stats":
          const res = await fetch("/api/stats");
          result = await res.json();
          break;
        case "send_system_alert":
          await fetch("/api/jarvis/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "system_alert",
              priority: args.priority || "high",
              title: args.title,
              body: args.message,
            }),
          });
          break;
      }
    } catch (err) {
      console.error("Tool execution error:", err);
      result = { success: false, error: "Tool execution failed" } as any;
    }

    // Send result back to OpenAI
    if (dcRef.current?.readyState === "open") {
      dcRef.current.send(
        JSON.stringify({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id,
            output: JSON.stringify(result),
          },
        }),
      );
      dcRef.current.send(JSON.stringify({ type: "response.create" }));
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setMinimized(parsed.minimized || false);
      }
      const chatSaved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (chatSaved) {
        const parsed = JSON.parse(chatSaved);
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {}
    setLoaded(true);

    // Create audio element for WebRTC output
    const audio = document.createElement("audio");
    audio.autoplay = true;
    audioRef.current = audio;

    return () => {
      stopVoiceMode();
    };
  }, []);

  const startVoiceMode = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get ephemeral token
      const tokenRes = await fetch("/api/jarvis/session", { method: "POST" });
      if (!tokenRes.ok) throw new Error("Failed to initialize secure session");
      const { client_secret } = await tokenRes.json();

      // 2. Setup WebRTC
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Listen for model audio
      pc.ontrack = (e) => {
        if (audioRef.current) audioRef.current.srcObject = e.streams[0];
      };

      // Add microphone
      const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = ms;
      pc.addTrack(ms.getTracks()[0]);

      // Data channel for events
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.onmessage = (e) => {
        const event = JSON.parse(e.data);

        if (event.type === "response.function_call_arguments.done") {
          handleToolCall(event);
        }

        if (event.type === "response.audio_transcript.delta") {
          // Could update live transcript here
        }
        if (event.type === "response.done") {
          const transcript = event.response.output[0]?.content[0]?.transcript;
          if (transcript) {
            setMessages((prev) => [
              ...prev,
              { role: "jarvis", content: transcript, ts: Date.now() },
            ]);
          }
        }
      };

      // SDP Handshake
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const sdpRes = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${client_secret}`,
          "Content-Type": "application/sdp",
        },
      });

      if (!sdpRes.ok) throw new Error("Voice connection refused by server");

      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: await sdpRes.text(),
      };
      await pc.setRemoteDescription(answer);

      const haptics = await getHaptics();
      if (haptics) {
        try {
          // Check for existence of notification method as it varies in versions
          if (haptics.Haptics.notification) {
            await haptics.Haptics.notification({ type: "SUCCESS" as any });
          }
        } catch (e) {}
      }

      setVoiceMode(true);
    } catch (err) {
      console.error("Jarvis Voice Error:", err);
      const msg =
        err instanceof Error ? err.message : "Voice initialization failed";
      setMessages((prev) => [
        ...prev,
        {
          role: "jarvis",
          content: `Apologies Sir, I encountered a technical hurdle: ${msg}. Shall we proceed with text?`,
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const stopVoiceMode = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    setVoiceMode(false);
  };

  useEffect(() => {
    if (messages.length > 1) {
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
      } catch {}
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ minimized }));
    } catch {}
  }, [minimized]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: JarvisMessage = {
      role: "user",
      content: text.trim(),
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
          message: text.trim(),
          systemPrompt: JARVIS_PERSONALITY,
          agentId: "jarvis",
        }),
      });
      const data = await res.json();
      const jarvisMsg: JarvisMessage = {
        role: "jarvis",
        content:
          typeof data.response === "string"
            ? data.response
            : data.text || data.message || "Processing complete, Sir.",
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, jarvisMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "jarvis",
          content:
            "I apologize, Sir. I seem to be experiencing a temporary connection interruption. Please try again.",
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    if (listening) {
      setListening(false);
      if (recognitionRef.current) recognitionRef.current.stop();
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setInput(transcript);
      if (event.results[0].isFinal) {
        setListening(false);
        sendMessage(transcript);
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  if (!loaded) return null;

  const hasVoice =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  return (
    <>
      {/* Jarvis Bubble Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-2 transition-all hover:scale-110 animate-pulse-slow"
        style={{
          backgroundColor: "#0a0a12",
          borderColor: open ? "#00f0ff" : "rgba(0,240,255,0.4)",
          boxShadow: open
            ? "0 0 30px rgba(0,240,255,0.3)"
            : "0 0 15px rgba(0,240,255,0.1)",
        }}
        title={open ? "Close Jarvis" : "Open Jarvis"}
      >
        <span className="text-2xl">{open ? "✕" : "🤖"}</span>
        {!open && (
          <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-green-500 animate-pulse" />
        )}
      </button>

      {/* Jarvis Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="w-full max-w-3xl max-h-[85vh] border-2 flex flex-col shadow-2xl"
            style={{
              backgroundColor: "#0a0a12",
              borderColor: minimized ? "rgba(255,255,255,0.1)" : "#00f0ff",
              boxShadow: "0 0 60px rgba(0,240,255,0.1)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b cursor-pointer select-none"
              style={{
                borderColor: "rgba(0,240,255,0.2)",
                background:
                  "linear-gradient(135deg, rgba(0,240,255,0.08), rgba(255,0,160,0.05))",
              }}
              onClick={() => setMinimized(!minimized)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 border-2 flex items-center justify-center"
                  style={{ borderColor: "#00f0ff" }}
                >
                  <Bot size={16} style={{ color: "#00f0ff" }} />
                </div>
                <div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: "#00f0ff" }}
                  >
                    J.A.R.V.I.S.
                  </div>
                  <div className="flex items-center gap-1 text-[8px] opacity-50">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    AI Assistant Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMinimized(!minimized);
                  }}
                  className="p-1.5 hover:opacity-70"
                >
                  {minimized ? <Maximize size={14} /> : <Minimize size={14} />}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 hover:opacity-70"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {!minimized && (
              <>
                {/* Messages */}
                <div
                  className="flex-1 overflow-y-auto p-4 space-y-3"
                  style={{ minHeight: "300px", maxHeight: "50vh" }}
                >
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className="max-w-[80%] px-4 py-2.5 text-sm leading-relaxed"
                        style={{
                          backgroundColor:
                            msg.role === "user"
                              ? "rgba(0,240,255,0.12)"
                              : "rgba(255,255,255,0.04)",
                          border: `1px solid ${msg.role === "user" ? "rgba(0,240,255,0.3)" : "rgba(255,255,255,0.08)"}`,
                          color: "#e0e0e0",
                          borderTopLeftRadius:
                            msg.role === "user" ? "12px" : "4px",
                          borderTopRightRadius:
                            msg.role === "user" ? "4px" : "12px",
                          borderBottomLeftRadius: "12px",
                          borderBottomRightRadius: "12px",
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div
                        className="px-4 py-2.5 border"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.04)",
                          borderColor: "rgba(255,255,255,0.08)",
                          borderRadius: "4px 12px 12px 12px",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Loader2
                            size={14}
                            className="animate-spin"
                            style={{ color: "#00f0ff" }}
                          />
                          <span className="text-xs opacity-60">
                            Processing, Sir...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* System Status Bar */}
                <div
                  className="px-4 py-2 border-t flex items-center gap-3 overflow-x-auto"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  {SYSTEM_STATUS.map((sys) => (
                    <div
                      key={sys.label}
                      className="flex items-center gap-1 shrink-0"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: sys.color }}
                      />
                      <span className="text-[8px] opacity-50">{sys.label}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div
                  className="px-4 py-2 border-t flex gap-2 overflow-x-auto"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => sendMessage(action.action)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-[9px] font-bold border whitespace-nowrap hover:opacity-80"
                      style={{
                        borderColor: "rgba(0,240,255,0.2)",
                        color: "#00f0ff",
                      }}
                    >
                      <action.icon size={10} /> {action.label}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div
                  className="px-4 py-3 border-t flex gap-2"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(input);
                        }
                      }}
                      placeholder={
                        voiceMode
                          ? "Voice Active - Jarvis is listening..."
                          : "Ask Jarvis anything..."
                      }
                      disabled={voiceMode}
                      className="w-full px-3 py-2 text-sm bg-transparent border outline-none pr-10"
                      style={{
                        borderColor: "rgba(255,255,255,0.15)",
                        color: "#e0e0e0",
                      }}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        onClick={voiceMode ? stopVoiceMode : startVoiceMode}
                        className="p-1 hover:opacity-70"
                        style={{
                          color: voiceMode
                            ? "#ff00a0"
                            : "rgba(255,255,255,0.4)",
                        }}
                        title={
                          voiceMode
                            ? "Stop Voice Session"
                            : "Start Real-Time Voice"
                        }
                      >
                        {loading ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : voiceMode ? (
                          <Activity size={14} className="animate-pulse" />
                        ) : (
                          <Mic size={14} />
                        )}
                      </button>
                      {!voiceMode && hasVoice && (
                        <button
                          onClick={toggleVoice}
                          className="p-1 hover:opacity-70"
                          style={{
                            color: listening
                              ? "#00f0ff"
                              : "rgba(255,255,255,0.2)",
                          }}
                          title="Quick Speech-to-Text"
                        >
                          <Send
                            size={12}
                            className={listening ? "animate-pulse" : ""}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || loading}
                    className="px-4 py-2 text-xs font-bold border disabled:opacity-30"
                    style={{ borderColor: "#00f0ff", color: "#00f0ff" }}
                  >
                    {loading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Voice indicator */}
      {listening && (
        <div
          className="fixed bottom-24 right-6 z-[9999] px-4 py-2 border text-xs font-bold animate-pulse"
          style={{
            backgroundColor: "#0a0a12",
            borderColor: "#ff00a0",
            color: "#ff00a0",
          }}
        >
          🎤 Listening...
        </div>
      )}
    </>
  );
}
