import {
    EmptyStateIcon,
    PageSearchIcon,
} from "~/global/components/error-boundary/icons";
import { useSearchParamsState } from "~/global/utils/r3/hooks";
import { useFallbackUI } from "~/global/hooks/useFallbackUI";
import { Hide } from "~/global/components/hide";
import type { IconType } from "~/global/types";
import { memo, useMemo } from "react";
import { cn } from "~/global/utils/cn";

/**
 * Props for configuring the empty state UI component
 */
type EmptyStateProps = {
    /** Icon component to display when there is no data */
    noDataIcon?: IconType;
    /** Optional URL for the call-to-action button */
    ctaLink?: string;
    /** Optional label for the call-to-action button */
    ctaLabel?: string;
    /** Optional className for customizing the icon */
    iconClassName?: string;
    /** Description text when there is no data */
    noDataText: string;
    /** Title text when there is no data */
    noDataTitle: string;
    /** Text to display when search returns no results */
    searchNotFoundText?: string;
    /** Whether to show or hide the empty state */
    shouldShow: boolean;
};

/**
 * A hook that creates a memoized empty state UI component based on search state
 * and data availability. It switches between search results not found state and
 * no data state based on whether there is an active search query.
 */
export const useEmptyState = ({
    noDataIcon,
    iconClassName,
    searchNotFoundText,
    noDataTitle,
    noDataText,
    shouldShow,
    ctaLink,
    ctaLabel,
}: EmptyStateProps) => {
    const [searchParams] = useSearchParamsState();
    const hasParams = !!Object.keys(searchParams).length;

    const emptyState = useMemo(() => {
        return {
            description: hasParams
                ? searchNotFoundText ||
                  "There are no records that match your current search or filter settings."
                : noDataText,
            icon: hasParams ? PageSearchIcon : noDataIcon,
            title: hasParams ? "No Related Record Found" : noDataTitle,
        };
    }, [noDataIcon, searchNotFoundText, noDataTitle, noDataText, hasParams]);

    const EmptyState = useFallbackUI({
        ctaLabel,
        ctaLink: hasParams ? "" : ctaLink,
        description: emptyState.description,
        icon: emptyState.icon || EmptyStateIcon,
        iconClassName: cn("w-44 mb-8", { "h-40": hasParams }, iconClassName),
        title: emptyState.title,
    });

    const EmptyStateComponent = memo(
        ({ className }: { className?: string }) => (
            <Hide condition={!shouldShow}>
                <EmptyState
                    className={cn(
                        "bg-surface-container/20 h-[73vh]",
                        className
                    )}
                />
            </Hide>
        )
    );

    EmptyStateComponent.displayName = "EmptyStateComponent";

    return EmptyStateComponent;
};
