import { StoreFund } from "@/types/fund";
import { createClient } from "./client";

const LOCAL_STORAGE_KEY = "gt_store_funds_v1";

function getLocalFunds(): StoreFund[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalFunds(items: StoreFund[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save funds locally:", e);
  }
}

/**
 * Fetch all store investment funds / capital from Supabase (or fallback to local cache).
 */
export async function fetchFundsFromSupabase(): Promise<StoreFund[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("store_funds")
      .select("*")
      .order("fund_date", { ascending: false });

    if (error) {
      console.warn("Supabase fetchFunds error, falling back to localStorage:", error);
      return getLocalFunds();
    }

    if (data) {
      const parsed: StoreFund[] = data.map((row: any) => ({
        id: Number(row.id),
        title: row.title || "Capital Injection",
        source: row.source || "Owner",
        amount: Number(row.amount) || 0,
        fund_date: row.fund_date || new Date().toISOString().split("T")[0],
        notes: row.notes || "",
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
      saveLocalFunds(parsed);
      return parsed;
    }

    return getLocalFunds();
  } catch (err) {
    console.error("Error connecting to Supabase funds:", err);
    return getLocalFunds();
  }
}

/**
 * Add a new investment/capital fund into Supabase and local cache.
 */
export async function createFundInSupabase(
  fund: Omit<StoreFund, "id" | "created_at" | "updated_at">
): Promise<{ success: boolean; fund?: StoreFund; error?: string }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("store_funds")
      .insert([
        {
          title: fund.title,
          source: fund.source || "Owner Capital",
          amount: fund.amount,
          fund_date: fund.fund_date,
          notes: fund.notes || "",
        },
      ])
      .select()
      .single();

    if (error || !data) {
      console.warn("Supabase insert fund failed, storing locally:", error);
      const localId = Date.now();
      const newLocalFund: StoreFund = {
        id: localId,
        ...fund,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const current = getLocalFunds();
      saveLocalFunds([newLocalFund, ...current]);
      return { success: true, fund: newLocalFund };
    }

    const savedFund: StoreFund = {
      id: Number(data.id),
      title: data.title,
      source: data.source,
      amount: Number(data.amount),
      fund_date: data.fund_date,
      notes: data.notes || "",
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    const current = getLocalFunds();
    saveLocalFunds([savedFund, ...current.filter((f) => f.id !== savedFund.id)]);

    return { success: true, fund: savedFund };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to create fund" };
  }
}

/**
 * Update an existing fund in Supabase.
 */
export async function updateFundInSupabase(
  id: number,
  updates: Partial<Omit<StoreFund, "id">>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("store_funds")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.warn("Supabase update fund error:", error);
    }

    const current = getLocalFunds();
    const updated = current.map((f) => (f.id === id ? { ...f, ...updates } : f));
    saveLocalFunds(updated);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update fund" };
  }
}

/**
 * Delete a fund from Supabase.
 */
export async function deleteFundInSupabase(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("store_funds").delete().eq("id", id);

    if (error) {
      console.warn("Supabase delete fund error:", error);
    }

    const current = getLocalFunds();
    saveLocalFunds(current.filter((f) => f.id !== id));

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete fund" };
  }
}
