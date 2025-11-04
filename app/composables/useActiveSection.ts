export function useActiveSection() {
  const activeSection = ref("");

  function initActiveSection(
    navSections: string[]
  ): IntersectionObserver | null {
    if (typeof window === "undefined") return null;

    const sections = document.querySelectorAll("[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection.value = entry.target.id;
          }
        });
      },
      {
        root: null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => {
      if (navSections.includes(section.id)) observer.observe(section);
    });

    const first = document.getElementById(navSections[0] || "");
    if (first) activeSection.value = navSections[0] ?? "";

    return observer;
  }

  return { activeSection, initActiveSection };
}
