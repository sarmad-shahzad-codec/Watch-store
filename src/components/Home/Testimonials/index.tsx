"use client";

import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import { useCallback, useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Testimonial } from "@/types/testimonial";
import { fetchTestimonialsFromSupabase } from "@/utils/supabase/testimonials";
import SingleItem from "./SingleItem";

import "swiper/css/navigation";
import "swiper/css";

const Testimonials = () => {
  const sliderRef = useRef<SwiperRef | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchTestimonialsFromSupabase().then((data) => {
      if (mounted) {
        if (data && data.length > 0) {
          setTestimonials(data);
        }
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handlePrev = useCallback(() => {
    sliderRef.current?.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    sliderRef.current?.swiper.slideNext();
  }, []);

  if (!loading && testimonials.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden border-t border-[#EDE4D8]/90 bg-[#FAF8F5] py-14 sm:py-16">
      <div className="mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="testimonial-carousel common-carousel">
          <div className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B5344]">
                <Star
                  className="h-3.5 w-3.5 text-[#C9A227]"
                  fill="#C9A227"
                  strokeWidth={1.5}
                  aria-hidden
                />
                Client Reviews &amp; Photos
              </span>
              <h2 className="mt-2 font-bold tracking-tight text-[#1F1209] text-2xl sm:text-3xl">
                What Our Clients Say
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#6B5344] sm:text-[15px]">
                Real wrist shots and authentic unboxing reviews from watch enthusiasts across Pakistan who trusted Gloria Times for their luxury timepieces.
              </p>
            </div>

            {testimonials.length > 3 && (
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous testimonials"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#DDD5CC] bg-white text-[#4A2F19] shadow-sm transition hover:border-[#C9A227]/55 hover:bg-[#FFFCF7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A2F19]/40"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next testimonials"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#DDD5CC] bg-white text-[#4A2F19] shadow-sm transition hover:border-[#C9A227]/55 hover:bg-[#FFFCF7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A2F19]/40"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 rounded-2xl bg-white animate-pulse border border-[#EDE4D8]"
                />
              ))}
            </div>
          ) : (
            <Swiper
              ref={sliderRef}
              slidesPerView={3}
              spaceBetween={24}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
            >
              {testimonials.map((item, key) => (
                <SwiperSlide key={item.id || key} className="!h-auto pb-2">
                  <SingleItem testimonial={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
