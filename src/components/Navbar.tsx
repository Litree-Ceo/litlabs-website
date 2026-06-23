"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { useClerkAuth } from "@/hooks/useClerkAuth";
import { useSessionAuth } from "@/hooks/useSessionAuth";
import dynamic from "next/dynamic";
import {
  Home,
  ShoppingBag,
  Sparkles,
  Settings,
  Sun,
  Moon,
  Zap,
  Bot,
  ChevronDown,
  X,
  Menu,
  Bell,
  Coins,
  User,
  Gamepad as GamepadIcon,
  Code2,
  Layout,
  Search,
  Command,
} from "lucide-react";

const NavAuth = dynamic(
  () => import("@/components/ClerkAuth").then((m) => ({ default: m.NavAuth })),
  { ssr: false },
);

const navLinks = [
  { href: "/", label: "Dashboard", icon: Layout },
  { href: "/studio", label: "Studio", icon: Zap },
  { href: "/gallery", label: "Gallery", icon: Sparkles },
  { href: "/agent", label: "Jarvis", icon: Bot },
  { href: "/marketplace", label: "Market", icon: ShoppingBag },
  { href: "/games", label: "Play", icon: GamepadIcon },
];

const userLinks = [
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/settings", label: "System Config", icon: Settings },
  { href: "/code", label: "Scanner", icon: Code2 },
  { href: "/showcase", label: "Showcase", icon: Sparkles },
];

function WalletBadge({ accentColor }: { accentColor: string }) {
  const [balance, setBalance] = useState<number | null>(null);
  useEffect(() => {
    fetch("/api/wallet")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.balance !== undefined) setBalance(data.balance);
      })
      .catch(() => setBalance(null));
  }, []);
  return (
    <div
      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105"
      style={{
        backgroundColor: accentColor + "15",
        color: accentColor,
        border: `1px solid ${accentColor}30`,
      }}
      title="LiTBit Balance"
    >
      <Coins size={14} />
      <span>{balance === null ? "—" : balance.toLocaleString()}</span>
    </div>
  );
}

function useLocalStorageNumber(key: string, fallback: number) {
  const [val, setVal] = useState(fallback);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setVal(Number(raw));
    } catch {}
  }, [key]);
  return val;
}

export default function Navbar() {
  const { resolvedColors: T, setMode, theme } = useTheme();
  const { profile } = useProfile();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const { isLoaded: clerkLoaded, isSignedIn: clerkSignedIn } = useClerkAuth();
  const { isLoaded: sessionLoaded, isSignedIn: sessionSignedIn } =
    useSessionAuth();
  const authLoaded = clerkLoaded || sessionLoaded;
  const isSignedIn = clerkSignedIn || sessionSignedIn;

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname?.startsWith(path);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node))
        setUserOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav
      className="sticky top-0 z-[60] w-full backdrop-blur-xl border-b transition-all duration-300"
      style={{
        backgroundColor: T.bgColor + "cc",
        borderColor: T.borderColor + "40",
      }}
    >
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div
                className="relative w-9 h-9 rounded-xl overflow-hidden transition-all duration-500 group-hover:scale-110 shadow-lg"
                style={{ border: `2px solid ${T.accentColor}40` }}
              >
                <Image
                  src="/logo.png"
                  alt="LiTree"
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
              </div>
              <div className="hidden md:flex flex-col">
                <span
                  className="font-black text-lg tracking-tight leading-none"
                  style={{ color: T.textColor }}
                >
                  LiTree Lab
                </span>
                <span
                  className="text-[10px] font-bold tracking-[.25em] uppercase opacity-40"
                  style={{ color: T.textMuted }}
                >
                  Studios
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative flex items-center gap-2 px-4 py-2 text-[13px] font-bold rounded-xl transition-all duration-300 group"
                    style={{
                      color: active ? T.accentColor : T.textColor,
                      backgroundColor: active
                        ? T.accentColor + "10"
                        : "transparent",
                    }}
                  >
                    <Icon
                      size={16}
                      className={`transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110 opacity-60"}`}
                    />
                    <span
                      className={
                        active ? "" : "opacity-70 group-hover:opacity-100"
                      }
                    >
                      {link.label}
                    </span>
                    {active && (
                      <span
                        className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full"
                        style={{ backgroundColor: T.accentColor }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Section Actions */}
          <div className="flex items-center gap-3">
            {/* Search Button (UI Only) */}
            <button className="p-2.5 rounded-xl hover:bg-white/5 opacity-60 transition-all hidden sm:flex">
              <Search size={18} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setMode(theme.mode === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl hover:bg-white/5 transition-all"
              style={{ color: T.textMuted }}
            >
              {theme.mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Wallet & Auth */}
            {authLoaded && isSignedIn && (
              <WalletBadge accentColor={T.accentColor} />
            )}

            <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />

            <div className="relative flex items-center">
              <NavAuth />
            </div>

            {/* Mobile Hamburger */}
            <button
              ref={hamburgerRef}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-white/5 transition-all"
              style={{ color: T.textColor }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-fadeIn">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute top-0 right-0 bottom-0 w-[280px] p-6 shadow-2xl flex flex-col gap-8 animate-slideInRight"
            style={{
              backgroundColor: T.bgColor,
              borderLeft: `1px solid ${T.borderColor}40`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-lg">Menu</span>
              <button onClick={() => setMobileOpen(false)}>
                <X />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl font-bold transition-all active:scale-95"
                  style={{
                    backgroundColor: isActive(link.href)
                      ? T.accentColor + "15"
                      : "transparent",
                    color: isActive(link.href) ? T.accentColor : T.textColor,
                  }}
                >
                  <link.icon size={20} />
                  {link.label}
                </Link>
              ))}
            </div>

            <div
              className="mt-auto pt-6 border-t"
              style={{ borderColor: T.borderColor + "20" }}
            >
              <div className="flex flex-col gap-2">
                {userLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 p-3 text-sm opacity-70 hover:opacity-100"
                  >
                    <link.icon size={16} />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
