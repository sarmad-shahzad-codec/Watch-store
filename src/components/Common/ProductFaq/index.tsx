"use client";

import React, { useState } from "react";
import { ChevronUp, ChevronDown, HelpCircle, MessageCircle } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

export const defaultProductFaqs: FaqItem[] = [
  {
    question: "1. Are your products premium quality?",
    answer:
      "Yes, every timepiece at Gloria Times is carefully selected for premium quality, durability, and a stylish look. We use scratch-resistant mineral/sapphire crystals, high-grade stainless steel casings, and precision quartz and automatic movements to deliver luxury horology at honest prices.",
  },
  {
    question: "2. How is your packing?",
    answer:
      "Every watch comes securely packed in a premium luxury hard-shell box with plush velvet cushion padding, protective plastic seal wrapping, and an official Gloria Times warranty card. On eligible bundles, we also provide a complimentary link-adjustment tool to ensure your watch arrives ready to wear in flawless condition.",
  },
  {
    question: "3. How long does delivery take?",
    answer:
      "All orders are processed and verified within 24 hours. Express courier delivery takes 2 to 4 business days across all major cities of Pakistan (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, etc.) and 3 to 5 business days for regional and remote areas.",
  },
  {
    question: "4. Do you offer Cash on Delivery (COD)?",
    answer:
      "Yes! We offer nationwide Cash on Delivery (COD) all over Pakistan. You only pay when the rider arrives at your doorstep with your parcel.",
  },
  {
    question: "5. Are the watches water-resistant?",
    answer:
      "Yes, our timepieces feature daily water resistance (3ATM / 30M), protecting against light splashes, rain, and hand washing. We advise avoiding hot baths or deep swimming to preserve internal gaskets.",
  },
  {
    question: "6. What is your replacement policy?",
    answer:
      "Gloria Times operates strictly on a Replacement-Only policy (we do NOT offer returns or refunds). If your watch arrives damaged or with any defect, you must contact our WhatsApp support at 0325-7982233 within 24 hours of delivery. Once verified, our team will dispatch a fresh replacement immediately.",
  },
];

interface ProductFaqProps {
  title?: string;
  subtitle?: string;
  faqs?: FaqItem[];
  className?: string;
}

const ProductFaq: React.FC<ProductFaqProps> = ({
  title = "FAQ's",
  subtitle = "Everything you need to know about our luxury timepieces & ordering process",
  faqs = defaultProductFaqs,
  className = "",
}) => {
  // Start with the first FAQ open by default (matching 2S Store reference)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`w-full bg-[#050505] text-white py-16 sm:py-20 px-4 sm:px-8 overflow-hidden ${className}`}>
      <div className="max-w-[860px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-400 font-medium max-w-lg mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* FAQ Accordion List (Exact 2S Store Styling) */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-[#0f0f0f] border border-white/30 shadow-lg shadow-black/40"
                    : "bg-[#0a0a0a] border border-white/10 hover:border-white/20"
                }`}
              >
                {/* Question Trigger */}
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4.5 sm:px-7 sm:py-5 text-left transition duration-150 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                    {faq.question}
                  </span>
                  <span className="flex-shrink-0 text-gray-400 transition-transform duration-200">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-white" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </span>
                </button>

                {/* Answer Content */}
                {isOpen && (
                  <div className="px-6 pb-5 sm:px-7 sm:pb-6 pt-1 border-t border-white/5 animate-fadeIn">
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need Help WhatsApp Callout */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center flex flex-col sm:flex-row items-center justify-center gap-3 text-xs sm:text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#C9A227]" />
            <span>Have a specific question about a watch model?</span>
          </div>
          <a
            href="https://wa.me/923257982233?text=Assalam%20o%20Alaikum%20Gloria%20Times%2C%20I%20have%20a%20question%20about%20your%20products"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-[#25D366] hover:underline"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            Chat with Concierge on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductFaq;
