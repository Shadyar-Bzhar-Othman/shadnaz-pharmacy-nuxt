export interface Income {
  id: number;
  amount: number;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface IncomeForm {
  amount: number;
  description: string;
}
