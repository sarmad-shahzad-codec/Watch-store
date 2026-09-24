import { Category } from "@/types/category";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const SingleItem = ({ item }: { item: Category }) => {
  const isRemote =
    item.img?.startsWith("http://") ||
    item.img?.startsWith("https://") ||
    item.img?.includes("cloudinary");

  return (
    <Link
      href={`/shop-without-sidebar?category=${encodeURIComponent(item.title)}`}
      className="group flex flex-col items-center select-none py-2"
    >
      {/* 100% Full Geometric Circle Container */}
      <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 aspect-square rounded-full bg-white border border-[#D9D4CC] shadow-sm group-hover:shadow-xl group-hover:border-[#1C1C1B] mb-3.5 overflow-hidden transition-all duration-300 group-hover:scale-105 flex items-center justify-center shrink-0">
        <Image
          src={item.img}
          alt={item.title}
          fill
          unoptimized={Boolean(isRemote)}
          sizes="(max-width: 640px) 144px, 192px"
          className="object-cover scale-[1.08] transition-transform duration-500 group-hover:scale-[1.14]"
        />
      </div>

      <div className="flex justify-center px-1 text-center">
        <h3 className="font-semibold text-sm sm:text-base text-[#1C1C1B] group-hover:text-[#8A7A5C] transition-colors truncate max-w-[160px]">
          {item.title}
        </h3>
      </div>
    </Link>
  );
};

export default SingleItem;
