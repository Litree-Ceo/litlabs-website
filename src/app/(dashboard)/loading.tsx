"use client";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/social": "Social Hub",
  "/agent-chat": "AI Chat",
  "/marketplace": "Bot Forge",
  "/settings": "Settings",
};

export default function DashboardLoading() {
  const pathname = usePathname();
  const label = LABELS[pathname] || "Loading";

  return (
    <div className="max-w-6xl mx-auto animate-pulse">
      <div className="mb-8">
        <div className="h-7 w-48 bg-cyber-surface-2 rounded mb-2" />
        <div className="h-4 w-64 bg-cyber-surface-2 rounded" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-cyber-surface rounded-xl border border-cyber-border" />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="h-48 bg-cyber-surface rounded-xl border border-cyber-border" />
        <div className="h-48 bg-cyber-surface rounded-xl border border-cyber-border" />
      </div>
      <div className="mt-4 text-center text-text-muted text-xs font-code">
        Loading {label}…
      </div>
    </div>
  );
}
