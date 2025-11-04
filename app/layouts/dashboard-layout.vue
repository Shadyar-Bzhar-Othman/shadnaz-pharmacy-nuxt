<template>
  <BaseLoadingBar />
  <BaseToast />

  <div class="bg-primary min-w-full min-h-screen relative">
    <!-- Top -->
    <div
      class="px-4 md:px-6 py-4 flex justify-between items-center gap-4 relative z-20 bg-primary h-[56px]"
    >
      <!-- Logo / Menu Button -->
      <div
        class="flex flex-row-reverse md:flex-row justify-center items-center gap-2"
      >
        <!-- Desktop logo -->
        <img
          :src="Logo"
          alt="Shadnaz Pharmacy Logo"
          class="h-[24px] md:h-[28px]"
        />

        <Icon
          ref="toggleBtnRef"
          name="material-symbols:menu-rounded"
          class="block md:hidden text-xl text-light cursor-pointer"
          @click="toggleSidebar"
        />
      </div>

      <!-- Search(Future) -->
      <div></div>

      <!-- Others(Locale, Theme, Profile) -->
      <div class="flex justify-center items-center gap-3">
        <BaseLocaleSwitcher />

        <div class="relative">
          <div
            class="w-7 h-7 rounded-lg border border-light cursor-pointer"
            @click="toggleProfile"
          >
            <img
              :src="store.user?.img_path"
              alt="User Avatar"
              class="w-full h-full rounded-lg object-cover"
            />
          </div>

          <BasePopover v-if="isProfileOpen">
            <div class="w-full flex flex-col justify-start items-start gap-1">
              <div class="flex flex-col justify-center items-start gap-1">
                <span class="text-xs">{{ store.user?.name }}</span>
                <span class="text-xs text-text-secondary">
                  {{ store.user?.email }}
                </span>
              </div>

              <BaseHR />

              <div
                @click="store.logout"
                class="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-destructive-500 hover:bg-destructive-400 duration-300 transition-colors text-light cursor-pointer select-none"
              >
                <Icon name="streamline-flex:logout-1-solid" class="w-4 h-4" />
                <span class="text-xs">{{ $t("actions.logout") }}</span>
              </div>
            </div>
          </BasePopover>
        </div>
      </div>
    </div>

    <!-- Bottom -->
    <div
      class="bg-background rounded-tr-xl rounded-tl-xl overflow-hidden flex justify-start items-start gap-2"
    >
      <!-- Sidebar -->
      <div
        ref="sidebarRef"
        class="flex flex-col justify-between bg-sidebar px-3 py-4 min-w-56 transform transition-transform duration-300 ease-in-out fixed md:static md:top-0 top-[56px] z-30 h-[100dvh] overflow-y-auto md:h-auto md:overflow-visible"
        style="min-height: calc(100dvh - 56px)"
        :class="[
          isRtl
            ? isSidebarOpen
              ? 'translate-x-0 right-0'
              : 'translate-x-full right-0'
            : isSidebarOpen
            ? 'translate-x-0 left-0'
            : '-translate-x-full left-0',
          'md:translate-x-0',
          isRtl ? 'rounded-tr-xl' : 'rounded-tl-xl',
        ]"
      >
        <div v-for="page in pages" :key="page.key" class="mb-2">
          <div v-if="page.title != ''" class="text-xs mb-1 text-text-secondary">
            {{ page.title }}
          </div>
          <div v-for="page in pages" :key="page.key" class="mb-2">
            <div
              v-if="page.title != ''"
              class="text-xs mb-1 text-text-secondary"
            >
              {{ page.title }}
            </div>

            <LayoutNav
              v-for="(link, linkIdx) in page.links"
              :key="link.text"
              :icon="link.icon"
              :text="link.text"
              :to="link.to"
              :soon="link.soon"
              :has-sub-menu="!!(link.links && link.links.length)"
              :links="link.links"
              :page-key="page.key"
              :link-idx="linkIdx"
              :is-submenu-open="isSubmenuOpen"
              :toggle-submenu="toggleSubmenu"
              @navigate="isSidebarOpen = false"
            />
          </div>
        </div>

        <!-- Bottom -->
        <div class="w-full"></div>
      </div>

      <!-- Overlay (only mobile, only below top) -->
      <div
        v-if="isSidebarOpen"
        class="fixed inset-x-0 top-[56px] bottom-0 bg-black/40 z-20 md:hidden"
        @click="isSidebarOpen = false"
      ></div>

      <!-- Main Content -->
      <div
        class="w-full max-w-7xl p-4 m-auto overflow-auto"
        style="min-height: calc(100vh - 56px)"
      >
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Imports
import { useIsRtl } from "@/helpers/functions";

// Assets
import Logo from "@/assets/images/dashboard-logo-ltr.png";

// Rtl
const isRtl = useIsRtl();

// Locale
const { t, locale } = useI18n();

// Stores
const store = useAuthStore();

// States
const isProfileOpen = ref(false);
const isSidebarOpen = ref(false);
const sidebarRef = ref(null);
const toggleBtnRef = ref(null);

// Pages
const pages = computed(() => [
  {
    title: "",
    key: "main",
    links: [
      {
        icon: "si:dashboard-fill",
        text: t("sidebar.dashboard"),
        to: "dashboard",
        soon: false,
      },
      {
        icon: "mingcute:store-fill",
        text: t("sidebar.stores"),
        to: "dashboard",
        soon: false,
      },
      {
        icon: "fa:users",
        text: t("sidebar.users"),
        to: "dashboard",
        soon: false,
      },
      {
        icon: "mingcute:package-2-fill",
        text: t("sidebar.plans"),
        to: "dashboard",
        soon: true,
      },
      {
        icon: "lsicon:setting-filled",
        text: t("sidebar.settings"),
        links: [
          {
            icon: "solar:city-bold",
            text: t("sidebar.cities"),
            to: "dashboard",
            soon: false,
          },
          {
            icon: "fa7-solid:place-of-worship",
            text: t("sidebar.types"),
            to: "dashboard",
            soon: false,
          },
          {
            icon: "mdi:coupon",
            text: t("sidebar.coupons"),
            to: "dashboard",
            soon: true,
          },
          {
            icon: "icon-park-solid:level",
            text: t("sidebar.roles"),
            to: "dashboard",
            soon: true,
          },
        ],
      },
    ],
  },
]);

// Functions
function toggleProfile() {
  isProfileOpen.value = !isProfileOpen.value;
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

onClickOutside(
  sidebarRef,
  () => {
    isSidebarOpen.value = false;
  },
  {
    ignore: [toggleBtnRef],
  }
);

const openSubmenus = ref<Record<string, Record<number, boolean>>>({});

function toggleSubmenu(pageTitle: string, linkIdx: number) {
  if (!openSubmenus.value[pageTitle]) {
    openSubmenus.value[pageTitle] = {};
  }
  openSubmenus.value[pageTitle][linkIdx] =
    !openSubmenus.value[pageTitle][linkIdx];
}

function isSubmenuOpen(pageTitle: string, linkIdx: number) {
  return !!(
    openSubmenus.value[pageTitle] && openSubmenus.value[pageTitle][linkIdx]
  );
}

// Computed Properties
const isEnglish = computed(() => locale.value === "en");
</script>
