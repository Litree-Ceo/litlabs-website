"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useTheme, darkSkins, lightSkins, type SkinPreset, type AccentColor } from "@/context/ThemeContext";
import type { BackgroundMode } from "@/components/AnimatedBackground";
import { useProfile } from "@/context/ProfileContext";
import { useAuth, RedirectToSignIn } from "@clerk/nextjs";
import PageShell from "@/components/PageShell";
import {
  Palette, User, Bot, Monitor, Sparkles, Moon, Sun, Check,
  Zap, Layers, RefreshCw, Code, Trash2, ChevronRight, Eye, Type, Volume2
} from "lucide-react";

/* Modern display labels for legacy skin names */
const skinLabels: Record<SkinPreset, string> = {
  cyberpunk: "Navy Cyan", retro: "Amber Warm", ocean: "Deep Aqua", sunset: "Warm Ember",
  matrix: "Indigo Void", pink: "Rose Mauve", synthwave: "Violet Dream", volcanic: "Coral Ash",
  gold: "Honey Gold", arctic: "Ice Blue", emerald: "Forest Mint", midnight: "Blue Noir",
  neon: "Clean Slate", blood: "Crimson Wine", cosmic: "Lavender Space", miami: "Teal Breeze",
};

const accentLabels: Record<string, string> = {
  "neon-green": "Cyan", "hot-pink": "Magenta", "electric-blue": "Cobalt",
  "cyber-yellow": "Amber", "matrix-green": "Violet", "sunset-orange": "Coral",
  "ocean-blue": "Azure", "purple-haze": "Lilac",
};

const accentHex: Record<string, string> = {
  "neon-green": "#06b6d4", "hot-pink": "#ec4899", "electric-blue": "#3b82f6",
  "cyber-yellow": "#f59e0b", "matrix-green": "#8b5cf6", "sunset-orange": "#f97316",
  "ocean-blue": "#0ea5e9", "purple-haze": "#a855f7",
};

const tabMeta: { id: "theme" | "profile" | "agents" | "interface" | "advanced"; label: string; icon: typeof Palette }[] = [
  { id: "theme", label: "Appearance", icon: Palette },
  { id: "profile", label: "Profile", icon: User },
  { id: "agents", label: "Agents", icon: Bot },
  { id: "interface", label: "Interface", icon: Monitor },
  { id: "advanced", label: "System", icon: Zap },
];

