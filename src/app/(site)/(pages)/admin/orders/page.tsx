"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminOrder, AdminOrderStatus } from "@/data/adminPortal";
import { formatPkr } from "@/lib/formatCurrency";
import {
  orderStatusClass,
  paymentStatusClass,
} from "@/components/Admin/statusStyles";
import OrderEditModal from "@/components/Admin/OrderEditModal";

const STATUS_FILTERS: { value: AdminOrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

function fmtEta(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [status, setStatus] = useState<AdminOrderStatus | "all">("all");
  const [editing, setEditing] = useState<AdminOrder | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Could not load orders."
        );
      }
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateOrder = useCallback(async (id: string, patch: Partial<AdminOrder>) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, ...patch } : order))
    );
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, patch }),
      });
    } catch (err) {
      console.error("Failed to persist order patch:", err);
    }
  }, []);

  const rows = useMemo(() => {
    if (status === "all") return orders;
    return orders.filter((o) => o.status === status);
  }, [status, orders]);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#1F1209]">Orders</h2>
          <p className="mt-1 text-sm text-[#6B5344]">
            Live orders from Supabase, including guest checkout orders.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="min-h-[42px] rounded-md border border-[#DDD5CC] bg-white px-3 py-2 text-sm font-medium text-[#4A3728] transition hover:bg-[#FAF8F5]"
          >
            {loading ? "Refreshing..." : "Refresh orders"}
          </button>
          <label className="sr-only" htmlFor="order-status-filter">
            Filter by status
          </label>
          <select
            id="order-status-filter"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as AdminOrderStatus | "all")
            }
            className="min-h-[42px] rounded-md border border-[#DDD5CC] bg-white px-3 py-2 text-sm text-[#2B1A0F] focus:outline-none focus:ring-2 focus:ring-[#4A2F19]/25"
          >
            {STATUS_FILTERS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loadError ? (
        <div className="rounded-lg border border-red/20 bg-red/5 px-4 py-3 text-sm text-red">
          {loadError}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-[#E8DFD4]/90 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#EDE4D8] bg-[#FAF8F5]/90 text-[11px] uppercase tracking-[0.12em] text-[#6B5344]">
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Placed</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Delivery</th>
                <th className="px-4 py-3 font-medium">ETA</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-[#6B5344]">
                    Loading Supabase orders...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-[#6B5344]">
                    No orders found.
                  </td>
                </tr>
              ) : (
                rows.map((o) => (
                <tr key={o.id} className="border-b border-[#F0E8DC] last:border-0">
                  <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-[#2B1A0F]">
                    {o.id}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-medium text-[#2B1A0F]">
                      {o.customerName}
                    </span>
                    <span className="mt-0.5 block text-xs text-[#8B7355]">
                      {o.customerEmail}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-[#4A3728]">
                    {fmtDate(o.placedAt)}
                  </td>
                  <td className="px-4 py-3.5 tabular-nums">{o.itemCount}</td>
                  <td className="px-4 py-3.5 tabular-nums font-medium">
                    {formatPkr(o.totalPkr)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${paymentStatusClass(o.payment)}`}
                    >
                      {o.payment}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${orderStatusClass(o.status)}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="max-w-[200px] px-4 py-3.5 text-xs text-[#4A3728]">
                    {o.carrier || o.trackingNumber ? (
                      <>
                        <span className="font-medium text-[#2B1A0F]">
                          {o.carrier ?? "—"}
                        </span>
                        {o.trackingNumber ? (
                          <span className="mt-0.5 block truncate text-[#6B5344]">
                            {o.trackingNumber}
                          </span>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-[#A89888]">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-[#4A3728]">
                    {fmtEta(o.estimatedDelivery)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setEditing(o)}
                      className="font-medium text-[#4A2F19] underline-offset-2 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[#EDE4D8] px-4 py-3 text-xs text-[#8B7355]">
          Showing {rows.length} of {orders.length} orders
        </div>
      </div>

      <OrderEditModal
        order={editing}
        open={editing !== null}
        onClose={() => setEditing(null)}
        onSave={(id, patch) => updateOrder(id, patch)}
      />
    </div>
  );
}
