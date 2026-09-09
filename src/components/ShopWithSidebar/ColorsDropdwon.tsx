"use client";
import React, { useState } from "react";

/** Dial / accent colours typical of luxury watches */
const DIAL_COLORS: { id: string; label: string; hex: string }[] = [
  { id: "dial-silver", label: "Silver", hex: "#C4C4C4" },
  { id: "dial-black", label: "Black", hex: "#1a1a1a" },
  { id: "dial-blue", label: "Blue", hex: "#1e4a6b" },
  { id: "dial-green", label: "Green", hex: "#1d4a2e" },
  { id: "dial-gold", label: "Champagne", hex: "#C9A227" },
];

const ColorsDropdwon = () => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [activeColor, setActiveColor] = useState(DIAL_COLORS[1].id);

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${
          toggleDropdown && "shadow-filter"
        }`}
      >
        <p className="text-dark">Dial colour</p>
        <button
          aria-label="button for dial colour dropdown"
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
        className={`flex-col gap-3 p-6 pt-0 ${toggleDropdown ? "flex" : "hidden"}`}
      >
        <p className="text-[11px] leading-relaxed text-dark-4">
          Sunburst blues, deep blacks, and champagne tones change character in
          different light — pick a dial mood that fits how you dress.
        </p>
        <div className="flex flex-wrap gap-3">
          {DIAL_COLORS.map((c) => (
            <label
              key={c.id}
              htmlFor={c.id}
              className="cursor-pointer select-none flex flex-col items-center gap-1"
              title={c.label}
            >
              <div className="relative">
                <input
                  type="radio"
                  name="dial-color"
                  id={c.id}
                  className="sr-only"
                  checked={activeColor === c.id}
                  onChange={() => setActiveColor(c.id)}
                />
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-full ${
                    activeColor === c.id ? "ring-2 ring-blue ring-offset-2" : ""
                  }`}
                  style={{ borderColor: c.hex }}
                >
                  <span
                    className="block w-4 h-4 rounded-full border border-black/10"
                    style={{ backgroundColor: c.hex }}
                  />
                </div>
              </div>
              <span className="text-[10px] text-dark-4">{c.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorsDropdwon;
