import type { FC } from "react";
import { type FieldValues } from "react-hook-form";
import Checkbox from "~/global/components/form-controls/checkbox";
import { ComboboxInput } from "~/global/components/form-controls/combobox-input/combobox-input";
import { DateInput } from "~/global/components/form-controls/date-input";
import { FilePickerFormField } from "~/global/components/form-controls/file-picker-form-field";
import { PhoneInputField } from "~/global/components/form-controls/phone-input";
import { RadioGroupFormField } from "~/global/components/form-controls/radio-group/radio-group-form-field";
import { SelectFormField } from "~/global/components/form-controls/select-input/select-form-field";
import { TextInputField } from "~/global/components/form-controls/text-input-fields";

import { TextareaField } from "~/global/components/form-controls/textarea";
import type {
    FieldType,
    FormField,
    FormFieldProps,
    UseFormRegisterAndControl,
} from "~/global/components/form-controls/types";

/**
 * Map of field types to their respective components
 * This is used by the FormFieldGenerator to render the appropriate component based on the inputType
 */
const formFieldsMap: {
    [FType in FieldType]: FType extends "combobox-input"
        ? typeof ComboboxInput
        : FC<FormFieldProps<FType>>;
} = {
    checkbox: Checkbox,
    "combobox-input": ComboboxInput,
    "date-input": DateInput,
    "file-input": FilePickerFormField,
    "phone-input": PhoneInputField,
    "radio-group": RadioGroupFormField,
    "select-input": SelectFormField,
    "text-input": TextInputField,
    textarea: TextareaField,
};

/**
 * RenderFormField dynamically renders form input elements based on provided `inputType`.
 * It integrates with React Hook Form for field validation and value handling.
 *
 * Supports rendering text inputs, select dropdowns, textareas, checkboxes and combobox inputs
 * by mapping the inputType to the appropriate form component.
 *
 * @template TFieldValues - The shape of form values
 */
export const RenderFormField = <TFieldValues extends FieldValues>(
    props: FormField<TFieldValues> & UseFormRegisterAndControl<TFieldValues>
) => {
    const { inputType, register, ...otherProps } = props;

    if ("hidden" in props && props.hidden) {
        return null;
    }

    const Component = formFieldsMap[inputType];

    return (
        //@ts-expect-error avoid type error for non-combobox-input fields
        <Component
            {...otherProps}
            {...(register ? register(otherProps.name) : {})}
        />
    );
};
