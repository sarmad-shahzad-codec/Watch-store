"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { formatPkr } from "@/lib/formatCurrency";
import {
  CHECKOUT_ORDER_SUMMARY_KEY,
  type CheckoutOrderSummary,
} from "@/lib/checkoutOrderSummary";
import { CheckCircle2, MessageCircle, Truck, Package, ArrowRight } from "lucide-react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") ?? "";

  const [summary, setSummary] = useState<CheckoutOrderSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = sessionStorage.getItem(CHECKOUT_ORDER_SUMMARY_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CheckoutOrderSummary;
          if (!orderNumber || parsed?.orderNumber === orderNumber) {
            setSummary(parsed);
            setLoadingSummary(false);
            return;
          }
        }
      } catch {
        /* ignore json error */
      }
    }
    setLoadingSummary(false);
  }, [orderNumber]);

  const displayedOrderNumber = summary?.orderNumber || orderNumber || "WTC-RECENT";

  const whatsappMessage = summary
    ? encodeURIComponent(
        `Salam Gloria Times! I have placed Order #${summary.orderNumber} via Cash on Delivery.\n\nItems: ${summary.items
          .map((i) => `${i.title} (x${i.quantity})`)
          .join(", ")}\nTotal: ${formatPkr(summary.totalPkr)}\nDelivery To: ${
          summary.shipping.fullName
        }, ${summary.shipping.city}\n\nPlease confirm and dispatch my order.`
      )
    : encodeURIComponent(
        `Salam Gloria Times! I placed Order #${displayedOrderNumber} via Cash on Delivery. Please confirm my order.`
      );

  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5]">
      <div className="max-w-[700px] w-full mx-auto px-4">
        <div className="rounded-2xl bg-white border border-[#EBE6DF] p-6 sm:p-10 shadow-sm">
          {/* Celebratory Icon & Status */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-2">
              Order Placed Successfully
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1009] mb-1">
              Thank you for your order!
            </h1>
            <p className="text-sm text-gray-500">
              آپ کا آرڈر موصول ہو چکا ہے۔ ہم جلد تصدیق کے لیے رابطہ کریں گے۔
            </p>

            {/* Order Number Box */}
            <div className="mt-5 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFD4] inline-block w-full max-w-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Order Tracking ID
              </p>
              <p className="text-2xl font-extrabold text-[#8B5A2B] tracking-wider">
                {displayedOrderNumber}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Cash on Delivery • Free Delivery
              </p>
            </div>
          </div>

          {/* WhatsApp Direct Confirmation Button */}
          <div className="mb-8">
            <a
              href={`https://wa.me/923257982233?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm sm:text-base shadow-[0_4px_16px_rgba(37,211,102,0.35)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Confirm & Track Order on WhatsApp</span>
            </a>
            <p className="text-center text-[11px] text-gray-400 mt-2">
              Click above to send your order details directly to our WhatsApp support team.
            </p>
          </div>

          {/* Delivery Timeline Card */}
          <div className="rounded-xl border border-[#E8DFD4] bg-[#FAF8F5] p-4.5 mb-8 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E8DFD4] flex items-center justify-center text-[#8B5A2B] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm">
              <h4 className="font-bold text-[#1a1009] mb-0.5">
                Estimated Delivery: 2–4 Working Days
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed">
                Your parcel will be safely packaged and dispatched via courier. Please keep the exact cash amount ready for the rider.
              </p>
            </div>
          </div>

          {/* Order Summary Details */}
          {summary && (
            <div className="border border-[#EBE6DF] rounded-xl overflow-hidden mb-8">
              <div className="py-3 px-5 bg-[#FAF8F5] border-b border-[#EBE6DF]">
                <h3 className="font-bold text-sm text-[#1a1009] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#8B5A2B]" />
                  <span>Ordered Items</span>
                </h3>
              </div>

              <div className="divide-y divide-[#F2EFE9] px-5">
                {summary.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center text-xs sm:text-sm">
                    <div>
                      <p className="font-semibold text-[#1a1009]">{item.title}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-[#1a1009]">
                      {formatPkr(item.lineTotalPkr)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-5 bg-[#FAF8F5] border-t border-[#EBE6DF] space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPkr(summary.subtotalPkr)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>
                <div className="flex justify-between font-bold text-base text-[#1a1009] pt-2 border-t border-[#E8DFD4]">
                  <span>Total (Pay on Delivery)</span>
                  <span className="text-[#8B5A2B]">{formatPkr(summary.totalPkr)}</span>
                </div>
              </div>

              {/* Delivery Address Details */}
              <div className="p-5 border-t border-[#EBE6DF] bg-white text-xs">
                <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Shipping Address
                </h4>
                <p className="font-semibold text-[#1a1009]">{summary.shipping.fullName}</p>
                {summary.shipping.phone && (
                  <p className="text-gray-500 mt-0.5">📞 {summary.shipping.phone}</p>
                )}
                <p className="text-gray-500 mt-0.5">
                  📍 {summary.shipping.line1}
                  {summary.shipping.line2 ? `, ${summary.shipping.line2}` : ""}
                  , {summary.shipping.city}
                </p>
                {summary.notes && (
                  <p className="text-gray-400 italic mt-2">
                    Note: "{summary.notes}"
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Back to Shopping Button */}
          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-bold text-sm text-[#1a1009] hover:text-[#8B5A2B] transition-colors"
            >
              <span>Return to Store Home</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Breadcrumb title={"Order Confirmed"} pages={["checkout", "success"]} />
      <Suspense
        fallback={
          <div className="py-20 text-center text-dark">
            Loading confirmation…
          </div>
        }
      >
        <CheckoutSuccessContent />
      </Suspense>
    </>
  );
}
