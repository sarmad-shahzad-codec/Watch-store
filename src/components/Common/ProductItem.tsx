"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatPkr } from "@/lib/formatCurrency";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useAddToCart } from "@/hooks/useAddToCart";
import { ShoppingBag, Eye, Heart, Check } from "lucide-react";
import { useModalContext } from "@/app/context/QuickViewModalContext";

const ProductItem = ({ item }: { item: Product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const addToCart = useAddToCart();
  const { openModal } = useModalContext();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const detailHref = `/shop-details/${item.id}`;

  const primaryImg = item.imgs?.previews?.[0] || "/images/tissot.webp";
  const secondaryImg =
    item.imgs?.previews?.[1] && item.imgs.previews[1] !== primaryImg
      ? item.imgs.previews[1]
      : null;

  const discountPercent =
    item.price > item.discountedPrice
      ? Math.round(((item.price - item.discountedPrice) / item.price) * 100)
      : 0;

  const isAccessory = item.brand?.toLowerCase() === "accessories";

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    stop(e);
    addToCart({
      ...item,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleItemToWishList = (e: React.MouseEvent) => {
    stop(e);
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

  const handleQuickView = (e: React.MouseEvent) => {
    stop(e);
    dispatch(updateQuickView({ ...item }));
    dispatch(updateproductDetails({ ...item }));
    openModal();
  };

  return (
    <div className="group relative flex flex-col w-full text-center transition-all duration-300">
      {/* Product Image Area - Full Bleed with Smooth Hover Zoom */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#F6F5F2] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Sale / Discount Badge or Coming Soon Badge */}
        {isAccessory ? (
          <span className="absolute top-3 left-3 z-10 inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#0B0F19] text-[#F2C27B] text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase border border-[#F2C27B]/40 shadow-sm">
            COMING SOON
          </span>
        ) : (
          discountPercent > 0 && (
            <span className="absolute top-3 left-3 z-10 inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#E23737] text-white text-[11px] sm:text-xs font-semibold tracking-tight shadow-sm">
              -{discountPercent}%
            </span>
          )
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleItemToWishList}
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/85 backdrop-blur hover:bg-white text-gray-700 hover:text-[#E23737] shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted ? "fill-[#E23737] text-[#E23737]" : ""
            }`}
          />
        </button>

        {/* Product Images with 2s store deep zoom */}
        <Link
          href={detailHref}
          onClick={() => {
            dispatch(updateQuickView({ ...item }));
            dispatch(updateproductDetails({ ...item }));
          }}
          className="relative block w-full h-full overflow-hidden"
        >
          {/* Primary image */}
          <div
            className={`relative w-full h-full flex items-center justify-center overflow-hidden transition-all duration-700 ease-out ${
              secondaryImg ? "group-hover:opacity-0" : ""
            }`}
          >
            <Image
              src={primaryImg}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-110"
            />
          </div>

          {/* Secondary image on hover */}
          {secondaryImg && (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100">
              <Image
                src={secondaryImg}
                alt={`${item.title} alternate view`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </div>
          )}
        </Link>

        {/* Static Action Bar (No bottom-to-top movement) */}
        <div className="absolute inset-x-3 bottom-3 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isAccessory ? (
            <a
              href={`https://wa.me/923257982233?text=Assalam%20o%20Alaikum%20Gloria%20Times%2C%20I%20want%20to%20inquire%20about%20${encodeURIComponent(item.title)}%20(Coming%20Soon)`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stop}
              className="flex-1 h-10 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xl transition-all duration-200 bg-[#0B0F19] hover:bg-black text-[#F2C27B] border border-[#F2C27B]/40 active:scale-95"
            >
              <span>⏳ Coming Soon · Inquire</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 h-10 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xl transition-all duration-200 active:scale-95 ${
                added
                  ? "bg-[#16A34A] text-white"
                  : "bg-[#111111] hover:bg-black text-white border border-white/20"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-white" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-white" /> Quick Add
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleQuickView}
            aria-label="Quick view"
            title="Quick view"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-xl transition-colors active:scale-95"
          >
            <Eye className="w-4 h-4 text-gray-900" />
          </button>
        </div>
      </div>

      {/* Product Information - Clean Centered Layout matching 2s Store */}
      <div className="flex flex-col items-center pt-3 pb-1">
        {/* Title */}
        <h3 className="font-medium text-[15px] sm:text-base text-[#111] hover:text-[#E84E4E] transition-colors leading-snug line-clamp-1 mb-1.5">
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

        {/* Pricing Row - Centered Red Sale Price + Line-through Original */}
        <div className="flex items-center justify-center gap-2 text-center">
          <span className="text-base sm:text-[17px] font-medium text-[#E84E4E]">
            {formatPkr(item.discountedPrice)}
          </span>
          {item.price > item.discountedPrice && (
            <span className="text-xs sm:text-sm text-gray-400 line-through font-normal">
              {formatPkr(item.price)}
            </span>
          )}
          {isAccessory && (
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded uppercase">
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
