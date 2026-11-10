import type { FC } from "react";
import { useComboboxContext } from "~/global/components/combobox/combobox-provider";
import type { ComboboxTriggerType } from "~/global/components/form-controls/combobox-input/combobox-types";
import ComboboxTriggerContainer from "~/global/components/form-controls/combobox-input/options/combobox-trigger-container";
import { TextInputWithPrefix } from "~/global/components/form-controls/text-input-fields/text-input-with-prefix";
import { ChevronUpDownIcon } from "~/global/components/icons";

export const ComboboxDefaultTrigger: FC<ComboboxTriggerType> = ({
    _prefix,
    placeholder = "Select option",
    ...rest
}) => {
    const { selectedOptions } = useComboboxContext();

    return (
        <ComboboxTriggerContainer {...rest} triggerClassName={"relative"}>
            <TextInputWithPrefix
                _prefix={_prefix}
                className="pointer-events-none border-0 bg-transparent"
                value={selectedOptions?.[0]?.label}
                placeholder={placeholder}
                readOnly
            />
            <ChevronUpDownIcon
                className={"absolute inset-y-0 right-2 my-auto opacity-50"}
            />
        </ComboboxTriggerContainer>
    );
};
