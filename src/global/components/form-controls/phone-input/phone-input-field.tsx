import { useId } from "react";
import {
    type Control,
    type FieldValues,
    type Path,
    useController,
} from "react-hook-form";
import {
    ErrorMessage,
    FieldContainer,
} from "~/global/components/form-controls/common";
import Label from "~/global/components/form-controls/label";
import {
    PhoneInput,
    type PhoneInputProps,
} from "~/global/components/form-controls/phone-input/phone-input";
import type { BasicFormFieldProps } from "~/global/components/form-controls/types";

export interface PhoneInputFieldProps<
    TFieldValues extends FieldValues = FieldValues,
> extends BasicFormFieldProps {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    defaultValue?: PhoneInputProps["defaultValue"];
    disabled?: boolean;
    errorMessage?: string;
    id?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
}

/** Form-controlled phone input with unique label and validation relationships. */
export const PhoneInputField = <
    TFieldValues extends FieldValues = FieldValues,
>({
    "aria-describedby": describedBy,
    "aria-invalid": invalid,
    containerClassName,
    control,
    disabled,
    errorMessage,
    hasError,
    id,
    label,
    labelClassName,
    name,
    optional,
    ...rest
}: PhoneInputFieldProps<TFieldValues>) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = errorMessage ? `${inputId}-error` : undefined;
    const {
        field: { onChange: handleChange, value },
    } = useController({
        control,
        name,
    });

    return (
        <FieldContainer className={containerClassName}>
            <Label
                className={labelClassName}
                optional={optional}
                htmlFor={inputId}
            >
                {label}
            </Label>
            <PhoneInput
                {...rest}
                aria-describedby={
                    [describedBy, errorId].filter(Boolean).join(" ") ||
                    undefined
                }
                aria-invalid={hasError || !!errorMessage || invalid}
                id={inputId}
                defaultValue={value}
                disabled={disabled}
                name={name}
                hasError={hasError}
                onChange={handleChange}
            />
            <ErrorMessage id={errorId} message={errorMessage} />
        </FieldContainer>
    );
};
