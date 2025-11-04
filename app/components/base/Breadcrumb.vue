<script setup lang="ts">
// Imports
import * as functions from "@/helpers/functions";

// Rtl
const isRtl = functions.useIsRtl();

// Types
interface BreadcrumbItem {
  label: string;
  icon?: string;
  to?: string;
}

// Hooks
const localePath = useLocalePath();

// Props
defineProps<{
  items: BreadcrumbItem[];
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
</script>

<template>
  <nav aria-label="Breadcrumb" class="w-full overflow-x-auto">
    <ol
      class="flex flex-nowrap sm:flex-wrap items-center text-xs md:text-sm gap-1 sm:gap-0 whitespace-nowrap px-2 py-2 sm:px-0 sm:py-0"
    >
      <li
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center min-w-0"
      >
        <template v-if="item.to">
          <NuxtLink
            :to="normalizeTo(item.to)"
            class="flex items-center gap-1 text-primary hover:text-primary-hover truncate max-w-[120px] sm:max-w-none"
          >
            <Icon v-if="item.icon" :name="item.icon" class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ item.label }}</span>
          </NuxtLink>
        </template>
        <template v-else>
          <span
            class="flex items-center gap-1 text-text truncate max-w-[120px] sm:max-w-none"
          >
            <Icon v-if="item.icon" :name="item.icon" class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ item.label }}</span>
          </span>
        </template>

        <!-- Separator except for last item -->
        <Icon
          v-if="index < items.length - 1"
          :name="
            isRtl
              ? 'iconamoon:arrow-left-2-bold'
              : 'iconamoon:arrow-right-2-bold'
          "
          class="mx-1 sm:mx-2 text-text hidden xs:inline sm:inline"
        />
      </li>
    </ol>
  </nav>
</template>
