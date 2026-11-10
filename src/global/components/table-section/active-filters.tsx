import type { ComponentProps } from "react";
import { ChipsButton } from "~/global/components/button";
import { cn } from "~/global/utils/cn";
import { useHandleActiveFilters } from "~/global/components/table-section/handle-active-filters";

export const TableSectionActiveFilters = ({
    className,
    exclude,
    ...otherProps
}: Omit<ComponentProps<"div">, "children"> & {
    /** Query names that are not filters on this page, such as a tab selector. */
    exclude?: string[];
}) => {
    const { activeFilters, formatValue, formatLabel } = useHandleActiveFilters({
        exclude,
    });

    if (!activeFilters || activeFilters.length === 0) {
        return null;
    }

    return (
        <div
            {...otherProps}
            className={cn(
                "scrollbar-hide center flex-wrap justify-end gap-2 overflow-x-auto px-4 pt-2 pb-3 capitalize",
                className
            )}
        >
            {activeFilters.map((filter) => (
                <ChipsButton key={filter.id} onClick={filter.onRemove}>
                    <ChipsButton.Label
                        label={`${formatLabel(filter.label)}: ${formatValue(filter.value)}`}
                    />
                </ChipsButton>
            ))}
        </div>
    );
};
