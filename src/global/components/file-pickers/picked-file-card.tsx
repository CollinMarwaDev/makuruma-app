import type { UploadMediaResponseType } from "~/global/utils/zod-common/upload-media-schema";
import { type FC, useEffect, useMemo, useState } from "react";
import { formatBytes } from "~/global/utils/file-utils/format-bytes";
import type { PickedFile } from "~/global/hooks/useFilePicker";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { DocumentText } from "@solar-icons/react/ssr";
import { isImageMimeType } from "~/global/utils/file-utils";
import { LoadingCircle } from "~/global/components/icons";
import { AvatarCard } from "~/global/components/avatar";
import { ButtonIcon } from "~/global/components/button";
import { Card } from "~/global/components/card";
import { cn } from "~/global/utils/cn";

const isUploadMediaFile = (
    file: PickedFile | UploadMediaResponseType | string
): file is UploadMediaResponseType => {
    return (
        typeof file === "object" &&
        file !== null &&
        "id" in file &&
        "url" in file
    );
};

interface PickedFileCardProps {
    /** They picked a file to display */
    file: PickedFile | UploadMediaResponseType | string;
    /** Whether the file is currently being uploaded */
    isUploading?: boolean;
    /** Removes the selection; display-only legacy values have no file ID and pass an empty string. */
    onRemove: (fileId: string) => void;
}

type FileInfo = {
    fileName: string;
    isImage: boolean;
    size: string;
};

/**
 * Component to display a picked file with preview and remove functionality
 *
 * @example
 * ```tsx
 * <PickedFileCard
 *   file={pickedFile}
 *   isUploading={false}
 *   onRemove={(id) => handleRemove(id)}
 * />
 * ```
 */
const PickedFileCard: FC<PickedFileCardProps> = ({
    file,
    isUploading,
    onRemove,
}) => {
    const Icon = isUploading ? LoadingCircle : XMarkIcon;
    const [objectUrl, setObjectUrl] = useState<string>("");

    const handleClick = () => {
        if (!isUploading) {
            onRemove(typeof file === "string" ? "" : file.id.toString());
        }
    };

    const fileInfo = useMemo<FileInfo>(() => {
        if (typeof file === "string")
            return { fileName: "Existing logo", isImage: false, size: "" };
        if (!isUploadMediaFile(file)) {
            const formattedSize = formatBytes(file.file.size);
            return {
                fileName: file.file.name,
                isImage: isImageMimeType(file.file),
                size: formattedSize,
            };
        }

        return {
            fileName: file.fileName,
            isImage: isImageMimeType(file.fileType),
            size: formatBytes(file.fileSize),
        };
    }, [file]);

    /** Create and cleanup object URL for image preview */
    useEffect(() => {
        setObjectUrl("");
        if (
            typeof file !== "string" &&
            fileInfo.isImage &&
            !isUploadMediaFile(file)
        ) {
            const url = URL.createObjectURL(file.file);
            setObjectUrl(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [file, fileInfo.isImage]);

    return (
        <Card className="center flex justify-between">
            <AvatarCard>
                {objectUrl ? (
                    <AvatarCard.Image
                        alt={""}
                        containerClassName="rounded-md"
                        src={objectUrl}
                    />
                ) : (
                    <AvatarCard.Icon
                        icon={DocumentText}
                        containerClassName="rounded-md"
                    />
                )}
                <AvatarCard.Content
                    titleClassName={"max-w-54 truncate"}
                    title={fileInfo.fileName}
                    subtitle={fileInfo.size}
                />
            </AvatarCard>

            <ButtonIcon
                title={"Clear"}
                disabled={isUploading}
                onClick={handleClick}
                className={cn(
                    "size-9 rounded-lg border-0 bg-[#FEF1F1] p-0 text-[#EF4343] hover:bg-[#FEF1F1]",
                    {
                        "text-primary-shades-500 cursor-not-allowed bg-[#F5F7F9] hover:bg-[#F5F7F9]":
                            isUploading,
                    }
                )}
                iconClassName={cn("size-5")}
                icon={Icon}
            />
        </Card>
    );
};
export default PickedFileCard;
