import React from "react";
import Link from "next/link";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";

const EmptyCart = () => {
  const { closeCartModal } = useCartModalContext();

  return (
    <div className="py-12 sm:py-16 text-center">
      <p className="text-base sm:text-lg text-gray-800 font-normal mb-6">
        Your cart is currently empty.
      </p>

      <Link
        onClick={() => closeCartModal()}
        href="/shop-without-sidebar"
        className="inline-flex items-center justify-center px-8 py-3 bg-black text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-sm hover:bg-gray-800 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;

