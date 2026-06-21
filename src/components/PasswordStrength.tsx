"use client";

import { useMemo } from "react";

function scorePassword(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^a-zA-Z0-9]/.test(pw)) score += 1;

  if (score <= 1) return { score, label: "Weak", color: "#ff4444" };
  if (score === 2) return { score, label: "Fair", color: "#ff8800" };
  if (score === 3) return { score, label: "Good", color: "#ffd93d" };
  if (score === 4) return { score, label: "Strong", color: "#00ff41" };
  return { score: 5, label: "Very Strong", color: "#00f0ff" };
}

export function PasswordStrength({ password }: { password: string }) {
  const { score, label, color } = useMemo(() => scorePassword(password), [password]);

  if (!password) return null;

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i <= score ? color : "rgba(255,255,255,0.1)" }}
          />
        ))}
      </div>
      <p className="text-[10px] font-medium" style={{ color }}>
        {label}
      </p>
    </div>
  );
}
