import type { FC } from "react";
import type {
    ComboboxDefaultOptionType,
    ComboboxOptions,
    ComboboxSelectOptionType,
    ComboboxTriggerType,
    ComboboxUserOptionType,
} from "~/global/components/form-controls/combobox-input/combobox-types";
import {
    ComboboxDefaultOption,
    ComboboxDefaultTrigger,
} from "~/global/components/form-controls/combobox-input/options/default";
import { ComboboxDefaultMultiselectTrigger } from "~/global/components/form-controls/combobox-input/options/default/combobox-default-multiselect-trigger";
import { ComboboxUserOption } from "~/global/components/form-controls/combobox-input/options/user";
import { ComboboxUserMultiselectTrigger } from "~/global/components/form-controls/combobox-input/options/user/combobox-user-multiselect-trigger";

export type ComboboxType = "default" | "user";

export type ComboboxTypeToOptionType<T extends ComboboxType> = T extends "user"
    ? ComboboxUserOptionType
    : T extends "default"
      ? ComboboxDefaultOptionType
      : never;

type ComboboxOptionPair<T extends ComboboxSelectOptionType> = {
    loader?: FC;
    multiselectTrigger: FC<ComboboxTriggerType>;
    selectOption: FC<ComboboxOptions<T>>;
    trigger: FC<ComboboxTriggerType>;
};

export const comboboxInputOptionTypeMap: {
    [K in ComboboxType]: ComboboxOptionPair<ComboboxTypeToOptionType<K>>;
} = {
    default: {
        multiselectTrigger: ComboboxDefaultMultiselectTrigger,
        selectOption: ComboboxDefaultOption,
        trigger: ComboboxDefaultTrigger,
    },
    user: {
        multiselectTrigger: ComboboxUserMultiselectTrigger,
        selectOption: ComboboxUserOption,
        trigger: ComboboxDefaultTrigger, // Todo: Implement User trigger
    },
};
