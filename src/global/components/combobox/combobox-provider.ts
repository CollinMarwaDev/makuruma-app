import { createContext, useContext } from "react";
import type { ComboboxSelectOptionType } from "~/global/components/form-controls/combobox-input/combobox-types";

interface ComboboxContextType<T extends ComboboxSelectOptionType> {
    /** Closes the combobox. */
    close: VoidFunction;

    /**
     * Handles option selection, toggling for multi-select or overwriting otherwise.
     * @param value - JSON stringified representation of the option to parse as `T`.
     */
    handleOptionSelect: (value: string) => void;

    /** Submits the combobox selection. */
    handleOptionsSelectionComplete: VoidFunction;

    /** Indicates loading state. */
    loading?: boolean;

    /** Enables multi-select mode. */
    multiple?: boolean;

    /**
     * Removes a selected option.
     * @param option - The option to remove.
     */
    removeOption: (option: T) => void;
    /** Currently selected options. */
    selectedOptions: T[];
    /**
     * Checks if an option is selected.
     * @param option - The option to verify.
     * @returns True if selected, otherwise false.
     */
    isOptionSelected: (option: T) => boolean;
}

// @ts-expect-error TS2314: Generic type ComboboxContextType<T> requires 1 type argument(s).
export const ComboboxContext = createContext<ComboboxContextType | null>(null);

/**
 * A custom hook that provides access to the Combobox context.
 * Utilizes the React Context API to retrieve and return the current Combobox context value,
 * ensuring it is only accessible within a ComboboxProvider.
 *
 * @template T - A generic type parameter extending `ComboboxSelectOptionType`.
 * @throws {Error} Throws an error if the hook is used outside a `ComboboxProvider`.
 * @returns {ComboboxContextType<T>} The current Combobox context value.
 */
export const useComboboxContext = <
    T extends ComboboxSelectOptionType,
>(): ComboboxContextType<T> => {
    const context = useContext(ComboboxContext);
    if (!context) {
        throw new Error("useCombobox must be used within a ComboboxProvider");
    }
    return context;
};
