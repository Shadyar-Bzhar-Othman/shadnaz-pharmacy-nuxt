// Endpoints
import { PRODUCT_URL } from "~/helpers/endpoints";

// Types
import type { Product, ProductForm } from "~/types/others/product";
import type { MetaInfo, MetaResponse } from "@/types/shared/meta";
import type { FilterType } from "@/types/shared/data-table";

// Others
import { downloadBlob } from "@/helpers/functions";

export const useProductStore = defineStore("products", () => {
  // States
  const products = ref<Product[]>([]);
  const currentProduct = ref<Product | null>(null);
  const originalProduct = ref<Product | null>(null);

  const creating = ref(false);
  const editing = ref(false);
  const deleting = ref(false);

  // Form
  const defaultForm: ProductForm = {
    brand_id: 0,
    sub_category_id: 0,
    name_en: "",
    name_ar: "",
    name_ckb: "",
    description_en: "",
    description_ar: "",
    description_ckb: "",
    stock: 0,
    original_price: 0,
    price: 0,
    discounted_price: 0,
    img_path: undefined,
    is_active: 0,
  };

  // Pagination
  const form = ref<ProductForm>({ ...defaultForm });

  const paginationInfo = ref<MetaInfo>({
    currentPage: 1,
    perPage: 12,
    totalPage: 1,
    total: 0,
  });

  // Hooks
  const api = useApi();
  const { t } = useI18n();
  const { isLoading } = useLoading();
  const loading = ref(false);
  const errors = ref<any>({});

  // Utils
  const filterStore = useFilterStore();
  const { actives } = useStoreDataUtils(t);
  const { handleError, createFormData } = useStoreUtils();
  const { success } = useToast();

  // Search
  const searchTerm = ref("");

  const search = (value: string) => {
    searchTerm.value = value;
    getProducts(1);
  };

  // Filters
  const queryString = ref("");

  const filters = computed<FilterType[]>(() => [
    {
      filterName: t("fields.brand"),
      filterKey: "brand_id",
      filterOptions: filterStore.brands,
    },
    {
      filterName: t("fields.subCategory"),
      filterKey: "sub_category_id",
      filterOptions: filterStore.subCategories,
    },
    {
      filterName: t("fields.active"),
      filterKey: "is_active",
      filterOptions: actives.value,
    },
  ]);

  function setFilters(value: string) {
    queryString.value = value;

    getProducts(1);
  }

  // Computed Properties
  const filteredProducts = computed(() =>
    products.value.map((product) => ({
      ...product,
    }))
  );

  const isEmpty = computed(() => !filteredProducts.value.length);

  const isFormCreateFilled = computed(() => {
    return (
      form.value.brand_id !== 0 &&
      form.value.sub_category_id !== 0 &&
      form.value.name_en.trim() !== "" &&
      form.value.name_ar.trim() !== "" &&
      form.value.name_ckb.trim() !== "" &&
      form.value.description_en.trim() !== "" &&
      form.value.description_ar.trim() !== "" &&
      form.value.description_ckb.trim() !== "" &&
      form.value.stock >= 0 &&
      form.value.original_price > 0 &&
      form.value.price > 0 &&
      form.value.img_path !== undefined
    );
  });

  const isFormEditFilled = computed(() => {
    return (
      form.value.brand_id !== 0 &&
      form.value.sub_category_id !== 0 &&
      form.value.name_en.trim() !== "" &&
      form.value.name_ar.trim() !== "" &&
      form.value.name_ckb.trim() !== "" &&
      form.value.description_en.trim() !== "" &&
      form.value.description_ar.trim() !== "" &&
      form.value.description_ckb.trim() !== "" &&
      form.value.stock >= 0 &&
      form.value.original_price > 0 &&
      form.value.price > 0
    );
  });

  const isFormEditChanged = computed(() => {
    if (!currentProduct.value) return false;

    return (
      isFormEditFilled.value &&
      (form.value.name_en.trim() !== originalProduct.value?.name_en ||
        form.value.name_ar.trim() !== originalProduct.value?.name_ar ||
        form.value.name_ckb.trim() !== originalProduct.value?.name_ckb ||
        form.value.description_en.trim() !==
          originalProduct.value?.description_en ||
        form.value.description_ar.trim() !==
          originalProduct.value?.description_ar ||
        form.value.description_ckb.trim() !==
          originalProduct.value?.description_ckb ||
        form.value.brand_id != originalProduct.value?.brand_id ||
        form.value.sub_category_id != originalProduct.value?.sub_category_id ||
        form.value.stock !== originalProduct.value?.stock ||
        form.value.original_price !== originalProduct.value?.original_price ||
        form.value.price !== originalProduct.value?.price ||
        form.value.discounted_price !==
          originalProduct.value?.discounted_price ||
        form.value.is_active != originalProduct.value?.is_active ||
        (form.value.img_path && form.value.img_path !== ""))
    );
  });

  // Helper Functions
  function notifySuccess(action: string) {
    const message = `${t("models.product")} ${t(action)}`;

    success(`${message}!`);
  }

  function setProduct(product: Product | null) {
    if (!product) {
      resetForm();
    } else {
      currentProduct.value = product;
      originalProduct.value = product;

      form.value = {
        brand_id: product.brand_id,
        sub_category_id: product.sub_category_id,
        name_en: product.name_en,
        name_ar: product.name_ar,
        name_ckb: product.name_ckb,
        description_en: product.description_en,
        description_ar: product.description_ar,
        description_ckb: product.description_ckb,
        stock: product.stock,
        original_price: product.original_price,
        price: product.price,
        discounted_price: product.discounted_price,
        img_path: "",
        is_active: product.is_active,
      };
    }
  }

  // Functions
  async function exportProducts() {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = (await api.$api(`${PRODUCT_URL}/export`, {
        method: "GET",
        responseType: "blob",
      })) as unknown;

      downloadBlob(response, "products.xlsx");

      notifySuccess("actions.downloaded");
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function getProducts(page = 1) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{
        products: Product[];
        meta: MetaResponse;
      }>(
        `${PRODUCT_URL}?page=${page}&search=${searchTerm.value}&${queryString.value}`
      );

      products.value = response.products;

      paginationInfo.value.currentPage = response.meta.current_page;
      paginationInfo.value.totalPage = response.meta.last_page;
      paginationInfo.value.perPage = response.meta.per_page;
      paginationInfo.value.total = response.meta.total;
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function getProduct(id: string | number) {
    isLoading.value = true;
    errors.value = {};

    try {
      const response = await api.getData<{ data: Product }>(
        `${PRODUCT_URL}/${id}`
      );

      currentProduct.value = response.data;

      setProduct(currentProduct.value);
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function createProduct() {
    loading.value = true;
    errors.value = {};
    creating.value = true;

    const formData = createFormData(form.value);

    try {
      await api.postData(`${PRODUCT_URL}`, formData);

      notifySuccess("actions.created");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      creating.value = false;
    }
  }

  async function editProduct(id: string | number) {
    loading.value = true;
    errors.value = {};
    editing.value = true;

    const formData = createFormData(form.value);
    formData.append("_method", "PUT");

    try {
      await api.postData(`${PRODUCT_URL}/${id}`, formData);

      notifySuccess("actions.updated");

      resetForm();
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      editing.value = false;
    }
  }

  async function deleteProduct(id: string | number) {
    loading.value = true;
    errors.value = {};
    deleting.value = true;

    try {
      await api.deleteData(`${PRODUCT_URL}/${id}`);

      notifySuccess("actions.deleted");
    } catch (e) {
      errors.value = handleError(e);
    } finally {
      loading.value = false;
      deleting.value = false;
    }
  }

  function resetForm() {
    form.value = { ...defaultForm };
    currentProduct.value = null;
    errors.value = {};
  }

  return {
    currentProduct,
    filteredProducts,
    searchTerm,
    filters,
    paginationInfo,
    form,
    loading,
    errors,
    creating,
    editing,
    deleting,
    isEmpty,
    isFormCreateFilled,
    isFormEditFilled,
    isFormEditChanged,
    search,
    setFilters,
    setProduct,
    exportProducts,
    getProducts,
    getProduct,
    createProduct,
    editProduct,
    deleteProduct,
    resetForm,
  };
});
