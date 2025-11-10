<template>
  <div
    class="w-full text-text relative my-2 space-y-2"
    :class="isRtl ? 'text-right' : 'text-left'"
  >
    <!-- Label -->
    <label :for="name" class="text-sm font-normal px-1 flex items-center gap-1">
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
      :accept="acceptedFileTypes"
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

    <!-- Image Preview -->
    <div
      v-if="filePreview || old"
      class="relative w-full h-full xs:w-48 xs:h-48 mt-2 group m-auto"
    >
      <img
        :src="filePreview || old"
        alt="Image Preview"
        class="w-full h-full object-cover rounded-lg"
      />

      <div
        v-if="filePreview"
        class="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"
      >
        <Icon
          name="zondicons:close-solid"
          class="text-light size-5 cursor-pointer hover:text-destructive-400"
          @click.stop="removeImage"
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

<script setup>
// Imports
import { useIsRtl, toCapitalizedWords } from "@/helpers/functions";
import { useI18n } from "vue-i18n";
import { useToast } from "@/composables/useToast";
import { useFormNavigation } from "@/composables/useFormNavigation";

// RTL
const isRtl = useIsRtl();

// Locale
const { locale } = useI18n();

// Toast + keyboard navigation
const { error } = useToast();
const { handleEnterKey } = useFormNavigation();

// Props
const props = defineProps({
  name: { type: String, required: true },
  modelValue: { type: [File, String, Object, null], default: null },
  old: { type: String, default: null },
  tname: { type: String, default: "" },
  errors: { type: Object, default: () => ({}) },
  required: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
});

// Emits
const emit = defineEmits(["update:modelValue"]);

// State
const fileInput = ref(null);
const filePreview = ref("");
const isDragging = ref(false);

// Computed
const capitalName = computed(() => toCapitalizedWords(props.name));
const hasError = computed(() => props.errors?.[props.name]?.length);
const acceptedFileTypes = computed(() => "image/jpeg, image/png, image/jpg");

// Open file dialog
const openFileDialog = () => fileInput.value?.click();

// Handle file change
const handleFileChange = (event) => {
  const file = event.target.files?.[0];
  if (!file) return clearFile();

  if (!file.type.startsWith("image/")) {
    error("Wrong file format! Please upload an image file");
    return clearFile();
  }

  if (file.size > 10 * 1024 * 1024) {
    error("File too large! Max 10MB");
    return clearFile();
  }

  const reader = new FileReader();
  reader.onload = (e) => (filePreview.value = e.target.result);
  reader.readAsDataURL(file);

  emit("update:modelValue", file);
};

// Handle drag/drop
const handleDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) handleFileChange({ target: { files: [file] } });
};

// Remove image
const removeImage = () => {
  filePreview.value = "";
  emit("update:modelValue", null);
};

// Reset file
const clearFile = () => {
  fileInput.value.value = "";
  filePreview.value = "";
  emit("update:modelValue", null);
};

// Watch modelValue
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return (filePreview.value = "");
    if (newVal instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => (filePreview.value = e.target.result);
      reader.readAsDataURL(newVal);
    } else if (typeof newVal === "string") {
      filePreview.value = newVal;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.error {
  border-color: #ef4444;
}
</style>
