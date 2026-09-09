import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { formatPkr } from "@/lib/formatCurrency";
import { Trash2, Tag } from "lucide-react";

const SingleItem = ({ item, removeItemFromCart }: any) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFromCart = () => {
    dispatch(removeItemFromCart(item.id));
  };

  const thumbnail =
    item.imgs?.thumbnails?.[0] || item.imgs?.previews?.[0] || "/images/rolex.webp";
  const isCloudinary = typeof thumbnail === "string" && thumbnail.includes("cloudinary");

  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Thumbnail */}
        <Link
          href={`/shop-details/${item.id}`}
          className="relative flex items-center justify-center rounded-xl bg-[#F7F5F2] w-20 h-20 shrink-0 border border-gray-200 overflow-hidden hover:opacity-90 transition"
        >
          <Image
            src={thumbnail}
            alt={item.title || "Watch"}
            width={80}
            height={80}
            unoptimized={isCloudinary}
            className="object-contain p-1"
          />
        </Link>

        {/* Product Meta */}
        <div className="flex-1 min-w-0">
          {/* Category Tag */}
          {item.category && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#8B6914] bg-[#FAF3E8] px-2 py-0.5 rounded border border-[#EADBBE] mb-1">
              <Tag className="w-2.5 h-2.5" />
              {item.category}
            </span>
          )}

          {/* Title */}
          <h3 className="font-semibold text-sm text-[#1F1209] leading-snug line-clamp-1 hover:text-[#008060] transition">
            <Link href={`/shop-details/${item.id}`}>{item.title}</Link>
          </h3>

          {/* Description Snippet */}
          {item.description && (
            <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5 font-normal">
              {item.description}
            </p>
          )}

          {/* Price & Compare-At Row */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm font-bold text-[#E23737]">
              {formatPkr(item.discountedPrice)}
            </span>
            {item.price > item.discountedPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPkr(item.price)}
              </span>
            )}
            {item.quantity && item.quantity > 1 && (
              <span className="text-xs text-gray-600 font-medium ml-1">
                × {item.quantity}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemoveFromCart}
        aria-label="Remove item"
        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition shrink-0 mt-1"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SingleItem;
