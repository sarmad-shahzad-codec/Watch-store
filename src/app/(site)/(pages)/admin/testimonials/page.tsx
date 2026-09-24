"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  MessageSquareQuote,
  Plus,
  Trash2,
  Edit3,
  Star,
  CheckCircle,
  Watch,
  X,
  RefreshCw,
  Sparkles,
  ExternalLink,
  UploadCloud,
} from "lucide-react";
import { Testimonial } from "@/types/testimonial";
import {
  fetchTestimonialsFromSupabase,
  createTestimonialInSupabase,
  updateTestimonialInSupabase,
  deleteTestimonialInSupabase,
} from "@/utils/supabase/testimonials";

const CLOUDINARY_WATCH_PRESETS = [
  { name: "Tissot PRX Blue", url: "/images/hero-lineup/tissot.webp" },
  { name: "Rolex Submariner", url: "/images/hero-lineup/rolex-submariner.jpg" },
  { name: "Cartier Santos", url: "/images/hero-lineup/cartier.webp" },
  { name: "Patek Nautilus", url: "/images/hero-lineup/main.webp" },
  { name: "Rolex Datejust Jubilee", url: "/images/hero-lineup/rolex-jubilee.webp" },
  { name: "Rolex Daytona Ceramic", url: "/images/2s/rolex-daytona-1.jpg" },
  { name: "Rolex GMT-Master II", url: "/images/2s/rolex-gmt-1.jpg" },
  { name: "Cartier Tank Steel", url: "/images/2s/cartier-tank-1.jpg" },
];

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("Lahore · Verified Buyer");
  const [formWatchModel, setFormWatchModel] = useState("Tissot PRX 1853 Automatic");
  const [formImgUrl, setFormImgUrl] = useState("/images/hero-lineup/tissot.webp");
  const [formRating, setFormRating] = useState(5);
  const [formReview, setFormReview] = useState("");

  const loadData = async () => {
    setLoading(true);
    const data = await fetchTestimonialsFromSupabase();
    setTestimonials(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormName("");
    setFormRole("Lahore · Verified Buyer");
    setFormWatchModel("");
    setFormImgUrl("/images/hero-lineup/tissot.webp");
    setFormRating(5);
    setFormReview("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Testimonial) => {
    setEditingId(item.id || null);
    setFormName(item.authorName || "");
    setFormRole(item.authorRole || "Verified Buyer");
    setFormWatchModel(item.watchModel || "");
    setFormImgUrl(item.authorImg || "");
    setFormRating(Number(item.rating) || 5);
    setFormReview(item.review || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formReview.trim() || !formImgUrl.trim()) {
      toast.error("Please fill in Customer Name, Review text, and Picture URL");
      return;
    }

    setSubmitting(true);

    if (editingId) {
      // Update existing testimonial
      const res = await updateTestimonialInSupabase(editingId, {
        authorName: formName.trim(),
        authorRole: formRole.trim(),
        watchModel: formWatchModel.trim(),
        authorImg: formImgUrl.trim(),
        rating: Number(formRating),
        review: formReview.trim(),
      });

      if (res.success) {
        toast.success("✓ Testimonial updated successfully!");
        setTestimonials((prev) =>
          prev.map((t) =>
            t.id === editingId
              ? {
                  ...t,
                  authorName: formName.trim(),
                  authorRole: formRole.trim(),
                  watchModel: formWatchModel.trim(),
                  authorImg: formImgUrl.trim(),
                  rating: Number(formRating),
                  review: formReview.trim(),
                }
              : t
          )
        );
        setIsModalOpen(false);
      } else {
        toast.error(res.error || "Failed to update testimonial");
      }
    } else {
      // Create new testimonial
      const res = await createTestimonialInSupabase({
        authorName: formName.trim(),
        authorRole: formRole.trim(),
        watchModel: formWatchModel.trim(),
        authorImg: formImgUrl.trim(),
        rating: Number(formRating),
        review: formReview.trim(),
        displayOrder: testimonials.length + 1,
      });

      if (res.success && res.testimonial) {
        toast.success(`✓ Testimonial from "${res.testimonial.authorName}" added!`);
        setTestimonials([res.testimonial, ...testimonials]);
        setIsModalOpen(false);
      } else {
        toast.error(res.error || "Failed to add testimonial");
      }
    }

    setSubmitting(false);
  };

  const handleDelete = async (id: number | string, name: string) => {
    if (!window.confirm(`Permanently delete testimonial from "${name}"?`)) return;

    const res = await deleteTestimonialInSupabase(id);
    if (res.success) {
      toast.success("Testimonial permanently deleted");
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } else {
      toast.error(res.error || "Failed to delete testimonial");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#EDE4D8] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C9A227]/20 text-[#8B6914] shadow-sm">
              <MessageSquareQuote className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold text-[#1F1209]">
              Customer Testimonials &amp; Photo Reviews
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#6B5344]">
            Manually add real watch customer photo reviews with Cloudinary URLs or watch pictures. Displayed on the storefront.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1F1209] hover:bg-black text-[#FDF4E3] text-xs font-semibold uppercase tracking-wider transition shadow-sm active:scale-95 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Testimonial</span>
        </button>
      </div>

      {/* Cloudinary Info Banner */}
      <div className="rounded-xl border border-[#EDE4D8] bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
              <UploadCloud className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#1F1209]">
                Cloudinary &amp; Image URLs Supported
              </h3>
              <p className="text-xs text-[#6B5344] mt-0.5 leading-relaxed">
                Paste any Cloudinary image link (e.g. <code className="text-[11px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">https://res.cloudinary.com/...</code>) or local watch path. Images are rendered in high resolution with customer verification badges.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-[#8B6914] bg-[#FAF5EE] px-3 py-1.5 rounded-lg border border-[#EDE4D8]">
              {testimonials.length} Active {testimonials.length === 1 ? "Review" : "Reviews"}
            </span>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-2xl bg-white animate-pulse border border-[#EDE4D8]"
            />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DDD5CC] bg-white py-16 px-6 text-center">
          <MessageSquareQuote className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#1F1209] mb-1">
            No Testimonials Added Yet
          </h3>
          <p className="text-xs text-[#6B5344] max-w-sm mx-auto mb-5">
            Add your first customer photo testimonial with a Cloudinary picture URL and review text.
          </p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4A2F19] text-white text-xs font-semibold hover:bg-[#3A2413] transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add First Testimonial</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => {
            const isCloudinary =
              typeof item.authorImg === "string" &&
              (item.authorImg.includes("cloudinary") || item.authorImg.startsWith("http"));

            return (
              <div
                key={item.id}
                className="group relative flex flex-col rounded-2xl border border-[#EDE4D8] bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Watch / Customer Photo Preview */}
                <div className="relative w-full aspect-[4/3] bg-[#FAF8F5] overflow-hidden border-b border-[#EDE4D8]/80">
                  <Image
                    src={item.authorImg || "/images/hero-lineup/tissot.webp"}
                    alt={item.authorName}
                    fill
                    unoptimized={isCloudinary}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain p-2"
                  />

                  {/* Verified Badge */}
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/75 text-white text-[10px] font-semibold tracking-wider uppercase">
                    <CheckCircle className="h-3 w-3 text-[#16A34A]" />
                    <span>Verified</span>
                  </div>

                  {/* Action Buttons Top Right */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="h-7 w-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-700 hover:text-black hover:bg-white shadow transition"
                      title="Edit Testimonial"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id!, item.authorName)}
                      className="h-7 w-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-rose-600 hover:text-rose-700 hover:bg-rose-50 shadow transition"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Rating & Watch Model */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < (item.rating || 5)
                              ? "fill-[#C9A227] text-[#C9A227]"
                              : "fill-gray-200 text-gray-200"
                          }`}
                          strokeWidth={0}
                        />
                      ))}
                    </div>

                    {item.watchModel && (
                      <span className="text-[11px] font-semibold text-[#8B6914] bg-[#C9A227]/10 px-2 py-0.5 rounded truncate max-w-[170px]">
                        {item.watchModel}
                      </span>
                    )}
                  </div>

                  {/* Review Text */}
                  <p className="flex-1 text-xs text-[#4A3728] leading-relaxed italic mb-4 line-clamp-3">
                    &ldquo;{item.review}&rdquo;
                  </p>

                  {/* Author Info */}
                  <div className="border-t border-[#F0E8DC] pt-3 mt-auto flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[#1F1209] text-xs">
                        {item.authorName}
                      </h4>
                      <p className="text-[11px] text-[#6B5344]">
                        {item.authorRole || "Verified Buyer"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="text-[11px] font-semibold text-[#8B6914] hover:underline"
                    >
                      Edit ↗
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {editingId ? "Edit Customer Testimonial" : "Add New Customer Testimonial"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enter customer feedback and picture/Cloudinary image URL.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-black transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Customer Name & City/Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hassan Raza"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B6914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    City / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lahore · Verified Buyer"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B6914]"
                  />
                </div>
              </div>

              {/* Watch Model Purchased & Star Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Watch Model Purchased
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rolex Submariner Date"
                    value={formWatchModel}
                    onChange={(e) => setFormWatchModel(e.target.value)}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B6914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Star Rating (1 to 5)
                  </label>
                  <select
                    value={formRating}
                    onChange={(e) => setFormRating(Number(e.target.value))}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B6914]"
                  >
                    <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                    <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                    <option value={2}>★★☆☆☆ (2 Stars - Average)</option>
                    <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                  </select>
                </div>
              </div>

              {/* Picture URL (Cloudinary or local) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Picture / Cloudinary Image URL <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="https://res.cloudinary.com/... or /images/hero-lineup/tissot.webp"
                    value={formImgUrl}
                    onChange={(e) => setFormImgUrl(e.target.value)}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B6914]"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Tip: Paste your uploaded Cloudinary URL or click any preset below:
                </p>

                {/* Preset quick buttons */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {CLOUDINARY_WATCH_PRESETS.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormImgUrl(p.url)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition ${
                        formImgUrl === p.url
                          ? "bg-[#C9A227]/20 border-[#C9A227] text-[#8B6914] font-bold"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Customer Review &amp; Feedback <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Received the watch within 2 days in Lahore. Quality and packaging was 100% authentic!"
                  value={formReview}
                  onChange={(e) => setFormReview(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B6914]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-[#1F1209] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition active:scale-95 disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingId
                    ? "Update Testimonial"
                    : "Save Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
