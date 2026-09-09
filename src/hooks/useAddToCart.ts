"use client";

import { useDispatch } from "react-redux";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { addItemToCart } from "@/redux/features/cart-slice";
import type { AppDispatch } from "@/redux/store";
import type { Product } from "@/types/product";

export type AddToCartPayload = Product & { quantity: number };

export function useAddToCart() {
  const dispatch = useDispatch<AppDispatch>();
  const { openCartModal } = useCartModalContext();

  return (payload: AddToCartPayload) => {
    dispatch(addItemToCart(payload));
    openCartModal();
  };
}
