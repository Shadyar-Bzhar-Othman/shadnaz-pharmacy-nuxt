<template>
  <div
    class="w-full text-text relative my-2 space-y-2"
    :class="isRtl ? 'text-right' : 'text-left'"
  >
    <!-- Label -->
    <label :for="name" class="text-sm font-[400] px-1 flex items-center gap-1">
      <span>{{ tname || capitalName }}</span>
      <Icon
        v-if="required"
        name="mdi:required"
        class="text-destructive-500 size-3"
      />
    </label>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      :id="name"
      :disabled="disabled"
      multiple
      accept="image/*"
      @change="handleFileChange"
      class="hidden"
    />

    <!-- Dropzone -->
    <div
      class="w-full min-h-[175px] border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:bg-field-hover hover:border-primary transition duration-200 text-center flex flex-col items-center justify-center gap-2"
      @click="openFileDialog"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="{ 'bg-field-hover border-primary': isDragging }"
    >
      <Icon name="basil:cloud-upload-solid" class="size-10 mb-1" />
      <p class="text-xs sm:text-sm">
        {{ $t("actions.dragAndDropOr") }}
        <span class="text-primary">{{ $t("actions.clickToUpload") }}</span>
      </p>
      <p class="text-xs">
        JPEG, PNG, JPG - {{ $t("messages.maxFileSize", { size: "10MB" }) }}
      </p>
    </div>

    <!-- Image Previews -->
    <div class="flex flex-wrap gap-2 mt-2">
      <div
        v-for="(img, index) in allImages"
        :key="img.id ?? img.url"
        class="relative w-full h-full xs:w-48 xs:h-48"
        draggable="true"
        @dragstart="dragStart(index, $event)"
        @dragover.prevent
        @drop="drop(index)"
        @dragend="dragEnd($event)"
      >
        <img :src="img.url" class="w-full h-full object-cover rounded-lg" />

        <div
          v-if="img.is_primary"
          class="absolute top-2 left-2 bg-primary text-light text-xxs px-1.5 rounded"
        >
          {{ $t("messages.main") }}
        </div>

        <div
          v-else
          class="absolute top-2 left-2 bg-neutral-100 text-text text-xxs px-1.5 rounded hover:bg-primary hover:text-light transition duration-200 text-center"
          @click.stop="setPrimary(index)"
        >
          {{ $t("actions.setAsMain") }}
        </div>

        <Icon
          class="absolute top-2 right-2 text-destructive-500 size-4 rounded hover:text-destructive-400 transition duration-300 cursor-pointer"
          name="zondicons:close-solid"
          @click.stop="removeImage(index)"
        />
      </div>
    </div>

    <!-- Errors -->
    <ul
      v-if="hasError"
      class="flex flex-col text-xxs text-destructive-500 gap-1 ml-2"
    >
      <li v-for="message in errors[name]" :key="message">{{ message }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// Imports
import { toCapitalizedWords, useIsRtl } from "@/helpers/functions";

// RTL
const isRtl = useIsRtl();

// Locale
const { locale } = useI18n();

// Types
import type { ProductImage } from "@/types/shared/product-image";
import type { UnifiedImage } from "@/types/shared/form";

// Props
const props = defineProps({
  initialImages: { type: Array as () => ProductImage[], default: () => [] },
  name: { type: String, required: true },
  tname: { type: String, default: "" },
  errors: { type: Object, default: () => ({}) },
  required: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
});

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", value: any[]): void;
  (e: "removeImage", value: number): void;
}>();

// States
const allImages = ref<UnifiedImage[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

let draggedIndex: number | null = null;

// Lifecycle
onBeforeUnmount(() => {
  allImages.value.forEach((img) => {
    if (img.isNew) URL.revokeObjectURL(img.url);
  });
});

// Functions
const openFileDialog = () => fileInput.value?.click();

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;

  if (event.dataTransfer?.files) addFiles(Array.from(event.dataTransfer.files));
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (!target.files) return;

  addFiles(Array.from(target.files));

  target.value = "";
};

const addFiles = (files: File[]) => {
  files.forEach((file) => {
    if (!file.type.startsWith("image/")) return;

    if (file.size > 10 * 1024 * 1024) return;

    const url = URL.createObjectURL(file);

    allImages.value.push({
      file,
      url,
      is_primary: allImages.value.length === 0,
      order: allImages.value.length,
      isNew: true,
    });
  });

  ensurePrimary();

  reorderImages();

  emitImages();
};

const dragStart = (index: number, e: DragEvent) => {
  draggedIndex = index;

  (e.currentTarget as HTMLElement).classList.add("opacity-50");
};

const dragEnd = (e: DragEvent) => {
  (e.currentTarget as HTMLElement).classList.remove("opacity-50");
};

const drop = (index: number) => {
  if (draggedIndex === null || draggedIndex === index) return;

  const [moved] = allImages.value.splice(draggedIndex, 1);

  if (!moved) return;

  const adjustedIndex = draggedIndex < index ? index - 1 : index;

  allImages.value.splice(adjustedIndex, 0, moved);

  allImages.value.forEach((img, idx) => (img.order = idx));

  ensurePrimary();

  reorderImages();

  draggedIndex = null;

  emitImages();
};

const setPrimary = (index: number) => {
  allImages.value.forEach((img, i) => {
    img.is_primary = i === index;
  });

  reorderImages();

  emitImages();
};

const removeImage = (index: number) => {
  const img = allImages.value[index];

  if (!img) return;

  if (!img.isNew && img.id) emit("removeImage", img.id);

  if (img.isNew && img.file) URL.revokeObjectURL(img.url);

  allImages.value.splice(index, 1);

  ensurePrimary();

  reorderImages();

  emitImages();
};

const ensurePrimary = () => {
  if (!allImages.value.length) return;

  let found = false;

  allImages.value.forEach((img, i) => {
    if (img.is_primary && !found) {
      found = true;
    } else {
      img.is_primary = false;
    }
  });

  if (!found && allImages.value[0]) {
    allImages.value[0].is_primary = true;
  }
};

const reorderImages = () => {
  allImages.value.sort((a, b) => a.order - b.order);
};

const emitImages = () => {
  emit(
    "update:modelValue",
    allImages.value.map((img, index) => ({
      id: img.id,
      img_path: img.file ?? img.url,
      is_primary: img.is_primary,
      order: img.order,
      isNew: img.isNew,
    }))
  );
};

// Computed Properties
const hasError = computed(() => props.errors?.[props.name]?.length);

const capitalName = computed(() => toCapitalizedWords(props.name));

// Watchers
watch(
  () => props.initialImages,
  (newVal) => {
    allImages.value = (newVal || []).map((img, index) => ({
      id: img.id,
      url: img.img_path,
      is_primary: img.is_primary === 1,
      order: img.order,
      isNew: false,
    }));

    ensurePrimary();

    reorderImages();
  },
  { immediate: true }
);
</script>
