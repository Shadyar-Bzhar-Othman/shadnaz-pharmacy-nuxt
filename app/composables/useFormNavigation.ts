import { nextTick } from "vue";

interface HandleEnterOptions {
  allowNewLine?: boolean;
  isDropdownOpen?: boolean;
  onEnter?: (event: KeyboardEvent) => boolean | void;
}

/**
 * Composable for consistent form navigation across all form components
 * Handles Enter key navigation between form fields
 */
export function useFormNavigation() {
  /**
   * Move to the next focusable input in the form
   * @param currentElement - The current form element
   */
  const moveToNextInput = async (currentElement: HTMLElement) => {
    await nextTick();

    const form = currentElement.closest("form");
    if (!form) return;

    const focusableSelectors = [
      'input:not([disabled]):not([type="hidden"])',
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex="0"]:not([disabled])',
      'button[type="submit"]:not([disabled])',
    ].join(", ");

    const focusableElements = Array.from(
      form.querySelectorAll<HTMLElement>(focusableSelectors)
    );

    const visibleElements = focusableElements.filter((element) => {
      const style = window.getComputedStyle(element);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        element.offsetParent !== null
      );
    });

    const currentIndex = visibleElements.indexOf(currentElement);

    if (currentIndex === -1) {
      const closestMatch = visibleElements.find(
        (el) => currentElement.contains(el) || el.contains(currentElement)
      );
      if (closestMatch) {
        const closestIndex = visibleElements.indexOf(closestMatch);
        const nextElement = visibleElements[closestIndex + 1];
        if (nextElement) {
          nextElement.focus();
          return;
        }
      }
    }

    const nextElement = visibleElements[currentIndex + 1];

    if (nextElement) {
      nextElement.focus();
    } else {
      const submitButton =
        form.querySelector<HTMLButtonElement>('button[type="submit"]') ||
        form.querySelector<HTMLButtonElement>(
          'button:not([type="button"]):not([type="reset"])'
        );

      if (submitButton) {
        submitButton.click();
      } else {
        form.dispatchEvent(
          new Event("submit", {
            bubbles: true,
            cancelable: true,
          })
        );
      }
    }
  };

  /**
   * Handle Enter key press for form navigation
   * @param event - The keyboard event
   * @param options - Configuration options
   */
  const handleEnterKey = (
    event: KeyboardEvent,
    options: HandleEnterOptions = {}
  ) => {
    const {
      allowNewLine = false,
      isDropdownOpen = false,
      onEnter = null,
    } = options;

    if (isDropdownOpen) return;

    if (
      allowNewLine &&
      event.target instanceof HTMLTextAreaElement &&
      event.shiftKey
    ) {
      return;
    }

    if (onEnter && typeof onEnter === "function") {
      const shouldContinue = onEnter(event);
      if (shouldContinue === false) return;
    }

    event.preventDefault();
    if (event.target instanceof HTMLElement) {
      moveToNextInput(event.target);
    }
  };

  return {
    moveToNextInput,
    handleEnterKey,
  };
}
