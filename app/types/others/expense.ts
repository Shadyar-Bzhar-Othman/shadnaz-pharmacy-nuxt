export interface Expense {
  id: number;
  amount: number;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseForm {
  amount: number;
  description: string;
}
