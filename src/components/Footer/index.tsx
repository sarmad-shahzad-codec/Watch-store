"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Mail,
  ChevronUp,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubscribed(true);
    toast.success("Welcome to Gloria Times! Use code GLORIA10 for 10% off.");
  };

  return (
    <footer className="w-full bg-white text-[#111111] border-t border-gray-100 pt-16 pb-12">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Top Section: 3 Clean Columns + Pakistan Badge */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-gray-100">
          {/* Column 1: SHOP GLORIA TIMES (Col span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-[12px] font-bold tracking-[0.16em] uppercase text-black mb-6">
              Shop Gloria Times
            </h4>
            <ul className="space-y-3.5 text-xs text-gray-600 font-normal">
              <li>
                <Link href="/shop-without-sidebar" className="hover:text-black transition-colors">
                  SALE
                </Link>
              </li>
              <li>
                <Link href="/shop-without-sidebar" className="hover:text-black transition-colors">
                  New Arrival
                </Link>
              </li>
              <li>
                <Link href="/shop-without-sidebar" className="hover:text-black transition-colors">
                  Men Watches
                </Link>
              </li>
              <li>
                <Link href="/shop-without-sidebar" className="hover:text-black transition-colors">
                  Luxury Brand Watches
                </Link>
              </li>
              <li>
                <Link href="/category/accessories" className="hover:text-black transition-colors">
                  Watch Accessories
                </Link>
              </li>
              <li>
                <Link href="/shop-without-sidebar" className="hover:text-black transition-colors">
                  All Timepieces
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: CUSTOMER CARE (Col span 4) */}
          <div className="lg:col-span-4">
            <h4 className="text-[12px] font-bold tracking-[0.16em] uppercase text-black mb-6">
              Customer Care
            </h4>
            <ul className="space-y-3.5 text-xs text-gray-600 font-normal">
              <li>
                <Link href="/faq" className="hover:text-black transition-colors">
                  FAQS
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-black transition-colors">
                  24-Hour Replacement Policy (No Returns)
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-black transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" className="hover:text-black transition-colors">
                  Terms of Service
                </Link>
              </li>
              {/* Informational Policy Notes - Non Clickable */}
              <li className="pt-2 text-gray-500 cursor-default select-none border-t border-gray-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Shipping Policy (2-4 Days Delivery)</span>
              </li>
              <li className="text-gray-500 cursor-default select-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Modes of Payment (Cash on Delivery)</span>
              </li>
              <li className="text-gray-500 cursor-default select-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>1-Year Machine Warranty Information</span>
              </li>
            </ul>
          </div>

          {/* Column 3: ABOUT US (Col span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-[12px] font-bold tracking-[0.16em] uppercase text-black mb-6">
              About Us
            </h4>
            <ul className="space-y-3.5 text-xs text-gray-600 font-normal">
              <li>
                <Link href="/contact" className="hover:text-black transition-colors">
                  Our Stores
                </Link>
              </li>
              <li className="pt-2 text-gray-500 leading-relaxed">
                <span className="font-semibold text-black block mb-0.5">Lahore Experience Center:</span>
                Near UMT, PIA Road, Johar Town, Lahore, Pakistan
              </li>
              <li className="pt-1 text-gray-500">
                <span className="font-semibold text-black block mb-0.5">Concierge WhatsApp:</span>
                <a
                  href="https://wa.me/923257982233"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  0325-7982233
                </a>
              </li>
              <li className="pt-2 flex items-center flex-wrap gap-2 text-xs">
                <a
                  href="https://www.instagram.com/gloriatimes_/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 hover:bg-black text-gray-800 hover:text-white transition-colors font-medium text-[11px]"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>@gloriatimes_</span>
                </a>
                <a
                  href="https://www.tiktok.com/@gloriatimes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 hover:bg-black text-gray-800 hover:text-white transition-colors font-medium text-[11px]"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.903 2.894 2.895 2.895 0 0 1-2.894-2.894 2.895 2.895 0 0 1 2.894-2.894c.31 0 .607.05.886.138V9.387a6.327 6.327 0 0 0-.886-.062A6.338 6.338 0 0 0 3 15.663a6.338 6.338 0 0 0 6.338 6.337 6.338 6.338 0 0 0 6.338-6.337V8.583a8.175 8.175 0 0 0 4.913 1.636V6.784a4.83 4.83 0 0 1-1-.098z" />
                  </svg>
                  <span>@gloriatimes</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Country Selector Pill (Col span 2) */}
          <div className="lg:col-span-2 flex justify-start lg:justify-end items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-800 shadow-sm hover:border-gray-400 transition-colors cursor-pointer select-none">
              <span className="text-sm">🇵🇰</span>
              <span>Pakistan</span>
              <ChevronUp className="w-3.5 h-3.5 text-gray-500 ml-1" />
            </div>
          </div>
        </div>

        {/* Bottom Section: Newsletter, Social Icons, and Copyright */}
        <div className="pt-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          {/* Newsletter Box */}
          <div className="max-w-md w-full">
            <p className="text-xs text-gray-700 leading-relaxed mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>

            <form onSubmit={handleSubscribe} className="relative w-full max-w-sm">
              <div className="flex items-center border-b border-gray-300 py-2 focus-within:border-black transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-transparent text-xs text-gray-900 placeholder:text-gray-400 outline-none pr-8"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="text-gray-500 hover:text-black transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </form>

            {subscribed && (
              <p className="text-[11px] text-emerald-600 font-semibold mt-2">
                Thank you for subscribing!
              </p>
            )}

            {/* Social Icons Row */}
            <div className="flex items-center gap-4 mt-6 text-gray-700">
              <a
                href="https://www.instagram.com/gloriatimes_/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @gloriatimes_"
                className="hover:text-black transition-colors"
                title="Gloria Times on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@gloriatimes"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok @gloriatimes"
                className="hover:text-black transition-colors"
                title="Gloria Times on TikTok"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.903 2.894 2.895 2.895 0 0 1-2.894-2.894 2.895 2.895 0 0 1 2.894-2.894c.31 0 .607.05.886.138V9.387a6.327 6.327 0 0 0-.886-.062A6.338 6.338 0 0 0 3 15.663a6.338 6.338 0 0 0 6.338 6.337 6.338 6.338 0 0 0 6.338-6.337V8.583a8.175 8.175 0 0 0 4.913 1.636V6.784a4.83 4.83 0 0 1-1-.098z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-black transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-black transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-black transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Centered Copyright */}
          <div className="w-full md:w-auto text-left md:text-center pt-4 md:pt-0">
            <p className="text-xs text-gray-500 font-normal">
              &copy; 2026 Gloria Times PK
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
