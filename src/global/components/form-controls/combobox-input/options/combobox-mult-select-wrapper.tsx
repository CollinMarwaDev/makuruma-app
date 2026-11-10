import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Fragment, type JSX } from "react";
import { useComboboxContext } from "~/global/components/combobox/combobox-provider";
import type {
    ComboboxOptions,
    ComboboxSelectOptionType,
    ComboboxTriggerType,
} from "~/global/components/form-controls/combobox-input/combobox-types";
import ComboboxTriggerContainer from "~/global/components/form-controls/combobox-input/options/combobox-trigger-container";
import { cn } from "~/global/utils/cn";

interface ComboboxMultiselectWrapperTriggerProps<
    T extends ComboboxSelectOptionType = ComboboxSelectOptionType,
> extends ComboboxTriggerType {
    children: (
        props: ComboboxOptions<T>["option"],
        onClick: (option: ComboboxOptions<T>["option"]) => void
    ) => JSX.Element;
}

export const ComboboxMultiselectWrapperTrigger = <
    T extends ComboboxSelectOptionType = ComboboxSelectOptionType,
>({
    children,
    placeholder,
    ...rest
}: ComboboxMultiselectWrapperTriggerProps<T>) => {
    const { selectedOptions, removeOption } = useComboboxContext<T>();
    const moreItems = selectedOptions.length - 2;
    const hasOptions = selectedOptions.length > 0;

    return (
        <ComboboxTriggerContainer
            {...rest}
            triggerClassName={cn("text-left items-between p-2 lg:py-2.5", {
                "lg:py-2": hasOptions,
            })}
        >
            <div className="flex items-center gap-2">
                {hasOptions ? (
                    selectedOptions
                        .slice(0, 2)
                        .map((option) => (
                            <Fragment key={String(option.value)}>
                                {children(option, () => removeOption(option))}
                            </Fragment>
                        ))
                ) : (
                    <p className="text-neutral-550 text-sm font-light">
                        {placeholder}
                    </p>
                )}
            </div>

            <div className={"flex items-center gap-2"}>
                {moreItems >= 1 && (
                    <p className={"text-primary space-x-1 text-sm"}>
                        <span className={"font-medium"}>+{moreItems}</span>
                        <span>more </span>
                    </p>
                )}
                <ChevronDownIcon
                    strokeWidth={2}
                    className={"size-5 text-gray-500"}
                />
            </div>
        </ComboboxTriggerContainer>
    );
};
