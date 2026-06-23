"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Globe, Mail, Shield, Zap } from "lucide-react";

const PRODUCT_LINKS = [
  { href: "/studio", label: "Creative Studio" },
  { href: "/marketplace", label: "Agent Market" },
  { href: "/gallery", label: "Discovery Gallery" },
  { href: "/agent", label: "AI Assistant" },
];

const RESOURCE_LINKS = [
  { href: "/flow", label: "Visual Flow" },
  { href: "/docs", label: "Documentation" },
  { href: "/settings", label: "User Preferences" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
];

export default function Footer() {
  const { resolvedColors: C } = useTheme();

  return (
    <footer
      className="w-full relative mt-auto"
      style={{
        borderTop: `1px solid ${C.borderColor}20`,
        backgroundColor: C.bgColor,
      }}
    >
      <div className="max-w-[1600px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Zap size={24} fill="currentColor" />
              </div>
              <span className="font-black text-xl tracking-tight">
                LiTree Lab Studios
              </span>
            </Link>
            <p className="text-sm opacity-50 max-w-xs leading-relaxed">
              The premier platform for deploying specialized AI agents, building
              automated workflows, and scaling your creative potential.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Globe, href: "https://github.com/Litree-Ceo" },
                { icon: Globe, href: "https://twitter.com" },
                { icon: Mail, href: "mailto:hello@litlabs.net" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="p-2 rounded-lg hover:bg-white/5 transition-all opacity-60 hover:opacity-100 border border-transparent hover:border-white/10"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest opacity-30">
              Platform
            </h4>
            <div className="flex flex-col gap-2">
              {PRODUCT_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm opacity-60 hover:opacity-100 transition-all hover:translate-x-1 inline-block"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest opacity-30">
              Resources
            </h4>
            <div className="flex flex-col gap-2">
              {RESOURCE_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm opacity-60 hover:opacity-100 transition-all hover:translate-x-1 inline-block"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest opacity-30">
              Legal
            </h4>
            <div className="flex flex-col gap-2">
              {LEGAL_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm opacity-60 hover:opacity-100 transition-all hover:translate-x-1 inline-block"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderColor: C.borderColor + "20" }}
        >
          <div className="text-[11px] font-bold opacity-30 uppercase tracking-widest">
            © 2026 LiTree Lab Studios • All Rights Reserved
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold opacity-50 uppercase tracking-wider">
                All Systems Operational
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-30">
              <Globe size={12} />
              Global Node: USE-1
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
