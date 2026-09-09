"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { formatPkr } from "@/lib/formatCurrency";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useAddToCart } from "@/hooks/useAddToCart";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Eye, Heart, Check } from "lucide-react";
import { useModalContext } from "@/app/context/QuickViewModalContext";

const SingleGridItem = ({ item }: { item: Product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const addToCart = useAddToCart();
  const { openModal } = useModalContext();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  // Variant swatches
  const swatches: { name: string; image: string }[] =
    item.variants && item.variants.length > 0
      ? item.variants
      : item.imgs?.thumbnails && item.imgs.thumbnails.length > 1
      ? item.imgs.thumbnails.map((img, i) => ({ name: `Option ${i + 1}`, image: img }))
      : [
          {
            name: "Original",
            image: item.imgs?.previews?.[0] || "/images/tissot.webp",
          },
        ];

  const [activeImage, setActiveImage] = useState<string>(
    item.imgs?.previews?.[0] || swatches[0]?.image || "/images/tissot.webp"
  );
  const [activeIdx, setActiveIdx] = useState(0);

  const detailHref = `/shop-details/${item.id}`;

  const discountPercent =
    item.price > item.discountedPrice
      ? Math.round(((item.price - item.discountedPrice) / item.price) * 100)
      : 0;

  const stopNav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    stopNav(e);
    addToCart({
      ...item,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleItemToWishList = (e: React.MouseEvent) => {
    stopNav(e);
    dispatch(
      addItemToWishlist({
        ...item,
        status: "available",
        quantity: 1,
      })
    );
    setWishlisted(true);
    setTimeout(() => setWishlisted(false), 2000);
  };

  const handleSelectSwatch = (
    e: React.MouseEvent,
    swatchImg: string,
    idx: number
  ) => {
    stopNav(e);
    setActiveImage(swatchImg);
    setActiveIdx(idx);
  };

  const handlePrevSwatch = (e: React.MouseEvent) => {
    stopNav(e);
    const newIdx = activeIdx > 0 ? activeIdx - 1 : swatches.length - 1;
    setActiveIdx(newIdx);
    setActiveImage(swatches[newIdx].image);
  };

  const handleNextSwatch = (e: React.MouseEvent) => {
    stopNav(e);
    const newIdx = activeIdx < swatches.length - 1 ? activeIdx + 1 : 0;
    setActiveIdx(newIdx);
    setActiveImage(swatches[newIdx].image);
  };

  return (
    <div className="group relative flex flex-col w-full bg-white rounded-2xl border border-[#EDE4D8] p-3 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Product Image Area */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] border border-gray-100 mb-3">
        {/* Sale / Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 z-10 inline-flex items-center px-2 py-0.5 rounded bg-[#E23737] text-white text-[11px] font-bold tracking-tight shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleItemToWishList}
          aria-label="Add to wishlist"
          className="absolute top-2.5 right-2.5 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-white/90 backdrop-blur hover:bg-white text-gray-700 hover:text-[#E23737] shadow-sm transition-all duration-200"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              wishlisted ? "fill-[#E23737] text-[#E23737]" : ""
            }`}
          />
        </button>

        {/* Main Product Image */}
        <Link
          href={detailHref}
          onClick={() => {
            dispatch(updateQuickView({ ...item }));
            dispatch(updateproductDetails({ ...item }));
          }}
          className="relative block w-full h-full p-2 overflow-hidden"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={activeImage}
              alt={item.title}
              fill
              unoptimized={typeof activeImage === "string" && activeImage.includes("cloudinary")}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain w-full h-full transform transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
        </Link>
      </div>

      {/* Product Details Section (matching media_1788943219025.png) */}
      <div className="flex flex-col flex-1 text-left px-1">
        {/* Category Tag */}
        {item.category && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6914] mb-1 line-clamp-1">
            {item.category}
          </span>
        )}

        {/* Title */}
        <h3 className="font-semibold text-sm sm:text-[15px] text-[#111] hover:text-[#C9A227] transition-colors leading-snug line-clamp-1">
          <Link
            href={detailHref}
            onClick={() => {
              dispatch(updateQuickView({ ...item }));
              dispatch(updateproductDetails({ ...item }));
            }}
          >
            {item.title}
          </Link>
        </h3>

        {/* Subtitle */}
        <p className="text-xs text-gray-500 mt-0.5 mb-2 line-clamp-1">
          {item.subtitle || `${item.brand} Luxury Collection`}
        </p>

        {/* Price & Quick Buy Row */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-1 mb-3">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base sm:text-[17px] font-bold text-[#111] tabular-nums">
              {formatPkr(item.discountedPrice)}
            </span>
            {item.price > item.discountedPrice && (
              <span className="text-xs text-gray-400 line-through font-normal tabular-nums">
                {formatPkr(item.price)}
              </span>
            )}
          </div>

          {/* Quick Buy Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`min-h-[32px] px-3 py-1 rounded-md text-xs font-bold transition-all duration-200 active:scale-95 shrink-0 ${
              added
                ? "bg-[#16A34A] text-white"
                : "bg-black hover:bg-[#222] text-white"
            }`}
          >
            {added ? (
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-white" /> Added
              </span>
            ) : (
              "Quick Buy"
            )}
          </button>
        </div>

        {/* Swatches Thumbnail Carousel (< [1] [2] [3] >) */}
        {swatches.length > 1 && (
          <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100 overflow-x-auto select-none no-scrollbar">
            {/* Left Chevron */}
            <button
              type="button"
              onClick={handlePrevSwatch}
              aria-label="Previous color"
              className="h-6 w-5 flex items-center justify-center text-gray-400 hover:text-black shrink-0 text-xs transition-colors"
            >
              ‹
            </button>

            {/* Thumbnail Swatches */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {swatches.map((swatch, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => handleSelectSwatch(e, swatch.image, idx)}
                    onMouseEnter={() => {
                      setActiveImage(swatch.image);
                      setActiveIdx(idx);
                    }}
                    title={swatch.name}
                    className={`relative h-7 w-7 sm:h-8 sm:w-8 rounded-md overflow-hidden bg-gray-50 shrink-0 transition-all ${
                      isActive
                        ? "ring-2 ring-black ring-offset-1 border border-black shadow-sm"
                        : "border border-gray-200 hover:border-gray-500 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={swatch.image}
                      alt={swatch.name}
                      fill
                      unoptimized={typeof swatch.image === "string" && swatch.image.includes("cloudinary")}
                      className="object-contain p-0.5"
                    />
                  </button>
                );
              })}
            </div>

            {/* Right Chevron */}
            <button
              type="button"
              onClick={handleNextSwatch}
              aria-label="Next color"
              className="h-6 w-5 flex items-center justify-center text-gray-400 hover:text-black shrink-0 text-xs transition-colors"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleGridItem;
