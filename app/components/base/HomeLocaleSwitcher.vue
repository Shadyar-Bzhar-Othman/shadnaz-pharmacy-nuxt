<template>
  <div class="relative">
    <!-- Simple Icon -->
    <div
      v-if="!isCentral"
      class="w-8 h-8 p-1.5 rounded-lg bg-neutral-100 text-text-secondary cursor-pointer flex justify-center items-center"
      @click="toggleDropdown"
    >
      <Icon name="mdi:translate" class="size-5" />
    </div>

    <div
      v-else
      class="px-2 cursor-pointer flex justify-center items-center"
      @click="toggleDropdown"
    >
      <Icon name="mdi:translate" class="size-5" />
    </div>

    <div
      v-if="showDropdown"
      :class="[
        isRtl ? 'top-8 left-0' : 'top-8 right-0',
        'w-36 absolute z-50 bg-light text-text rounded-lg shadow-xl',
      ]"
    >
      <div
        v-for="locale in locales"
        :key="locale.code"
        @click="selectLocale(locale.code)"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors duration-150',
          currentLocale === locale.code
            ? 'bg-primary text-light'
            : 'hover:bg-primary hover:text-light',
          'first:rounded-t-lg last:rounded-b-lg',
        ]"
      >
        <img
          :src="getImages(locale.code)"
          :alt="locale.code"
          class="w-5 h-4 rounded-sm shrink-0"
        />
        <span class="text-sm font-medium flex-1">
          {{ locale.name }}
        </span>
        <Icon
          v-if="currentLocale === locale.code"
          name="mdi:check"
          class="w-4 h-4 shrink-0"
        />
      </div>
    </div>

    <div
      v-if="showDropdown"
      @click="showDropdown = false"
      class="fixed inset-0 z-40"
    />
  </div>
</template>

<script lang="ts" setup>
// Images
import enFlag from "@/assets/images/english-flag.png";
import arFlag from "@/assets/images/arabic-flag.png";
import ckbFlag from "@/assets/images/kurdish-flag.png";

import { useIsRtl } from "@/helpers/functions";

const isRtl = useIsRtl();
const { locales, setLocale, locale } = useI18n();
const showDropdown = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const currentLocale = locale;

// Props
const props = defineProps({
  isCentral: {
    type: Boolean,
    default: false,
  },
});

onMounted(() => {
  const userLocale = useCookie("user-locale");

  userLocale.value = locale.value;
});

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function selectLocale(code: string) {
  const userLocale = useCookie("user-locale");

  userLocale.value = code;

  setLocale(code as any);

  showDropdown.value = false;
}

onClickOutside(dropdownRef, () => {
  showDropdown.value = false;
});

const getImages = (localeCode: string) => {
  const images = {
    en: enFlag,
    ar: arFlag,
    ckb: ckbFlag,
  };
  return images[localeCode as keyof typeof images] || ckbFlag;
};
</script>

<style scoped>
.icon-globe {
  font-size: 1.25rem;
}
</style>
