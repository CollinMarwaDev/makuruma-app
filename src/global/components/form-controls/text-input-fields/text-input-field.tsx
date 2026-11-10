import {
    type ComponentType,
    forwardRef,
    useId,
    type InputHTMLAttributes,
} from "react";
import {
    ErrorMessage,
    FieldContainer,
} from "~/global/components/form-controls/common";
import Label from "~/global/components/form-controls/label";
import NumberInput from "~/global/components/form-controls/text-input-fields/number-input";
import { TextInputBasic } from "~/global/components/form-controls/text-input-fields/text-input-basic";
import { TextInputWithPrefix } from "~/global/components/form-controls/text-input-fields/text-input-with-prefix";
import type { IconType } from "~/global/types";

export type InputType =
    | "currency"
    | "date"
    | "time"
    | "with-prefix"
    | "text"
    | "email"
    | "password";

export interface TextInputFieldProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
    type?: InputType;
    prefixComponent?: IconType | string;
    _suffix?: IconType | string;
    currency?: "Tsh" | "$";
    containerClassName?: string;
    colorSwatchDefaultColor?: string;
    errorMessage?: string;
    labelClassName?: string;
    label: string;
    hasError?: boolean;
    optional?: boolean;
    showColorSwatch?: boolean;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const inputTypeMap: Record<InputType, ComponentType<any>> = {
    currency: NumberInput,
    date: TextInputBasic,
    email: TextInputBasic,
    password: TextInputBasic,
    text: TextInputBasic,
    time: TextInputBasic,
    "with-prefix": TextInputWithPrefix,
};

/** Text field with a unique label target and connected validation feedback. */
export const TextInputField = forwardRef<HTMLInputElement, TextInputFieldProps>(
    (
        {
            type = "text",
            label,
            prefixComponent,
            currency,
            optional,
            errorMessage,
            containerClassName,
            labelClassName,
            id,
            ...props
        },
        ref
    ) => {
        const generatedId = useId();
        const inputId = id ?? generatedId;
        const errorId = errorMessage ? `${inputId}-error` : undefined;
        const InputComponent = inputTypeMap[type] || TextInputBasic;

        return (
            <FieldContainer className={containerClassName}>
                <Label
                    className={labelClassName}
                    htmlFor={inputId}
                    optional={optional}
                >
                    {label}
                </Label>
                <InputComponent
                    type={type}
                    prefixComponent={prefixComponent}
                    currency={currency}
                    ref={ref}
                    {...props}
                    aria-describedby={
                        [props["aria-describedby"], errorId]
                            .filter(Boolean)
                            .join(" ") || undefined
                    }
                    aria-invalid={
                        props.hasError ||
                        !!errorMessage ||
                        props["aria-invalid"]
                    }
                    id={inputId}
                />
                <ErrorMessage id={errorId} message={errorMessage} />
            </FieldContainer>
        );
    }
);

TextInputField.displayName = "TextInputField";
