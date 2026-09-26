"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  RefreshCw,
  Eye,
  ArrowUp,
  ArrowDown,
  Info,
  Layers,
  Image as ImageIcon,
  Type,
  Check,
} from "lucide-react";
import { HeroSlide, HeroSettings, CategoryCardItem } from "@/types/hero";
import {
  fetchHeroSettings,
  saveHeroSettings,
  DEFAULT_HERO_SETTINGS,
} from "@/utils/supabase/hero";
import { useStoreProducts } from "@/hooks/useProducts";
import { formatPkr } from "@/lib/formatCurrency";

const PRESET_WATCH_IMAGES = [
  { name: "Rolex Submariner", url: "/images/hero-lineup/main.webp" },
  { name: "Tissot PRX Blue", url: "/images/hero-lineup/tissot.webp" },
  { name: "Hublot Big Bang", url: "/images/hero-lineup/hublot.webp" },
  { name: "TAG Heuer Carrera", url: "/images/hero-lineup/tagHeuer.webp" },
  { name: "Rolex Submariner Green", url: "/images/hero-lineup/rolex-submariner.jpg" },
  { name: "Rolex Datejust Jubilee", url: "/images/hero-lineup/rolex-jubilee.webp" },
  { name: "Cartier Santos", url: "/images/hero-lineup/cartier.webp" },
  { name: "Rolex Daytona Ceramic", url: "/images/2s/rolex-daytona-1.jpg" },
  { name: "Rolex GMT-Master II", url: "/images/2s/rolex-gmt-1.jpg" },
  { name: "Cartier Tank Gold", url: "/images/2s/cartier-tank-1.jpg" },
];

