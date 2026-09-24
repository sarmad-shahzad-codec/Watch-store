"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  ShoppingBag,
  Heart,
  ChevronDown,
  X,
  Menu,
  ArrowRight,
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { useStoreProducts } from "@/hooks/useProducts";
import GloriaLogo from "@/components/Common/GloriaLogo";

const ANNOUNCEMENTS = [
  {
    text: "Premium Master Quality Luxury Watches",
    highlight: "1:1 Swiss Grade",
    href: "/shop-without-sidebar",
  },
  {
    text: "Fast & Free Nationwide Delivery Across Pakistan",
    highlight: "Express Shipping",
    href: "/shop-without-sidebar",
  },
  {
    text: "Cash On Delivery (COD) Available Nationwide",
    highlight: "Pay at Doorstep",
    href: "/shop-without-sidebar",
  },
  {
    text: "Open Parcel Verification Allowed Before Payment",
    highlight: "100% Safe Purchase",
    href: "/shop-without-sidebar",
  },
  {
    text: "1-Year Movement Warranty & 24h Replacement",
    highlight: "Guaranteed Authenticity",
    href: "/shop-without-sidebar",
  },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { openCartModal } = useCartModalContext();
  const { products } = useStoreProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const wishlistItems = useAppSelector(
    (state) => state.wishlistReducer?.items || []
  );

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [cartItems]);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  // Handle escape & outside clicks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      setIsSearchOpen(false);
      setSearchQuery("");
      router.push(`/shop-without-sidebar?q=${encodeURIComponent(q)}`);
    }
  };

  const handleSelectProduct = (productId: number) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(`/shop-details/${productId}`);
  };

  // Filter products for live prediction
  const filteredProducts = searchQuery.trim()
    ? products
        .filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.category &&
              item.category.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 4)
    : [];

  const navLinks = [
    { name: "Men", href: "/category/men" },
    { name: "Women", href: "/category/women" },
    { name: "Collections", href: "/shop-without-sidebar" },
    { name: "New In", href: "/shop-without-sidebar?sort=newest" },
    { name: "Accessories", href: "/category/accessories" },
  ];

  return (
    <div
      className="fixed left-0 top-0 z-9999 w-full select-none"
      ref={searchContainerRef}
    >
      {/* 1. Top Moving Announcement Bar (Continuous Luxury Ticker) */}
      <div className="relative h-8 sm:h-9 bg-[#1C1C1B] text-[#E9E5DE] overflow-hidden flex items-center border-b border-black/30">
        {/* Left Edge Gradient Fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#1C1C1B] to-transparent z-10" />

        {/* Continuous Animated Marquee Ticker */}
        <div className="animate-announcement-scroll flex items-center">
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="inline-flex items-center gap-2.5 px-6 sm:px-10 text-[11px] sm:text-[12px] font-medium tracking-[0.12em] uppercase text-[#E9E5DE] hover:text-[#C5A880] transition-colors shrink-0 group"
            >
              <span className="text-[#C5A880] text-[10px] group-hover:scale-125 transition-transform">✦</span>
              <span>{item.text}</span>
              <span className="text-[#C5A880] font-semibold text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-white/5 border border-[#C5A880]/30 tracking-wider">
                {item.highlight}
              </span>
            </Link>
          ))}
        </div>

        {/* Right Edge Gradient Fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#1C1C1B] to-transparent z-10" />
      </div>

      {/* 2. Main Luxury Header matching artifact */}
      <header className="h-[60px] lg:h-[76px] w-full bg-[#EEEBE6]/95 backdrop-blur-md border-b border-[#D9D4CC] px-2 sm:px-6 lg:px-10 transition-colors shadow-sm">
        <div className="h-full w-full max-w-[1440px] mx-auto grid grid-cols-3 items-center">
          {/* Left Column */}
          <div className="flex items-center">
            {/* Desktop Navigation */}
            <nav
              aria-label="Main"
              className="hidden lg:flex items-center gap-7 xl:gap-8 text-[14px] font-medium text-[#1C1C1B]"
              style={{ fontFamily: "'Instrument Sans', sans-serif" }}
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`py-3 transition-colors relative group ${
                      isActive
                        ? "text-[#1C1C1B] font-semibold"
                        : "text-[#1C1C1B] hover:text-[#6F6556]"
                    }`}
                  >
                    <span>{link.name}</span>
                    <span
                      className={`absolute bottom-1.5 left-0 h-[1.5px] bg-[#1C1C1B] rounded-full transition-all duration-200 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Mobile: Hamburger & Search */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-11 h-11 flex items-center justify-center text-[#1C1C1B] hover:text-[#6F6556] active:scale-95 transition-transform"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" strokeWidth={1.75} />
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="4" y1="8" x2="20" y2="8"></line>
                    <line x1="4" y1="16" x2="20" y2="16"></line>
                  </svg>
                )}
              </button>

              <button
                type="button"
                aria-label="Search"
                onClick={() => setIsSearchOpen(true)}
                className="w-11 h-11 flex items-center justify-center text-[#1C1C1B] hover:text-[#6F6556] active:scale-95 transition-transform"
              >
                <Search className="w-5 h-5" strokeWidth={1.6} />
              </button>
            </div>
          </div>

          {/* Center Column: Gloria Times Bespoke Logo */}
          <div className="flex justify-center items-center">
            <Link
              href="/"
              aria-label="Gloria Times home"
              className="py-1 flex flex-col items-center group cursor-pointer transition-transform hover:scale-[1.01]"
            >
              <GloriaLogo
                size="md"
                variant="dark"
                accentColor="#8A7A5C"
                className="group-hover:opacity-90 transition-opacity"
              />
            </Link>
          </div>

          {/* Right Column: Actions Icons with Hover Tooltips */}
          <div className="flex justify-end items-center gap-1 sm:gap-2">
            {/* Search Button with Tooltip */}
            <div className="relative group/tip flex flex-col items-center">
              <button
                type="button"
                aria-label="Search"
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex w-10 h-10 items-center justify-center text-[#1C1C1B] hover:text-[#6F6556] rounded-full hover:bg-black/5 transition"
              >
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#1C1C1B] text-[#EEEBE6] text-[10px] font-medium tracking-wider uppercase opacity-0 group-hover/tip:opacity-100 transition-all duration-200 shadow-md whitespace-nowrap z-50">
                Search
              </span>
            </div>

            {/* Wishlist Button with Tooltip */}
            <div className="relative group/tip flex flex-col items-center">
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="relative hidden sm:flex w-10 h-10 items-center justify-center text-[#1C1C1B] hover:text-[#6F6556] rounded-full hover:bg-black/5 transition"
              >
                <Heart className="w-5 h-5" strokeWidth={1.5} />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#1C1C1B] text-[10px] font-bold text-[#EEEBE6]">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#1C1C1B] text-[#EEEBE6] text-[10px] font-medium tracking-wider uppercase opacity-0 group-hover/tip:opacity-100 transition-all duration-200 shadow-md whitespace-nowrap z-50">
                Wishlist
              </span>
            </div>

            {/* Bag / Cart Button with Tooltip */}
            <div className="relative group/tip flex flex-col items-center">
              <button
                type="button"
                aria-label="Shopping Bag"
                onClick={openCartModal}
                className="relative w-10 h-10 flex items-center justify-center text-[#1C1C1B] hover:text-[#6F6556] rounded-full hover:bg-black/5 active:scale-95 transition"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {totalCartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#1C1C1B] text-[10px] font-bold text-[#EEEBE6]">
                    {totalCartCount}
                  </span>
                )}
              </button>
              <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#1C1C1B] text-[#EEEBE6] text-[10px] font-medium tracking-wider uppercase opacity-0 group-hover/tip:opacity-100 transition-all duration-200 shadow-md whitespace-nowrap z-50">
                Bag
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Search Overlay Panel */}
      {isSearchOpen && (
        <div className="absolute left-0 top-full w-full bg-[#EEEBE6] border-b border-[#D9D4CC] shadow-2xl transition-all animate-fadeIn">
          <div className="max-w-3xl mx-auto px-4 py-5">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Rolex, Tissot, Automatic watches, accessories..."
                className="w-full h-12 sm:h-14 pl-12 pr-12 rounded-sm bg-white border border-[#D9D4CC] text-[#1C1C1B] placeholder-[#8E887F] text-sm sm:text-base focus:outline-none focus:border-[#1C1C1B] shadow-inner transition"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E887F]" />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8E887F] hover:text-[#1C1C1B]"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8E887F] hover:text-[#1C1C1B]"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </form>

            {/* Quick search tags or results */}
            {searchQuery.trim() ? (
              <div className="mt-4 bg-white rounded-sm border border-[#D9D4CC] p-3 shadow-sm max-h-[380px] overflow-y-auto">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8E887F] px-2 py-1">
                  Matching Timepieces
                </div>
                {filteredProducts.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredProducts.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectProduct(item.id)}
                        className="flex items-center gap-3.5 p-2 hover:bg-[#F7F4EE] rounded cursor-pointer transition"
                      >
                        <div className="relative h-12 w-12 bg-[#F0EDE8] rounded shrink-0 overflow-hidden">
                          {((item.imgs?.thumbnails && item.imgs.thumbnails[0]) ||
                            (item.imgs?.previews && item.imgs.previews[0]) ||
                            (item.variants && item.variants[0]?.image)) && (
                            <Image
                              src={
                                (item.imgs?.thumbnails && item.imgs.thumbnails[0]) ||
                                (item.imgs?.previews && item.imgs.previews[0]) ||
                                (item.variants && item.variants[0]?.image) ||
                                ""
                              }
                              alt={item.title}
                              fill
                              className="object-contain p-1"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#8E887F] uppercase tracking-wider truncate">
                            {item.brand}
                          </p>
                          <p className="text-sm font-medium text-[#1C1C1B] truncate">
                            {item.title}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-[#1C1C1B] shrink-0">
                          Rs. {item.price?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full mt-2 py-2 text-center text-xs font-semibold text-[#1C1C1B] hover:text-[#6F6556] flex items-center justify-center gap-1.5"
                    >
                      <span>View all results for &quot;{searchQuery}&quot;</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 py-3 text-center">
                    No timepieces found for &quot;{searchQuery}&quot;. Press enter to search catalog.
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-[#5E5A54]">
                <span className="text-[#8E887F] font-medium">Popular:</span>
                {["Rolex", "Tissot PRX", "Cartier", "Hublot", "Automatic", "Accessories"].map(
                  (tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSearchQuery(tag);
                        router.push(`/shop-without-sidebar?q=${encodeURIComponent(tag)}`);
                        setIsSearchOpen(false);
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-[#FAF8F5] border border-[#D9D4CC] rounded-full text-[#1C1C1B] transition"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[92px] sm:top-[96px] z-50 bg-black/40 backdrop-blur-sm lg:hidden animate-fadeIn">
          <div className="bg-[#EEEBE6] w-full max-w-[340px] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-r border-[#D9D4CC]">
            <div className="space-y-6">
              <nav className="flex flex-col divide-y divide-[#D9D4CC]">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3.5 text-base font-medium text-[#1C1C1B] hover:text-[#6F6556] flex items-center justify-between"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-4 h-4 text-[#8E887F]" />
                  </Link>
                ))}
                <Link
                  href="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3.5 text-base font-medium text-[#1C1C1B] hover:text-[#6F6556] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4" />
                    <span>Wishlist</span>
                  </span>
                  {wishlistItems.length > 0 && (
                    <span className="h-5 px-2 rounded-full bg-[#1C1C1B] text-white text-xs font-bold flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-[#D9D4CC]">
              <p className="text-xs text-[#8E887F] text-center">
                Gloria Times · Fine Watches of Distinction
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
