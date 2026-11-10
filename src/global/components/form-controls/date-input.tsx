import type { FC } from "react";
import { type Control, type FieldValues, useController } from "react-hook-form";
import {
    DatePicker,
    type DatePickerProps,
} from "~/global/components/date-picker/date-picker";
import { FieldContainer } from "~/global/components/form-controls/common";
import Label from "~/global/components/form-controls/label";

export interface DateInputProps<TFieldValues extends FieldValues = FieldValues>
    extends Omit<DatePickerProps, "onChange"> {
    control: Control<TFieldValues>;
    label: string;
    name: string;
    optional?: boolean;
    containerClassName?: string;
}

export const DateInput: FC<DateInputProps> = ({
    control,
    hasError,
    name,
    label,
    optional,
    containerClassName,
}) => {
    const {
        field: { onChange, value },
        fieldState: { error },
    } = useController({
        control,
        name,
    });

    return (
        <FieldContainer className={containerClassName}>
            <Label optional={optional}>{label}</Label>
            <DatePicker
                defaultValue={value}
                onChange={onChange}
                hasError={hasError || !!error?.message}
            />
        </FieldContainer>
    );
};
