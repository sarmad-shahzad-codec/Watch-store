"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MovingWatch {
  id: number;
  name: string;
  image: string;
  href: string;
}

const watchCards: MovingWatch[] = [
  {
    id: 1,
    name: "Tissot PRX Emerald Dial",
    image: "/images/hero-lineup/tissot-green.webp",
    href: "/category/tissot",
  },
  {
    id: 2,
    name: "Hublot Diamond Cut",
    image: "/images/hero-lineup/hublot.webp",
    href: "/category/hublot-diamond",
  },
  {
    id: 3,
    name: "Rolex Datejust Jubilee",
    image: "/images/hero-lineup/rolex-jubilee.webp",
    href: "/category/rolex",
  },
  {
    id: 4,
    name: "TAG Heuer Carrera",
    image: "/images/hero-lineup/tagHeuer.webp",
    href: "/category/tag-heuer",
  },
  {
    id: 5,
    name: "Patek Philippe Nautilus",
    image: "/images/hero-lineup/main.webp",
    href: "/category/patek-philippe",
  },
  {
    id: 6,
    name: "Rolex Submariner Ceramic",
    image: "/images/hero-lineup/rolex-submariner.jpg",
    href: "/category/rolex",
  },
  {
    id: 7,
    name: "Tissot PRX Classic Blue",
    image: "/images/hero-lineup/tissot.webp",
    href: "/category/tissot",
  },
];

const TimelessElegance = () => {
  // Duplicate array for seamless infinite marquee loop
  const marqueeWatches = [...watchCards, ...watchCards];

  return (
    <section className="relative w-full bg-white text-[#111111] py-14 sm:py-18 lg:py-20 overflow-hidden border-t border-gray-200">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
          {/* Left Column: Infinite Moving Watch Slider */}
          <div className="w-full lg:w-7/12 overflow-hidden rounded-2xl border border-black/10 bg-gray-50/50 p-2 sm:p-3 shadow-sm relative group">
            {/* Left and Right Fade Masks for Smooth Filmstrip Effect */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

            {/* Scrolling Track (Moves continuously like a video slider) */}
            <div className="flex gap-3 sm:gap-4 animate-watch-scroll group-hover:[animation-play-state:paused] w-max select-none py-1">
              {marqueeWatches.map((watch, index) => (
                <Link
                  key={`${watch.id}-${index}`}
                  href={watch.href}
                  className="relative w-[185px] sm:w-[210px] md:w-[225px] h-[245px] sm:h-[280px] md:h-[295px] shrink-0 rounded-2xl overflow-hidden bg-gradient-to-b from-white via-neutral-50 to-[#EFEFEF] border border-gray-300/90 group/card transition-all duration-300 hover:scale-[1.03] shadow-sm hover:shadow-lg"
                >
                  <div className="relative w-full h-full flex items-center justify-center p-3">
                    <Image
                      src={watch.image}
                      alt={watch.name}
                      fill
                      sizes="(max-width: 640px) 185px, 225px"
                      className="object-contain p-2 transition-transform duration-500 group-hover/card:scale-108"
                    />
                  </div>
                  {/* Bottom Gradient & Permanent Title Badge matching media_1788943615563.png */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-8 pb-3 px-3.5 text-left pointer-events-none">
                    <span className="text-white text-[11px] sm:text-xs font-black tracking-wider uppercase drop-shadow-md leading-tight block">
                      {watch.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Premium Watch Collection Content */}
          <div className="w-full lg:w-5/12 text-left flex flex-col items-start justify-center">
            <span className="inline-block bg-[#000000] text-[#FFFFFF] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-4 shadow-sm">
              PREMIUM WATCH COLLECTION
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#000000] tracking-tight leading-[1.2] mb-4">
              Timeless Elegance For Every Moment
            </h2>

            <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed max-w-[460px] mb-6">
              Discover premium watches designed for modern lifestyles. From classic sophistication to contemporary style, every timepiece is selected to elevate your everyday look.
            </p>

            <Link
              href="/shop-without-sidebar"
              className="inline-flex items-center justify-center bg-[#000000] text-[#FFFFFF] text-xs font-bold uppercase tracking-[0.18em] px-8 py-3.5 rounded-lg shadow-md hover:bg-gray-800 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelessElegance;
