export interface Ad {
  id: number;
  title: string;
  img_path?: string;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

export interface AdForm {
  title: string;
  img_path?: File | string | undefined;
  is_active: number | boolean | null;
}
