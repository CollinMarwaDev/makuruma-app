import type { FC } from "react";
import { SkeletonLoader } from "~/global/components/loaders/skeleton-loader";
import { cn } from "~/global/utils/cn";

interface SkeletonShapeProps {
    className?: string;
}

/** A round placeholder for an avatar or icon button. Pass the size, e.g. `size-10`. */
export const SkeletonCircle: FC<SkeletonShapeProps> = ({ className }) => (
    <SkeletonLoader
        className={cn("size-10 shrink-0 rounded-full", className)}
    />
);

/** A line of text. Pass the width, e.g. `w-32`; the height matches `text-sm`. */
export const SkeletonText: FC<SkeletonShapeProps> = ({ className }) => (
    <SkeletonLoader className={cn("h-3.5 w-24 rounded-md py-0", className)} />
);

/** A badge: a pill the height of a `Badge`. */
export const SkeletonBadge: FC<SkeletonShapeProps> = ({ className }) => (
    <SkeletonLoader
        className={cn("h-6 w-16 shrink-0 rounded-full", className)}
    />
);

/** A text button: a pill the height of a small `Button`. */
export const SkeletonButton: FC<SkeletonShapeProps> = ({ className }) => (
    <SkeletonLoader
        className={cn("h-9 w-24 shrink-0 rounded-full", className)}
    />
);

/** Placeholder for a `SectionSeparator`: a small icon, a title and the line after it. */
export const SkeletonSectionHeading = ({
    width = "w-28",
}: {
    width?: string;
}) => (
    <div className="flex items-center gap-2">
        <SkeletonCircle className="size-4 rounded" />
        <SkeletonText className={width} />
        <span aria-hidden="true" className="bg-outline h-px flex-1" />
    </div>
);

/** Placeholder for a `LabelValueListItem`: a label column and a value after it. */
export const SkeletonLabelValue = ({
    valueWidth = "w-40",
}: {
    valueWidth?: string;
}) => (
    <div className="flex items-center">
        <div className="w-40 shrink-0">
            <SkeletonText className="w-24" />
        </div>
        <SkeletonText className={valueWidth} />
    </div>
);

/** Placeholder for a capability list: a check, a label and a description per row. */
export const SkeletonCapabilityRows = ({ count = 4 }: { count?: number }) => (
    <ul className="flex flex-col gap-2.5">
        {Array.from({ length: count }, (_, index) => (
            <li className="flex items-start gap-2.5" key={index}>
                <SkeletonCircle className="mt-0.5 size-4.5" />
                <span className="flex flex-1 flex-col gap-1.5">
                    <SkeletonText className="w-36" />
                    <SkeletonText className="h-3 w-3/4" />
                </span>
            </li>
        ))}
    </ul>
);

/** Placeholder for a slide-over header: a 48px avatar, a name and a badge under it. */
export const SkeletonPersonHeader = () => (
    <div className="flex items-center gap-3 pt-2">
        <SkeletonCircle className="size-12" />
        <div className="flex flex-col items-start gap-2">
            <SkeletonText className="h-4 w-44" />
            <SkeletonBadge />
        </div>
    </div>
);

interface SkeletonRadioCardProps {
    /** An avatar between the radio dot and the text. Defaults to true. */
    hasAvatar?: boolean;
    /** A badge after the text. Defaults to true. */
    hasBadge?: boolean;
}

/**
 * Placeholder for a `RadioGroup.ItemCard`: the radio dot, an optional avatar, a name with a
 * description, and an optional trailing badge, in the card's frame.
 */
export const SkeletonRadioCard = ({
    hasAvatar = true,
    hasBadge = true,
}: SkeletonRadioCardProps) => (
    <div className="ring-secondary-200 flex items-center gap-3 rounded-xl border-2 border-surface px-3 py-2 ring">
        <SkeletonCircle className="size-4" />
        {hasAvatar ? <SkeletonCircle className="size-9" /> : null}
        <span className="flex flex-1 flex-col gap-1.5 py-0.5">
            <SkeletonText className="w-32" />
            <SkeletonText className="h-3 w-44 max-w-full" />
        </span>
        {hasBadge ? <SkeletonBadge /> : null}
    </div>
);
