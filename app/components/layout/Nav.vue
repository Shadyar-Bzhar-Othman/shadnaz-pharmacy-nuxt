<template>
  <div>
    <!-- Submenu -->
    <div
      v-if="hasSubMenu"
      @click="toggleSubmenu(pageKey, linkIdx)"
      class="flex items-center gap-2 p-2 rounded-lg hover:bg-primary hover:text-light duration-300 transition-colors cursor-pointer select-none my-1"
    >
      <Icon :name="icon" class="w-4 h-4" />
      <span class="text-sm">{{ text }}</span>
      <Icon
        :name="
          isSubmenuOpen(pageKey, linkIdx)
            ? 'fluent:chevron-up-12-filled'
            : 'fluent:chevron-down-12-filled'
        "
        :class="[isRtl ? 'mr-auto' : 'ml-auto', 'size-4']"
      />
    </div>

    <!-- Single Link -->
    <NuxtLink
      v-else
      :to="normalizeTo(to)"
      class="flex items-center gap-2 p-2 rounded-lg hover:bg-primary hover:text-light duration-300 transition-colors cursor-pointer select-none my-1"
      :class="[
        isRouteActive(to) ? 'bg-primary text-light' : 'text-text',
        soon ? 'pointer-events-none cursor-not-allowed opacity-60' : '',
      ]"
      @click="emits('navigate')"
    >
      <Icon :name="icon" class="w-4 h-4" />
      <span class="text-sm">{{ text }}</span>
      <span
        v-if="soon"
        :class="[
          isRtl ? 'mr-auto' : 'ml-auto',
          'text-xxxs border border-border px-2.5 py-0.5 rounded-full bg-primary text-light select-none',
        ]"
        >{{ $t("soon") }}</span
      >
    </NuxtLink>

    <!-- Sublinks -->
    <div
      v-if="hasSubMenu && isSubmenuOpen(pageKey, linkIdx)"
      :class="[isRtl ? 'mr-5' : 'ml-5', 'mt-1']"
    >
      <NuxtLink
        v-for="sublink in links"
        :key="sublink.text"
        :to="normalizeTo(sublink.to)"
        class="flex items-center gap-2 p-2 rounded-lg hover:bg-primary hover:text-light duration-300 transition-colors cursor-pointer select-none my-1"
        :class="[
          isRouteActive(sublink.to) ? 'bg-primary text-light' : 'text-text',
          sublink.soon
            ? 'pointer-events-none cursor-not-allowed opacity-60'
            : '',
        ]"
        @click="emits('navigate')"
      >
        <Icon v-if="sublink.icon" :name="sublink.icon" class="w-4 h-4" />
        <span class="text-xs">{{ sublink.text }}</span>
        <span
          v-if="sublink.soon"
          :class="[
            isRtl ? 'mr-auto' : 'ml-auto',
            'text-xxxs border border-border px-2.5 py-0.5 rounded-full bg-primary text-light select-none',
          ]"
          >{{ $t("soon") }}</span
        >
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Imports
import { useIsRtl } from "@/helpers/functions";

// Types
import type { Sublink } from "@/types/shared/layout";

// Hooks
const localePath = useLocalePath();
const isRtl = useIsRtl();
const route = useRoute();

// Emits
const emits = defineEmits(["navigate"]);

// Props
const props = defineProps<{
  icon: string;
  text: string;
  to?: string;
  soon?: boolean;
  hasSubMenu?: boolean;
  links?: Sublink[];
  pageKey: string;
  linkIdx: number;
  isSubmenuOpen: (pageKey: string, linkIdx: number) => boolean;
  toggleSubmenu: (pageKey: string, linkIdx: number) => void;
}>();

// Functions
function normalizeTo(to?: string | Record<string, any>) {
  if (!to) return "/";

  if (typeof to === "string") {
    return localePath(to);
  }

  if (to.name) {
    return to;
  }

  return localePath(to);
}

function isRouteActive(routeTo?: string | Record<string, any>) {
  if (!routeTo) return false;

  if (typeof routeTo === "string")
    return localePath(route.name as string) === localePath(routeTo);

  return (
    !!routeTo.name &&
    localePath(route.name as string) === localePath(routeTo.name)
  );
}
</script>
