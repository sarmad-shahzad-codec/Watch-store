"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import defaultShopData from "@/components/Shop/shopData";
import { fetchProductsFromSupabase } from "@/utils/supabase/products";

let cachedProducts: Product[] | null = null;
let subscribers: Array<(products: Product[]) => void> = [];

export function refreshCachedProducts(products: Product[]) {
  cachedProducts = products;
  subscribers.forEach((sub) => sub(products));
}

export function useStoreProducts() {
  const [products, setProducts] = useState<Product[]>(
    cachedProducts || defaultShopData
  );
  const [loading, setLoading] = useState(!cachedProducts);

  useEffect(() => {
    const subscriber = (newProducts: Product[]) => {
      setProducts(newProducts);
      setLoading(false);
    };
    subscribers.push(subscriber);

    if (!cachedProducts) {
      fetchProductsFromSupabase().then((data) => {
        if (data && data.length > 0) {
          cachedProducts = data;
          subscribers.forEach((sub) => sub(data));
        } else {
          cachedProducts = defaultShopData;
          subscribers.forEach((sub) => sub(defaultShopData));
        }
      });
    }

    return () => {
      subscribers = subscribers.filter((s) => s !== subscriber);
    };
  }, []);

  return { products, loading };
}
