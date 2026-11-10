import type { ReactNode } from "react";
import ComboboxEmpty from "~/global/components/combobox/combobox-empty";
import ComboboxFooter from "~/global/components/combobox/combobox-footer";
import ComboboxHeader from "~/global/components/combobox/combobox-header";
import ComboboxList from "~/global/components/combobox/combobox-list";
import { ComboboxListItem } from "~/global/components/combobox/combobox-list-item";
import ComboboxLoading from "~/global/components/combobox/combobox-loading";
import {
    type ResetTrigger,
    useComboboxOptionManagement,
} from "~/global/components/combobox/combobox-option-selection-management";
import { ComboboxPanel } from "~/global/components/combobox/combobox-panel";
import { ComboboxContext } from "~/global/components/combobox/combobox-provider";
import type { ComboboxSelectOptionType } from "~/global/components/form-controls/combobox-input/combobox-types";
import Popover from "~/global/components/popover";

export type ResetOn = string | number | boolean;

interface ComboboxProps<T extends ComboboxSelectOptionType> {
    children: ReactNode;
    multiple?: boolean;
    loading?: boolean;
    defaultValue?: T[];
    onChange?: (value: T[]) => void;
    resetTrigger?: ResetTrigger;
}

export const Combobox = <T extends ComboboxSelectOptionType>({
    children,
    onChange,
    multiple,
    defaultValue = [],
    loading,
    resetTrigger,
}: ComboboxProps<T>) => {
    const {
        close,
        handleOptionSelect,
        handleOptionsSelectionComplete,
        isOpen,
        isOptionSelected,
        removeOption,
        selectedOptions,
        setIsOpen,
    } = useComboboxOptionManagement({
        defaultValue,
        multiple,
        onChange,
        resetTrigger,
    });

    return (
        <ComboboxContext.Provider
            value={{
                close,
                handleOptionSelect,
                handleOptionsSelectionComplete,
                isOptionSelected,
                loading,
                multiple,
                removeOption,
                selectedOptions,
            }}
        >
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                {children}
            </Popover>
        </ComboboxContext.Provider>
    );
};

Combobox.Trigger = Popover.Trigger;
Combobox.Item = ComboboxListItem;
Combobox.Lists = ComboboxList;
Combobox.Panel = ComboboxPanel;
Combobox.Empty = ComboboxEmpty;
Combobox.Header = ComboboxHeader;
Combobox.Loading = ComboboxLoading;
Combobox.Footer = ComboboxFooter;
