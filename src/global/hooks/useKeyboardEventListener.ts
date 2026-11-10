import { type RefObject, useEffect, useRef } from "react";

/**
 * Available modifier keys that can be used with keyboard shortcuts
 */
export type ModifierKey = "ctrl" | "alt" | "shift" | "meta";

/**
 * Configuration options for keyboard event listener
 */
type KeyboardListenerOptions = {
    /** Callback function to execute when keyboard shortcut is triggered */
    callback: (event: KeyboardEvent) => void;
    /**
     * Single key or array of keys that trigger the callback.
     * Keys are case-insensitive - both uppercase and lowercase are supported.
     */
    keys: string | string[];
    /** Array of modifier keys (ctrl, alt, shift, meta) required to be pressed */
    modifiers?: ModifierKey[];
    /** Whether to prevent default browser behavior */
    preventDefault?: boolean;
    /** Optional element ref to attach listener to instead of the window */
    ref?: RefObject<HTMLElement>;
    /** Whether to stop event propagation */
    stopPropagation?: boolean;
};

/**
 * React hook for handling keyboard shortcuts
 * Keys are matched case-insensitively, so 'a' will match both 'a' and 'A'.
 *
 * @example
 * ```tsx
 * useKeyboardListener({
 *   callback: () => console.log('Shortcut triggered'),
 *   keys: ['1', 'a', 'Escape'],  // Works with any case - 'a' will match both 'a' and 'A'
 *   modifiers: ['meta'],
 *   preventDefault: true
 * });
 * ```
 */
export const useKeyboardListener = ({
    keys,
    callback,
    ref,
    modifiers = [],
    preventDefault = false,
    stopPropagation = false,
}: KeyboardListenerOptions): void => {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        // Convert all keys to lowercase for case-insensitive comparison
        const keyArray = (Array.isArray(keys) ? keys : [keys]).map((key) =>
            key.toLowerCase()
        );
        const abortController = new AbortController();

        // Get the target element (either from ref or default to window)
        const target = ref?.current || window;

        const handleKeyDown = (event: KeyboardEvent) => {
            // Convert an event key to lowercase for case-insensitive comparison
            const eventKey = event.key.toLowerCase();
            if (!keyArray.includes(eventKey)) {
                return;
            }

            const modifierChecks = {
                alt: event.altKey,
                ctrl: event.ctrlKey,
                meta: event.metaKey,
                shift: event.shiftKey,
            };

            // 💡 If any required modifier is not pressed, return early

            for (const mod of modifiers) {
                if (!modifierChecks[mod]) {
                    return;
                }
            }

            const allModifiers: ModifierKey[] = [
                "ctrl",
                "alt",
                "shift",
                "meta",
            ];

            // 💡 Check that no other modifiers are pressed if they're not in the required list
            for (const mod of allModifiers) {
                if (!modifiers.includes(mod) && modifierChecks[mod]) {
                    return;
                }
            }

            if (preventDefault) {
                event.preventDefault();
            }

            if (stopPropagation) {
                event.stopPropagation();
            }

            callbackRef.current(event);
        };

        target.addEventListener("keydown", handleKeyDown as EventListener, {
            signal: abortController.signal,
        });

        return () => {
            abortController.abort();
        };
    }, [keys, ref, modifiers, preventDefault, stopPropagation]);
};
