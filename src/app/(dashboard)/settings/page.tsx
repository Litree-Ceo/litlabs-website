"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

/* ─── Types ─── */
type Section =
  | "overview"
  | "profile"
  | "account"
  | "integrations"
  | "appearance"
  | "notifications"
  | "billing"
  | "danger";

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
}

/* ─── Config ─── */
const SECTIONS: { id: Section; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "◈" },
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "account", label: "Account", icon: "🔐" },
  { id: "integrations", label: "API & Integrations", icon: "🔗" },
  { id: "appearance", label: "Appearance", icon: "🎨" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "billing", label: "Billing", icon: "💳" },
  { id: "danger", label: "Danger Zone", icon: "⚠" },
];

const AVATAR_EMOJIS = ["🤖", "👾", "🦾", "🧠", "⚡", "🔥", "💎", "🚀", "🌟", "🎯", "🛡", "🎮"];

const ACCENT_COLORS = [
  { id: "cyan", label: "Cyan", var: "var(--neon-cyan)", hex: "#00f2fe" },
  { id: "purple", label: "Purple", var: "var(--neon-purple)", hex: "#9b51e0" },
  { id: "gold", label: "Gold", var: "var(--neon-gold)", hex: "#ffd700" },
  { id: "green", label: "Green", var: "#00ff88", hex: "#00ff88" },
  { id: "red", label: "Red", var: "#ff5050", hex: "#ff5050" },
];

const INTEGRATIONS = [
  { id: "discord", name: "Discord", icon: "💬", connected: false },
  { id: "telegram", name: "Telegram", icon: "✈️", connected: false },
  { id: "email", name: "Email", icon: "📧", connected: false },
  { id: "twitter", label: "X / Twitter", icon: "🐦", connected: false },
];

/* ─── Helpers ─── */
function getInitial(name?: string | null, email?: string): string {
  if (name) return name.charAt(0).toUpperCase();
  if (email) return email.charAt(0).toUpperCase();
  return "?";
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Unknown";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Unknown";
  }
}

