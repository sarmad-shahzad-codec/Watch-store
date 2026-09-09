import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { HERO_WATCH_IMAGES } from "@/constants/heroWatchImages";

const stripImages = [
  { src: HERO_WATCH_IMAGES.tissot, label: "Tissot" },
  { src: HERO_WATCH_IMAGES.hublot, label: "Hublot" },
  { src: HERO_WATCH_IMAGES.tagHeuer, label: "TAG Heuer" },
] as const;

type ShopPageHeaderProps = {
  title?: string;
  breadcrumbCurrent?: string;
};

/**
 * Compact shop header — clears fixed Gloria Times navbar, breadcrumbs, hero CDN watches.
 */
const ShopPageHeader = ({
  title = "Luxury watches",
  breadcrumbCurrent = "Shop",
}: ShopPageHeaderProps) => {
  return (
    <section
      className="bg-[#FAF8F5] pt-[calc(6.25rem+env(safe-area-inset-top))] sm:pt-[calc(6.75rem+env(safe-area-inset-top))] md:pt-[calc(7rem+env(safe-area-inset-top))] pb-4 sm:pb-5 lg:pb-6"
      aria-labelledby="shop-page-heading"
    >
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div
          className="overflow-hidden rounded-xl border border-[#E8DFD4] shadow-[0_10px_36px_-14px_rgba(43,26,15,0.12)]"
          style={{
            backgroundImage: `linear-gradient(105deg, rgba(251,246,239,0.98) 0%, rgba(245,237,226,0.94) 45%, rgba(232,223,212,0.75) 100%), url(${HERO_WATCH_IMAGES.woodenBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(200px,300px)] gap-5 lg:gap-8 p-4 sm:p-5 md:p-6 lg:p-6 xl:p-7 items-center">
            <div className="min-w-0 flex flex-col gap-3">
              <nav aria-label="Breadcrumb" className="order-first">
                <ol className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[11px] sm:text-[12px]">
                  <li>
                    <Link
                      href="/"
                      className="text-[#6B5344]/90 hover:text-[#4A2F19] transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li className="text-[#C9A882]" aria-hidden>
                    <ChevronRight
                      className="w-3.5 h-3.5 inline -mt-px opacity-80"
                      strokeWidth={2}
                    />
                  </li>
                  <li>
                    <span className="font-medium text-[#4A2F19] capitalize">
                      {breadcrumbCurrent}
                    </span>
                  </li>
                </ol>
              </nav>

              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.38em] text-[#8B5A2B]">
                Gloria Times
              </p>
              <h1
                id="shop-page-heading"
                className="font-semibold text-[#1F1209] text-[1.4rem] xsm:text-[1.55rem] sm:text-[1.7rem] md:text-[1.85rem] leading-[1.15] tracking-[-0.02em]"
              >
                {title}
              </h1>
              <p className="text-[13px] sm:text-custom-sm text-dark-3 leading-relaxed max-w-[40ch] lg:max-w-[46ch] line-clamp-3 sm:line-clamp-none [overflow-wrap:anywhere]">
                Curated Swiss movements and Gloria Times editions. Tap any watch for
                full detail—same showcases as our home hero.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-3 sm:gap-4 lg:gap-3 shrink-0 pt-1 sm:pt-0">
              <div className="relative h-[140px] w-full max-w-[200px] xsm:max-w-[220px] sm:h-[160px] sm:max-w-[200px] md:h-[170px] lg:h-[180px] lg:max-w-[240px] lg:w-full mx-auto">
                <Image
                  src={HERO_WATCH_IMAGES.main}
                  alt="Featured Gloria Times watch"
                  fill
                  className="object-contain object-center drop-shadow-[0_14px_32px_rgba(43,26,15,0.2)]"
                  sizes="(max-width:640px) 220px, 240px"
                  priority
                />
              </div>
              <div className="flex items-center justify-center gap-2 sm:gap-2.5 sm:justify-start lg:justify-center">
                {stripImages.map(({ src, label }) => (
                  <div
                    key={label}
                    className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-md overflow-hidden border border-[#E8DFD4] bg-white/95 shadow-[0_2px_8px_rgba(43,26,15,0.06)]"
                  >
                    <Image
                      src={src}
                      alt={`${label} thumbnail`}
                      fill
                      className="object-contain p-1"
                      sizes="48px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopPageHeader;
