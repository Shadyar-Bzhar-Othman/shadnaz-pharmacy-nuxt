<template>
  <ClientOnly>
    <div
      class="flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded"
      @click="toggleTheme"
    >
      <div class="st-sunMoonThemeToggleBtn text-light relative h-full w-full">
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="currentColor"
          stroke="none"
          :class="{ dark: currentTheme === ThemeMode.Dark }"
        >
          <mask id="moon-mask">
            <rect x="0" y="0" width="20" height="20" fill="white"></rect>
            <circle class="moonMask" cx="11" cy="3" r="8" fill="black"></circle>
          </mask>
          <circle
            class="sunMoon"
            cx="10"
            cy="10"
            r="8"
            mask="url(#moon-mask)"
          ></circle>
          <g>
            <circle
              class="sunRay"
              v-for="(pos, index) in sunRayPositions"
              :key="index"
              :cx="pos.cx"
              :cy="pos.cy"
              r="1.5"
            ></circle>
          </g>
        </svg>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const { currentTheme, toggleTheme } = useTheme();

const sunRayPositions = [
  { cx: 18, cy: 10 },
  { cx: 14, cy: 16.928 },
  { cx: 6, cy: 16.928 },
  { cx: 2, cy: 10 },
  { cx: 6, cy: 3.1718 },
  { cx: 14, cy: 3.1718 },
];
</script>

<style scoped>
.st-sunMoonThemeToggleBtn svg {
  width: 100%;
  height: 100%;
  transition: transform 0.4s ease;
  transform: rotate(40deg);
}

.st-sunMoonThemeToggleBtn svg .sunMoon {
  transition: transform 0.4s ease;
  transform-origin: center;
}

.st-sunMoonThemeToggleBtn svg .sunRay {
  transform-origin: center;
  transform: scale(0);
  transition: transform 0.4s ease;
}

.st-sunMoonThemeToggleBtn svg.dark {
  transform: rotate(90deg);
}

.st-sunMoonThemeToggleBtn svg.dark .sunMoon {
  transform: scale(0.55);
}

.st-sunMoonThemeToggleBtn svg.dark .sunRay {
  transform: scale(1);
}

.st-sunMoonThemeToggleBtn svg.dark .moonMask {
  transform: translate(16px, -3px);
  transition: transform 0.64s cubic-bezier(0.41, 0.64, 0.32, 1.575);
}
</style>
