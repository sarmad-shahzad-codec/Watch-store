import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import type { CheckoutOrderSummary } from "@/lib/checkoutOrderSummary";

export const runtime = "nodejs";

type CartLine = {
  id: number;
  title: string;
  discountedPrice: number;
  quantity: number;
};

type ShippingPayload = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  region?: string | null;
  country: string;
  postalCode?: string | null;
};

function randomOrderNumber(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `WTC-${n}`;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Try admin client first; fallback to server anon client with RLS insert
  let dbClient: any;
  try {
    dbClient = createAdminClient();
  } catch {
    dbClient = supabase;
  }

  const body = await request.json();
  const items = body?.items as CartLine[] | undefined;
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const shippingFeePkr = Math.max(
    0,
    Math.round(Number(body?.shippingFeePkr) || 0)
  );
  const paymentMethod = String(body?.paymentMethod || "cash").trim();
  const notes = body?.notes ? String(body.notes).slice(0, 2000) : null;

  let subtotalPkr = 0;
  for (const it of items) {
    if (!it?.title || !Number.isFinite(it.quantity) || it.quantity < 1) {
      return NextResponse.json({ error: "Invalid line item." }, { status: 400 });
    }
    subtotalPkr += Math.round(it.discountedPrice) * it.quantity;
  }
  const totalPkr = subtotalPkr + shippingFeePkr;

  let guestEmail: string | null = null;
  let guestName: string | null = null;
  let guestPhone: string | null = null;
  const userId: string | null = user?.id ?? null;
  let shipping: ShippingPayload;
  let addressId: string | null = null;

  if (user && body?.savedAddressId) {
    const savedId = body.savedAddressId as string;
    const { data: addr } = await dbClient
      .from("addresses")
      .select(
        "id, full_name, phone, line1, line2, city, region, country, postal_code"
      )
      .eq("id", savedId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (addr?.full_name && addr?.line1) {
      shipping = {
        fullName: addr.full_name,
        phone: addr.phone ?? "",
        line1: addr.line1,
        line2: addr.line2,
        city: addr.city ?? "",
        region: addr.region,
        country: addr.country ?? "Pakistan",
        postalCode: addr.postal_code,
      };
      addressId = addr.id;
    } else {
      const g = body?.guest || body?.shipping || {};
      shipping = {
        fullName: String(g.fullName || user.user_metadata?.full_name || "Customer").trim(),
        phone: String(g.phone || "").trim(),
        line1: String(g.line1 || g.address || "").trim(),
        line2: g.line2 ? String(g.line2).trim() : null,
        city: String(g.city || "Lahore").trim(),
        region: g.region ? String(g.region).trim() : null,
        country: "Pakistan",
        postalCode: g.postalCode ? String(g.postalCode).trim() : null,
      };
    }
  } else {
    const g = body?.guest || body?.shipping || {};
    guestName = String(g.fullName || "").trim();
    guestPhone = String(g.phone || "").trim();
    guestEmail = g.email ? String(g.email).trim() : null;

    if (!guestName || !guestPhone || (!g.line1 && !g.address)) {
      return NextResponse.json(
        { error: "Please fill in your name, phone number, and delivery address." },
        { status: 400 }
      );
    }

    shipping = {
      fullName: guestName,
      phone: guestPhone,
      line1: String(g.line1 || g.address).trim(),
      line2: g.line2 ? String(g.line2).trim() : null,
      city: String(g.city || "Lahore").trim(),
      region: g.region ? String(g.region).trim() : null,
      country: String(g.country || "Pakistan").trim(),
      postalCode: g.postalCode ? String(g.postalCode).trim() : null,
    };
  }

  let orderNumber = randomOrderNumber();
  const createdAt = new Date().toISOString();

  const orderPayload = {
    user_id: user ? userId : null,
    guest_email: user ? null : guestEmail,
    guest_name: user ? null : guestName,
    guest_phone: user ? null : guestPhone,
    order_number: orderNumber,
    shipping_full_name: shipping.fullName,
    shipping_phone: shipping.phone || null,
    shipping_line1: shipping.line1,
    shipping_line2: shipping.line2,
    shipping_city: shipping.city,
    shipping_region: shipping.region,
    shipping_country: shipping.country,
    shipping_postal_code: shipping.postalCode,
    notes,
    subtotal_pkr: subtotalPkr,
    shipping_fee_pkr: shippingFeePkr,
    total_pkr: totalPkr,
    payment_method: paymentMethod,
    address_id: addressId,
  };

  let savedOrderRow: any = null;

  try {
    const { data: orderRow, error: orderErr } = await dbClient
      .from("orders")
      .insert(orderPayload)
      .select("id, order_number, created_at")
      .maybeSingle();

    if (!orderErr && orderRow) {
      savedOrderRow = orderRow;
      const lineRows = items.map((it) => {
        const unit = Math.round(it.discountedPrice);
        const qty = it.quantity;
        return {
          order_id: orderRow.id,
          product_id: it.id,
          title: it.title,
          unit_price_pkr: unit,
          quantity: qty,
          line_total_pkr: unit * qty,
        };
      });

      await dbClient.from("order_items").insert(lineRows);
    }
  } catch (dbErr) {
    console.warn("Could not insert order into Supabase, proceeding with local summary:", dbErr);
  }

  const finalOrderNumber = savedOrderRow?.order_number || orderNumber;
  const finalCreatedAt = savedOrderRow?.created_at || createdAt;

  const summary: CheckoutOrderSummary = {
    orderNumber: finalOrderNumber,
    createdAt: finalCreatedAt,
    items: items.map((it) => {
      const unit = Math.round(it.discountedPrice);
      const qty = it.quantity;
      return {
        productId: it.id,
        title: it.title,
        unitPricePkr: unit,
        quantity: qty,
        lineTotalPkr: unit * qty,
      };
    }),
    subtotalPkr: subtotalPkr,
    shippingFeePkr: shippingFeePkr,
    totalPkr: totalPkr,
    paymentMethod,
    notes,
    shipping: {
      fullName: shipping.fullName,
      phone: shipping.phone || null,
      line1: shipping.line1,
      line2: shipping.line2 ?? null,
      city: shipping.city,
      region: shipping.region ?? null,
      country: shipping.country,
      postalCode: shipping.postalCode ?? null,
    },
  };

  return NextResponse.json({
    orderNumber: finalOrderNumber,
    isGuest: !user,
    summary,
  });
}
