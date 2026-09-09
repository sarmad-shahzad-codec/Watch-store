export type AdminOrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type AdminPaymentStatus = "paid" | "pending" | "refunded";

export type AdminOrderItem = {
  id?: string;
  productId?: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
};

export type AdminOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  placedAt: string;
  itemCount: number;
  totalPkr: number;
  status: AdminOrderStatus;
  payment: AdminPaymentStatus;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveryNotes?: string;
  internalNotes?: string;
  items?: AdminOrderItem[];
};

export type AdminOrderPatch = Partial<Omit<AdminOrder, "id">>;

/** Default empty orders array — live orders load from Supabase */
export const ADMIN_ORDERS: AdminOrder[] = [];

export function getDashboardStats(orders: AdminOrder[] = []) {
  const validOrders = orders.filter((o) => o.status !== "cancelled");
  const revenue = validOrders.reduce((s, o) => s + o.totalPkr, 0);
  const pendingFulfillment = orders.filter((o) =>
    ["pending", "processing"].includes(o.status)
  ).length;
  const awaitingPayment = orders.filter((o) => o.payment === "pending").length;
  const avgOrder =
    validOrders.length > 0 ? Math.round(revenue / validOrders.length) : 0;
  return {
    revenue,
    orderCount: orders.length,
    pendingFulfillment,
    awaitingPayment,
    avgOrder,
  };
}

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  lifetimePkr: number;
  joined: string;
};

/**
 * Dynamically group orders by customer to display real customer records
 */
export function getCustomersFromOrders(orders: AdminOrder[] = []): AdminCustomer[] {
  const map = new Map<string, AdminCustomer>();

  for (const o of orders) {
    const key = (o.customerEmail || o.customerName || o.id).toLowerCase().trim();
    const existing = map.get(key);
    if (existing) {
      existing.orders += 1;
      if (o.status !== "cancelled") {
        existing.lifetimePkr += o.totalPkr;
      }
      if (new Date(o.placedAt) < new Date(existing.joined)) {
        existing.joined = o.placedAt;
      }
    } else {
      map.set(key, {
        id: `c_${key.replace(/[^a-z0-9]/gi, "_")}`,
        name: o.customerName || "Valued Customer",
        email: o.customerEmail || "Phone / Guest",
        orders: 1,
        lifetimePkr: o.status !== "cancelled" ? o.totalPkr : 0,
        joined: o.placedAt || new Date().toISOString(),
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.lifetimePkr - a.lifetimePkr);
}

export const ADMIN_CUSTOMERS: AdminCustomer[] = [];

/** Daily aggregate for revenue charts */
export type OverviewDayPoint = {
  day: string;
  revenue: number;
  orders: number;
};

/**
 * Build dynamic 7-day revenue trend from real orders
 */
export function getOverviewRevenueSeries(orders: AdminOrder[] = []): OverviewDayPoint[] {
  const daysMap: Record<string, { revenue: number; orders: number }> = {};
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Initialize last 7 days in order up to today
  const result: OverviewDayPoint[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dayLabel = dayNames[d.getDay()];
    const dateKey = d.toISOString().slice(0, 10);
    daysMap[dateKey] = { revenue: 0, orders: 0 };
    result.push({ day: dayLabel, revenue: 0, orders: 0 });
  }

  // Populate from real orders
  for (const o of orders) {
    if (o.status === "cancelled") continue;
    const orderDate = o.placedAt ? new Date(o.placedAt) : null;
    if (!orderDate || Number.isNaN(orderDate.getTime())) continue;

    const key = orderDate.toISOString().slice(0, 10);
    if (daysMap[key]) {
      daysMap[key].revenue += o.totalPkr;
      daysMap[key].orders += 1;
    }
  }

  // Re-map into result
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateKey = d.toISOString().slice(0, 10);
    const item = daysMap[dateKey];
    const targetIdx = 6 - i;
    if (result[targetIdx] && item) {
      result[targetIdx].revenue = item.revenue;
      result[targetIdx].orders = item.orders;
    }
  }

  return result;
}

const STATUS_LABEL: Record<AdminOrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function getOrderStatusDistribution(
  orders: AdminOrder[] = []
): {
  name: string;
  value: number;
}[] {
  const tally: Partial<Record<AdminOrderStatus, number>> = {};
  for (const o of orders) {
    tally[o.status] = (tally[o.status] ?? 0) + 1;
  }
  const entries = (Object.keys(tally) as AdminOrderStatus[]).map((status) => ({
    name: STATUS_LABEL[status] || status,
    value: tally[status] ?? 0,
  }));
  return entries.length > 0 ? entries : [{ name: "No Orders", value: 0 }];
}

const PAYMENT_LABEL: Record<AdminPaymentStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  refunded: "Refunded",
};

export function getPaymentDistribution(
  orders: AdminOrder[] = []
): { name: string; value: number }[] {
  const tally: Partial<Record<AdminPaymentStatus, number>> = {};
  for (const o of orders) {
    tally[o.payment] = (tally[o.payment] ?? 0) + 1;
  }
  const entries = (Object.keys(tally) as AdminPaymentStatus[]).map((p) => ({
    name: PAYMENT_LABEL[p] || p,
    value: tally[p] ?? 0,
  }));
  return entries.length > 0 ? entries : [{ name: "No Data", value: 0 }];
}

export function getWeeklyCompare(orders: AdminOrder[] = []) {
  const validOrders = orders.filter((o) => o.status !== "cancelled");
  const total = validOrders.reduce((sum, o) => sum + o.totalPkr, 0);
  return [
    { week: "Wk 1", revenue: Math.round(total * 0.15) },
    { week: "Wk 2", revenue: Math.round(total * 0.25) },
    { week: "Wk 3", revenue: Math.round(total * 0.2) },
    { week: "Wk 4", revenue: Math.round(total * 0.4) || total },
  ];
}
