"use client";

import { useState, useEffect } from "react";

type Props = {
  compact?: boolean;
};

type UserData = {
  id: string;
  email?: string;
  name?: string | null;
  avatar_url?: string | null;
};

export function ClerkUserWidget({ compact }: Props) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  if (compact) {
    return user ? (
      <form action="/api/auth/logout" method="POST">
        <button type="submit" className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: "rgba(255,0,128,0.2)", color: "#ff0080", border: "1px solid rgba(255,0,128,0.4)" }} title="Sign out">
          ✕
        </button>
      </form>
    ) : null;
  }

  const displayName = user?.name || "User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const email = user?.email || "";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt="Profile"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "4px",
            border: "2px solid #ff0080",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "4px",
            border: "2px solid #ff0080",
            backgroundColor: "rgba(255,0,128,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#ff0080",
          }}
        >
          {initials}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: "#00ffff",
            fontSize: "12px",
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {displayName}
        </div>
        <div style={{ color: "#ffff00", fontSize: "9px" }}>● ONLINE NOW</div>
        <div
          style={{
            color: "#00ff41",
            fontSize: "9px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {email}
        </div>
      </div>
    </div>
  );
}
