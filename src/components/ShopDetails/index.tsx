"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { updateproductDetails } from "@/redux/features/product-details";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useAddToCart } from "@/hooks/useAddToCart";
import shopData from "../Shop/shopData";
import { useStoreProducts } from "@/hooks/useProducts";
import type { Product } from "@/types/product";
import { formatPkr } from "@/lib/formatCurrency";
import RecentlyViewdItems from "./RecentlyViewd";
import ProductFaq from "../Common/ProductFaq";
import toast from "react-hot-toast";
import {
  Heart,
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  PackageCheck,
  ChevronLeft,
  ChevronRight,
  Star,
  Eye,
  Zap,
  Share2,
  CheckCircle2,
} from "lucide-react";

type ShopDetailsProps = {
  productId: number;
};

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

const ShopDetails = ({ productId }: ShopDetailsProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const addToCart = useAddToCart();

  const [previewImg, setPreviewImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews" | "shipping">("desc");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [viewerCount, setViewerCount] = useState(30);

  const buySectionRef = useRef<HTMLDivElement>(null);

  const { products } = useStoreProducts();
  const fromCatalog = useMemo((): Product | undefined => {
    if (!Number.isFinite(productId) || productId < 1) return undefined;
    return (
      products.find((p) => p.id === productId) ||
      shopData.find((p) => p.id === productId)
    );
  }, [productId, products]);

  useEffect(() => {
    if (fromCatalog) {
      dispatch(updateproductDetails(fromCatalog));
      try {
        localStorage.setItem("productDetails", JSON.stringify(fromCatalog));
      } catch {
        /* ignore */
      }
    }
  }, [fromCatalog, dispatch]);

  // Subtle realistic fluctuation for live viewers (26 - 36)
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 24 && next <= 38 ? next : 30;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Sticky bottom purchase bar matching 2s Store screenshot
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!fromCatalog) {
    return (
      <section className="relative bg-[#FAF8F5] pt-[120px] pb-24 text-center">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8">
          <p className="text-dark-3 mb-8 max-w-md mx-auto text-lg">
            We couldn&apos;t find this timepiece. Browse our collection to choose a watch.
          </p>
          <Link
            href="/shop-without-sidebar"
            className="inline-flex font-semibold text-sm text-white bg-black py-3.5 px-8 rounded-lg tracking-wider uppercase hover:bg-gray-800 transition-colors"
          >
            Browse All Watches
          </Link>
        </div>
      </section>
    );
  }

  const product = fromCatalog;
  const previews = useMemo(() => {
    return product.imgs?.previews && product.imgs.previews.length > 0
      ? product.imgs.previews
      : ["/images/tissot.webp"];
  }, [product.imgs?.previews]);

  const activeVariants = useMemo(() => {
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
  }, [product.variants, previews]);

  const currentPreview = previews[previewImg] || previews[0];

  useEffect(() => {
    if (activeVariants.length > 0) {
      const exists = activeVariants.some((v) => v.name === selectedColor);
      if (!exists) {
        setSelectedColor(activeVariants[0].name);
      }
    }
  }, [activeVariants, selectedColor]);

  const handleSelectVariant = (variant: { name: string; image: string; index: number }) => {
    setSelectedColor(variant.name);
    if (variant.index >= 0 && variant.index < previews.length) {
      setPreviewImg(variant.index);
    }
  };

  const discountPercent =
    product.price > product.discountedPrice
      ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
      : 0;

  const savingsAmount = product.price > product.discountedPrice ? product.price - product.discountedPrice : 851;

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
    });
    setIsAdded(true);
    toast.success(`${product.title} (${selectedColor}) added to cart!`);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleBuyNow = () => {
    dispatch(
      addItemToCart({
        id: product.id,
        title: `${product.title} - ${selectedColor}`,
        price: product.price,
        discountedPrice: product.discountedPrice,
        quantity,
        imgs: product.imgs,
      })
    );
    router.push("/checkout");
  };

  const handleToggleWishlist = () => {
    if (!isWishlisted) {
      dispatch(
        addItemToWishlist({
          ...product,
          status: "available",
          quantity: 1,
        })
      );
      setIsWishlisted(true);
      toast.success("Added to wishlist!");
    } else {
      setIsWishlisted(false);
      toast("Removed from wishlist");
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} at Gloria Times!`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // 2s store WhatsApp prefilled order message
  const whatsappOrderMessage = encodeURIComponent(
    `Assalam o Alaikum Gloria Times!\n\nI want to order:\n📦 Watch: ${product.title}\n🎨 Dial Color: ${selectedColor}\n🔢 Quantity: ${quantity}\n💰 Price: ${formatPkr(product.discountedPrice * quantity)}\n\nPlease confirm my Cash on Delivery order!`
  );
  const whatsappUrl = `https://wa.me/923257982233?text=${whatsappOrderMessage}`;

  return (
    <div className="bg-white">
      {/* Top spacing to clear fixed Gloria Times header */}
      <div className="pt-[105px] sm:pt-[115px] lg:pt-[125px]">
        
        {/* Breadcrumb Navigation matching 2s Store Screenshot: Home > 2999 Sale > Tissot PRX 1853 */}
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center justify-center sm:justify-start gap-2.5 text-xs sm:text-sm text-gray-700 font-normal">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span className="text-gray-400 text-xs">&gt;</span>
            <Link href="/shop-without-sidebar" className="hover:text-black transition-colors">
              {product.category || "Luxury Watches"}
            </Link>
            <span className="text-gray-400 text-xs">&gt;</span>
            <span className="text-gray-900 font-medium truncate max-w-[220px] sm:max-w-none">
              {product.title}
            </span>
          </nav>
        </div>

        {/* Main Product Showcase Section (Replicating media_1788871114450.png) */}
        <section className="pb-10 lg:pb-16">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
              
              {/* Left Column: Authentic 2S Store Watch Showcase Gallery */}
              <div className="lg:col-span-6 flex flex-col">
                {/* Primary Large Image Frame */}
                <div className="group relative w-full aspect-square bg-[#F7F5F2] rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center p-4 sm:p-6 select-none">
                  {/* Sale Pill Badge (-22% Style) */}
                  {discountPercent > 0 && (
                    <span className="absolute top-4 left-4 z-10 inline-flex items-center px-3 py-1 rounded-full bg-[#E23737] text-white text-xs sm:text-sm font-bold shadow-sm">
                      -{discountPercent}%
                    </span>
                  )}

                  {/* Smooth Deep Zoom on Hover */}
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    <Image
                      src={currentPreview}
                      alt={product.title}
                      width={550}
                      height={550}
                      priority
                      unoptimized={typeof currentPreview === "string" && currentPreview.includes("cloudinary")}
                      className="object-contain max-h-[460px] w-auto transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </div>

                  {/* Previous / Next Arrow Controls */}
                  {previews.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewImg((prev) => (prev === 0 ? previews.length - 1 : prev - 1))
                        }
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow hover:bg-white text-gray-700 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewImg((prev) => (prev === previews.length - 1 ? 0 : prev + 1))
                        }
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow hover:bg-white text-gray-700 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails Strip */}
                {previews.length > 1 && (
                  <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                    {previews.map((thumb, idx) => {
                      const variantForThumb = activeVariants[idx];
                      const isSelected = idx === previewImg;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPreviewImg(idx);
                            if (variantForThumb?.name) {
                              setSelectedColor(variantForThumb.name);
                            }
                          }}
                          title={variantForThumb?.name ? `View ${variantForThumb.name}` : undefined}
                          className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-[#F7F5F2] border-2 transition-all p-1.5 flex items-center justify-center group ${
                            isSelected
                              ? "border-black shadow-sm ring-1 ring-black"
                              : "border-gray-200 hover:border-gray-400 opacity-75 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={thumb}
                            alt={variantForThumb?.name || `Thumbnail ${idx + 1}`}
                            width={70}
                            height={70}
                            unoptimized={typeof thumb === "string" && thumb.includes("cloudinary")}
                            className="object-contain max-h-full w-auto transition-transform duration-200 group-hover:scale-105"
                          />
                          {variantForThumb?.name && (
                            <span className="absolute bottom-1 inset-x-1 text-[9px] font-semibold bg-black/75 text-white py-0.5 px-1 rounded text-center truncate pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                              {variantForThumb.name}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Exactly matching media_1788871114450.png */}
              <div className="lg:col-span-6 flex flex-col justify-start">
                {/* Category Tag */}
                {product.category && (
                  <div className="mb-1.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#8B6914] bg-[#FAF3E8] px-2.5 py-0.5 rounded border border-[#EADBBE]">
                      {product.category}
                    </span>
                  </div>
                )}

                {/* 1. Product Title & Wishlist Heart Button */}
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#111] leading-tight">
                    {product.title}
                  </h1>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleWishlist}
                      aria-label="Add to wishlist"
                      className="w-10 h-10 rounded-full border border-gray-200 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors flex-shrink-0"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          isWishlisted ? "fill-[#E23737] text-[#E23737]" : ""
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={handleShare}
                      aria-label="Share product"
                      className="w-10 h-10 rounded-full border border-gray-200 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors flex-shrink-0"
                      title="Share product"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 3. Price Row (Rs.2,999.00  Rs.3,850.00  SAVERS.851.00) */}
                <div className="flex items-center gap-2.5 my-3">
                  <span className="text-2xl sm:text-3xl font-bold text-[#E23737]">
                    {formatPkr(product.discountedPrice)}
                  </span>
                  <span className="text-sm sm:text-base text-gray-400 line-through font-normal">
                    {formatPkr(product.price)}
                  </span>
                  <span className="bg-[#E23737] text-white text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded uppercase tracking-tight">
                    SAVERS.{savingsAmount}.00
                  </span>
                </div>

                {/* 4. Star Rating */}
                <div className="flex items-center gap-1.5 my-1.5">
                  <div className="flex text-[#FBBF24]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700 ml-1">
                    4 reviews
                  </span>
                </div>

                {/* 5. Live Viewers Count */}
                <div className="flex items-center gap-2 my-2.5 text-xs sm:text-sm text-gray-800">
                  <Eye className="w-4 h-4 text-black" />
                  <span>
                    <strong className="font-bold text-gray-900">{viewerCount} people</strong> are viewing this right now
                  </span>
                </div>

                {/* In Stock Indicator */}
                <div className="flex items-center gap-2 mt-1 mb-4 text-xs sm:text-sm font-semibold text-[#22AD5C]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22AD5C] inline-block"></span>
                  <span>In Stock — Ready for Dispatch</span>
                </div>

                {/* 6. Dial Color Swatches with Watch Miniatures */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="text-xs sm:text-sm font-semibold text-gray-900">
                      Dial color:{" "}
                      <span className="font-bold text-[#8B6914] bg-[#FAF3E8] px-2 py-0.5 rounded border border-[#EADBBE] text-xs">
                        {selectedColor}
                      </span>
                    </div>
                    {activeVariants.length > 1 && (
                      <span className="text-[11px] text-gray-500 font-medium">
                        {activeVariants.length} Colors Available
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {activeVariants.map((variant) => {
                      const isSelected = selectedColor === variant.name;
                      return (
                        <button
                          key={`${variant.name}-${variant.index}`}
                          type="button"
                          onClick={() => handleSelectVariant(variant)}
                          className={`group/swatch relative flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-lg border-2 text-xs font-semibold transition-all shadow-xs ${
                            isSelected
                              ? "bg-[#111111] text-white border-[#111111] ring-2 ring-[#8B6914]/40 shadow-sm"
                              : "bg-white text-gray-800 border-gray-200 hover:border-gray-400 hover:bg-gray-50/80"
                          }`}
                        >
                          {/* Mini Watch Preview Thumbnail */}
                          <div className="relative w-8 h-8 rounded-md bg-[#F7F5F2] border border-gray-200/80 overflow-hidden flex items-center justify-center flex-shrink-0">
                            <Image
                              src={variant.image}
                              alt={variant.name}
                              width={32}
                              height={32}
                              unoptimized={typeof variant.image === "string" && variant.image.includes("cloudinary")}
                              className="object-contain max-h-full max-w-full group-hover/swatch:scale-110 transition-transform duration-200"
                            />
                          </div>

                          {/* Color Name */}
                          <span className="tracking-tight text-xs">
                            {variant.name}
                          </span>

                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869] animate-pulse ml-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 7. Quantity Stepper, Add to Cart & Buy It Now */}
                <div ref={buySectionRef} className="space-y-3 pt-1">
                  <div className="text-xs sm:text-sm font-semibold text-gray-900">
                    Quantity
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Stepper [- 1 +] */}
                    <div className="flex items-center justify-between w-28 sm:w-32 h-11 px-3 bg-[#F2F2F2] rounded-lg text-sm sm:text-base font-semibold text-gray-900">
                      <button
                        type="button"
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        aria-label="Decrease quantity"
                        className="p-1 hover:text-gray-600 transition-colors"
                      >
                        –
                      </button>
                      <span>{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        aria-label="Increase quantity"
                        className="p-1 hover:text-gray-600 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart Button (White with Black Border) */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex-1 h-11 px-6 rounded-lg border-2 border-black bg-white hover:bg-black hover:text-white text-black font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Added to cart</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to cart</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Buy It Now (Full Width Solid Black Button) */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full h-12 py-3 px-6 rounded-lg bg-[#000000] hover:bg-gray-900 text-white font-bold text-sm sm:text-base tracking-wide uppercase transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-current text-[#FBBF24]" />
                    <span>Buy it now</span>
                  </button>

                  {/* WhatsApp Order Button */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-11 py-2.5 px-6 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2.5"
                  >
                    <svg
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    <span>Order Directly via WhatsApp</span>
                  </a>
                </div>

                {/* Pakistani Trust Assurance Cards */}
                <div className="mt-6 grid grid-cols-2 gap-3 p-4 bg-[#FAF9F7] rounded-xl border border-gray-200">
                  <div className="flex items-start gap-2.5">
                    <Truck className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">Cash on Delivery</div>
                      <div className="text-[11px] text-gray-500">Nationwide across Pakistan</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-[#22AD5C] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">Verified Quality</div>
                      <div className="text-[11px] text-gray-500">Inspected before dispatch</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Zap className="w-5 h-5 text-[#FBBF24] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">2 - 4 Days Express</div>
                      <div className="text-[11px] text-gray-500">TCS / Trax door delivery</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">24h Replacement</div>
                      <div className="text-[11px] text-gray-500">Report within 24 hours</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table Section (From media_1788871146010.png) */}
        <section className="bg-[#FAF9F7] py-14 border-y border-gray-200/70">
          <div className="max-w-[860px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Why People Choose Gloria Times
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                GLORIA TIMES ⌚ VS Others
              </p>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="grid grid-cols-12 bg-black text-white py-3.5 px-4 sm:px-6 text-xs sm:text-sm font-bold uppercase tracking-wider">
                <div className="col-span-6 sm:col-span-7">Features</div>
                <div className="col-span-3 sm:col-span-3 text-center">Gloria Times</div>
                <div className="col-span-3 sm:col-span-2 text-center text-gray-400">Others</div>
              </div>

              <div className="divide-y divide-gray-100">
                {[
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
                    title: "Fast delivery & Nationwide Cash on Delivery",
                    ours: true,
                    theirs: false,
                  },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 items-center py-4 px-4 sm:px-6 hover:bg-gray-50/70 transition-colors"
                  >
                    <div className="col-span-6 sm:col-span-7 text-xs sm:text-sm font-semibold text-gray-900">
                      {row.title}
                    </div>
                    <div className="col-span-3 sm:col-span-3 flex justify-center">
                      <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        ✓
                      </span>
                    </div>
                    <div className="col-span-3 sm:col-span-2 flex justify-center">
                      <span className="text-gray-400 font-semibold text-lg">✕</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tabs: Description, Specs, Reviews, Shipping */}
        <section className="bg-white py-14">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex border-b border-gray-200 gap-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab("desc")}
                className={`pb-4 text-base font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === "desc"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`pb-4 text-base font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === "specs"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-4 text-base font-semibold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "reviews"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                <span>Customer Reviews</span>
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                  {product.reviews}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`pb-4 text-base font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === "shipping"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                Shipping & Replacement
              </button>
            </div>

            {/* Tab 1: Description */}
            {activeTab === "desc" && (
              <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About this Timepiece</h3>
                  {product.description.split(/\n\n/).map((para, idx) => (
                    <p key={idx} className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                      {para}
                    </p>
                  ))}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Care & Maintenance</h3>
                  {product.careNotes.split(/\n\n/).map((para, idx) => (
                    <p key={idx} className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                      {para}
                    </p>
                  ))}

                  <div className="mt-6 p-4 rounded-xl bg-[#FAF9F7] border border-gray-200">
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">Package Includes:</h4>
                    <ul className="text-xs sm:text-sm text-gray-600 space-y-1.5 list-disc list-inside">
                      <li>1x {product.title} luxury watch with cushion</li>
                      <li>1x Gloria Times hard shell luxury gift box</li>
                      <li>1x Official inspection & warranty card</li>
                      <li>1x Watch adjustment guide</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Specifications */}
            {activeTab === "specs" && (
              <div className="py-8 max-w-2xl">
                <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                  {product.specs.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-3 py-3 px-4 sm:px-6 text-sm">
                      <span className="font-semibold text-gray-600">{row.label}</span>
                      <span className="col-span-2 text-gray-900 font-medium">{row.value}</span>
                    </div>
                  ))}
                  <div className="grid grid-cols-3 py-3 px-4 sm:px-6 text-sm bg-gray-50">
                    <span className="font-semibold text-gray-600">Payment Option</span>
                    <span className="col-span-2 text-gray-900 font-medium">Cash on Delivery (Nationwide)</span>
                  </div>
                  <div className="grid grid-cols-3 py-3 px-4 sm:px-6 text-sm">
                    <span className="font-semibold text-gray-600">Inspection</span>
                    <span className="col-span-2 text-emerald-700 font-medium">Pre-inspected & Sealed Luxury Box</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Customer Reviews */}
            {activeTab === "reviews" && (
              <div className="py-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-extrabold text-gray-900">4.9</span>
                      <div className="flex text-[#FBBF24]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Based on {product.reviews} verified Pakistani customer reviews
                    </p>
                  </div>

                  <div className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg font-medium">
                    ✓ 100% Authentic Customer Feedback
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      name: "Muhammad Hamza",
                      city: "Lahore, Punjab",
                      date: "2 days ago",
                      text: "Bohot zabardast watch hai! Bilkul luxury store jesi build quality aur premium packing mili. Fast delivery within 2 days in Lahore. Highly recommended!",
                      stars: 5,
                    },
                    {
                      name: "Bilal Tariq",
                      city: "Karachi, Sindh",
                      date: "5 days ago",
                      text: "Finishing is 10/10. Heavy weight feel in hand, bracelet fitting is perfect. Delivered in 2 days in Karachi via Trax.",
                      stars: 5,
                    },
                    {
                      name: "Usman Ali",
                      city: "Islamabad",
                      date: "1 week ago",
                      text: "Tissot PRX dial shines amazing in sunlight. Best buy at 2999 PKR. Customer support on WhatsApp answered all questions instantly.",
                      stars: 5,
                    },
                  ].map((rev, idx) => (
                    <div key={idx} className="p-4 sm:p-5 rounded-xl bg-[#FAF9F7] border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-bold text-sm text-gray-900">{rev.name}</span>
                          <span className="text-xs text-gray-500 ml-2">({rev.city})</span>
                        </div>
                        <span className="text-xs text-gray-400">{rev.date}</span>
                      </div>
                      <div className="flex text-[#FBBF24] mb-2">
                        {[...Array(rev.stars)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700">{rev.text}</p>
                      <div className="mt-2 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Order
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Shipping & Replacement */}
            {activeTab === "shipping" && (
              <div className="py-8 max-w-2xl space-y-5 text-gray-700 text-sm sm:text-base leading-relaxed">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900">
                  <h4 className="font-bold text-base mb-1 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-gray-800" />
                    Strict 24-Hour Replacement Warranty (No Returns / No Refunds)
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    All orders are thoroughly inspected before dispatch. If your watch arrives damaged or defective, please contact our WhatsApp concierge within 24 hours of delivery.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Delivery Timelines:</h4>
                  <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600">
                    <li><strong>Karachi & Lahore:</strong> 1 - 2 business days</li>
                    <li><strong>Islamabad & Rawalpindi:</strong> 2 - 3 business days</li>
                    <li><strong>Other Cities & Towns:</strong> 2 - 4 business days</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">24-Hour Replacement Policy (No Returns):</h4>
                  <p className="text-sm text-gray-600">
                    Gloria Times operates strictly on a <strong>Replacement-Only policy</strong> (we do NOT offer returns or cash refunds). If your watch arrives damaged or with any manufacturing fault, you must contact our official WhatsApp support at <strong>0325-7982233</strong> within <strong>24 hours</strong> of delivery along with photos/unboxing video of the parcel and watch. Once verified, our team will dispatch a fresh replacement timepiece immediately.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Sticky Bottom Purchase Bar (Exact Match to bottom of media_1788871114450.png) */}
        <div
          className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl transition-transform duration-300 px-4 py-2 ${
            showStickyBar ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-3 sm:gap-6">
            {/* Left: Thumbnail & Title */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-lg bg-[#F7F5F2] border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                <Image
                  src={currentPreview}
                  alt={product.title}
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
                  {product.title}
                </div>
                <div className="text-xs font-bold text-[#E23737] sm:hidden">
                  {formatPkr(product.discountedPrice)}
                </div>
              </div>
            </div>

            {/* Center: Dropdown Selector with dynamic variants */}
            <div className="hidden sm:block">
              <select
                value={selectedColor}
                onChange={(e) => {
                  const found = activeVariants.find((v) => v.name === e.target.value);
                  if (found) {
                    handleSelectVariant(found);
                  } else {
                    setSelectedColor(e.target.value);
                  }
                }}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-gray-800 cursor-pointer outline-none hover:border-gray-400 focus:border-black"
              >
                {activeVariants.map((v) => (
                  <option key={`${v.name}-${v.index}`} value={v.name}>
                    {v.name} - {formatPkr(product.discountedPrice)}
                  </option>
                ))}
              </select>
            </div>

            {/* Right: Stepper & Black Add to Cart Button */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="flex items-center justify-between w-20 sm:w-24 h-9 px-2 bg-gray-100 rounded-md text-xs sm:text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="hover:text-gray-600 px-1"
                >
                  –
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="hover:text-gray-600 px-1"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="h-9 sm:h-10 px-4 sm:px-6 rounded-md bg-black hover:bg-gray-900 text-white font-semibold text-xs sm:text-sm uppercase tracking-wide transition-all shadow-sm"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        {/* Recently Viewed Carousel */}
        <RecentlyViewdItems />
      </div>
    </div>
  );
};

export default ShopDetails;
