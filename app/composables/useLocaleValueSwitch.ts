import { useI18n } from "vue-i18n";

export function useLocaleValueSwitch() {
  const { locale } = useI18n();

  const globalLocale = useState<"ckb" | "en" | "ar">(
    "globalLocale",
    () => locale.value
  );

  function switchLocale(locale: "ckb" | "en" | "ar") {
    globalLocale.value = locale;
  }

  return { globalLocale, switchLocale };
}
