<template>
  <client-only>
    <AppGlassBackground>
      <!-- Login Form -->
      <div
        class="w-full min-h-screen flex items-center justify-center relative"
      >
        <!-- Locale Switcher -->
        <div class="absolute top-4 end-4 z-10">
          <BaseAuthLocaleSwitcher />
        </div>

        <div class="w-full sm:max-w-lg px-6 py-12">
          <BaseForm class="p-4">
            <img
              src="@/assets/images/logo-bg.png"
              alt="Logo"
              class="w-16 mx-auto mb-2 rounded-xl"
            />

            <h1 class="text-2xl font-bold m-auto">{{ $t("welcome") }}</h1>

            <FormField
              v-model="store.form.email"
              type="email"
              name="email"
              :tname="$t('fields.email')"
              :required="true"
              :disabled="store.loading"
              :errors="store.errors"
            />

            <FormField
              v-model="store.form.password"
              type="password"
              name="password"
              :tname="$t('fields.password')"
              :required="true"
              :disabled="store.loading"
              :errors="store.errors"
            />

            <ButtonBase
              :text="$t('actions.login')"
              :loading="store.loading"
              :disabled="store.loading || !store.isFormFilled"
              class="w-full"
              @click="store.handleSubmit"
            />
          </BaseForm>
        </div>

        <!-- Info -->
        <div
          class="absolute bottom-4 z-10 w-full flex justify-between items-center text-sm text-light/80 px-6"
        >
          <span>
            {{ $t("software") }} &copy; {{ new Date().getFullYear() }}</span
          >

          <a
            href="mailto:shadyar@qaysari.co"
            target="_blank"
            class="flex items-center gap-1 text-light/80 hover:text-light transition-colors duration-300"
          >
            <Icon name="clarity:email-solid" class="size-4" />
            <span>shadyar@qaysari.co</span>
          </a>
        </div>
      </div>
    </AppGlassBackground>
  </client-only>
</template>

<script lang="ts" setup>
// Page Meta
definePageMeta({
  layout: "auth-layout",
  ssr: false,
  middleware: ["guest"],
});

// Stores
const store = useLoginStore();
</script>
