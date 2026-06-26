"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import {
  Sparkles,
  Heart,
  Share2,
  Filter,
  Search,
  Loader2,
  ArrowUpRight,
  X,
  ZoomIn,
  Grid3X3,
  LayoutGrid,
} from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  artist: string;
  category: string;
  imageUrl: string;
  likes: number;
  isPublic: boolean;
  createdAt?: string;
  mediaType: "image" | "video";
  videoUrl?: string;
  // aspect ratio hint so masonry can size correctly
  aspect?: "tall" | "wide" | "square";
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
      "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=600&h=800&fit=crop",
    likes: 1240,
    isPublic: true,
    mediaType: "image",
    aspect: "tall",
  },
  {
    id: "2",
    title: "Abstract Flow",
    artist: "DreamWeaver",
    category: "abstract",
    imageUrl:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&h=400&fit=crop",
    likes: 890,
    isPublic: true,
    mediaType: "image",
    aspect: "wide",
  },
  {
    id: "3",
    title: "Neural Network",
    artist: "DataMancer",
    category: "abstract",
    imageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=750&fit=crop",
    likes: 2100,
    isPublic: true,
    mediaType: "image",
    aspect: "tall",
  },
  {
    id: "4",
    title: "Cyber Samurai",
    artist: "ShadowNet",
    category: "cyberpunk",
    imageUrl:
      "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=600&h=600&fit=crop",
    likes: 1560,
    isPublic: true,
    mediaType: "image",
    aspect: "square",
  },
  {
    id: "5",
    title: "Ethereal Dream",
    artist: "Nebula",
    category: "nature",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=800&fit=crop",
    likes: 3200,
    isPublic: true,
    mediaType: "image",
    aspect: "tall",
  },
  {
    id: "6",
    title: "Void Entity",
    artist: "ShadowNet",
    category: "3d",
    imageUrl:
      "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=600&h=750&fit=crop",
    likes: 940,
    isPublic: true,
    mediaType: "image",
    aspect: "tall",
  },
  {
    id: "7",
    title: "Crystal Lattice",
    artist: "PixelMage",
    category: "3d",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    likes: 720,
    isPublic: true,
    mediaType: "image",
    aspect: "wide",
  },
  {
    id: "8",
    title: "Midnight Gardens",
    artist: "Nebula",
    category: "nature",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
    likes: 1890,
    isPublic: true,
    mediaType: "image",
    aspect: "square",
  },
  {
    id: "9",
    title: "Urban Decay",
    artist: "GlitchKing",
    category: "architecture",
    imageUrl:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=800&fit=crop",
    likes: 1100,
    isPublic: true,
    mediaType: "image",
    aspect: "tall",
  },
  {
    id: "10",
    title: "Plasma Storm",
    artist: "DataMancer",
    category: "abstract",
    imageUrl:
      "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=600&h=400&fit=crop",
    likes: 654,
    isPublic: true,
    mediaType: "image",
    aspect: "wide",
  },
  {
    id: "11",
    title: "Neon Portrait",
    artist: "Pixel Forge",
    category: "portrait",
    imageUrl:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=750&fit=crop",
    likes: 2780,
    isPublic: true,
    mediaType: "image",
    aspect: "tall",
  },
  {
    id: "12",
    title: "Floating City",
    artist: "ArchViz",
    category: "architecture",
    imageUrl:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=600&fit=crop",
    likes: 1340,
    isPublic: true,
    mediaType: "image",
    aspect: "square",
  },
];

const FULL_SIZE_URLS: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=1400",
  "2": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1400",
  "3": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1400",
  "4": "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=1400",
  "5": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400",
  "6": "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=1400",
  "7": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400",
  "8": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400",
  "9": "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400",
  "10": "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=1400",
  "11": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1400",
  "12": "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400",
};

function aspectRatio(aspect?: string) {
  if (aspect === "tall") return "3/4";
  if (aspect === "wide") return "4/3";
  return "1/1";
}

