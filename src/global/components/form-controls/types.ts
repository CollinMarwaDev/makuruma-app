/**
 * @module FormFieldGenerator
 * @description This module provides a comprehensive set of types and components for generating form fields
 * with proper type inference and integration with react-hook-form.
 */

import {
    type Control,
    type FieldValues,
    type Path,
    type UseFormRegister,
} from "react-hook-form";
import { type CheckboxProps } from "~/global/components/form-controls/checkbox";
import { type ComboboxProps } from "~/global/components/form-controls/combobox-input/combobox-input";
import type {
    ComboboxType,
    ComboboxTypeToOptionType,
} from "~/global/components/form-controls/combobox-input/options";
import type { DateInputProps } from "~/global/components/form-controls/date-input";
import type { FilePickerFieldProps } from "~/global/components/form-controls/file-picker-form-field";
import type { PhoneInputFieldProps } from "~/global/components/form-controls/phone-input/phone-input-field";
import type { RadioGroupFormFieldProps } from "~/global/components/form-controls/radio-group/radio-group-form-field";
import type { SelectFormFieldProps } from "~/global/components/form-controls/select-input/select-form-field";
import { type TextInputFieldProps } from "~/global/components/form-controls/text-input-fields/text-input-field";
import { type TextareaFieldProps } from "~/global/components/form-controls/textarea";
import type { Simplify } from "~/global/types";

/**
 * Defines all supported field types in the form field generator
 */
export type FieldType =
    | "text-input"
    | "date-input"
    | "select-input"
    | "textarea"
    | "checkbox"
    | "file-input"
    | "combobox-input"
    | "phone-input"
    | "radio-group";

type WithTypedLabel<TFieldValues extends FieldValues, P> = Simplify<
    (P extends { label: string } ? Omit<P, "label"> : P) & {
        label: Capitalize<Path<TFieldValues>> | (string & {});
    }
>;

/**
 * Props for text input form fields
 * @template TFieldValues - The type of the form values
 * @extends TextInputFieldProps
 */
interface TextInputFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
> extends WithTypedLabel<TFieldValues, TextInputFieldProps> {
    /** Identifies this as a text input field */
    inputType: "text-input";
    /** Field name in the form values */
    name: Path<TFieldValues>;
    /** React Hook Form register function */
    register: UseFormRegister<TFieldValues>;
}

/**
 * Props for combobox input form fields
 * @template TFieldValues - The type of the form values
 * @template T - The combobox type (default, user, etc.)
 * @extends Omit<ComboboxProps<T>, "control">
 */
interface ComboboxInputFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    T extends ComboboxType = "default",
> extends WithTypedLabel<TFieldValues, Omit<ComboboxProps<T>, "control">> {
    /** Identifies this as a combobox input field */
    inputType: "combobox-input";
    /** Field name in the form values */
    name: Path<TFieldValues>;
    /** React Hook Form control object */
    control: Control<TFieldValues>;
}

/**
 * Props for select input form fields
 * @template TFieldValues - The type of the form values
 * @extends SelectInputProps
 */
interface SelectInputFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
> extends SelectFormFieldProps<TFieldValues> {
    /** Identifies this as a select input field */
    inputType: "select-input";
    /** Field name in the form values */
    name: Path<TFieldValues>;
    /** React Hook Form control object */
    control: Control<TFieldValues>;
}

interface DateInputFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
> extends WithTypedLabel<TFieldValues, DateInputProps<TFieldValues>> {
    /** Identifies this as a date input field */
    inputType: "date-input";
    /** Field name in the form values */
    name: Path<TFieldValues>;
    /** React Hook Form control object */
    control: Control<TFieldValues>;
}

/**
 * Props for textarea form fields
 * @template TFieldValues - The type of the form values
 * @extends TextInputFieldProps
 */
interface TextAreaFormFieldProps<TFieldValues extends FieldValues = FieldValues>
    extends WithTypedLabel<TFieldValues, TextInputFieldProps> {
    /** Identifies this as a textarea field */
    inputType: "textarea";
    /** Field name in the form values */
    name: Path<TFieldValues>;
    /** React Hook Form register function */
    register: UseFormRegister<TFieldValues>;
}

