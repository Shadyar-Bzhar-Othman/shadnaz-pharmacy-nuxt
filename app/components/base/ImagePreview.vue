<template>
  <div class="fixed z-[1000] inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen p-2 text-center">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-dark opacity-80"></div>

      <!-- Slot -->
      <div
        class="w-[100%] md:w-[700px] relative flex flex-col justify-center items-center p-4 md:p-12"
      >
        <div class="relative w-full bg-table rounded-xl shadow-main">
          <!-- Close Icon -->
          <BaseCloseIcon class="absolute top-4 right-4" :isPrimary="true" @close="close" />

          <!-- Body -->
          <div class="w-full">
            <img
              :src="image"
              alt="Image"
              class="w-full h-auto object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  image: {
    type: String,
    required: true,
  },
});

// Emits
const emits = defineEmits(["close"]);

// Functions
const close = () => {
  emits("close");
};
</script>
