"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Star,
  Layers,
  Check,
  X,
} from "lucide-react";

interface AdminMultiImageInputProps {
  urls: string[];
  onChange: (urls: string[]) => void;
  presets?: { label: string; url: string }[];
  title?: string;
}

export default function AdminMultiImageInput({
  urls,
  onChange,
  presets = [],
  title = "Product Pictures (Multiple Cloudinary URLs)",
}: AdminMultiImageInputProps) {
  const [showBulkPaste, setShowBulkPaste] = useState(false);
  const [bulkText, setBulkText] = useState("");

  const validUrls = urls.map((u) => u.trim()).filter((u) => u.length > 0);

  const handleAddUrl = () => {
    onChange([...urls, ""]);
  };

  const handleUpdateUrl = (index: number, val: string) => {
    const copy = [...urls];
    copy[index] = val;
    onChange(copy);
  };

  const handleRemoveUrl = (index: number) => {
    const filtered = urls.filter((_, i) => i !== index);
    onChange(filtered.length > 0 ? filtered : [""]);
  };

  const handleSetAsCover = (index: number) => {
    if (index === 0) return;
    const item = urls[index];
    const remaining = urls.filter((_, i) => i !== index);
    onChange([item, ...remaining]);
  };

  const handleApplyBulk = () => {
    if (!bulkText.trim()) return;
    const splitUrls = bulkText
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (splitUrls.length > 0) {
      const currentValid = urls.filter((u) => u.trim().length > 0);
      onChange([...currentValid, ...splitUrls]);
      setBulkText("");
      setShowBulkPaste(false);
    }
  };

  const handleAddPreset = (presetUrl: string) => {
    if (urls.length === 1 && !urls[0].trim()) {
      onChange([presetUrl]);
    } else if (!urls.includes(presetUrl)) {
      onChange([...urls, presetUrl]);
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

      {/* Visual Thumbnail Gallery Strip (Live Preview of all entered pictures) */}
      {validUrls.length > 0 && (
        <div className="p-2.5 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Live Gallery Preview ({validUrls.length})
            </span>
            <span className="text-[10px] text-gray-400">
              Storefront slider will show all these images
            </span>
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
            {validUrls.map((url, idx) => (
              <div
                key={idx}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 border-2 bg-gray-50 flex items-center justify-center group ${
                  idx === 0
                    ? "border-[#008060] shadow-sm ring-2 ring-[#008060]/20"
                    : "border-gray-200"
                }`}
              >
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

                {/* Badge */}
                <span
                  className={`absolute bottom-0 left-0 right-0 py-0.5 text-center text-[9px] font-extrabold uppercase tracking-tight text-white ${
                    idx === 0 ? "bg-[#008060]" : "bg-black/60"
                  }`}
                >
                  {idx === 0 ? "Cover" : `#${idx + 1}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List of Individual URL Inputs */}
      <div className="space-y-2.5">
        {urls.map((url, index) => {
          const isMain = index === 0;
          const hasVal = url.trim().length > 0;

          return (
            <div
              key={index}
              className={`p-2.5 rounded-lg border transition-all ${
                isMain
                  ? "bg-white border-[#008060]/40 shadow-xs"
                  : "bg-white/80 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {/* Mini Image Preview */}
                <div className="relative w-11 h-11 rounded-md bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                  {hasVal ? (
                    <Image
                      src={url.trim()}
                      alt={`Thumb ${index + 1}`}
                      fill
                      unoptimized
                      sizes="44px"
                      className="object-contain p-0.5"
                      onError={(e) => {
                        (e.target as any).src = "/images/rolex.webp";
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-gray-300" />
                  )}
                </div>

                {/* URL Input */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        isMain ? "text-[#008060]" : "text-gray-500"
                      }`}
                    >
                      {isMain ? (
                        <>
                          <Star className="w-3 h-3 fill-[#008060] text-[#008060]" />
                          <span>Main Cover Picture</span>
                        </>
                      ) : (
                        <span>Gallery Picture #{index + 1}</span>
                      )}
                    </span>

                    {!isMain && hasVal && (
                      <button
                        type="button"
                        onClick={() => handleSetAsCover(index)}
                        className="text-[10px] text-[#008060] hover:underline font-semibold flex items-center gap-0.5"
                      >
                        <Star className="w-2.5 h-2.5" />
                        <span>Make Cover</span>
                      </button>
                    )}
                  </div>

                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleUpdateUrl(index, e.target.value)}
                    placeholder={
                      isMain
                        ? "Paste main Cloudinary URL (e.g. https://res.cloudinary.com/.../watch-front.jpg)"
                        : `Paste Cloudinary URL for gallery angle #${index + 1}`
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
                  />
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
          className="text-xs font-semibold text-[#008060] hover:text-[#006e52] hover:underline flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add another Cloudinary image URL</span>
        </button>

        <span className="text-[10px] text-gray-400">
          Tip: You can add multiple photos (front, dial, clasp, caseback, wrist shot)
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
                onClick={() => handleAddPreset(preset.url)}
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
