import { useToast } from "@/composables/useToast";

interface FileWrapper {
  file: File | string | undefined;
}

interface FormDataInput {
  [key: string]: any;
  img_path?: File | string | undefined;
  file_path?: File | string | undefined;
  img_pathes?: FileWrapper[];
  video_pathes?: FileWrapper[];
  file_pathes?: FileWrapper[];
}

interface ErrorResponse {
  message: string;
  [key: string]: any;
}

export const useStoreUtils = () => {
  const { error } = useToast();

  const createFormData = (form: FormDataInput): FormData => {
    const formData = new FormData();

    const appendValue = (key: string, value: any) => {
      if (value === null || value === undefined) return;
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((v, i) => appendValue(`${key}[${i}]`, v));
      } else if (typeof value === "object") {
        Object.keys(value).forEach((k) =>
          appendValue(`${key}[${k}]`, value[k])
        );
      } else {
        formData.append(key, value);
      }
    };

    Object.keys(form).forEach((key) => {
      if (
        key !== "img_path" &&
        key !== "file_path" &&
        key !== "img_pathes" &&
        key !== "video_pathes" &&
        key !== "file_pathes"
      ) {
        appendValue(key, form[key]);
      }
    });

    // Handle images array specifically
    if (Array.isArray(form.images)) {
      form.images.forEach((img, index) => {
        if (img.id !== undefined && img.id !== null) {
          formData.append(`images[${index}][id]`, img.id.toString());
        }
        if (img.img_path instanceof File) {
          formData.append(`images[${index}][img_path]`, img.img_path);
        }
        formData.append(
          `images[${index}][order]`,
          img.order?.toString() ?? "0"
        );
        formData.append(
          `images[${index}][is_primary]`,
          img.is_primary ? "1" : "0"
        );
      });
    }

    // Optional single file fields
    if (form.img_path instanceof File)
      formData.append("img_path", form.img_path);
    if (form.file_path instanceof File)
      formData.append("file_path", form.file_path);

    // Arrays of file wrappers
    ["img_pathes", "video_pathes", "file_pathes"].forEach((arrKey) => {
      if (Array.isArray(form[arrKey])) {
        form[arrKey].forEach((item, index) => {
          if (item.file instanceof File)
            formData.append(`${arrKey}[${index}]`, item.file);
        });
      }
    });

    return formData;
  };

  const handleError = (e: any): ErrorResponse => {
    if (e?.response) {
      if (e.response.status === 422) {
        return e.response._data.errors;
      } else {
        error(
          e.response?.data?.message ||
            e.response?._data?.message ||
            e.message ||
            "An error occurred"
        );
        return {
          message:
            e.response?.data?.message ||
            e.response?._data?.message ||
            e.message,
        };
      }
    } else {
      return {
        message: e.message || e,
      };
    }
  };

  return {
    createFormData,
    handleError,
  };
};
