import type { FC } from "react";
import { ChipsButton } from "~/global/components/button";
import type {
    ComboboxTriggerType,
    ComboboxUserOptionType,
} from "~/global/components/form-controls/combobox-input/combobox-types";
import { ComboboxMultiselectWrapperTrigger } from "~/global/components/form-controls/combobox-input/options/combobox-mult-select-wrapper";

export const ComboboxUserMultiselectTrigger: FC<ComboboxTriggerType> = (
    props
) => {
    return (
        <ComboboxMultiselectWrapperTrigger<ComboboxUserOptionType> {...props}>
            {(user, removeOption) => (
                <ChipsButton
                    key={String(user.value)}
                    onClick={() => removeOption(user)}
                >
                    <ChipsButton.Image
                        src={user.avatar ?? ""}
                        alt={`${user.label} avatar`}
                        fallBack={user.label}
                    />
                    <ChipsButton.Label
                        label={user.label}
                        className={"max-w-16 truncate"}
                    />
                </ChipsButton>
            )}
        </ComboboxMultiselectWrapperTrigger>
    );
};
