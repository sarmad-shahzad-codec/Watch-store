"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_WATCH_IMAGES } from "@/constants/heroWatchImages";
import { useStoreProducts } from "@/hooks/useProducts";
import { formatPkr } from "@/lib/formatCurrency";
import { HeroSlide, HeroSettings } from "@/types/hero";
import { DEFAULT_HERO_SETTINGS, fetchHeroSettings } from "@/utils/supabase/hero";

const Hero = () => {
  const { products } = useStoreProducts();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [settings, setSettings] = useState<HeroSettings>(DEFAULT_HERO_SETTINGS);

  useEffect(() => {
    fetchHeroSettings().then((data) => {
      if (data) {
        setSettings(data);
      }
    });
  }, []);

  // Determine active hero slides: admin configured slides have top priority,
  // falling back to uploaded products, then default showcase slides.
  const heroSlides = useMemo<HeroSlide[]>(() => {
    if (settings.slides && settings.slides.length > 0) {
      return settings.slides;
    }

    const validWatches = products.filter(
      (p) => !p.brand?.toLowerCase().includes("accessories") && p.price > 0
    );
    const list = validWatches.length > 0 ? validWatches : products;
    if (list && list.length > 0) {
      return list.slice(0, 6).map((p, idx) => {
        const img =
          p.imgs?.previews?.[0] ||
          p.imgs?.thumbnails?.[0] ||
          DEFAULT_HERO_SETTINGS.slides[idx % DEFAULT_HERO_SETTINGS.slides.length]?.image ||
          "/images/tissot.webp";
        const actualPrice = formatPkr(p.discountedPrice > 0 ? p.discountedPrice : p.price);
        return {
          id: p.id,
          image: img,
          badge: p.category || (p.discountedPrice < p.price ? "Featured Deal" : "Masterpiece"),
          model: p.title,
          price: actualPrice,
          category: p.category || "Luxury Watch",
          link: `/shop-details/${p.id}`,
          description: p.description || `${p.title} crafted with high precision and premium Swiss finishing.`,
        };
      });
    }

    return DEFAULT_HERO_SETTINGS.slides;
  }, [settings.slides, products]);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const current = heroSlides[currentSlide] || heroSlides[0] || DEFAULT_HERO_SETTINGS.slides[0];
  const menCard = settings.men_card || DEFAULT_HERO_SETTINGS.men_card;
  const womenCard = settings.women_card || DEFAULT_HERO_SETTINGS.women_card;

  return (
    <section
      className="w-full bg-[#EEEBE6] text-[#1C1C1B] pt-[92px] lg:pt-[112px] transition-colors"
      style={{ fontFamily: "'Instrument Sans', sans-serif" }}
    >
      <div className="w-full max-w-[1440px] mx-auto">
        {/* ============================================================== */}
        {/* DESKTOP LAYOUT (Matches HeroDesktop.dc.html)                   */}
        {/* ============================================================== */}
        <div className="hidden lg:grid grid-cols-[500px_minmax(0,1fr)] xl:grid-cols-[540px_minmax(0,1fr)] gap-6 xl:gap-8 px-8 xl:px-12 py-8 min-h-[780px]">
          {/* Left Column */}
          <div className="flex flex-col justify-between py-2 pr-4">
            {/* Top Text & CTAs */}
            <div className="flex flex-col gap-6">
              <div className="text-[13px] font-medium text-[#5E5A54] tracking-wide">
                {settings.collection_tag || "New collection · 2026"}
              </div>

              <h1 className="m-0 text-[56px] xl:text-[66px] font-medium leading-[1.02] tracking-[-2.2px] text-[#1C1C1B]">
                {settings.headline || "Time, worn with glory."}
              </h1>

              <p className="m-0 max-w-[440px] text-[16px] xl:text-[17px] leading-[1.6] text-[#5E5A54]">
                {settings.description ||
                  "Classic, dress and everyday watches, picked for every wrist and every occasion."}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-1">
                <Link
                  href={settings.primary_btn_link || "/shop-without-sidebar"}
                  className="h-[52px] px-7 flex items-center gap-2.5 bg-[#1C1C1B] text-[#EEEBE6] hover:bg-black rounded-[2px] text-[15px] font-medium transition shadow-sm active:scale-[0.99]"
                >
                  <span>{settings.primary_btn_text || "Shop the collection"}</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </Link>

                <Link
                  href={settings.secondary_btn_link || "/shop-without-sidebar?sort=newest"}
                  className="h-[52px] px-6 flex items-center border border-[#1C1C1B] hover:bg-[#1C1C1B]/5 text-[#1C1C1B] rounded-[2px] text-[15px] font-medium transition"
                >
                  {settings.secondary_btn_text || "New in"}
                </Link>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {[
                  { label: "Men", href: "/category/men" },
                  { label: "Women", href: "/category/women" },
                  { label: "Automatic", href: "/category/automatic" },
                  { label: "Minimal", href: "/category/minimal" },
                  { label: "Premium", href: "/category/premium" },
                ].map((pill) => (
                  <Link
                    key={pill.label}
                    href={pill.href}
                    className="h-10 px-4.5 flex items-center border border-[#CFC9BF] hover:border-[#1C1C1B] hover:text-[#1C1C1B] rounded-full text-[14px] font-medium text-[#1C1C1B] transition hover:bg-black/5"
                  >
                    {pill.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Category Cards: Men & Women (Dynamic Cloudinary / Images) */}
            <div className="grid grid-cols-2 gap-4 pt-10">
              {/* Men's Watches Card */}
              <Link
                href={menCard.link || "/category/men"}
                className="group flex flex-col gap-2.5 text-decoration-none"
              >
                <div className="relative h-[190px] w-full bg-[#D8D3CB] rounded-[2px] overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:shadow-md">
                  <Image
                    src={menCard.image || "/images/2s/rolex-submariner-1.jpg"}
                    alt={menCard.title || "Men's watches"}
                    fill
                    sizes="260px"
                    unoptimized={
                      typeof menCard.image === "string" &&
                      (menCard.image.includes("cloudinary") || menCard.image.startsWith("http"))
                    }
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
                <span className="flex justify-between items-center text-[14px] font-medium text-[#1C1C1B] group-hover:text-[#6F6556] transition-colors">
                  <span>{menCard.title || "Men's watches"}</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={1.75}
                  />
                </span>
              </Link>

              {/* Women's Watches Card */}
              <Link
                href={womenCard.link || "/category/women"}
                className="group flex flex-col gap-2.5 text-decoration-none"
              >
                <div className="relative h-[190px] w-full bg-[#D8D3CB] rounded-[2px] overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:shadow-md">
                  <Image
                    src={womenCard.image || "/images/2s/cartier-tank-1.jpg"}
                    alt={womenCard.title || "Women's watches"}
                    fill
                    sizes="260px"
                    unoptimized={
                      typeof womenCard.image === "string" &&
                      (womenCard.image.includes("cloudinary") || womenCard.image.startsWith("http"))
                    }
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
                <span className="flex justify-between items-center text-[14px] font-medium text-[#1C1C1B] group-hover:text-[#6F6556] transition-colors">
                  <span>{womenCard.title || "Women's watches"}</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={1.75}
                  />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Photo Showcase with Floating Product Card */}
          <div className="relative flex flex-col justify-end rounded-[2px] overflow-hidden bg-[#D8D3CB] min-h-[640px] xl:min-h-[700px] shadow-sm">
            {/* Main Watch Photo */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <Image
                key={current.id}
                src={current.image}
                alt={current.model}
                fill
                priority
                sizes="(max-width: 1440px) 50vw, 750px"
                unoptimized={
                  typeof current.image === "string" &&
                  (current.image.includes("cloudinary") || current.image.startsWith("http"))
                }
                className="object-contain p-6 sm:p-10 drop-shadow-[0_25px_45px_rgba(0,0,0,0.35)] transition-all duration-700 ease-out"
              />
            </div>

            {/* Subtle Gradient Veil */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

            {/* Floating Featured Product Card (Bottom Left) */}
            <Link
              href={current.link || "/shop-without-sidebar"}
              className="absolute left-6 bottom-6 w-[330px] p-3.5 bg-[#EEEBE6]/95 backdrop-blur-md border border-[#CFC9BF] rounded-[2px] flex items-center gap-3.5 shadow-xl hover:bg-white transition-all group"
            >
              <div className="relative w-[72px] h-[72px] bg-[#D8D3CB] rounded-[2px] overflow-hidden shrink-0">
                <Image
                  src={current.image}
                  alt={current.model}
                  fill
                  sizes="72px"
                  unoptimized={
                    typeof current.image === "string" &&
                    (current.image.includes("cloudinary") || current.image.startsWith("http"))
                  }
                  className="object-contain p-1"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <span className="text-[11px] font-medium text-[#5E5A54] uppercase tracking-wider">
                  {current.badge || "Featured Watch"}
                </span>
                <span className="text-[15px] font-semibold text-[#1C1C1B] truncate group-hover:text-[#6F6556] transition-colors">
                  {current.model}
                </span>
                <span className="text-[14px] font-medium text-[#1C1C1B]">
                  {current.price}
                </span>
              </div>

              <ArrowRight
                className="w-4 h-4 text-[#1C1C1B] shrink-0 group-hover:translate-x-1 transition-transform"
                strokeWidth={1.75}
              />
            </Link>

            {/* Prev / Next Slide Buttons (Bottom Right) */}
            <div className="absolute right-6 bottom-6 flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={prevSlide}
                className="w-11 h-11 rounded-full bg-[#EEEBE6]/95 hover:bg-white text-[#1C1C1B] border border-[#CFC9BF] flex items-center justify-center cursor-pointer shadow-md active:scale-95 transition"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
              </button>

              <button
                type="button"
                aria-label="Next slide"
                onClick={nextSlide}
                className="w-11 h-11 rounded-full bg-[#EEEBE6]/95 hover:bg-white text-[#1C1C1B] border border-[#CFC9BF] flex items-center justify-center cursor-pointer shadow-md active:scale-95 transition"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MOBILE LAYOUT (Matches HeroMobile.dc.html)                     */}
        {/* ============================================================== */}
        <div className="flex flex-col lg:hidden px-4 pt-3 pb-8">
          {/* Top Hero Photo Card */}
          <div className="relative w-full h-[380px] bg-[#D8D3CB] rounded-[2px] overflow-hidden flex items-center justify-center shadow-sm">
            <Image
              key={current.id}
              src={current.image}
              alt={current.model}
              fill
              priority
              sizes="100vw"
              unoptimized={
                typeof current.image === "string" &&
                (current.image.includes("cloudinary") || current.image.startsWith("http"))
              }
              className="object-contain p-6 drop-shadow-[0_20px_35px_rgba(0,0,0,0.3)] transition-all duration-500"
            />

            {/* Mobile Floating Product Card with Actual Price */}
            <Link
              href={current.link || "/shop-without-sidebar"}
              className="absolute left-3 bottom-3 max-w-[calc(100%-110px)] p-2 bg-[#EEEBE6]/95 backdrop-blur-md border border-[#CFC9BF] rounded-[2px] flex items-center gap-2 shadow-md active:scale-95 transition"
            >
              <div className="relative w-9 h-9 bg-[#D8D3CB] rounded-[2px] overflow-hidden shrink-0">
                <Image
                  src={current.image}
                  alt={current.model}
                  fill
                  sizes="36px"
                  unoptimized={
                    typeof current.image === "string" &&
                    (current.image.includes("cloudinary") || current.image.startsWith("http"))
                  }
                  className="object-contain p-0.5"
                />
              </div>
              <div className="min-w-0 flex flex-col">
                <span className="text-[12px] font-semibold text-[#1C1C1B] truncate leading-tight">
                  {current.model}
                </span>
                <span className="text-[11px] font-bold text-[#8B6914] leading-tight">
                  {current.price}
                </span>
              </div>
            </Link>

            {/* Slide Arrows */}
            <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={prevSlide}
                className="w-9 h-9 rounded-full bg-[#EEEBE6]/95 text-[#1C1C1B] border border-[#CFC9BF] flex items-center justify-center active:scale-90 transition shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={nextSlide}
                className="w-9 h-9 rounded-full bg-[#EEEBE6]/95 text-[#1C1C1B] border border-[#CFC9BF] flex items-center justify-center active:scale-90 transition shadow-sm"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* Copy & CTAs */}
          <div className="pt-6 px-1 flex flex-col gap-3.5">
            <div className="text-[12px] font-medium text-[#5E5A54] tracking-wide">
              {settings.collection_tag || "New collection · 2026"}
            </div>

            <h1 className="m-0 text-[38px] font-medium leading-[1.05] tracking-[-1.4px] text-[#1C1C1B]">
              {settings.headline || "Time, worn with glory."}
            </h1>

            <p className="m-0 text-[15px] leading-[1.55] text-[#5E5A54]">
              {settings.description ||
                "Classic, dress and everyday watches, picked for every wrist and every occasion."}
            </p>

            <Link
              href={settings.primary_btn_link || "/shop-without-sidebar"}
              className="w-full h-[50px] mt-1 flex items-center justify-center gap-2 bg-[#1C1C1B] text-[#EEEBE6] rounded-[2px] text-[15px] font-medium active:scale-[0.99] transition shadow-sm"
            >
              <span>{settings.primary_btn_text || "Shop the collection"}</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </Link>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {[
                { label: "Men", href: "/category/men" },
                { label: "Women", href: "/category/women" },
                { label: "Automatic", href: "/category/automatic" },
                { label: "Minimal", href: "/category/minimal" },
                { label: "Premium", href: "/category/premium" },
              ].map((pill) => (
                <Link
                  key={pill.label}
                  href={pill.href}
                  className="h-9 px-4 flex items-center border border-[#CFC9BF] rounded-full text-[13px] font-medium text-[#1C1C1B] active:bg-[#CFC9BF]/20 transition"
                >
                  {pill.label}
                </Link>
              ))}
            </div>

            {/* Mobile Category Cards */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Link
                href={menCard.link || "/category/men"}
                className="group flex flex-col gap-2"
              >
                <div className="relative h-[150px] w-full bg-[#D8D3CB] rounded-[2px] overflow-hidden">
                  <Image
                    src={menCard.image || "/images/2s/rolex-submariner-1.jpg"}
                    alt={menCard.title || "Men's watches"}
                    fill
                    sizes="180px"
                    unoptimized={
                      typeof menCard.image === "string" &&
                      (menCard.image.includes("cloudinary") || menCard.image.startsWith("http"))
                    }
                    className="object-cover"
                  />
                </div>
                <span className="flex justify-between items-center text-[13px] font-medium text-[#1C1C1B]">
                  <span>{menCard.title || "Men's watches"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href={womenCard.link || "/category/women"}
                className="group flex flex-col gap-2"
              >
                <div className="relative h-[150px] w-full bg-[#D8D3CB] rounded-[2px] overflow-hidden">
                  <Image
                    src={womenCard.image || "/images/2s/cartier-tank-1.jpg"}
                    alt={womenCard.title || "Women's watches"}
                    fill
                    sizes="180px"
                    unoptimized={
                      typeof womenCard.image === "string" &&
                      (womenCard.image.includes("cloudinary") || womenCard.image.startsWith("http"))
                    }
                    className="object-cover"
                  />
                </div>
                <span className="flex justify-between items-center text-[13px] font-medium text-[#1C1C1B]">
                  <span>{womenCard.title || "Women's watches"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
