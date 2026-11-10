import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "~/global/utils/cn";

/**
 * TableFooter component - Renders the table footer section (<tfoot>)
 * Used for summary information or pagination controls
 */
export const TableFooter = forwardRef<
    HTMLTableSectionElement,
    HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={cn(
            "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
            className
        )}
        {...props}
    />
));
TableFooter.displayName = "TableFooter";
