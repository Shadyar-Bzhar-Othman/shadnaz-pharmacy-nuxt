// composables/useApi.ts

export const useApi = () => {
  const { $api } = useNuxtApp();
  const api = $api as typeof $fetch;

  // Helper function that wraps useFetch with our custom $api
  const apiRequest = <T>(url: string, options: any = {}) => {
    return useFetch<T>(url, {
      $fetch: api,
      lazy: true, // Always use lazy by default
      ...options,
    });
  };

  // Convenience methods that return reactive data (for components)
  const get = <T>(url: string, options: any = {}) => {
    return apiRequest<T>(url, { method: "GET", ...options });
  };

  const post = <T>(url: string, body?: any, options: any = {}) => {
    return apiRequest<T>(url, { method: "POST", body, ...options });
  };

  const put = <T>(url: string, body?: any, options: any = {}) => {
    return apiRequest<T>(url, { method: "PUT", body, ...options });
  };

  const patch = <T>(url: string, body?: any, options: any = {}) => {
    return apiRequest<T>(url, { method: "PATCH", body, ...options });
  };

  const del = <T>(url: string, options: any = {}) => {
    return apiRequest<T>(url, { method: "DELETE", ...options });
  };

  // Direct data methods that only return data (for stores/composables)
  const getData = async <T>(url: string, options: any = {}): Promise<T> => {
    return await api<T>(url, { method: "GET", ...options });
  };

  const postData = async <T>(
    url: string,
    body?: any,
    options: any = {}
  ): Promise<T> => {
    return await api<T>(url, { method: "POST", body, ...options });
  };

  const putData = async <T>(
    url: string,
    body?: any,
    options: any = {}
  ): Promise<T> => {
    return await api<T>(url, { method: "PUT", body, ...options });
  };

  const patchData = async <T>(
    url: string,
    body?: any,
    options: any = {}
  ): Promise<T> => {
    return await api<T>(url, { method: "PATCH", body, ...options });
  };

  const deleteData = async <T>(url: string, options: any = {}): Promise<T> => {
    return await api<T>(url, { method: "DELETE", ...options });
  };

  return {
    // Reactive methods (for components)
    request: apiRequest,
    get,
    post,
    put,
    patch,
    delete: del,

    // Direct data methods (for stores/composables)
    getData,
    postData,
    putData,
    patchData,
    deleteData,

    // Direct access to the $api instance with proper typing
    $api: api,
  };
};
