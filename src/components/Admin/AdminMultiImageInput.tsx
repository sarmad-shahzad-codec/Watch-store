"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Star,
  Layers,
  Check,
  X,
  Palette,
} from "lucide-react";
import { ProductColorVariant } from "@/types/product";

const COLOR_PRESETS = [
  "Black",
  "Blue",
  "Green",
  "White",
  "Silver",
  "Two-Tone Gold",
  "Tiffany Blue",
  "Gray",
  "Rose Gold",
  "Skeleton Dial",
];

interface AdminMultiImageInputProps {
  urls: string[];
  onChange: (urls: string[]) => void;
  variants?: ProductColorVariant[];
  onVariantsChange?: (variants: ProductColorVariant[]) => void;
  presets?: { label: string; url: string }[];
  title?: string;
}

export default function AdminMultiImageInput({
  urls,
  onChange,
  variants = [],
  onVariantsChange,
  presets = [],
  title = "Product Pictures & Watch Color Variants",
}: AdminMultiImageInputProps) {
  const [showBulkPaste, setShowBulkPaste] = useState(false);
  const [bulkText, setBulkText] = useState("");

  // Internal color names per image index
  const [colorNames, setColorNames] = useState<string[]>(() => {
    return urls.map((u, i) => {
      const match = variants.find((v) => v.image === u);
      if (match?.name) return match.name;
      if (variants[i]?.name) return variants[i].name;
      return COLOR_PRESETS[i % COLOR_PRESETS.length] || `Color ${i + 1}`;
    });
  });

  // Keep colorNames length in sync with urls
  useEffect(() => {
    setColorNames((prev) => {
      return urls.map((u, i) => {
        if (prev[i] !== undefined && prev[i] !== "") return prev[i];
        const match = variants.find((v) => v.image === u);
        if (match?.name) return match.name;
        if (variants[i]?.name) return variants[i].name;
        return COLOR_PRESETS[i % COLOR_PRESETS.length] || `Color ${i + 1}`;
      });
    });
  }, [urls.length, variants]);

  const validUrls = urls.map((u) => u.trim()).filter((u) => u.length > 0);

  // Notify parent of variant changes
  const notifyVariants = (newUrls: string[], newColors: string[]) => {
    if (!onVariantsChange) return;
    const computedVariants: ProductColorVariant[] = newUrls
      .map((u, idx) => ({
        name: (newColors[idx] || "").trim() || COLOR_PRESETS[idx % COLOR_PRESETS.length] || `Color ${idx + 1}`,
        image: u.trim(),
      }))
      .filter((v) => v.image.length > 0);
    onVariantsChange(computedVariants);
  };

  const handleAddUrl = () => {
    const nextUrls = [...urls, ""];
    const nextColors = [
      ...colorNames,
      COLOR_PRESETS[urls.length % COLOR_PRESETS.length] || `Color ${urls.length + 1}`,
    ];
    setColorNames(nextColors);
    onChange(nextUrls);
    notifyVariants(nextUrls, nextColors);
  };

  const handleUpdateUrl = (index: number, val: string) => {
    const copyUrls = [...urls];
    copyUrls[index] = val;
    onChange(copyUrls);
    notifyVariants(copyUrls, colorNames);
  };

  const handleUpdateColor = (index: number, colorVal: string) => {
    const copyColors = [...colorNames];
    copyColors[index] = colorVal;
    setColorNames(copyColors);
    notifyVariants(urls, copyColors);
  };

  const handleRemoveUrl = (index: number) => {
    const filteredUrls = urls.filter((_, i) => i !== index);
    const filteredColors = colorNames.filter((_, i) => i !== index);
    const finalUrls = filteredUrls.length > 0 ? filteredUrls : [""];
    const finalColors = filteredColors.length > 0 ? filteredColors : ["Black"];
    setColorNames(finalColors);
    onChange(finalUrls);
    notifyVariants(finalUrls, finalColors);
  };

  const handleSetAsCover = (index: number) => {
    if (index === 0) return;
    const itemUrl = urls[index];
    const itemColor = colorNames[index];
    const remUrls = urls.filter((_, i) => i !== index);
    const remColors = colorNames.filter((_, i) => i !== index);
    const newUrls = [itemUrl, ...remUrls];
    const newColors = [itemColor, ...remColors];
    setColorNames(newColors);
    onChange(newUrls);
    notifyVariants(newUrls, newColors);
  };

  const handleApplyBulk = () => {
    if (!bulkText.trim()) return;
    const splitUrls = bulkText
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (splitUrls.length > 0) {
      const currentValid = urls.filter((u) => u.trim().length > 0);
      const combinedUrls = [...currentValid, ...splitUrls];
      const combinedColors = combinedUrls.map((_, i) => {
        return colorNames[i] || COLOR_PRESETS[i % COLOR_PRESETS.length] || `Color ${i + 1}`;
      });
      setColorNames(combinedColors);
      onChange(combinedUrls);
      notifyVariants(combinedUrls, combinedColors);
      setBulkText("");
      setShowBulkPaste(false);
    }
  };

  const handleAddPreset = (presetUrl: string, presetLabel?: string) => {
    if (urls.length === 1 && !urls[0].trim()) {
      const newUrls = [presetUrl];
      const newColors = [presetLabel || "Cover"];
      setColorNames(newColors);
      onChange(newUrls);
      notifyVariants(newUrls, newColors);
    } else if (!urls.includes(presetUrl)) {
      const newUrls = [...urls, presetUrl];
      const newColors = [...colorNames, presetLabel || `Color ${newUrls.length}`];
      setColorNames(newColors);
      onChange(newUrls);
      notifyVariants(newUrls, newColors);
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-xl bg-[#FAF8F5] border border-gray-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200/80">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-[#008060]" />
            <span>{title}</span>
            {validUrls.length > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-[#008060]/10 text-[#008060] text-[10px] font-bold">
                {validUrls.length} {validUrls.length === 1 ? "Picture" : "Pictures"} Added
              </span>
            )}
          </label>
          <span className="text-[11px] text-gray-500 block mt-0.5">
            The first picture is the main cover. Add multiple Cloudinary links for gallery &amp; zoom.
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowBulkPaste(!showBulkPaste)}
            className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition flex items-center gap-1 shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-[#008060]" />
            <span>{showBulkPaste ? "Hide Bulk Paste" : "Bulk Paste URLs"}</span>
          </button>

          <button
            type="button"
            onClick={handleAddUrl}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#008060] text-white hover:bg-[#006e52] transition flex items-center gap-1 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Picture URL</span>
          </button>
        </div>
      </div>

      {/* Bulk Paste Box (Optional Expandable) */}
      {showBulkPaste && (
        <div className="p-3 bg-white rounded-lg border border-gray-300 shadow-inner space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-800">
              Paste Multiple Cloudinary URLs (One per line or separated by comma)
            </span>
            <button
              type="button"
              onClick={() => setShowBulkPaste(false)}
              className="text-gray-400 hover:text-black p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            rows={3}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={"https://res.cloudinary.com/.../watch-front.jpg\nhttps://res.cloudinary.com/.../watch-back.jpg\nhttps://res.cloudinary.com/.../watch-wrist.jpg"}
            className="w-full p-2.5 text-xs font-mono rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowBulkPaste(false)}
              className="px-3 py-1 text-xs text-gray-600 hover:text-black"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyBulk}
              disabled={!bulkText.trim()}
              className="px-3 py-1 text-xs font-bold rounded-lg bg-[#008060] text-white hover:bg-[#006e52] disabled:opacity-40 transition"
            >
              Apply All URLs
            </button>
          </div>
        </div>
      )}

      {/* Visual Thumbnail Gallery Strip (Live Preview with Color Names) */}
      {validUrls.length > 0 && (
        <div className="p-2.5 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#008060]" />
              <span>Live Color Swatches Preview ({validUrls.length})</span>
            </span>
            <span className="text-[10px] text-gray-400">
              Customer ko product page par ye color options nazar aayengi
            </span>
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
            {validUrls.map((url, idx) => {
              const cName = colorNames[idx] || (idx === 0 ? "Main" : `Color ${idx + 1}`);
              return (
                <div
                  key={idx}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 bg-gray-50 flex flex-col items-center justify-between group ${
                    idx === 0
                      ? "border-[#008060] shadow-sm ring-2 ring-[#008060]/20"
                      : "border-gray-200"
                  }`}
                >
                  <div className="relative w-full h-13 flex items-center justify-center p-0.5">
                    <Image
                      src={url}
                      alt={`Preview ${idx + 1}`}
                      fill
                      unoptimized
                      sizes="80px"
                      className="object-contain p-1"
                      onError={(e) => {
                        (e.target as any).src = "/images/rolex.webp";
                      }}
                    />
                  </div>

                  {/* Color Label Badge */}
                  <span
                    className={`w-full py-0.5 text-center text-[9px] font-extrabold uppercase tracking-tight text-white truncate px-1 ${
                      idx === 0 ? "bg-[#008060]" : "bg-black/75"
                    }`}
                    title={cName}
                  >
                    {cName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List of Individual Picture & Color Rows */}
      <div className="space-y-3">
        {urls.map((url, index) => {
          const isMain = index === 0;
          const hasVal = url.trim().length > 0;
          const currentColorName = colorNames[index] || "";

          return (
            <div
              key={index}
              className={`p-3 rounded-xl border transition-all ${
                isMain
                  ? "bg-white border-[#008060]/40 shadow-xs"
                  : "bg-white/80 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Mini Image Preview */}
                <div className="relative w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                  {hasVal ? (
                    <Image
                      src={url.trim()}
                      alt={`Thumb ${index + 1}`}
                      fill
                      unoptimized
                      sizes="56px"
                      className="object-contain p-1"
                      onError={(e) => {
                        (e.target as any).src = "/images/rolex.webp";
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-gray-300" />
                  )}
                </div>

                {/* URL and Color Inputs */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        isMain ? "text-[#008060]" : "text-gray-600"
                      }`}
                    >
                      {isMain ? (
                        <>
                          <Star className="w-3 h-3 fill-[#008060] text-[#008060]" />
                          <span>Main Watch Picture &amp; Default Color</span>
                        </>
                      ) : (
                        <span>Watch Color Variant #{index + 1}</span>
                      )}
                    </span>

                    {!isMain && hasVal && (
                      <button
                        type="button"
                        onClick={() => handleSetAsCover(index)}
                        className="text-[10px] text-[#008060] hover:underline font-semibold flex items-center gap-0.5"
                      >
                        <Star className="w-2.5 h-2.5" />
                        <span>Make Default Cover</span>
                      </button>
                    )}
                  </div>

                  {/* 1. Cloudinary URL Input */}
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleUpdateUrl(index, e.target.value)}
                    placeholder={
                      isMain
                        ? "Paste main Cloudinary URL (e.g. https://res.cloudinary.com/.../watch-black.jpg)"
                        : `Paste Cloudinary URL for watch color #${index + 1}`
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
                  />

                  {/* 2. Color / Dial Name Input + Quick Chips */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1 border-t border-gray-100">
                    <div className="flex items-center gap-1 shrink-0">
                      <Palette className="w-3 h-3 text-[#008060]" />
                      <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">
                        Color:
                      </span>
                    </div>

                    <input
                      type="text"
                      value={currentColorName}
                      onChange={(e) => handleUpdateColor(index, e.target.value)}
                      placeholder="e.g. Black, Blue, Emerald Green, White"
                      className="w-full sm:w-48 px-2.5 py-1 text-xs font-semibold rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#008060]"
                    />

                    {/* Quick Preset Color Buttons */}
                    <div className="flex items-center gap-1 flex-wrap overflow-x-auto">
                      {COLOR_PRESETS.slice(0, 7).map((colorName) => {
                        const isActive =
                          currentColorName.toLowerCase() === colorName.toLowerCase();
                        return (
                          <button
                            key={colorName}
                            type="button"
                            onClick={() => handleUpdateColor(index, colorName)}
                            className={`px-2 py-0.5 text-[10px] rounded font-medium transition cursor-pointer ${
                              isActive
                                ? "bg-[#008060] text-white font-bold shadow-2xs"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                            }`}
                          >
                            {colorName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                {urls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveUrl(index)}
                    aria-label="Remove image"
                    className="w-8 h-8 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center shrink-0 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Add Another Button */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={handleAddUrl}
          className="text-xs font-semibold text-[#008060] hover:text-[#006e52] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add another Picture &amp; Watch Color</span>
        </button>

        <span className="text-[10px] text-gray-400">
          Tip: Add different dial colors with their exact names (Black, Blue, Green, etc.)
        </span>
      </div>

      {/* Preset Buttons for Quick Demo / Selection */}
      {presets.length > 0 && (
        <div className="pt-2 border-t border-gray-200/70 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-gray-500 font-medium">Quick Presets:</span>
          {presets.map((preset) => {
            const isSelected = urls.includes(preset.url);
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleAddPreset(preset.url, preset.label)}
                className={`text-[10px] px-2 py-0.5 rounded border transition flex items-center gap-1 ${
                  isSelected
                    ? "bg-[#008060] text-white border-[#008060]"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                }`}
              >
                <span>{preset.label}</span>
                {isSelected && <Check className="w-2.5 h-2.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
