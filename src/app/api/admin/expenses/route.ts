import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/expenses
 * Fetches all store expenses from Supabase.
 */
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("store_expenses")
      .select("*")
      .order("expense_date", { ascending: false });

    if (error) {
      console.error("[API] Failed to fetch expenses:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const expenses = (data || []).map((row: any) => ({
      id: Number(row.id),
      title: row.title || "Expense",
      category: row.category || "General",
      amount: Number(row.amount) || 0,
      expense_date: row.expense_date || new Date().toISOString().split("T")[0],
      notes: row.notes || "",
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return NextResponse.json({ success: true, expenses });
  } catch (err: any) {
    console.error("[API] Expenses GET error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/expenses
 * Creates a new store expense in Supabase.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category, amount, expense_date, notes } = body;

    if (!title || amount === undefined || amount === null) {
      return NextResponse.json(
        { error: "Title and amount are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("store_expenses")
      .insert([
        {
          title: String(title).trim(),
          category: String(category || "General").trim(),
          amount: Number(amount) || 0,
          expense_date: expense_date || new Date().toISOString().split("T")[0],
          notes: notes ? String(notes).trim() : "",
        },
      ])
      .select()
      .single();

    if (error || !data) {
      console.error("[API] Failed to insert expense:", error);
      return NextResponse.json(
        { error: error?.message || "Failed to create expense" },
        { status: 500 }
      );
    }

    const savedExpense = {
      id: Number(data.id),
      title: data.title,
      category: data.category,
      amount: Number(data.amount),
      expense_date: data.expense_date,
      notes: data.notes || "",
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return NextResponse.json({ success: true, expense: savedExpense });
  } catch (err: any) {
    console.error("[API] Expenses POST error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/expenses
 * Updates an existing store expense in Supabase.
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
      .from("store_expenses")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", Number(id))
      .select()
      .single();

    if (error) {
      console.error("[API] Failed to update expense:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, expense: data });
  } catch (err: any) {
    console.error("[API] Expenses PUT error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/expenses
 * Permanently deletes an expense from Supabase.
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
      .from("store_expenses")
      .delete({ count: "exact" })
      .eq("id", Number(id));

    if (error) {
      console.error("[API] Failed to delete expense:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: Number(id), count });
  } catch (err: any) {
    console.error("[API] Expenses DELETE error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
