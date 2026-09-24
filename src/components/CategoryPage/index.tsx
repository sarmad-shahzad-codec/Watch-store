"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";
import { useStoreProducts } from "@/hooks/useProducts";
import WhyChooseGloria from "@/components/Common/WhyChooseGloria";
import { ChevronRight, ArrowLeft, ShieldCheck, Truck, PackageCheck } from "lucide-react";

type CategoryPageProps = {
  slug: string;
};

const BRAND_CONFIG: Record<
  string,
  {
    name: string;
    brandKey: string;
    tagline: string;
    description: string;
    isAccessory?: boolean;
    isComingSoon?: boolean;
  }
> = {
  "new-in": {
    name: "New In Collection",
    brandKey: "new-in",
    tagline: "Latest 2026 Releases, Fresh Drops & Masterpiece Arrivals",
    description:
      "Exclusive preview of our upcoming 2026 timepiece drops. The new collection is currently in final staging and arriving soon at Gloria Times Boutique.",
    isComingSoon: true,
  },
  women: {
    name: "Women's Collection",
    brandKey: "women",
    tagline: "Dainty Dials, Diamond Bezels & Timeless Elegance For Her",
    description:
      "We are curating an exclusive selection of luxury women's timepieces—from iconic rectangular silhouettes to diamond-set bezels and satin-brushed bracelets. Launching soon at Gloria Times.",
    isComingSoon: true,
  },
  men: {
    name: "Men's Collection",
    brandKey: "men",
    tagline: "Swiss Automatic, Divers & Classic Dress Timepieces For Him",
    description:
      "Discover our definitive lineup of luxury men's watches—featuring ceramic bezels, automatic movements, chronograph tachymeters, and robust stainless steel bracelets.",
    isComingSoon: false,
  },
  tissot: {
    name: "Tissot",
    brandKey: "Tissot",
    tagline: "Swiss Precision & Integrated Bracelet Heritage",
    description:
      "Explore the complete collection of Tissot PRX and iconic Swiss sport timepieces. Featuring waffle sunburst dials, integrated stainless steel bracelets, and reliable automatic movements.",
  },
  "tag-heuer": {
    name: "TAG Heuer",
    brandKey: "TAG Heuer",
    tagline: "High-Octane Motorsports & Racing Chronographs",
    description:
      "Precision racing chronographs designed for performance. Discover TAG Heuer Carrera and Formula 1 luxury timepieces with tachymeter bezels and heavy steel construction.",
  },
  hublot: {
    name: "Hublot Diamond",
    brandKey: "Hublot Diamond",
    tagline: "Bold Fusion of Modern Art & Heavy Stainless Steel",
    description:
      "Renowned for its avant-garde design and signature H-screws. Discover Hublot Diamond Cut Heavy Watches and automatic timepieces with structured rubber straps.",
  },
  "hublot-diamond": {
    name: "Hublot Diamond",
    brandKey: "Hublot Diamond",
    tagline: "Bold Fusion of Modern Art & Diamond Cut Precision",
    description:
      "Renowned for its avant-garde design and signature H-screws. Discover Hublot Diamond Cut Heavy Watches and automatic timepieces with structured rubber straps.",
  },
  "patek-philippe": {
    name: "Patek Philippe",
    brandKey: "Patek Philippe",
    tagline: "The Zenith of Haute Horlogerie & Timeless Luxury",
    description:
      "Acclaimed worldwide for peerless design. Browse Patek Philippe Nautilus and Grand Complications with horizontally embossed dials and sweeping automatic movements.",
  },
  rolex: {
    name: "Rolex",
    brandKey: "Rolex",
    tagline: "Iconic Crown of Horology & Fluted Bezel Elegance",
    description:
      "The world's most prestigious timepieces. Discover Rolex Submariner Date, Jubilee Chain Datejust, GMT-Master II, and Daytona Geneve leather chronographs.",
  },
  cartier: {
    name: "Cartier",
    brandKey: "Cartier",
    tagline: "Parisian Elegance & Iconic Geometric Watchmaking",
    description:
      "Timeless square silhouettes with rounded corners and exposed bezel screws. Discover Cartier Santos automatic luxury timepieces.",
  },
  accessories: {
    name: "Watch Accessories",
    brandKey: "accessories",
    tagline: "Luxury Watch Presentation Boxes, Straps & Tool Kits",
    description:
      "Exclusive Gloria Times accessories collection including handcrafted luxury display boxes, textured silicone straps, and precision bracelet sizing tool kits.",
    isAccessory: true,
  },
  "watch-boxes": {
    name: "Luxury Watch Presentation Boxes",
    brandKey: "watch-boxes",
    tagline: "Piano-Gloss Hardwood & Plush Velvet Presentation Cases",
    description:
      "Handcrafted wooden single and multi-watch display cases with piano-lacquer finish, plush velvet cushions, and polished brass hardware.",
    isAccessory: true,
  },
  "tool-kits": {
    name: "Link Adjuster Tool Kit",
    brandKey: "tool-kits",
    tagline: "Precision Stainless Steel Bracelet Sizing Tools",
    description:
      "All-metal precision bracelet sizing tool with 3 interchangeable hardened steel push pins. Easily adjust watch links at home in seconds.",
    isAccessory: true,
  },
  straps: {
    name: "Silicone & Leather Straps",
    brandKey: "straps",
    tagline: "Waterproof FKM Curved Silicone & Leather Straps",
    description:
      "Ultra-durable, waterproof curved-end silicone straps and premium Italian leather bands with stainless steel double butterfly deployment clasps.",
    isAccessory: true,
  },
};

