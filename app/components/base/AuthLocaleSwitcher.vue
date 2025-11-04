<template>
  <div class="relative flex justify-center items-center gap-1">
    <div
      v-for="locale in locales"
      :key="locale.code"
      @click="selectLocale(locale.code)"
      :class="[
        'flex items-center gap-2 p-1.5 rounded text-light lg:text-light cursor-pointer transition-colors duration-150',
        currentLocale === locale.code ? 'hidden' : 'hover:bg-primary-hover/20',
      ]"
    >
      <span class="text-xs flex-1">
        {{ locale.name }}
      </span>
    </div>
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
const currentLocale = locale;

onMounted(() => {
  const userLocale = useCookie("user-locale");

  userLocale.value = locale.value;
});

function selectLocale(code: string) {
  const userLocale = useCookie("user-locale");

  userLocale.value = code;

  setLocale(code as any);
}

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
