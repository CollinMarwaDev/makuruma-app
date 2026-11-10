import type { FC } from "react";
import { SearchBox, type SearchBoxProps } from "~/global/components/search-box";

export const DropdownSearchInput: FC<SearchBoxProps> = (props) => {
    return <SearchBox {...props} className="w-auto min-w-52 gap-1 lg:py-1" />;
};
