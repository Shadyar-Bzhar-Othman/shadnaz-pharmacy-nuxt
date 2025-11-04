const rtlLocales = ["ar", "ckb"];

export function useIsRtl() {
  const { locale } = useI18n();

  return computed(() => rtlLocales.includes(locale.value));
}

export const toCapitalizedWords = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char: string) => char.toUpperCase());
};

export function downloadBlob(data: Blob | unknown, filename = "download") {
  const blob =
    data instanceof Blob
      ? data
      : new Blob([data as any], { type: "application/octet-stream" });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = filename;

  document.body.appendChild(a);

  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
}
