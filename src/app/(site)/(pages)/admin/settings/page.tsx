"use client";

import Link from "next/link";
import { Instagram, ArrowRight, Sparkles, MessageSquareQuote } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-[#1F1209]">Settings</h2>
        <p className="mt-1 text-sm text-[#6B5344]">
          Store configuration, integrations, and social media feed settings.
        </p>
      </div>

      {/* Testimonials Management Banner */}
      <div className="rounded-xl border border-[#EDE4D8] bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 via-amber-700 to-[#1F1209] text-[#FDF4E3] shadow-sm shrink-0">
              <MessageSquareQuote className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#1F1209]">
                Customer Reviews &amp; Testimonials
              </h3>
              <p className="text-xs text-[#6B5344] mt-0.5">
                Add real customer watch photos, Cloudinary image links, ratings, and reviews to display on the storefront.
              </p>
            </div>
          </div>
          <Link
            href="/admin/testimonials"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1F1209] hover:bg-black text-[#FDF4E3] text-xs font-semibold shrink-0 transition shadow-sm"
          >
            <span>Manage Reviews</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Instagram Feed Management Banner */}
      <div className="rounded-xl border border-[#EDE4D8] bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-sm shrink-0">
              <Instagram className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#1F1209]">
                Instagram Feed &amp; Recent Posts
              </h3>
              <p className="text-xs text-[#6B5344] mt-0.5">
                Manage your Instagram profile link and the 4–5 recent posts shown above the footer.
              </p>
            </div>
          </div>
          <Link
            href="/admin/instagram"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1F1209] hover:bg-black text-[#FDF4E3] text-xs font-semibold shrink-0 transition shadow-sm"
          >
            <span>Manage Feed</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <form
        className="space-y-6 rounded-xl border border-[#E8DFD4]/90 bg-white p-6 shadow-sm"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label className="block text-sm font-medium text-[#2B1A0F]">
            Store name
          </label>
          <input
            readOnly
            className="mt-1.5 w-full rounded-md border border-[#DDD5CC] bg-[#FAF8F5] px-3 py-2.5 text-sm text-[#4A3728]"
            defaultValue="Gloria Times"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2B1A0F]">
            Default currency
          </label>
          <input
            readOnly
            className="mt-1.5 w-full rounded-md border border-[#DDD5CC] bg-[#FAF8F5] px-3 py-2.5 text-sm text-[#4A3728]"
            defaultValue="PKR — Pakistani Rupee"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2B1A0F]">
            Support email (display)
          </label>
          <input
            type="email"
            readOnly
            className="mt-1.5 w-full rounded-md border border-[#DDD5CC] bg-[#FAF8F5] px-3 py-2.5 text-sm text-[#4A3728]"
            defaultValue="support@gloriatimes.example"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2B1A0F]">
            Order notification webhook
          </label>
          <input
            readOnly
            placeholder="https://..."
            className="mt-1.5 w-full rounded-md border border-[#DDD5CC] bg-[#FAF8F5] px-3 py-2.5 text-sm text-[#8B7355]"
          />
          <p className="mt-1 text-xs text-[#8B7355]">
            Configure when you connect Slack, email, or ERP hooks.
          </p>
        </div>

        <button
          type="submit"
          className="rounded-md bg-[#4A2F19] px-5 py-2.5 text-sm font-medium text-white opacity-60 cursor-not-allowed"
          disabled
        >
          Save (demo — disabled)
        </button>
      </form>
    </div>
  );
}
