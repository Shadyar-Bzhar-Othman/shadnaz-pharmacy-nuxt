<template>
  <MdoBaseOverlay>
    <div
      class="w-full bg-table rounded-xl shadow-main border border-border/50 py-4 flex flex-col justify-between items-center gap-2"
    >
      <!-- Header -->
      <div class="w-full px-4 flex justify-between items-center">
        <div></div>
        <div class="w-full flex justify-center items-center gap-2">
          <div class="w-5 h-5"></div>
          <h1 class="text-primary text-lg font-medium">
            {{ capitalHeaderTxt }}
          </h1>
        </div>
        <BaseCloseIcon @close="close" />
      </div>

      <!-- Body -->
      <div
        v-if="!isForm"
        class="w-full flex flex-col justify-start items-start gap-2 p-3"
      >
        <slot></slot>
      </div>

      <form
        v-else
        class="w-full flex flex-col justify-start items-start gap-2 p-3"
      >
        <slot></slot>
      </form>

      <!-- Button -->
      <div class="w-full px-3">
        <ButtonBase
          width="w-full"
          :text="capitalButtonTxt"
          :loading="loading"
          :disabled="loading"
          @click="confirm"
        />
      </div>
    </div>
  </MdoBaseOverlay>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  headerTxt: {
    type: String,
    required: true,
  },
  buttonTxt: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  isForm: {
    type: Boolean,
    required: false,
  },
});

// Emits
const emits = defineEmits(["close", "confirm"]);

const close = () => {
  emits("close");
};

const confirm = () => {
  emits("confirm");
};

// Function to capitalize each word in a string, including handling camelCase or PascalCase
function capitalizeWords(text: string): string {
  if (!text) return "";
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char: string) => char.toUpperCase());
}

// Computed Properties
const capitalHeaderTxt = computed(() => capitalizeWords(props.headerTxt));
const capitalButtonTxt = computed(() => capitalizeWords(props.buttonTxt));
</script>