export default function AdminHeroPage() {
  const { products } = useStoreProducts();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings State
  const [collectionTag, setCollectionTag] = useState(DEFAULT_HERO_SETTINGS.collection_tag);
  const [headline, setHeadline] = useState(DEFAULT_HERO_SETTINGS.headline);
  const [description, setDescription] = useState(DEFAULT_HERO_SETTINGS.description);
  const [primaryBtnText, setPrimaryBtnText] = useState(DEFAULT_HERO_SETTINGS.primary_btn_text);
  const [primaryBtnLink, setPrimaryBtnLink] = useState(DEFAULT_HERO_SETTINGS.primary_btn_link);
  const [secondaryBtnText, setSecondaryBtnText] = useState(DEFAULT_HERO_SETTINGS.secondary_btn_text);
  const [secondaryBtnLink, setSecondaryBtnLink] = useState(DEFAULT_HERO_SETTINGS.secondary_btn_link);

  // Category Cards
  const [menCard, setMenCard] = useState<CategoryCardItem>(DEFAULT_HERO_SETTINGS.men_card);
  const [womenCard, setWomenCard] = useState<CategoryCardItem>(DEFAULT_HERO_SETTINGS.women_card);

  // Slides
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SETTINGS.slides);

  // Active section tab
  const [activeTab, setActiveTab] = useState<"slides" | "cards" | "text">("slides");

  useEffect(() => {
    fetchHeroSettings().then((data) => {
      if (data) {
        setCollectionTag(data.collection_tag || DEFAULT_HERO_SETTINGS.collection_tag);
        setHeadline(data.headline || DEFAULT_HERO_SETTINGS.headline);
        setDescription(data.description || DEFAULT_HERO_SETTINGS.description);
        setPrimaryBtnText(data.primary_btn_text || DEFAULT_HERO_SETTINGS.primary_btn_text);
        setPrimaryBtnLink(data.primary_btn_link || DEFAULT_HERO_SETTINGS.primary_btn_link);
        setSecondaryBtnText(data.secondary_btn_text || DEFAULT_HERO_SETTINGS.secondary_btn_text);
        setSecondaryBtnLink(data.secondary_btn_link || DEFAULT_HERO_SETTINGS.secondary_btn_link);
        if (data.men_card) setMenCard(data.men_card);
        if (data.women_card) setWomenCard(data.women_card);
        if (Array.isArray(data.slides) && data.slides.length > 0) {
          setSlides(data.slides);
        }
      }
      setLoading(false);
    });
  }, []);

  // Slide helpers
  const handleAddSlide = () => {
    if (slides.length >= 10) {
      toast.error("Maximum 10 hero slides allowed");
      return;
    }
    const newId = Date.now();
    const newSlide: HeroSlide = {
      id: newId,
      image: "https://res.cloudinary.com/your-cloud/image/upload/sample.jpg",
      badge: "New Arrival",
      model: "Luxury Timepiece",
      price: "Rs. 25,000",
      category: "Luxury Watch",
      link: "/shop-without-sidebar",
      description: "Handcrafted luxury timepiece with premium automatic movement.",
    };
    setSlides([...slides, newSlide]);
    toast.success("New slide added. Enter your Cloudinary image URL.");
  };

  const handleUpdateSlide = (id: string | number, field: keyof HeroSlide, value: string) => {
    setSlides(slides.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleDeleteSlide = (id: string | number) => {
    if (slides.length <= 1) {
      toast.error("At least 1 slide is required for the hero section");
      return;
    }
    setSlides(slides.filter((s) => s.id !== id));
    toast.success("Slide removed");
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setSlides(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === slides.length - 1) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setSlides(updated);
  };

  // Populate slide from an existing store product
  const handlePickProductForSlide = (slideId: string | number, productId: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const img =
      prod.imgs?.previews?.[0] ||
      prod.imgs?.thumbnails?.[0] ||
      PRESET_WATCH_IMAGES[0].url;
    const priceStr = formatPkr(prod.discountedPrice > 0 ? prod.discountedPrice : prod.price);

    setSlides(
      slides.map((s) =>
        s.id === slideId
          ? {
              ...s,
              image: img,
              model: prod.title,
              badge: prod.category || "Masterpiece",
              price: priceStr,
              link: `/shop-details/${prod.id}`,
              description: prod.description || `${prod.title} with premium Swiss finishing.`,
            }
          : s
      )
    );
    toast.success(`Populated from "${prod.title}"`);
  };

  // Save all settings
  const handleSaveAll = async () => {
    setSaving(true);
    const payload: HeroSettings = {
      collection_tag: collectionTag.trim(),
      headline: headline.trim(),
      description: description.trim(),
      primary_btn_text: primaryBtnText.trim(),
      primary_btn_link: primaryBtnLink.trim(),
      secondary_btn_text: secondaryBtnText.trim(),
      secondary_btn_link: secondaryBtnLink.trim(),
      men_card: menCard,
      women_card: womenCard,
      slides: slides,
    };

    const res = await saveHeroSettings(payload);
    setSaving(false);

    if (res.success) {
      toast.success("Hero banner updated successfully! Live on homepage.");
    } else {
      toast.error(res.error || "Failed to update hero banner");
    }
  };

  // Reset to defaults
  const handleResetDefaults = () => {
    if (!confirm("Are you sure you want to restore default hero settings?")) return;
    setCollectionTag(DEFAULT_HERO_SETTINGS.collection_tag);
    setHeadline(DEFAULT_HERO_SETTINGS.headline);
    setDescription(DEFAULT_HERO_SETTINGS.description);
    setPrimaryBtnText(DEFAULT_HERO_SETTINGS.primary_btn_text);
    setPrimaryBtnLink(DEFAULT_HERO_SETTINGS.primary_btn_link);
    setSecondaryBtnText(DEFAULT_HERO_SETTINGS.secondary_btn_text);
    setSecondaryBtnLink(DEFAULT_HERO_SETTINGS.secondary_btn_link);
    setMenCard(DEFAULT_HERO_SETTINGS.men_card);
    setWomenCard(DEFAULT_HERO_SETTINGS.women_card);
    setSlides(DEFAULT_HERO_SETTINGS.slides);
    toast.success("Reset to defaults. Click 'Save Changes' to apply.");
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3 text-stone-500">
          <RefreshCw className="w-6 h-6 animate-spin text-stone-700" />
          <span className="text-sm font-medium">Loading Hero Banner settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Homepage Customization</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mt-1">
            Hero Section Manager
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Upload or paste Cloudinary image URLs for your main watch showcase carousel and category cards.
            Changes update instantly on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded hover:bg-stone-50 transition shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Site</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </Link>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-60 rounded transition shadow-sm active:scale-[0.99]"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Cloudinary Info Banner */}
      <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-lg flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs md:text-sm text-amber-900 space-y-1">
          <p className="font-semibold">How to upload Cloudinary images:</p>
          <p className="text-amber-800 leading-relaxed">
            Upload your watch picture to your Cloudinary Media Library, copy its delivery URL (e.g.{" "}
            <code className="bg-amber-100/80 px-1.5 py-0.5 rounded text-amber-950 font-mono text-xs">
              https://res.cloudinary.com/.../watch.png
            </code>
            ), and paste it directly into the image field. High-resolution transparent PNG or clean WebP images look best!
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-stone-200 gap-2">
        <button
          onClick={() => setActiveTab("slides")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition ${
            activeTab === "slides"
              ? "border-stone-900 text-stone-900"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Watch Showcase Slides ({slides.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("cards")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition ${
            activeTab === "cards"
              ? "border-stone-900 text-stone-900"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Category Cards (Men / Women)</span>
        </button>

        <button
          onClick={() => setActiveTab("text")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition ${
            activeTab === "text"
              ? "border-stone-900 text-stone-900"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Headings &amp; Buttons</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: HERO SLIDES SHOWCASE                                    */}
      {/* ============================================================== */}
      {activeTab === "slides" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Hero Watch Carousel Slides
              </h2>
              <p className="text-xs text-stone-500">
                These watches rotate automatically on the right side of the desktop hero and top of mobile hero.
              </p>
            </div>
            <button
              onClick={handleAddSlide}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slide</span>
            </button>
          </div>

          <div className="space-y-4">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-4"
              >
                {/* Header Row: Slide # + Reorder + Delete */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-stone-800">
                      {slide.model || `Slide #${index + 1}`}
                    </span>
                    {slide.badge && (
                      <span className="text-[11px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                        {slide.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      title="Move Up"
                      className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded disabled:opacity-30 transition"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === slides.length - 1}
                      title="Move Down"
                      className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded disabled:opacity-30 transition"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(slide.id)}
                      title="Delete Slide"
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body: Preview + Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-5 items-start">
                  {/* Live Image Preview */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-36 h-36 bg-[#D8D3CB] rounded-md overflow-hidden flex items-center justify-center border border-stone-200 shadow-inner">
                      {slide.image ? (
                        <Image
                          src={slide.image}
                          alt={slide.model || "Preview"}
                          fill
                          sizes="144px"
                          unoptimized={typeof slide.image === "string" && (slide.image.includes("cloudinary") || slide.image.startsWith("http"))}
                          className="object-contain p-2"
                        />
                      ) : (
                        <span className="text-xs text-stone-400">No Image</span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-400 font-mono">Live Preview</span>
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Cloudinary Image URL */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Cloudinary / Image URL <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={slide.image}
                        onChange={(e) => handleUpdateSlide(slide.id, "image", e.target.value)}
                        placeholder="https://res.cloudinary.com/... or /images/..."
                        className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded bg-stone-50 focus:bg-white focus:border-stone-900 focus:outline-none transition"
                      />

                      {/* Quick Presets / Choose from Store Products */}
                      <div className="mt-2 flex items-center gap-2 flex-wrap text-xs">
                        <span className="text-stone-500 text-[11px]">Quick product pick:</span>
                        <select
                          className="text-xs border border-stone-300 rounded px-2 py-1 bg-white text-stone-700 focus:outline-none"
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val) handlePickProductForSlide(slide.id, val);
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            -- Choose an uploaded watch --
                          </option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.title} ({formatPkr(p.discountedPrice || p.price)})
                            </option>
                          ))}
                        </select>

                        <span className="text-stone-300">|</span>
                        <span className="text-stone-500 text-[11px]">Presets:</span>
                        {PRESET_WATCH_IMAGES.slice(0, 4).map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => handleUpdateSlide(slide.id, "image", preset.url)}
                            className="text-[11px] px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Model Name */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Watch Model Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={slide.model}
                        onChange={(e) => handleUpdateSlide(slide.id, "model", e.target.value)}
                        placeholder="e.g. Rolex Submariner Date"
                        className="w-full text-sm px-3 py-1.5 border border-stone-300 rounded focus:border-stone-900 focus:outline-none transition"
                      />
                    </div>

                    {/* Badge / Tag */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Badge / Sub-tag
                      </label>
                      <input
                        type="text"
                        value={slide.badge}
                        onChange={(e) => handleUpdateSlide(slide.id, "badge", e.target.value)}
                        placeholder="e.g. Featured Masterpiece / Bestseller"
                        className="w-full text-sm px-3 py-1.5 border border-stone-300 rounded focus:border-stone-900 focus:outline-none transition"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Display Price <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={slide.price}
                        onChange={(e) => handleUpdateSlide(slide.id, "price", e.target.value)}
                        placeholder="e.g. Rs. 34,500"
                        className="w-full text-sm px-3 py-1.5 border border-stone-300 rounded focus:border-stone-900 focus:outline-none transition"
                      />
                    </div>

                    {/* Link */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Destination Link
                      </label>
                      <input
                        type="text"
                        value={slide.link}
                        onChange={(e) => handleUpdateSlide(slide.id, "link", e.target.value)}
                        placeholder="e.g. /shop-details/1 or /shop-without-sidebar?q=submariner"
                        className="w-full text-sm px-3 py-1.5 border border-stone-300 rounded focus:border-stone-900 focus:outline-none transition"
                      />
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Description / Watch Details
                      </label>
                      <input
                        type="text"
                        value={slide.description || ""}
                        onChange={(e) => handleUpdateSlide(slide.id, "description", e.target.value)}
                        placeholder="e.g. Cerachrom ceramic bezel, 3135 automatic movement, and oyster steel finish."
                        className="w-full text-sm px-3 py-1.5 border border-stone-300 rounded focus:border-stone-900 focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-60 rounded transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Slides & Hero Banner"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: CATEGORY CARDS (MEN & WOMEN)                            */}
      {/* ============================================================== */}
      {activeTab === "cards" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">
              Hero Category Cards
            </h2>
            <p className="text-xs text-stone-500">
              These two cards sit on the bottom-left of the hero banner (desktop) and below copy (mobile).
              Paste your Cloudinary image URLs below to instantly customize both banners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Men's Watches */}
            <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-sm font-bold text-stone-900">Card 1: Men&apos;s Watches</span>
                <span className="text-xs font-mono text-stone-400">{menCard.link}</span>
              </div>

              {/* Preview */}
              <div className="relative h-44 w-full bg-[#D8D3CB] rounded-md overflow-hidden flex items-center justify-center border border-stone-200">
                {menCard.image ? (
                  <Image
                    src={menCard.image}
                    alt={menCard.title || "Men's watches"}
                    fill
                    sizes="300px"
                    unoptimized={typeof menCard.image === "string" && (menCard.image.includes("cloudinary") || menCard.image.startsWith("http"))}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-xs text-stone-400">No Image</span>
                )}
              </div>

              {/* Form */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cloudinary / Image URL
                  </label>
                  <input
                    type="text"
                    value={menCard.image}
                    onChange={(e) => setMenCard({ ...menCard, image: e.target.value })}
                    placeholder="https://res.cloudinary.com/... or /images/2s/..."
                    className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded bg-stone-50 focus:bg-white focus:border-stone-900 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={menCard.title}
                    onChange={(e) => setMenCard({ ...menCard, title: e.target.value })}
                    className="w-full text-sm px-3 py-1.5 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Destination Link
                  </label>
                  <input
                    type="text"
                    value={menCard.link}
                    onChange={(e) => setMenCard({ ...menCard, link: e.target.value })}
                    className="w-full text-sm px-3 py-1.5 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Women's Watches */}
            <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-sm font-bold text-stone-900">Card 2: Women&apos;s Watches</span>
                <span className="text-xs font-mono text-stone-400">{womenCard.link}</span>
              </div>

              {/* Preview */}
              <div className="relative h-44 w-full bg-[#D8D3CB] rounded-md overflow-hidden flex items-center justify-center border border-stone-200">
                {womenCard.image ? (
                  <Image
                    src={womenCard.image}
                    alt={womenCard.title || "Women's watches"}
                    fill
                    sizes="300px"
                    unoptimized={typeof womenCard.image === "string" && (womenCard.image.includes("cloudinary") || womenCard.image.startsWith("http"))}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-xs text-stone-400">No Image</span>
                )}
              </div>

              {/* Form */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cloudinary / Image URL
                  </label>
                  <input
                    type="text"
                    value={womenCard.image}
                    onChange={(e) => setWomenCard({ ...womenCard, image: e.target.value })}
                    placeholder="https://res.cloudinary.com/... or /images/2s/..."
                    className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded bg-stone-50 focus:bg-white focus:border-stone-900 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={womenCard.title}
                    onChange={(e) => setWomenCard({ ...womenCard, title: e.target.value })}
                    className="w-full text-sm px-3 py-1.5 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Destination Link
                  </label>
                  <input
                    type="text"
                    value={womenCard.link}
                    onChange={(e) => setWomenCard({ ...womenCard, link: e.target.value })}
                    className="w-full text-sm px-3 py-1.5 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-60 rounded transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Category Cards"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: HEADINGS & BUTTONS                                      */}
      {/* ============================================================== */}
      {activeTab === "text" && (
        <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">
              Hero Text &amp; Call-To-Action Buttons
            </h2>
            <p className="text-xs text-stone-500">
              Customize the headline, subtitle, and primary/secondary button labels and links.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Top Collection Tag
              </label>
              <input
                type="text"
                value={collectionTag}
                onChange={(e) => setCollectionTag(e.target.value)}
                placeholder="e.g. New collection · 2026"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Main Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Time, worn with glory."
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none font-serif text-lg"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Hero Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Classic, dress and everyday watches, picked for every wrist and every occasion."
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Primary Button Label
              </label>
              <input
                type="text"
                value={primaryBtnText}
                onChange={(e) => setPrimaryBtnText(e.target.value)}
                placeholder="Shop the collection"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Primary Button Link
              </label>
              <input
                type="text"
                value={primaryBtnLink}
                onChange={(e) => setPrimaryBtnLink(e.target.value)}
                placeholder="/shop-without-sidebar"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Secondary Button Label
              </label>
              <input
                type="text"
                value={secondaryBtnText}
                onChange={(e) => setSecondaryBtnText(e.target.value)}
                placeholder="New in"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Secondary Button Link
              </label>
              <input
                type="text"
                value={secondaryBtnLink}
                onChange={(e) => setSecondaryBtnLink(e.target.value)}
                placeholder="/shop-without-sidebar?sort=newest"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs text-stone-500 hover:text-stone-800 underline"
            >
              Reset all to defaults
            </button>

            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-60 rounded transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
