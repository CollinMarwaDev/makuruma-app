import { SkeletonLoader } from "~/global/components/loaders/skeleton-loader";
import { AltArrowDown, AltArrowUp } from "@solar-icons/react/ssr";
import { type FC, type ReactNode } from "react";
import { Card } from "~/global/components/card";
import type { IconType } from "~/global/types";
import { cn } from "~/global/utils/cn";

/**
 * Props interface for the StatsCard component
 */
export interface StatsCardProps {
    /** Icon to display in the card */
    icon: IconType;
    /** Title text displayed above the value */
    title: string;
    /** Value text displayed prominently */
    value: string;
    /** Classname for customizing the icon */
    iconClassName?: string;
    /** rate of the stats displayed */
    statRate?: StatRateSectionProps;
    /** content for the stats displayed */
    content?: ReactNode;
    /** Replaces the icon badge in the header (e.g. slide controls) */
    headerAction?: ReactNode;
    /** Small text shown beside the value */
    valueSuffix?: string;
}

/**
 * StatsCard component
 *
 * Displays a card with an icon, label and value in a consistent layout
 * Used for showing key statistics or metrics
 *
 * @example
 * ```tsx
 * <StatsCard
 *   icon={DocumentIcon}
 *   label="Total Documents"
 *   value="1,234"
 * />
 * ```
 */
export const StatsCard: FC<StatsCardProps> = ({
    content,
    headerAction,
    icon: Icon,
    iconClassName,
    statRate,
    title,
    value,
    valueSuffix,
}) => {
    return (
        <Card className="space-y-2 rounded-2xl">
            <div className="items-between gap-2">
                <div className="space-y-1">
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-lg font-bold">
                        {value}
                        {valueSuffix && (
                            <span className="text-primary-shades-600 ml-1.5 text-xs font-normal">
                                {valueSuffix}
                            </span>
                        )}
                    </p>
                </div>
                {headerAction ?? (
                    <div
                        className={cn(
                            "text-primary center rounded-lg bg-primary-50 p-1",
                            iconClassName
                        )}
                    >
                        <Icon weight="Bold" className="size-5" />
                    </div>
                )}
            </div>
            <Card variant="filled" className="space-y-2">
                {statRate && <StatRateSection {...statRate} />}
                <>{content}</>
            </Card>
        </Card>
    );
};

export interface StatRateSectionProps {
    rate: number;
    rateValue: string;
    description: string;
    swapRate?: boolean;
}

export const StatRateSection: FC<StatRateSectionProps> = ({
    description,
    rate,
    rateValue,
}) => {
    const RateIcon = rate > 0 ? AltArrowUp : AltArrowDown;

    return (
        <div className="space-y-1">
            <p className="text-neutral-550 text-xs">{description}</p>
            <div className={"items-between text-muted-foreground text-xs"}>
                <p> {rateValue}</p>
                <div
                    className={cn(
                        "badge center gap-1 px-2 !text-xs",
                        { "text-status-red bg-status-red-bg": rate < 0 },
                        { "text-status-green bg-status-green-bg": rate > 0 },
                        { "text-status-grey-pc bg-status-grey-bg": rate == 0 }
                    )}
                >
                    <RateIcon weight="Bold" className="size-4" />
                    {Math.abs(rate)}%
                </div>
            </div>
        </div>
    );
};

export const StatCardLoading: FC<{ count?: number; className?: string }> = ({
    count = 4,
    className,
}) => {
    return (
        <div
            className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}
            role="status"
            aria-label="Loading"
        >
            {Array.from({ length: count }, (_, index) => (
                <Card className="space-y-4" key={index}>
                    <div className="flex justify-between">
                        <div className="space-y-2">
                            <SkeletonLoader className="w-24 py-2" />
                            <SkeletonLoader className="h-6 w-32" />
                        </div>
                        <SkeletonLoader className="size-8 rounded-lg" />
                    </div>
                    <SkeletonLoader className="h-16 w-full rounded-lg" />
                </Card>
            ))}
        </div>
    );
};
