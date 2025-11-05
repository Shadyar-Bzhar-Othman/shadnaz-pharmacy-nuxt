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
              :text="t('actions.delete') + ' ' + t('models.user')"
              :loading="store.loading && store.deleting"
              :disabled="store.loading"
              :canOnlyIcon="true"
              bg="bg-destructive-500 hover:bg-destructive-400 disabled:bg-destructive-300"
              @click="deleteUserFunc"
            />
            <ButtonBase
              icon="basil:edit-solid"
              width="w-[150px]"
              :text="t('actions.edit') + ' ' + t('models.user')"
              :loading="store.loading && store.editing"
              :disabled="
                store.loading || !isFormEditFilled || !isFormEditChanged
              "
              @click="editUserFunc"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- body -->
      <template #body>
        <BaseForm>
          <FormAvatarField
            v-model="store.form.img_path"
            :old="currentUser?.img_path"
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
const route = useRoute();
const { navigate } = useLocalizedNavigate();

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([
  { label: t("models.users"), icon: "fa:users", to: "users" },
  {
    label: t("actions.edit") + " " + t("models.user"),
    icon: "basil:edit-solid",
  },
]);

// Stores
const { roles, langs } = useStoreDataUtils(t);
const filterStore = useFilterStore();
const store = useUserStore();

const { currentUser, isFormEditFilled, isFormEditChanged, errors } =
  storeToRefs(store);

const { getUser, editUser, deleteUser } = store;

// Lifecycle Hooks
onActivated(() => {
  if (currentUser.value === null) {
    const id = route.params.id;

    fetchUser(id as string | number);
  }

  filterStore.getCities();
});

// Functions
const fetchUser = (id: string | number) => {
  getUser(id);
};

// Functions
const editUserFunc = async () => {
  const id = route.params.id;

  await editUser(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("users");
  }
};

const deleteUserFunc = async () => {
  const id = route.params.id;

  await deleteUser(id as string | number);

  if (!Object.keys(errors.value).length) {
    navigate("users");
  }
};
</script>
