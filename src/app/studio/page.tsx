"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense, memo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useClerkAuth } from "@/hooks/useClerkAuth";
import Link from "next/link";
import lazyLoad from "next/dynamic";
import {
  Zap,
  Command,
  Monitor,
  Coins,
  Layers,
  Cpu,
  Activity,
  Shield,
  ChevronRight, Loader2,
} from "lucide-react";
import StudioSidebar, { StudioTool } from "./components/StudioSidebar";
import { MEDIA_PROVIDERS } from "@/lib/media";
import { useCrtToggle } from "@/context/ThemeContext";

/* Lazy-load tools to keep bundle reasonable */
const ImageTool = lazyLoad(() => import("./tools/ImageTool"), { ssr: false });
const VideoTool = lazyLoad(() => import("./tools/VideoTool"), { ssr: false });
const AudioTool = lazyLoad(() => import("./tools/AudioTool"), { ssr: false });
const AgentTool = lazyLoad(() => import("./tools/AgentTool"), { ssr: false });
const AgentsTerminalTool = lazyLoad(
  () => import("./tools/AgentsTerminalTool"),
  { ssr: false },
);
const CLIBridgeTool = lazyLoad(() => import("./tools/CLIBridgeTool"), {
  ssr: false,
});
const GalleryTool = lazyLoad(() => import("./tools/GalleryTool"), {
  ssr: false,
});
const SpaceTool = lazyLoad(() => import("./tools/SpaceTool"), { ssr: false });
const PipelineTool = lazyLoad(() => import("./tools/PipelineTool"), {
  ssr: false,
});

/* ------------------------------------------------------------------ */
/*  Model Badge — shows active provider per tool                        */
/* ------------------------------------------------------------------ */
const STATIC_MODEL_MAP: Record<
  StudioTool,
  { provider: string; color: string }
> = {
  image: { provider: "Gemini Imagen 3", color: "#6366f1" },
  video: { provider: "Wan 2.1", color: "#38bdf8" },
  clibridge: { provider: "Local CLI", color: "#10b981" },
  audio: { provider: "TTS / Music", color: "#f472b6" },
  agents: { provider: "Gemini 2.5 Flash", color: "#f59e0b" },
  terminal: { provider: "Gemini 2.5 Flash", color: "#00ffff" },
  pipeline: { provider: "Gemini Orchestrator", color: "#d946ef" },
  gallery: { provider: "Asset Bucket", color: "#d2a8ff" },
  space: { provider: "MiniMax Space", color: "#ff6b35" },
};

function ModelBadge({ tool, T }: { tool: StudioTool; T: any }) {
  const info = STATIC_MODEL_MAP[tool];
  const [providerLabel, setProviderLabel] = useState(info.provider);
  const [label, setLabel] = useState(info.provider);

  useEffect(() => {
    if (tool !== "agents" && tool !== "terminal") {
      setLabel(
        tool === "image"
          ? (MEDIA_PROVIDERS.find((p) => p.id === "gemini")?.label.split(
              " ",
            )[0] ?? "Gemini")
          : tool === "video"
            ? "Wan 2.1"
            : tool === "audio"
              ? "TTS / Music"
              : tool === "pipeline"
                ? "Gemini Orchestrator"
                : tool === "gallery"
                  ? "Asset Bucket"
                  : tool === "space"
                    ? "MiniMax Space"
                    : info.provider,
      );
      return;
    }
    fetch("/api/llm/health")
      .then((r) => r.json())
      .then((health: any) => {
        const gemini = health?.gemini;
        if (gemini?.available) {
          setProviderLabel("Google Gemini");
          setLabel(
            (gemini?.model || "gemini-2.5-flash").replace("gemini-", "Gemini "),
          );
        }
      })
      .catch(() => {
        setProviderLabel("Google Gemini");
        setLabel("Gemini 2.5 Flash");
      });
  }, [tool, info.provider]);

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold">
      <div
        className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_currentColor]"
        style={{ backgroundColor: info.color, color: info.color }}
      />
      <span className="opacity-40 uppercase tracking-widest">
        {providerLabel}
      </span>
      <span className="opacity-10">|</span>
      <span style={{ color: info.color }}>{label}</span>
    </div>
  );
}

