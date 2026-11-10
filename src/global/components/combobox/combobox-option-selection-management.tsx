import { useCallback, useEffect, useRef, useState } from "react";
import type { ComboboxSelectOptionType } from "~/global/components/form-controls/combobox-input/combobox-types";

export type ResetTrigger = string | number | boolean;

interface UseComboboxOptionManagement<T extends ComboboxSelectOptionType> {
    defaultValue: T[];
    multiple?: boolean;
    onChange?: (value: T[]) => void;
    resetTrigger?: ResetTrigger;
}

const haveSameOptionValues = <T extends ComboboxSelectOptionType>(
    firstOptions: T[],
    secondOptions: T[]
) =>
    firstOptions.length === secondOptions.length &&
    firstOptions.every(
        (option, index) =>
            option.value === secondOptions[index]?.value &&
            option.label === secondOptions[index]?.label
    );

/** Preserves defaults and follows form resets without reacting to result-page changes. */
export const useComboboxOptionManagement = <
    T extends ComboboxSelectOptionType,
>({
    defaultValue,
    multiple,
    onChange,
    resetTrigger,
}: UseComboboxOptionManagement<T>) => {
    const [selectedOptions, setSelectedOptions] = useState<T[]>(defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    const previous = useRef({
        defaultValue,
        multiple: !!multiple,
        resetTrigger,
    });

    const removeOption = (option: T) => {
        const nextOptions = selectedOptions.filter(
            (item) => item.value !== option.value
        );
        setSelectedOptions(nextOptions);
        onChange?.(nextOptions);
    };

    const close = () => setIsOpen(false);

    const handleOptionsSelectionComplete = () => {
        onChange?.(selectedOptions);
        close();
    };

    const toggleOption = (option: T) => {
        const isSelected = selectedOptions.some(
            ({ value }) => option.value === value
        );
        const nextOptions = isSelected
            ? selectedOptions.filter(({ value }) => value !== option.value)
            : [...selectedOptions, option];
        setSelectedOptions(nextOptions);
        onChange?.(nextOptions);
    };

    useEffect(() => {
        if (previous.current.multiple !== !!multiple) {
            setSelectedOptions([]);
            onChange?.([]);
        } else if (
            previous.current.resetTrigger !== resetTrigger ||
            !haveSameOptionValues(previous.current.defaultValue, defaultValue)
        ) {
            setSelectedOptions(defaultValue);
        }
        previous.current = { defaultValue, multiple: !!multiple, resetTrigger };
    }, [defaultValue, multiple, onChange, resetTrigger]);

    const isOptionSelected = useCallback(
        (option: T) => {
            return selectedOptions?.some((selectedOption) => {
                return selectedOption.value === option.value;
            });
        },
        [selectedOptions]
    );

    const handleOptionSelect = (value: string) => {
        const currentSelectedOption = JSON.parse(value) as T;
        if (multiple) {
            return toggleOption(currentSelectedOption);
        }
        const nextOptions = [currentSelectedOption];
        setSelectedOptions(nextOptions);
        onChange?.(nextOptions);
    };

    return {
        close,
        handleOptionSelect,
        handleOptionsSelectionComplete,
        isOpen,
        isOptionSelected,
        removeOption,
        selectedOptions,
        setIsOpen,
    };
};
