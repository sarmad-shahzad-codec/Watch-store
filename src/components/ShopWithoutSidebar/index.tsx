"use client";
import React, { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ShopPageHeader from "../Shop/ShopPageHeader";

import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";

import { useStoreProducts } from "@/hooks/useProducts";
import WhyChooseGloria from "../Common/WhyChooseGloria";
import ShopFilterToolbar, { BRAND_OPTIONS } from "../Shop/ShopFilterToolbar";
import {
  filterAndSortProducts,
  type ShopFilters,
  type ShopPriceFilter,
  type ShopSortKey,
} from "../Shop/shopFilterHelpers";

const ShopWithoutSidebarContent = () => {
  const { products } = useStoreProducts();
  const searchParams = useSearchParams();
  const [productStyle, setProductStyle] = useState<"grid" | "list">("grid");

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("all");
  const [category, setCategory] = useState("all");
  const [price, setPrice] = useState<ShopPriceFilter>("all");
  const [sort, setSort] = useState<ShopSortKey>("latest");

  // Sync brand, category & search from URL query params (e.g. ?category=Men%27s%20Automatic%20Watches or ?q=patek)
  useEffect(() => {
    const brandParam = searchParams.get("brand");
    if (brandParam) {
      const matched = BRAND_OPTIONS.find(
        (b) => b.value.toLowerCase() === brandParam.toLowerCase()
      );
      if (matched) {
        setBrand(matched.value);
      }
    }

    const catParam = searchParams.get("category") || searchParams.get("cat");
    if (catParam) {
      setCategory(catParam);
    }

    const qParam = searchParams.get("q") || searchParams.get("search");
    if (qParam !== null) {
      setSearch(qParam);
    }
  }, [searchParams]);

  const filters: ShopFilters = useMemo(
    () => ({ search, brand, category, price, sort }),
    [search, brand, category, price, sort]
  );

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, filters),
    [products, filters]
  );

  const hasActiveFilters =
    search.trim().length > 0 || brand !== "all" || price !== "all" || category !== "all";

  const resetFilters = () => {
    setSearch("");
    setBrand("all");
    setCategory("all");
    setPrice("all");
    setSort("latest");
  };

  return (
    <>
      <ShopPageHeader title="Luxury watches" breadcrumbCurrent="Shop" />
      <section className="overflow-hidden relative pb-20 pt-0 sm:pt-1 bg-[#FAF8F5]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            <div className="w-full">
              <ShopFilterToolbar
                search={search}
                onSearchChange={setSearch}
                brand={brand}
                onBrandChange={setBrand}
                price={price}
                onPriceChange={setPrice}
                sort={sort}
                onSortChange={setSort}
                productStyle={productStyle}
                onProductStyleChange={setProductStyle}
                resultCount={filteredProducts.length}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={resetFilters}
              />

              {/* Active Category Filter Tag */}
              {category !== "all" && (
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-xs text-[#6B5344] font-medium">Filtered by category:</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#1F1209] text-[#F2C27B] shadow-sm">
                    <span>{category}</span>
                    <button
                      type="button"
                      onClick={() => setCategory("all")}
                      className="hover:text-white p-0.5 text-xs font-bold leading-none"
                      title="Clear category filter"
                    >
                      ✕
                    </button>
                  </span>
                </div>
              )}

              {filteredProducts.length === 0 ? (
                <div className="rounded-xl border border-[#EDE4D8] bg-white py-14 px-6 text-center text-dark-3">
                  <p className="font-medium text-[#2B1A0F] mb-2">
                    No watches match your filters.
                  </p>
                  <p className="text-custom-sm mb-6 max-w-md mx-auto">
                    Try clearing search or widening the brand or price range.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex font-medium text-custom-sm text-white bg-[#4A2F19] py-3 px-8 rounded-md hover:bg-[#3A2413] transition-colors"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div
                  className={
                    productStyle === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
                      : "flex flex-col gap-7.5"
                  }
                >
                  {filteredProducts.map((item) =>
                    productStyle === "grid" ? (
                      <SingleGridItem item={item} key={item.id} />
                    ) : (
                      <SingleListItem item={item} key={item.id} />
                    )
                  )}
                </div>
              )}

              <div className="flex justify-center mt-15">
                <div className="bg-white shadow-1 rounded-md p-2 border border-[#EDE4D8]">
                  <ul className="flex items-center">
                    <li>
                      <button
                        aria-label="Previous page"
                        type="button"
                        disabled
                        className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px disabled:text-gray-4"
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.1782 16.1156C12.0095 16.1156 11.8407 16.0594 11.7282 15.9187L5.37197 9.45C5.11885 9.19687 5.11885 8.80312 5.37197 8.55L11.7282 2.08125C11.9813 1.82812 12.3751 1.82812 12.6282 2.08125C12.8813 2.33437 12.8813 2.72812 12.6282 2.98125L6.72197 9L12.6563 15.0187C12.9095 15.2719 12.9095 15.6656 12.6563 15.9187C12.4876 16.0312 12.347 16.1156 12.1782 16.1156Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </li>
                    <li>
                      <span className="flex py-1.5 px-3.5 rounded-[3px] bg-blue text-white cursor-default">
                        1
                      </span>
                    </li>
                    <li>
                      <button
                        aria-label="Next page"
                        type="button"
                        disabled
                        className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] text-dark-4"
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.82197 16.1156C5.65322 16.1156 5.5126 16.0594 5.37197 15.9469C5.11885 15.6937 5.11885 15.3 5.37197 15.0469L11.2782 9L5.37197 2.98125C5.11885 2.72812 5.11885 2.33437 5.37197 2.08125C5.6251 1.82812 6.01885 1.82812 6.27197 2.08125L12.6282 8.55C12.8813 8.80312 12.8813 9.19687 12.6282 9.45L6.27197 15.9187C6.15947 16.0312 5.99072 16.1156 5.82197 16.1156Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison & Trust Section below Watches */}
      <WhyChooseGloria />
    </>
  );
};

const ShopWithoutSidebar = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] pt-28 text-center text-gray-500">
          Loading collection...
        </div>
      }
    >
      <ShopWithoutSidebarContent />
    </Suspense>
  );
};

export default ShopWithoutSidebar;
