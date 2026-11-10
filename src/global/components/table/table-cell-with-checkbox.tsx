import { useHandleSelectItem } from "~/global/utils/r3/hooks";
import type { ComponentPropsWithoutRef } from "react";
import Checkbox from "~/global/components/form-controls/checkbox";
import type { TableRowIdentity } from "~/global/components/table/table";
import { useTableContext } from "~/global/components/table/table";
import { TableCell } from "~/global/components/table/table-cell";
import { cn } from "~/global/utils/cn";

interface TableCellWithCheckbox<TData extends TableRowIdentity>
    extends ComponentPropsWithoutRef<"td"> {
    item: TData;
    label?: string;
}

/**
 * TableCellWithCheckbox component - Renders a table cell with a checkbox
 * Used for selectable rows in tables
 */
export const TableCellWithCheckbox = <TData extends TableRowIdentity>({
    children,
    className,
    item,
    label,
}: TableCellWithCheckbox<TData>) => {
    const { disableRowSelection } = useTableContext<TData>();
    const { toggleItemSelection, checkboxRef } = useHandleSelectItem(
        item,
        "rows"
    );

    // If row selection is disabled, don't render the checkbox
    if (disableRowSelection) {
        return children ? <TableCell>{children}</TableCell> : null;
    }

    return (
        <TableCell className={cn("flex items-start", className)}>
            <Checkbox
                className={"mt-1 mr-1"}
                onChange={toggleItemSelection}
                label={label}
                ref={checkboxRef}
            />
            {children}
        </TableCell>
    );
};
