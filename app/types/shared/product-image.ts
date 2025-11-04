export interface ProductImage {
  id: number;
  product_id: number;
  img_path: string;
  order: number;
  is_primary: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImageForm {
  id?: number;
  file?: File;
  img_path?: string;
  is_primary: number;
  order: number;
  isNew?: boolean;
}