interface PhoneInputFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
> extends WithTypedLabel<TFieldValues, PhoneInputFieldProps<TFieldValues>> {
    /** Identifies this as a textarea field */
    inputType: "phone-input";
}
/**
 * Props for checkbox form fields
 * @template TFieldValues - The type of the form values
 * @extends CheckboxProps
 */
interface CheckboxFormFieldProps<TFieldValues extends FieldValues = FieldValues>
    extends CheckboxProps {
    /** Identifies this as a checkbox field */
    inputType: "checkbox";
    /** Field name in the form values */
    name: Path<TFieldValues>;
    /** React Hook Form register function */
    register: UseFormRegister<TFieldValues>;
}

/**
 * Props for radio group form fields
 * @template TFieldValues - The type of the form values
 * @extends RadioGroupFormFieldProps
 */
interface RadioGroupInputFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
> extends WithTypedLabel<TFieldValues, RadioGroupFormFieldProps<TFieldValues>> {
    /** Identifies this as a radio group field */
    inputType: "radio-group";
    /** Field name in the form values */
    name: Path<TFieldValues>;
    /** React Hook Form control object */
    control: Control<TFieldValues>;
}

type FilePickerFieldFormProps<TFieldValues extends FieldValues = FieldValues> =
    WithTypedLabel<TFieldValues, FilePickerFieldProps<TFieldValues>> & {
        inputType: "file-input";
    };

/**
 * Union type that maps field types to their respective props interfaces
 * @template T - The field type
 * @template CType - The combobox type (for combobox fields)
 */
export type FormFieldPropsMapping<CType extends ComboboxType = "default"> = {
    checkbox: CheckboxFormFieldProps;
    "combobox-input": ComboboxInputFormFieldProps<FieldValues, CType>;
    "date-input": DateInputFormFieldProps;
    "phone-input": PhoneInputFormFieldProps;
    "radio-group": RadioGroupInputFormFieldProps;
    "select-input": SelectInputFormFieldProps;
    "file-input": FilePickerFieldFormProps;
    "text-input": TextInputFormFieldProps;
    textarea: TextareaFieldProps;
};

export type FormFieldProps<
    T extends FieldType,
    CType extends ComboboxType = "default",
> = FormFieldPropsMapping<CType>[T];

/**
 * Helper type to infer the ComboboxType from a field with type property
 * @template T - The field type
 * @returns The ComboboxType if the field has a type property, otherwise "default"
 */
export type InferComboboxType<T> = T extends { type: infer Type }
    ? Type extends ComboboxType
        ? Type
        : "default"
    : "default";

/**
 * Type for a single form field that automatically infers the correct type based on inputType and type properties
 * @template TFieldValues - The type of the form values
 * @template CType - The combobox type (for combobox fields)
 */
export type FormField<TFieldValues extends FieldValues = FieldValues> =
    | TextInputFormFieldProps<TFieldValues>
    | SelectInputFormFieldProps<TFieldValues>
    | TextAreaFormFieldProps<TFieldValues>
    | CheckboxFormFieldProps<TFieldValues>
    | RadioGroupInputFormFieldProps<TFieldValues>
    | DateInputFormFieldProps<TFieldValues>
    | PhoneInputFormFieldProps<TFieldValues>
    | ComboboxInputField<TFieldValues>
    | FilePickerFieldFormProps<TFieldValues>
    | ComboboxInputField<TFieldValues, "user">;

/**
 * Helper type for ComboboxInput fields with automatic type inference
 * @template TFieldValues - The type of the form values
 * @template T - The combobox type
 */
export type ComboboxInputField<
    TFieldValues extends FieldValues = FieldValues,
    T extends ComboboxType = "default",
> = Omit<ComboboxInputFormFieldProps<TFieldValues, T>, "options"> & {
    /** The combobox type */
    type?: T;
    /** The options for the combobox */
    options: Array<ComboboxTypeToOptionType<T>>;
};

export type UseFormRegisterAndControl<TFieldValues extends FieldValues> = {
    register?: UseFormRegister<TFieldValues>;
    control?: Control<TFieldValues>;
};

export type BasicFormFieldProps = {
    containerClassName?: string;
    hasError?: boolean;
    hidden?: boolean;
    label?: string;
    labelClassName?: string;
    optional?: boolean;
    placeholder?: string;
};
