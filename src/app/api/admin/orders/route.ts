import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import type {
  AdminOrder,
  AdminOrderItem,
  AdminOrderStatus,
  AdminPaymentStatus,
} from "@/data/adminPortal";

export const runtime = "nodejs";

type OrderRow = {
  id: string;
  order_number: string | null;
  user_id: string | null;
  guest_email: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  shipping_full_name: string | null;
  shipping_phone: string | null;
  shipping_line1: string | null;
  shipping_city: string | null;
  created_at: string;
  total_pkr: number | null;
  payment_method: string | null;
  status: string | null;
  notes: string | null;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: number | null;
  title: string | null;
  unit_price_pkr: number | null;
  quantity: number | null;
  line_total_pkr: number | null;
};

async function getDbClient() {
  try {
    return createAdminClient();
  } catch {
    const cookieStore = await cookies();
    return createClient(cookieStore);
  }
}

export async function GET() {
  try {
    const dbClient = await getDbClient();

    const { data: rows, error } = await dbClient
      .from("orders")
      .select(
        "id, order_number, user_id, guest_email, guest_name, guest_phone, shipping_full_name, shipping_phone, shipping_line1, shipping_city, created_at, total_pkr, payment_method, status, notes"
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Supabase orders query error:", error);
      return NextResponse.json({ orders: [], error: error.message });
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    const orders = rows as OrderRow[];
    const orderIds = orders.map((order) => order.id);
    const itemCounts = new Map<string, number>();
    const orderItemsMap = new Map<string, AdminOrderItem[]>();

    if (orderIds.length > 0) {
      const { data: items } = await dbClient
        .from("order_items")
        .select("id, order_id, product_id, title, unit_price_pkr, quantity, line_total_pkr")
        .in("order_id", orderIds);

      for (const item of (items ?? []) as OrderItemRow[]) {
        const orderId = item.order_id;
        const currentList = orderItemsMap.get(orderId) || [];
        const qty = Number(item.quantity || 1);
        const price = Number(item.unit_price_pkr || 0);
        const total = Number(item.line_total_pkr || price * qty);

        currentList.push({
          id: item.id,
          productId: item.product_id ? Number(item.product_id) : undefined,
          title: item.title || "Luxury Watch",
          price,
          quantity: qty,
          total,
        });

        orderItemsMap.set(orderId, currentList);
        itemCounts.set(orderId, (itemCounts.get(orderId) ?? 0) + qty);
      }
    }

    const mapped: AdminOrder[] = orders.map((order) => {
      const rawStatus = (order.status || "pending").toLowerCase();
      let status: AdminOrderStatus = "pending";
      if (
        rawStatus === "processing" ||
        rawStatus === "shipped" ||
        rawStatus === "delivered" ||
        rawStatus === "cancelled"
      ) {
        status = rawStatus as AdminOrderStatus;
      }

      let payment: AdminPaymentStatus = "pending";
      if (order.payment_method === "paid" || status === "delivered") {
        payment = "paid";
      } else if (status === "cancelled") {
        payment = "refunded";
      }

      const displayId = order.order_number || order.id.slice(0, 8).toUpperCase();
      const customerName =
        order.shipping_full_name ||
        order.guest_name ||
        (order.user_id ? "Registered User" : "Customer");
      const customerContact =
        order.shipping_phone ||
        order.guest_phone ||
        order.guest_email ||
        "Phone on parcel";

      return {
        id: displayId,
        customerName,
        customerEmail: customerContact,
        placedAt: order.created_at,
        itemCount: itemCounts.get(order.id) ?? 1,
        totalPkr: Number(order.total_pkr ?? 0),
        status,
        payment,
        carrier: "Trax Express",
        trackingNumber: displayId,
        deliveryNotes: order.shipping_line1
          ? `${order.shipping_line1}, ${order.shipping_city || "Pakistan"}`
          : undefined,
        internalNotes: order.notes || undefined,
        items: orderItemsMap.get(order.id) || [],
      };
    });

    return NextResponse.json({ orders: mapped });
  } catch (err: any) {
    console.error("Could not query orders:", err);
    return NextResponse.json({ orders: [], error: err?.message || "Failed to load orders" });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, patch } = await req.json();
    if (!id || !patch) {
      return NextResponse.json({ error: "Missing id or patch" }, { status: 400 });
    }

    const dbClient = await getDbClient();
    const updatePayload: any = {};

    if (patch.status) {
      updatePayload.status = patch.status;
    }

    const { error: errByNumber } = await dbClient
      .from("orders")
      .update(updatePayload)
      .eq("order_number", id);

    if (errByNumber) {
      const { error: errById } = await dbClient
        .from("orders")
        .update(updatePayload)
        .eq("id", id);

      if (errById) {
        return NextResponse.json({ error: errById.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update order" }, { status: 500 });
  }
}
