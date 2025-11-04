<template>
  <MDOBaseOverlay>
    <div
      class="relative w-full m-4 px-16 py-8 flex flex-col justify-center items-center gap-1 bg-surface p-6 rounded shadow"
    >
      <slot name="icon"></slot>
      <h2 id="modal-headline" class="text-lg font-semibold mt-4">
        {{ headerTxt }}
      </h2>
      <p class="text-md mb-6">{{ messageTxt }}</p>
      <div class="w-full md:w-[250px] flex justify-center items-center gap-4">
        <ButtonOutlined
          :text="$t('cancel')"
          :loading="loading"
          @click="cancel"
        />
        <ButtonBase :text="$t('confirm')" :loading="loading" @click="confirm" />
      </div>
    </div>
  </MDOBaseOverlay>
</template>
<script setup lang="ts">
// Components

// Props
const props = defineProps({
  headerTxt: {
    type: String,
    required: true,
  },
  messageTxt: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
  },
});

// Emits
const emits = defineEmits(["cancel", "confirm"]);

const cancel = () => {
  emits("cancel");
};

const confirm = () => {
  emits("confirm");
};
</script>
