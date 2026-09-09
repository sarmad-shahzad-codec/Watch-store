"use client";
import React, { useEffect, useState } from "react";

import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import {
  removeItemFromCart,
  selectTotalPrice,
} from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import SingleItem from "./SingleItem";
import Link from "next/link";
import EmptyCart from "./EmptyCart";
import { formatPkr } from "@/lib/formatCurrency";
import { X } from "lucide-react";

const CartSidebarModal = () => {
  const { isCartModalOpen, closeCartModal } = useCartModalContext();
  const cartItems = useAppSelector((state) => state.cartReducer.items);

  const totalPrice = useSelector(selectTotalPrice);

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(".modal-content")) {
        closeCartModal();
      }
    }

    if (isCartModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartModalOpen, closeCartModal]);

  return (
    <div
      className={`fixed top-0 left-0 z-99999 overflow-y-auto no-scrollbar w-full h-screen bg-dark/70 ease-linear duration-300 ${
        isCartModalOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-end min-h-screen">
        <div className="w-full max-w-[500px] min-h-screen shadow-2xl bg-white px-5 sm:px-8 lg:px-10 relative modal-content flex flex-col justify-between">
          <div>
            {/* Header: CART + Close matching media_1788942717047.png */}
            <div className="sticky top-0 z-10 bg-white flex items-center justify-between pt-6 pb-4 border-b border-gray-200">
              <h2 className="font-bold text-dark text-xl sm:text-2xl tracking-[0.12em] uppercase">
                CART
              </h2>
              <button
                onClick={() => closeCartModal()}
                aria-label="Close cart"
                className="p-1 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6" strokeWidth={2} />
              </button>
            </div>

            {/* Trust Perks matching media_1788942717047.png */}
            <div className="py-4 border-b border-gray-200">
              <div className="flex items-center justify-center gap-6 sm:gap-8 mb-2.5 text-gray-800">
                {/* 1-Year Warranty */}
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center justify-center w-6 h-6 text-gray-900 shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span className="absolute text-[9px] font-bold text-gray-900 mt-[-2px]">1</span>
                  </div>
                  <span className="text-xs sm:text-[13px] font-medium text-gray-900 whitespace-nowrap">
                    1-Year Warranty
                  </span>
                </div>

                {/* 24-Hour Replacement */}
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-900 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  <span className="text-xs sm:text-[13px] font-medium text-gray-900 whitespace-nowrap">
                    24-Hour Replacement
                  </span>
                </div>
              </div>

              {/* Free Delivery */}
              <div className="flex items-center justify-center gap-2 text-gray-800">
                <svg className="w-5 h-5 text-gray-900 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="1" y="3" width="15" height="13" rx="1" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span className="text-xs sm:text-[13px] font-medium text-gray-900 whitespace-nowrap">
                  Free Delivery
                </span>
              </div>
            </div>

            {/* Cart Items or Empty State */}
            <div className="max-h-[55vh] overflow-y-auto no-scrollbar py-4">
              {cartItems.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {cartItems.map((item, key) => (
                    <SingleItem
                      key={key}
                      item={item}
                      removeItemFromCart={removeItemFromCart}
                    />
                  ))}
                </div>
              ) : (
                <EmptyCart />
              )}
            </div>
          </div>

          {/* Subtotal & Checkout Footer (Only when items exist) */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 bg-white pt-5 pb-6 mt-auto sticky bottom-0">
              <div className="flex items-center justify-between gap-5 mb-5">
                <p className="font-semibold text-lg text-dark">Subtotal:</p>
                <p className="font-bold text-xl text-dark">{formatPkr(totalPrice)}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => closeCartModal()}
                  className="w-full flex justify-center font-medium text-dark bg-gray-100 border border-gray-200 py-3 px-6 rounded hover:bg-gray-200 transition-colors text-xs uppercase tracking-wider"
                >
                  Continue shopping
                </button>

                <Link
                  onClick={() => closeCartModal()}
                  href="/checkout"
                  className="w-full flex justify-center font-medium text-white bg-black py-3 px-6 rounded hover:bg-gray-800 transition-colors text-xs uppercase tracking-wider"
                >
                  Move to checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebarModal;
