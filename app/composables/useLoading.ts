export const useLoading = () => {
  const isLoading = useState("globalLoading", () => false);

  const setLoading = (value: boolean) => {
    isLoading.value = value;
  };

  const toggleLoading = () => {
    isLoading.value = !isLoading.value;
  };

  const startLoading = () => setLoading(true);

  const stopLoading = () => setLoading(false);

  return {
    isLoading,
    setLoading,
    toggleLoading,
    startLoading,
    stopLoading,
  };
};
