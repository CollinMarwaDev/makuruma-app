import { Command } from "cmdk";
import { useDebounce } from "~/global/utils/r3/hooks";
import type { FC } from "react";
import { SearchIcon } from "~/global/components/icons";
import { cn } from "~/global/utils/cn";

interface Props {
    "aria-label"?: string;
    className?: string;
    value?: string;
    onSearch?: (query: string) => void;
    placeholder?: string;
}

const ComboboxInput: FC<Props> = ({
    "aria-label": ariaLabel = "Search options",
    className,
    value,
    onSearch,
    placeholder = "Search",
}) => {
    const handleValueChange = useDebounce<string>((query) => {
        onSearch?.(query);
    });

    return (
        <div className={"border-primary-shades-100 relative border-b"}>
            <Command.Input
                aria-label={ariaLabel}
                placeholder={placeholder}
                value={value}
                onValueChange={
                    value === undefined ? handleValueChange : onSearch
                }
                className={cn(
                    "placeholder:text-neutral-550 w-full border-0 py-2.5 pl-8",
                    "text-sm placeholder:font-light focus:ring-0 focus:outline-none",
                    className
                )}
            />

            <div className="absolute top-0 bottom-0 left-0 my-auto flex size-7 items-center pl-2">
                <SearchIcon className={"size-5 text-gray-500"} />
            </div>
        </div>
    );
};
export default ComboboxInput;
