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
              icon="subway:add"
              width="w-[150px]"
              :text="t('actions.create') + ' ' + t('models.product')"
              :loading="store.loading && store.creating"
              :disabled="store.loading || !isFormCreateFilled"
              @click="createProductFunc"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- body -->
      <template #body>
        <!-- Form -->
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
            v-model="store.form.images"
            name="images"
            :tname="$t('fields.images')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormSwitch
            v-model="store.form.is_active"
            name="is_active"
            :tname="$t('fields.active')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
        </BaseForm>

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
    label: t("actions.create") + " " + t("models.product"),
    icon: "ic:round-create-new-folder",
  },
]);

// Stores
const filterStore = useTenantFilterStore();
const store = useProductStore();

const { isFormCreateFilled, errors } = storeToRefs(store);

const { createProduct } = store;

// Lifecycle Hooks
onActivated(() => {
  filterStore.getCategories();
  filterStore.getVariants();
});

// States
const selectedValues = reactive<Record<number, number[]>>({});
const combinations = ref<ProductVariantUI[]>([]);

// Functions
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

const createProductFunc = async () => {
  store.form.variants = combinations.value.map((comb) => ({
    variant_value_ids: comb.variant_value_ids,
    sku: comb.sku,
    price: comb.price ?? 0,
    stock: comb.stock ?? 0,
  }));

  await createProduct();

  if (!Object.keys(errors.value).length) {
    navigate("manage-products-products");
  }
};

// Watchers
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
      const existing = combinations.value.find((c) => c.sku === g.sku);
      return {
        ...g,
        price: existing?.price ?? store.form.price ?? null,
        stock: existing?.stock ?? store.form.stock ?? null,
      };
    });
  },
  { deep: true, immediate: true }
);
</script>
