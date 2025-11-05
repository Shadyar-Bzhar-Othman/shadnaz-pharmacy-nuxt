import type { City } from "@/types/others/city";

export interface User {
  id: number;
  city_id: number;
  name: string;
  username: string;
  email: string;
  phone_number: string;
  img_path?: string;
  is_active: number;
  active_lang: string;
  role: number;
  fcm?: string;
  city?: City;
  created_at?: string;
  updated_at?: string;
}

export interface UserForm {
  city_id: number | string;
  name: string;
  username: string;
  email: string;
  phone_number: string;
  password?: string;
  img_path?: File | string | undefined;
  is_active: number | boolean | null;
  active_lang: string;
  role: number;
}
