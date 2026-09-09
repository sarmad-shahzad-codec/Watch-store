"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HERO_WATCH_IMAGES } from "@/constants/heroWatchImages";

const stripImages = [
  { src: HERO_WATCH_IMAGES.tissot, label: "Tissot" },
  { src: HERO_WATCH_IMAGES.hublot, label: "Hublot" },
  { src: HERO_WATCH_IMAGES.tagHeuer, label: "TAG Heuer" },
] as const;

const CounDown = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const deadline = "December 31, 2026";

  const getTime = () => {
    const time = Math.max(0, Date.parse(deadline) - Date.now());
    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    getTime();
    const interval = setInterval(getTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  return (
    <section className="overflow-hidden bg-[#FAF8F5] py-16 lg:py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div
          className="relative overflow-hidden rounded-xl border border-[#E8DFD4] bg-gradient-to-br from-[#FBF6EF] via-[#F7EFE4] to-[#EDE4D8] p-6 sm:p-8 lg:p-12 xl:p-14 shadow-[0_12px_40px_-12px_rgba(43,26,15,0.12)]"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(251,246,239,0.92) 0%, rgba(237,228,216,0.95) 100%), url(${HERO_WATCH_IMAGES.woodenBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-[1] flex flex-col lg:flex-row lg:items-center lg:gap-10 xl:gap-14">
            <div className="max-w-xl flex-shrink-0">
              <span className="block font-semibold text-[11px] uppercase tracking-[0.35em] text-[#8B5A2B] mb-3">
                Limited Event
              </span>

              <h2 className="font-semibold text-[#2B1A0F] text-2xl sm:text-3xl xl:text-[34px] xl:leading-tight tracking-tight mb-4">
                Curated Luxury Watches — Season Sale
              </h2>

              <p className="text-custom-sm sm:text-base text-dark-3 leading-relaxed max-w-[42ch]">
                Swiss chronographs and iconic silhouettes from Gloria Times—the
                same showcase pieces as our hero collection. Reserve yours before
                the countdown ends.
              </p>

              <div className="flex flex-wrap gap-4 sm:gap-6 mt-8">
                <div>
                  <span className="min-w-[64px] h-14 font-semibold text-xl lg:text-3xl text-[#2B1A0F] rounded-lg flex items-center justify-center bg-white/95 border border-[#E8DFD4] shadow-[0_4px_14px_rgba(43,26,15,0.08)] px-4 mb-2">
                    {pad(days)}
                  </span>
                  <span className="block text-custom-sm text-[#2B1A0F]/70 text-center">
                    Days
                  </span>
                </div>
                <div>
                  <span className="min-w-[64px] h-14 font-semibold text-xl lg:text-3xl text-[#2B1A0F] rounded-lg flex items-center justify-center bg-white/95 border border-[#E8DFD4] shadow-[0_4px_14px_rgba(43,26,15,0.08)] px-4 mb-2">
                    {pad(hours)}
                  </span>
                  <span className="block text-custom-sm text-[#2B1A0F]/70 text-center">
                    Hours
                  </span>
                </div>
                <div>
                  <span className="min-w-[64px] h-14 font-semibold text-xl lg:text-3xl text-[#2B1A0F] rounded-lg flex items-center justify-center bg-white/95 border border-[#E8DFD4] shadow-[0_4px_14px_rgba(43,26,15,0.08)] px-4 mb-2">
                    {pad(minutes)}
                  </span>
                  <span className="block text-custom-sm text-[#2B1A0F]/70 text-center">
                    Minutes
                  </span>
                </div>
                <div>
                  <span className="min-w-[64px] h-14 font-semibold text-xl lg:text-3xl text-[#2B1A0F] rounded-lg flex items-center justify-center bg-white/95 border border-[#E8DFD4] shadow-[0_4px_14px_rgba(43,26,15,0.08)] px-4 mb-2">
                    {pad(seconds)}
                  </span>
                  <span className="block text-custom-sm text-[#2B1A0F]/70 text-center">
                    Seconds
                  </span>
                </div>
              </div>

              <Link
                href="/shop-without-sidebar"
                className="inline-flex font-medium text-custom-sm text-white bg-[#4A2F19] py-3.5 px-10 rounded-md tracking-[0.12em] uppercase shadow-sm ease-out duration-200 hover:bg-[#3A2413] mt-8"
              >
                Shop the Collection
              </Link>
            </div>

            <div className="relative mt-10 lg:mt-0 flex flex-1 flex-col items-center lg:items-end justify-center min-h-[260px] lg:min-h-[340px]">
              <div className="relative w-full max-w-[380px] lg:max-w-[440px] aspect-square flex items-end justify-center">
                <Image
                  src={HERO_WATCH_IMAGES.main}
                  alt="Gloria Times flagship timepiece"
                  width={440}
                  height={440}
                  className="object-contain object-bottom w-full h-auto max-h-[280px] sm:max-h-[320px] lg:max-h-[380px] drop-shadow-[0_24px_48px_rgba(43,26,15,0.2)]"
                  sizes="(max-width: 1024px) 90vw, 440px"
                  priority
                />
              </div>

              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 lg:mt-8">
                {stripImages.map(({ src, label }) => (
                  <div
                    key={label}
                    className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-lg overflow-hidden border border-[#E8DFD4] bg-white/90 shadow-[0_4px_12px_rgba(43,26,15,0.08)]"
                  >
                    <Image
                      src={src}
                      alt={`${label} — Gloria Times`}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#8B5A2B]/90 mt-3 text-center lg:text-right w-full">
                Same pieces as the hero showcase
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CounDown;
