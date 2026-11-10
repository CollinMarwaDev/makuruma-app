import { Select as SelectPrimitive } from "radix-ui";
import type { ComponentPropsWithoutRef } from "react";
import type { Callable, IconType } from "~/global/types";

// Todo extern lable and value foromtype
export type SelectOption = {
    value: string | number | boolean;
    label: string;
    icon?: IconType;
};

export interface SelectFieldProps
    extends Omit<
        ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
        "onValueChange" | "defaultValue"
    > {
    hasError?: boolean;
    hidden?: boolean;
    onChange?: Callable<SelectOption>;
    placeholder?: string;
    options: Array<SelectOption>;
    loading?: boolean;
    defaultValue?: Omit<SelectOption, "icon" | "selected">;
}

export interface SelectInputProps extends SelectFieldProps {
    /** Additional descriptions associated with the select trigger. */
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
    "aria-label"?: string;
    className?: string;
    containerClassName?: string;
    errorMessage?: string;
    id?: string;
    inputClassNames?: string;
    label?: string;
    labelClassName?: string;
    optional?: boolean;
}
