import { useDebounce, useSearchParamsState } from "~/global/utils/r3/hooks";
import {
    type ChangeEvent,
    type ComponentPropsWithoutRef,
    forwardRef,
} from "react";
import { TextInputWithPrefix } from "~/global/components/form-controls/text-input-fields/text-input-with-prefix";
import { SearchIcon } from "~/global/components/icons";
import type { Callable } from "~/global/types";
import { cn } from "~/global/utils/cn";

export interface SearchBoxProps
    extends Omit<
        ComponentPropsWithoutRef<typeof TextInputWithPrefix>,
        "_prefix" | "onChange"
    > {
    onChange?: Callable<string>;
    pageSearchParamKey?: string;
    searchParamKey?: string;
}

export const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(
    (
        {
            className,
            onChange,
            pageSearchParamKey = "currentPage",
            searchParamKey = "q",
            ...props
        },
        ref
    ) => {
        const [searchParams, setSearchParams] =
            useSearchParamsState<Record<string, string | undefined>>();

        const handleInputChange = useDebounce<ChangeEvent<HTMLInputElement>>(
            (e) => {
                const value = e.target.value;
                if (onChange) {
                    return onChange(value);
                }
                setSearchParams({
                    [pageSearchParamKey]: undefined,
                    [searchParamKey]: value,
                });
            }
        );

        return (
            <TextInputWithPrefix
                defaultValue={searchParams?.[searchParamKey]}
                className={cn("w-80", className)}
                placeholder="Type to search"
                onChange={handleInputChange}
                _prefix={SearchIcon}
                ref={ref}
                {...props}
            />
        );
    }
);

SearchBox.displayName = "SearchBox";
