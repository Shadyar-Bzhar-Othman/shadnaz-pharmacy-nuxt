<template>
  <client-only>
    <BasePageFormWrapper>
      <!-- Header -->
      <template #header>
        <BasePageHeader>
          <template #breadcrumb>
            <BaseBreadcrumb :items="items" />
          </template>

          <template #actions>
            <ButtonBase
              icon="ic:round-delete"
              width="sm:w-[150px]"
              :text="t('actions.delete') + ' ' + t('models.product')"
              :loading="store.loading && store.deleting"
              :disabled="store.loading"
              :canOnlyIcon="true"
              bg="bg-destructive-500 hover:bg-destructive-400 disabled:bg-destructive-300"
              @click="deleteProductFunc"
            />
            <ButtonBase
              icon="basil:edit-solid"
              width="w-[150px]"
              :text="t('actions.edit') + ' ' + t('models.product')"
              :loading="store.loading && store.editing"
              :disabled="
                store.loading || !isFormEditFilled || !isFormEditChanged
              "
              @click="editProductFunc"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- body -->
      <template #body>
        <BaseForm>
          <FormDropdown
            v-model="store.form.category_id"
            name="category_id"
            :tname="$t('fields.category')"
            :options="filterStore.categories"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormField
            v-model="store.form.name"
            name="name"
            :tname="$t('fields.name')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormTextArea
            v-model="store.form.description"
            name="description"
            :tname="$t('fields.description')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormField
            v-model="store.form.original_price"
            type="number"
            name="original_price"
            :tname="$t('fields.originalPrice')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormField
            v-model="store.form.price"
            type="number"
            name="price"
            :tname="$t('fields.price')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormField
            v-model="store.form.stock"
            type="number"
            name="stock"
            :tname="$t('fields.stock')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormMultiImageField
            :initialImages="currentProduct?.images"
            v-model="store.form.images"
            name="images"
            :tname="$t('fields.images')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
            @removeImage="(image: number) => store.form.removed_images?.push(image)"
          />
          <FormSwitch
            v-model="store.form.is_active"
            name="is_active"
            :tname="$t('fields.active')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />

          <BaseHR class="my-4" />

          <!-- Variants -->
          <BaseForm>
            <div class="w-full flex items-center gap-1">
              <Icon name="mdi:invoice-line-items" class="w-4 h-4" />
              <span>{{ $t("fields.variants") }}</span>
            </div>

            <BaseHR class="my-2" />

            <BaseCard
              v-for="variant in filterStore.variants"
              :key="variant.key"
              class="w-full p-2"
            >
              <!-- Parent Checkbox -->
              <FormBaseCheckbox
                :name="variant.value"
                :checked="
                  (selectedValues[variant.key] || []).length ===
                  variant.values.length
                "
                :isSomeSelected="
                  (selectedValues[variant.key] || []).length > 0 &&
                  (selectedValues[variant.key] || []).length <
                    variant.values.length
                "
                @changed="(checked: boolean) =>
            toggleAllValues(variant.key, checked)"
              />

              <BaseHR class="my-2" />

              <!-- Child Checkboxes -->
              <div class="flex flex-col justify-start items-start gap-2">
                <FormBaseCheckbox
                  v-for="option in variant.values"
                  :key="option.key"
                  :name="option.value"
                  :checked="
                    (selectedValues[variant.key] || []).includes(option.key)
                  "
                  @changed="(checked: boolean) =>
                    toggleValue(variant.key, option.key, checked)"
                >
                  {{ option.value }}
                </FormBaseCheckbox>
              </div>
            </BaseCard>
          </BaseForm>

          <BaseHR class="my-4" />

          <!-- Combinations -->
          <BaseForm v-if="combinations.length">
            <div class="w-full flex items-center gap-1">
              <Icon name="mdi:package" class="w-4 h-4" />
              <span>{{ $t("fields.combinations") }}</span>
            </div>

            <BaseHR class="my-2" />

            <div class="w-full flex flex-col justify-start items-start gap-2">
              <BaseCard
                v-for="(comb, idx) in combinations"
                :key="idx"
                class="p-2 w-full"
              >
                <span class="font-medium text-sm text-gray-700">
                  {{ comb.names.join(" / ") }}
                </span>

                <div class="grid grid-cols-2 gap-3">
                  <FormBaseField
                    v-model.number="comb.price"
                    type="number"
                    name="price"
                    :tname="$t('fields.price')"
                  />
                  <FormBaseField
                    v-model.number="comb.stock"
                    type="number"
                    name="stock"
                    :tname="$t('fields.stock')"
                  />
                </div>
              </BaseCard>
            </div>
          </BaseForm>
        </BaseForm>
      </template>
    </BasePageFormWrapper>
  </client-only>
</template>

<script lang="ts" setup>
// Page Meta
definePageMeta({
  layout: "dashboard-tenant-layout",
  ssr: false,
  middleware: ["tenant", "auth"],
});

