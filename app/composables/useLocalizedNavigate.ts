import type { RouteLocationRaw } from "vue-router";
import { useLocalePath, navigateTo as _navigateTo } from "#imports";
import { useI18n } from "vue-i18n";

export function useLocalizedNavigate() {
  const { locale } = useI18n();
  const localePath = useLocalePath();

  type NavigateTo = string | { name: string; [key: string]: any };

  function navigate(to: NavigateTo, params?: Record<string, any>) {
    let route: RouteLocationRaw;

    if (typeof to === "string") {
      const localizedName = `${to}___${locale.value}`;
      route = params
        ? { name: localizedName, params }
        : { name: localizedName };
    } else if (typeof to === "object" && "name" in to) {
      const hasLocaleSuffix = to.name.includes("___");
      const localizedName = hasLocaleSuffix
        ? to.name
        : `${to.name}___${locale.value}`;
      route = { ...to, name: localizedName, ...(params ? { params } : {}) };
    } else {
      throw new Error("Invalid navigate argument");
    }

    return _navigateTo(route);
  }

  return { navigate };
}
