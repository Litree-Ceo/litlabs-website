"use client";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useClerkAuth } from "@/hooks/useClerkAuth";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import {
  ShoppingBag,
  Zap,
  Sparkles,
  Bot,
  Search,
  Filter,
  ArrowRight,
  Loader2,
  Check,
  Shield,
  Coins,
  Star,
  Users,
  Code,
  Layout,
  Music,
  Camera,
  Layers,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  price_cents: number;
  rating: number;
  installs: number;
  icon: string;
  tags: string[];
  is_featured: boolean;
}

const CATEGORIES = [
  "all",
  "general",
  "developer",
  "design",
  "marketing",
  "analytics",
  "content",
  "music",
];

const CATEGORY_LABELS: Record<string, string> = {
  all: "All Neural Units",
  general: "General Purpose",
  developer: "Dev Tools",
  design: "Visual Forge",
  marketing: "Growth Hackers",
  analytics: "Data Slayers",
  content: "Content Engines",
  music: "Audio Producers",
};

const AGENTS: Agent[] = [
  {
    id: "champion",
    name: "Champion",
    description:
      "Your all-purpose AI partner. Brainstorm, research, plan, and execute any task with unlimited versatility.",
    category: "general",
    price_cents: 0,
    rating: 4.8,
    installs: 2103,
    icon: "🏆",
    tags: ["General assistance", "Brainstorming", "Research"],
    is_featured: true,
  },
  {
    id: "code-champion",
    name: "Code Champion",
    description:
      "Senior software engineer. Writes, reviews, debugs, and explains code across all languages and frameworks.",
    category: "developer",
    price_cents: 0,
    rating: 4.9,
    installs: 1567,
    icon: "💻",
    tags: ["Code generation", "Debugging", "Architecture"],
    is_featured: true,
  },
  {
    id: "director",
    name: "Director",
    description:
      "The master orchestrator. Coordinates strategy, builds agent systems, and delegates tasks across your entire platform.",
    category: "general",
    price_cents: 0,
    rating: 4.9,
    installs: 1240,
    icon: "🎯",
    tags: [
      "Multi-agent orchestration",
      "Strategy planning",
      "Workflow automation",
    ],
    is_featured: true,
  },
  {
    id: "pixel-forge",
    name: "Pixel Forge",
    description:
      "AI image and 3D world generation specialist. Creates stunning visuals, textures, and immersive environments.",
    category: "design",
    price_cents: 200,
    rating: 4.8,
    installs: 921,
    icon: "🎨",
    tags: ["Image generation", "360 worlds", "Texture design"],
    is_featured: true,
  },
  {
    id: "social-dominator",
    name: "Social Dominator",
    description:
      "Growth hacker and content creator. Writes viral posts, crafts strategies, and helps you dominate social media.",
    category: "marketing",
    price_cents: 250,
    rating: 4.7,
    installs: 890,
    icon: "📱",
    tags: ["Viral content", "Growth strategy", "Analytics"],
    is_featured: true,
  },
  {
    id: "music-producer",
    name: "Music Producer",
    description:
      "Creates original music from text prompts and lyrics. Generates songs, instrumentals, and covers with AI.",
    category: "music",
    price_cents: 400,
    rating: 4.7,
    installs: 743,
    icon: "🎵",
    tags: ["Music generation", "Lyrics writing", "Style guidance"],
    is_featured: true,
  },
  {
    id: "data-slayer",
    name: "Data Slayer",
    description:
      "Data scientist. Analyzes data, builds models, creates visualizations, and surfaces actionable insights.",
    category: "analytics",
    price_cents: 300,
    rating: 4.6,
    installs: 654,
    icon: "📊",
    tags: ["Data analysis", "Modeling", "Visualization"],
    is_featured: true,
  },
  {
    id: "writing-coach",
    name: "Writing Coach",
    description:
      "Master copywriter. Elevates writing quality — editing, tone adjustment, copywriting, and storytelling.",
    category: "content",
    price_cents: 75,
    rating: 4.8,
    installs: 1120,
    icon: "✍️",
    tags: ["Editing", "Tone adjustment", "Copywriting"],
    is_featured: false,
  },
  {
    id: "support-agent",
    name: "Support Agent",
    description:
      "Customer support specialist. Handles inquiries, troubleshooting, and creates FAQ documentation.",
    category: "general",
    price_cents: 50,
    rating: 4.6,
    installs: 543,
    icon: "🤝",
    tags: ["Support tickets", "Documentation", "Troubleshooting"],
    is_featured: false,
  },
  {
    id: "research-guru",
    name: "Research Guru",
    description:
      "Deep research agent. Synthesizes information from multiple sources, fact-checks, and produces reports.",
    category: "content",
    price_cents: 100,
    rating: 4.5,
    installs: 432,
    icon: "🔬",
    tags: ["Deep research", "Fact-checking", "Reporting"],
    is_featured: false,
  },
  {
    id: "legal-shield",
    name: "Legal Shield",
    description:
      "Legal assistant for contracts, compliance, and regulatory guidance. Not a lawyer, but a powerful research aide.",
    category: "general",
    price_cents: 1000,
    rating: 4.4,
    installs: 210,
    icon: "⚖️",
    tags: ["Contract review", "Compliance", "Legal research"],
    is_featured: false,
  },
  {
    id: "security-guru",
    name: "Security Guru",
    description:
      "Cybersecurity expert. Audits code, finds vulnerabilities, and recommends security best practices.",
    category: "developer",
    price_cents: 1200,
    rating: 4.7,
    installs: 156,
    icon: "🔒",
    tags: ["Security audits", "Vulnerability scanning", "Best practices"],
    is_featured: false,
  },
  {
    id: "ml-engineer",
    name: "ML Engineer",
    description:
      "Machine learning specialist. Builds models, optimizes training, and deploys AI systems.",
    category: "analytics",
    price_cents: 1500,
    rating: 4.8,
    installs: 89,
    icon: "🧠",
    tags: ["Model training", "Hyperparameter tuning", "Model deployment"],
    is_featured: false,
  },
];

