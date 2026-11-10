import type { FC } from "react";
import { ChipsButton } from "~/global/components/button";
import type { ComboboxTriggerType } from "~/global/components/form-controls/combobox-input/combobox-types";
import { ComboboxMultiselectWrapperTrigger } from "~/global/components/form-controls/combobox-input/options/combobox-mult-select-wrapper";

export const ComboboxDefaultMultiselectTrigger: FC<ComboboxTriggerType> = (
    props
) => {
    return (
        <ComboboxMultiselectWrapperTrigger {...props}>
            {(option, removeOption) => (
                <ChipsButton
                    key={String(option.value)}
                    onClick={() => removeOption(option)}
                >
                    <ChipsButton.Label
                        label={option.label}
                        className={"max-w-16 truncate"}
                    />
                </ChipsButton>
            )}
        </ComboboxMultiselectWrapperTrigger>
    );
};