function StatusBar({ T }: { T: any }) {
  return (
    <div
      className="w-full flex shrink-0 h-10 items-center justify-between px-4 border-t"
      style={{ borderColor: T.borderColor + "15", backgroundColor: T.boxBg }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
          <Activity size={12} className="text-green-500" />
          System Operational
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="text-[9px] font-bold opacity-30 uppercase tracking-tighter">
          Region: USE-1 • 24ms
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black opacity-30">
          LiTree Studio v2.0.1
        </span>
      </div>
    </div>
  );
}

const ToolRouter = memo(function ToolRouter({ tool }: { tool: StudioTool }) {
  switch (tool) {
    case "image":
      return <ImageTool />;
    case "video":
      return <VideoTool />;
    case "audio":
      return <AudioTool />;
    case "agents":
      return <AgentTool />;
    case "terminal":
      return <AgentsTerminalTool />;
    case "clibridge":
      return <CLIBridgeTool />;
    case "pipeline":
      return <PipelineTool />;
    case "gallery":
      return <GalleryTool />;
    case "space":
      return <SpaceTool />;
    default:
      return <ImageTool />;
  }
});

function StudioInner() {
  const { resolvedColors: T, theme } = useTheme();
  const { userId, isLoaded, isSignedIn } = useClerkAuth();
  const { crtEnabled, toggleCrt } = useCrtToggle();
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTool = (searchParams?.get("tool") as StudioTool) || "image";
  const [litcoins, setLitcoins] = useState(9999);

  useEffect(() => {
    fetch("/api/wallet")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.balance) setLitcoins(d.balance);
      });
  }, []);

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="p-6 rounded-full bg-white/5 border border-white/10">
          <Shield size={48} className="opacity-20" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight">
            Studio Encrypted
          </h2>
          <p className="text-sm opacity-50 max-w-xs">
            Please authorize your account to access the creative neural engines.
          </p>
        </div>
        <Link href="/login" className="btn-primary">
          Sign In to Unlock
        </Link>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: T.bgColor }}
    >
      {crtEnabled && (
        <div
          className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]"
          style={{
            background:
              "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 2px)",
          }}
        />
      )}

      <div className="flex flex-1 min-w-0 overflow-hidden">
        <StudioSidebar
          activeTool={activeTool}
          onToolChange={(t) =>
            router.push(`/studio?tool=${t}`, { scroll: false })
          }
        />

        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div
            className="flex items-center justify-between px-6 h-16 shrink-0 border-b"
            style={{
              borderColor: T.borderColor + "20",
              backgroundColor: T.boxBg + "40",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-30">
                <Layers size={14} />
                Studio
              </div>
              <ChevronRight size={12} className="opacity-20" />
              <div
                className="text-sm font-black tracking-tight uppercase"
                style={{ color: T.accentColor }}
              >
                {activeTool.replace("-", " ")}
              </div>
            </div>

            <ModelBadge tool={activeTool} T={T} />

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[11px] font-black text-yellow-500">
                <Coins size={14} /> {litcoins.toLocaleString()}
              </div>

              <button
                onClick={() => toggleCrt()}
                className="p-2.5 rounded-xl border transition-all hover:bg-white/5"
                style={{
                  borderColor: crtEnabled
                    ? T.accentColor
                    : T.borderColor + "40",
                  color: crtEnabled ? T.accentColor : T.textMuted,
                  boxShadow: crtEnabled
                    ? `0 0 15px ${T.accentColor}20`
                    : "none",
                }}
                title="Toggle Monitor Filter"
              >
                <Monitor size={18} />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0 overflow-y-auto studio-scroll p-6 lg:p-8">
            <Suspense
              fallback={
                <div className="h-full flex flex-col items-center justify-center gap-4 opacity-20">
                  <Loader2 className="animate-spin" size={32} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                    Initializing Node
                  </span>
                </div>
              }
            >
              <ToolRouter tool={activeTool} />
            </Suspense>
          </div>

          <StatusBar T={T} />
        </main>
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={null}>
      <StudioInner />
    </Suspense>
  );
}
