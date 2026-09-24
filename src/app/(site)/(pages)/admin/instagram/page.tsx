"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Instagram,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  Check,
  RefreshCw,
  Eye,
  Heart,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Info,
} from "lucide-react";
import { InstagramPost, InstagramSettings } from "@/types/instagram";
import {
  fetchInstagramSettings,
  saveInstagramSettings,
} from "@/utils/supabase/instagram";

const WATCH_GALLERY_PRESETS = [
  { name: "Tissot PRX Blue", url: "/images/hero-lineup/tissot.webp" },
  { name: "Rolex Submariner", url: "/images/hero-lineup/rolex-submariner.jpg" },
  { name: "Cartier Santos", url: "/images/hero-lineup/cartier.webp" },
  { name: "Patek Nautilus", url: "/images/hero-lineup/main.webp" },
  { name: "Rolex Datejust Jubilee", url: "/images/hero-lineup/rolex-jubilee.webp" },
  { name: "Rolex Daytona Ceramic", url: "/images/2s/rolex-daytona-1.jpg" },
  { name: "Rolex GMT-Master II", url: "/images/2s/rolex-gmt-1.jpg" },
  { name: "Cartier Tank", url: "/images/2s/cartier-tank-1.jpg" },
  { name: "TAG Heuer Carrera", url: "/images/hero-lineup/tagHeuer.webp" },
  { name: "Hublot Diamond", url: "/images/hero-lineup/hublot.webp" },
];

