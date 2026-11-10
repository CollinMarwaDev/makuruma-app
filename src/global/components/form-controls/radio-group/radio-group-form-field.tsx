import type { ComponentPropsWithoutRef, FC } from "react";
import { type Control, type FieldValues, useController } from "react-hook-form";
import { FieldContainer } from "~/global/components/form-controls/common";
import Label from "~/global/components/form-controls/label";
import { RadioGroup } from "~/global/components/form-controls/radio-group/radio-group";
import { type LabelWithValue } from "~/global/types";
import { RadioGroupCardItem } from "~/global/components/form-controls/radio-group/radio-group-card";

export type RadioOption = LabelWithValue;

export interface RadioGroupFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
> extends ComponentPropsWithoutRef<typeof RadioGroup> {
    className?: string;
    containerClassName?: string;
    control: Control<TFieldValues>;
    errorMessage?: string;
    hasError?: boolean;
    label?: string;
    labelClassName?: string;
    name: string;
    optional?: boolean;
    options: RadioOption[];
}

export const RadioGroupFormField: FC<RadioGroupFormFieldProps> = ({
    className,
    containerClassName,
    control,
    hasError,
    label,
    labelClassName,
    name,
    optional,
    options,
    ...otherProps
}) => {
    const {
        field: { onChange: handleValueChange, value },
    } = useController({ control, name });

    return (
        <FieldContainer className={containerClassName}>
            {label && (
                <Label className={labelClassName} optional={optional}>
                    {label}
                </Label>
            )}
            <RadioGroup
                className={className}
                defaultValue={value}
                onValueChange={handleValueChange}
                {...otherProps}
            >
                {options.map((option) => (
                    <RadioGroupCardItem
                        hasError={hasError}
                        key={String(option.value)}
                        value={option}
                    />
                ))}
            </RadioGroup>
        </FieldContainer>
    );
};
