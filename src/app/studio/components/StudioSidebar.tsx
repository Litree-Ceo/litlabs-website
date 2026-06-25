"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  Image,
  Film,
  Music,
  LayoutGrid,
  Bot,
  Rocket,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Terminal,
  Network,
  Shell,
  Layout,
  Layers,
  Cpu,
  Zap,
  Activity,
  Box,
} from "lucide-react";

export type StudioTool =
  | "image"
  | "video"
  | "audio"
  | "agents"
  | "terminal"
  | "pipeline"
  | "gallery"
  | "space"
  | "clibridge";

type ToolItem = {
  id: StudioTool;
  label: string;
  icon: any;
  shortcut: string;
};

const CREATE_TOOLS: ToolItem[] = [
  { id: "image", label: "Image Forge", icon: Image, shortcut: "1" },
  { id: "video", label: "Video Engine", icon: Film, shortcut: "2" },
  { id: "audio", label: "Audio Synthesis", icon: Music, shortcut: "3" },
];

const AI_TOOLS: ToolItem[] = [
  { id: "agents", label: "Neural Units", icon: Bot, shortcut: "4" },
  { id: "terminal", label: "Logic Kernel", icon: Terminal, shortcut: "5" },
  { id: "pipeline", label: "Workflow Node", icon: Network, shortcut: "6" },
  { id: "clibridge", label: "CLI Gateway", icon: Shell, shortcut: "0" },
];

const ORGANIZE_TOOLS: ToolItem[] = [
  { id: "gallery", label: "Asset Bucket", icon: LayoutGrid, shortcut: "7" },
];

const EXTERNAL_TOOLS: ToolItem[] = [
  { id: "space", label: "3D Spatial", icon: Box, shortcut: "8" },
];

function ToolGroup({
  title,
  tools,
  activeTool,
  onToolChange,
  collapsed,
  T,
}: {
  title: string;
  tools: ToolItem[];
  activeTool: StudioTool;
  onToolChange: (t: StudioTool) => void;
  collapsed: boolean;
  T: any;
}) {
  return (
    <div className="space-y-1">
      {!collapsed && (
        <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[.25em] opacity-30">
          {title}
        </div>
      )}
      <div className="px-2 space-y-0.5">
        {tools.map((tool) => {
          const active = activeTool === tool.id;
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id)}
              className={`group w-full flex items-center gap-3 rounded-xl transition-all duration-300 ${
                collapsed ? "justify-center p-3" : "px-4 py-2.5"
              } ${active ? "bg-white/10 shadow-lg" : "hover:bg-white/5 opacity-50 hover:opacity-100"}`}
              style={{
                color: active ? T.accentColor : T.textColor,
                borderColor: active ? T.accentColor + "20" : "transparent",
                borderWidth: "1px",
              }}
              title={collapsed ? tool.label : undefined}
            >
              <Icon
                size={collapsed ? 20 : 18}
                className={`transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}
                strokeWidth={active ? 2.5 : 2}
              />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="text-[12px] font-bold truncate tracking-tight">
                    {tool.label}
                  </span>
                  <span className="text-[9px] font-mono opacity-20 group-hover:opacity-40 ml-2">
                    {tool.shortcut}
                  </span>
                </div>
              )}
              {active && !collapsed && (
                <div
                  className="w-1 h-4 rounded-full bg-current"
                  style={{ backgroundColor: T.accentColor }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function StudioSidebar({
  activeTool,
  onToolChange,
}: {
  activeTool: StudioTool;
  onToolChange: (tool: StudioTool) => void;
}) {
  const { resolvedColors: T } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed bottom-6 right-6 z-50 lg:hidden w-12 h-12 rounded-full bg-indigo-500 text-white shadow-2xl flex items-center justify-center transition-transform active:scale-95"
      >
        {mobileOpen ? <ChevronRight size={24} /> : <Layers size={24} />}
      </button>

      <aside
        className={`flex flex-col h-full shrink-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] fixed lg:relative z-40 border-r border-white/5 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          width: collapsed ? "80px" : "260px",
          backgroundColor: T.bgColor,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 h-16 border-b border-white/5">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Zap size={18} className="text-indigo-500" />
              </div>
              <span className="font-black text-xs uppercase tracking-[0.2em] opacity-80">
                Studio Core
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg hover:bg-white/5 transition-all ${collapsed ? "mx-auto" : ""}`}
            style={{ color: T.textMuted }}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Scroll Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 space-y-8 scrollbar-hide">
          <ToolGroup
            title="Creation"
            tools={CREATE_TOOLS}
            activeTool={activeTool}
            onToolChange={onToolChange}
            collapsed={collapsed}
            T={T}
          />
          <ToolGroup
            title="Neural Engines"
            tools={AI_TOOLS}
            activeTool={activeTool}
            onToolChange={onToolChange}
            collapsed={collapsed}
            T={T}
          />
          <ToolGroup
            title="Discovery"
            tools={ORGANIZE_TOOLS}
            activeTool={activeTool}
            onToolChange={onToolChange}
            collapsed={collapsed}
            T={T}
          />
          <ToolGroup
            title="Environment"
            tools={EXTERNAL_TOOLS}
            activeTool={activeTool}
            onToolChange={onToolChange}
            collapsed={collapsed}
            T={T}
          />
        </div>

        {/* Footer Status */}
        <div className="p-4 border-t border-white/5 bg-white/[0.02]">
          <div
            className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
          >
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-80">
                  Node Operational
                </div>
                <div className="text-[9px] font-bold opacity-30 truncate">
                  latency: 24ms • v2.0.1
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
