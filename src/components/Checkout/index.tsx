"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatPkr } from "@/lib/formatCurrency";
import { useAppSelector, type AppDispatch } from "@/redux/store";
import {
  removeAllItemsFromCart,
  selectTotalPrice,
} from "@/redux/features/cart-slice";
import { useDispatch } from "react-redux";
import { CHECKOUT_ORDER_SUMMARY_KEY } from "@/lib/checkoutOrderSummary";
import { PAKISTAN_CITIES } from "@/data/pakistanCities";
import {
  Truck,
  ShieldCheck,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Tag,
  CreditCard,
  Building2,
  Phone,
  PackageCheck,
  ChevronRight,
} from "lucide-react";

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useAppSelector((s) => s.cartReducer.items);
  const subtotal = useAppSelector(selectTotalPrice);

  const [submitting, setSubmitting] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Shopify Checkout Form State
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [newsOffers, setNewsOffers] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("Lahore");
  const [customCity, setCustomCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [saveInfo, setSaveInfo] = useState(true);

  const [shippingMethod, setShippingMethod] = useState<"standard">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank">("cod");
  const [orderNotes, setOrderNotes] = useState("");

  // Discount code state
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [discountError, setDiscountError] = useState("");

  const shippingFeePkr = 0; // Free delivery across Pakistan
  const totalPkr = Math.max(0, subtotal - appliedDiscount + shippingFeePkr);

  const activeCity = city === "Other City" ? customCity : city;

  // Apply discount code simulation
  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountCode.trim()) return;

    if (discountCode.trim().toUpperCase() === "GLORIA10") {
      const disc = Math.round(subtotal * 0.1);
      setAppliedDiscount(disc);
      setDiscountError("");
      toast.success("10% Discount applied!");
    } else if (discountCode.trim().toUpperCase() === "FREESHIP") {
      toast.success("Shipping is already FREE nationwide!");
    } else {
      setDiscountError("Enter a valid discount code");
    }
  };

  // Submit Order
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const finalName = `${firstName.trim()} ${lastName.trim()}`.trim() || lastName.trim();
    if (!finalName) {
      toast.error("Please enter your name.");
      return;
    }

    const contactNumber = phone.trim() || emailOrPhone.trim();
    if (!contactNumber || contactNumber.length < 10) {
      toast.error("Please enter a valid mobile number (e.g. 0300 1234567) for delivery.");
      return;
    }

    if (!activeCity.trim()) {
      toast.error("Please select your city in Pakistan.");
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      toast.error("Please enter your delivery street address.");
      return;
    }

    setSubmitting(true);

    try {
      const fullAddressLine = apartment.trim()
        ? `${address.trim()}, ${apartment.trim()}`
        : address.trim();

      const payload = {
        items: cartItems.map((item) => ({
          id: item.id,
          title: item.title,
          discountedPrice: item.discountedPrice,
          quantity: item.quantity,
        })),
        shippingFeePkr,
        paymentMethod: paymentMethod === "cod" ? "cash" : "bank_transfer",
        notes: orderNotes.trim() || undefined,
        guest: {
          fullName: finalName,
          phone: contactNumber,
          email: emailOrPhone.includes("@") ? emailOrPhone.trim() : undefined,
          line1: fullAddressLine,
          city: activeCity.trim(),
          postalCode: postalCode.trim() || undefined,
          country: "Pakistan",
        },
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order. Please try again.");
      }

      if (data.summary) {
        sessionStorage.setItem(
          CHECKOUT_ORDER_SUMMARY_KEY,
          JSON.stringify(data.summary)
        );
      }

      dispatch(removeAllItemsFromCart());
      toast.success("Order placed successfully!");
      router.push(`/checkout/success?order=${encodeURIComponent(data.orderNumber || "")}`);
    } catch (err: any) {
      toast.error(err.message || "An error occurred while placing your order.");
    } finally {
      setSubmitting(false);
    }
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FDFCFB] px-4 py-16">
        <div className="max-w-md w-full text-center p-8 bg-white rounded-2xl border border-gray-200/80 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 text-sm mb-6">
            Explore our curated luxury watch collections and add your favorite timepieces to checkout.
          </p>
          <Link
            href="/shop-without-sidebar"
            className="inline-flex items-center gap-2 py-3 px-8 rounded-xl bg-[#111] hover:bg-black text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#333]">
      {/* ======================================================== */}
      {/* SHOPIFY HEADER (Desktop & Mobile) */}
      {/* ======================================================== */}
      <header className="border-b border-gray-200/90 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-xl sm:text-2xl font-black tracking-wider uppercase text-black font-serif">
              Gloria Times
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-black text-white">
              Official Store
            </span>
          </Link>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Lock className="w-3.5 h-3.5" />
              Secure 256-bit Checkout
            </span>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MOBILE ORDER SUMMARY ACCORDION (Shopify Signature) */}
      {/* ======================================================== */}
      <div className="lg:hidden border-b border-gray-200 bg-[#F9F8F6]">
        <button
          type="button"
          onClick={() => setMobileSummaryOpen((prev) => !prev)}
          className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-medium text-gray-700 hover:bg-[#F2EFE9] transition-colors"
        >
          <span className="flex items-center gap-2 text-[#008060] font-semibold">
            <ShoppingBag className="w-4 h-4" />
            <span>{mobileSummaryOpen ? "Hide order summary" : "Show order summary"}</span>
            {mobileSummaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
          <span className="text-sm font-bold text-gray-900">
            {formatPkr(totalPkr)}
          </span>
        </button>

        {mobileSummaryOpen && (
          <div className="px-4 py-5 border-t border-gray-200 bg-white space-y-4 animate-in fade-in duration-200">
            {/* Items */}
            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-lg border border-gray-200 bg-[#FAF8F5] shrink-0 flex items-center justify-center p-1">
                    <Image
                      src={item.imgs?.thumbnails?.[0] || "/images/rolex.webp"}
                      alt={item.title}
                      width={48}
                      height={48}
                      className="object-contain max-h-12"
                    />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-600 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-gray-900 truncate">{item.title}</h4>
                    <p className="text-[11px] text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-900">
                    {formatPkr(item.discountedPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotal / Shipping */}
            <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPkr(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-bold text-emerald-700">FREE</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-gray-900">
                <span>Total</span>
                <span>{formatPkr(totalPkr)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MAIN 2-COLUMN SHOPIFY CHECKOUT LAYOUT */}
      {/* ======================================================== */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-80px)]">
          
          {/* LEFT COLUMN: Customer Information Form (Shopify Left Side) */}
          <div className="lg:col-span-7 lg:pr-12 py-8 sm:py-10">
            {/* Breadcrumb Trail (Shopify Style) */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 font-medium">
              <Link href="/cart" className="text-[#008060] hover:underline">Cart</Link>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-900 font-semibold">Information</span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-400">Shipping</span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-400">Payment</span>
            </nav>

            <form onSubmit={handleSubmitOrder} className="space-y-7">
              {/* ---------------- 1. CONTACT SECTION ---------------- */}
              <div>
                <div className="mb-3">
                  <h2 className="text-base font-bold text-gray-900">Contact Information</h2>
                </div>

                <div>
                  <label htmlFor="emailOrPhone" className="sr-only">
                    Email or mobile phone number
                  </label>
                  <input
                    id="emailOrPhone"
                    type="text"
                    required
                    placeholder="Email or mobile phone number (03xx xxxxxxx)"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full px-3.5 py-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008060]/30 focus:border-[#008060] transition"
                  />
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <input
                    id="newsOffers"
                    type="checkbox"
                    checked={newsOffers}
                    onChange={(e) => setNewsOffers(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
                  />
                  <label htmlFor="newsOffers" className="text-xs text-gray-600 cursor-pointer">
                    Email or message me with news, order updates and exclusive discounts
                  </label>
                </div>
              </div>

              {/* ---------------- 2. DELIVERY / SHIPPING ADDRESS ---------------- */}
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-3">Delivery Address</h2>

                <div className="space-y-3">
                  {/* Country/Region (Fixed Pakistan) */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Country / Region
                    </label>
                    <select
                      disabled
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed font-medium"
                    >
                      <option value="Pakistan">Pakistan (پاکستان)</option>
                    </select>
                  </div>

                  {/* Name Fields (2 Columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="First name (optional)"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3.5 py-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008060]/30 focus:border-[#008060] transition"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Last name / Full name *"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3.5 py-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008060]/30 focus:border-[#008060] transition font-medium"
                      />
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Complete Street Address, House/Flat No, Area *"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008060]/30 focus:border-[#008060] transition"
                    />
                  </div>

                  {/* Apartment / Landmark (Optional) */}
                  <div>
                    <input
                      type="text"
                      placeholder="Apartment, suite, unit, landmark, etc. (optional)"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="w-full px-3.5 py-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008060]/30 focus:border-[#008060] transition"
                    />
                  </div>

                  {/* City Dropdown (All Pakistani Cities) & Postal Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        City (شہر) *
                      </label>
                      <select
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-3 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#008060]/30 focus:border-[#008060] transition font-medium text-gray-900"
                      >
                        {PAKISTAN_CITIES.map((cityName) => (
                          <option key={cityName} value={cityName}>
                            {cityName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Postal Code (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Postal code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-3.5 py-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008060]/30 focus:border-[#008060] transition"
                      />
                    </div>
                  </div>

                  {/* Custom city input if "Other City" selected */}
                  {city === "Other City" && (
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Please type your city name in Pakistan *"
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        className="w-full px-3.5 py-3 text-sm rounded-lg border border-[#008060] bg-emerald-50/20 focus:outline-none focus:ring-2 focus:ring-[#008060]/30 transition"
                      />
                    </div>
                  )}

                  {/* Phone Number */}
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Phone number for courier delivery updates (03xx xxxxxxx) *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008060]/30 focus:border-[#008060] transition font-medium"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Courier rider will call on this mobile number prior to doorstep delivery.
                    </p>
                  </div>

                  {/* Save info checkbox */}
                  <div className="pt-1 flex items-center gap-2">
                    <input
                      id="saveInfo"
                      type="checkbox"
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
                    />
                    <label htmlFor="saveInfo" className="text-xs text-gray-600 cursor-pointer">
                      Save this information for a faster checkout next time
                    </label>
                  </div>
                </div>
              </div>

              {/* ---------------- 3. SHIPPING METHOD ---------------- */}
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-3">Shipping Method</h2>
                <div className="rounded-xl border border-gray-300 p-4 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-4 border-black bg-white" />
                    <div>
                      <span className="text-sm font-semibold text-gray-900 block">
                        Express Courier Delivery (Trax / TCS / Leopards)
                      </span>
                      <span className="text-xs text-gray-500">2 to 4 business days · Express Delivery</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                    FREE
                  </span>
                </div>
              </div>

              {/* ---------------- 4. PAYMENT METHOD (Shopify Radio Accordion) ---------------- */}
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-1">Payment</h2>
                <p className="text-xs text-gray-500 mb-3">All transactions are secure and encrypted.</p>

                <div className="rounded-xl border border-gray-300 overflow-hidden divide-y divide-gray-200">
                  {/* Option 1: Cash on Delivery (COD) */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 cursor-pointer transition-colors ${
                      paymentMethod === "cod" ? "bg-[#FAF9F7]" : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === "cod"
                              ? "border-black bg-black"
                              : "border-gray-400 bg-white"
                          }`}
                        >
                          {paymentMethod === "cod" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-emerald-700" />
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        Most Popular
                      </span>
                    </div>

                    {paymentMethod === "cod" && (
                      <div className="mt-3.5 pt-3 border-t border-gray-200 text-xs text-gray-600 space-y-1.5 bg-white p-3 rounded-lg border border-gray-100">
                        <p className="font-semibold text-gray-900">
                          ✓ Pay cash upon delivery at your doorstep across Pakistan.
                        </p>
                        <p className="text-gray-500 leading-relaxed">
                          Includes our strict 24-hour replacement warranty against transit defects or damage (report on WhatsApp 0325-7982233).
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Option 2: Bank Transfer / EasyPaisa */}
                  <div
                    onClick={() => setPaymentMethod("bank")}
                    className={`p-4 cursor-pointer transition-colors ${
                      paymentMethod === "bank" ? "bg-[#FAF9F7]" : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === "bank"
                              ? "border-black bg-black"
                              : "border-gray-400 bg-white"
                          }`}
                        >
                          {paymentMethod === "bank" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-700" />
                          Bank Transfer / EasyPaisa / JazzCash
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">Prepaid</span>
                    </div>

                    {paymentMethod === "bank" && (
                      <div className="mt-3.5 pt-3 border-t border-gray-200 text-xs text-gray-600 space-y-1.5 bg-white p-3 rounded-lg border border-gray-100">
                        <p className="font-semibold text-gray-900">
                          Transfer directly to Meezan Bank or EasyPaisa:
                        </p>
                        <p className="text-gray-600">
                          Account details will be sent immediately upon order submission. Send receipt to WhatsApp (0325-7982233) for express dispatch.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ---------------- 5. SPECIAL INSTRUCTIONS ---------------- */}
              <div>
                <label htmlFor="orderNotes" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Order Instructions (Optional)
                </label>
                <input
                  id="orderNotes"
                  type="text"
                  placeholder="e.g. Call before coming, or deliver after 2 PM"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
                />
              </div>

              {/* ---------------- 6. SHOPIFY COMPLETE ORDER BUTTON ---------------- */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-xl bg-[#111111] hover:bg-black text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-xl hover:shadow-2xl active:scale-98 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Complete Order</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-gray-500 mt-3">
                  By clicking Complete Order, you confirm your order with Gloria Times Pakistan under our 24-hour replacement policy (no returns).
                </p>
              </div>

              {/* Footer Policy Links (Shopify Style) */}
              <div className="pt-6 border-t border-gray-200 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
                <Link href="/refund-policy" className="hover:text-black transition-colors">
                  Replacement policy
                </Link>
                <span>•</span>
                <Link href="/privacy-policy" className="hover:text-black transition-colors">
                  Privacy policy
                </Link>
                <span>•</span>
                <Link href="/terms-of-use" className="hover:text-black transition-colors">
                  Terms of service
                </Link>
              </div>
            </form>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Shopify Order Summary (Sticky Sidebar) */}
          {/* ======================================================== */}
          <div className="hidden lg:block lg:col-span-5 border-l border-gray-200/90 bg-[#FBFBFB] pl-10 py-10 sticky top-0 h-fit">
            
            {/* Products List */}
            <div className="divide-y divide-gray-200/80 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
              {cartItems.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center gap-3.5">
                  <div className="relative w-16 h-16 rounded-xl bg-white border border-gray-200/90 p-1 shrink-0 flex items-center justify-center shadow-xs">
                    <Image
                      src={item.imgs?.thumbnails?.[0] || "/images/rolex.webp"}
                      alt={item.title}
                      width={56}
                      height={56}
                      className="object-contain max-h-14"
                    />
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-600 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-1">
                      {item.title}
                    </h4>
                    <span className="text-xs text-gray-500 block">
                      Authentic Luxury Series
                    </span>
                  </div>

                  <span className="text-sm font-bold text-gray-900 shrink-0">
                    {formatPkr(item.discountedPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Discount Code Input Form (Shopify Signature) */}
            <form onSubmit={handleApplyDiscount} className="pt-5 pb-5 border-t border-gray-200 mt-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Discount code or gift card"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-black/20 uppercase font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!discountCode.trim()}
                  className="px-4 py-2.5 rounded-lg bg-gray-200 hover:bg-black hover:text-white text-xs font-bold text-gray-800 transition disabled:opacity-50 disabled:pointer-events-none"
                >
                  Apply
                </button>
              </div>
              {discountError && (
                <p className="text-[11px] text-red-600 mt-1.5 font-medium">{discountError}</p>
              )}
              {appliedDiscount > 0 && (
                <p className="text-[11px] text-emerald-700 mt-1.5 font-semibold flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Code applied (-{formatPkr(appliedDiscount)})
                </p>
              )}
            </form>

            {/* Cost Breakdown */}
            <div className="pt-4 border-t border-gray-200 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatPkr(subtotal)}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>-{formatPkr(appliedDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  Shipping (Nationwide Pakistan)
                </span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                  FREE
                </span>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-between items-baseline">
                <div>
                  <span className="text-base font-bold text-gray-900 block">
                    Total
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Including all taxes & express shipping
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 font-medium mr-1.5">PKR</span>
                  <span className="text-2xl font-black text-gray-900">
                    {formatPkr(totalPkr)}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Assurance Card */}
            <div className="mt-8 p-4 rounded-xl bg-white border border-gray-200/90 shadow-xs space-y-2.5 text-xs text-gray-700">
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Verified Luxury Quality Guarantee</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed pl-6">
                Each timepiece is individually tested and sealed in hard-shell luxury packaging before dispatch.
              </p>
              <div className="flex items-center gap-2 font-semibold text-gray-900 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>24-Hour Replacement Warranty (No Returns)</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