function AgentCard({
  agent,
  isInstalled,
  onInstall,
  theme: T,
}: {
  agent: Agent;
  isInstalled: boolean;
  onInstall: () => void;
  theme: any;
}) {
  return (
    <div className="glass-card group flex flex-col h-full overflow-hidden hover:border-indigo-500/30 transition-all duration-300 shadow-xl">
      <div className="relative p-6 space-y-4 flex-1">
        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500">
            {agent.icon}
          </div>
          <div className="flex flex-col items-end gap-1">
            {agent.is_featured && (
              <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">
                Featured
              </span>
            )}
            <div className="flex items-center gap-1 text-xs font-bold opacity-60">
              <Star size={12} className="text-yellow-500 fill-current" />
              {agent.rating}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h3 className="text-xl font-black tracking-tight">{agent.name}</h3>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
            <span style={{ color: T.accentColor }}>{agent.category}</span>
            <span>•</span>
            <span>{agent.installs.toLocaleString()} Installs</span>
          </div>
          <p className="text-sm opacity-60 leading-relaxed line-clamp-3 group-hover:opacity-100 transition-opacity">
            {agent.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {agent.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/5 opacity-50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">
            Deployment
          </span>
          <span className="text-sm font-black">
            {agent.price_cents === 0 ? (
              <span className="text-green-400">FREE</span>
            ) : (
              <span className="flex items-center gap-1 text-yellow-500">
                <Coins size={12} /> {agent.price_cents} LBC
              </span>
            )}
          </span>
        </div>
        <button
          onClick={onInstall}
          disabled={isInstalled}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            isInstalled
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95"
          }`}
        >
          {isInstalled ? "Installed" : "Deploy"}
        </button>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const { resolvedColors: T } = useTheme();
  const { userId, isLoaded, isSignedIn } = useClerkAuth();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [installedAgents, setInstalledAgents] = useState<Set<string>>(
    new Set(),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
      setInstalledAgents(new Set(["champion", "code-champion"]));
    }, 800);
  }, []);

  const filteredAgents = useMemo(() => {
    return AGENTS.filter((agent) => {
      const matchesCategory =
        selectedCategory === "all" || agent.category === selectedCategory;
      const matchesSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isLoaded || loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: T.bgColor }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
          <span className="text-sm font-bold uppercase tracking-[0.2em] opacity-40">
            Syncing Marketplace...
          </span>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <PageShell title="Marketplace">
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div className="p-6 rounded-full bg-white/5">
            <ShoppingBag size={48} className="opacity-20" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Access Restricted
            </h1>
            <p className="text-sm opacity-60 max-w-xs mx-auto">
              Please sign in to browse and deploy neural agents to your
              workspace.
            </p>
          </div>
          <Link href="/login" className="btn-primary">
            Sign In to Continue
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Neural Marketplace"
      subtitle="Discover and deploy specialized AI agents to automate your complex workflows."
    >
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 space-y-12 pb-20">
        {/* Hero Section / Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-900 p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-6 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] border border-white/30">
                <Shield size={12} /> Neural Network Online
              </div>
              <h2 className="text-4xl font-black leading-tight">
                Automate your business with neural agents.
              </h2>
              <p className="text-indigo-100 opacity-80 leading-relaxed">
                Instantly deploy verified AI units capable of coding, designing,
                researching, and marketing at scale.
              </p>
              <div className="flex gap-4">
                <button className="px-8 py-3 bg-white text-indigo-900 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                  Submit Agent
                </button>
                <button className="px-8 py-3 bg-indigo-500 text-white rounded-xl font-black text-xs uppercase tracking-widest border border-white/20 hover:bg-white/10 transition-all">
                  Learn More
                </button>
              </div>
            </div>
            <Bot className="absolute -bottom-20 -right-20 w-96 h-96 opacity-10" />
          </div>

          <div className="glass-card p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40">
                Agent Balance
              </h3>
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="p-3 rounded-xl bg-yellow-500/20 text-yellow-500">
                  <Coins size={32} />
                </div>
                <div>
                  <div className="text-3xl font-black tracking-tight text-yellow-500">
                    9,999
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                    LiTBit Coins Available
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full py-4 rounded-2xl bg-white/5 border border-dashed border-white/20 text-xs font-black uppercase tracking-[.2em] opacity-60 hover:opacity-100 hover:bg-white/10 transition-all mt-8">
              Claim Daily Bonus
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="glass-card p-2 flex flex-col md:flex-row items-center gap-2">
          <div className="flex-1 w-full relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by agent name or specialized capability..."
              className="w-full bg-transparent p-4 pl-12 outline-none text-sm font-medium"
            />
          </div>
          <div className="w-full md:w-auto h-12 flex gap-1 p-1 bg-white/5 rounded-xl">
            {CATEGORIES.slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-500 text-white shadow-lg"
                    : "opacity-40 hover:opacity-100"
                }`}
              >
                {cat}
              </button>
            ))}
            <div className="w-px h-full bg-white/10 mx-1" />
            <button className="px-4 rounded-lg opacity-40 hover:opacity-100">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Layers size={20} className="text-indigo-500" />
              {CATEGORY_LABELS[selectedCategory] || "Results"}
              <span className="text-xs font-bold opacity-30 bg-white/5 px-2 py-1 rounded-lg ml-2">
                {filteredAgents.length}
              </span>
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-bold opacity-40 uppercase tracking-widest">
              Sort by:
              <button className="flex items-center gap-1 opacity-100 text-white">
                Popularity <ChevronDown size={12} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isInstalled={installedAgents.has(agent.id)}
                onInstall={() => {
                  const newSet = new Set(installedAgents);
                  newSet.add(agent.id);
                  setInstalledAgents(newSet);
                }}
                theme={T}
              />
            ))}
          </div>

          {filteredAgents.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="p-4 bg-white/5 rounded-full inline-block">
                <Search size={32} className="opacity-20" />
              </div>
              <p className="text-sm opacity-40 font-bold uppercase tracking-widest">
                No neural units found matching your query
              </p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
