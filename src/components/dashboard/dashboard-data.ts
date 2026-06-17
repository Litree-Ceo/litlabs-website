import {
  Home,
  Zap,
  Sparkles,
  ShoppingBag,
  Gamepad2,
  Music,
  Radio,
  Clapperboard,
  Wrench,
  Image as ImageIcon,
  Mic,
  FileText,
} from "lucide-react";

export type IconComponent = React.ComponentType<{
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}>;

export const APPS = [
  { id: "home", label: "Home", icon: Home, color: "#00f0ff", href: "/" },
  {
    id: "studio",
    label: "Studio",
    icon: Zap,
    color: "#00f0ff",
    href: "/studio",
  },
  {
    id: "gallery",
    label: "Gallery",
    icon: Sparkles,
    color: "#ff00a0",
    href: "/gallery",
  },
  {
    id: "market",
    label: "Market",
    icon: ShoppingBag,
    color: "#ff9ff3",
    href: "/marketplace",
  },
  { id: "music", label: "Music", icon: Music, color: "#ff2d78", href: "#" },
  {
    id: "games",
    label: "Games",
    icon: Gamepad2,
    color: "#8b5cf6",
    href: "/games",
  },
  {
    id: "watch",
    label: "Watch",
    icon: Clapperboard,
    color: "#3b82f6",
    href: "#",
  },
  { id: "radio", label: "Radio", icon: Radio, color: "#10b981", href: "#" },
  { id: "tools", label: "Tools", icon: Wrench, color: "#f59e0b", href: "#" },
];

export const AGENTS = [
  {
    name: "Code Champ",
    status: "online" as const,
    task: "Load tests",
    color: "#00f0ff",
  },
  {
    name: "Data Slayer",
    status: "working" as const,
    task: "Profiling",
    color: "#ff00a0",
  },
  {
    name: "Director",
    status: "idle" as const,
    task: "Orchestration",
    color: "#00ff41",
  },
];

export const CREATORS = [
  { name: "Alex Chen", handle: "@alexchen", color: "#00f0ff" },
  { name: "Sarah K.", handle: "@sarahk", color: "#ff00a0" },
  { name: "Mike Dev", handle: "@mikedev", color: "#ff9ff3" },
];

export const GAMES = [
  { title: "Neon Racer", genre: "Arcade", color: "#ff00a0", players: "2.4k" },
  {
    title: "Agent Arena",
    genre: "Strategy",
    color: "#00f0ff",
    players: "1.8k",
  },
  { title: "Synth Maze", genre: "Puzzle", color: "#8b5cf6", players: "980" },
  { title: "Cyber Drift", genre: "Racing", color: "#ff9ff3", players: "3.1k" },
];

export const WATCH = [
  {
    title: "Agent Setup Guide",
    channel: "LiTree Labs",
    views: "12k",
    color: "#ff00a0",
  },
  {
    title: "Studio Deep Dive",
    channel: "LiTree Labs",
    views: "8.5k",
    color: "#00f0ff",
  },
  {
    title: "Creator Spotlight #04",
    channel: "Community",
    views: "4.2k",
    color: "#8b5cf6",
  },
];

export const RADIO = [
  {
    title: "Synthwave FM",
    genre: "Synthwave",
    listeners: 342,
    color: "#ff00a0",
  },
  { title: "Lo-Fi Lounge", genre: "Lo-Fi", listeners: 891, color: "#00f0ff" },
  {
    title: "Cyber Beats",
    genre: "Darksynth",
    listeners: 156,
    color: "#8b5cf6",
  },
  { title: "Focus Flow", genre: "Ambient", listeners: 620, color: "#10b981" },
];

export const TOOLS = [
  {
    title: "Prompt Vault",
    desc: "Saved prompts & styles",
    icon: FileText,
    color: "#f59e0b",
  },
  {
    title: "Asset Locker",
    desc: "Images, audio & projects",
    icon: ImageIcon,
    color: "#00f0ff",
  },
  {
    title: "Quick Notes",
    desc: "Scratchpad & ideas",
    icon: Mic,
    color: "#ff00a0",
  },
  {
    title: "Batch Gen",
    desc: "Multi-run generations",
    icon: Zap,
    color: "#8b5cf6",
  },
];
