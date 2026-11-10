import { type ComponentProps, Fragment, type ReactNode } from "react";
import {
    type TableRowIdentity,
    useTableContext,
} from "~/global/components/table/table";
import { cn } from "~/global/utils/cn";

/**
 * Children type - Function type for rendering table body children
 */
type Children<TData> = (row: TData, index: number) => ReactNode;

/**
 * TableBodyProps interface - Props for the TableBody component
 */
interface TableBodyProps<TData>
    extends Omit<ComponentProps<"tbody">, "children"> {
    children: Children<TData> | ReactNode;
}

/**
 * TableBody component - Renders the table body section (<tbody>)
 * Maps through data to render rows
 */
export const TableBody = <TData extends TableRowIdentity>({
    className,
    children,
    ...props
}: TableBodyProps<TData>) => {
    const { data } = useTableContext<TData>();

    return (
        <tbody
            className={cn("[&_tr:last-child]:border-b-0", className)}
            {...props}
        >
            {typeof children === "function"
                ? data.map((row, index) => (
                      <Fragment key={row.id}>{children(row, index)}</Fragment>
                  ))
                : children}
        </tbody>
    );
};
