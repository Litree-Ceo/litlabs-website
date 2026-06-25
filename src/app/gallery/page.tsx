"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useClerkAuth } from "@/hooks/useClerkAuth";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import {
  Sparkles,
  Heart,
  MessageSquare,
  Share2,
  Filter,
  Search,
  Grid,
  Loader2,
  TrendingUp,
  Clock,
  Zap,
  ArrowUpRight,
  ChevronDown,
  Camera,
  Play,
  Layers,
  ArrowRight,
} from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  artist: string;
  category: string;
  imageUrl: string;
  likes: number;
  isPublic: boolean;
  isOwner?: boolean;
  createdAt?: string;
  mediaType: "image" | "video";
  videoUrl?: string;
}

const CATEGORIES = [
  "all",
  "cyberpunk",
  "abstract",
  "nature",
  "portrait",
  "3d",
  "architecture",
];

const DEMO_ITEMS: GalleryItem[] = [
  {
    id: "1",
    title: "Neon Genesis City",
    artist: "Pixel Forge",
    category: "cyberpunk",
    imageUrl:
      "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&h=1000&fit=crop",
    likes: 1240,
    isPublic: true,
    mediaType: "image",
  },
  {
    id: "2",
    title: "Abstract Flow",
    artist: "DreamWeaver",
    category: "abstract",
    imageUrl:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=600&fit=crop",
    likes: 890,
    isPublic: true,
    mediaType: "image",
  },
  {
    id: "3",
    title: "Neural Network",
    artist: "DataMancer",
    category: "abstract",
    imageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=1200&fit=crop",
    likes: 2100,
    isPublic: true,
    mediaType: "image",
  },
  {
    id: "4",
    title: "Cyber Samurai",
    artist: "ShadowNet",
    category: "cyberpunk",
    imageUrl:
      "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=800&h=800&fit=crop",
    likes: 1560,
    isPublic: true,
    mediaType: "image",
  },
  {
    id: "5",
    title: "Ethereal Dream",
    artist: "Nebula",
    category: "nature",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=1000&fit=crop",
    likes: 3200,
    isPublic: true,
    mediaType: "image",
  },
  {
    id: "6",
    title: "Void Entity",
    artist: "ShadowNet",
    category: "3d",
    imageUrl:
      "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=800&h=1200&fit=crop",
    likes: 940,
    isPublic: true,
    mediaType: "image",
  },
];

export default function GalleryPage() {
  const { resolvedColors: T } = useTheme();
  const { userId, isLoaded } = useClerkAuth();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedItems, setLikedItems] = useState<Set<string>>(
    new Set(["1", "3"]),
  );
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const filteredItems = useMemo(() => {
    return DEMO_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.artist.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featured = DEMO_ITEMS[4];

  if (!isLoaded || loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: T.bgColor }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
          <span className="text-sm font-bold uppercase tracking-[0.2em] opacity-40">
            Loading Visual Forge...
          </span>
        </div>
      </div>
    );
  }

  return (
    <PageShell
      title="Discovery Gallery"
      subtitle="Explore the peak of AI generation across the LiTree network."
    >
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 space-y-12 pb-20">
        {/* Featured Hero */}
        <div className="relative h-[500px] rounded-3xl overflow-hidden group shadow-2xl">
          <Image
            src={featured.imageUrl}
            alt={featured.title}
            fill
            className="object-cover transition-transform duration-[5s] group-hover:scale-110"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/30 text-indigo-400">
              <Sparkles size={12} /> Creation of the Day
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
              {featured.title}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <span className="text-xs font-bold">
                    {featured.artist.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-bold text-white/80">
                  {featured.artist}
                </span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-1.5 text-sm font-bold text-white/60">
                <Heart size={16} className="text-pink-500 fill-current" />
                {featured.likes.toLocaleString()}
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button className="px-8 py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                View Details <ArrowUpRight size={16} />
              </button>
              <button className="px-8 py-3 bg-white/10 backdrop-blur-md text-white rounded-xl font-black text-xs uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all">
                Collect Asset
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 overflow-x-auto max-w-full scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-indigo-500 text-white shadow-lg"
                    : "opacity-40 hover:opacity-100 hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
                size={16}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gallery..."
                className="w-full bg-white/5 border border-white/10 p-3 pl-10 rounded-2xl outline-none text-xs font-bold focus:border-indigo-500/50 transition-all"
              />
            </div>
            <button className="p-3 rounded-2xl bg-white/5 border border-white/10 opacity-60 hover:opacity-100 transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="gallery-masonry">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden mb-5 break-inside-avoid shadow-xl border border-white/5 hover:border-indigo-500/30 transition-all duration-500"
            >
              <div
                className="relative w-full"
                style={{
                  aspectRatio:
                    idx % 3 === 0 ? "3/4" : idx % 2 === 0 ? "1/1" : "4/3",
                }}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-sm text-white">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-bold text-white/60 bg-white/10 px-2 py-0.5 rounded-full uppercase">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-white/60">
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      {item.artist}
                    </span>
                    <div className="flex items-center gap-3">
                      <button className="hover:text-pink-500 transition-colors">
                        <Heart size={14} />
                      </button>
                      <button className="hover:text-indigo-400 transition-colors">
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-32 text-center space-y-6">
            <div className="p-8 rounded-full bg-white/5 inline-block border border-dashed border-white/10">
              <Search size={48} className="opacity-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold uppercase tracking-widest opacity-40">
                No generations found
              </h3>
              <p className="text-sm opacity-20">
                Try expanding your search or category selection.
              </p>
            </div>
          </div>
        )}

        {/* Load More */}
        {filteredItems.length > 0 && (
          <div className="flex justify-center pt-12">
            <button className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 font-black text-xs uppercase tracking-[0.2em] opacity-60 hover:opacity-100 hover:bg-white/10 transition-all flex items-center gap-3">
              Synchronize More Data <RefreshCw size={14} />
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function RefreshCw({ size, className }: { size?: number; className?: string }) {
  return <TrendingUp size={size} className={className} />;
}
