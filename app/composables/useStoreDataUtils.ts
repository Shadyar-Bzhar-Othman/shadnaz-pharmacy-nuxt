interface KeyValue<T = string | number | boolean> {
  key: T;
  value: string;
}

export const useStoreDataUtils = (
  t: ((key: string) => string) | null = null
) => {
  const roles: ComputedRef<KeyValue<number>[]> = computed(() => [
    { key: 1, value: t ? t("values.owner") : "Owner" },
    { key: 2, value: t ? t("values.admin") : "Admin" },
    { key: 3, value: t ? t("values.driver") : "Driver" },
    { key: 4, value: t ? t("values.customer") : "Customer" },
  ]);

  const genders: ComputedRef<KeyValue<number>[]> = computed(() => [
    { key: 1, value: t ? t("values.male") : "Male" },
    { key: 2, value: t ? t("values.female") : "Female" },
  ]);

  const actives: ComputedRef<KeyValue<boolean>[]> = computed(() => [
    { key: true, value: t ? t("values.active") : "Yes" },
    { key: false, value: t ? t("values.inactive") : "No" },
  ]);

  const langs: ComputedRef<KeyValue<string>[]> = computed(() => [
    { key: "en", value: t ? t("values.en") : "English" },
    { key: "ar", value: t ? t("values.ar") : "Arabic" },
    { key: "ckb", value: t ? t("values.ckb") : "Kurdish" },
  ]);

  /** Generic helper: get key by label */
  const getKeyByLabel = <T>(
    list: ComputedRef<KeyValue<T>[]>,
    label: string
  ): T | null => {
    const entry = list.value.find((item) => item.value === label);
    return entry ? entry.key : null;
  };

  /** Generic helper: get label by key */
  const getLabelByKey = <T>(
    list: ComputedRef<KeyValue<T>[]>,
    key: T
  ): string => {
    const entry = list.value.find((item) => item.key === key);
    return entry ? entry.value : "-";
  };

  // Roles
  const getRoleValue = (role: string) => getKeyByLabel(roles, role);
  const getRole = (role: number) => getLabelByKey(roles, role);

  // Genders
  const getGenderValue = (gender: string) => getKeyByLabel(genders, gender);
  const getGender = (gender: number) => getLabelByKey(genders, gender);

  // Actives
  const getActiveValue = (active: string) => getKeyByLabel(actives, active);
  const getActive = (active: boolean) => getLabelByKey(actives, active);

  // Roles
  const getLangValue = (lang: string) => getKeyByLabel(langs, lang);
  const getLang = (lang: string) => getLabelByKey(langs, lang);

  return {
    // Values
    roles,
    genders,
    actives,
    langs,

    // Functions
    getRoleValue,
    getRole,
    getGenderValue,
    getGender,
    getActiveValue,
    getActive,
    getLangValue,
    getLang,
  };
};
