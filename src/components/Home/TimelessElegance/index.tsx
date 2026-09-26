"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStoreProducts } from "@/hooks/useProducts";

interface MovingWatch {
  id: string;
  name: string;
  image: string;
  href: string;
}

const fallbackWatchCards: MovingWatch[] = [
  {
    id: "f-1",
    name: "Tissot PRX Emerald Dial",
    image: "/images/hero-lineup/tissot-green.webp",
    href: "/shop-without-sidebar?q=tissot",
  },
  {
    id: "f-2",
    name: "Hublot Diamond Cut",
    image: "/images/hero-lineup/hublot.webp",
    href: "/shop-without-sidebar?q=hublot",
  },
  {
    id: "f-3",
    name: "Rolex Datejust Jubilee",
    image: "/images/hero-lineup/rolex-jubilee.webp",
    href: "/shop-without-sidebar?q=rolex",
  },
  {
    id: "f-4",
    name: "TAG Heuer Carrera",
    image: "/images/hero-lineup/tagHeuer.webp",
    href: "/shop-without-sidebar?q=tag",
  },
  {
    id: "f-5",
    name: "Patek Philippe Nautilus",
    image: "/images/hero-lineup/main.webp",
    href: "/shop-without-sidebar?q=patek",
  },
  {
    id: "f-6",
    name: "Rolex Submariner Ceramic",
    image: "/images/hero-lineup/rolex-submariner.jpg",
    href: "/shop-without-sidebar?q=submariner",
  },
  {
    id: "f-7",
    name: "Tissot PRX Classic Blue",
    image: "/images/hero-lineup/tissot.webp",
    href: "/shop-without-sidebar?q=tissot",
  },
];

const TimelessElegance = () => {
  const { products } = useStoreProducts();

  // Collect ALL pictures from all products uploaded on the website
  const allMovingWatches = useMemo<MovingWatch[]>(() => {
    const items: MovingWatch[] = [];
    const seenImages = new Set<string>();

    if (products && products.length > 0) {
      products.forEach((p) => {
        // Collect all available images for this product (previews, thumbnails, variants)
        const productImages: Array<{ url: string; label?: string }> = [];

        // Check variant objects first (they often have custom variant/color names)
        const allVariants = [
          ...(p.variants || []),
          ...(p.imgs?.variants || []),
        ];

        allVariants.forEach((v) => {
          if (v && v.image && typeof v.image === "string" && v.image.trim()) {
            productImages.push({
              url: v.image.trim(),
              label: v.name ? `${p.title} - ${v.name}` : undefined,
            });
          }
        });

        // Check previews
        if (p.imgs?.previews && Array.isArray(p.imgs.previews)) {
          p.imgs.previews.forEach((url, i) => {
            if (url && typeof url === "string" && url.trim()) {
              productImages.push({
                url: url.trim(),
                label: p.imgs?.previews && p.imgs.previews.length > 1 ? `${p.title} (${i + 1})` : p.title,
              });
            }
          });
        }

        // Check thumbnails
        if (p.imgs?.thumbnails && Array.isArray(p.imgs.thumbnails)) {
          p.imgs.thumbnails.forEach((url, i) => {
            if (url && typeof url === "string" && url.trim()) {
              productImages.push({
                url: url.trim(),
                label: p.imgs?.thumbnails && p.imgs.thumbnails.length > 1 ? `${p.title} (${i + 1})` : p.title,
              });
            }
          });
        }

        // Add each unique picture to the moving track
        productImages.forEach((imgObj, idx) => {
          if (!seenImages.has(imgObj.url)) {
            seenImages.add(imgObj.url);
            items.push({
              id: `${p.id}-${idx}-${imgObj.url.slice(-8)}`,
              name: imgObj.label || p.title,
              image: imgObj.url,
              href: `/shop-details/${p.id}`,
            });
          }
        });
      });
    }

    // Fallback if no images found
    if (items.length === 0) {
      return fallbackWatchCards;
    }

    // If there are only a few items, supplement with fallback to ensure rich slider
    if (items.length < 4) {
      fallbackWatchCards.forEach((fb) => {
        if (!seenImages.has(fb.image)) {
          seenImages.add(fb.image);
          items.push(fb);
        }
      });
    }

    return items;
  }, [products]);

  // Duplicate array for seamless infinite marquee loop (-50% translateX)
  const marqueeWatches = useMemo(() => {
    return [...allMovingWatches, ...allMovingWatches];
  }, [allMovingWatches]);

  // Dynamically calculate smooth scroll duration based on number of pictures
  const scrollDuration = useMemo(() => {
    // ~2.5s per unique image gives a steady, luxury gliding speed
    return Math.max(22, allMovingWatches.length * 2.5);
  }, [allMovingWatches.length]);

  return (
    <section className="relative w-full bg-white text-[#111111] py-14 sm:py-18 lg:py-20 overflow-hidden border-t border-gray-200">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
          {/* Left Column: Infinite Moving Watch Slider with ALL Website Pictures */}
          <div className="w-full lg:w-7/12 overflow-hidden rounded-2xl border border-black/10 bg-gray-50/50 p-2 sm:p-3 shadow-sm relative group">
            {/* Left and Right Fade Masks for Smooth Filmstrip Effect */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

            {/* Scrolling Track (Moves continuously with all website watch pictures) */}
            <div
              className="flex gap-3 sm:gap-4 animate-watch-scroll group-hover:[animation-play-state:paused] w-max select-none py-1"
              style={{ animationDuration: `${scrollDuration}s` }}
            >
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
                      unoptimized={
                        typeof watch.image === "string" &&
                        (watch.image.includes("cloudinary") || watch.image.startsWith("http"))
                      }
                      className="object-contain p-2 transition-transform duration-500 group-hover/card:scale-108"
                    />
                  </div>

                  {/* Bottom Gradient & Permanent Title Badge */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-8 pb-3 px-3.5 text-left pointer-events-none">
                    <span className="text-white text-[11px] sm:text-xs font-black tracking-wider uppercase drop-shadow-md leading-tight block truncate">
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