export default function SettingsPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { theme, resolvedColors, setMode, setSkin, setAccent, setBackgroundMode, resetTheme } = useTheme();
  const { profile, updateProfile, resetProfile } = useProfile();

  const [activeTab, setActiveTab] = useState<"theme" | "profile" | "agents" | "advanced" | "interface">("theme");
  const [saved, setSaved] = useState(false);

  // Interface settings
  const [animSpeed, setAnimSpeed] = useState<string>("normal");
  const [compactMode, setCompactMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundEffects, setSoundEffects] = useState(false);
  const [customCSS, setCustomCSS] = useState("");

  const skinPresets: SkinPreset[] = ["cyberpunk", "retro", "ocean", "sunset", "matrix", "pink", "synthwave", "volcanic", "gold", "arctic", "emerald", "midnight", "neon", "blood", "cosmic", "miami"];
  const backgroundModes: { mode: BackgroundMode; label: string }[] = [
    { mode: "constellation", label: "Constellation" },
    { mode: "nebula", label: "Nebula" },
    { mode: "waves", label: "Waves" },
    { mode: "minimal", label: "Minimal" },
  ];
  const accentColors: AccentColor[] = ["electric-blue", "purple-haze", "hot-pink", "cyber-yellow", "neon-green", "matrix-green", "sunset-orange", "ocean-blue"];

  useEffect(() => {
    setAnimSpeed(localStorage.getItem("litlabs-anim-speed") || "normal");
    setCompactMode(localStorage.getItem("litlabs-compact") === "true");
    setReducedMotion(localStorage.getItem("litlabs-reduced-motion") === "true");
    setSoundEffects(localStorage.getItem("litlabs-sound") === "true");
    setCustomCSS(localStorage.getItem("litlabs-custom-css") || "");
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0c0c14", color: "#7dd3fc" }}>
        <div className="text-center">
          <div className="text-3xl mb-4 animate-pulse">⚡</div>
          <div className="text-sm opacity-70">Loading settings...</div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn redirectUrl="/settings" />;
  }

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const saveInterface = (key: string, value: string | boolean) => {
    localStorage.setItem(`litlabs-${key}`, String(value));
    showSaved();
    if (key === "reduced-motion") {
      document.documentElement.style.setProperty("--anim-duration-multiplier", value ? "0" : "1");
    }
    if (key === "custom-css") {
      let style = document.getElementById("litlabs-custom-css") as HTMLStyleElement | null;
      if (!style) { style = document.createElement("style"); style.id = "litlabs-custom-css"; document.head.appendChild(style); }
      style.textContent = value as string;
    }
  };

  const T = resolvedColors;

  return (
    <PageShell title="Settings" className="relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-lg font-bold tracking-tight" style={{ color: T.headerColor }}>Settings</h1>
          <p className="text-[11px] opacity-50 mt-0.5" style={{ color: T.textMuted }}>Customize your workspace experience</p>
        </div>

        {/* Modern tab navigation */}
        <div className="flex gap-1 mb-8 p-1 rounded-xl" style={{ backgroundColor: T.boxBg, border: `1px solid ${T.borderColor}20` }}>
          {tabMeta.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all"
                style={{
                  backgroundColor: isActive ? T.accentColor + "15" : "transparent",
                  color: isActive ? T.accentColor : T.textMuted,
                }}
              >
                <Icon size={13} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Theme Tab */}
        {activeTab === "theme" && (
          <div className="space-y-5 animate-fadeInUp">
            {/* Background */}
            <section className="rounded-2xl p-5" style={{ backgroundColor: T.boxBg, border: `1px solid ${T.borderColor}18` }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={14} style={{ color: T.accentColor }} />
                <h2 className="text-[13px] font-bold" style={{ color: T.textColor }}>Background Effect</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {backgroundModes.map((bm) => (
                  <button key={bm.mode} onClick={() => { setBackgroundMode(bm.mode); showSaved(); }}
                    className="px-3 py-2.5 rounded-xl text-[11px] font-medium transition-all hover:scale-[1.02]"
                    style={{
                      backgroundColor: theme.backgroundMode === bm.mode ? T.accentColor + "15" : T.bgColor,
                      border: `1px solid ${theme.backgroundMode === bm.mode ? T.accentColor + "30" : T.borderColor + "15"}`,
                      color: theme.backgroundMode === bm.mode ? T.accentColor : T.textColor,
                    }}>{bm.label}</button>
                ))}
              </div>
            </section>

            {/* Mode */}
            <section className="rounded-2xl p-5" style={{ backgroundColor: T.boxBg, border: `1px solid ${T.borderColor}18` }}>
              <div className="flex items-center gap-2 mb-4">
                <Monitor size={14} style={{ color: T.accentColor }} />
                <h2 className="text-[13px] font-bold" style={{ color: T.textColor }}>Mode</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setMode("dark"); showSaved(); }}
                  className="flex items-center gap-2 flex-1 px-4 py-3 rounded-xl text-[11px] font-semibold transition-all hover:scale-[1.01]"
                  style={{ backgroundColor: theme.mode === "dark" ? T.accentColor + "12" : T.bgColor, border: `1px solid ${theme.mode === "dark" ? T.accentColor + "30" : T.borderColor + "15"}`, color: theme.mode === "dark" ? T.accentColor : T.textMuted }}>
                  <Moon size={14} /> Dark
                </button>
                <button onClick={() => { setMode("light"); showSaved(); }}
                  className="flex items-center gap-2 flex-1 px-4 py-3 rounded-xl text-[11px] font-semibold transition-all hover:scale-[1.01]"
                  style={{ backgroundColor: theme.mode === "light" ? T.accentColor + "12" : T.bgColor, border: `1px solid ${theme.mode === "light" ? T.accentColor + "30" : T.borderColor + "15"}`, color: theme.mode === "light" ? T.accentColor : T.textMuted }}>
                  <Sun size={14} /> Light
                </button>
              </div>
            </section>

            {/* Skins with swatches */}
            <section className="rounded-2xl p-5" style={{ backgroundColor: T.boxBg, border: `1px solid ${T.borderColor}18` }}>
              <div className="flex items-center gap-2 mb-4">
                <Palette size={14} style={{ color: T.accentColor }} />
                <h2 className="text-[13px] font-bold" style={{ color: T.textColor }}>Color Palette</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {skinPresets.map((skin) => {
                  const colors = theme.mode === "light" ? lightSkins[skin] : darkSkins[skin];
                  const isActive = theme.skin === skin;
                  return (
                    <button key={skin} onClick={() => { setSkin(skin); showSaved(); }}
                      className="relative px-3 py-3 rounded-xl text-[11px] font-medium transition-all hover:scale-[1.02] text-left"
                      style={{ backgroundColor: isActive ? colors.accentColor + "10" : T.bgColor, border: `1px solid ${isActive ? colors.accentColor + "40" : T.borderColor + "12"}`, color: T.textColor }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: colors.accentColor }} />
                        <span className="truncate">{skinLabels[skin]}</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-4 h-1.5 rounded-full" style={{ backgroundColor: colors.bgColor, border: `1px solid ${colors.borderColor}` }} />
                        <span className="w-4 h-1.5 rounded-full" style={{ backgroundColor: colors.textColor }} />
                        <span className="w-4 h-1.5 rounded-full" style={{ backgroundColor: colors.linkColor }} />
                      </div>
                      {isActive && <Check size={12} className="absolute top-2 right-2" style={{ color: colors.accentColor }} />}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Accent */}
            <section className="rounded-2xl p-5" style={{ backgroundColor: T.boxBg, border: `1px solid ${T.borderColor}18` }}>
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} style={{ color: T.accentColor }} />
                <h2 className="text-[13px] font-bold" style={{ color: T.textColor }}>Accent</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {accentColors.map((accent) => {
                  const isActive = theme.accent === accent;
                  const hex = accentHex[accent];
                  return (
                    <button key={accent} onClick={() => { setAccent(accent); showSaved(); }}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: isActive ? hex + "12" : T.bgColor, border: `1px solid ${isActive ? hex + "40" : T.borderColor + "12"}`, color: isActive ? hex : T.textMuted }}>
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: hex }} />
                      {accentLabels[accent]}
                    </button>
                  );
                })}
              </div>
            </section>

            <button onClick={() => { resetTheme(); showSaved(); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-medium transition-all hover:scale-[1.02]"
              style={{ backgroundColor: T.boxBg, border: `1px solid ${T.borderColor}20`, color: T.textMuted }}>
              <RefreshCw size={12} /> Reset to defaults
            </button>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-4 animate-fadeInUp max-w-xl">
            {[
              { key: "displayName" as const, label: "Display Name", icon: Type, type: "text" },
              { key: "bio" as const, label: "Bio", icon: Layers, type: "textarea" },
              { key: "mood" as const, label: "Mood", icon: Sparkles, type: "text" },
              { key: "website" as const, label: "Website", icon: Monitor, type: "text" },
            ].map((field) => {
              const Icon = field.icon;
              return (
                <section key={field.key} className="rounded-2xl p-5" style={{ backgroundColor: T.boxBg, border: `1px solid ${T.borderColor}18` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={14} style={{ color: T.accentColor }} />
                    <h2 className="text-[13px] font-bold" style={{ color: T.textColor }}>{field.label}</h2>
                  </div>
                  {field.type === "textarea" ? (
                    <textarea value={profile[field.key]} rows={3}
                      onChange={(e) => { updateProfile({ [field.key]: e.target.value }); showSaved(); }}
                      className="w-full p-3 rounded-xl text-[12px] outline-none resize-none"
                      style={{ backgroundColor: T.bgColor, border: `1px solid ${T.borderColor}20`, color: T.textColor }} />
                  ) : (
                    <input type="text" value={profile[field.key]}
                      onChange={(e) => { updateProfile({ [field.key]: e.target.value }); showSaved(); }}
                      className="w-full p-3 rounded-xl text-[12px] outline-none"
                      style={{ backgroundColor: T.bgColor, border: `1px solid ${T.borderColor}20`, color: T.textColor }} />
                  )}
                </section>
              );
            })}
            <button onClick={() => { resetProfile(); showSaved(); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-medium"
              style={{ backgroundColor: T.boxBg, border: `1px solid ${T.borderColor}20`, color: T.textMuted }}>
              <RefreshCw size={12} /> Reset profile
            </button>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === "agents" && (
          <div className="space-y-4 animate-fadeInUp max-w-xl">
            <section className="rounded-2xl p-5" style={{ backgroundColor: T.boxBg, border: `1px solid ${T.borderColor}18` }}>
              <div className="flex items-center gap-2 mb-3">
                <Bot size={14} style={{ color: T.accentColor }} />
                <h2 className="text-[13px] font-bold" style={{ color: T.textColor }}>Webhook</h2>
              </div>
              <p className="text-[11px] opacity-60 mb-2">ActivePieces flow endpoint</p>
              <code className="block p-3 rounded-xl text-[10px] font-mono break-all"
                style={{ backgroundColor: T.bgColor, border: `1px solid ${T.borderColor}15`, color: T.accentColor }}>
                https://cloud.activepieces.com/api/v1/webhooks/VoccE3SEr4bciLvkThTlO
              </code>
            </section>

            <section className="rounded-2xl p-5" style={{ backgroundColor: T.boxBg, border: `1px solid ${T.borderColor}18` }}>
              <div className="flex items-center gap-2 mb-4">
                <Layers size={14} style={{ color: T.accentColor }} />
                <h2 className="text-[13px] font-bold" style={{ color: T.textColor }}>Core Agents</h2>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Director", role: "Orchestrator", color: T.accentColor },
                  { name: "Champion", role: "General Assistant", color: T.linkColor },
                  { name: "Code Champion", role: "Software Expert", color: T.headerColor },
                  { name: "Social Dominator", role: "Growth & Viral", color: T.accentColor },
                  { name: "Data Slayer", role: "Analytics", color: T.linkColor },
                  { name: "Writing Coach", role: "Copy & Content", color: T.headerColor },
                ].map((a) => (
                  <div key={a.name} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ backgroundColor: T.bgColor, border: `1px solid ${T.borderColor}10` }}>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                    <span className="text-[12px] font-semibold" style={{ color: T.textColor }}>{a.name}</span>
                    <span className="text-[10px] opacity-50 ml-auto" style={{ color: T.textMuted }}>{a.role}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Interface Tab */}
        {activeTab === "interface" && (
          <div className="space-y-4 animate-fadeInUp max-w-xl">
            <section className="rounded-2xl p-5" style={{ backgroundColor: T.boxBg, border: `1px solid ${T.borderColor}18` }}>
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} style={{ color: T.accentColor }} />
                <h2 className="text-[13px] font-bold" style={{ color: T.textColor }}>Animation</h2>
              </div>
              <div className="flex gap-2">
                {["fast", "normal", "slow", "off"].map((speed) => (
                  <button key={speed} onClick={() => { setAnimSpeed(speed); saveInterface("anim-speed", speed); }}
                    className="flex-1 px-3 py-2.5 rounded-xl text-[11px] font-medium transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: animSpeed === speed ? T.accentColor + "12" : T.bgColor, border: `1px solid ${animSpeed === speed ? T.accentColor + "30" : T.borderColor + "15"}`, color: animSpeed === speed ? T.accentColor : T.textMuted }}>
                    {speed.charAt(0).toUpperCase() + speed.slice(1)}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl p-5" style={{ backgroundColor: T.boxBg, border: `1px solid ${T.borderColor}18` }}>
              <div className="flex items-center gap-2 mb-4">
                <Monitor size={14} style={{ color: T.accentColor }} />
                <h2 className="text-[13px] font-bold" style={{ color: T.textColor }}>Density</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setCompactMode(true); saveInterface("compact", true); }}
                  className="flex-1 px-3 py-2.5 rounded-xl text-[11px] font-medium transition-all"
                  style={{ backgroundColor: compactMode ? T.accentColor + "12" : T.bgColor, border: `1px solid ${compactMode ? T.accentColor + "30" : T.borderColor + "15"}`, color: compactMode ? T.accentColor : T.textMuted }}>
                  Compact
                </button>
                <button onClick={() => { setCompactMode(false); saveInterface("compact", false); }}
                  className="flex-1 px-3 py-2.5 rounded-xl text-[11px] font-medium transition-all"
                  style={{ backgroundColor: !compactMode ? T.accentColor + "12" : T.bgColor, border: `1px solid ${!compactMode ? T.accentColor + "30" : T.borderColor + "15"}`, color: !compactMode ? T.accentColor : T.textMuted }}>
                  Comfortable
                </button>
              </div>
            </section>

            <section className="rounded-2xl p-5" style={{ backgroundColor: T.boxBg, border: `1px solid ${T.borderColor}18` }}>
              <div className="flex items-center gap-2 mb-4">
                <Eye size={14} style={{ color: T.accentColor }} />
                <h2 className="text-[13px] font-bold" style={{ color: T.textColor }}>Accessibility</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Reduced Motion", desc: "Disable animations", state: reducedMotion, key: "reduced-motion" },
                  { label: "Sound Effects", desc: "UI audio cues", state: soundEffects, key: "sound" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: T.bgColor, border: `1px solid ${T.borderColor}10` }}>
                    <div>
                      <div className="text-[12px] font-semibold" style={{ color: T.textColor }}>{item.label}</div>
                      <div className="text-[10px] opacity-50" style={{ color: T.textMuted }}>{item.desc}</div>
                    </div>
                    <button onClick={() => {
                      const next = !item.state;
                      if (item.key === "reduced-motion") setReducedMotion(next);
                      else setSoundEffects(next);
                      saveInterface(item.key, next);
                    }} className="relative w-10 h-5 rounded-full transition-all"
                      style={{ backgroundColor: item.state ? T.accentColor : T.borderColor + "40" }}>
                      <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-all"
                        style={{ transform: item.state ? "translateX(18px)" : "translateX(0)" }} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl p-5" style={{ backgroundColor: T.boxBg, border: `1px solid ${T.borderColor}18` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Code size={14} style={{ color: T.accentColor }} />
                  <h2 className="text-[13px] font-bold" style={{ color: T.textColor }}>Custom CSS</h2>
                </div>
                <button onClick={() => { setCustomCSS(""); saveInterface("custom-css", ""); }}
                  className="text-[10px] px-2 py-1 rounded-lg font-medium"
                  style={{ backgroundColor: T.bgColor, border: `1px solid ${T.borderColor}20`, color: T.textMuted }}>Clear</button>
              </div>
              <textarea value={customCSS} onChange={(e) => setCustomCSS(e.target.value)} onBlur={(e) => saveInterface("custom-css", e.target.value)}
                rows={5} placeholder={":root { --border: #333; }"}
                className="w-full p-3 rounded-xl text-[10px] font-mono outline-none resize-none"
                style={{ backgroundColor: T.bgColor, border: `1px solid ${T.borderColor}20`, color: T.textColor }} />
            </section>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === "advanced" && (
          <div className="space-y-4 animate-fadeInUp max-w-xl">
            <section className="rounded-2xl p-5" style={{ backgroundColor: T.boxBg, border: `1px solid ${T.borderColor}18` }}>
              <div className="flex items-center gap-2 mb-4">
                <Code size={14} style={{ color: T.accentColor }} />
                <h2 className="text-[13px] font-bold" style={{ color: T.textColor }}>Environment</h2>
              </div>
              <div className="space-y-2 text-[10px] font-mono">
                {[
                  { key: "Clerk Auth", status: "Configured" },
                  { key: "Gemini AI", status: "Active" },
                  { key: "OpenRouter", status: "Active" },
                ].map((env) => (
                  <div key={env.key} className="flex justify-between p-2.5 rounded-xl" style={{ backgroundColor: T.bgColor, border: `1px solid ${T.borderColor}10` }}>
                    <span style={{ color: T.textMuted }}>{env.key}</span>
                    <span style={{ color: "#34d399" }}>{env.status}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] opacity-40 mt-3" style={{ color: T.textMuted }}>Update in Vercel Dashboard → Settings → Environment Variables</p>
            </section>

            <section className="rounded-2xl p-5" style={{ backgroundColor: T.boxBg, border: `1px solid ${T.borderColor}18` }}>
              <div className="flex items-center gap-2 mb-4">
                <Trash2 size={14} style={{ color: "#ef4444" }} />
                <h2 className="text-[13px] font-bold" style={{ color: T.textColor }}>Data</h2>
              </div>
              <p className="text-[11px] opacity-60 mb-3">This will erase all local config and reset everything.</p>
              <button onClick={() => { localStorage.clear(); window.location.reload(); }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[11px] font-semibold transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "#ef444415", border: `1px solid #ef444430`, color: "#ef4444" }}>
                <Trash2 size={12} /> Clear all data
              </button>
            </section>
          </div>
        )}

        {/* Saved toast */}
        {saved && (
          <div className="fixed bottom-6 right-6 px-4 py-2.5 rounded-xl text-[11px] font-medium z-50 flex items-center gap-2 shadow-lg"
            style={{ backgroundColor: T.accentColor + "15", border: `1px solid ${T.accentColor}30`, color: T.accentColor }}>
            <Check size={14} /> Saved
          </div>
        )}
      </div>
    </PageShell>
  );
}
