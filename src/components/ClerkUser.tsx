"use client";

import { useUser, UserButton } from "@clerk/nextjs";

type Props = {
  compact?: boolean;
};

export function ClerkUserWidget({ compact }: Props) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (compact) {
    return user ? <UserButton afterSignOutUrl="/" /> : null;
  }

  const displayName = user?.firstName || user?.username || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {user?.imageUrl ? (
        <img
          src={user.imageUrl}
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
          {user?.primaryEmailAddress?.emailAddress}
        </div>
      </div>
    </div>
  );
}
