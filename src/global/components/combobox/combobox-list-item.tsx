import { Command, Command as CommandPrimitive } from "cmdk";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useComboboxContext } from "~/global/components/combobox/combobox-provider";
import type { ComboboxSelectOptionType } from "~/global/components/form-controls/combobox-input/combobox-types";
import { cn } from "~/global/utils/cn";

interface Props<T extends ComboboxSelectOptionType>
    extends Omit<
        ComponentPropsWithoutRef<typeof CommandPrimitive.Item>,
        "children" | "value"
    > {
    value: T;
    children: (selected: boolean) => ReactNode;
}

export const ComboboxListItem = <T extends ComboboxSelectOptionType>({
    children,
    value,
    ...rest
}: Props<T>) => {
    const {
        multiple,
        handleOptionSelect,
        isOptionSelected,
        close: handleClose,
    } = useComboboxContext();

    const selected = isOptionSelected(value);

    const handleItemsSelect = (value: string) => {
        handleOptionSelect(value);
        if (!multiple) handleClose();
    };

    return (
        <Command.Item
            {...rest}
            value={JSON.stringify(value)}
            keywords={[value.label]}
            className={cn(
                "data-[selected=true]:bg-primary-shades-50/80 mb-1",
                "flex cursor-pointer gap-2 rounded-lg px-3 py-2",
                "text-primary-950",
                {
                    "text-primary bg-primary-shades-50": selected,
                }
            )}
            onSelect={handleItemsSelect}
        >
            <div className={"flex-1"}>{children(selected)}</div>
        </Command.Item>
    );
};
