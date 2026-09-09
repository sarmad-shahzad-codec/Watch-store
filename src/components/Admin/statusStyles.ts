import type { AdminOrderStatus, AdminPaymentStatus } from "@/data/adminPortal";

export function orderStatusClass(status: AdminOrderStatus): string {
  switch (status) {
    case "delivered":
      return "bg-emerald-50 text-emerald-800 ring-emerald-600/20";
    case "shipped":
      return "bg-sky-50 text-sky-800 ring-sky-600/20";
    case "processing":
      return "bg-amber-50 text-amber-900 ring-amber-600/25";
    case "pending":
      return "bg-[#FDF4E3] text-[#6B4513] ring-[#D4A574]/30";
    case "cancelled":
      return "bg-red-50 text-red-800 ring-red-600/20";
    default:
      return "bg-gray-100 text-gray-800 ring-gray-400/20";
  }
}

export function paymentStatusClass(status: AdminPaymentStatus): string {
  switch (status) {
    case "paid":
      return "text-emerald-700 bg-emerald-50";
    case "pending":
      return "text-amber-800 bg-amber-50";
    case "refunded":
      return "text-violet-800 bg-violet-50";
    default:
      return "text-gray-700 bg-gray-100";
  }
}
