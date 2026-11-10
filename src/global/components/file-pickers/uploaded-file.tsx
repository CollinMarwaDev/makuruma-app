import { EyeIcon } from "@heroicons/react/24/outline";
import { DocumentText } from "@solar-icons/react/ssr";
import type { FC } from "react";
import { generateAvatar } from "~/global/utils/r3/utils";
import { AvatarCard } from "~/global/components/avatar";
import { ButtonLinkIcon } from "~/global/components/button";
import { Card } from "~/global/components/card";
import { ClientDateTime } from "~/global/components/client-date-time";
import { cn } from "~/global/utils/cn";
import { formatBytes } from "~/global/utils/file-utils";
import type { UploadMediaResponseType } from "~/global/utils/zod-common/upload-media-schema";

interface UploadedFileProps {
    className?: string;
    document: UploadMediaResponseType;
}

/**
 * Displays uploaded media metadata with a direct view action.
 */
export const UploadedFile: FC<UploadedFileProps> = ({
    className,
    document: { createdAt, fileName, fileSize, uploadedBy, url },
}) => {
    const hasMetadata = !!createdAt || !!uploadedBy;

    return (
        <Card className={cn("space-y-4", className)}>
            <div className="flex items-center justify-between gap-4">
                <AvatarCard className="min-w-0">
                    <AvatarCard.Icon
                        containerClassName="rounded-full"
                        icon={DocumentText}
                    />
                    <AvatarCard.Content
                        subtitle={formatBytes(fileSize)}
                        title={fileName}
                        titleClassName="max-w-54 truncate"
                    />
                </AvatarCard>
                <ButtonLinkIcon
                    icon={EyeIcon}
                    rel="noreferrer"
                    target="_blank"
                    title="View"
                    to={url}
                />
            </div>

            {hasMetadata && (
                <div className="bg-surface-container grid gap-3 rounded-lg px-4 py-2 sm:grid-cols-2">
                    {createdAt && (
                        <div className="space-y-2">
                            <div className="text-sm text-neutral-400">
                                Submission Date
                            </div>
                            <div className="text-sm">
                                <ClientDateTime
                                    format="date"
                                    value={createdAt}
                                />
                            </div>
                        </div>
                    )}
                    {uploadedBy && (
                        <div className="space-y-2">
                            <div className="text-sm text-neutral-400">
                                Uploaded By
                            </div>
                            <AvatarCard>
                                <AvatarCard.Image
                                    alt={uploadedBy.fullName}
                                    containerClassName="size-5 rounded-full"
                                    src={
                                        uploadedBy.avatar ||
                                        generateAvatar(uploadedBy.fullName)
                                    }
                                />
                                <AvatarCard.Content
                                    title={uploadedBy.fullName}
                                    titleClassName="max-w-54 truncate"
                                />
                            </AvatarCard>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};
