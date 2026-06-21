"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSignIn = async () => {
    if (!signIn || !email.trim() || !password) return;
    setPending(true);
    setError("");
    try {
      const res = await signIn.create({ identifier: email.trim(), password });
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        router.push("/studio");
      } else {
        setError("Additional verification required.");
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Invalid credentials");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#0a0a0f" }}>
      <div className="w-full max-w-md p-8 rounded-2xl border" style={{ backgroundColor: "#111118", borderColor: "#1a1a2e" }}>
        <div className="text-center mb-8">
          <div className="text-3xl mb-3">⚡</div>
          <h1 className="text-xl font-black" style={{ color: "#00f0ff" }}>Welcome Back</h1>
          <p className="text-sm opacity-50 mt-1">Sign in to LiTTree Lab Studios</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-xs font-bold" style={{ backgroundColor: "#2e0a0a", border: "1px solid #ff4444", color: "#ff4444" }}>
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold opacity-60 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#555" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none border transition-all"
                style={{ backgroundColor: "#0a0a12", borderColor: "#1a1a2e", color: "#e0e0e0" }}
                onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold opacity-60 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#555" }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-lg text-sm outline-none border transition-all"
                style={{ backgroundColor: "#0a0a12", borderColor: "#1a1a2e", color: "#e0e0e0" }}
                onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#555" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSignIn}
            disabled={!email.trim() || !password || pending || !isLoaded}
            className="w-full py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
            style={{
              backgroundColor: email.trim() && password && !pending ? "#00f0ff" : "#1a1a2e",
              color: email.trim() && password && !pending ? "#000" : "#555",
              cursor: email.trim() && password && !pending ? "pointer" : "not-allowed",
            }}
          >
            {pending ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            {pending ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <span className="text-xs opacity-40">Don&apos;t have an account? </span>
          <Link href="/sign-up" className="text-xs font-bold" style={{ color: "#ff9ff3" }}>Create one</Link>
        </div>

        <div className="mt-4 pt-4 text-center" style={{ borderTop: "1px solid #1a1a2e" }}>
          <Link href="/" className="text-[10px]" style={{ color: "#555" }}>← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