const ALL_BRANDS = [
  { slug: "rolex", name: "Rolex" },
  { slug: "tissot", name: "Tissot" },
  { slug: "tag-heuer", name: "TAG Heuer" },
  { slug: "hublot-diamond", name: "Hublot Diamond" },
  { slug: "patek-philippe", name: "Patek Philippe" },
  { slug: "cartier", name: "Cartier" },
];

const ACCESSORY_TABS = [
  { slug: "accessories", name: "All Accessories" },
  { slug: "watch-boxes", name: "Watch Boxes" },
  { slug: "tool-kits", name: "Tool Kits" },
  { slug: "straps", name: "Straps" },
];

export default function CategoryPageComponent({ slug }: CategoryPageProps) {
  const { products } = useStoreProducts();
  const normalizedSlug = slug.toLowerCase();
  const brandInfo = BRAND_CONFIG[normalizedSlug] || {
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    brandKey: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    tagline: "Curated Luxury Timepieces",
    description: `Discover authentic 1:1 luxury timepieces from ${slug.replace(/-/g, " ")}. Cash on Delivery nationwide with express shipping & 24h replacement support across Pakistan.`,
    isAccessory: false,
  };

  const isAccessory = Boolean(
    brandInfo.isAccessory ||
    ["accessories", "watch-boxes", "tool-kits", "straps"].includes(normalizedSlug)
  );

  const isComingSoon = Boolean(
    brandInfo.isComingSoon ||
    ["women", "new-in", "newin", "accessories", "watch-boxes", "tool-kits", "straps"].includes(normalizedSlug)
  );

  // Filter products for category (distinct accessories or men/women/new-in per slug)
  const categoryProducts = useMemo(() => {
    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (normalizedSlug === "women") {
      const womenItems = products.filter((p) => {
        const cat = clean(p.category || "");
        const title = clean(p.title || "");
        return cat.includes("women") || cat.includes("ladies") || title.includes("women");
      });
      return womenItems;
    }

    if (normalizedSlug === "new-in" || normalizedSlug === "newin") {
      const newInItems = products.filter((p) => {
        const cat = clean(p.category || "");
        const title = clean(p.title || "");
        return (
          cat.includes("newin") ||
          cat.includes("newarrival") ||
          cat.includes("newarrivals") ||
          title.includes("new in")
        );
      });
      return newInItems;
    }

    if (normalizedSlug === "men") {
      return products.filter((p) => {
        const cleanBrand = clean(p.brand || "");
        return !cleanBrand.includes("accessories");
      });
    }

    if (normalizedSlug === "accessories") {
      return products.filter((p) => clean(p.brand).includes("accessories"));
    }
    if (normalizedSlug === "watch-boxes") {
      return products.filter(
        (p) =>
          clean(p.brand).includes("accessories") &&
          (clean(p.title).includes("box") || clean(p.title).includes("hardwood"))
      );
    }
    if (normalizedSlug === "tool-kits") {
      return products.filter(
        (p) =>
          clean(p.brand).includes("accessories") &&
          (clean(p.title).includes("tool") || clean(p.title).includes("adjuster"))
      );
    }
    if (normalizedSlug === "straps") {
      return products.filter(
        (p) =>
          clean(p.brand).includes("accessories") &&
          (clean(p.title).includes("strap") || clean(p.title).includes("silicone"))
      );
    }

    const targetKey = clean(brandInfo.brandKey || normalizedSlug);
    return products.filter((p) => {
      const pBrand = clean(p.brand || "");
      const pCat = clean(p.category || "");
      return (
        pBrand === targetKey ||
        pBrand.includes(targetKey) ||
        targetKey.includes(pBrand) ||
        pCat === targetKey ||
        pCat.includes(targetKey) ||
        targetKey.includes(pCat)
      );
    });
  }, [products, brandInfo.brandKey, normalizedSlug]);

  return (
    <div className="bg-white">
      {/* Top Spacing to Clear Fixed Header */}
      <div className="pt-[110px] sm:pt-[125px]">
        
        {/* Breadcrumb Navigation */}
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 border-b border-gray-100">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link href="/shop-without-sidebar" className="hover:text-black transition-colors">
              Collections
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-900 font-semibold">{brandInfo.name}</span>
          </nav>
        </div>

        {/* Brand Header Banner */}
        <section className="bg-[#FAF8F5] py-8 sm:py-12 border-b border-gray-200/80">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-block px-3 py-1 rounded-full bg-black text-white text-[11px] font-bold uppercase tracking-wider">
                  {brandInfo.name} {isAccessory ? "Collection" : "Official Category"}
                </span>
                {isComingSoon && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-900 text-[11px] font-extrabold uppercase tracking-widest animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    COMING SOON
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111] tracking-tight leading-tight">
                {brandInfo.name} {isAccessory || normalizedSlug === "women" || normalizedSlug === "men" ? "" : "Watches"}
              </h1>
              <p className="text-base sm:text-lg font-medium text-gray-700 mt-2">
                {brandInfo.tagline}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                {brandInfo.description}
              </p>

              {/* Coming Soon Staging Banner for Women, New In & Accessories */}
              {isComingSoon && (
                <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-[#0B0F19] border border-[#F2C27B]/30 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[#F2C27B] font-bold text-xs sm:text-sm uppercase tracking-wider">
                      <span>⏳</span>
                      <span>
                        {normalizedSlug === "women"
                          ? "COMING SOON — WOMEN'S LUXURY COLLECTION"
                          : normalizedSlug === "new-in" || normalizedSlug === "newin"
                          ? "COMING SOON — 2026 NEW IN TIMEPIECE DROPS"
                          : "COMING SOON — OFFICIAL ACCESSORY DROP"}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 mt-1 leading-relaxed">
                      {normalizedSlug === "women"
                        ? "Our master-crafted women's timepiece catalog is currently in final staging. Pre-order inquiries and stock reservations are open via WhatsApp."
                        : normalizedSlug === "new-in" || normalizedSlug === "newin"
                        ? "The newest 2026 luxury releases and limited editions are currently in final staging. Pre-order inquiries and early-bird reservations are open via WhatsApp."
                        : "Our master-crafted accessory line is currently in final staging. Pre-order inquiries and stock reservations are open via WhatsApp."}
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/923257982233?text=Assalam%20o%20Alaikum%20Gloria%20Times%2C%20I%20want%20to%20reserve%20an%20item%20from%20${encodeURIComponent(brandInfo.name)}%20(Coming%20Soon)`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#25D366] text-black text-xs font-bold whitespace-nowrap hover:bg-[#20bd5a] transition-colors shrink-0 flex items-center gap-2 shadow-md"
                  >
                    <span>Reserve on WhatsApp</span>
                  </a>
                </div>
              )}
            </div>

            {/* Quick Switcher Between Categories */}
            <div className="mt-6 pt-5 border-t border-gray-200 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider mr-2 whitespace-nowrap">
                {isAccessory ? "Browse Accessories:" : "Browse Brand:"}
              </span>
              {(isAccessory ? ACCESSORY_TABS : ALL_BRANDS).map((b) => {
                const isActive = b.slug === normalizedSlug;
                return (
                  <Link
                    key={b.slug}
                    href={`/category/${b.slug}`}
                    className={`text-xs px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-black text-white shadow-sm font-semibold"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-black hover:text-black"
                    }`}
                  >
                    <span>{b.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Product Grid Section — Strictly Contains ONLY This Category's Items */}
        <section className="py-10 sm:py-14 bg-white">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Results Count Bar */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
              <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <span>
                  Showing <span className="text-[#E23737] font-bold">{categoryProducts.length}</span> {brandInfo.name}
                </span>
                {isAccessory && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold uppercase tracking-wider">
                    Coming Soon
                  </span>
                )}
              </div>

              <div className="hidden sm:flex items-center gap-4 text-xs text-gray-600 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-4 h-4" /> 100% Quality Checked
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-700" /> Express COD Nationwide
                </span>
              </div>
            </div>

            {/* Grid */}
            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {categoryProducts.map((product) => (
                  <ProductItem key={product.id} item={product} />
                ))}
              </div>
            ) : (
              <div className="py-6">
                <div className="text-center py-16 px-6 rounded-2xl bg-[#FAF8F5] border-2 border-dashed border-[#F2C27B]/40 max-w-xl mx-auto shadow-sm">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1C1C1B] text-[#F2C27B] flex items-center justify-center text-3xl shadow-md">
                    ⏳
                  </div>
                  <span className="inline-block px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 font-bold text-xs uppercase tracking-widest mb-3">
                    COMING SOON
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl font-bold text-[#1C1C1B] mb-2"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    {normalizedSlug === "women"
                      ? "Women's Luxury Timepieces — Launching Soon"
                      : normalizedSlug === "new-in" || normalizedSlug === "newin"
                      ? "New In 2026 Drops — Launching Soon"
                      : `${brandInfo.name} Launching Soon`}
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                    {normalizedSlug === "women"
                      ? "Our curated collection of dainty dials, diamond-bezel pieces, and Parisian classics for her is in final staging. Pre-order inquiries and stock reservations are open now."
                      : normalizedSlug === "new-in" || normalizedSlug === "newin"
                      ? "Brand new 2026 master-quality additions and limited release models are being cataloged. Reserve early access via WhatsApp concierge."
                      : "Stock arrives shortly. Contact our concierge on WhatsApp to pre-order or get notified first."}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/923257982233?text=${encodeURIComponent(
                        `Assalam o Alaikum Gloria Times, I want to inquire/reserve an item from ${brandInfo.name} (Coming Soon)`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#25D366] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#20bd5a] transition-colors shadow-sm"
                    >
                      <span>Reserve on WhatsApp</span>
                    </a>
                    {normalizedSlug === "women" ? (
                      <Link
                        href="/category/men"
                        className="inline-flex items-center gap-1.5 px-6 py-3 rounded-lg bg-[#1C1C1B] text-[#EEEBE6] text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                      >
                        <span>Explore Men&apos;s Watches</span>
                      </Link>
                    ) : (
                      <Link
                        href="/shop-without-sidebar"
                        className="inline-flex items-center gap-1.5 px-6 py-3 rounded-lg bg-[#1C1C1B] text-[#EEEBE6] text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                      >
                        <span>View All Watches</span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Sneak peek preview for women and new-in */}
                {(normalizedSlug === "women" || normalizedSlug === "new-in" || normalizedSlug === "newin") && (
                  <div className="mt-14 max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                      <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8A7A5C]">
                        First Look Teaser
                      </span>
                      <h4
                        className="text-xl sm:text-2xl font-semibold text-[#1C1C1B] mt-1"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                      >
                        {normalizedSlug === "women"
                          ? "Upcoming Timepieces in Final Staging"
                          : "Upcoming 2026 Master Quality Arrivals"}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {(normalizedSlug === "women"
                        ? [
                            {
                              title: "Cartier Santos Demoiselle",
                              sub: "Parisian Roman Numerals · Sapphire Crown",
                              img: "/images/2s/cartier-tank-1.jpg",
                            },
                            {
                              title: "Cartier Tank Française Gold Accents",
                              sub: "Curved Ergonomic Case · 2-Tone Steel",
                              img: "/images/2s/cartier-tank-2.jpg",
                            },
                          ]
                        : [
                            {
                              title: "Patek Philippe Grand Complication",
                              sub: "Master Calibre Automatic · Exhibition Back",
                              img: "/images/2s/patek-auto-1.jpg",
                            },
                            {
                              title: "Rolex Cosmograph Daytona Master Edition",
                              sub: "Cerachrom Tachymeter · Tri-Compax Chrono",
                              img: "/images/2s/rolex-daytona-1.jpg",
                            },
                          ]
                      ).map((item, idx) => (
                        <div
                          key={idx}
                          className="group relative overflow-hidden rounded-xl border border-[#D9D4CC] bg-[#FAF8F5] p-5 flex items-center gap-5 shadow-xs hover:shadow-md transition"
                        >
                          <div className="relative w-28 h-28 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.img}
                              alt={item.title}
                              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-amber-500 text-white font-extrabold text-[9px] uppercase tracking-wider">
                              Soon
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-2 py-0.5 rounded">
                              Coming Soon
                            </span>
                            <h5 className="font-semibold text-base text-[#1C1C1B] mt-1.5">
                              {item.title}
                            </h5>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.sub}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </section>

        {/* Comparison Table Section Directly Below Watches */}
        <WhyChooseGloria />

      </div>
    </div>
  );
}
