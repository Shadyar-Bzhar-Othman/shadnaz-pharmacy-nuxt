<template>
  <div class="relative w-full h-full">
    <BaseLoadingPage />
    <BaseToast />

    <div class="flex flex-col min-h-screen">
      <div class="w-full">
        <!-- <LayoutHeader /> -->
      </div>

      <main class="flex-1 w-full">
        <NuxtPage />
      </main>

      <!-- <LayoutFooter /> -->
    </div>

    <div
      ref="cursor"
      :class="isHovering ? 'w-12 h-12 bg-primary/50' : 'w-3 h-3 bg-primary'"
      class="hidden sm:block fixed top-0 left-0 rounded-full pointer-events-none z-9999 transition-all duration-200 ease-out"
    ></div>
  </div>
</template>

<script lang="ts" setup>
// States
const cursor = ref<HTMLDivElement | null>(null);
const isHovering = ref(false);

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let rafId: number;

// Functions
const move = (e: MouseEvent) => {
  targetX = e.clientX;
  targetY = e.clientY;
};

const animate = () => {
  if (!cursor.value) return;

  currentX += (targetX - currentX) * 0.15;
  currentY += (targetY - currentY) * 0.15;

  const dotWidth = cursor.value.offsetWidth / 2;
  const dotHeight = cursor.value.offsetHeight / 2;

  cursor.value.style.transform = `translate3d(${currentX - dotWidth}px, ${
    currentY - dotHeight
  }px, 0)`;

  rafId = requestAnimationFrame(animate);
};

const handleMouseOver = (e: Event) => {
  const target = e.target as HTMLElement;

  if (target?.closest("[data-cursor-hover]")) {
    isHovering.value = true;
  }
};

const handleMouseOut = (e: Event) => {
  const target = e.target as HTMLElement;

  if (target?.closest("[data-cursor-hover]")) {
    isHovering.value = false;
  }
};

onMounted(() => {
  window.addEventListener("mousemove", move);
  document.addEventListener("mouseover", handleMouseOver);
  document.addEventListener("mouseout", handleMouseOut);

  rafId = requestAnimationFrame(animate);
});

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", move);
  document.removeEventListener("mouseover", handleMouseOver);
  document.removeEventListener("mouseout", handleMouseOut);

  cancelAnimationFrame(rafId);
});
</script>
