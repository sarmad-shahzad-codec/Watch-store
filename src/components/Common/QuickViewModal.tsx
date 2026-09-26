"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { useAddToCart } from "@/hooks/useAddToCart";
import { formatPkr } from "@/lib/formatCurrency";
import { updateproductDetails } from "@/redux/features/product-details";
import { X, ChevronLeft, ChevronRight, Check, Minus, Plus } from "lucide-react";

const DEFAULT_DIAL_COLORS = [
  "Black",
  "Blue",
  "Green",
  "White",
  "Gold",
  "Silver",
  "Tiffany Blue",
  "Rose Gold",
  "Gray",
];

const QuickViewModal = () => {
  const { isModalOpen, closeModal } = useModalContext();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const addToCart = useAddToCart();

  const product = useAppSelector((state) => state.quickViewReducer.value);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [activePreview, setActivePreview] = useState(0);
  const [added, setAdded] = useState(false);

  const previews =
    product?.imgs?.previews && product.imgs.previews.length > 0
      ? product.imgs.previews
      : ["/images/tissot.webp"];

  const activeVariants = React.useMemo(() => {
    if (!product) return [];
    if (product.variants && product.variants.length > 0) {
      return product.variants.map((v, i) => ({
        name: v.name?.trim() || DEFAULT_DIAL_COLORS[i % DEFAULT_DIAL_COLORS.length] || `Option ${i + 1}`,
        image: v.image || previews[i] || previews[0],
        index: i,
      }));
    }
    if (previews.length > 1) {
      return previews.map((img, i) => ({
        name: DEFAULT_DIAL_COLORS[i % DEFAULT_DIAL_COLORS.length] || `Option ${i + 1}`,
        image: img,
        index: i,
      }));
    }
    return [{ name: "Standard Edition", image: previews[0], index: 0 }];
  }, [product, previews]);

  const currentImage = previews[activePreview] || previews[0] || "/images/tissot.webp";

  useEffect(() => {
    if (activeVariants.length > 0) {
      const match = activeVariants.find((v) => v.name === selectedColor);
      if (!match) {
        setSelectedColor(activeVariants[0].name);
      }
    }
  }, [activeVariants, selectedColor]);

  const handleSelectVariant = (variant: { name: string; image: string; index: number }) => {
    setSelectedColor(variant.name);
    if (variant.index >= 0 && variant.index < previews.length) {
      setActivePreview(variant.index);
    }
  };

  const discountPercent =
    product && product.price > product.discountedPrice
      ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
      : 0;

  const handlePrevImage = () => {
    setActivePreview((prev) => (prev === 0 ? previews.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActivePreview((prev) => (prev === previews.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      title: `${product.title} - ${selectedColor}`,
      quantity,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      closeModal();
    }, 900);
  };

  const handleBuyNow = () => {
    addToCart({
      ...product,
      title: `${product.title} - ${selectedColor}`,
      quantity,
    });
    closeModal();
    router.push("/checkout");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(".quick-view-dialog")) {
        closeModal();
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      setQuantity(1);
      setActivePreview(0);
    };
  }, [isModalOpen, closeModal]);

  if (!isModalOpen || !product || !product.id) return null;

  const detailHref = `/shop-details/${product.id}`;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto">
      <div className="quick-view-dialog relative w-full max-w-[860px] bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeModal}
          type="button"
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 z-30 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image Showcase with Smooth Zoom */}
          <div className="relative aspect-square md:aspect-auto w-full min-h-[340px] sm:min-h-[420px] bg-[#F7F5F2] flex items-center justify-center p-4 sm:p-6 select-none overflow-hidden group">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 z-10 inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#E23737] text-white text-xs font-semibold shadow-sm">
                -{discountPercent}%
              </span>
            )}

            <div className="relative w-full h-full max-h-[380px] flex items-center justify-center overflow-hidden">
              <Image
                src={currentImage}
                alt={product.title || "Product image"}
                width={450}
                height={450}
                priority
                unoptimized={typeof currentImage === "string" && currentImage.includes("cloudinary")}
                className="object-contain max-h-[360px] w-auto transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </div>

            {/* Prev / Next Arrows */}
            {previews.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow hover:bg-white text-gray-700 flex items-center justify-center transition-all opacity-80 hover:opacity-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow hover:bg-white text-gray-700 flex items-center justify-center transition-all opacity-80 hover:opacity-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Right: Product Details & Controls (2s Store Minimog Style) */}
          <div className="p-5 sm:p-7 flex flex-col justify-between">
            <div>
              {/* Category & In Stock Badges */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {product.category && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#8B6914] bg-[#FAF3E8] px-2.5 py-0.5 rounded border border-[#EADBBE]">
                    {product.category}
                  </span>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#22AD5C]"></span>
                  <span className="text-xs font-medium text-[#22AD5C]">
                    In Stock
                  </span>
                </div>
              </div>

              {/* Product Title */}
              <h2 className="text-lg sm:text-xl font-semibold text-[#111] mb-1.5 leading-snug">
                {product.title}
              </h2>

              {/* Pricing Row */}
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-lg sm:text-xl font-semibold text-[#E84E4E]">
                  {formatPkr(product.discountedPrice)}
                </span>
                {product.price > product.discountedPrice && (
                  <span className="text-sm sm:text-base text-gray-400 line-through font-normal">
                    {formatPkr(product.price)}
                  </span>
                )}
              </div>

              {/* Description Snippet */}
              {product.description && (
                <div className="mb-4 text-xs text-gray-600 leading-relaxed line-clamp-3 bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EDE4D8]">
                  {product.description}
                </div>
              )}

              {/* Dial Color Selector with Mini Watch Thumbnails */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs sm:text-sm font-medium text-[#111]">
                    Dial color:{" "}
                    <span className="font-bold text-[#8B6914] bg-[#FAF3E8] px-2 py-0.5 rounded border border-[#EADBBE] text-xs">
                      {selectedColor}
                    </span>
                  </div>
                  {activeVariants.length > 1 && (
                    <span className="text-[11px] text-gray-500 font-medium">
                      {activeVariants.length} Colors
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeVariants.map((variant) => {
                    const isSelected = selectedColor === variant.name;
                    return (
                      <button
                        key={`${variant.name}-${variant.index}`}
                        type="button"
                        onClick={() => handleSelectVariant(variant)}
                        className={`group/swatch relative flex items-center gap-1.5 pl-1 pr-3 py-1 rounded-full border-2 text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-[#1E1E1E] text-white border-[#1E1E1E] ring-2 ring-[#8B6914]/40 shadow-sm"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`relative w-6 h-6 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 p-0.5 border ${
                          isSelected ? "border-[#E5B869] bg-[#222]" : "border-gray-300 bg-[#F7F5F2]"
                        }`}>
                          <Image
                            src={variant.image}
                            alt={variant.name}
                            width={24}
                            height={24}
                            unoptimized={typeof variant.image === "string" && variant.image.includes("cloudinary")}
                            className="object-contain max-h-full max-w-full rounded-full group-hover/swatch:scale-110 transition-transform"
                          />
                        </div>
                        <span className="truncate">{variant.name}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869] animate-pulse ml-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector & Add to Cart */}
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-medium text-[#111] mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between w-28 h-11 px-2 bg-[#F2F2F2] rounded-md text-sm font-medium text-[#111] border border-gray-200/60">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                      aria-label="Decrease quantity"
                      className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:text-black hover:bg-gray-200 active:scale-90 transition cursor-pointer select-none"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                    <span className="font-bold text-center min-w-[20px] select-none">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      aria-label="Increase quantity"
                      className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:text-black hover:bg-gray-200 active:scale-90 transition cursor-pointer select-none"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 h-11 border border-black rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      added
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" /> Added
                      </>
                    ) : (
                      "Add to cart"
                    )}
                  </button>
                </div>
              </div>

              {/* Buy It Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-11.5 bg-black hover:bg-[#222] text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center shadow-sm active:scale-[0.99]"
              >
                Buy it now
              </button>
            </div>

            {/* Assurance footnote */}
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span>🇵🇰 Cash on Delivery</span>
              <span>⚡ 2-4 Days Delivery</span>
              <span>🔒 Checking Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
