"use client";

import { useState } from "react";
import type { SidebarBrandRow } from "../Shop/shopFilterHelpers";

type Props = {
  brands: SidebarBrandRow[];
  selectedValue: string;
  onSelectBrand: (value: string) => void;
};

const CategoryItem = ({
  row,
  selected,
  onSelect,
}: {
  row: SidebarBrandRow;
  selected: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    aria-pressed={selected}
    className={`${
      selected ? "text-blue" : ""
    } group flex w-full items-center justify-between text-left ease-out duration-200 hover:text-blue`}
    onClick={onSelect}
  >
    <div className="flex items-center gap-2">
      <div
        className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded border ${
          selected ? "border-blue bg-blue" : "border-gray-3 bg-white"
        }`}
      >
        <svg
          className={selected ? "block" : "hidden"}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
            stroke="white"
            strokeWidth="1.94437"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <span>{row.name}</span>
    </div>

    <span
      className={`${
        selected ? "bg-blue text-white" : "bg-gray-2"
      } inline-flex rounded-[30px] px-2 text-custom-xs ease-out duration-200 group-hover:bg-blue group-hover:text-white`}
    >
      {row.products}
    </span>
  </button>
);

const CategoryDropdown = ({ brands, selectedValue, onSelectBrand }: Props) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={(e) => {
          e.preventDefault();
          setToggleDropdown(!toggleDropdown);
        }}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${
          toggleDropdown && "shadow-filter"
        }`}
      >
        <p className="text-dark">Brand / maison</p>
        <button
          aria-label="button for category dropdown"
          type="button"
          className={`text-dark ease-out duration-200 ${
            toggleDropdown && "rotate-180"
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
              d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <div
        className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${
          toggleDropdown ? "flex" : "hidden"
        }`}
      >
        <p className="-mt-1 text-[11px] leading-relaxed text-dark-4">
          Filter by maker — from accessible Swiss sport lines like{" "}
          <span className="font-medium text-dark-3">Tissot</span> and racing
          roots at{" "}
          <span className="font-medium text-dark-3">TAG Heuer</span>, to icons
          such as <span className="font-medium text-dark-3">Rolex</span> and{" "}
          <span className="font-medium text-dark-3">Hublot</span>, plus rare
          finishing from{" "}
          <span className="font-medium text-dark-3">Patek Philippe</span>.
        </p>
        {brands.map((row) => (
          <CategoryItem
            key={row.value}
            row={row}
            selected={selectedValue === row.value}
            onSelect={() => onSelectBrand(row.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;
