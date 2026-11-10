import { type ComponentProps } from "react";
import { TableSectionActiveFilters } from "~/global/components/table-section/active-filters";
import { TableSectionSearchAndFilters } from "~/global/components/table-section/search-and-filters";
import { TableSectionActions } from "~/global/components/table-section/table-section-actions";
import { TableSectionFooter } from "~/global/components/table-section/table-section-footer";
import { TableSectionHeader } from "~/global/components/table-section/table-section-header";
import { cn } from "~/global/utils/cn";

export const TableSection = ({
    children,
    className,
    ...otherProps
}: ComponentProps<"div">) => {
    return (
        <div
            {...otherProps}
            className={cn("overflow-hidden flex flex-col h-full bg-surface p-0 border-outline rounded-2xl border", className)}
        >
            {children}
        </div>
    );
};

TableSection.Actions = TableSectionActions;
TableSection.Header = TableSectionHeader;
TableSection.Footer = TableSectionFooter;
TableSection.SearchAndFilter = TableSectionSearchAndFilters;
TableSection.ActiveFilters = TableSectionActiveFilters;
