import { useSearchParamsState } from "~/global/utils/r3/hooks";
import { type FC, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { Hide } from "~/global/components/hide";
import { PageNumberButton } from "~/global/components/pagination/page-number-button";
import { PaginationNavButton } from "~/global/components/pagination/pagination-nav-button";

const MAX_VISIBLE_PAGES = 4;

/**
 * Pagination component that displays page numbers and navigation buttons
 * Uses URL search params to track the current page
 */
interface PaginationProps {
    /** Optional class name for the container element */
    containerClassName?: string;
    /** Maximum number of visible page buttons (defaults to MAX_VISIBLE_PAGES) */
    maxVisiblePages?: number;
    /** Search parameter key used to read and write the current page */
    pageSearchParamKey?: string;
    /** Total number of pages to paginate through */
    totalPages?: number;
}

export const Pagination: FC<PaginationProps> = ({
    totalPages = 0,
    containerClassName,
    maxVisiblePages = MAX_VISIBLE_PAGES,
    pageSearchParamKey = "currentPage",
}) => {
    //💡Get the current page from URL search params
    const [searchParams] = useSearchParamsState<Record<string, string>>();
    const currentPage = Number(searchParams[pageSearchParamKey]) || 1;

    /**
     * Generates an array of page numbers to display, including ellipsis
     * Shows first/last pages and ellipsis when total pages exceed maxVisiblePages
     */
    const generatePageNumbers = useCallback(() => {
        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        const halfVisiblePages = Math.floor(maxVisiblePages / 2);
        let firstVisiblePage = Math.max(1, currentPage - halfVisiblePages);
        const lastVisiblePage = Math.min(
            totalPages,
            firstVisiblePage + maxVisiblePages - 1
        );

        // Adjust start if the end reaches totalPages
        if (lastVisiblePage === totalPages) {
            firstVisiblePage = Math.max(
                1,
                lastVisiblePage - maxVisiblePages + 1
            );
        }

        const pages = Array.from(
            { length: lastVisiblePage - firstVisiblePage + 1 },
            (_, index) => firstVisiblePage + index
        );

        // Add ellipsis and boundaries
        const result = [];
        if (firstVisiblePage > 2) result.push(1, "...");
        result.push(...pages);
        if (lastVisiblePage < totalPages - 1) result.push("...", totalPages);

        return result;
    }, [currentPage, maxVisiblePages, totalPages]);

    const pages = generatePageNumbers();

    return (
        <Hide condition={totalPages <= 1}>
            <nav
                aria-label="Pagination"
                className={twMerge(
                    "flex w-fit shrink-0 items-center justify-center gap-2 overflow-hidden bg-surface",
                    containerClassName
                )}
            >
                <PaginationNavButton
                    direction="previous"
                    disabled={currentPage <= 1}
                    pageSearchParamKey={pageSearchParamKey}
                />

                <div
                    className="flex items-center gap-2 text-sm font-medium text-foreground"
                    role="list"
                >
                    {pages.map((page, index) =>
                        page === "..." ? (
                            <p
                                key={`ellipsis-${index}`}
                                className="center text-primary-shades-600 size-9.5 shrink-0 px-2"
                            >
                                ...
                            </p>
                        ) : (
                            <PageNumberButton
                                key={page}
                                pageNumber={Number(page)}
                                pageSearchParamKey={pageSearchParamKey}
                            />
                        )
                    )}
                </div>

                <PaginationNavButton
                    direction="next"
                    disabled={currentPage >= totalPages}
                    pageSearchParamKey={pageSearchParamKey}
                />
            </nav>
        </Hide>
    );
};
