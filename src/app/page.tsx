'use client';
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { Zap, ShoppingBag, Bot, Sparkles, Shield, BarChart3, ArrowRight } from 'lucide-react';

const FEATURES = [
  { icon: Bot, title: 'AI Agents', desc: 'Deploy specialized agents for coding, marketing, research, and more.' },
  { icon: Sparkles, title: 'Studio Tools', desc: 'Generate images, videos, music, and content with AI.' },
  { icon: Zap, title: 'Automation', desc: 'Chain agents into workflows that run end-to-end.' },
  { icon: ShoppingBag, title: 'Marketplace', desc: 'Buy, sell, and share agents. Earn LitCoins.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Real-time monitoring and performance insights.' },
  { icon: Shield, title: 'Secure', desc: 'Clerk auth, Supabase backend, Stripe payments.' },
];

// Fixed professional dark palette — no theme dependency
const C = {
  bgColor: '#0a0a0f',
  textColor: '#e4e4e7',
  linkColor: '#818cf8',
  headerColor: '#a78bfa',
  borderColor: '#27272a',
  accentColor: '#fbbf24',
  boxBg: '#111118',
};

export default function LandingPage() {
  const { isLoaded, isSignedIn } = useClerkAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.bgColor }}>
        <div className="text-center">
          <div className="text-3xl mb-4 animate-pulse">⚡</div>
          <div className="text-sm font-bold opacity-60" style={{ color: C.textColor }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: C.bgColor, color: C.textColor }}>
      {/* Ambient purple glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-[0.05]" style={{ background: `radial-gradient(circle, ${C.linkColor} 0%, transparent 70%)` }} />
      </div>

      <main className="relative z-10">
        {/* HERO */}
        <section className="relative w-full">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-16 sm:pb-20 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8" style={{ backgroundColor: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', color: C.accentColor }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: C.accentColor }} />
              BETA — Free while we build
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight mb-6">
              <span style={{ color: C.textColor }}>Your </span>
              <span style={{ color: C.headerColor }}>AI Workforce</span>
              <span style={{ color: C.textColor }}> is Ready</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed px-4" style={{ color: 'rgba(228,228,231,0.6)' }}>
              Build, deploy, and manage custom AI agents in one platform.
              Automate workflows, generate content, and scale your creativity.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
              <Link href="/sign-up" className="group px-8 py-3.5 rounded-lg text-sm font-bold inline-flex items-center gap-2 transition-all hover:scale-[1.02]" style={{ background: `linear-gradient(135deg, ${C.linkColor}, ${C.headerColor})`, color: '#000' }}>
                Start Free — No Card Needed
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/studio" className="px-8 py-3.5 rounded-lg text-sm font-bold border transition-all hover:bg-white/5" style={{ borderColor: 'rgba(39,39,42,0.4)', color: C.textColor }}>
                Open Studio
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 pt-8" style={{ borderTop: '1px solid rgba(39,39,42,0.15)' }}>
              {[
                { val: '10K+', label: 'AI Agents' },
                { val: '50K+', label: 'Users' },
                { val: '2M+', label: 'Tasks Done' },
              ].map(s => (
                <div key={s.label} className="text-center min-w-[80px]">
                  <div className="text-2xl sm:text-3xl font-black" style={{ color: C.linkColor }}>{s.val}</div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-widest opacity-50 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="w-full" style={{ borderTop: '1px solid rgba(39,39,42,0.1)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
            <div className="text-center mb-12 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl font-black mb-3" style={{ color: C.textColor }}>Everything You Need</h2>
              <p className="text-sm opacity-60 max-w-md mx-auto">One platform. Unlimited agents. Total creative control.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f, i) => (
                <div key={i} className="rounded-xl p-6 transition-all duration-200 hover:-translate-y-1" style={{ backgroundColor: C.boxBg, border: '1px solid rgba(39,39,42,0.2)' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(129,140,248,0.08)' }}>
                    <f.icon size={20} style={{ color: C.linkColor }} />
                  </div>
                  <h3 className="font-bold text-sm mb-2" style={{ color: C.textColor }}>{f.title}</h3>
                  <p className="text-xs leading-relaxed opacity-60">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="w-full" style={{ borderTop: '1px solid rgba(39,39,42,0.1)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-black mb-3" style={{ color: C.textColor }}>Simple Pricing</h2>
              <p className="text-sm opacity-60">Free during beta. Lock in your founding rate.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Beta', price: 'Free', features: ['8 AI Agents', 'Unlimited Coins', 'Studio Tools', 'Community'], cta: 'Start Free', highlight: false },
                { name: 'Pro', price: '$9/mo', features: ['All Beta features', 'Priority AI', 'API Access', 'Custom Slugs'], cta: 'Join Waitlist', highlight: true },
                { name: 'Team', price: '$29/mo', features: ['All Pro features', 'Multi-user', 'Analytics', 'White-label'], cta: 'Join Waitlist', highlight: false },
              ].map(p => (
                <div key={p.name} className="rounded-2xl p-6 flex flex-col relative transition-all duration-200 hover:-translate-y-0.5" style={{ backgroundColor: p.highlight ? 'rgba(129,140,248,0.04)' : C.boxBg, border: `2px solid ${p.highlight ? C.linkColor : 'rgba(39,39,42,0.2)'}`, opacity: p.highlight ? 1 : undefined }}>
                  {p.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full" style={{ backgroundColor: C.linkColor, color: '#000' }}>
                      POPULAR
                    </div>
                  )}
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-50">{p.name}</div>
                  <div className="text-3xl font-black mb-5" style={{ color: C.textColor }}>{p.price}</div>
                  <ul className="space-y-3 flex-1 mb-6">
                    {p.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm opacity-80">
                        <span style={{ color: C.linkColor }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/sign-up" className="block text-center text-sm font-bold py-2.5 rounded-lg transition-all hover:opacity-90" style={{ backgroundColor: p.highlight ? C.linkColor : 'transparent', color: p.highlight ? '#000' : C.linkColor, border: `1px solid ${p.highlight ? 'transparent' : 'rgba(129,140,248,0.3)'}` }}>
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="w-full pb-16 sm:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="rounded-2xl p-8 sm:p-12 text-center" style={{ backgroundColor: C.boxBg, border: '1px solid rgba(39,39,42,0.15)' }}>
              <h2 className="text-2xl sm:text-3xl font-black mb-3" style={{ color: C.textColor }}>Ready to Build?</h2>
              <p className="text-sm opacity-60 mb-8 max-w-md mx-auto">Join today — free while in beta. Get 500 LitCoins and full studio access.</p>
              <Link href="/sign-up" className="inline-block px-10 py-4 rounded-lg text-sm font-black transition-all hover:scale-[1.02]" style={{ background: `linear-gradient(135deg, ${C.linkColor}, ${C.headerColor})`, color: '#000' }}>
                Get Started — It&apos;s Free
              </Link>
              <p className="text-xs mt-5 opacity-40">No credit card · Cancel anytime</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
