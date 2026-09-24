"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import data from "./categoryData";
import SingleItem from "./SingleItem";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const Categories = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section id="collections" className="scroll-mt-28 overflow-hidden py-14 sm:py-18 bg-[#FAF8F5]">
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-8 xl:px-12">
        {/* Section Title — Centered in the middle as requested */}
        <div className="mb-10 sm:mb-12 text-center flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 font-medium text-xs sm:text-sm tracking-[0.22em] uppercase text-[#8A7A5C] mb-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#8A7A5C]"
            >
              <path
                d="M3.94024 13.4474C2.6523 12.1595 2.00832 11.5155 1.7687 10.68C1.52908 9.84449 1.73387 8.9571 2.14343 7.18231L2.37962 6.15883C2.72419 4.66569 2.89648 3.91912 3.40771 3.40789C3.91894 2.89666 4.66551 2.72437 6.15865 2.3798L7.18213 2.14361C8.95692 1.73405 9.84431 1.52927 10.6798 1.76889C11.5153 2.00851 12.1593 2.65248 13.4472 3.94042L14.9719 5.46512C17.2128 7.70594 18.3332 8.82635 18.3332 10.2186C18.3332 11.6109 17.2128 12.7313 14.9719 14.9721C12.7311 17.2129 11.6107 18.3334 10.2184 18.3334C8.82617 18.3334 7.70576 17.2129 5.46494 14.9721L3.94024 13.4474Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle
                cx="7.17245"
                cy="7.39917"
                r="1.66667"
                transform="rotate(-45 7.17245 7.39917)"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span>Gloria Times Collections</span>
          </div>

          <h2
            className="font-medium text-2xl sm:text-3xl lg:text-4xl text-[#1C1C1B] tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Browse by Watch Style
          </h2>

          <div className="w-14 h-[2px] bg-[#8A7A5C]/60 mt-3 rounded-full" />
        </div>

        {/* Carousel Container with Interactive Navigation */}
        <div className="relative group/carousel px-2 sm:px-6">
          {/* Prev Button (Floating Left) */}
          <button
            type="button"
            aria-label="Previous watch style"
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#1C1C1B] text-[#1C1C1B] hover:text-white border border-[#D9D4CC] shadow-md flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
          </button>

          {/* Next Button (Floating Right) */}
          <button
            type="button"
            aria-label="Next watch style"
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#1C1C1B] text-[#1C1C1B] hover:text-white border border-[#D9D4CC] shadow-md flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.75} />
          </button>

          {/* Swiper Moving Carousel */}
          <Swiper
            modules={[Autoplay, Navigation]}
            autoplay={{
              delay: 2600,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            speed={750}
            slidesPerView={2}
            spaceBetween={16}
            breakpoints={{
              480: {
                slidesPerView: 2.5,
                spaceBetween: 18,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 22,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 26,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 30,
              },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="w-full py-4 select-none"
          >
            {data.map((item, index) => (
              <SwiperSlide key={`${item.id}-${index}`}>
                <SingleItem item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Categories;
