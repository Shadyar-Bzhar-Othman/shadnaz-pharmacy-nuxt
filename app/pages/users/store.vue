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
              :text="t('actions.create') "
              :loading="store.loading && store.creating"
              :disabled="store.loading || !isFormCreateFilled"
              @click="createUserFunc"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- body -->
      <template #body>
        <BaseForm>
          <FormAvatarField
            v-model="store.form.img_path"
            name="img_path"
            :tname="$t('fields.profileImage')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormDropdown
            v-model="store.form.city_id"
            name="city_id"
            :tname="$t('fields.city')"
            :options="filterStore.cities"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormDropdown
            v-model="store.form.role"
            name="role"
            :tname="$t('fields.role')"
            :options="roles"
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
          <FormField
            v-model="store.form.username"
            name="username"
            :tname="$t('fields.username')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormField
            v-model="store.form.email"
            type="email"
            name="email"
            :tname="$t('fields.email')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormField
            v-model="store.form.phone_number"
            name="phone_number"
            :tname="$t('fields.phoneNumber')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormField
            v-model="store.form.password"
            type="password"
            name="password"
            :tname="$t('fields.password')"
            :required="true"
            :disabled="store.loading"
            :errors="store.errors"
          />
          <FormDropdown
            v-model="store.form.active_lang"
            name="active_lang"
            :tname="$t('fields.activeLang')"
            :options="langs"
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
  { label: t("models.users"), icon: "fa:users", to: "users" },
  {
    label: t("actions.create") + " " + t("models.user"),
    icon: "ic:round-create-new-folder",
  },
]);

// Stores
const { roles, langs } = useStoreDataUtils(t);
const filterStore = useFilterStore();
const store = useUserStore();

const { isFormCreateFilled, errors } = storeToRefs(store);

const { createUser } = store;

// Lifecycle Hooks
onActivated(() => {
  filterStore.getCities();
});

// Functions
const createUserFunc = async () => {
  await createUser();

  if (!Object.keys(errors.value).length) {
    navigate("users");
  }
};
</script>
