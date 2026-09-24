"use client";

import React from "react";
import type { Testimonial } from "@/types/testimonial";
import Image from "next/image";
import { Quote, Star, CheckCircle, Watch } from "lucide-react";

const SingleItem = ({ testimonial }: { testimonial: Testimonial }) => {
  const isCloudinaryOrRemote =
    typeof testimonial.authorImg === "string" &&
    (testimonial.authorImg.includes("cloudinary") ||
      testimonial.authorImg.startsWith("http"));

  const ratingCount = Math.max(1, Math.min(5, Number(testimonial.rating || 5)));

  return (
    <article className="group relative m-1 flex h-full flex-col rounded-2xl border border-[#EDE4D8] bg-white overflow-hidden shadow-[0_8px_30px_rgba(74,47,25,0.06)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(74,47,25,0.12)] hover:-translate-y-1">
      {/* Customer / Watch Photo Banner */}
      <div className="relative w-full aspect-[4/3] bg-[#FAF8F5] overflow-hidden border-b border-[#EDE4D8]/80">
        <Image
          src={testimonial.authorImg || "/images/hero-lineup/tissot.webp"}
          alt={testimonial.authorName || "Customer Review"}
          fill
          unoptimized={isCloudinaryOrRemote}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-3 group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Verified Buyer Badge */}
        <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase shadow-sm">
          <CheckCircle className="h-3 w-3 text-[#16A34A]" />
          <span>Verified Buyer</span>
        </div>

        {/* Floating Quote Icon */}
        <div className="absolute top-3 right-3 z-10 h-7 w-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#8B6914] shadow-sm">
          <Quote className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Review Details Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Star Rating & Model Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-0.5" aria-label={`${ratingCount} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < ratingCount
                    ? "fill-[#C9A227] text-[#C9A227]"
                    : "fill-gray-200 text-gray-200"
                }`}
                strokeWidth={0}
                aria-hidden
              />
            ))}
          </div>

          {testimonial.watchModel && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8B6914] bg-[#C9A227]/10 px-2 py-0.5 rounded-md truncate max-w-[170px]">
              <Watch className="h-3 w-3 shrink-0" />
              <span className="truncate">{testimonial.watchModel}</span>
            </span>
          )}
        </div>

        {/* Review Quotation Text */}
        <p className="flex-1 text-[13px] sm:text-sm leading-relaxed text-[#4A3728] mb-5 font-normal italic">
          &ldquo;{testimonial.review}&rdquo;
        </p>

        {/* Author Footer */}
        <div className="border-t border-[#F0E8DC] pt-4 mt-auto flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#1F1209] text-sm">
              {testimonial.authorName}
            </h3>
            <p className="text-[12px] text-[#6B5344] mt-0.5">
              {testimonial.authorRole || "Verified Buyer"}
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
            ✓ Authentic Delivery
          </span>
        </div>
      </div>
    </article>
  );
};

export default SingleItem;
