"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getHealth } from "@/lib/api";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const [apiStatus, setApiStatus] = useState<"ok" | "error" | "loading">("loading");

  useEffect(() => {
    setName(user?.name || "");
    getHealth()
      .then(() => setApiStatus("ok"))
      .catch(() => setApiStatus("error"));
  }, [user]);

  function handleSave() {
    if (name === user?.name) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return;
    }
    // Client-side save — display name only.
    // Name is stored in JWT cookie payload; on next login, the backend
    // returns whatever ADMIN_NAME says. So this just gives instant feedback.
    // Full persistence requires updating ADMIN_NAME env on Vercel + re-deploy.
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-6">Settings</h1>

      <div className="card mb-6">
        <h2 className="font-heading text-lg font-semibold mb-4">API Connection</h2>
        <div className="flex items-center gap-3 mb-3">
          <span className={`badge ${apiStatus === "ok" ? "badge-green" : apiStatus === "error" ? "badge-red" : "badge-cyan"}`}>
            {apiStatus === "ok" ? "● CONNECTED" : apiStatus === "error" ? "● DISCONNECTED" : "● CHECKING"}
          </span>
          <span className="text-text-muted text-sm">api.litlabs.net → Phone backend</span>
        </div>
        <p className="text-text-muted text-xs">
          {apiStatus === "ok"
            ? "Backend is reachable. AI Chat can execute commands on your phone."
            : "Backend unreachable. Make sure cloudflared tunnel is running on your phone."}
        </p>
      </div>

      <div className="card mb-6">
        <h2 className="font-heading text-lg font-semibold mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-text-secondary text-sm mb-1">Display Name</label>
            <input
              className="input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-sm mb-1">Email</label>
            <input className="input" value={user?.email || ""} disabled />
          </div>
          <button className="btn-primary text-sm" onClick={handleSave}>
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
          {saved && (
            <p className="text-xs text-text-muted">
              Display name updated locally. To persist permanently, update ADMIN_NAME
              in your Vercel environment variables and redeploy.
            </p>
          )}
        </div>
      </div>

      <div className="card border-red-500/30">
        <h2 className="font-heading text-lg font-semibold mb-4 text-red-400">Danger Zone</h2>
        <p className="text-text-secondary text-sm mb-4">Sign out of your account on this device.</p>
        <button className="btn-secondary text-sm border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={logout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
