import type { FC } from "react";
import { cn } from "~/global/utils/cn";

const MEDIA_UNAVAILABLE_LABELS = {
    document: "Document unavailable",
    image: "Image unavailable",
    video: "Video unavailable",
} as const;

interface MediaUnavailableProps {
    className?: string;
    type: keyof typeof MEDIA_UNAVAILABLE_LABELS;
}

/** Neutral placeholder for image, video or document media that cannot be loaded. */
export const MediaUnavailable: FC<MediaUnavailableProps> = ({
    className,
    type,
}) => (
    <p className={cn("rounded-lg bg-surface/10 p-3 text-xs", className)}>
        {MEDIA_UNAVAILABLE_LABELS[type]}
    </p>
);
