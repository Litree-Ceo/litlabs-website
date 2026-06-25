"use client";

export const dynamic = "force-dynamic";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Check,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

type Step = "name" | "credentials" | "verify";
const STEPS: Step[] = ["name", "credentials", "verify"];

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [animDir, setAnimDir] = useState<"forward" | "back">("forward");

  const goToStep = useCallback((s: Step, dir: "forward" | "back") => {
    setAnimDir(dir);
    setTimeout(() => {
      setStep(s);
      setError("");
    }, 50);
  }, []);

  const handleStep1Next = () => {
    if (!firstName.trim() || !validEmail) return;
    goToStep("credentials", "forward");
  };

  const handleStep2Next = async () => {
    if (!validPassword) return;
    setPending(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      goToStep("verify", "forward");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  };

  const handleResend = async () => {
    setPending(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to resend");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  };

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validPassword = password.length >= 8;
  const canStep1 = !!firstName.trim() && validEmail;
  const canStep2 = validPassword;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: "#0a0a0f" }}
    >
      <div
        className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
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
            LiTTree <span style={{ color: "#00f0ff" }}>Labs</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            Build the future with AI agents
          </p>
        </div>

        <div
          className="rounded-2xl p-8 transition-all duration-300 border"
          style={{
            backgroundColor: "rgba(15,15,25,0.8)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            {STEPS.map((s, i) => {
              const currentIdx = STEPS.indexOf(step);
              const done = i < currentIdx;
              const active = step === s;
              return (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500"
                    style={{
                      backgroundColor: active
                        ? "#00f0ff"
                        : done
                          ? "rgba(0,240,255,0.3)"
                          : "rgba(255,255,255,0.06)",
                      color: active ? "#0a0a0f" : done ? "#00f0ff" : "#64748b",
                      border: `1px solid ${active ? "#00f0ff" : done ? "rgba(0,240,255,0.3)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    {done ? <Check size={12} /> : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="w-8 h-px transition-all duration-500"
                      style={{
                        backgroundColor:
                          i < STEPS.indexOf(step)
                            ? "#00f0ff"
                            : "rgba(255,255,255,0.1)",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

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

          {step === "name" && (
            <div className="space-y-4" style={{ animation: `${animDir === "forward" ? "slideIn" : "slideOut"} 0.25s ease` }}>
              <h2 className="text-lg font-bold text-center" style={{ color: "#e2e8f0" }}>
                Create your account
              </h2>
              <p className="text-xs text-center" style={{ color: "#64748b" }}>
                Welcome! Please fill in the details to get started.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#64748b" }}>
                    First name
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#64748b" }} />
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-lg px-9 py-2.5 text-sm outline-none transition-all border"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.04)",
                        borderColor: firstName ? "rgba(0,240,255,0.3)" : "rgba(255,255,255,0.08)",
                        color: "#e2e8f0",
                      }}
                      placeholder="John"
                      autoComplete="given-name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#64748b" }}>
                    Last name
                  </label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all border"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      borderColor: lastName ? "rgba(0,240,255,0.3)" : "rgba(255,255,255,0.08)",
                      color: "#e2e8f0",
                    }}
                    placeholder="Doe"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#64748b" }}>
                  Email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#64748b" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg px-9 py-2.5 text-sm outline-none transition-all border"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      borderColor: validEmail ? "rgba(0,240,255,0.3)" : email ? "rgba(255,0,0,0.3)" : "rgba(255,255,255,0.08)",
                      color: "#e2e8f0",
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    onKeyDown={(e) => e.key === "Enter" && canStep1 && handleStep1Next()}
                  />
                </div>
              </div>

              <button
                onClick={handleStep1Next}
                disabled={!canStep1}
                className="w-full rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-30 border"
                style={{
                  backgroundColor: "rgba(0,240,255,0.1)",
                  borderColor: "#00f0ff",
                  color: "#00f0ff",
                }}
              >
                Continue <ArrowRight size={14} />
              </button>

              <p className="text-center text-xs mt-2" style={{ color: "#64748b" }}>
                Already have an account?{" "}
                <Link href="/sign-in" className="font-medium hover:underline" style={{ color: "#00f0ff" }}>
                  <Sparkles size={12} className="inline mr-0.5" /> Sign in
                </Link>
              </p>
            </div>
          )}

          {step === "credentials" && (
            <div className="space-y-4" style={{ animation: `${animDir === "forward" ? "slideIn" : "slideOut"} 0.25s ease` }}>
              <h2 className="text-lg font-bold text-center" style={{ color: "#e2e8f0" }}>
                Secure your account
              </h2>
              <p className="text-xs text-center" style={{ color: "#64748b" }}>
                Choose a strong password for{" "}
                <span className="font-medium" style={{ color: "#e2e8f0" }}>{email}</span>
              </p>

              <div>
                <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#64748b" }}>
                  Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#64748b" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg px-9 py-2.5 text-sm outline-none transition-all border"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      borderColor: validPassword ? "rgba(0,240,255,0.3)" : password ? "rgba(255,0,0,0.3)" : "rgba(255,255,255,0.08)",
                      color: "#e2e8f0",
                    }}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    onKeyDown={(e) => e.key === "Enter" && canStep2 && !pending && handleStep2Next()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#64748b" }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => goToStep("name", "back")}
                  disabled={pending}
                  className="flex-1 rounded-lg py-2.5 text-sm font-medium transition-all border flex items-center justify-center gap-1"
                  style={{ borderColor: "rgba(255,255,255,0.1)", color: "#64748b" }}
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  onClick={handleStep2Next}
                  disabled={!canStep2 || pending}
                  className="flex-1 rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-30 border"
                  style={{
                    backgroundColor: "rgba(0,240,255,0.1)",
                    borderColor: "#00f0ff",
                    color: "#00f0ff",
                  }}
                >
                  {pending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <>Continue <ArrowRight size={14} /></>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === "verify" && (
            <div className="space-y-4" style={{ animation: "slideIn 0.25s ease" }}>
              <h2 className="text-lg font-bold text-center" style={{ color: "#e2e8f0" }}>
                Check your email
              </h2>
              <p className="text-xs text-center" style={{ color: "#64748b" }}>
                We sent a confirmation link to{" "}
                <span className="font-medium" style={{ color: "#e2e8f0" }}>{email}</span>
              </p>

              <div className="p-4 rounded-lg border text-sm" style={{
                backgroundColor: "rgba(0,240,255,0.05)",
                borderColor: "rgba(0,240,255,0.2)",
                color: "#94a3b8",
              }}>
                <p className="text-center">
                  Please check your inbox and click the confirmation link to activate your account.
                  After confirming,{" "}
                  <Link href="/sign-in" className="font-medium hover:underline" style={{ color: "#00f0ff" }}>
                    sign in here
                  </Link>.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleResend}
                  disabled={pending}
                  className="w-full rounded-lg py-2.5 text-sm font-medium transition-all border flex items-center justify-center gap-2 disabled:opacity-30"
                  style={{ borderColor: "rgba(255,255,255,0.1)", color: "#e2e8f0" }}
                >
                  {pending ? <Loader2 size={14} className="animate-spin" /> : null}
                  {pending ? "Sending..." : "Resend confirmation email"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("name");
                    setError("");
                  }}
                  className="w-full text-[11px] opacity-50 hover:opacity-100 transition-opacity mt-1"
                  style={{ color: "#94a3b8" }}
                >
                  Start over from the beginning
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6 space-y-2">
          <Link href="/" className="inline-block text-[11px] opacity-50 hover:opacity-80 transition-opacity" style={{ color: "#94a3b8" }}>
            ← Back to Home
          </Link>
          <p className="text-[10px]" style={{ color: "#475569" }}>
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline hover:opacity-80">Terms</a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:opacity-80">Privacy Policy</a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOut {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(-20px); }
        }
      `}</style>
    </div>
  );
}
