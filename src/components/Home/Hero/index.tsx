"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_WATCH_IMAGES } from "@/constants/heroWatchImages";

interface HeroSlide {
  id: number;
  image: string;
  subtitle: string;
  title: string;
  description: string;
}

interface ProductCard {
  id: number;
  image: string;
  title: string;
  description: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: HERO_WATCH_IMAGES.main,
    subtitle: "Introducing",
    title: "GLORIA TIMES",
    description:
      "Curated timepieces from leading maisons—precision movements, enduring design, and the quiet confidence of true luxury. Discover watches crafted for those who measure moments in excellence.",
  },
  {
    id: 2,
    image: HERO_WATCH_IMAGES.tissot,
    subtitle: "Explore",
    title: "TISSOT PRX",
    description:
      "Integrated bracelet, sunburst dial, and unmistakable 1970s sport-chic lines. The PRX delivers Swiss automatic performance with everyday versatility—modern heritage on the wrist.",
  },
  {
    id: 3,
    image: HERO_WATCH_IMAGES.hublot,
    subtitle: "Feel",
    title: "HUBLOT BIG BANG",
    description:
      "Fusion materials, skeleton architecture, and bold proportions define the Big Bang. A technical statement piece built for collectors who want innovation without compromise.",
  },
  {
    id: 4,
    image: HERO_WATCH_IMAGES.tagHeuer,
    subtitle: "Experience",
    title: "TAG HEUER CARRERA",
    description:
      "Clean dial geometry and motorsport heritage meet refined ergonomics. The Carrera remains the definitive three-hand chronograph for distinguished daily wear.",
  },
];