// Hooks
const route = useRoute();
const { navigate } = useLocalizedNavigate();

// Locale
const { t } = useI18n();

// Types
import type { ProductVariantUI } from "@/types/tenant/product";

// Breadcrumb Items
const items = ref([
  {
    label: t("models.products"),
    icon: "ant-design:product-filled",
    to: "manage-products-products",
  },
  {
    label: t("actions.edit") + " " + t("models.product"),
    icon: "basil:edit-solid",
  },
]);

// Stores
const filterStore = useTenantFilterStore();
const store = useProductStore();

const { currentProduct, isFormEditFilled, isFormEditChanged, errors } =
  storeToRefs(store);

const { getProduct, editProduct, deleteProduct } = store;

// Lifecycle Hooks
onActivated(() => {
  if (currentProduct.value === null) {
    const id = route.params.id;

    fetchProduct(id as string | number);
  }

  filterStore.getCategories();
  filterStore.getVariants();
});

// States
const selectedValues = reactive<Record<number, number[]>>({});
const combinations = ref<ProductVariantUI[]>([]);

// Functions
const fetchProduct = (id: string | number) => {
  getProduct(id);
};

const initializeSelectedValues = () => {
  if (!currentProduct.value?.variants) return;

  currentProduct.value.variants.forEach((variant: ProductVariantUI) => {
    variant.variant_value_ids.forEach((valueId) => {
      // Find which variant group this value belongs to
      const group = filterStore.variants.find((v: any) =>
        v.values.some((opt: any) => opt.key === valueId)
      );

      if (group) {
        if (!selectedValues[group.key]) selectedValues[group.key] = [];
        if (!selectedValues?.[group.key]?.includes(valueId)) {
          selectedValues?.[group.key]?.push(valueId);
        }
      }
    });
  });
};

function toggleValue(
  variantKey: number,
  variantValueKey: number,
  checked: boolean
) {
  if (checked) {
    selectedValues[variantKey] = [
      ...(selectedValues[variantKey] || []),
      variantValueKey,
    ];
  } else {
    selectedValues[variantKey] = (selectedValues[variantKey] || []).filter(
      (key) => key !== variantValueKey
    );
  }
}

function toggleAllValues(variantKey: number, checked: boolean) {
  const variant = filterStore.variants.find((v) => v.key === variantKey);

  if (!variant) return;

  selectedValues[variantKey] = checked ? variant.values.map((v) => v.key) : [];
}

function generateCombinations(
  selected: Record<number, number[]>
): ProductVariantUI[] {
  const variantEntries = Object.entries(selected).filter(
    ([, vals]) => vals.length
  );

  if (!variantEntries.length) return [];

  const cartesian = (arrs: any[]) =>
    arrs.reduce(
      (a, b) => a.flatMap((d: any) => b.map((e: any) => [...d, e])),
      [[]]
    );

  const idsCombinations = cartesian(variantEntries.map(([, vals]) => vals));

  return idsCombinations.map((keys: number[]) => {
    const names = keys.map((key) => {
      const v = filterStore.variants
        .flatMap((variant: any) => variant.values)
        .find((opt: any) => opt.key === key);
      return v?.value ?? "";
    });

    return {
      variant_value_ids: keys,
      names,
      sku: names.join("-").toLowerCase().replace(/\s+/g, "-"),
      price: null,
      stock: null,
    };
  });
}

const editProductFunc = async () => {
  const id = route.params.id;

  store.form.variants = combinations.value.map((comb) => ({
    variant_value_ids: comb.variant_value_ids,
    sku: comb.sku,
    price: comb.price ?? 0,
    stock: comb.stock ?? 0,
  }));

  await editProduct(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("manage-products-products");
  }
};

const deleteProductFunc = async () => {
  const id = route.params.id;

  await deleteProduct(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("manage-products-products");
  }
};

// Watchers
watch(
  () => currentProduct.value,
  (prod) => {
    if (prod) {
      initializeSelectedValues();
    }
  }
);

watch(
  () => filterStore.variants,
  (variants) => {
    variants.forEach((v: any) => {
      if (!selectedValues[v.key]) selectedValues[v.key] = [];
    });
  },
  { immediate: true }
);

watch(
  () => selectedValues,
  (selected) => {
    const generated = generateCombinations(selected);

    combinations.value = generated.map((g) => {
      const existingVariant = currentProduct.value?.variants?.find(
        (v) =>
          v.variant_value_ids.length === g.variant_value_ids.length &&
          v.variant_value_ids.every((id) => g.variant_value_ids.includes(id))
      );

      return {
        ...g,
        price: existingVariant
          ? Number(existingVariant.price)
          : store.form.price ?? null,
        stock: existingVariant
          ? existingVariant.stock
          : store.form.stock ?? null,
      };
    });
  },
  { deep: true, immediate: true }
);
</script>
