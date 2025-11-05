import type { SubCategory } from "@/types/others/sub-category";
import type { Brand } from "@/types/others/brand";

export interface Product {
  id: number;
  sub_category_id: number;
  brand_id: number;
  name_en: string;
  name_ar: string;
  name_ckb: string;
  description_en: string;
  description_ar: string;
  description_ckb: string;
  stock: number;
  original_price: number;
  price: number;
  discounted_price: number;
  img_path: string;
  is_active: number;
  sub_category?: SubCategory;
  brand?: Brand;
  created_at?: string;
  updated_at?: string;
}

export interface ProductForm {
  sub_category_id: number | string;
  brand_id: number | string;
  name_en: string;
  name_ar: string;
  name_ckb: string;
  description_en: string;
  description_ar: string;
  description_ckb: string;
  stock: number;
  original_price: number;
  price: number;
  discounted_price: number;
  img_path: File | string | undefined;
  is_active: number | boolean | null;
}
