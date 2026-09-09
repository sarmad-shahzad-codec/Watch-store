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
      className="group flex flex-col items-center select-none"
    >
      {/* Circular Avatar Container — clean studio watch badges */}
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-[#F2F3F8] border border-gray-200/80 shadow-xs group-hover:shadow-md mb-3.5 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-black/30 flex items-center justify-center">
        <Image
          src={item.img}
          alt={item.title}
          fill
          unoptimized={Boolean(isRemote)}
          className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex justify-center px-1">
        <h3 className="inline-block font-semibold text-xs sm:text-sm text-center text-[#111] group-hover:text-black transition-colors relative pb-1 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:w-0 group-hover:after:w-full after:bg-black after:transition-all after:duration-300 truncate max-w-[150px]">
          {item.title}
        </h3>
      </div>
    </Link>
  );
};

export default SingleItem;
