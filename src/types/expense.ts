export type ExpenseCategory =
  | "Marketing & Ads"
  | "Packaging & Boxes"
  | "Logistics & Returns"
  | "Office & Utilities"
  | "Photography & PR"
  | "Inventory Samples"
  | "Miscellaneous";

export interface StoreExpense {
  id: number;
  title: string;
  category: string;
  amount: number;
  expense_date: string; // YYYY-MM-DD
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}
