export type ImageFile = { url: string; file: File; main: boolean };

export type ImageForm = { file: File; main: boolean };

export type UnifiedImage = {
  id?: number;
  file?: File;
  url: string;
  is_primary: boolean;
  order: number;
  isNew: boolean;
};
