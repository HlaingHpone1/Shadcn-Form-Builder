import { useEffect, useRef } from "react";

interface KeyboardShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  // If true, requires either ctrlKey (Windows/Linux) or metaKey (Mac)
  ctrlOrCmd?: boolean;
  // If true, requires altKey (Windows/Linux) or optionKey (Mac) - they're the same key
  altOrOption?: boolean;
  action: (e: KeyboardEvent) => void;
  preventDefault?: boolean;
  condition?: (e: KeyboardEvent) => boolean;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcutConfig[];
  enabled?: boolean;
  scope?: "global" | "scoped";
  containerRef?: React.RefObject<HTMLElement>;
}

/**
 * Refined check to determine if user is typing in an input field
 * Checks for input, textarea, and contenteditable elements
 * Also checks for specific input types that should allow typing
 */
const isTypingInInput = (): boolean => {
  const activeElement = document.activeElement;
  if (!activeElement) return false;

  const tagName = activeElement.tagName.toLowerCase();
  const isInput = tagName === "input" || tagName === "textarea";
  const isContentEditable =
    activeElement.getAttribute("contenteditable") === "true";

  // If it's an input, check the type to be more specific
  if (isInput && activeElement instanceof HTMLInputElement) {
    const inputType = activeElement.type.toLowerCase();
    // Allow shortcuts for certain input types (like button, submit, etc.)
    const allowedTypes = ["button", "submit", "reset", "checkbox", "radio"];
    if (allowedTypes.includes(inputType)) {
      return false;
    }
  }

  return isInput || isContentEditable;
};

/**
 * Custom hook for managing keyboard shortcuts with map-based dispatch
 * Uses refs to avoid stale closures and re-binding event listeners
 */
export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
  scope = "global",
  containerRef,
}: UseKeyboardShortcutsOptions) {
  // Store handlers in refs to avoid stale closures
  const shortcutsRef = useRef(shortcuts);
  const enabledRef = useRef(enabled);

  // Update refs when props change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
    enabledRef.current = enabled;
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: Event) => {
      const keyEvent = e as KeyboardEvent;
      // Check if typing in input (skip shortcuts)
      if (isTypingInInput()) {
        // Allow Escape, ?, /, Ctrl/Cmd + Arrow keys, and Ctrl/Cmd + Alt shortcuts to work even in inputs
        // (Ctrl/Cmd + Arrow is for reordering, Ctrl/Cmd + Alt is for quick field creation)
        const allowedKeys = ["Escape", "?", "/"];
        const isCtrlOrCmdArrow =
          (keyEvent.ctrlKey || keyEvent.metaKey) &&
          (keyEvent.key === "ArrowUp" || keyEvent.key === "ArrowDown");
        const isCtrlOrCmdAlt =
          (keyEvent.ctrlKey || keyEvent.metaKey) && keyEvent.altKey;
        if (!allowedKeys.includes(keyEvent.key) && !isCtrlOrCmdArrow && !isCtrlOrCmdAlt) {
          return;
        }
      }

      // For scoped listeners, check if the container is focused
      if (scope === "scoped" && containerRef?.current) {
        const container = containerRef.current;
        if (!container.contains(document.activeElement)) {
          return;
        }
      }

      // Find matching shortcut using map-based dispatch
      const matchingShortcut = shortcutsRef.current.find((shortcut) => {
        // Key match
        const keyMatch =
          shortcut.key.toLowerCase() === keyEvent.key.toLowerCase() ||
          shortcut.key === keyEvent.key;

        // Handle Ctrl/Cmd (cross-platform)
        let ctrlOrCmdMatch = true;
        if (shortcut.ctrlOrCmd !== undefined) {
          // Require either ctrlKey (Windows/Linux) or metaKey (Mac)
          ctrlOrCmdMatch = keyEvent.ctrlKey || keyEvent.metaKey;
        } else {
          // If ctrlOrCmd is not specified, check individual modifiers
          // If neither ctrlKey nor metaKey is specified, require NO modifier
          if (
            shortcut.ctrlKey === undefined &&
            shortcut.metaKey === undefined
          ) {
            // No modifier specified means we want NO modifier pressed
            ctrlOrCmdMatch = !keyEvent.ctrlKey && !keyEvent.metaKey;
          } else {
            // Individual modifier checks
            const ctrlMatch =
              shortcut.ctrlKey === undefined
                ? true
                : shortcut.ctrlKey === keyEvent.ctrlKey;
            const metaMatch =
              shortcut.metaKey === undefined
                ? true
                : shortcut.metaKey === keyEvent.metaKey;
            ctrlOrCmdMatch = ctrlMatch && metaMatch;
          }
        }

        // Other modifier matches
        const shiftMatch =
          shortcut.shiftKey === undefined
            ? true
            : shortcut.shiftKey === keyEvent.shiftKey;
        
        // Handle Alt/Option (cross-platform - same key on both platforms)
        let altOrOptionMatch = true;
        if (shortcut.altOrOption !== undefined) {
          // Require altKey (same on both Windows/Linux and Mac - it's the Option key on Mac)
          altOrOptionMatch = keyEvent.altKey;
        } else {
          // Individual altKey check
          altOrOptionMatch =
            shortcut.altKey === undefined
              ? true
              : shortcut.altKey === keyEvent.altKey;
        }

        // Additional condition check
        const conditionMatch = shortcut.condition
          ? shortcut.condition(keyEvent)
          : true;

        return (
          keyMatch &&
          ctrlOrCmdMatch &&
          shiftMatch &&
          altOrOptionMatch &&
          conditionMatch
        );
      });

      if (matchingShortcut) {
        if (matchingShortcut.preventDefault !== false) {
          keyEvent.preventDefault();
        }
        matchingShortcut.action(keyEvent);
      }
    };

    const target =
      scope === "scoped" && containerRef?.current
        ? containerRef.current
        : window;

    target.addEventListener("keydown", handleKeyDown);
    return () => {
      target.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, scope, containerRef]);
}
