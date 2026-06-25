"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type NavAuthProps = {
  linkColor?: string;
};

function useCustomSession() {
  const [session, setSession] = useState<{ user?: { id?: string; name?: string | null } } | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { setSession(data); setLoaded(true); })
      .catch(() => { setSession(null); setLoaded(true); });
  }, []);
  return { session, loaded };
}

export function NavAuth({ linkColor = "#6366f1" }: NavAuthProps) {
  const { session, loaded } = useCustomSession();

  if (!loaded) {
    return (
      <div className="rounded-full animate-pulse" style={{ width: 28, height: 28, backgroundColor: linkColor + "20", border: `1px solid ${linkColor}40` }} />
    );
  }

  if (session?.user) {
    const name = session.user.name || "User";
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-bold truncate max-w-[80px]" style={{ color: linkColor }}>{name}</span>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black cursor-pointer hover:opacity-80 transition-opacity"
            style={{ backgroundColor: linkColor + "20", color: linkColor, border: `1px solid ${linkColor}40` }} title="Sign out">
            ✕
          </button>
        </form>
      </div>
    );
  }

  return (
    <Link href="/sign-in">
      <button className="px-3.5 py-1.5 rounded-md text-[11px] font-bold cursor-pointer transition-all hover:opacity-90"
        style={{ backgroundColor: linkColor, color: "#fff", letterSpacing: "0.05em" }}>
        Sign In
      </button>
    </Link>
  );
}