export default function AdminInstagramPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileUrl, setProfileUrl] = useState("https://www.instagram.com/gloriatimes.pk");
  const [handle, setHandle] = useState("@gloriatimes.pk");
  const [title, setTitle] = useState("Follow Us On Instagram");
  const [subtitle, setSubtitle] = useState("Tag @gloriatimes to be featured in our luxury timepiece gallery");
  const [enabled, setEnabled] = useState(true);
  const [posts, setPosts] = useState<InstagramPost[]>([]);

  useEffect(() => {
    fetchInstagramSettings().then((data) => {
      if (data) {
        setProfileUrl(data.profile_url || "");
        setHandle(data.handle || "");
        setTitle(data.title || "Follow Us On Instagram");
        setSubtitle(data.subtitle || "");
        setEnabled(data.enabled ?? true);
        setPosts(data.posts || []);
      }
      setLoading(false);
    });
  }, []);

  const handleAddPost = () => {
    if (posts.length >= 8) {
      toast.error("You can add up to 8 posts (4 to 5 are displayed above the footer)");
      return;
    }
    const newId = String(Date.now());
    const randomPreset = WATCH_GALLERY_PRESETS[posts.length % WATCH_GALLERY_PRESETS.length];
    const newPost: InstagramPost = {
      id: newId,
      post_url: profileUrl || "https://www.instagram.com/gloriatimes.pk",
      image_url: randomPreset.url,
      caption: "New Luxury Watch Arrival",
      likes: "1.2k",
    };
    setPosts([...posts, newPost]);
    toast.success("New Instagram post card added");
  };

  const handleUpdatePost = (id: string, field: keyof InstagramPost, value: string) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleDeletePost = (id: string) => {
    if (posts.length <= 1) {
      toast.error("At least 1 post is required in the feed");
      return;
    }
    setPosts(posts.filter((p) => p.id !== id));
    toast.success("Post removed");
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...posts];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setPosts(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === posts.length - 1) return;
    const updated = [...posts];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setPosts(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileUrl.trim()) {
      toast.error("Please enter your Instagram Profile URL");
      return;
    }

    setSaving(true);
    const payload: InstagramSettings = {
      profile_url: profileUrl.trim(),
      handle: handle.trim() || "@gloriatimes.pk",
      title: title.trim() || "Follow Us On Instagram",
      subtitle: subtitle.trim(),
      enabled,
      posts,
    };

    const res = await saveInstagramSettings(payload);
    setSaving(false);

    if (res.success) {
      toast.success("✓ Instagram feed settings saved and live!");
    } else {
      toast.error(res.error || "Failed to save Instagram settings");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-[#8B6914]" />
        <span className="ml-2 text-sm text-[#6B5344]">Loading Instagram feed settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#EDE4D8] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-sm">
              <Instagram className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold text-[#1F1209]">
              Instagram Feed &amp; Social Integration
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#6B5344]">
            Add your store’s Instagram profile link and curate the 4–5 recent posts shown directly above the footer.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1F1209] hover:bg-black text-[#FDF4E3] text-xs font-semibold uppercase tracking-wider transition shadow-sm active:scale-95 disabled:opacity-50 self-start sm:self-auto"
        >
          {saving ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Account Settings Card */}
        <section className="rounded-xl border border-[#E8DFD4]/90 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#EDE4D8] pb-4 mb-5">
            <div>
              <h3 className="text-base font-semibold text-[#1F1209]">
                Instagram Account &amp; Profile Link
              </h3>
              <p className="text-xs text-[#6B5344] mt-0.5">
                Customers will be directed to this link when clicking &quot;Follow on Instagram&quot;.
              </p>
            </div>

            {/* Toggle Active Switch */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <span className="text-xs font-semibold text-[#4A2F19]">
                {enabled ? "Feed Enabled" : "Feed Disabled"}
              </span>
              <div
                onClick={() => setEnabled(!enabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                  enabled ? "bg-[#16A34A]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Instagram Profile Link <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  placeholder="https://www.instagram.com/yourhandle"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  className="w-full h-10 px-3 pr-9 text-xs sm:text-sm rounded-lg border border-[#DDD5CC] focus:outline-none focus:ring-2 focus:ring-[#8B6914] bg-[#FAF8F5]/60"
                />
                <a
                  href={profileUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
                  title="Open Instagram Link"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                e.g. https://www.instagram.com/gloriatimes.pk
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Account Handle
              </label>
              <input
                type="text"
                placeholder="@gloriatimes.pk"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-[#DDD5CC] focus:outline-none focus:ring-2 focus:ring-[#8B6914] bg-[#FAF8F5]/60"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Display name on button &amp; header tag
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Follow Us On Instagram"
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-[#DDD5CC] focus:outline-none focus:ring-2 focus:ring-[#8B6914] bg-[#FAF8F5]/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Section Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Tag @gloriatimes to be featured in our timepiece gallery"
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-[#DDD5CC] focus:outline-none focus:ring-2 focus:ring-[#8B6914] bg-[#FAF8F5]/60"
              />
            </div>
          </div>
        </section>

        {/* 2. Recent 4–5 Posts Curated Cards */}
        <section className="rounded-xl border border-[#E8DFD4]/90 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#EDE4D8] pb-4 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#1F1209]">
                  Recent Instagram Posts (Top 4–5 Displayed)
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FAF5EE] text-[#8B6914] font-bold border border-[#EDE4D8]">
                  {posts.length} {posts.length === 1 ? "Post" : "Posts"}
                </span>
              </div>
              <p className="text-xs text-[#6B5344] mt-0.5">
                Each card links directly to that specific Instagram post or your profile.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddPost}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#4A2F19] hover:bg-[#3A2413] text-white text-xs font-semibold shadow-sm transition active:scale-95 self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Post</span>
            </button>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {posts.map((post, idx) => (
              <div
                key={post.id || idx}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-[#EDE4D8] bg-[#FAF8F5]/50 hover:bg-[#FAF8F5] transition"
              >
                {/* Index / Badge */}
                <div className="flex sm:flex-col items-center gap-1 shrink-0 text-[#8B7355]">
                  <span className="text-xs font-bold w-6 h-6 rounded-full bg-white border border-[#EDE4D8] flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div className="flex sm:flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className="p-1 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === posts.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className="p-1 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Thumbnail Preview */}
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-white border border-[#EDE4D8] shrink-0">
                  <Image
                    src={post.image_url || "/images/hero-lineup/tissot.webp"}
                    alt={post.caption || "Preview"}
                    fill
                    className="object-contain p-1"
                  />
                </div>

                {/* Form Fields for this post */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 flex-1 w-full">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                      Post Link
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://instagram.com/p/..."
                        value={post.post_url}
                        onChange={(e) => handleUpdatePost(post.id, "post_url", e.target.value)}
                        className="w-full h-8 px-2.5 text-xs rounded-md border border-[#DDD5CC] bg-white focus:outline-none focus:ring-1 focus:ring-[#8B6914]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                      Image Path / URL
                    </label>
                    <input
                      type="text"
                      placeholder="/images/hero-lineup/tissot.webp"
                      value={post.image_url}
                      onChange={(e) => handleUpdatePost(post.id, "image_url", e.target.value)}
                      className="w-full h-8 px-2.5 text-xs rounded-md border border-[#DDD5CC] bg-white focus:outline-none focus:ring-1 focus:ring-[#8B6914]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                      Caption / Watch Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rolex Submariner on wrist"
                      value={post.caption || ""}
                      onChange={(e) => handleUpdatePost(post.id, "caption", e.target.value)}
                      className="w-full h-8 px-2.5 text-xs rounded-md border border-[#DDD5CC] bg-white focus:outline-none focus:ring-1 focus:ring-[#8B6914]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                      Likes Display (e.g. 1.8k)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2.4k"
                      value={post.likes || ""}
                      onChange={(e) => handleUpdatePost(post.id, "likes", e.target.value)}
                      className="w-full h-8 px-2.5 text-xs rounded-md border border-[#DDD5CC] bg-white focus:outline-none focus:ring-1 focus:ring-[#8B6914]"
                    />
                  </div>
                </div>

                {/* Delete Button */}
                <div className="self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Remove Post"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Select Preset Images Guide */}
          <div className="mt-5 p-4 rounded-xl bg-[#FAF8F5] border border-[#EDE4D8]">
            <p className="text-xs font-semibold text-[#4A2F19] mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#C9A227]" />
              <span>Quick Select High-Resolution Watch Images:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {WATCH_GALLERY_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (posts.length > 0) {
                      // Apply to last post or add new
                      handleUpdatePost(posts[posts.length - 1].id, "image_url", preset.url);
                      toast.success(`Set image to ${preset.name}`);
                    }
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-[#DDD5CC] hover:border-[#8B6914] text-[#4A2F19] hover:bg-[#FAF5EE] transition"
                  title={`Click to assign to latest post: ${preset.url}`}
                >
                  + {preset.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Live Storefront Preview */}
        <section className="rounded-xl border border-[#E8DFD4]/90 bg-white p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#EDE4D8] pb-3 mb-5">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#8B6914]" />
              <h3 className="text-base font-semibold text-[#1F1209]">
                Live Storefront Preview (Shown Above Footer)
              </h3>
            </div>
            <span className="text-[11px] text-[#8B7355]">
              Real-time customer view
            </span>
          </div>

          <div className="rounded-xl bg-[#FAF8F5] border border-[#EDE4D8] p-6 sm:p-8">
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 text-[#8B6914] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                <Instagram className="h-3 w-3" />
                <span>Gloria Times On Instagram</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-[#1F1209]">
                {title || "Follow Us On Instagram"}
              </h4>
              <p className="mt-1 text-xs text-[#6B5344]">
                {subtitle}
              </p>
              <div className="mt-2 text-xs font-semibold text-[#8B6914]">
                {handle}
              </div>
            </div>

            {/* 5 Cards Grid Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {posts.slice(0, 5).map((post, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-white border border-[#EDE4D8] shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <Image
                    src={post.image_url || "/images/hero-lineup/tissot.webp"}
                    alt={post.caption || "Watch"}
                    fill
                    className="object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                    <div className="flex justify-between items-center">
                      <Instagram className="h-3.5 w-3.5" />
                      {post.likes && (
                        <span className="text-[10px] flex items-center gap-1">
                          <Heart className="h-2.5 w-2.5 fill-rose-500 text-rose-500" />
                          {post.likes}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-white/90 line-clamp-2">
                      {post.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1F1209] text-white text-xs font-semibold uppercase tracking-wider shadow">
                <Instagram className="h-3.5 w-3.5 text-[#F2C27B]" />
                <span>Follow {handle} On Instagram</span>
              </span>
            </div>
          </div>
        </section>

        {/* Floating Bottom Save Action */}
        <div className="sticky bottom-4 z-20 flex items-center justify-between gap-3 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#EDE4D8] shadow-lg">
          <p className="text-xs text-[#6B5344]">
            Changes are saved to Supabase and update the website instantly.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#1F1209] hover:bg-black text-[#FDF4E3] text-xs font-semibold uppercase tracking-wider transition shadow-sm active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5 text-[#16A34A]" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
