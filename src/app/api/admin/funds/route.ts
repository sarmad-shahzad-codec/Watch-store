import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/funds
 * Fetches all store capital funds from Supabase.
 */
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("store_funds")
      .select("*")
      .order("fund_date", { ascending: false });

    if (error) {
      console.error("[API] Failed to fetch funds:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const funds = (data || []).map((row: any) => ({
      id: Number(row.id),
      title: row.title || "Capital Fund",
      source: row.source || "Owner Capital",
      amount: Number(row.amount) || 0,
      fund_date: row.fund_date || new Date().toISOString().split("T")[0],
      notes: row.notes || "",
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return NextResponse.json({ success: true, funds });
  } catch (err: any) {
    console.error("[API] Funds GET error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/funds
 * Creates a new store capital fund in Supabase.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, source, amount, fund_date, notes } = body;

    if (!title || amount === undefined || amount === null) {
      return NextResponse.json(
        { error: "Title and amount are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("store_funds")
      .insert([
        {
          title: String(title).trim(),
          source: String(source || "Owner Capital").trim(),
          amount: Number(amount) || 0,
          fund_date: fund_date || new Date().toISOString().split("T")[0],
          notes: notes ? String(notes).trim() : "",
        },
      ])
      .select()
      .single();

    if (error || !data) {
      console.error("[API] Failed to insert fund:", error);
      return NextResponse.json(
        { error: error?.message || "Failed to create fund" },
        { status: 500 }
      );
    }

    const savedFund = {
      id: Number(data.id),
      title: data.title,
      source: data.source,
      amount: Number(data.amount),
      fund_date: data.fund_date,
      notes: data.notes || "",
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return NextResponse.json({ success: true, fund: savedFund });
  } catch (err: any) {
    console.error("[API] Funds POST error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/funds
 * Updates an existing store fund in Supabase.
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("store_funds")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", Number(id))
      .select()
      .single();

    if (error) {
      console.error("[API] Failed to update fund:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, fund: data });
  } catch (err: any) {
    console.error("[API] Funds PUT error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/funds
 * Permanently deletes a fund from Supabase.
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // Body was empty or not json
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: "id parameter is required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error, count } = await supabase
      .from("store_funds")
      .delete({ count: "exact" })
      .eq("id", Number(id));

    if (error) {
      console.error("[API] Failed to delete fund:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: Number(id), count });
  } catch (err: any) {
    console.error("[API] Funds DELETE error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
