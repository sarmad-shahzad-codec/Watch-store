import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HERO_WATCH_IMAGES } from "@/constants/heroWatchImages";

const PromoBanner = () => {
  return (
    <section className="overflow-hidden bg-[#FAF8F5] py-16 lg:py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* Hero promo — full width */}
        <div className="relative mb-6 lg:mb-8 overflow-hidden rounded-xl border border-[#E8DFD4] bg-gradient-to-br from-[#FBF6EF] to-[#F0E6D8] shadow-[0_12px_40px_-12px_rgba(43,26,15,0.12)]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:min-h-[320px] xl:min-h-[360px]">
            <div className="relative z-10 flex-1 px-6 py-10 sm:px-10 sm:py-12 lg:py-14 lg:pl-12 lg:pr-8 xl:pl-14">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.35em] text-[#8B5A2B] mb-3">
                Gloria Times Signature Series
              </span>
              <h2 className="font-semibold text-2xl sm:text-3xl xl:text-[34px] xl:leading-tight text-[#2B1A0F] tracking-tight mb-4 max-w-[26ch]">
                Timeless Watches, Intro Offer
              </h2>
              <p className="text-custom-sm sm:text-base text-dark-3 leading-relaxed max-w-[44ch]">
                Discover classic chronographs and minimalist dials finished with
                warm wooden tones and premium leather straps—curated for
                collectors who value heritage and precision.
              </p>
              <Link
                href="/shop-without-sidebar"
                className="inline-flex mt-8 font-medium text-custom-sm text-white bg-[#4A2F19] py-3.5 px-10 rounded-md tracking-[0.12em] uppercase shadow-sm ease-out duration-200 hover:bg-[#3A2413]"
              >
                Shop Gloria Times
              </Link>
            </div>

            <div className="relative flex flex-1 justify-center lg:justify-end items-end px-6 pb-6 pt-2 lg:px-10 lg:pb-0 lg:pt-10 min-h-[220px] lg:min-h-0">
              <div className="relative w-full max-w-[320px] lg:max-w-[380px] aspect-square lg:aspect-auto lg:h-full flex items-end justify-center">
                <Image
                  src={HERO_WATCH_IMAGES.main}
                  alt="Gloria Times luxury timepiece"
                  width={380}
                  height={380}
                  className="object-contain object-bottom w-full h-auto max-h-[280px] lg:max-h-[340px] drop-shadow-[0_20px_40px_rgba(43,26,15,0.18)]"
                  sizes="(max-width: 1024px) 90vw, 380px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Two promos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Daily wear */}
          <div className="group relative overflow-hidden rounded-xl border border-[#C9A882]/40 bg-[#D4B896] shadow-[0_8px_32px_-8px_rgba(43,26,15,0.15)]">
            <div className="flex flex-col sm:flex-row sm:items-stretch min-h-[280px]">
              <div className="relative flex w-full sm:w-[46%] min-h-[200px] sm:min-h-0 items-center justify-center bg-[#C4A67A]/30 p-6 sm:p-8">
                <Image
                  src={HERO_WATCH_IMAGES.tissot}
                  alt="Tissot everyday watch"
                  width={260}
                  height={260}
                  className="object-contain w-full max-w-[220px] h-auto drop-shadow-lg transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 70vw, 260px"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 text-right sm:text-left">
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#2B1A0F]/80 mb-2">
                  Everyday Essentials
                </span>
                <h3 className="font-semibold text-xl sm:text-2xl text-[#2B1A0F] mb-3 leading-snug">
                  Comfortable Daily Wear Watches
                </h3>
                <p className="text-sm font-medium text-white/95 mb-6">
                  Flat 20% off this week
                </p>
                <div className="mt-auto sm:text-left text-right">
                  <Link
                    href="/shop-without-sidebar"
                    className="inline-flex font-medium text-custom-sm text-white bg-[#4A2F19] py-2.5 px-8 rounded-md tracking-[0.08em] uppercase hover:bg-[#3A2413] transition-colors"
                  >
                    Shop Daily Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Wooden / artisan */}
          <div className="group relative overflow-hidden rounded-xl border border-[#E8DFD4] bg-gradient-to-br from-[#FBF6EF] to-[#F3E9DC] shadow-[0_8px_32px_-8px_rgba(43,26,15,0.12)]">
            <div className="flex flex-col sm:flex-row sm:items-stretch min-h-[280px]">
              <div className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 order-2 sm:order-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8B5A2B] mb-2">
                  Limited Wooden Edition
                </span>
                <h3 className="font-semibold text-xl sm:text-2xl text-[#2B1A0F] mb-3">
                  Up to <span className="text-[#8B5A2B]">40%</span> off
                </h3>
                <p className="text-custom-sm text-dark-3 leading-relaxed max-w-[30ch] mb-6">
                  Handcrafted wooden bezels and straps that bring warmth and
                  character to every outfit.
                </p>
                <Link
                  href="/shop-without-sidebar"
                  className="inline-flex w-fit font-medium text-custom-sm text-white bg-[#4A2F19] py-2.5 px-8 rounded-md tracking-[0.08em] uppercase hover:bg-[#3A2413] transition-colors"
                >
                  Explore Wooden Series
                </Link>
              </div>
              <div className="relative flex w-full sm:w-[46%] min-h-[200px] sm:min-h-0 items-center justify-center bg-[#EDE4D8]/80 p-6 sm:p-8 order-1 sm:order-2">
                <Image
                  src={HERO_WATCH_IMAGES.hublot}
                  alt="Hublot luxury watch — Gloria Times"
                  width={260}
                  height={260}
                  className="object-contain w-full max-w-[220px] h-auto drop-shadow-lg transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 70vw, 260px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
