import { type ColumnDef } from "@tanstack/react-table";
import {
    type ComponentProps,
    type ComponentPropsWithoutRef,
    useCallback,
    useEffect,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TableBody } from "~/global/components/table/table-body";
import { TableCell } from "~/global/components/table/table-cell";
import { TableFooter } from "~/global/components/table/table-footer";
import { TableHead } from "~/global/components/table/table-head";
import { TableHeader } from "~/global/components/table/table-header";
import { TableDataLoading } from "~/global/components/table/table-loading";
import { TableRow } from "~/global/components/table/table-row";
import { cn } from "~/global/utils/cn";
import { createContext } from "~/global/utils/create-context";

/**
 * ColumnConfig type - Configuration for table columns
 */
export type ColumnConfig<TData> = Omit<ColumnDef<TData>, "cell"> & {
    accessorKey: keyof TData;
};

/**
 * TableRowIdentity type - Interface for row objects requiring an ID
 */
export type TableRowIdentity = {
    id: string | number;
};

interface TableProps<TData> extends ComponentPropsWithoutRef<"table"> {
    data: TData[];
    onRowSelect?: (rows: TData[]) => void;
    wrapperClass?: string;
    disableRowSelection?: boolean;
}

const [TableProviderBase, useContext] = createContext<{
    data: unknown[];
    isRowSelected: (rowId: string) => boolean;
    disableRowSelection?: boolean;
}>("Table");

/**
 * Hook to access table context
 * Provides access to the table data and selection state
 */
export const useTableContext = <TData extends TableRowIdentity>() =>
    useContext("Table") as {
        data: TData[];
        isRowSelected: (rowId: string) => boolean;
        disableRowSelection?: boolean;
    };

/**
 * Creates a reusable table component with type-safe rows.
 *
 * @template T - The type of data each row will contain
 * @returns A Table component with Header and Body sub-components
 *
 * @important
 * Always create your table component OUTSIDE of your consumer component
 * to prevent unnecessary re-creation and re-rendering on state changes.
 * Failure to do so will lead to unexpected behavior like loss of selection state.
 *
 * @example
 * // ✅ CORRECT: Create table outside component
 * const UserTable = createTable<User>();
 *
 * function UserListComponent() {
 *   const [filters, setFilters] = useState([]);
 *   // When filters change, the table component isn't re-created
 *   return (
 *     <UserTable data={users}>
 *       <UserTable.Header headers={headers} />
 *       <UserTable.Body>{(user) => <UserRow user={user} />}</UserTable.Body>
 *     </UserTable>
 *   );
 * }
 *
 * // ❌ INCORRECT: Creating table inside component
 * function UserListComponent() {
 *   // DON'T DO THIS - table gets re-created on every render
 *   const UserTable = createTable<User>();
 *   const [filters, setFilters] = useState([]);
 *   // When filters change, selection state is lost!
 *   return (
 *     <UserTable data={users}>
 *       <UserTable.Header headers={headers} />
 *       <UserTable.Body>{(user) => <UserRow user={user} />}</UserTable.Body>
 *     </UserTable>
 *   );
 * }
 */

export const createTable = <TData extends TableRowIdentity>() => {
    const Table = ({
        className,
        data,
        onRowSelect,
        wrapperClass,
        disableRowSelection = true,
        ...props
    }: TableProps<TData>) => {
        const form = useForm<{ rows: TData[] }>({
            defaultValues: {
                rows: [],
            },
        });

        const rows = form.watch("rows");

        useEffect(() => {
            onRowSelect?.(rows);
        }, [onRowSelect, rows]);

        // Function to check if a row is selected by its ID
        const isRowSelected = useCallback(
            (rowId: string) => {
                return rows.some((row) => row.id === rowId);
            },
            [rows]
        );

        return (
            <FormProvider {...form}>
                <TableProviderBase
                    data={data}
                    isRowSelected={isRowSelected}
                    disableRowSelection={disableRowSelection}
                >
                    <div
                        className={cn(
                            "relative w-full shrink-0 overflow-auto",
                            { "h-full shrink": data.length },
                            wrapperClass
                        )}
                    >
                        <table
                            className={cn(
                                "w-full caption-bottom text-sm",
                                className
                            )}
                            {...props}
                        />
                    </div>
                </TableProviderBase>
            </FormProvider>
        );
    };

    const GenericTableBody = (
        props: ComponentProps<typeof TableBody<TData>>
    ) => <TableBody<TData> {...props} />;

    Table.Head = TableHead;
    Table.Header = TableHeader;
    Table.Body = GenericTableBody;
    Table.Cell = TableCell;
    Table.Footer = TableFooter;
    Table.Row = TableRow;
    Table.Loading = TableDataLoading;

    return Table;
};
