import type { IconType, LabelWithValue } from "~/global/types";

export type ComboboxSelectOptionType = LabelWithValue;

export type ComboboxDefaultOptionType = ComboboxSelectOptionType;

export type ComboboxUserOptionType = ComboboxSelectOptionType & {
    avatar?: string;
    email: string;
};

export type ComboboxOptions<
    T extends ComboboxSelectOptionType = ComboboxSelectOptionType,
> = {
    option: T;
    selected?: boolean;
};

export type ComboboxTriggerType = {
    _prefix?: IconType | string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
    containerClassName?: string;
    disabled?: boolean;
    errorMessage?: string;
    hasError?: boolean;
    /** Unique trigger id; generated when omitted. */
    id?: string;
    label: string;
    labelClassName?: string;
    placeholder?: string;
};
