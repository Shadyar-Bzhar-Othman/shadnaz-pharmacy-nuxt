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
              :text="t('actions.create')"
              :loading="store.loading && store.creating"
              :disabled="store.loading || !isFormCreateFilled"
              @click="createProductFunc"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- body -->
      <template #body>
        <BaseForm>
          <FormImageField
            v-model="store.form.img_path"
            name="img_path"
            :tname="$t('fields.image')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormDropdown
            v-model="store.form.sub_category_id"
            name="sub_category_id"
            :tname="$t('fields.subCategory')"
            :options="filterStore.subCategories"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormDropdown
            v-model="store.form.brand_id"
            name="brand_id"
            :tname="$t('fields.brand')"
            :options="filterStore.brands"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormField
            v-model="store.form.name_en"
            name="name_en"
            :tname="$t('fields.nameEn')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormField
            v-model="store.form.name_ar"
            name="name_ar"
            :tname="$t('fields.nameAr')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormField
            v-model="store.form.name_ckb"
            name="name_ckb"
            :tname="$t('fields.nameCkb')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormTextArea
            v-model="store.form.description_en"
            name="description_en"
            :tname="$t('fields.descriptionEn')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormTextArea
            v-model="store.form.description_ar"
            name="description_ar"
            :tname="$t('fields.descriptionAr')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormTextArea
            v-model="store.form.description_ckb"
            name="description_ckb"
            :tname="$t('fields.descriptionCkb')"
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
            v-model="store.form.discounted_price"
            type="number"
            name="discounted_price"
            :tname="$t('fields.discountedPrice')"
            :required="false"
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
      </template>
    </BasePageFormWrapper>
  </client-only>
</template>

<script lang="ts" setup>
// Page Meta
definePageMeta({
  layout: "dashboard-layout",
  ssr: false,
  middleware: ["auth"],
});

// Hooks
const { navigate } = useLocalizedNavigate();

// Locale
const { t } = useI18n();

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
const filterStore = useFilterStore();
const store = useProductStore();

const { isFormCreateFilled, errors } = storeToRefs(store);

const { createProduct } = store;

// Lifecycle Hooks
onActivated(() => {
  filterStore.getSubCategories();
  filterStore.getBrands();
});

// Functions
const createProductFunc = async () => {
  await createProduct();

  if (!Object.keys(errors.value).length) {
    navigate("manage-products-products");
  }
};
</script>
