import { forwardRef, type TdHTMLAttributes } from "react";
import { cn } from "~/global/utils/cn";

/**
 * TableCell component - Renders a table cell (<td>)
 * Used for displaying data in table rows
 */
export const TableCell = forwardRef<
    HTMLTableCellElement,
    TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn(
            "text-foreground px-4 py-2 align-middle text-[13.5px]",
            className
        )}
        {...props}
    />
));

TableCell.displayName = "TableCell";
