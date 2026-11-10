import { useSearchParamsState } from "~/global/utils/r3/hooks";
import type { FC } from "react";
import { Button } from "~/global/components/button";
import { cn } from "~/global/utils/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type PaginationNavButtonProps = {
    direction: "previous" | "next";
    disabled?: boolean;
    pageSearchParamKey: string;
};

export const PaginationNavButton: FC<PaginationNavButtonProps> = ({
    direction,
    disabled,
    pageSearchParamKey,
}) => {
    const [searchParams, setSearchParams] =
        useSearchParamsState<Record<string, string>>();

    const handleClick = () => {
        if (disabled) return;
        const currentPage = Number(searchParams[pageSearchParamKey] ?? "1");

        const nextPage =
            direction === "next" ? currentPage + 1 : currentPage - 1;
        setSearchParams({ [pageSearchParamKey]: String(nextPage) });
    };

    return (
        <Button
            aria-label={
                direction === "previous" ? "Previous page" : "Next page"
            }
            className={cn(
                "disabled: flex items-center gap-2 px-4 py-2",
                "ring-0 focus:ring-0 active:ring-0",
                "hover:bg-primary-shades-50 text-primary-950 bg-transparent text-xs",
                "hover:text-primary focus:ring-0 disabled:cursor-not-allowed",

                {
                    "border-primary-shades-100": direction === "previous",
                },
                {
                    "hover:text text-primary-shades-300 cursor-not-allowed hover:bg-transparent":
                        disabled,
                },
                {
                    "text-primary-shades-300 hover:text-primary-shades-300":
                        disabled,
                }
            )}
            disabled={disabled}
            onClick={handleClick}
            type="button"
            variant="text"
        >
            {direction === "previous" ? (
                <>
                    <ChevronLeftIcon
                        strokeWidth={2}
                        className="text-muted size-4"
                    />
                    <span>Back</span>
                </>
            ) : (
                <>
                    <span>Next</span>

                    <ChevronRightIcon
                        strokeWidth={2}
                        className="text-muted size-4"
                    />
                </>
            )}
        </Button>
    );
};
