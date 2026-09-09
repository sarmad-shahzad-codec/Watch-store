import React from "react";
import type { Testimonial } from "@/types/testimonial";
import Image from "next/image";
import { Quote, Star } from "lucide-react";

const SingleItem = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <article className="group relative m-1 flex h-full flex-col rounded-xl border border-[#EDE4D8] bg-white px-5 py-7 shadow-[0_8px_30px_rgba(74,47,25,0.06)] transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(74,47,25,0.09)] sm:px-8">
      <Quote
        className="absolute right-5 top-5 h-8 w-8 text-[#F2C27B]/35 transition-colors group-hover:text-[#F2C27B]/50"
        strokeWidth={1.25}
        aria-hidden
      />

      <div className="mb-5 flex items-center gap-0.5" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="h-4 w-4 fill-[#C9A227] text-[#C9A227]"
            strokeWidth={0}
            aria-hidden
          />
        ))}
      </div>

      <p className="relative z-[1] mb-8 flex-1 text-[15px] leading-relaxed text-[#4A3728]">
        {testimonial.review}
      </p>

      <div className="flex items-center gap-4 border-t border-[#F0E8DC] pt-6">
        <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full ring-2 ring-[#FAF8F5] ring-offset-2 ring-offset-white">
          <Image
            src={testimonial.authorImg}
            alt=""
            width={52}
            height={52}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-semibold text-[#1F1209]">
            {testimonial.authorName}
          </h3>
          <p className="mt-0.5 text-[13px] leading-snug text-[#6B5344]">
            {testimonial.authorRole}
          </p>
        </div>
      </div>
    </article>
  );
};

export default SingleItem;
