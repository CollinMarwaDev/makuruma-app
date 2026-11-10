import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "~/global/utils/cn";
import { useTableContext } from "./table";

interface TableRowProps extends ComponentPropsWithoutRef<"tr"> {
    rowId: string;
}

/**
 * TableRow component - Renders a table row (<tr>)
 * Used to contain table cells
 *
 * Selection can be determined in two ways:
 * 1. By providing a rowId prop - the component will use the table context to check if the row is selected
 * 2. By providing a selected prop (legacy approach) - explicitly sets the selection state
 *
 * The rowId approach is preferred as it allows the row to determine its selection state internally
 * without requiring the parent component to track and pass the selection state.
 */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
    ({ className, rowId, ...props }, ref) => {
        const { isRowSelected } = useTableContext();

        return (
            <tr
                ref={ref}
                className={cn(
                    "even:bg-primary/5 border-b-outline border-b odd:bg-surface",
                    "text-foreground transition-colors [&_td]:py-4",
                    { "bg-primary-50 border-l-primary": isRowSelected(rowId) },
                    className
                )}
                {...props}
            />
        );
    }
);

TableRow.displayName = "TableRow";
