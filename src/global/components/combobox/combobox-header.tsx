import type { FC } from "react";
import ComboboxInput from "~/global/components/combobox/combobox-input";

interface ComboboxHeaderProps {
    onSearch?: (query: string) => void;
    searchPlaceholder?: string;
    searchLabel?: string;
    searchValue?: string;
}

const ComboboxHeader: FC<ComboboxHeaderProps> = ({
    onSearch: handleSearch,
    searchPlaceholder,
    searchLabel,
    searchValue,
}) => {
    return (
        <div className={"w-full"}>
            <ComboboxInput
                aria-label={searchLabel}
                onSearch={handleSearch}
                value={searchValue}
                placeholder={searchPlaceholder}
            />
        </div>
    );
};
export default ComboboxHeader;
