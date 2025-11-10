<template>
  <client-only>
    <BasePageWrapper>
      <!-- Header -->
      <template #header>
        <BasePageHeader>
          <template #breadcrumb>
            <BaseBreadcrumb :items="items" />
          </template>

          <template #actions>
            <BasePageTopActionButtons
              @export="exportUsers"
              @add="navigateToAddUser"
            />
          </template>
        </BasePageHeader>
      </template>

      <!-- Table -->
      <template #table>
        <TableWrapper
          tableId="users"
          :searchTerm="searchTerm"
          :filters="filters"
          @search="search"
          @setFilters="setFilters"
        >
          <template #body>
            <TableBase
              tableId="users"
              :isEmpty="isEmpty"
              :config="tableConfig"
              :data="filteredUsers"
              :currentPage="paginationInfo.currentPage"
              :perPage="paginationInfo.perPage"
              @onTab="navigateToEditUser"
            />
          </template>
        </TableWrapper>
      </template>

      <!-- Pagination -->
      <template #pagination>
        <BasePagination
          :currentPage="paginationInfo.currentPage"
          :totalPages="paginationInfo.totalPage"
          @update:currentPage="handlePageUpdate"
        />
      </template>
    </BasePageWrapper>
  </client-only>
</template>

<script lang="ts" setup>
// Page Meta
definePageMeta({
  layout: "dashboard-layout",
  ssr: false,
  middleware: ["auth"],
});

// Types
import type { User } from "~/types/others/user";
import type { TableConfig } from "@/types/shared/data-table";

// Locale
const { t } = useI18n();

// Breadcrumb Items
const items = ref([{ label: t("models.users"), icon: "fa:users" }]);

// Hooks
const { navigate } = useLocalizedNavigate();
const { getActive, getLang } = useStoreDataUtils(t);

// Stores
const filterStore = useFilterStore();
const userStore = useUserStore();

const { filters, searchTerm, paginationInfo, filteredUsers, isEmpty } =
  storeToRefs(userStore);

const { search, setFilters, exportUsers, getUsers, setUser } = userStore;

// Lifecycle Hooks
onActivated(() => {
  fetchUsers();

  filterStore.getCities();
});

// Functions
const fetchUsers = (page: number = paginationInfo.value.currentPage) => {
  getUsers(page);
};

const navigateToAddUser = () => {
  setUser(null);

  navigate("users-store");
};

const navigateToEditUser = (user: User) => {
  setUser(user);

  navigate("users-id-edit", { id: user.id });
};

const handlePageUpdate = (page: number) => {
  fetchUsers(page);
};

// Table Config
const tableConfig: ComputedRef<TableConfig> = computed(() => ({
  columns: [
    {
      key: "id",
      label: "#",
    },
    {
      key: "img_path",
      label: t("fields.profileImage"),
      isImage: true,
    },
    {
      key: "name",
      label: t("fields.name"),
    },
    {
      key: "city_id",
      label: t("fields.city"),
      formatter(value, rowData) {
        return filterStore.getCity(value)?.value ?? "-";
      },
    },
    {
      key: "username",
      label: t("fields.username"),
    },
    {
      key: "email",
      label: t("fields.email"),
    },
    {
      key: "phone_number",
      label: t("fields.phoneNumber"),
    },
    {
      key: "is_active",
      label: t("fields.active"),
      formatter(value, rowData) {
        return getActive(value == 1 ? true : false);
      },
      style: (value, rowData) => {
        if (value == 0) {
          return "max-w-24 text-destructive-500 bg-destructive-200 rounded-full py-1";
        } else {
          return "max-w-24 text-success-500 bg-success-200 rounded-full py-1";
        }
      },
    },
    {
      key: "active_lang",
      label: t("fields.activeLang"),
      formatter(value, rowData) {
        return getLang(value);
      },
    },
    {
      key: "created_at",
      label: t("fields.createdAt"),
    },
    {
      key: "updated_at",
      label: t("fields.updatedAt"),
    },
  ],
}));
</script>
