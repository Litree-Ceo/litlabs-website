"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import {
  useTheme,
  darkSkins,
  lightSkins,
  type SkinPreset,
} from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { useClerkAuth } from "@/hooks/useClerkAuth";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { WALLPAPERS } from "@/lib/wallpapers";
import {
  Palette,
  User,
  Bot,
  Monitor,
  Sparkles,
  Moon,
  Sun,
  Check,
  Zap,
  RefreshCw,
  Code,
  Trash2,
  Eye,
  Camera,
  ImageIcon,
  MapPin,
  Globe,
  AtSign,
  Loader2,
  Wand2,
  Link2,
  Hash,
  Fingerprint,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  Terminal,
  Activity,
  Wifi,
  Cpu,
  Database,
  AlertTriangle,
  Music,
  Volume2,
  VolumeX,
  Shield,
  CreditCard,
  Layout,
} from "lucide-react";

const skinLabels: Record<SkinPreset, string> = {
  midnight: "Premium Dark",
  cyberpunk: "Neon Cyber",
  ocean: "Deep Ocean",
  sunset: "Warm Sunset",
  matrix: "Code Matrix",
  pink: "Rose Quartz",
  synthwave: "Neon Violet",
  volcanic: "Lava Flow",
  gold: "Luxury Gold",
  arctic: "Arctic Frost",
  emerald: "Emerald City",
  neon: "Pure Neon",
  blood: "Deep Crimson",
  cosmic: "Cosmic Void",
  miami: "Miami Nights",
  minimal: "Pure Minimal",
};

const accentHex: Record<string, string> = {
  "electric-blue": "#3b82f6",
  "neon-green": "#06b6d4",
  "hot-pink": "#ec4899",
  "cyber-yellow": "#f59e0b",
  "matrix-green": "#8b5cf6",
  "sunset-orange": "#f97316",
  "ocean-blue": "#0ea5e9",
  "purple-haze": "#a855f7",
};

type TabId = "theme" | "profile" | "agents" | "interface" | "account" | "music";

const TABS: { id: TabId; label: string; icon: any; shortcut: string }[] = [
  { id: "theme", label: "Theme", icon: Palette, shortcut: "T" },
  { id: "profile", label: "Profile", icon: User, shortcut: "P" },
  { id: "agents", label: "Agents", icon: Bot, shortcut: "A" },
  { id: "interface", label: "Layout", icon: Layout, shortcut: "L" },
  { id: "music", label: "Audio", icon: Music, shortcut: "M" },
  { id: "account", label: "Account", icon: Shield, shortcut: "S" },
];

// Modern field component
function Field({
  label,
  value,
  onChange,
  icon: Icon,
  prefix,
  type = "text",
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: any;
  prefix?: string;
  type?: "text" | "textarea";
  rows?: number;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const { resolvedColors: T } = useTheme();

  return (
    <div className="group space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider opacity-60 px-1">
        {label}
      </label>
      <div
        className={`relative flex items-center border rounded-xl transition-all duration-300 ${isFocused ? "ring-2 ring-offset-2 ring-offset-transparent shadow-lg" : ""}`}
        style={
          {
            background: T.boxBg,
            borderColor: isFocused ? T.accentColor : T.borderColor,
            boxShadow: isFocused ? `0 0 20px ${T.accentColor}15` : "none",
            "--tw-ring-color": `${T.accentColor}40`,
          } as any
        }
      >
        {prefix && (
          <span className="pl-3 text-sm opacity-40 font-mono">{prefix}</span>
        )}
        {Icon && <Icon size={16} className="ml-3 opacity-40" />}
        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={rows || 3}
            className="w-full bg-transparent p-3 text-sm outline-none resize-none"
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent p-3 text-sm outline-none"
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        )}
      </div>
    </div>
  );
}

