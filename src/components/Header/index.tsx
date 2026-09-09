"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Search, ShoppingBag, Heart, ChevronDown, X, Menu } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { formatPkr } from "@/lib/formatCurrency";
import shopData from "@/components/Shop/shopData";
import { useStoreProducts } from "@/hooks/useProducts";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { openCartModal } = useCartModalContext();
  const { products } = useStoreProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const product = useAppSelector((state) => state.cartReducer.items);
  const wishlistItems = useAppSelector((state) => state.wishlistReducer?.items || []);
  const totalPrice = useSelector(selectTotalPrice);

  const formattedTotal =
    totalPrice > 0 ? formatPkr(totalPrice) : formatPkr(0);

  const isAccessoryRoute = Boolean(
    pathname?.startsWith("/category/accessories") ||
    pathname?.startsWith("/category/watch-boxes") ||
    pathname?.startsWith("/category/tool-kits") ||
    pathname?.startsWith("/category/straps")
  );

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  // Close search & mobile menu on Escape key or click outside
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

  // Close mobile menu on route change
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

  const handleSelectCategory = (categoryName: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(`/shop-without-sidebar?category=${encodeURIComponent(categoryName)}`);
  };

  // Filter products for live prediction
  const filteredProducts = searchQuery.trim()
    ? products
        .filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 4)
    : [];

  // Distinct categories extracted dynamically from products
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim());
      }
    });
    if (set.size === 0) {
      return [
        "Men's Automatic Watches",
        "Chronograph Sport",
        "Diamond Bezel Luxury",
        "Diver Luxury Watches",
        "Classic Dress Watches",
        "Prestige Haute Horlogerie",
      ];
    }
    return Array.from(set);
  }, [products]);

  const accessoryLinks = [
    { name: "All Accessories", href: "/category/accessories", slug: "accessories" },
    { name: "Luxury Watch Presentation Boxes", href: "/category/watch-boxes", slug: "watch-boxes" },
    { name: "Link Adjuster Tool Kit", href: "/category/tool-kits", slug: "tool-kits" },
    { name: "Silicone & Leather Straps", href: "/category/straps", slug: "straps" },
  ];

  return (
    <div className="fixed left-0 top-0 z-9999 w-full shadow-md" ref={searchContainerRef}>
      {/* Continuous Moving Luxury Announcement Top Bar */}
      <div
        role="region"
        aria-label="Store announcement"
        className="relative overflow-hidden bg-[#0A0D14] border-b border-white/10 py-2 sm:py-2.5 select-none"
      >
        {/* Subtle Edge Vignettes */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#0A0D14] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#0A0D14] to-transparent z-10" />

        <div className="animate-announcement-scroll flex items-center gap-6 sm:gap-10 whitespace-nowrap text-[11px] sm:text-xs tracking-wide">
          {[
            {
              icon: "🎁",
              highlight: "SPECIAL OFFER:",
              text: "Buy Any 2 Watches & Get A Free Watch Adjuster Tool",
            },
            {
              icon: "⚡",
              highlight: "EXPRESS DELIVERY:",
              text: "Nationwide Doorstep Delivery in 2 - 4 Days",
            },
            {
              icon: "🛡️",
              highlight: "GUARANTEE:",
              text: "Strict 24-Hour Replacement Warranty (No Returns)",
            },
            {
              icon: "💎",
              highlight: "MASTER QUALITY:",
              text: "1:1 Precision Finish · Hard-Shell Luxury Box Included",
            },
            {
              icon: "💵",
              highlight: "CASH ON DELIVERY:",
              text: "Available Across Pakistan (Rs. 250 Advance Delivery)",
            },
            {
              icon: "🎁",
              highlight: "SPECIAL OFFER:",
              text: "Buy Any 2 Watches & Get A Free Watch Adjuster Tool",
            },
            {
              icon: "⚡",
              highlight: "EXPRESS DELIVERY:",
              text: "Nationwide Doorstep Delivery in 2 - 4 Days",
            },
            {
              icon: "🛡️",
              highlight: "GUARANTEE:",
              text: "Strict 24-Hour Replacement Warranty (No Returns)",
            },
            {
              icon: "💎",
              highlight: "MASTER QUALITY:",
              text: "1:1 Precision Finish · Hard-Shell Luxury Box Included",
            },
            {
              icon: "💵",
              highlight: "CASH ON DELIVERY:",
              text: "Available Across Pakistan (Rs. 250 Advance Delivery)",
            },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-gray-200">
              <span className="text-sm shrink-0">{item.icon}</span>
              <span className="text-[#F2C27B] font-bold text-[10px] sm:text-[11px] tracking-wider uppercase shrink-0">
                {item.highlight}
              </span>
              <span className="text-gray-300 font-medium shrink-0">
                {item.text}
              </span>
              <span className="text-[#F2C27B]/40 ml-4 sm:ml-8 shrink-0">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Single-Row Luxury Black Header Bar matching media_1788942625712.png */}
      <header className="w-full bg-[#050505] text-white border-b border-white/10 backdrop-blur-xl transition-all duration-300 relative shadow-2xl">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          {!isSearchOpen ? (
            <div className="flex items-center justify-between h-16 sm:h-[68px] gap-4">
              {/* Left: Brand Logo & Title */}
              <Link
                href="/"
                className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
              >
                <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/10 p-0.5 flex items-center justify-center border border-white/20">
                  <Image
                    src="/images/logo.png"
                    alt="Gloria Times"
                    width={38}
                    height={38}
                    className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#C5A880] leading-none mb-0.5">
                    The Watch
                  </span>
                  <span className="text-base sm:text-lg font-bold tracking-[0.2em] uppercase text-white group-hover:text-[#F2C27B] transition-colors duration-200">
                    Gloria Times
                  </span>
                </div>
              </Link>

              {/* Center: Desktop Navigation Links */}
              <nav
                className="hidden lg:flex items-center gap-7 xl:gap-9 text-[12px] xl:text-[13px] tracking-[0.14em] uppercase font-medium"
                aria-label="Primary"
              >
                {/* 1. Home */}
                <Link
                  href="/"
                  className={`relative py-1.5 transition-colors duration-200 group ${
                    pathname === "/" ? "text-[#F2C27B] font-bold" : "text-gray-300 hover:text-white"
                  }`}
                >
                  <span>Home</span>
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#F2C27B] rounded-full transition-all duration-200 ${
                      pathname === "/" ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>

                {/* 2. All Products */}
                <Link
                  href="/shop-without-sidebar"
                  className={`relative py-1.5 transition-colors duration-200 group ${
                    pathname === "/shop-without-sidebar"
                      ? "text-[#F2C27B] font-bold"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <span>All Products</span>
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#F2C27B] rounded-full transition-all duration-200 ${
                      pathname === "/shop-without-sidebar"
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>

                {/* 3. Accessories Dropdown */}
                <div
                  className="relative group"
                  onMouseEnter={() => setIsAccessoriesOpen(true)}
                  onMouseLeave={() => setIsAccessoriesOpen(false)}
                >
                  <div
                    className={`relative py-1.5 flex items-center gap-1 cursor-pointer transition-colors duration-200 ${
                      isAccessoryRoute
                        ? "text-[#F2C27B] font-bold"
                        : "text-gray-300 hover:text-white"
                    }`}
                    onClick={() => setIsAccessoriesOpen(!isAccessoriesOpen)}
                  >
                    <Link href="/category/accessories" className="uppercase">
                      Accessories
                    </Link>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        isAccessoriesOpen ? "rotate-180" : ""
                      }`}
                    />
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-[#F2C27B] rounded-full transition-all duration-200 ${
                        isAccessoryRoute
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </div>

                  {/* Dropdown Card */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 w-max min-w-[280px] transition-all duration-200 ${
                      isAccessoriesOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-1 pointer-events-none"
                    }`}
                  >
                    <div className="bg-[#0D111A] rounded-xl shadow-2xl border border-white/15 py-2.5 backdrop-blur-xl">
                      {accessoryLinks.map((acc) => {
                        const isActive = pathname === acc.href;
                        return (
                          <Link
                            key={acc.name}
                            href={acc.href}
                            className={`block px-5 py-2.5 text-xs tracking-wider uppercase whitespace-nowrap transition-colors font-medium ${
                              isActive
                                ? "bg-white/15 text-[#F2C27B] font-bold"
                                : "text-gray-300 hover:bg-white/10 hover:text-white"
                            }`}
                            onClick={() => setIsAccessoriesOpen(false)}
                          >
                            {acc.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 4. Categories Dropdown */}
                <div
                  className="relative group"
                  onMouseEnter={() => setIsCategoryOpen(true)}
                  onMouseLeave={() => setIsCategoryOpen(false)}
                >
                  <div
                    className={`relative py-1.5 flex items-center gap-1 cursor-pointer transition-colors duration-200 ${
                      isCategoryOpen
                        ? "text-[#F2C27B] font-bold"
                        : "text-gray-300 hover:text-white"
                    }`}
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  >
                    <Link href="/shop-without-sidebar" className="uppercase">
                      Categories
                    </Link>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        isCategoryOpen ? "rotate-180" : ""
                      }`}
                    />
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-[#F2C27B] rounded-full transition-all duration-200 ${
                        isCategoryOpen
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </div>

                  {/* Categories Dropdown Card */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 w-max min-w-[240px] max-w-[320px] transition-all duration-200 ${
                      isCategoryOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-1 pointer-events-none"
                    }`}
                  >
                    <div className="bg-[#0D111A] rounded-xl shadow-2xl border border-white/15 py-2.5 backdrop-blur-xl">
                      {availableCategories.map((cat) => (
                        <Link
                          key={cat}
                          href={`/shop-without-sidebar?category=${encodeURIComponent(cat)}`}
                          className="block px-4 py-2.5 text-xs tracking-wider uppercase text-gray-300 hover:bg-white/10 hover:text-[#F2C27B] transition-colors font-medium truncate"
                          onClick={() => setIsCategoryOpen(false)}
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. Contact Us */}
                <Link
                  href="/contact"
                  className={`relative py-1.5 transition-colors duration-200 group ${
                    pathname === "/contact"
                      ? "text-[#F2C27B] font-bold"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <span>Contact Us</span>
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#F2C27B] rounded-full transition-all duration-200 ${
                      pathname === "/contact"
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </nav>

              {/* Right: Actions (Search, Wishlist, Cart) - Icons Only, Text on Hover (matching media_1788943701982.png) */}
              {/* Right: Actions (Search, Wishlist, Cart) - Icons Only, Pure CSS Tooltips */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                {/* Search Button with Pure CSS Tooltip */}
                <div className="relative group/search flex items-center">
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Search watches"
                  >
                    <Search className="h-5 w-5" strokeWidth={1.8} />
                  </button>
                  <div className="absolute right-0 top-full mt-1.5 z-50 pointer-events-none opacity-0 invisible -translate-y-1 group-hover/search:opacity-100 group-hover/search:visible group-hover/search:translate-y-0 transition-all duration-150 whitespace-nowrap">
                    <div className="bg-[#0D111A]/95 border border-white/20 text-[#F2C27B] text-[11px] font-medium tracking-wide py-1 px-2.5 rounded shadow-xl backdrop-blur-md">
                      Search watches
                    </div>
                  </div>
                </div>

                {/* Wishlist Button with Badge & Pure CSS Tooltip */}
                <div className="relative group/wishlist flex items-center">
                  <Link
                    href="/wishlist"
                    aria-label={`Wishlist, ${wishlistItems.length} items`}
                    className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Heart className="h-5 w-5" strokeWidth={1.8} />
                    {wishlistItems.length > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#E53E3E] px-1 text-[9px] font-bold text-white shadow-sm">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Link>
                  <div className="absolute right-0 top-full mt-1.5 z-50 pointer-events-none opacity-0 invisible -translate-y-1 group-hover/wishlist:opacity-100 group-hover/wishlist:visible group-hover/wishlist:translate-y-0 transition-all duration-150 whitespace-nowrap">
                    <div className="bg-[#0D111A]/95 border border-white/20 text-white text-[11px] font-medium tracking-wide py-1 px-2.5 rounded shadow-xl backdrop-blur-md">
                      Wishlist {wishlistItems.length > 0 ? `(${wishlistItems.length})` : ""}
                    </div>
                  </div>
                </div>

                {/* Shopping Bag Button with Badge & Pure CSS Tooltip */}
                <div className="relative group/cart flex items-center">
                  <button
                    type="button"
                    onClick={() => openCartModal()}
                    className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label={`Shopping cart, ${product.length} items`}
                  >
                    <ShoppingBag className="h-5 w-5" strokeWidth={1.8} />
                    {product.length > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#E53E3E] px-1 text-[9px] font-bold text-white shadow-sm">
                        {product.length}
                      </span>
                    )}
                  </button>
                  <div className="absolute right-0 top-full mt-1.5 z-50 pointer-events-none opacity-0 invisible -translate-y-1 group-hover/cart:opacity-100 group-hover/cart:visible group-hover/cart:translate-y-0 transition-all duration-150 whitespace-nowrap">
                    <div className="bg-[#0D111A]/95 border border-white/20 text-white text-[11px] font-medium tracking-wide py-1 px-2.5 rounded shadow-xl backdrop-blur-md">
                      Cart {product.length > 0 ? `(${product.length}) • ${formattedTotal}` : "(Empty)"}
                    </div>
                  </div>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors ml-0.5"
                  aria-label="Toggle navigation menu"
                >
                  <Menu className="h-5 w-5" strokeWidth={1.8} />
                </button>
              </div>
            </div>
          ) : (
            /* When Search is Opened: Luxury Inline Search Header */
            <div className="flex items-center justify-between h-16 sm:h-[68px] gap-3 sm:gap-6">
              {/* Left: Brand Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 group shrink-0"
                onClick={() => setIsSearchOpen(false)}
              >
                <span className="text-base sm:text-lg font-bold tracking-[0.18em] uppercase text-white">
                  Gloria Times
                </span>
              </Link>

              {/* Center: Luxury Search Input */}
              <div className="flex-1 max-w-[650px] mx-2 sm:mx-6 relative">
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search watches, brands, models..."
                    className="w-full h-10 sm:h-11 pl-4 pr-11 text-sm bg-white/10 text-white placeholder:text-gray-400 rounded-lg border border-white/20 focus:outline-none focus:ring-1 focus:ring-[#F2C27B] focus:border-[#F2C27B] transition-all shadow-inner backdrop-blur-md"
                  />
                  <button
                    type="submit"
                    aria-label="Submit search"
                    className="absolute right-0 top-0 h-10 sm:h-11 w-11 flex items-center justify-center text-gray-400 hover:text-[#F2C27B] transition-colors"
                  >
                    <Search className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
                  </button>
                </form>

                {/* Predictive Search Dropdown Card */}
                <div className="absolute left-0 top-full mt-2 w-full bg-[#0D111A] text-white rounded-xl shadow-2xl border border-white/15 z-50 overflow-hidden backdrop-blur-xl">
                  {searchQuery.trim() === "" ? (
                    <div className="p-4 text-left">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400 mb-2.5">
                        Popular Categories
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {availableCategories.slice(0, 8).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleSelectCategory(cat)}
                            className="text-xs font-medium px-3 py-1.5 bg-white/10 hover:bg-[#F2C27B] hover:text-black text-gray-200 rounded-full transition-colors"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : filteredProducts.length > 0 ? (
                    <div className="p-3 text-left">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 px-2 mb-2">
                        Watches ({filteredProducts.length})
                      </p>
                      <div className="divide-y divide-white/10">
                        {filteredProducts.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => handleSelectProduct(p.id)}
                            className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                          >
                            <div className="relative h-12 w-12 rounded-lg border border-white/10 overflow-hidden bg-white/5 shrink-0">
                              <Image
                                src={p.imgs?.thumbnails[0] || "/images/logo.png"}
                                alt={p.title}
                                fill
                                className="object-contain p-1"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="block text-[10px] uppercase tracking-wider text-[#F2C27B] font-semibold">
                                {p.brand}
                              </span>
                              <p className="text-xs font-semibold text-white truncate">
                                {p.title}
                              </p>
                              <p className="text-xs font-bold text-emerald-400 mt-0.5">
                                {formatPkr(p.discountedPrice || p.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/10 text-center">
                        <button
                          type="button"
                          onClick={handleSearchSubmit}
                          className="text-xs font-semibold text-[#F2C27B] hover:underline py-1"
                        >
                          View all results for &quot;{searchQuery}&quot; →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-400 text-xs">
                      No watches found matching &quot;{searchQuery}&quot;.
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Close Search Button */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center justify-center w-10 h-10 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-99999 bg-black/70 backdrop-blur-sm">
          <div className="w-[85%] max-w-[320px] h-full bg-[#0B0F19] text-white p-6 flex flex-col justify-between shadow-2xl border-r border-white/10">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
                <span className="text-sm font-bold tracking-[0.2em] uppercase text-white">
                  GLORIA TIMES
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded text-gray-400 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex flex-col gap-4 text-sm font-medium uppercase tracking-wider">
                <Link
                  href="/"
                  className={`py-1.5 transition-colors ${
                    pathname === "/" ? "text-[#F2C27B] font-bold" : "text-gray-300"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/shop-without-sidebar"
                  className={`py-1.5 transition-colors ${
                    pathname === "/shop-without-sidebar" ? "text-[#F2C27B] font-bold" : "text-gray-300"
                  }`}
                >
                  All Products
                </Link>
                <Link
                  href="/category/accessories"
                  className={`py-1.5 transition-colors ${
                    isAccessoryRoute ? "text-[#F2C27B] font-bold" : "text-gray-300"
                  }`}
                >
                  Accessories
                </Link>
                <div className="pl-3 flex flex-col gap-2.5 border-l border-white/10 my-1">
                  {accessoryLinks.map((acc) => (
                    <Link
                      key={acc.name}
                      href={acc.href}
                      className="text-xs text-gray-400 hover:text-white capitalize"
                    >
                      {acc.name}
                    </Link>
                  ))}
                </div>
                <div className="pt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Categories
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {availableCategories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/shop-without-sidebar?category=${encodeURIComponent(cat)}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xs text-gray-300 hover:text-[#F2C27B] py-1 transition-colors truncate"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/contact"
                  className={`py-1.5 transition-colors ${
                    pathname === "/contact" ? "text-[#F2C27B] font-bold" : "text-gray-300"
                  }`}
                >
                  Contact Us
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-white/10 text-xs text-gray-400">
              <p className="font-semibold text-white mb-1">Gloria Times Boutique</p>
              <p>Near UMT, PIA Road, Johar Town, Lahore</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;

