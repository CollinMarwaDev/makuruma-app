import { useSearchParamsState } from "~/global/utils/r3/hooks";
import type { FC } from "react";
import { Button } from "~/global/components/button";
import { cn } from "~/global/utils/cn";

type PageNumberButtonProps = {
    pageNumber: number;
    pageSearchParamKey: string;
};

export const PageNumberButton: FC<PageNumberButtonProps> = ({
    pageNumber,
    pageSearchParamKey,
}) => {
    const [searchParams, setSearchParams] =
        useSearchParamsState<Record<string, string>>();

    const currentPageNumber = Number(searchParams[pageSearchParamKey] ?? "1");

    const handlePageChange = () => {
        if (pageNumber !== currentPageNumber) {
            setSearchParams({ [pageSearchParamKey]: String(pageNumber) });
        }
    };

    return (
        <Button
            variant="text"
            onClick={handlePageChange}
            className={cn(
                "center text-secondary-500 border-outline border",
                "size-9 shrink-0 bg-transparent p-1 font-normal",
                "text-xs font-medium ring-0 focus:ring-0 active:ring-0",
                {
                    "text-primary-foreground bg-primary":
                        pageNumber === currentPageNumber,
                }
            )}
            aria-current={pageNumber === currentPageNumber ? "page" : undefined}
        >
            {pageNumber}
        </Button>
    );
};
