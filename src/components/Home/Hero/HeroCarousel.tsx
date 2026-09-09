"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";

const HeroCarousal = () => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      <SwiperSlide>
        <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-semibold text-heading-3 sm:text-heading-1 text-[#8B5A2B]">
                30%
              </span>
              <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                Gloria Times
                <br />
                Exclusive
              </span>
            </div>

            <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
              <a href="#">Discover Timeless Luxury Watches</a>
            </h1>

            <p>
              Explore curated Swiss and Japanese timepieces crafted to last a lifetime, only at Gloria Times.
            </p>

            <a
              href="#"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-[#4A2F19] py-3 px-9 ease-out duration-200 hover:bg-[#3A2413] mt-10"
            >
              Shop Watches
            </a>
          </div>

          <div>
            <Image
              src="/images/hero/hero-01.png"
              alt="luxury watch"
              width={351}
              height={358}
            />
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-15 lg:py-26 pl-4 sm:pl-7.5 lg:pl-12.5">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-semibold text-heading-3 sm:text-heading-1 text-[#8B5A2B]">
                New
              </span>
              <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                Wooden
                <br />
                Collection
              </span>
            </div>

            <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
              <a href="#">Handcrafted Wooden Strap Watches</a>
            </h1>

            <p>
              Warm wooden tones and minimalist dials designed for everyday elegance and comfort.
            </p>

            <a
              href="#"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-[#4A2F19] py-3 px-9 ease-out duration-200 hover:bg-[#3A2413] mt-10"
            >
              View Collection
            </a>
          </div>

          <div>
            <Image
              src="/images/hero/hero-02.png"
              alt="wooden strap watch"
              width={351}
              height={358}
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HeroCarousal;
