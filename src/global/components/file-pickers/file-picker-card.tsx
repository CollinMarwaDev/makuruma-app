import type { UploadMediaResponseType } from "~/global/utils/zod-common/upload-media-schema";
import { convertToMegabytes } from "~/global/utils/file-utils/convert-to-megabytes";
import { stopEventWithCallback } from "~/global/utils/stop-event-with-callback";
import PickedFileCard from "~/global/components/file-pickers/picked-file-card";
import { type PickedFile, useFilePicker } from "~/global/hooks/useFilePicker";
import { ErrorMessage } from "~/global/components/form-controls/common";
import { useUploadFile } from "~/global/hooks/useUploadFile";
import { CloudUpload } from "@solar-icons/react/ssr";
import type { Callable, IconType } from "~/global/types";
import type { Accept } from "react-dropzone";
import { useId, useState } from "react";
import { cn } from "~/global/utils/cn";

export interface FilePickerCardBaseProps {
    accept?: Accept;
    containerClassName?: string;
    defaultValue?: UploadMediaResponseType | string | null;
    errorMessage?: string;
    hasError?: boolean;
    icon?: IconType;
    id?: string;
    instructionText?: string;
    instructionTitle?: string;
    type?: "avatar" | "file";

    /** Maximum allowed File Size in Megabytes (MB)*/
    maxSize?: number;

    /** Minimum allowed File Size in Megabytes (MB)*/
    minSize?: number;
}

export type FilePickerAutoUploadProps<Props> = Props & {
    mode: "auto-upload";
    onChange?: Callable<UploadMediaResponseType | undefined>;
};

export type FilePickerManualUploadProps<Props> = Props & {
    mode: "manual-upload";
    onChange?: Callable<PickedFile | undefined>;
};

type FilePickerCardProps =
    | FilePickerAutoUploadProps<FilePickerCardBaseProps>
    | FilePickerManualUploadProps<FilePickerCardBaseProps>;

/** Picks local files or displays existing uploads and legacy URLs without inventing media metadata. */
export const FilePickerCard = <T extends FilePickerCardProps>({
    containerClassName,
    defaultValue,
    errorMessage,
    hasError,
    id,
    instructionText,
    instructionTitle,
    icon: FileIcon = CloudUpload,
    type = "file",
    onChange,
    mode,
    maxSize,
    minSize,
    accept,
}: T) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [uploadError, setErrorMessage] = useState<string | undefined>();
    const { uploadFile, isUploading } = useUploadFile({
        onError: (error) => {
            if (error) setErrorMessage(error.message);
        },
        onSuccess: (data) => {
            if (mode === "auto-upload") onChange?.(data);
        },
    });

    const handleFileChange = async (pickedFile: PickedFile) => {
        setDefaultFile(undefined);
        if (mode === "auto-upload") {
            uploadFile(pickedFile.file);
        } else onChange?.(pickedFile);
    };

    const maxSizeInMB = convertToMegabytes(maxSize ?? 1);
    const minSizeInMB = convertToMegabytes(minSize ?? 1);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        pickedFiles,
        unPickFileById,
        open: openNativeFilePicker,
    } = useFilePicker({
        accept,
        maxSizeInMB,
        minSizeInMB,
        mode: "single",
        onChange: handleFileChange,
    });

    const [defaultFile, setDefaultFile] = useState<
        UploadMediaResponseType | string | null | undefined
    >(
        typeof defaultValue === "string"
            ? defaultValue.trim() || undefined
            : defaultValue
    );

    const fileToDisplay = pickedFiles ?? defaultFile;
    const errorText = errorMessage ?? uploadError;

    const handleRemoveFile = (fileId: string) => {
        setDefaultFile(undefined);
        if (onChange) {
            onChange(undefined);
        }
        if (fileId) unPickFileById(fileId);
    };

    return (
        <div className={cn("space-y-2", containerClassName)}>
            <div
                {...getRootProps({
                    className: cn(
                        "border-outline cursor-pointer hover:bg-surface-container/40 center rounded-xl border border-dashed py-6",
                        { "p-2 justify-start": type === "avatar" },
                        { hidden: type === "avatar" && fileToDisplay },
                        { "bg-surface-container": isDragActive },
                        { "border-status-red/80 bg-status-red-bg/10": hasError }
                    ),
                })}
            >
                <button
                    onClick={stopEventWithCallback(openNativeFilePicker)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openNativeFilePicker();
                        }
                    }}
                    type="button"
                    className={cn(
                        "center h-full w-full cursor-pointer flex-col gap-1",
                        { "flex-row justify-start gap-4": type === "avatar" }
                    )}
                >
                    <div
                        className={cn({
                            "rounded-lg": type === "avatar",
                        })}
                    >
                        <FileIcon
                            weight={"BoldDuotone"}
                            className={cn("text-primary-400 size-18", {
                                "size-12": type === "avatar",
                            })}
                        />
                    </div>
                    <input
                        {...getInputProps({
                            "aria-describedby": errorText
                                ? `${inputId}-error`
                                : undefined,
                            "aria-invalid":
                                hasError || !!errorText || undefined,
                            id: inputId,
                        })}
                    />
                    <div
                        className={cn("text-center", {
                            "text-start": type === "avatar",
                        })}
                    >
                        <p className="text-primary font-medium">
                            {instructionTitle ?? "Click to upload"}
                        </p>
                        <p className="text-primary-shades-500 text-xs whitespace-break-spaces">
                            {instructionText ?? "Maximum file size: 12 MB"}
                        </p>
                    </div>
                </button>
            </div>

            {errorText && (
                <ErrorMessage id={`${inputId}-error`} message={errorText} />
            )}
            {fileToDisplay && (
                <PickedFileCard
                    isUploading={isUploading}
                    file={fileToDisplay}
                    onRemove={handleRemoveFile}
                />
            )}
        </div>
    );
};