const productCards: ProductCard[] = [
  {
    id: 1,
    image: HERO_WATCH_IMAGES.tissot,
    title: "EXPLORE THE TISSOT PRX",
    description:
      "Sport-elegant integrated bracelet design with Swiss automatic heart.",
  },
  {
    id: 2,
    image: HERO_WATCH_IMAGES.hublot,
    title: "FEEL THE HUBLOT BIG BANG",
    description:
      "Skeleton dial and fusion case—engineering as sculpture on the wrist.",
  },
  {
    id: 3,
    image: HERO_WATCH_IMAGES.tagHeuer,
    title: "EXPERIENCE THE TAG HEUER CARRERA",
    description:
      "Racing pedigree and timeless proportions for the modern collector.",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentProduct, setCurrentProduct] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextProduct = () => {
    setCurrentProduct((prev) => (prev + 1) % productCards.length);
  };

  const prevProduct = () => {
    setCurrentProduct((prev) => (prev - 1 + productCards.length) % productCards.length);
  };

  const activeProduct = productCards[currentProduct];

  return (
    <section className="overflow-hidden bg-[#1F1209] pt-[calc(6.25rem+env(safe-area-inset-top))] pb-0 text-white">
      <div className="w-full mx-auto max-w-[100vw]">
        {/* Hero slider */}
        <div
          className="relative flex flex-col lg:flex-row lg:items-center lg:gap-6 xl:gap-10 rounded-none lg:rounded-sm overflow-visible mb-0 min-h-[min(92vh,820px)] lg:min-h-[420px] xl:min-h-[460px]"
          style={{
            backgroundImage: `url('${HERO_WATCH_IMAGES.woodenBg}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Readability veil — stronger on small screens for contrast */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/45 lg:bg-gradient-to-r lg:from-black/30 lg:via-transparent lg:to-black/20"
            aria-hidden
          />

          {/* Prev — 44px min touch target */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-[42%] z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/25 text-[#F2C27B] backdrop-blur-[2px] transition-colors hover:bg-black/40 hover:text-white active:scale-95 lg:top-1/2 lg:-translate-y-1/2"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.75} />
          </button>

          {/* Copy — first on mobile for readable hierarchy */}
          <div className="relative z-10 order-1 flex flex-1 flex-col justify-center px-5 pt-6 pb-4 sm:px-8 sm:pt-8 sm:pb-6 lg:order-2 lg:max-w-[52%] lg:px-10 xl:px-14 lg:py-10 lg:pr-8 xl:pr-12">
            <p className="text-[10px] sm:text-xs tracking-[0.28em] sm:tracking-[0.35em] uppercase text-[#F2C27B] mb-2 sm:mb-3">
              {heroSlides[currentSlide].subtitle}
            </p>
            <h1 className="text-[1.65rem] leading-tight xsm:text-[1.85rem] sm:text-4xl lg:text-5xl font-semibold tracking-[0.08em] sm:tracking-[0.18em] lg:tracking-[0.22em] text-[#F7D08A] mb-3 sm:mb-4">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-[#FDF4E3]/95 max-w-xl mb-6 sm:mb-8 line-clamp-6 sm:line-clamp-none [overflow-wrap:anywhere]">
              {heroSlides[currentSlide].description}
            </p>

            <Link
              href="/shop-without-sidebar"
              className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center px-8 py-3 bg-white text-[#2B1A0F] text-[11px] sm:text-xs font-medium tracking-[0.22em] sm:tracking-[0.28em] uppercase rounded-sm hover:bg-[#F3E3D0] active:bg-[#ebd5bc] transition text-center"
            >
              Shop collection
            </Link>
          </div>

          {/* Watch image */}
          <div className="relative z-10 order-2 flex flex-1 justify-center px-4 pb-28 sm:pb-32 lg:order-1 lg:pb-10 lg:justify-end lg:pr-4 xl:pr-8">
            <div className="relative w-full max-w-[280px] xsm:max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] xl:max-w-[460px] aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-[min(52vh,440px)] xl:h-[min(54vh,480px)]">
              <Image
                key={heroSlides[currentSlide].id}
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].title}
                fill
                sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 38vw"
                className="object-contain object-bottom drop-shadow-[0_25px_50px_rgba(0,0,0,0.55)] transition-opacity duration-500"
                priority
              />
            </div>
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-[42%] z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/25 text-[#F2C27B] backdrop-blur-[2px] transition-colors hover:bg-black/40 hover:text-white active:scale-95 lg:top-1/2 lg:-translate-y-1/2"
            aria-label="Next slide"
          >
            <ChevronRight className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.75} />
          </button>

          {/* Dots — larger tap targets on mobile */}
          <div
            className="absolute bottom-6 sm:bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:gap-2.5 px-4 pb-[env(safe-area-inset-bottom)]"
            role="tablist"
            aria-label="Hero slides"
          >
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={index === currentSlide}
                onClick={() => setCurrentSlide(index)}
                className={`flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-all touch-manipulation ${
                  index === currentSlide ? "text-[#F2C27B]" : "text-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                <span
                  className={`block rounded-full transition-all ${
                    index === currentSlide
                      ? "h-2 w-8 bg-[#F2C27B]"
                      : "h-2 w-3 bg-current hover:bg-[#F2C27B]/70"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product showcase */}
        <section className="product-showcase border-t border-white/10">
          {/* Desktop: three columns */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-0">
            {productCards.map((card, index) => (
              <article
                key={card.id}
                className={`flex flex-col md:flex-row min-h-[200px] ${
                  index === 0
                    ? "bg-[#1D2331]"
                    : index === 1
                      ? "bg-[#111111]"
                      : "bg-[#E5E5E5] text-[#111827]"
                }`}
              >
                <div className="md:w-1/2 p-5 lg:p-6 flex items-center justify-center min-h-[160px]">
                  <div className="relative h-36 w-full max-w-[200px]">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-contain"
                      sizes="200px"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 p-5 lg:p-6 flex flex-col justify-center">
                  <h3 className="text-xs lg:text-sm font-semibold mb-2 uppercase tracking-[0.14em] lg:tracking-[0.18em] leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs leading-relaxed opacity-90">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Mobile / tablet: single card carousel */}
          <div className="lg:hidden">
            <article
              key={activeProduct.id}
              className={`flex flex-col min-h-0 ${
                currentProduct === 0
                  ? "bg-[#1D2331]"
                  : currentProduct === 1
                    ? "bg-[#111111]"
                    : "bg-[#E5E5E5] text-[#111827]"
              }`}
            >
              <div className="relative w-full pt-6 pb-2 px-6 flex justify-center">
                <div className="relative h-44 w-full max-w-[260px]">
                  <Image
                    src={activeProduct.image}
                    alt={activeProduct.title}
                    fill
                    className="object-contain"
                    sizes="260px"
                    priority={currentProduct === 0}
                  />
                </div>
              </div>
              <div className="px-6 pb-6 pt-2 text-center sm:text-left sm:px-8 sm:pb-8">
                <h3 className="text-sm font-semibold mb-2 uppercase tracking-[0.15em] leading-snug">
                  {activeProduct.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed opacity-90 max-w-md mx-auto sm:mx-0">
                  {activeProduct.description}
                </p>
              </div>
            </article>

            <div className="flex items-center justify-center gap-4 py-4 px-4 bg-[#1F1209] border-t border-white/10">
              <button
                type="button"
                onClick={prevProduct}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 text-[#F2C27B] hover:bg-white/10 active:scale-95 transition touch-manipulation"
                aria-label="Previous product"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-2">
                {productCards.map((card, index) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setCurrentProduct(index)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full touch-manipulation ${
                      index === currentProduct ? "text-[#F2C27B]" : "text-white/40"
                    }`}
                    aria-label={`Go to product ${index + 1}`}
                  >
                    <span
                      className={`rounded-full transition-all ${
                        index === currentProduct
                          ? "h-2 w-8 bg-[#F2C27B]"
                          : "h-2 w-3 bg-current"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={nextProduct}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 text-[#F2C27B] hover:bg-white/10 active:scale-95 transition touch-manipulation"
                aria-label="Next product"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Hero;
