<template>
  <div
    class="w-full lg:min-w-[200px] text-black relative my-2 space-y-1"
    :class="isRtl ? 'text-right' : 'text-left'"
  >
    <label :for="name" class="text-sm font-[400] px-1 flex">
      <span>{{ tname != "" ? tname : capitalName }}</span>
      <Icon
        v-if="required"
        name="mdi:required"
        class="text-destructive-500 size-3"
      />
    </label>

    <label
      :for="name"
      :class="[
        'transition duration-300 w-full bg-white text-black placeholder:text-neutral-300 text-sm font-light px-4 py-2 my-1 flex justify-between items-center rounded-lg border border-neutral-200 outline-none focus:border-primary-500 cursor-pointer',
        hasError ? 'error' : '',
      ]"
      tabindex="0"
      @keydown.enter="handleEnterKeyPress"
    >
      <span>{{ fileName ? fileName : $t("clickToUpload") }}</span>
      <Icon name="tdesign:attach" class="text-xl text-black" />
    </label>

    <!-- Hidden Input -->
    <input
      type="file"
      :id="name"
      :accept="acceptedFileTypes"
      :disabled="disabled"
      class="hidden"
      @change="handleFileChange"
    />

    <!-- Loading Indicator -->
    <!-- <ProgressBar v-if="isLoading" /> -->

    <!-- Preview Section -->
    <div v-if="filePreview || (old && !filePreview)" class="mt-2">
      <img
        v-if="isImage && filePreview"
        :src="filePreview"
        class="w-full h-44 object-contain rounded-md"
      />
      <img
        v-if="isImage && old && !filePreview"
        :src="old"
        class="w-full h-44 object-contain rounded-md"
      />
      <video
        v-if="isVideo"
        :src="filePreview"
        controls
        class="w-full h-44 rounded-md"
      ></video>
      <a
        v-if="isFile"
        :href="filePreview"
        target="_blank"
        class="text-primary-500 underline"
        >{{ $t("viewFile") }}</a
      >
    </div>

    <!-- Errors -->
    <ul
      v-if="hasError"
      class="flex justify-start items-start flex-col text-xs text-destructive-500 gap-1 mt-0.5 ml-2"
    >
      <li v-for="message in errors[name]" :key="message">
        {{ message }}
      </li>
    </ul>
  </div>
</template>

<script setup>
// Imports
import { toCapitalizedWords, useIsRtl } from "@/helpers/functions";

// Rtl
const isRtl = useIsRtl();

// Locale
const { locale } = useI18n();

// Hooks
const { error } = useToast();
const { handleEnterKey } = useFormNavigation();

// Props
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [File, String, Object, null],
    default: null,
  },
  old: {
    type: String,
    default: null,
  },
  tname: {
    type: String,
    required: false,
    default: "",
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
  required: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  fileType: {
    type: String,
    default: "image", // can be "image", "video", or "file"
  },
});

// Emits
const emit = defineEmits(["update:modelValue"]);

// States
const fileName = ref("");
const filePreview = ref("");
const isLoading = ref(false);

// Computed Properties
const hasError = computed(
  () => props.errors && props.errors[props.name]?.length
);

const capitalName = computed(() => toCapitalizedWords(props.name));

const acceptedFileTypes = computed(() => {
  switch (props.fileType) {
    case "video":
      return "video/*";
    case "file":
      return "*/*";
    default:
      return "image/jpeg, image/png, image/jpg";
  }
});

const isImage = computed(() => props.fileType === "image");
const isVideo = computed(() => props.fileType === "video");
const isFile = computed(() => props.fileType === "file");

// Handle change event for file input
const handleFileChange = (event) => {
  const file = event.target.files[0];

  if (!file) {
    emit("update:modelValue", null);
    fileName.value = "";
    filePreview.value = "";
    return;
  }

  // Validate file type based on props.fileType
  if (props.fileType === "image" && !file.type.startsWith("image/")) {
    error("Wrong file format!, Please upload a valid image file");
    event.target.value = "";
    emit("update:modelValue", null);
    return;
  }

  if (props.fileType === "video") {
    if (!file.type.startsWith("video/")) {
      error("Wrong file format!, Please upload a valid video file");
      event.target.value = "";
      emit("update:modelValue", null);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      // 2MB size limit
      error("File too large!, Please upload a video file smaller than 2MB");
      event.target.value = "";
      emit("update:modelValue", null);
      return;
    }
  }

  if (props.fileType === "file" && file.type !== "application/pdf") {
    error("Wrong file format!, Please upload a valid PDF file");
    event.target.value = "";
    emit("update:modelValue", null);
    return;
  }

  isLoading.value = true;
  fileName.value = file.name;

  const reader = new FileReader();
  reader.onload = (e) => {
    filePreview.value = e.target.result;
    isLoading.value = false;
  };

  if (props.fileType === "file") {
    filePreview.value = URL.createObjectURL(file);
    isLoading.value = false;
  } else {
    reader.readAsDataURL(file);
  }

  emit("update:modelValue", file);
};

// Watchers
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      fileName.value = "";
      filePreview.value = "";
      return;
    }
    if (newVal instanceof File) {
      fileName.value = newVal.name;
      if (props.fileType === "file") {
        filePreview.value = URL.createObjectURL(newVal);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          filePreview.value = e.target.result;
        };
        reader.readAsDataURL(newVal);
      }
    } else if (typeof newVal === "string") {
      fileName.value = newVal.split("/").pop();
      filePreview.value = newVal;
    }
  },
  { immediate: true }
);

const handleEnterKeyPress = (event) => {
  handleEnterKey(event, {
    isFileField: true,
  });
};
</script>

<style scoped>
.error {
  border-color: #ef4444;
}

input[type="file"]::file-selector-button {
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.16);
  box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.05);
  margin-right: 8px;
  transition: background-color 200ms;
}

input[type="file"]::file-selector-button:hover {
  background-color: #f3f4f6;
}

input[type="file"]::file-selector-button:active {
  background-color: #e5e7eb;
}
</style>
