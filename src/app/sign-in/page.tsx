"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err) setError(err);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setPending(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: "include",
      });

      if (res.redirected) {
        window.location.href = res.url;
        return;
      }

      if (res.ok) {
        window.location.href = "/dashboard";
        return;
      }

      const data = await res.json().catch(() => ({}));
      setError(data?.error || `Error ${res.status}`);
    } catch (err) {
      setError("Network error. Check console.");
      console.error("Sign-in error:", err);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: "#0a0a0f" }}>
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 70%)" }} />
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,0,160,0.06) 0%, transparent 70%)" }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3 animate-pulse" style={{ color: "#00f0ff" }}>✦</div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: "#e2e8f0" }}>
            Welcome <span style={{ color: "#00f0ff" }}>back</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>Sign in to your AI workspace</p>
        </div>

        <form onSubmit={handleSubmit}
          className="rounded-2xl p-8 transition-all duration-300 border"
          style={{ backgroundColor: "rgba(15,15,25,0.8)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm font-medium border"
              style={{ backgroundColor: "rgba(255,0,0,0.08)", borderColor: "rgba(255,0,0,0.2)", color: "#ff6b6b" }}>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#64748b" }}>Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#64748b" }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg px-9 py-2.5 text-sm outline-none transition-all border"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
                  placeholder="you@example.com" autoComplete="email" required />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#64748b" }}>Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#64748b" }} />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg px-9 py-2.5 text-sm outline-none transition-all border"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
                  placeholder="Enter your password" autoComplete="current-password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#64748b" }}>
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={!email.trim() || !password || pending}
              className="w-full rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-30 border cursor-pointer"
              style={{ backgroundColor: pending ? "rgba(0,240,255,0.05)" : "rgba(0,240,255,0.1)", borderColor: "#00f0ff", color: pending ? "#64748b" : "#00f0ff" }}>
              <ArrowRight size={14} /> {pending ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <p className="text-center text-xs mt-4" style={{ color: "#64748b" }}>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-medium hover:underline" style={{ color: "#00f0ff" }}>
              <Sparkles size={12} className="inline mr-0.5" /> Create one
            </Link>
          </p>
        </form>

        <div className="text-center mt-6 space-y-2">
          <Link href="/" className="inline-block text-[11px] opacity-50 hover:opacity-80 transition-opacity" style={{ color: "#94a3b8" }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
