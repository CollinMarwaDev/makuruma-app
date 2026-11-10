import { forwardRef, type ThHTMLAttributes } from "react";
import { cn } from "~/global/utils/cn";

/**
 * TableHead component - Renders a table header cell (<th>)
 * Used for column headers in tables
 */
export const TableHead = forwardRef<
    HTMLTableCellElement,
    ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            "text-primary-950 bg-surface-container px-4 text-left text-[13.5px] font-medium uppercase [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
            className
        )}
        {...props}
    />
));

TableHead.displayName = "TableHead";
