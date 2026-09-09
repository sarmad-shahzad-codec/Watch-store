import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import type { CheckoutOrderSummary } from "@/lib/checkoutOrderSummary";

export const runtime = "nodejs";

/**
 * Returns a saved order summary for the signed-in customer who placed the order.
 * Used when the success page is refreshed and sessionStorage is empty.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber: raw } = await context.params;
  const orderNumber = decodeURIComponent(raw);

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Orders lookup is not configured on the server." },
      { status: 503 }
    );
  }

  const { data: order, error: orderErr } = await admin
    .from("orders")
    .select(
      "id, order_number, notes, subtotal_pkr, shipping_fee_pkr, total_pkr, payment_method, shipping_full_name, shipping_phone, shipping_line1, shipping_line2, shipping_city, shipping_region, shipping_country, shipping_postal_code, created_at"
    )
    .eq("order_number", orderNumber)
    .eq("user_id", user.id)
    .maybeSingle();

  if (orderErr || !order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const { data: lineItems, error: itemsErr } = await admin
    .from("order_items")
    .select("product_id, title, unit_price_pkr, quantity, line_total_pkr")
    .eq("order_id", order.id);

  if (itemsErr) {
    console.error(itemsErr);
    return NextResponse.json(
      { error: "Could not load order lines." },
      { status: 500 }
    );
  }

  const summary: CheckoutOrderSummary = {
    orderNumber: order.order_number as string,
    createdAt: order.created_at as string,
    items: (lineItems ?? []).map((row) => ({
      productId: row.product_id as number,
      title: row.title as string,
      unitPricePkr: row.unit_price_pkr as number,
      quantity: row.quantity as number,
      lineTotalPkr: row.line_total_pkr as number,
    })),
    subtotalPkr: order.subtotal_pkr as number,
    shippingFeePkr: order.shipping_fee_pkr as number,
    totalPkr: order.total_pkr as number,
    paymentMethod: order.payment_method as string,
    notes: order.notes,
    shipping: {
      fullName: order.shipping_full_name as string,
      phone: order.shipping_phone,
      line1: order.shipping_line1 as string,
      line2: order.shipping_line2,
      city: order.shipping_city as string,
      region: order.shipping_region,
      country: order.shipping_country as string,
      postalCode: order.shipping_postal_code,
    },
  };

  return NextResponse.json({ summary });
}
