import type { FC } from "react";
import { GeneralFallbackUI } from "~/global/components/general-fallback-ui";
import { EmptyStateIcon, PageSearchIcon } from "~/global/components/error-boundary/icons";
import type { IconType } from "~/global/types";
import { cn } from "~/global/utils/cn";
import { useSearchParamsState } from "~/global/utils/r3/hooks";

export interface EmptyStateProps {
    className?: string;
    ctaLabel?: string;
    /** Shown only for "no data" (not when a search/filter returns nothing). */
    ctaLink?: string;
    iconClassName?: string;
    noDataIcon?: IconType;
    noDataText: string;
    noDataTitle: string;
    /** Query names that don't count as a search/filter (e.g. sort, paging). */
    ignoreParams?: string[];
    searchNotFoundText?: string;
}

const DEFAULT_IGNORED = ["currentPage", "pageSize", "sortBy", "sortOrder"];

/**
 * Empty state for lists. Shows "no data" normally, or "no related record" when a search or filter
 * (any URL search param except paging/sorting) is active. Component form of `useEmptyState`.
 */
export const EmptyState: FC<EmptyStateProps> = ({
    className,
    ctaLabel,
    ctaLink,
    iconClassName,
    ignoreParams = DEFAULT_IGNORED,
    noDataIcon = EmptyStateIcon,
    noDataText,
    noDataTitle,
    searchNotFoundText,
}) => {
    const [searchParams] = useSearchParamsState<Record<string, string>>();
    const isFiltered = Object.entries(searchParams).some(([key, value]) => value && !ignoreParams.includes(key));

    return (
        <GeneralFallbackUI
            ctaLabel={isFiltered ? undefined : ctaLabel}
            ctaLink={isFiltered ? undefined : ctaLink}
            description={
                isFiltered
                    ? searchNotFoundText || "There are no records that match your current search or filter settings."
                    : noDataText
            }
            icon={isFiltered ? PageSearchIcon : noDataIcon}
            iconClassName={cn("w-40 mb-4", iconClassName)}
            title={isFiltered ? "No related record found" : noDataTitle}
            wrapperClassName={cn("bg-surface-container/20", className)}
        />
    );
};
