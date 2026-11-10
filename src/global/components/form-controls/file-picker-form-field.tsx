import {
    type Control,
    type FieldValues,
    type Path,
    useController,
} from "react-hook-form";
import {
    type FilePickerAutoUploadProps,
    FilePickerCard,
    type FilePickerCardBaseProps,
    type FilePickerManualUploadProps,
} from "~/global/components/file-pickers/file-picker-card";
import type { BasicFormFieldProps } from "~/global/components/form-controls/types";
import { isNotEmpty } from "~/global/utils/is-not-empty";
import Label from "~/global/components/form-controls/label";
import { useId } from "react";
import type { PickedFile } from "~/global/hooks/useFilePicker";
import type { UploadMediaResponseType } from "~/global/utils/zod-common/upload-media-schema";
import { FieldContainer } from "~/global/components/form-controls/common";

interface FilePickerFormFieldBaseProps<
    TFieldValues extends FieldValues = FieldValues,
> extends FilePickerCardBaseProps,
        BasicFormFieldProps {
    /** Explicit clearing value for forms whose API distinguishes removal from omission. */
    clearValue?: null;
    control: Control<TFieldValues>;
    name: Path<TFieldValues>;
}

type FilePickerFormFieldAutoUploadProps<
    TFieldValues extends FieldValues = FieldValues,
> = FilePickerAutoUploadProps<FilePickerFormFieldBaseProps<TFieldValues>>;

type FilePickerFormFieldManualProps<
    TFieldValues extends FieldValues = FieldValues,
> = FilePickerManualUploadProps<FilePickerFormFieldBaseProps<TFieldValues>>;

export type FilePickerFieldProps<
    TFieldValues extends FieldValues = FieldValues,
> =
    | FilePickerFormFieldAutoUploadProps<TFieldValues>
    | FilePickerFormFieldManualProps<TFieldValues>;

// ----------------------------------------------------------------------

export const FilePickerFormField = <
    TFieldValues extends FieldValues = FieldValues,
>({
    clearValue,
    control,
    name,
    optional,
    label,
    containerClassName,
    ...rest
}: FilePickerFieldProps<TFieldValues>) => {
    const inputId = useId();
    const {
        field: { onChange: handleChange, value },
        fieldState: { error },
    } = useController({
        control,
        name,
    });

    return (
        <FieldContainer className={containerClassName}>
            <Label htmlFor={inputId} optional={optional}>
                {label}
            </Label>
            <FilePickerCard
                {...rest}
                defaultValue={value}
                errorMessage={error?.message ?? rest.errorMessage}
                hasError={isNotEmpty(error)}
                id={inputId}
                onChange={(
                    file: PickedFile | UploadMediaResponseType | undefined
                ) => handleChange(file ?? clearValue)}
            />
        </FieldContainer>
    );
};
