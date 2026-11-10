import type { FC } from "react";
import type {
    ComboboxDefaultOptionType,
    ComboboxOptions,
} from "~/global/components/form-controls/combobox-input/combobox-types";
import { CheckIcon } from "~/global/components/icons";
import { cn } from "~/global/utils/cn";

export const ComboboxDefaultOption: FC<
    ComboboxOptions<ComboboxDefaultOptionType>
> = ({ option, selected }) => {
    return (
        <div className={"flex items-center gap-2"}>
            <CheckIcon
                className={cn("size-6 opacity-0", { "opacity-100": selected })}
            />
            <p>{option.label}</p>
        </div>
    );
};
