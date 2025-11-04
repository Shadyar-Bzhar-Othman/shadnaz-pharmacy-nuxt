<template>
  <div class="relative flex justify-center items-center">
    <!-- Simple Icon -->
    <Icon
      name="mdi:translate"
      :class="[
        showDropdown ? 'text-light' : 'text-light',
        'text-xl cursor-pointer hover:text-light transition-colors',
      ]"
      @click="toggleDropdown"
    />

    <div
      v-if="showDropdown"
      :class="[
        isRtl ? 'top-8 left-0' : 'top-8 right-0',
        'w-36 absolute z-50 bg-popover text-text rounded-lg ',
      ]"
    >
      <div
        v-for="locale in locales"
        :key="locale.code"
        @click="selectLocale(locale.code)"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors duration-150',
          currentLocale === locale.code
            ? 'bg-primary/20'
            : 'hover:bg-primary-hover/20',
          'first:rounded-t-lg last:rounded-b-lg',
        ]"
      >
        <img
          :src="getImages(locale.code)"
          :alt="locale.code"
          class="w-5 h-4 rounded-sm flex-shrink-0"
        />
        <span class="text-sm font-medium flex-1">
          {{ locale.name }}
        </span>
        <Icon
          v-if="currentLocale === locale.code"
          name="mdi:check"
          class="w-4 h-4 flex-shrink-0"
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
