<template>
  <div
    class="relative flex items-center justify-center min-h-screen bg-primary overflow-hidden"
  >
    <!-- Glass background -->
    <div class="absolute inset-0 backdrop-blur-3xl bg-light/5"></div>

    <!-- Floating shapes -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Circle -->
      <div
        class="w-72 h-72 bg-light/10 rounded-full blur-2xl absolute top-10 left-10 animate-float"
      ></div>

      <!-- Square -->
      <div
        class="w-60 h-60 bg-light/10 blur-2xl absolute bottom-16 right-16 rotate-12 spin-slow"
      ></div>

      <!-- Smaller circle -->
      <div
        class="w-32 h-32 bg-light/20 rounded-full blur-2xl absolute top-1/2 left-1/3 animate-float"
      ></div>

      <!-- Smaller square -->
      <div
        class="w-40 h-40 bg-light/20 blur-2xl absolute top-20 right-1/4 spin-slow"
      ></div>
    </div>

    <!-- Content -->
    <div class="w-full relative z-10">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}
.animate-float {
  animation: float 8s ease-in-out infinite;
}

/* Slow spin animation */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.spin-slow {
  animation: spin-slow 25s linear infinite;
}
</style>
