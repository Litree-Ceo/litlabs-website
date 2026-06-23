"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

export default function SignInPage() {
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
      const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message;
      if (msg?.toLowerCase().includes("password")) {
        setError("Incorrect password. Please try again.");
      } else if (
        msg?.toLowerCase().includes("email") ||
        msg?.toLowerCase().includes("not found")
      ) {
        setError("No account found with this email.");
      } else {
        setError(msg || "Sign in failed. Please try again.");
      }
    } finally {
      setPending(false);
    }
  };

  const handleSocial = async (provider: "google" | "github") => {
    if (!signIn) return;
    setPending(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/studio",
      });
    } catch {
      setError("Social sign-in failed");
      setPending(false);
    }
  };

  if (!isLoaded) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#0a0a0f" }}
      >
        <Loader2
          className="animate-spin"
          size={24}
          style={{ color: "#00f0ff" }}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: "#0a0a0f" }}
    >
      <div
        className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,0,160,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div
            className="text-4xl mb-3 animate-pulse"
            style={{ color: "#00f0ff" }}
          >
            ✦
          </div>
          <h1
            className="text-2xl font-black tracking-tight"
            style={{ color: "#e2e8f0" }}
          >
            Welcome <span style={{ color: "#00f0ff" }}>back</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            Sign in to your AI workspace
          </p>
        </div>

        <div
          className="rounded-2xl p-8 transition-all duration-300 border"
          style={{
            backgroundColor: "rgba(15,15,25,0.8)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          {error && (
            <div
              className="mb-4 p-3 rounded-lg text-sm font-medium border"
              style={{
                backgroundColor: "rgba(255,0,0,0.08)",
                borderColor: "rgba(255,0,0,0.2)",
                color: "#ff6b6b",
              }}
            >
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                className="block text-[11px] font-medium mb-1.5"
                style={{ color: "#64748b" }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#64748b" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg px-9 py-2.5 text-sm outline-none transition-all border"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.08)",
                    color: "#e2e8f0",
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    document.getElementById("signin-password")?.focus()
                  }
                />
              </div>
            </div>

            <div>
              <label
                className="block text-[11px] font-medium mb-1.5"
                style={{ color: "#64748b" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#64748b" }}
                />
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg px-9 py-2.5 text-sm outline-none transition-all border"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.08)",
                    color: "#e2e8f0",
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#64748b" }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleSignIn}
              disabled={!email.trim() || !password || pending}
              className="w-full rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-30 border"
              style={{
                backgroundColor: "rgba(0,240,255,0.1)",
                borderColor: "#00f0ff",
                color: "#00f0ff",
              }}
            >
              {pending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div
                className="w-full border-t"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              />
            </div>
            <div className="relative flex justify-center">
              <span
                className="px-3 text-[11px]"
                style={{
                  backgroundColor: "rgba(15,15,25,0.8)",
                  color: "#64748b",
                }}
              >
                or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocial("google")}
              disabled={pending}
              className="flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium transition-all border hover:opacity-80"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.1)",
                color: "#e2e8f0",
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button
              onClick={() => handleSocial("github")}
              disabled={pending}
              className="flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium transition-all border hover:opacity-80"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.1)",
                color: "#e2e8f0",
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#e2e8f0">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>

          <p className="text-center text-xs mt-4" style={{ color: "#64748b" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium hover:underline"
              style={{ color: "#00f0ff" }}
            >
              <Sparkles size={12} className="inline mr-0.5" />
              Create one
            </Link>
          </p>
        </div>

        <div className="text-center mt-6 space-y-2">
          <Link
            href="/"
            className="inline-block text-[11px] opacity-50 hover:opacity-80 transition-opacity"
            style={{ color: "#94a3b8" }}
          >
            ← Back to Home
          </Link>
          <p className="text-[10px]" style={{ color: "#475569" }}>
            Secured by{" "}
            <span className="font-medium" style={{ color: "#64748b" }}>
              Clerk
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
