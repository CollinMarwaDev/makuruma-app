import { useHandleSelectAllItems, useSearchParamsState } from "~/global/utils/r3/hooks";
import { type ComponentProps, forwardRef } from "react";
import Checkbox from "~/global/components/form-controls/checkbox";
import { useTableContext } from "~/global/components/table/table";
import { TableHead } from "~/global/components/table/table-head";
import { TableRow } from "~/global/components/table/table-row";
import { cn } from "~/global/utils/cn";
import { DoubleAltArrowDown, SortVertical } from "@solar-icons/react/ssr";
import Tooltip from "~/global/components/tooltip";

/**
 * ColumnHeader type - Configuration for table column headers
 */
export type ColumnHeader = {
    id: string;
    label: string;
    canSort?: boolean;
    isSorted?: boolean;
};

/**
 * Represents the sorting configuration for a table.
 */
type TableSortType = {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

interface TableHeaderProps extends Omit<ComponentProps<"thead">, "children"> {
    headers: ColumnHeader[];
}

/**
 * TableHeader component - Renders the table header section (<thead>)
 * Provides column headers with optional sorting functionality
 */
export const TableHeader = forwardRef<
    HTMLTableSectionElement,
    TableHeaderProps
>(({ className, headers, ...props }, ref) => {
    const { data, disableRowSelection } = useTableContext();
    const { handleChange, checkboxRef } = useHandleSelectAllItems(data, "rows");
    const [searchParams, setSearchParams] =
        useSearchParamsState<TableSortType>();

    const handleSort = (columnId: string) => {
        const isCurrentlySorted = searchParams.sortBy === columnId;
        const newOrder =
            isCurrentlySorted && searchParams.sortOrder === "asc"
                ? "desc"
                : "asc";

        setSearchParams({
            sortBy: columnId,
            sortOrder: newOrder,
        });
    };

    return (
        <thead
            ref={ref}
            className={cn(
                "[&_th]:text-primary-950 border-b capitalize [&_th]:py-3.5 [&_th]:font-medium",
                "sticky top-0 left-0 z-10",
                className
            )}
            {...props}
        >
            <TableRow rowId="table-header">
                {headers.map(({ id, label, canSort = true }, index) => {
                    const isSorted = searchParams.sortBy === id;
                    const sortOrder = searchParams.sortOrder || false;

                    const SortIcon = isSorted
                        ? DoubleAltArrowDown
                        : SortVertical;
                    return (
                        <TableHead key={id} className="whitespace-nowrap">
                            <div className="flex items-center gap-5">
                                {index === 0 ? (
                                    disableRowSelection ? (
                                        <p className="text-xs">{label}</p>
                                    ) : (
                                        <Checkbox
                                            label={label}
                                            className={"mr-1"}
                                            onChange={handleChange}
                                            ref={checkboxRef}
                                        />
                                    )
                                ) : (
                                    <p className="text-xs">{label}</p>
                                )}

                                {canSort && (
                                    <Tooltip
                                        content={
                                            isSorted
                                                ? sortOrder == "asc"
                                                    ? "Sort Descending"
                                                    : "Sort Ascending"
                                                : `Sort by ${label}`
                                        }
                                    >
                                        <button
                                            className={cn(
                                                "text-primary-shades-600 cursor-pointer",
                                                "hover:bg-container rounded-md",
                                                isSorted && "text-primary"
                                            )}
                                            onClick={() => handleSort(id)}
                                        >
                                            <SortIcon
                                                weight={"LineDuotone"}
                                                className={cn("size-5", {
                                                    "rotate-180":
                                                        sortOrder == "desc" &&
                                                        isSorted,
                                                })}
                                            />
                                        </button>
                                    </Tooltip>
                                )}
                            </div>
                        </TableHead>
                    );
                })}
            </TableRow>
        </thead>
    );
});

TableHeader.displayName = "TableHeader";