export default function GalleryPage() {
  const { resolvedColors: T } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedItems, setLikedItems] = useState<Set<string>>(
    new Set(["1", "3"]),
  );
  const [loading, setLoading] = useState(true);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [gridMode, setGridMode] = useState<"masonry" | "uniform">("masonry");

  useEffect(() => {
    fetch("/api/gallery?category=all")
      .then((r) => r.json())
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!lightboxItem) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxItem(null);
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightboxItem]);

  const filteredItems = useMemo(
    () =>
      DEMO_ITEMS.filter((item) => {
        const matchesCategory =
          selectedCategory === "all" || item.category === selectedCategory;
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.artist.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      }),
    [selectedCategory, searchQuery],
  );

  const featured = DEMO_ITEMS[4];

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: T.bgColor }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
          <span className="text-xs font-black uppercase tracking-[0.2em] opacity-40">
            Loading Visual Forge...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: T.bgColor, color: T.textColor }}
    >
      {/* ── Full-bleed Hero ── */}
      <div className="relative w-full h-[55vh] min-h-[320px] overflow-hidden">
        <Image
          src={featured.imageUrl}
          alt={featured.title}
          fill
          className="object-cover scale-105"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-10 pb-10 sm:pb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-indigo-500/20 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/30 text-indigo-400 w-fit">
            <Sparkles size={11} /> Creation of the Day
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none mb-4">
            {featured.title}
          </h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-xs font-black">
              {featured.artist.charAt(0)}
            </div>
            <span className="text-sm font-bold text-white/70">
              {featured.artist}
            </span>
            <div className="h-3 w-px bg-white/20" />
            <div className="flex items-center gap-1.5 text-sm font-bold text-pink-400">
              <Heart size={14} className="fill-current" />
              {featured.likes.toLocaleString()}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setLightboxItem(featured)}
              className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
            >
              View Full <ArrowUpRight size={14} />
            </button>
            <button className="px-6 py-2.5 bg-white/10 backdrop-blur-md text-white rounded-xl font-black text-xs uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all">
              Collect
            </button>
          </div>
        </div>
      </div>

      {/* ── Filters bar ── */}
      <div
        className="sticky top-0 z-20 w-full px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b backdrop-blur-xl"
        style={{
          backgroundColor: `${T.bgColor}e0`,
          borderColor: `${T.borderColor}30`,
        }}
      >
        {/* Category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-0.5 flex-shrink-0 max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-52">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30"
              size={14}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gallery..."
              className="w-full bg-white/5 border border-white/10 py-2 pl-9 pr-3 rounded-full outline-none text-xs font-bold focus:border-indigo-500/50 transition-all"
            />
          </div>
          <button
            onClick={() =>
              setGridMode((m) => (m === "masonry" ? "uniform" : "masonry"))
            }
            className="p-2.5 rounded-full bg-white/5 border border-white/10 opacity-60 hover:opacity-100 transition-all"
            title={
              gridMode === "masonry"
                ? "Switch to uniform grid"
                : "Switch to masonry"
            }
          >
            {gridMode === "masonry" ? (
              <Grid3X3 size={16} />
            ) : (
              <LayoutGrid size={16} />
            )}
          </button>
          <button
            className="p-2.5 rounded-full bg-white/5 border border-white/10 opacity-60 hover:opacity-100 transition-all"
            aria-label="Filter"
            title="Filter"
          >
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* ── Gallery Grid ── */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {filteredItems.length === 0 ? (
          <div className="py-32 text-center space-y-4">
            <div className="p-8 rounded-full bg-white/5 inline-block border border-dashed border-white/10">
              <Search size={40} className="opacity-10" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-widest opacity-30">
              No generations found
            </h3>
            <p className="text-sm opacity-20">
              Try another category or search term.
            </p>
          </div>
        ) : (
          <div
            className={
              gridMode === "masonry"
                ? "columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3"
                : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
            }
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl border border-white/5 hover:border-indigo-500/40 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 ${gridMode === "masonry" ? "break-inside-avoid mb-3" : ""}`}
                onClick={() => setLightboxItem(item)}
              >
                <div
                  className="relative w-full"
                  style={{
                    aspectRatio:
                      gridMode === "uniform" ? "3/4" : aspectRatio(item.aspect),
                  }}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    unoptimized
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-1.5">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-black text-xs text-white leading-tight line-clamp-2">
                        {item.title}
                      </h3>
                      <ZoomIn
                        size={12}
                        className="text-white/60 shrink-0 mt-0.5"
                      />
                    </div>
                    <div className="flex items-center justify-between text-white/50">
                      <span className="text-[10px] font-bold uppercase tracking-wider truncate">
                        {item.artist}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          className="hover:text-pink-500 transition-colors"
                          aria-label="Like"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLikedItems((prev) => {
                              const next = new Set(prev);
                              if (next.has(item.id)) next.delete(item.id);
                              else next.add(item.id);
                              return next;
                            });
                          }}
                        >
                          <Heart
                            size={12}
                            className={
                              likedItems.has(item.id)
                                ? "text-pink-500 fill-current"
                                : ""
                            }
                          />
                        </button>
                        <button
                          className="hover:text-indigo-400 transition-colors"
                          aria-label="Share"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Share2 size={12} />
                        </button>
                      </div>
                    </div>
                    {/* Like count badge */}
                    <div className="flex items-center gap-1 text-[10px] font-bold text-pink-400/70">
                      <Heart size={10} className="fill-current" />
                      {item.likes.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredItems.length > 0 && (
          <div className="flex justify-center pt-14 pb-4">
            <button className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 font-black text-xs uppercase tracking-[0.2em] opacity-60 hover:opacity-100 hover:bg-white/10 transition-all flex items-center gap-3">
              Load More <ArrowUpRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxItem(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
            onClick={() => setLightboxItem(null)}
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <div
            className="relative max-w-4xl w-full max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full"
              style={{ aspectRatio: aspectRatio(lightboxItem.aspect) }}
            >
              <Image
                src={FULL_SIZE_URLS[lightboxItem.id] || lightboxItem.imageUrl}
                alt={lightboxItem.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">
                    {lightboxItem.title}
                  </h2>
                  <p className="text-sm text-white/50 font-bold mt-0.5">
                    {lightboxItem.artist}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-black uppercase tracking-widest transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLikedItems((prev) => {
                        const next = new Set(prev);
                        if (next.has(lightboxItem.id))
                          next.delete(lightboxItem.id);
                        else next.add(lightboxItem.id);
                        return next;
                      });
                    }}
                  >
                    <Heart
                      size={14}
                      className={
                        likedItems.has(lightboxItem.id)
                          ? "text-pink-500 fill-current"
                          : ""
                      }
                    />
                    {lightboxItem.likes.toLocaleString()}
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-black uppercase tracking-widest transition-all">
                    Collect <ArrowUpRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
