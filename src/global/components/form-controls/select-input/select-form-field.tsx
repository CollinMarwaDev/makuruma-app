import type { FC } from "react";
import { type Control, type FieldValues, useController } from "react-hook-form";
import SelectInput from "~/global/components/form-controls/select-input/select-input";
import type { SelectInputProps } from "~/global/components/form-controls/select-input/types";

export interface SelectFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
> extends SelectInputProps {
    name: string;
    control: Control<TFieldValues>;
}

export const SelectFormField: FC<SelectFormFieldProps> = ({
    control,
    name,
    ...otherProps
}) => {
    const {
        field: { onChange: handleChange, value },
    } = useController({
        control,
        name,
    });

    return (
        <SelectInput
            {...otherProps}
            defaultValue={value}
            onChange={handleChange}
        />
    );
};
