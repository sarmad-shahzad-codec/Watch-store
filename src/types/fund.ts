export interface StoreFund {
  id: number;
  title: string;
  source: string;
  amount: number;
  fund_date: string; // YYYY-MM-DD
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}
