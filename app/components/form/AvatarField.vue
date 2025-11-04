<template>
  <div
    class="text-text relative my-2 space-y-1 m-auto"
    :class="isRtl ? 'text-right' : 'text-left'"
  >
    <label
      :for="name"
      class="flex flex-col items-center justify-center cursor-pointer select-none"
      tabindex="0"
      @keydown.enter="handleEnterKeyPress"
    >
      <div
        class="relative w-[125px] h-[125px] rounded-full flex items-center justify-center overflow-hidden bg-field hover:bg-field-hover text-text-secondary placeholder:text-text-field border border-border outline-none focus:border-primary hover:focus:border-primary transition duration-300"
        :class="[
          hasError ? 'error' : '',
          disabled ? 'opacity-50 pointer-events-none' : '',
        ]"
      >
        <img
          v-if="filePreview"
          :src="filePreview"
          alt="avatar preview"
          class="w-full h-full object-cover"
        />
        <img
          v-else-if="old && !filePreview"
          :src="old"
          alt="avatar preview"
          class="w-full h-full object-cover"
        />
        <Icon
          v-else
          name="mage:image-fill"
          class="text-text-field w-full h-full p-2 m-3"
        />
      </div>
    </label>

    <input
      type="file"
      :id="name"
      :accept="acceptedFileTypes"
      :disabled="disabled"
      class="hidden"
      @change="handleFileChange"
    />

    <!-- Errors -->
    <ul
      v-if="hasError"
      class="flex justify-start items-start flex-col text-xxs text-destructive-500 gap-1 ml-2"
    >
      <li v-for="message in errors[name]" :key="message">
        {{ message }}
      </li>
    </ul>
  </div>
</template>

<script setup>
// Imports
import { useIsRtl } from "@/helpers/functions";

// Rtl
const isRtl = useIsRtl();

// Locale
const { locale } = useI18n();

const currentLocale = locale.value;

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

const acceptedFileTypes = computed(() => "image/jpeg, image/png, image/jpg");

// Functions
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) {
    emit("update:modelValue", null);

    fileName.value = "";
    filePreview.value = "";

    return;
  }
  if (!file.type.startsWith("image/")) {
    error("Wrong file format!, Please upload a valid image file");

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

  reader.readAsDataURL(file);

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

      const reader = new FileReader();

      reader.onload = (e) => {
        filePreview.value = e.target.result;
      };

      reader.readAsDataURL(newVal);
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
</style>
