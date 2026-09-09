"use client";

import React from "react";
import Link from "next/link";
import { Truck, ShieldCheck, PackageCheck, Headphones, ArrowRight } from "lucide-react";

type WhyChooseGloriaProps = {
  className?: string;
  showBadges?: boolean;
};

const COMPARISON_ROWS = [
  {
    title: "Premium stainless steel & leather straps",
    ours: true,
    theirs: false,
  },
  {
    title: "Scratch-resistant glass",
    ours: true,
    theirs: false,
  },
  {
    title: "Water-resistant design",
    ours: true,
    theirs: false,
  },
  {
    title: "Luxury look at affordable price",
    ours: true,
    theirs: false,
  },
  {
    title: "Fast delivery & Cash on Delivery",
    ours: true,
    theirs: false,
  },
  {
    title: "100% Pre-inspected sealed packaging",
    ours: true,
    theirs: false,
  },
];

export default function WhyChooseGloria({
  className = "",
  showBadges = true,
}: WhyChooseGloriaProps) {
  return (
    <section className={`py-14 sm:py-18 bg-[#FAF8F5] border-y border-[#EBE5DC] ${className}`}>
      <div className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Matching 2S Store Screenshot */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111] tracking-tight">
            Why People Choose Gloria Times
          </h2>
          <p className="text-sm sm:text-base font-semibold text-gray-700 mt-2 flex items-center justify-center gap-2">
            <span>GLORIA TIMES</span>
            <span>⌚</span>
            <span>VS Others</span>
          </p>
        </div>

        {/* Comparison Card (Pixel-Perfect to Screenshot media_1788871146010.png) */}
        <div className="w-full max-w-[860px] mx-auto bg-white rounded-2xl border-2 border-black overflow-hidden shadow-sm">
          {/* Header Row */}
          <div className="grid grid-cols-[1fr_140px_110px] sm:grid-cols-[1fr_180px_140px] border-b-2 border-black bg-white">
            <div className="p-3.5 sm:p-5 font-bold text-xs sm:text-sm text-gray-500 uppercase tracking-wider flex items-center">
              Key Features
            </div>
            <div className="bg-black text-white font-bold text-xs sm:text-base flex items-center justify-center py-3.5 sm:py-4 border-r border-black tracking-wide">
              GLORIA TIMES
            </div>
            <div className="bg-white text-black font-bold text-xs sm:text-base flex items-center justify-center py-3.5 sm:py-4 tracking-wide">
              Others
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="divide-y divide-gray-200">
            {COMPARISON_ROWS.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[1fr_140px_110px] sm:grid-cols-[1fr_180px_140px] items-center hover:bg-gray-50/70 transition-colors"
              >
                {/* Feature Label */}
                <div className="p-3.5 sm:p-5 font-semibold text-xs sm:text-sm md:text-base text-gray-900 border-r border-gray-200">
                  {row.title}
                </div>

                {/* Gloria Times (Black Pill Checkmark) */}
                <div className="p-3 sm:p-4 flex items-center justify-center border-r border-gray-200 bg-[#FCFCFB]">
                  <span className="w-12 sm:w-16 h-7 sm:h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                    ✓
                  </span>
                </div>

                {/* Others (Italic X) */}
                <div className="p-3 sm:p-4 flex items-center justify-center font-semibold text-base sm:text-xl text-gray-800 italic">
                  X
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Trust Highlights Below Table */}
        {showBadges && (
          <div className="mt-10 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[960px] mx-auto">
            <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-[#22AD5C] flex-shrink-0" />
              <div>
                <div className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                  Verified Quality
                </div>
                <div className="text-[11px] text-gray-500">Inspected before dispatch</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
              <Truck className="w-6 h-6 text-gray-900 flex-shrink-0" />
              <div>
                <div className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                  Nationwide COD
                </div>
                <div className="text-[11px] text-gray-500">2 - 4 Days doorstep delivery</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-[#FBBF24] flex-shrink-0" />
              <div>
                <div className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                  24h Replacement
                </div>
                <div className="text-[11px] text-gray-500">No returns · WhatsApp claim</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
              <Headphones className="w-6 h-6 text-[#25D366] flex-shrink-0" />
              <div>
                <div className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                  WhatsApp Support
                </div>
                <div className="text-[11px] text-gray-500">0325-7982233</div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Link */}
        <div className="mt-8 text-center">
          <Link
            href="/shop-without-sidebar"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-black hover:text-gray-600 transition-colors underline underline-offset-4"
          >
            <span>Explore All Luxury Watches</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
