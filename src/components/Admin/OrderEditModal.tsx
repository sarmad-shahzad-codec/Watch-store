"use client";

import { useEffect, useState } from "react";
import type {
  AdminOrder,
  AdminOrderPatch,
  AdminOrderStatus,
  AdminPaymentStatus,
} from "@/data/adminPortal";

const ORDER_STATUSES: { value: AdminOrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUSES: { value: AdminPaymentStatus; label: string }[] = [
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "refunded", label: "Refunded" },
];

function isoDateToInput(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function inputDateToIso(value: string): string | undefined {
  if (!value.trim()) return undefined;
  const d = new Date(value + "T12:00:00");
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

type Props = {
  order: AdminOrder | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, patch: AdminOrderPatch) => void;
};

export default function OrderEditModal({ order, open, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<AdminOrderPatch>({});

  useEffect(() => {
    if (!order) return;
    setDraft({
      status: order.status,
      payment: order.payment,
      carrier: order.carrier ?? "",
      trackingNumber: order.trackingNumber ?? "",
      estimatedDelivery: order.estimatedDelivery,
      deliveryNotes: order.deliveryNotes ?? "",
      internalNotes: order.internalNotes ?? "",
    });
  }, [order]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !order) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(order.id, {
      status: draft.status,
      payment: draft.payment,
      carrier: draft.carrier?.trim() || undefined,
      trackingNumber: draft.trackingNumber?.trim() || undefined,
      estimatedDelivery: draft.estimatedDelivery ?? undefined,
      deliveryNotes: draft.deliveryNotes?.trim() || undefined,
      internalNotes: draft.internalNotes?.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-[#1F1209]/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-edit-title"
        className="relative z-10 flex max-h-[min(92vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-[#E8DFD4] bg-white shadow-xl sm:rounded-2xl"
      >
        <div className="border-b border-[#EDE4D8] px-5 py-4">
          <h2 id="order-edit-title" className="text-lg font-semibold text-[#1F1209]">
            Edit order · {order.id}
          </h2>
          <p className="mt-1 text-xs text-[#6B5344]">
            {order.customerName} · {order.customerEmail}
          </p>
        </div>

        <form
          onSubmit={submit}
          className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-[#4A3728]">Fulfillment status</span>
              <select
                value={draft.status ?? order.status}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    status: e.target.value as AdminOrderStatus,
                  }))
                }
                className="min-h-[42px] rounded-md border border-[#DDD5CC] bg-white px-3 py-2 text-[#2B1A0F] focus:outline-none focus:ring-2 focus:ring-[#4A2F19]/25"
              >
                {ORDER_STATUSES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-[#4A3728]">Payment</span>
              <select
                value={draft.payment ?? order.payment}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    payment: e.target.value as AdminPaymentStatus,
                  }))
                }
                className="min-h-[42px] rounded-md border border-[#DDD5CC] bg-white px-3 py-2 text-[#2B1A0F] focus:outline-none focus:ring-2 focus:ring-[#4A2F19]/25"
              >
                {PAYMENT_STATUSES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-[#4A3728]">Carrier</span>
              <input
                type="text"
                value={draft.carrier ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, carrier: e.target.value }))
                }
                placeholder="e.g. TCS, Leopard"
                className="rounded-md border border-[#DDD5CC] px-3 py-2 text-[#2B1A0F] placeholder:text-[#A89888] focus:outline-none focus:ring-2 focus:ring-[#4A2F19]/25"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-[#4A3728]">Tracking number</span>
              <input
                type="text"
                value={draft.trackingNumber ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, trackingNumber: e.target.value }))
                }
                placeholder="Tracking / CN"
                className="rounded-md border border-[#DDD5CC] px-3 py-2 text-[#2B1A0F] placeholder:text-[#A89888] focus:outline-none focus:ring-2 focus:ring-[#4A2F19]/25"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[#4A3728]">
              Estimated delivery
            </span>
            <input
              type="date"
              value={isoDateToInput(draft.estimatedDelivery)}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  estimatedDelivery: e.target.value.trim()
                    ? inputDateToIso(e.target.value)
                    : undefined,
                }))
              }
              className="rounded-md border border-[#DDD5CC] px-3 py-2 text-[#2B1A0F] focus:outline-none focus:ring-2 focus:ring-[#4A2F19]/25"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[#4A3728]">
              Delivery notes (customer-visible)
            </span>
            <textarea
              rows={2}
              value={draft.deliveryNotes ?? ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, deliveryNotes: e.target.value }))
              }
              placeholder="Instructions for courier or recipient"
              className="resize-y rounded-md border border-[#DDD5CC] px-3 py-2 text-[#2B1A0F] placeholder:text-[#A89888] focus:outline-none focus:ring-2 focus:ring-[#4A2F19]/25"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[#4A3728]">Internal notes</span>
            <textarea
              rows={2}
              value={draft.internalNotes ?? ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, internalNotes: e.target.value }))
              }
              placeholder="Staff only — not shown on storefront"
              className="resize-y rounded-md border border-[#DDD5CC] px-3 py-2 text-[#2B1A0F] placeholder:text-[#A89888] focus:outline-none focus:ring-2 focus:ring-[#4A2F19]/25"
            />
          </label>

          <div className="mt-auto flex flex-wrap justify-end gap-2 border-t border-[#EDE4D8] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#DDD5CC] bg-white px-4 py-2.5 text-sm font-medium text-[#4A3728] transition hover:bg-[#FAF8F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#4A2F19] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3D2715]"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
