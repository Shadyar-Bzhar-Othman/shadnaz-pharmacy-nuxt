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
              :text="t('actions.delete') + ' ' + t('models.variant')"
              :loading="store.loading && store.deleting"
              :disabled="store.loading"
              :canOnlyIcon="true"
              bg="bg-destructive-500 hover:bg-destructive-400 disabled:bg-destructive-300"
              @click="deleteVariantFunc"
            />
            <ButtonBase
              icon="basil:edit-solid"
              width="w-[150px]"
              :text="t('actions.edit') + ' ' + t('models.variant')"
              :loading="store.loading && store.editing"
              :disabled="
                store.loading || !isFormEditFilled || !isFormEditChanged
              "
              @click="editVariantFunc"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- body -->
      <template #body>
        <BaseForm>
          <FormField
            v-model="store.form.name"
            name="name"
            :tname="$t('fields.name')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
        </BaseForm>

        <BaseHR class="my-4" />

        <BasePageWrapper>
          <!-- Header -->
          <template #header>
            <BasePageHeader>
              <template #breadcrumb>
                <BaseBreadcrumb :items="variantValueItems" />
              </template>

              <template #actions>
                <ButtonBase
                  :text="t('actions.export')"
                  @click="exportVariantValues"
                />

                <ButtonBase
                  icon="subway:add"
                  :text="t('actions.create')"
                  @click="addVariantValueFunc"
                />
              </template>
            </BasePageHeader>
          </template>

          <!-- Table -->
          <template #table>
            <TableWrapper
              tableId="variant-values"
              :searchTerm="searchTerm"
              @search="search"
              :noTable="true"
            >
              <template #body>
                <div
                  v-if="!isEmpty"
                  class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-3"
                >
                  <BaseActionCard
                    v-for="variantValue in filteredVariantValues"
                    :key="variantValue.id"
                    @edit="editVariantValueFunc(variantValue)"
                    @delete="deleteVariantValueFunc(variantValue)"
                  >
                    <span>
                      {{ variantValue.value }}
                    </span>
                  </BaseActionCard>
                </div>

                <div v-else class="w-full m-auto text-center p-3">
                  <span class="text-sm font-normal">
                    {{ $t("messages.noDataAvailable") }}
                  </span>
                </div>
              </template>
            </TableWrapper>
          </template>
        </BasePageWrapper>
      </template>
    </BasePageFormWrapper>

    <!-- Form -->
    <AppFormVariantValue
      v-if="isModalOpen"
      @confirm="handleConfirm"
      @cancel="closeModal"
    />
  </client-only>
</template>

<script lang="ts" setup>
// Page Meta
definePageMeta({
  layout: "dashboard-tenant-layout",
  ssr: false,
  middleware: ["tenant", "auth"],
});

// Types
import type { VariantValue } from "@/types/tenant/variant-value";

// Hooks
const route = useRoute();
const { navigate } = useLocalizedNavigate();
const { isModalOpen, openModal, closeModal } = useModal();

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([
  {
    label: t("models.variants"),
    icon: "mdi:invoice-line-items",
    to: "manage-products-variants",
  },
  {
    label: t("actions.edit") + " " + t("models.variant"),
    icon: "basil:edit-solid",
  },
]);

// Breadcrumb Variant Value Items
const variantValueItems = ref([
  {
    label: t("models.variantValues"),
    icon: "mdi:invoice-line-items",
  },
]);

// Stores
const store = useVariantStore();

const { currentVariant, isFormEditFilled, isFormEditChanged, errors } =
  storeToRefs(store);

const { getVariant, editVariant, deleteVariant } = store;

const variantValueStore = useVariantValueStore();

const { currentVariantValue, searchTerm, filteredVariantValues, isEmpty } =
  storeToRefs(variantValueStore);

const {
  search,
  exportVariantValues,
  getVariantValues,
  setVariantId,
  setVariantValue,
  createVariantValue,
  editVariantValue,
  deleteVariantValue,
  errors: variantValueErrors,
} = variantValueStore;

// Lifecycle Hooks
onActivated(() => {
  if (currentVariant.value === null) {
    const id = route.params.id;

    setVariantId(id as string | number);

    fetchVariant(id as string | number);

    fetchVariantValues();
  } else {
    const id = route.params.id;

    setVariantId(id as string | number);

    fetchVariantValues();
  }
});

// Variant Value Functions
const fetchVariantValues = () => {
  getVariantValues();
};

const addVariantValueFunc = () => {
  setVariantValue(null);

  openModal();
};

const editVariantValueFunc = (variantValue: VariantValue) => {
  setVariantValue(variantValue);

  openModal();
};

const handleConfirm = async () => {
  if (currentVariantValue.value) {
    await editVariantValue(currentVariantValue.value.id);
  } else {
    await createVariantValue();
  }

  if (!Object.keys(variantValueErrors).length) {
    fetchVariantValues();
    closeModal();
  }
};

const deleteVariantValueFunc = async (variantValue: VariantValue) => {
  const id = variantValue.id;

  await deleteVariantValue(id as string | number);

  if (!Object.keys(variantValueErrors).length) {
    fetchVariantValues();
  }
};

// Functions
const fetchVariant = (id: string | number) => {
  getVariant(id);
};

const editVariantFunc = async () => {
  const id = route.params.id;

  await editVariant(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("manage-products-variants");
  }
};

const deleteVariantFunc = async () => {
  const id = route.params.id;

  await deleteVariant(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("manage-products-variants");
  }
};
</script>
