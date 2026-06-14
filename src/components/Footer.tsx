"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Zap, Radio, Globe } from "lucide-react";

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
];

export default function Footer() {
  const { resolvedColors } = useTheme();

  return (
    <footer
      className="border-t mt-auto"
      style={{
        borderColor: resolvedColors.borderColor + "30",
        backgroundColor: resolvedColors.bgColor + "90",
        backdropFilter: "blur(12px)",
        color: resolvedColors.textColor,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand + Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap size={14} style={{ color: resolvedColors.accentColor }} />
              <span className="text-[11px] font-bold" style={{ color: resolvedColors.headerColor }}>
                LiTree Labs
              </span>
              <span className="text-[10px] opacity-50" style={{ color: resolvedColors.textMuted }}>
                © 2026
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px]" style={{ color: resolvedColors.textMuted }}>
              <Radio size={10} className="status-dot online" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Legal */}
          <div className="flex items-center gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] font-medium transition-opacity hover:opacity-100"
                style={{ color: resolvedColors.textMuted }}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/Litree-Ceo/litlabs-website"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100 opacity-60 transition-opacity flex items-center gap-1 text-[11px]"
              style={{ color: resolvedColors.linkColor }}
            >
              <Globe size={14} /> GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
