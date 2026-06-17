'use client';
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  Zap, Sparkles, Bot, Code, Share2, Shield, ArrowRight,
  Users, Globe, Cpu, MessageCircle, Play, CheckCircle,
  Loader2, Terminal, Coins, ChevronDown
} from 'lucide-react';


// Dashboard imports (lazy loaded when signed in)
import dynamicImport from 'next/dynamic';
const DashboardView = dynamicImport(() => import('@/components/DashboardView'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a12' }}>
      <Loader2 className="animate-spin text-cyan-400" size={32} />
    </div>
  ),
  ssr: false
});

// Theme colors
const C = {
  bgColor: '#0a0a12',
  boxBg: 'rgba(255,255,255,0.03)',
  borderColor: 'rgba(255,255,255,0.1)',
  textColor: '#e0e0e0',
  textMuted: 'rgba(255,255,255,0.7)',
  headerColor: '#00f0ff',
  accentColor: '#ff00a0',
  linkColor: '#ff9ff3',
  success: '#00ff41',
};

// Landing Page Component
function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Bot,
      title: 'AI Agents That Work For You',
      desc: 'Deploy autonomous agents to handle coding, research, and creative tasks. They run 24/7 in the background.',
      color: C.headerColor
    },
    {
      icon: Code,
      title: 'Built for Developers',
      desc: 'Generate code, debug issues, and ship faster with AI that understands your codebase and stack.',
      color: C.accentColor
    },
    {
      icon: Share2,
      title: 'Own Your Distribution',
      desc: 'Cross-post to Twitter, Discord, and blogs automatically. Build an audience while you sleep.',
      color: C.linkColor
    },
    {
      icon: Shield,
      title: 'You Control Everything',
      desc: 'Your agents, your data, your API keys. No lock-in. Export anything, anytime.',
      color: C.success
    }
  ];

  const useCases = [
    { name: 'Indie Hackers', desc: 'Ship MVPs in days, not months', icon: Zap },
    { name: 'Content Creators', desc: 'Auto-generate and distribute content', icon: MessageCircle },
    { name: 'Dev Teams', desc: 'Automate repetitive dev tasks', icon: Code },
    { name: 'Solo Founders', desc: 'Do the work of 10 people', icon: Users }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bgColor, color: C.textColor }}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a12]/90 backdrop-blur-md border-b border-white/10' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight" style={{ color: C.headerColor }}>
                ⚡ LiTTree Labs
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm hover:text-cyan-400 transition-colors">Features</a>
              <a href="#pricing" className="text-sm hover:text-cyan-400 transition-colors">Pricing</a>
              <a href="#docs" className="text-sm hover:text-cyan-400 transition-colors">Docs</a>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium border rounded-none hover:bg-white/5 transition-all"
                style={{ borderColor: C.borderColor }}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-bold border hover:opacity-80 transition-all"
                style={{ borderColor: C.headerColor, color: C.headerColor }}
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-5 h-0.5 bg-white mb-1" />
              <div className="w-5 h-0.5 bg-white mb-1" />
              <div className="w-5 h-0.5 bg-white" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a12] border-b border-white/10">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-sm py-2">Features</a>
              <a href="#pricing" className="block text-sm py-2">Pricing</a>
              <a href="#docs" className="block text-sm py-2">Docs</a>
              <Link href="/sign-in" className="block text-sm py-2">Sign In</Link>
              <Link href="/sign-up" className="block text-sm py-2 text-cyan-400">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border text-xs font-mono"
                style={{ borderColor: C.borderColor, color: C.headerColor }}>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                NOW IN PUBLIC BETA
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight">
                Build Your
                <span style={{ color: C.headerColor }}> AI Workforce</span>
              </h1>

              <p className="text-lg sm:text-xl mb-8 max-w-xl mx-auto lg:mx-0" style={{ color: C.textMuted }}>
                Deploy autonomous AI agents that code, create, and distribute while you sleep.
                Stop doing repetitive work. Start shipping.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/sign-up"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold border-2 hover:opacity-80 transition-all"
                  style={{ borderColor: C.headerColor, color: C.headerColor }}
                >
                  Start Building Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium border hover:bg-white/5 transition-all"
                  style={{ borderColor: C.borderColor }}
                >
                  <Play size={18} />
                  Watch Demo
                </a>
              </div>

              <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm" style={{ color: C.textMuted }}>
                <span className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-400" />
                  Free tier available
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-400" />
                  No credit card required
                </span>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="relative border-2 p-6" style={{ backgroundColor: C.boxBg, borderColor: C.borderColor }}>
                {/* Fake terminal */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b" style={{ borderColor: C.borderColor }}>
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-xs font-mono opacity-50">agent-worker-1 — bash</span>
                </div>
                <div className="font-mono text-sm space-y-2" style={{ color: C.textMuted }}>
                  <p><span className="text-green-400">$</span> littree agent deploy code-reviewer</p>
                  <p className="opacity-50">Deploying agent...</p>
                  <p><span className="text-cyan-400">[OK]</span> Agent online at https://api.littree.io/agents/code-reviewer</p>
                  <p><span className="text-green-400">$</span> littree task create "Review PR #247"</p>
                  <p className="opacity-50">Analyzing 12 files...</p>
                  <p><span className="text-cyan-400">[DONE]</span> Found 3 issues, posted review</p>
                  <p><span className="text-green-400">$</span> _</p>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 px-3 py-2 border text-xs font-bold animate-pulse"
                  style={{ backgroundColor: C.boxBg, borderColor: C.accentColor, color: C.accentColor }}>
                  <Zap size={12} className="inline mr-1" />
                  3 tasks completed
                </div>
                <div className="absolute -bottom-4 -left-4 px-3 py-2 border text-xs font-bold"
                  style={{ backgroundColor: C.boxBg, borderColor: C.headerColor, color: C.headerColor }}>
                  <Globe size={12} className="inline mr-1" />
                  Posted to Twitter
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={24} style={{ color: C.textMuted }} />
        </div>
      </section>

      {/* Logos / Social Proof */}
      <section className="py-12 border-y" style={{ borderColor: C.borderColor, backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm mb-8" style={{ color: C.textMuted }}>
            Built with modern tools you already trust
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
            <span className="text-lg font-bold">Next.js</span>
            <span className="text-lg font-bold">React</span>
            <span className="text-lg font-bold">TypeScript</span>
            <span className="text-lg font-bold">Tailwind</span>
            <span className="text-lg font-bold">Clerk</span>
            <span className="text-lg font-bold">Supabase</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              What You Can <span style={{ color: C.accentColor }}>Build</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: C.textMuted }}>
              Agents are software that works for you. Train them once, deploy them forever.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group p-6 border-2 hover:border-cyan-400/50 transition-all"
                style={{ backgroundColor: C.boxBg, borderColor: C.borderColor }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 border" style={{ borderColor: f.color }}>
                    <f.icon size={24} style={{ color: f.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                    <p style={{ color: C.textMuted }}>{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 border-y" style={{ borderColor: C.borderColor, backgroundColor: 'rgba(0,240,255,0.02)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Who Is This <span style={{ color: C.headerColor }}>For?</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {useCases.map((u, i) => (
              <div key={i} className="p-6 border text-center"
                style={{ backgroundColor: C.boxBg, borderColor: C.borderColor }}>
                <u.icon size={32} className="mx-auto mb-4" style={{ color: C.headerColor }} />
                <h3 className="font-bold mb-2">{u.name}</h3>
                <p className="text-sm" style={{ color: C.textMuted }}>{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-black mb-6">
            Ready to <span style={{ color: C.accentColor }}>Multiply</span> Yourself?
          </h2>
          <p className="text-xl mb-8" style={{ color: C.textMuted }}>
            Join the beta. Start with 500 free LitCoins. No credit card required.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold border-2 hover:opacity-80 transition-all"
            style={{ borderColor: C.headerColor, color: C.headerColor }}
          >
            <Sparkles size={20} />
            Create Free Account
          </Link>
          <p className="mt-4 text-sm" style={{ color: C.textMuted }}>
            Already have an account? <Link href="/sign-in" className="text-cyan-400 hover:underline">Sign in</Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ borderColor: C.borderColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4" style={{ color: C.headerColor }}>LiTTree Labs</h4>
              <p className="text-sm" style={{ color: C.textMuted }}>
                Building the future of autonomous AI agents.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm" style={{ color: C.textMuted }}>
                <li><Link href="/studio" className="hover:text-white">Studio</Link></li>
                <li><Link href="/marketplace" className="hover:text-white">Marketplace</Link></li>
                <li><Link href="/gallery" className="hover:text-white">Gallery</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm" style={{ color: C.textMuted }}>
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-white">API Reference</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm" style={{ color: C.textMuted }}>
                <li><a href="https://twitter.com/littreelabs" className="hover:text-white">Twitter</a></li>
                <li><a href="https://discord.gg/littree" className="hover:text-white">Discord</a></li>
                <li><a href="https://github.com/littreelabs" className="hover:text-white">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm" style={{ borderColor: C.borderColor, color: C.textMuted }}>
            <p>&copy; {new Date().getFullYear()} LiTTree Lab Studios. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Main Page Component
export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.bgColor }}>
        <Loader2 className="animate-spin text-cyan-400" size={32} />
      </div>
    );
  }

  // Show dashboard for signed-in users, landing page for everyone else
  return isSignedIn ? <DashboardView /> : <LandingPage />;
}
