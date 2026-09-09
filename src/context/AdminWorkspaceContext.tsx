"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AdminOrder,
  AdminOrderPatch,
} from "@/data/adminPortal";

const PRODUCT_PRICES_STORAGE_KEY = "gt_admin_product_sale_prices_v1";

export type ProductSaleOverrides = Record<number, number>;

function readPriceOverrides(): ProductSaleOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PRODUCT_PRICES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProductSaleOverrides;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

type AdminWorkspaceContextValue = {
  orders: AdminOrder[];
  loadingOrders: boolean;
  refreshOrders: () => Promise<void>;
  updateOrder: (id: string, patch: AdminOrderPatch) => Promise<void>;
  resetOrdersDemo: () => void;
  productSaleOverrides: ProductSaleOverrides;
  setProductSalePrice: (productId: number, salePricePkr: number | null) => void;
  resetProductPricesDemo: () => void;
};

const AdminWorkspaceContext = createContext<AdminWorkspaceContextValue | null>(
  null
);

export function AdminWorkspaceProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [productSaleOverrides, setProductSaleOverrides] =
    useState<ProductSaleOverrides>({});
  const [hydrated, setHydrated] = useState(false);

  // Clear legacy demo cache so it doesn't linger
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("gt_admin_orders_v1");
        localStorage.removeItem("gt_admin_orders_v2");
      } catch {}
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("AdminWorkspace failed to fetch live orders:", err);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    refreshOrders();
    setProductSaleOverrides(readPriceOverrides());
    setHydrated(true);
  }, [refreshOrders]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    localStorage.setItem(
      PRODUCT_PRICES_STORAGE_KEY,
      JSON.stringify(productSaleOverrides)
    );
  }, [productSaleOverrides, hydrated]);

  const updateOrder = useCallback(
    async (id: string, patch: AdminOrderPatch) => {
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...patch } : o))
      );

      // Persist to Supabase
      try {
        await fetch("/api/admin/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, patch }),
        });
      } catch (err) {
        console.error("Failed to persist order patch:", err);
      }
    },
    []
  );

  const resetOrdersDemo = useCallback(() => {
    refreshOrders();
  }, [refreshOrders]);

  const setProductSalePrice = useCallback(
    (productId: number, salePricePkr: number | null) => {
      setProductSaleOverrides((prev) => {
        const next = { ...prev };
        if (salePricePkr === null || Number.isNaN(salePricePkr)) {
          delete next[productId];
        } else {
          next[productId] = Math.round(salePricePkr);
        }
        return next;
      });
    },
    []
  );

  const resetProductPricesDemo = useCallback(() => {
    setProductSaleOverrides({});
    if (typeof window !== "undefined") {
      localStorage.removeItem(PRODUCT_PRICES_STORAGE_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      orders,
      loadingOrders,
      refreshOrders,
      updateOrder,
      resetOrdersDemo,
      productSaleOverrides,
      setProductSalePrice,
      resetProductPricesDemo,
    }),
    [
      orders,
      loadingOrders,
      refreshOrders,
      updateOrder,
      resetOrdersDemo,
      productSaleOverrides,
      setProductSalePrice,
      resetProductPricesDemo,
    ]
  );

  return (
    <AdminWorkspaceContext.Provider value={value}>
      {children}
    </AdminWorkspaceContext.Provider>
  );
}

export function useAdminWorkspace() {
  const ctx = useContext(AdminWorkspaceContext);
  if (!ctx) {
    throw new Error("useAdminWorkspace must be used within AdminWorkspaceProvider");
  }
  return ctx;
}
