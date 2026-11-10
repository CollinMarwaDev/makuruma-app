import { type FC, Fragment } from "react";
import { SkeletonLoader } from "~/global/components/loaders/skeleton-loader";
import { cn } from "~/global/utils/cn";

interface Props {
    columns?: number;
    className?: string;
    dataLoadingClassName?: string;
    rows?: number;
}

/**
 * TableDataLoading component - Renders a loading skeleton for table data
 * Displays placeholder content while data is being fetched
 */
export const TableDataLoading: FC<Props> = ({
    columns = 6,
    className,
    dataLoadingClassName,
    rows = 13,
}) => {
    return (
        <Fragment>
            {[...Array(rows)].map((_, index) => (
                <div
                    style={{
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                    }}
                    className={cn(
                        `grid gap-5 border-b border-outline px-4 py-6 first:pt-0`,
                        className
                    )}
                    key={index}
                >
                    {[...Array(columns)].map((_, index) => (
                        <SkeletonLoader
                            key={index}
                            className={dataLoadingClassName}
                        />
                    ))}
                </div>
            ))}
        </Fragment>
    );
};
