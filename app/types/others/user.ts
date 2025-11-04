export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone_number?: string;
  password?: string;
  img_path?: string;
  is_active: number;
  active_lang: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserForm {
  name: string;
  username: string;
  email: string;
  phone_number: string;
  password?: string;
  img_path?: File | string | undefined;
  is_active: number | boolean | null;
  active_lang: number | boolean | null;
}