/* ─── Main Component ─── */
export default function SettingsPage() {
  const { user, logout } = useAuth();

  /* ── Hash-based section navigation ── */
  const [activeSection, setActiveSection] = useState<Section>("overview");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as Section;
    if (SECTIONS.some((s) => s.id === hash)) {
      setActiveSection(hash);
    }
  }, []);

  const navigateTo = useCallback((section: Section) => {
    setActiveSection(section);
    window.location.hash = section;
  }, []);

  /* ── Toast state ── */
  const [toast, setToast] = useState<ToastState>({ message: "", type: "success", visible: false });

  const showToast = useCallback((message: string, type: ToastState["type"] = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  /* ── Profile state ── */
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [avatarEmoji, setAvatarEmoji] = useState("🤖");
  const [bio, setBio] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    setDisplayName(user?.name || "");
  }, [user?.name]);

  async function handleSaveProfile() {
    setProfileSaving(true);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: displayName, avatarEmoji, bio }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save profile");
      }
      showToast("Profile updated successfully!");
    } catch (err) {
      const msg = (err as Error)?.message || "Unknown";
      showToast(msg, "error");
    } finally {
      setProfileSaving(false);
    }
  }

  /* ── Account / Password state ── */
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }
    setPasswordSaving(true);
    try {
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to change password");
      }
      showToast("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = (err as Error)?.message || "Unknown";
      showToast(msg, "error");
    } finally {
      setPasswordSaving(false);
    }
  }

  /* ── Integrations state ── */
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState("");
  const [customWebhookUrl, setCustomWebhookUrl] = useState("");

  /* ── Appearance state ── */
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [accentColor, setAccentColor] = useState("cyan");
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [appearanceSaving, setAppearanceSaving] = useState(false);

  async function handleSaveAppearance() {
    setAppearanceSaving(true);
    try {
      const res = await fetch("/api/settings/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, accentColor, fontSize }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save preferences");
      }
      showToast("Appearance preferences saved!");
    } catch (err) {
      const msg = (err as Error)?.message || "Unknown";
      showToast(msg, "error");
    } finally {
      setAppearanceSaving(false);
    }
  }

  /* ── Notifications state ── */
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifAgent, setNotifAgent] = useState(true);
  const [notifArena, setNotifArena] = useState(true);
  const [notifSocial, setNotifSocial] = useState(false);
  const [notifDigest, setNotifDigest] = useState(true);
  const [notifSaving, setNotifSaving] = useState(false);

  async function handleSaveNotifications() {
    setNotifSaving(true);
    try {
      const res = await fetch("/api/settings/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notifications: {
            email: notifEmail,
            push: notifPush,
            agentResponses: notifAgent,
            arenaResults: notifArena,
            socialMentions: notifSocial,
            weeklyDigest: notifDigest,
          },
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save notifications");
      }
      showToast("Notification preferences saved!");
    } catch (err) {
      const msg = (err as Error)?.message || "Unknown";
      showToast(msg, "error");
    } finally {
      setNotifSaving(false);
    }
  }

  /* ── Danger zone state ── */
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleDeleteAccount() {
    if (deleteConfirm !== "DELETE") {
      showToast('Type "DELETE" to confirm account deletion', "error");
      return;
    }
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Account deletion not available yet");
      }
      showToast("Account deleted. Redirecting...", "info");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      const msg = (err as Error)?.message || "Unknown";
      showToast(msg, "error");
    } finally {
      setDeleteLoading(false);
    }
  }

  /* ── Render ── */
  return (
    <div className="max-w-7xl mx-auto">
      {/* Toast */}
      <div
        className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
          toast.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div
          className={`card text-sm font-medium ${
            toast.type === "success"
              ? "border-green-500/30 text-green-400"
              : toast.type === "error"
              ? "border-red-500/30 text-red-400"
              : "border-cyan-500/30 text-cyan-400"
          }`}
        >
          {toast.type === "success" ? "✓ " : toast.type === "error" ? "✗ " : "ℹ "}
          {toast.message}
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold gradient-text">Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Manage your account, preferences, and integrations</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ─── Sidebar Navigation ─── */}
        {/* Desktop: vertical sidebar */}
        <nav className="hidden lg:block w-64 shrink-0">
          <div className="card p-2 sticky top-6">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => navigateTo(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm transition-all ${
                  activeSection === section.id
                    ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20"
                    : "text-text-secondary hover:bg-cyber-surface-2 hover:text-text-primary border border-transparent"
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
                {section.id === "danger" && (
                  <span className="ml-auto badge badge-red text-[10px]">CAUTION</span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile: horizontal scrollable tabs */}
        <nav className="lg:hidden -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-2 pb-2 min-w-max">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => navigateTo(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20"
                    : "bg-cyber-surface text-text-secondary border border-cyber-border hover:border-cyber-border/60"
                }`}
              >
                <span>{section.icon}</span>
                <span className="hidden sm:inline">{section.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* ─── Content Area ─── */}
        <div className="flex-1 min-w-0">
          {/* ─── OVERVIEW ─── */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              {/* User Card */}
              <div className="card bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 border-neon-cyan/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-cyber-surface-2 border-2 border-neon-cyan/30 flex items-center justify-center text-2xl">
                    {avatarEmoji}
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-text-primary">
                      {displayName || user?.email?.split("@")[0] || "User"}
                    </h2>
                    <p className="text-text-secondary text-sm">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="badge badge-gold">FREE PLAN</span>
                      <span className="text-text-muted text-xs">
                        Member since {formatDate(user?.id ? "2025-01-15" : undefined)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-cyber-surface rounded-lg p-4 text-center">
                    <div className="font-code text-2xl font-bold text-neon-cyan">12</div>
                    <div className="text-text-muted text-xs mt-1">Agents Created</div>
                  </div>
                  <div className="bg-cyber-surface rounded-lg p-4 text-center">
                    <div className="font-code text-2xl font-bold text-neon-purple">1,847</div>
                    <div className="text-text-muted text-xs mt-1">Messages Sent</div>
                  </div>
                  <div className="bg-cyber-surface rounded-lg p-4 text-center">
                    <div className="font-code text-2xl font-bold text-neon-gold">3</div>
                    <div className="text-text-muted text-xs mt-1">Arena Entries</div>
                  </div>
                </div>
              </div>

              {/* Quick Settings */}
              <div className="card">
                <h3 className="font-heading text-base font-semibold mb-4">Quick Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-cyber-border">
                    <div>
                      <div className="text-sm font-medium">Theme</div>
                      <div className="text-xs text-text-muted">Current: Dark</div>
                    </div>
                    <span className="badge badge-cyan">DARK</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-cyber-border">
                    <div>
                      <div className="text-sm font-medium">Email Notifications</div>
                      <div className="text-xs text-text-muted">Receive updates via email</div>
                    </div>
                    <span className={`badge ${notifEmail ? "badge-green" : "badge-red"}`}>
                      {notifEmail ? "ON" : "OFF"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="text-sm font-medium">API Status</div>
                      <div className="text-xs text-text-muted">Backend connection</div>
                    </div>
                    <span className="badge badge-green">● CONNECTED</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── PROFILE ─── */}
          {activeSection === "profile" && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-heading text-base font-semibold mb-6">Profile Information</h3>

                {/* Avatar Picker */}
                <div className="mb-6">
                  <label className="block text-text-secondary text-sm mb-2">Avatar</label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setAvatarEmoji(emoji)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
                          avatarEmoji === emoji
                            ? "bg-neon-cyan/20 border-2 border-neon-cyan"
                            : "bg-cyber-surface-2 border border-cyber-border hover:border-neon-cyan/30"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Display Name */}
                <div className="mb-4">
                  <label className="block text-text-secondary text-sm mb-1">Display Name</label>
                  <input
                    className="input"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                  />
                </div>

                {/* Email (readonly) */}
                <div className="mb-4">
                  <label className="block text-text-secondary text-sm mb-1">Email</label>
                  <input className="input opacity-60" value={user?.email || ""} disabled />
                  <p className="text-text-muted text-xs mt-1">Email cannot be changed</p>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <label className="block text-text-secondary text-sm mb-1">Bio</label>
                  <textarea
                    className="input min-h-[100px] resize-y"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    maxLength={200}
                  />
                  <p className="text-text-muted text-xs mt-1">{bio.length}/200 characters</p>
                </div>

                <button
                  className="btn-primary text-sm"
                  onClick={handleSaveProfile}
                  disabled={profileSaving}
                >
                  {profileSaving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          )}

          {/* ─── ACCOUNT ─── */}
          {activeSection === "account" && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-heading text-base font-semibold mb-6">Change Password</h3>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-text-secondary text-sm mb-1">Current Password</label>
                    <input
                      type="password"
                      className="input"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-text-secondary text-sm mb-1">New Password</label>
                    <input
                      type="password"
                      className="input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-text-secondary text-sm mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      className="input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>

                  <button
                    className="btn-primary text-sm"
                    onClick={handleChangePassword}
                    disabled={passwordSaving}
                  >
                    {passwordSaving ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </div>

              <div className="card">
                <h3 className="font-heading text-base font-semibold mb-4">Account Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-cyber-border">
                    <span className="text-text-secondary text-sm">Account ID</span>
                    <span className="font-code text-xs text-text-muted">{user?.id || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-cyber-border">
                    <span className="text-text-secondary text-sm">Email</span>
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-text-secondary text-sm">Account Created</span>
                    <span className="text-sm text-text-muted">
                      {formatDate(user?.id ? "2025-01-15" : undefined)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── API & INTEGRATIONS ─── */}
          {activeSection === "integrations" && (
            <div className="space-y-6">
              {/* n8n Webhook */}
              <div className="card">
                <h3 className="font-heading text-base font-semibold mb-4">n8n Webhook URL</h3>
                <p className="text-text-muted text-sm mb-4">
                  Configure your n8n webhook endpoint for automated agent workflows.
                </p>
                <input
                  className="input mb-2"
                  value={n8nWebhookUrl}
                  onChange={(e) => setN8nWebhookUrl(e.target.value)}
                  placeholder="https://your-n8n-instance.com/webhook/..."
                />
                <p className="text-text-muted text-xs">
                  Set N8N_WEBHOOK_URL in your environment variables, or enter above.
                </p>
              </div>

              {/* Custom Webhook */}
              <div className="card">
                <h3 className="font-heading text-base font-semibold mb-4">Custom Webhook</h3>
                <p className="text-text-muted text-sm mb-4">
                  Receive agent events on your own endpoint.
                </p>
                <input
                  className="input"
                  value={customWebhookUrl}
                  onChange={(e) => setCustomWebhookUrl(e.target.value)}
                  placeholder="https://your-server.com/api/webhook"
                />
              </div>

              {/* Integrations */}
              <div className="card">
                <h3 className="font-heading text-base font-semibold mb-4">Connected Services</h3>
                <div className="space-y-3">
                  {INTEGRATIONS.map((integration) => (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between py-3 border-b border-cyber-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{integration.icon}</span>
                        <div>
                          <div className="text-sm font-medium">{integration.name}</div>
                          <div className="text-xs text-text-muted">
                            {integration.connected ? "Connected" : "Not connected"}
                          </div>
                        </div>
                      </div>
                      <button
                        className="btn-secondary text-xs opacity-50 cursor-not-allowed"
                        disabled
                        title="Coming Soon"
                      >
                        {integration.connected ? "Disconnect" : "Connect"}
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-text-muted text-xs mt-4">
                  🚀 Integration connections coming soon. Stay tuned!
                </p>
              </div>
            </div>
          )}

          {/* ─── APPEARANCE ─── */}
          {activeSection === "appearance" && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-heading text-base font-semibold mb-6">Appearance Settings</h3>

                {/* Theme */}
                <div className="mb-6">
                  <label className="block text-text-secondary text-sm mb-2">Theme</label>
                  <div className="flex gap-2">
                    {(["dark", "light", "system"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          theme === t
                            ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30"
                            : "bg-cyber-surface-2 text-text-secondary border border-cyber-border hover:border-cyber-border/60"
                        }`}
                      >
                        {t === "dark" ? "🌙 Dark" : t === "light" ? "☀️ Light" : "💻 System"}
                      </button>
                    ))}
                  </div>
                  {theme !== "dark" && (
                    <p className="text-text-muted text-xs mt-2">
                      Only Dark theme is fully supported. Other themes coming soon.
                    </p>
                  )}
                </div>

                {/* Accent Color */}
                <div className="mb-6">
                  <label className="block text-text-secondary text-sm mb-2">Accent Color</label>
                  <div className="flex gap-3">
                    {ACCENT_COLORS.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setAccentColor(color.id)}
                        className={`w-10 h-10 rounded-full transition-all ${
                          accentColor === color.id
                            ? "ring-2 ring-offset-2 ring-offset-cyber-surface scale-110"
                            : "hover:scale-105"
                        }`}
                        style={{
                          backgroundColor: color.hex,
                          outlineColor: accentColor === color.id ? color.hex : undefined,
                        }}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div className="mb-6">
                  <label className="block text-text-secondary text-sm mb-2">Font Size</label>
                  <div className="flex gap-2">
                    {(["sm", "md", "lg"] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          fontSize === size
                            ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30"
                            : "bg-cyber-surface-2 text-text-secondary border border-cyber-border hover:border-cyber-border/60"
                        }`}
                      >
                        {size === "sm" ? "A" : size === "md" ? "A" : "A"}
                        <span className={`ml-1 ${size === "sm" ? "text-xs" : size === "lg" ? "text-lg" : "text-sm"}`}>
                          {size.toUpperCase()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="btn-primary text-sm"
                  onClick={handleSaveAppearance}
                  disabled={appearanceSaving}
                >
                  {appearanceSaving ? "Saving..." : "Save Appearance"}
                </button>
              </div>
            </div>
          )}

          {/* ─── NOTIFICATIONS ─── */}
          {activeSection === "notifications" && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-heading text-base font-semibold mb-6">Notification Preferences</h3>

                <div className="space-y-4">
                  {[
                    {
                      label: "Email Notifications",
                      desc: "Receive account and security emails",
                      value: notifEmail,
                      setter: setNotifEmail,
                    },
                    {
                      label: "Browser Push",
                      desc: "Show push notifications in your browser",
                      value: notifPush,
                      setter: setNotifPush,
                    },
                    {
                      label: "Agent Responses",
                      desc: "Get notified when agents finish responding",
                      value: notifAgent,
                      setter: setNotifAgent,
                    },
                    {
                      label: "Arena Results",
                      desc: "Notifications about arena competition results",
                      value: notifArena,
                      setter: setNotifArena,
                    },
                    {
                      label: "Social Mentions",
                      desc: "When someone mentions you in Social Hub",
                      value: notifSocial,
                      setter: setNotifSocial,
                    },
                    {
                      label: "Weekly Digest",
                      desc: "Summary of your activity every week",
                      value: notifDigest,
                      setter: setNotifDigest,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3 border-b border-cyber-border last:border-0"
                    >
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-text-muted">{item.desc}</div>
                      </div>
                      <button
                        onClick={() => item.setter(!item.value)}
                        className={`relative w-12 h-6 rounded-full transition-all ${
                          item.value ? "bg-neon-cyan/30" : "bg-cyber-surface-2"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${
                            item.value
                              ? "left-6 bg-neon-cyan shadow-[0_0_8px_var(--neon-cyan)]"
                              : "left-0.5 bg-text-muted"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  className="btn-primary text-sm mt-6"
                  onClick={handleSaveNotifications}
                  disabled={notifSaving}
                >
                  {notifSaving ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </div>
          )}

          {/* ─── BILLING ─── */}
          {activeSection === "billing" && (
            <div className="space-y-6">
              {/* Current Plan */}
              <div className="card bg-gradient-to-br from-neon-gold/5 to-neon-purple/5 border-neon-gold/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-base font-semibold">Current Plan</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="badge badge-gold text-sm">FREE</span>
                      <span className="text-text-muted text-xs">$0/month</span>
                    </div>
                  </div>
                  <button className="btn-primary text-sm">Upgrade to Pro</button>
                </div>

                {/* Usage */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-secondary">Messages this month</span>
                    <span className="text-text-muted">47 / 100</span>
                  </div>
                  <div className="w-full h-2 bg-cyber-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
                      style={{ width: "47%" }}
                    />
                  </div>
                  <p className="text-text-muted text-xs mt-2">
                    Resets on the 1st of each month. Upgrade for unlimited messages.
                  </p>
                </div>
              </div>

              {/* Feature Comparison */}
              <div className="card">
                <h3 className="font-heading text-base font-semibold mb-4">Plan Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-cyber-border">
                        <th className="text-left py-3 text-text-secondary font-medium">Feature</th>
                        <th className="text-center py-3 text-text-secondary font-medium">Free</th>
                        <th className="text-center py-3 text-neon-cyan font-medium">Pro</th>
                        <th className="text-center py-3 text-neon-purple font-medium">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Messages/month", "100", "Unlimited", "Unlimited"],
                        ["Agents", "3", "Unlimited", "Unlimited"],
                        ["Arena Entries", "1/week", "Unlimited", "Unlimited"],
                        ["API Access", "—", "✓", "✓"],
                        ["Integrations", "—", "✓", "✓"],
                        ["Priority Support", "—", "✓", "✓"],
                        ["Custom Branding", "—", "—", "✓"],
                        ["Team Members", "1", "5", "Unlimited"],
                        ["Price", "$0", "$19/mo", "Custom"],
                      ].map(([feature, free, pro, enterprise], i) => (
                        <tr key={i} className="border-b border-cyber-border/50">
                          <td className="py-3 text-text-primary">{feature}</td>
                          <td className="py-3 text-center text-text-muted">{free}</td>
                          <td className="py-3 text-center text-neon-cyan">{pro}</td>
                          <td className="py-3 text-center text-neon-purple">{enterprise}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── DANGER ZONE ─── */}
          {activeSection === "danger" && (
            <div className="space-y-6">
              {/* Sign Out */}
              <div className="card">
                <h3 className="font-heading text-base font-semibold mb-2">Sign Out</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Sign out of your account on this device. You can sign back in anytime.
                </p>
                <button className="btn-secondary text-sm" onClick={logout}>
                  Sign Out
                </button>
              </div>

              {/* Delete Account */}
              <div className="card border-red-500/30">
                <h3 className="font-heading text-base font-semibold mb-2 text-red-400">
                  Delete Account
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  Permanently delete your account and all associated data. This action cannot be
                  undone.
                </p>

                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-red-400 text-sm font-medium mb-2">⚠ Warning</p>
                  <ul className="text-text-muted text-xs space-y-1">
                    <li>• All your agents and configurations will be deleted</li>
                    <li>• Your arena entries and social posts will be removed</li>
                    <li>• Any active subscriptions will be cancelled</li>
                    <li>• This action is irreversible</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <label className="block text-text-secondary text-sm mb-1">
                    Type <span className="font-code text-red-400">DELETE</span> to confirm
                  </label>
                  <input
                    className="input border-red-500/30 focus:border-red-500"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder="DELETE"
                  />
                </div>

                <button
                  className="btn-secondary text-sm border-red-500/50 text-red-400 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading || deleteConfirm !== "DELETE"}
                >
                  {deleteLoading ? "Deleting..." : "Delete My Account"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
