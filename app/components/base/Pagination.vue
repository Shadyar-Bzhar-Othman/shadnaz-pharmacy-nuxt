<template>
  <div
    v-show="totalPages != 0 && totalPages != 1"
    class="w-full flex justify-center items-center gap-x-1 mt-2"
  >
    <!-- Previous Button -->
    <button
      class="transition duration-300 min-h-[38px] min-w-[38px] py-2 px-2.5 flex justify-center items-center gap-x-2 text-sm rounded-lg"
      :class="[
        currentPage === 1
          ? 'bg-primary text-light cursor-not-allowed'
          : 'bg-transparent text-text hover:bg-primary border-1 border-text hover:border-primary hover:text-light cursor-pointer',
      ]"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
    >
      <Icon v-if="isRtl" name="fa-solid:greater-than" class="size-3" />
      <Icon v-else name="fa-solid:less-than" class="size-3" />
      <span>{{ $t("actions.previous") }}</span>
    </button>

    <!-- Page Numbers -->
    <div class="flex items-center gap-x-1">
      <button
        v-for="number in numbers"
        :key="number"
        class="transition duration-300 min-h-[38px] min-w-[38px] flex justify-center items-center py-2 px-3 text-sm rounded-lg"
        :class="[
          currentPage === number
            ? 'bg-primary text-light cursor-not-allowed'
            : 'bg-transparent text-text hover:bg-primary border-1 border-text hover:border-primary hover:text-light cursor-pointer',
        ]"
        @click="changePage(number)"
      >
        {{ number }}
      </button>
      <!-- Ellipses for skipped pages -->
      <span v-if="showEllipsesAfter" class="text-general-black">...</span>
    </div>

    <!-- Next Button -->
    <button
      class="transition duration-300 min-h-[38px] min-w-[38px] py-2 px-2.5 flex justify-center items-center gap-x-2 text-sm rounded-lg"
      :class="[
        currentPage === totalPages
          ? 'bg-primary text-light cursor-not-allowed'
          : 'bg-transparent text-text hover:bg-primary border-1 border-text hover:border-primary hover:text-light cursor-pointer',
      ]"
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
    >
      <span>{{ $t("actions.next") }}</span>
      <Icon v-if="!isRtl" name="fa-solid:greater-than" class="size-3" />
      <Icon v-else name="fa-solid:less-than" class="size-3" />
    </button>
  </div>
</template>

<script setup lang="ts">
// Imports
import { useIsRtl } from "@/helpers/functions";

const isRtl = useIsRtl();
// Emits
const emits = defineEmits(["update:currentPage"]);

// Props
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

// Variables
const numbers: Ref<number[]> = ref([]);
const showEllipsesAfter = ref(false);
const maxVisiblePages = 5;

// Functions
const populateNumbers = () => {
  const startPage = Math.max(
    1,
    props.currentPage - Math.floor(maxVisiblePages / 2)
  );
  const endPage = Math.min(props.totalPages, startPage + maxVisiblePages - 1);

  numbers.value = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );
  showEllipsesAfter.value = endPage < props.totalPages;
};

const changePage = (page: number) => {
  if (page == props.currentPage) return;

  if (page > 0 && page <= props.totalPages) {
    emits("update:currentPage", page);
  }
};

// Lifecycle Hooks
onMounted(() => {
  populateNumbers();
});

// Watchers
watch(
  [() => props.currentPage, () => props.totalPages],
  () => {
    populateNumbers();
  },
  { immediate: true }
);
</script>
