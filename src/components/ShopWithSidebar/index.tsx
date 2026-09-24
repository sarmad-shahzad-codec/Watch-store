"use client";
import React, { useState, useEffect, useMemo } from "react";
import ShopPageHeader from "../Shop/ShopPageHeader";
import CategoryDropdown from "./CategoryDropdown";
import GenderDropdown from "./GenderDropdown";
import SizeDropdown from "./SizeDropdown";
import ColorsDropdwon from "./ColorsDropdwon";
import PriceDropdown from "./PriceDropdown";
import { useStoreProducts } from "@/hooks/useProducts";
import WhyChooseGloria from "../Common/WhyChooseGloria";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import ShopFilterToolbar from "../Shop/ShopFilterToolbar";
import {
  filterAndSortProducts,
  getSidebarBrandRows,
  type ShopFilters,
  type ShopPriceFilter,
  type ShopSortKey,
} from "../Shop/shopFilterHelpers";
import ShopSidebarMaisons from "./ShopSidebarMaisons";

const ShopWithSidebar = () => {
  const { products } = useStoreProducts();
  const [productStyle, setProductStyle] = useState<"grid" | "list">("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("all");
  const [price, setPrice] = useState<ShopPriceFilter>("all");
  const [sort, setSort] = useState<ShopSortKey>("latest");

  const filters: ShopFilters = useMemo(
    () => ({ search, brand, price, sort }),
    [search, brand, price, sort]
  );

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, filters),
    [products, filters]
  );

  const sidebarBrandRows = useMemo(
    () => getSidebarBrandRows(products),
    [products]
  );

  const hasActiveFilters =
    search.trim().length > 0 || brand !== "all" || price !== "all";

  const resetFilters = () => {
    setSearch("");
    setBrand("all");
    setPrice("all");
    setSort("latest");
  };

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  const genders = [
    {
      name: "Men's watches",
      products: 5,
    },
    {
      name: "Women's watches",
      products: 2,
    },
    {
      name: "Unisex",
      products: 1,
    },
  ];

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

    // closing sidebar while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    }

    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <>
      <ShopPageHeader title="Luxury watches" breadcrumbCurrent="Shop" />
      <section className="overflow-hidden relative pb-20 pt-0 sm:pt-1 bg-[#FAF8F5]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* <!-- Sidebar Start --> */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
                productSidebar
                  ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
                  : "-translate-x-full"
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-1 ${
                  stickyMenu
                    ? "lg:top-20 sm:top-34.5 top-35"
                    : "lg:top-24 sm:top-39 top-37"
                }`}
              >
                <svg
                  className="fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.0068 3.44714C10.3121 3.72703 10.3328 4.20146 10.0529 4.5068L5.70494 9.25H20C20.4142 9.25 20.75 9.58579 20.75 10C20.75 10.4142 20.4142 10.75 20 10.75H4.00002C3.70259 10.75 3.43327 10.5742 3.3135 10.302C3.19374 10.0298 3.24617 9.71246 3.44715 9.49321L8.94715 3.49321C9.22704 3.18787 9.70147 3.16724 10.0068 3.44714Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.6865 13.698C20.5668 13.4258 20.2974 13.25 20 13.25L4.00001 13.25C3.5858 13.25 3.25001 13.5858 3.25001 14C3.25001 14.4142 3.5858 14.75 4.00001 14.75L18.2951 14.75L13.9472 19.4932C13.6673 19.7985 13.6879 20.273 13.9932 20.5529C14.2986 20.8328 14.773 20.8121 15.0529 20.5068L20.5529 14.5068C20.7539 14.2876 20.8063 13.9703 20.6865 13.698Z"
                    fill=""
                  />
                </svg>
              </button>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  {/* <!-- filter box --> */}
                  <div className="bg-white shadow-1 rounded-lg py-4 px-5">
                    <div className="flex items-center justify-between">
                      <p>Filters:</p>
                      <button
                        type="button"
                        className="text-blue"
                        onClick={resetFilters}
                      >
                        Clean All
                      </button>
                    </div>
                  </div>

                  {/* <!-- brand / maison --> */}
                  <CategoryDropdown
                    brands={sidebarBrandRows}
                    selectedValue={brand}
                    onSelectBrand={setBrand}
                  />

                  {/* <!-- gender box --> */}
                  <GenderDropdown genders={genders} />

                  {/* // <!-- size box --> */}
                  <SizeDropdown />

                  {/* // <!-- color box --> */}
                  <ColorsDropdwon />

                  {/* // <!-- price range box --> */}
                  <PriceDropdown />

                  <ShopSidebarMaisons />
                </div>
              </form>
            </div>
            {/* // <!-- Sidebar End --> */}

            {/* // <!-- Content Start --> */}
            <div className="xl:max-w-[870px] w-full">
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

              {filteredProducts.length === 0 ? (
                <div className="rounded-xl border border-[#EDE4D8] bg-white py-12 px-5 text-center text-dark-3">
                  <p className="font-medium text-[#2B1A0F] mb-2">
                    No watches match your filters.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[13px] font-medium text-[#8B5A2B] hover:underline"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
              <div
                className={`${
                  productStyle === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9"
                    : "flex flex-col gap-7.5"
                }`}
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
              {/* <!-- Products Grid Tab Content End --> */}

              {/* <!-- Products Pagination Start --> */}
              <div className="flex justify-center mt-15">
                <div className="bg-white shadow-1 rounded-md p-2">
                  <ul className="flex items-center">
                    <li>
                      <button
                        id="paginationLeft"
                        aria-label="button for pagination left"
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
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 duration-200 rounded-[3px] bg-blue text-white hover:text-white hover:bg-blue"
                      >
                        1
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 duration-200 rounded-[3px] hover:text-white hover:bg-blue"
                      >
                        2
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 duration-200 rounded-[3px] hover:text-white hover:bg-blue"
                      >
                        3
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 duration-200 rounded-[3px] hover:text-white hover:bg-blue"
                      >
                        4
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 duration-200 rounded-[3px] hover:text-white hover:bg-blue"
                      >
                        5
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 duration-200 rounded-[3px] hover:text-white hover:bg-blue"
                      >
                        ...
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 duration-200 rounded-[3px] hover:text-white hover:bg-blue"
                      >
                        10
                      </a>
                    </li>

                    <li>
                      <button
                        id="paginationLeft"
                        aria-label="button for pagination left"
                        type="button"
                        className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] hover:text-white hover:bg-blue disabled:text-gray-4"
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
              {/* <!-- Products Pagination End --> */}
            </div>
            {/* // <!-- Content End --> */}
          </div>
        </div>
      </section>

      {/* Comparison & Trust Section below Watches */}
      <WhyChooseGloria />
    </>
  );
};

export default ShopWithSidebar;
