import type { Category } from "@/types/others/category";

export interface SubCategory {
  id: number;
  category_id: number;
  name: string;
  category?: Category;
  created_at?: string;
  updated_at?: string;
}

export interface SubCategoryForm {
  category_id: number;
  name: string;
}
