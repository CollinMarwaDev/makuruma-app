import { useSearchParamsState } from "~/global/utils/r3/hooks";
import { formatDate } from "~/global/utils/date-utils";

export type ActiveFilter = {
    id: string;
    label: string;
    onRemove: () => void;
    value?: string | string[];
};

/** Paging is never a filter the person chose, so it never shows as a chip. */
const PAGING_PARAMS = ["currentPage", "pageSize"];

/**
 * @param exclude - More query names that are not filters on this page, such as a tab selector.
 */
export const useHandleActiveFilters = ({
    exclude = [],
}: { exclude?: string[] } = {}) => {
    const [searchParams, setSearchParams] = useSearchParamsState();

    const activeFilters: ActiveFilter[] = Object.entries(searchParams)
        .filter(
            ([label]) =>
                !PAGING_PARAMS.includes(label) && !exclude.includes(label)
        )
        .map(([label, value]) => ({
            id: `${label}-${value}`,
            label,
            onRemove: () => setSearchParams({ [label]: undefined }),
            value,
        }));

    const formatLabel = (label: string) => {
        return label.charAt(0).toUpperCase() + label.slice(1) == "Q"
            ? "Search"
            : label.charAt(0).toUpperCase() + label.slice(1);
    };

    const formatValue = (value?: string | string[]) => {
        const isDate = new RegExp(/^\d{2}-\d{2}-\d{4}$/).test(value as string);

        return isDate ? formatDate(String(value)) : value;
    };

    return { activeFilters, formatLabel, formatValue };
};
