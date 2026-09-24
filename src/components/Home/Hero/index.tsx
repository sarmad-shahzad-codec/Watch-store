"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_WATCH_IMAGES } from "@/constants/heroWatchImages";

interface HeroSlide {
  id: number;
  image: string;
  badge: string;
  model: string;
  price: string;
  category: string;
  link: string;
  description: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: HERO_WATCH_IMAGES.main,
    badge: "Featured Masterpiece",
    model: "Rolex Submariner Date",
    price: "Rs. 34,500",
    category: "Master Diver",
    link: "/shop-without-sidebar?q=submariner",
    description: "Cerachrom ceramic bezel, 3135 automatic movement, and oyster steel finish.",
  },
  {
    id: 2,
    image: HERO_WATCH_IMAGES.tissot,
    badge: "Bestseller",
    model: "Tissot PRX Powermatic 80",
    price: "Rs. 24,500",
    category: "Swiss Automatic",
    link: "/shop-without-sidebar?q=tissot",
    description: "Integrated bracelet, sunburst dial, and 80-hour power reserve.",
  },
  {
    id: 3,
    image: HERO_WATCH_IMAGES.hublot,
    badge: "High Horology",
    model: "Hublot Big Bang Skeleton",
    price: "Rs. 38,000",
    category: "Fusion Architecture",
    link: "/shop-without-sidebar?q=hublot",
    description: "Multi-component fusion case with openwork skeleton mechanics.",
  },
  {
    id: 4,
    image: HERO_WATCH_IMAGES.tagHeuer,
    badge: "Racing Legend",
    model: "TAG Heuer Carrera Chrono",
    price: "Rs. 28,500",
    category: "Motorsport Heritage",
    link: "/shop-without-sidebar?q=tag",
    description: "Tricompax chronograph dials with high-precision Swiss caliber.",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const current = heroSlides[currentSlide];

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
                New collection · 2026
              </div>

              <h1 className="m-0 text-[56px] xl:text-[66px] font-medium leading-[1.02] tracking-[-2.2px] text-[#1C1C1B]">
                Time, worn with glory.
              </h1>

              <p className="m-0 max-w-[440px] text-[16px] xl:text-[17px] leading-[1.6] text-[#5E5A54]">
                Classic, dress and everyday watches, picked for every wrist and
                every occasion.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-1">
                <Link
                  href="/shop-without-sidebar"
                  className="h-[52px] px-7 flex items-center gap-2.5 bg-[#1C1C1B] text-[#EEEBE6] hover:bg-black rounded-[2px] text-[15px] font-medium transition shadow-sm active:scale-[0.99]"
                >
                  <span>Shop the collection</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </Link>

                <Link
                  href="/shop-without-sidebar?sort=newest"
                  className="h-[52px] px-6 flex items-center border border-[#1C1C1B] hover:bg-[#1C1C1B]/5 text-[#1C1C1B] rounded-[2px] text-[15px] font-medium transition"
                >
                  New in
                </Link>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {[
                  { label: "Men", href: "/category/men" },
                  {
                    label: "Women",
                    href: "/category/women",
                  },
                  {
                    label: "Automatic",
                    href: "/shop-without-sidebar?q=automatic",
                  },
                  {
                    label: "Minimal",
                    href: "/shop-without-sidebar?q=minimal",
                  },
                ].map((pill) => (
                  <Link
                    key={pill.label}
                    href={pill.href}
                    className="h-10 px-4.5 flex items-center border border-[#CFC9BF] hover:border-[#1C1C1B] hover:text-[#1C1C1B] rounded-full text-[14px] font-medium text-[#1C1C1B] transition"
                  >
                    {pill.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Category Cards: Men & Women */}
            <div className="grid grid-cols-2 gap-4 pt-10">
              {/* Men's Watches Card */}
              <Link
                href="/category/men"
                className="group flex flex-col gap-2.5 text-decoration-none"
              >
                <div className="relative h-[190px] w-full bg-[#D8D3CB] rounded-[2px] overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:shadow-md">
                  <Image
                    src="/images/2s/rolex-submariner-1.jpg"
                    alt="Men's watches"
                    fill
                    sizes="260px"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
                <span className="flex justify-between items-center text-[14px] font-medium text-[#1C1C1B] group-hover:text-[#6F6556] transition-colors">
                  <span>Men&apos;s watches</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={1.75}
                  />
                </span>
              </Link>

              {/* Women's Watches Card */}
              <Link
                href="/category/women"
                className="group flex flex-col gap-2.5 text-decoration-none"
              >
                <div className="relative h-[190px] w-full bg-[#D8D3CB] rounded-[2px] overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:shadow-md">
                  <Image
                    src="/images/2s/cartier-tank-1.jpg"
                    alt="Women's watches"
                    fill
                    sizes="260px"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
                <span className="flex justify-between items-center text-[14px] font-medium text-[#1C1C1B] group-hover:text-[#6F6556] transition-colors">
                  <span>Women&apos;s watches</span>
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
                className="object-contain p-6 sm:p-10 drop-shadow-[0_25px_45px_rgba(0,0,0,0.35)] transition-all duration-700 ease-out"
              />
            </div>

            {/* Subtle Gradient Veil */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

            {/* Floating Featured Product Card (Bottom Left) */}
            <Link
              href={current.link}
              className="absolute left-6 bottom-6 w-[330px] p-3.5 bg-[#EEEBE6]/95 backdrop-blur-md border border-[#CFC9BF] rounded-[2px] flex items-center gap-3.5 shadow-xl hover:bg-white transition-all group"
            >
              <div className="relative w-[72px] h-[72px] bg-[#D8D3CB] rounded-[2px] overflow-hidden shrink-0">
                <Image
                  src={current.image}
                  alt={current.model}
                  fill
                  sizes="72px"
                  className="object-contain p-1"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <span className="text-[11px] font-medium text-[#5E5A54] uppercase tracking-wider">
                  {current.badge}
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
              className="object-contain p-6 drop-shadow-[0_20px_35px_rgba(0,0,0,0.3)] transition-all duration-500"
            />

            {/* Floating Slide Tag */}
            <div className="absolute left-3 top-3 px-3 py-1 bg-[#EEEBE6]/90 backdrop-blur-sm rounded-full text-[11px] font-semibold text-[#1C1C1B] border border-[#CFC9BF]">
              {current.model}
            </div>

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
              New collection · 2026
            </div>

            <h1 className="m-0 text-[38px] font-medium leading-[1.05] tracking-[-1.4px] text-[#1C1C1B]">
              Time, worn with glory.
            </h1>

            <p className="m-0 text-[15px] leading-[1.55] text-[#5E5A54]">
              Classic, dress and everyday watches, picked for every wrist and
              every occasion.
            </p>

            <Link
              href="/shop-without-sidebar"
              className="w-full h-[50px] mt-1 flex items-center justify-center gap-2 bg-[#1C1C1B] text-[#EEEBE6] rounded-[2px] text-[15px] font-medium active:scale-[0.99] transition shadow-sm"
            >
              <span>Shop the collection</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </Link>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {[
                { label: "Men", href: "/category/men" },
                { label: "Women", href: "/category/women" },
                {
                  label: "Automatic",
                  href: "/shop-without-sidebar?q=automatic",
                },
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
                href="/category/men"
                className="group flex flex-col gap-2"
              >
                <div className="relative h-[150px] w-full bg-[#D8D3CB] rounded-[2px] overflow-hidden">
                  <Image
                    src="/images/2s/rolex-submariner-1.jpg"
                    alt="Men's watches"
                    fill
                    sizes="180px"
                    className="object-cover"
                  />
                </div>
                <span className="flex justify-between items-center text-[13px] font-medium text-[#1C1C1B]">
                  <span>Men&apos;s watches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/category/women"
                className="group flex flex-col gap-2"
              >
                <div className="relative h-[150px] w-full bg-[#D8D3CB] rounded-[2px] overflow-hidden">
                  <Image
                    src="/images/2s/cartier-tank-1.jpg"
                    alt="Women's watches"
                    fill
                    sizes="180px"
                    className="object-cover"
                  />
                </div>
                <span className="flex justify-between items-center text-[13px] font-medium text-[#1C1C1B]">
                  <span>Women&apos;s watches</span>
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