// Modern card section
function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const { resolvedColors: T } = useTheme();

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{
              backgroundColor: T.accentColor + "15",
              color: T.accentColor,
            }}
          >
            <Icon size={18} />
          </div>
          <span className="text-sm font-bold tracking-tight">{title}</span>
        </div>
        {open ? (
          <ChevronUp size={16} className="opacity-40" />
        ) : (
          <ChevronDown size={16} className="opacity-40" />
        )}
      </button>
      {open && (
        <div
          className="p-4 pt-0 space-y-4 border-t"
          style={{ borderColor: T.borderColor + "40" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function Swatch({
  color,
  active,
  onClick,
  label,
}: {
  color: string;
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-300 hover:bg-white/5 ${active ? "ring-2" : ""}`}
      style={{ "--tw-ring-color": color } as any}
      title={label}
    >
      <div
        className="w-10 h-10 rounded-full shadow-inner border-2 border-white/10"
        style={{ background: color }}
      />
      <span className="text-[9px] font-bold opacity-60 uppercase tracking-tighter truncate w-full text-center">
        {label}
      </span>
    </button>
  );
}

export default function SettingsPage() {
  const {
    theme,
    resolvedColors: T,
    setMode,
    setSkin,
    setAccent,
    setBackgroundMode,
    resetTheme,
  } = useTheme();
  const { profile, updateProfile } = useProfile();
  const { userId, isLoaded, isSignedIn } = useClerkAuth();

  const [activeTab, setActiveTab] = useState<TabId>("theme");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  const bgModes: any[] = [
    "nebula",
    "constellation",
    "waves",
    "minimal",
    "holo",
  ];
  const skinPresets = Object.keys(darkSkins) as SkinPreset[];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const tab = TABS.find(
          (t) => t.shortcut.toLowerCase() === e.key.toLowerCase(),
        );
        if (tab) {
          e.preventDefault();
          setActiveTab(tab.id);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const showSaved = () => {
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  if (!isLoaded) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: T.bgColor }}
      >
        <Loader2 className="animate-spin" style={{ color: T.accentColor }} />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <PageShell title="Settings">
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div className="p-6 rounded-full bg-white/5">
            <Shield size={48} className="opacity-20" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Access Restricted</h1>
            <p className="text-sm opacity-60 max-w-xs mx-auto">
              Please sign in to configure your personal workspace and agent
              preferences.
            </p>
          </div>
          <Link href="/login" className="btn-primary">
            Sign In to Continue
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Settings"
      subtitle="Customize your experience, agents, and workspace environment."
    >
      <div className="max-w-[1600px] mx-auto px-4 py-2">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4 scrollbar-hide">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? "shadow-lg scale-105"
                    : "opacity-60 hover:opacity-100 hover:bg-white/5"
                }`}
                style={{
                  backgroundColor: isActive
                    ? T.accentColor + "15"
                    : "transparent",
                  borderColor: isActive ? T.accentColor : T.borderColor + "40",
                  color: isActive ? T.accentColor : T.textColor,
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-8 space-y-6">
            {/* THEME TAB */}
            {activeTab === "theme" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Section title="Appearance Skin" icon={Palette}>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {skinPresets.map((skin) => (
                      <Swatch
                        key={skin}
                        color={darkSkins[skin].accentColor}
                        active={theme.skin === skin}
                        onClick={() => {
                          setSkin(skin);
                          showSaved();
                        }}
                        label={skinLabels[skin]}
                      />
                    ))}
                  </div>
                </Section>

                <Section title="Accent Color" icon={Sparkles}>
                  <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
                    {Object.entries(accentHex).map(([id, hex]) => (
                      <Swatch
                        key={id}
                        color={hex}
                        active={theme.accent === id}
                        onClick={() => {
                          setAccent(id as any);
                          showSaved();
                        }}
                        label={id.split("-").join(" ")}
                      />
                    ))}
                  </div>
                </Section>

                <Section title="Background Engine" icon={Monitor}>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {bgModes.map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          setBackgroundMode(mode);
                          showSaved();
                        }}
                        className={`p-3 text-[10px] font-bold uppercase rounded-xl border transition-all duration-300 ${
                          theme.backgroundMode === mode
                            ? "ring-2"
                            : "opacity-60 hover:opacity-100 hover:bg-white/5"
                        }`}
                        style={
                          {
                            borderColor:
                              theme.backgroundMode === mode
                                ? T.accentColor
                                : T.borderColor + "40",
                            backgroundColor:
                              theme.backgroundMode === mode
                                ? T.accentColor + "10"
                                : "transparent",
                            color:
                              theme.backgroundMode === mode
                                ? T.accentColor
                                : T.textColor,
                            "--tw-ring-color": T.accentColor + "40",
                          } as any
                        }
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </Section>

                <Section title="Display Mode" icon={Sun}>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setMode("dark");
                        showSaved();
                      }}
                      className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
                        theme.mode === "dark"
                          ? "ring-2 shadow-lg"
                          : "opacity-60"
                      }`}
                      style={
                        {
                          borderColor:
                            theme.mode === "dark"
                              ? T.accentColor
                              : T.borderColor + "40",
                          backgroundColor:
                            theme.mode === "dark"
                              ? T.accentColor + "10"
                              : "transparent",
                          "--tw-ring-color": T.accentColor + "40",
                        } as any
                      }
                    >
                      <Moon size={18} /> <span className="font-bold">Dark</span>
                    </button>
                    <button
                      onClick={() => {
                        setMode("light");
                        showSaved();
                      }}
                      className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
                        theme.mode === "light"
                          ? "ring-2 shadow-lg"
                          : "opacity-60"
                      }`}
                      style={
                        {
                          borderColor:
                            theme.mode === "light"
                              ? T.accentColor
                              : T.borderColor + "40",
                          backgroundColor:
                            theme.mode === "light"
                              ? T.accentColor + "10"
                              : "transparent",
                          "--tw-ring-color": T.accentColor + "40",
                        } as any
                      }
                    >
                      <Sun size={18} /> <span className="font-bold">Light</span>
                    </button>
                  </div>
                </Section>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Section title="Personal Identity" icon={User}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field
                      label="Display Name"
                      value={profile.displayName}
                      onChange={(v) => updateProfile({ displayName: v })}
                      icon={User}
                    />
                    <Field
                      label="Username"
                      value={profile.username}
                      onChange={(v) => updateProfile({ username: v })}
                      prefix="@"
                    />
                  </div>
                  <Field
                    label="Biography"
                    value={profile.bio || ""}
                    onChange={(v) => updateProfile({ bio: v })}
                    type="textarea"
                    rows={4}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field
                      label="Location"
                      value={profile.location || ""}
                      onChange={(v) => updateProfile({ location: v })}
                      icon={MapPin}
                    />
                    <Field
                      label="Website"
                      value={profile.website || ""}
                      onChange={(v) => updateProfile({ website: v })}
                      icon={Globe}
                    />
                  </div>
                </Section>

                <Section title="Avatar & Branding" icon={Camera}>
                  <div className="flex items-center gap-6 p-4">
                    <div className="relative group">
                      <div
                        className="w-24 h-24 rounded-2xl overflow-hidden border-2"
                        style={{ borderColor: T.accentColor }}
                      >
                        {profile.avatarUrl ? (
                          <img
                            src={profile.avatarUrl}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            👤
                          </div>
                        )}
                      </div>
                      <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                        <Upload size={20} className="text-white" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold">Profile Picture</h4>
                      <p className="text-xs opacity-50">
                        Upload a 1:1 image for your agent profile.
                      </p>
                      <button
                        className="text-xs font-bold text-accent px-4 py-2 rounded-lg border"
                        style={{
                          borderColor: T.accentColor + "40",
                          color: T.accentColor,
                        }}
                      >
                        Change Avatar
                      </button>
                    </div>
                  </div>
                </Section>
              </div>
            )}

            {/* Other tabs placeholder... */}
            {(["agents", "interface", "music", "account"] as TabId[]).includes(
              activeTab,
            ) && (
              <div className="flex flex-col items-center justify-center py-32 opacity-20">
                <Loader2 size={48} />
                <span className="mt-4 font-bold uppercase tracking-widest">
                  Module under development
                </span>
              </div>
            )}
          </div>

          {/* Sidebar / Summary */}
          <div className="xl:col-span-4 space-y-6">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Activity size={18} className="text-green-500" />
                Live Preview
              </h3>

              <div className="space-y-4">
                <div
                  className="p-4 rounded-2xl border"
                  style={{
                    backgroundColor: T.boxBg,
                    borderColor: T.borderColor,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500" />
                    <div className="space-y-1">
                      <div className="h-3 w-24 rounded bg-white/20" />
                      <div className="h-2 w-16 rounded bg-white/10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded bg-white/10" />
                    <div className="h-2 w-4/5 rounded bg-white/10" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <div
                    className="h-10 flex-1 rounded-xl"
                    style={{ backgroundColor: T.accentColor }}
                  />
                  <div
                    className="h-10 flex-1 rounded-xl border"
                    style={{ borderColor: T.borderColor }}
                  />
                </div>
              </div>

              <div
                className="mt-8 pt-6 border-t space-y-4"
                style={{ borderColor: T.borderColor + "40" }}
              >
                <div className="flex justify-between text-xs">
                  <span className="opacity-50">Theme Skin</span>
                  <span
                    className="font-bold uppercase"
                    style={{ color: T.accentColor }}
                  >
                    {theme.skin}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="opacity-50">Accent</span>
                  <span
                    className="font-bold uppercase"
                    style={{ color: T.accentColor }}
                  >
                    {theme.accent}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="opacity-50">Status</span>
                  <span className="text-green-500 font-bold uppercase">
                    All Systems Optimal
                  </span>
                </div>
              </div>

              <button
                onClick={resetTheme}
                className="w-full mt-8 py-3 text-xs font-bold uppercase tracking-widest rounded-xl border border-dashed hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all duration-300 opacity-40 hover:opacity-100"
                style={{ borderColor: T.borderColor }}
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save Indicator */}
      {saveStatus === "saved" && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl bg-green-500 text-white shadow-2xl flex items-center gap-3 animate-fadeInUp">
          <Check size={18} />
          <span className="text-sm font-bold uppercase tracking-wider">
            Preferences Synced
          </span>
        </div>
      )}
    </PageShell>
  );
}
