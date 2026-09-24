import { StoreExpense } from "@/types/expense";
import { createClient } from "./client";

const LOCAL_STORAGE_KEY = "gt_store_expenses_v1";

function getLocalExpenses(): StoreExpense[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalExpenses(items: StoreExpense[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save expenses locally:", e);
  }
}

/**
 * Fetch all store expenses from API / Supabase.
 */
export async function fetchExpensesFromSupabase(): Promise<StoreExpense[]> {
  try {
    // If in browser, prefer server API endpoint with service role privileges
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/admin/expenses", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.expenses)) {
            saveLocalExpenses(json.expenses);
            return json.expenses;
          }
        }
      } catch (apiErr) {
        console.warn("API /api/admin/expenses failed, falling back to direct client:", apiErr);
      }
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("store_expenses")
      .select("*")
      .order("expense_date", { ascending: false });

    if (error) {
      console.warn("Supabase fetchExpenses error, falling back to localStorage:", error);
      return getLocalExpenses();
    }

    if (data) {
      const parsed: StoreExpense[] = data.map((row: any) => ({
        id: Number(row.id),
        title: row.title || "Expense",
        category: row.category || "General",
        amount: Number(row.amount) || 0,
        expense_date: row.expense_date || new Date().toISOString().split("T")[0],
        notes: row.notes || "",
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
      saveLocalExpenses(parsed);
      return parsed;
    }

    return getLocalExpenses();
  } catch (err) {
    console.error("Error connecting to Supabase expenses:", err);
    return getLocalExpenses();
  }
}

/**
 * Add a new expense into Supabase and local cache.
 */
export async function createExpenseInSupabase(
  expense: Omit<StoreExpense, "id" | "created_at" | "updated_at">
): Promise<{ success: boolean; expense?: StoreExpense; error?: string }> {
  try {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/admin/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expense),
        });
        const json = await res.json();
        if (res.ok && json.success && json.expense) {
          const current = getLocalExpenses();
          saveLocalExpenses([json.expense, ...current.filter((e) => e.id !== json.expense.id)]);
          return { success: true, expense: json.expense };
        } else if (!res.ok) {
          return { success: false, error: json.error || "Failed to create expense" };
        }
      } catch (apiErr) {
        console.warn("API create expense failed, falling back to client:", apiErr);
      }
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("store_expenses")
      .insert([
        {
          title: expense.title,
          category: expense.category,
          amount: expense.amount,
          expense_date: expense.expense_date,
          notes: expense.notes || "",
        },
      ])
      .select()
      .single();

    if (error || !data) {
      console.warn("Supabase insert failed, storing locally:", error);
      const localId = Date.now();
      const newLocalExpense: StoreExpense = {
        id: localId,
        ...expense,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const current = getLocalExpenses();
      saveLocalExpenses([newLocalExpense, ...current]);
      return { success: true, expense: newLocalExpense };
    }

    const savedExpense: StoreExpense = {
      id: Number(data.id),
      title: data.title,
      category: data.category,
      amount: Number(data.amount),
      expense_date: data.expense_date,
      notes: data.notes || "",
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    const current = getLocalExpenses();
    saveLocalExpenses([savedExpense, ...current.filter((e) => e.id !== savedExpense.id)]);

    return { success: true, expense: savedExpense };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to create expense" };
  }
}

/**
 * Update an existing expense in Supabase.
 */
export async function updateExpenseInSupabase(
  id: number,
  updates: Partial<Omit<StoreExpense, "id">>
): Promise<{ success: boolean; error?: string }> {
  try {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/admin/expenses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...updates }),
        });
        const json = await res.json();
        if (res.ok && json.success) {
          const current = getLocalExpenses();
          const updated = current.map((e) => (e.id === id ? { ...e, ...updates } : e));
          saveLocalExpenses(updated);
          return { success: true };
        } else if (!res.ok) {
          return { success: false, error: json.error || "Failed to update expense" };
        }
      } catch (apiErr) {
        console.warn("API update expense failed, falling back to client:", apiErr);
      }
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("store_expenses")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.warn("Supabase update error:", error);
      return { success: false, error: error.message };
    }

    const current = getLocalExpenses();
    const updated = current.map((e) => (e.id === id ? { ...e, ...updates } : e));
    saveLocalExpenses(updated);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update expense" };
  }
}

/**
 * Permanently delete an expense from Supabase and local cache.
 */
export async function deleteExpenseInSupabase(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    let apiSuccess = false;

    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/admin/expenses?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        const json = await res.json();
        if (res.ok && json.success) {
          apiSuccess = true;
        } else if (!res.ok) {
          console.warn("API delete returned error:", json.error);
        }
      } catch (apiErr) {
        console.warn("API delete expense call failed:", apiErr);
      }
    }

    // Direct client fallback or dual verification
    const supabase = createClient();
    const { error } = await supabase.from("store_expenses").delete().eq("id", id);

    if (error && !apiSuccess) {
      console.error("Supabase direct delete error:", error);
      return { success: false, error: error.message };
    }

    // Permanently remove from localStorage
    const current = getLocalExpenses();
    saveLocalExpenses(current.filter((e) => e.id !== id));

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete expense" };
  }
}
