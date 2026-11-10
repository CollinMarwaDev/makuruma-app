import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "~/global/components/button";
import { ComponentCard } from "~/global/components/component-card";
import { ExportIcon } from "~/global/components/icons";
import { Pagination } from "~/global/components/pagination";
import { type Filter, TableSection } from "~/global/components/table-section";
import { createTable } from "~/global/components/table/table";
import type { ColumnHeader } from "~/global/components/table/table-header";
import {
    type User,
    users,
} from "~/pages/components-playground/table/table-data";
import { UserListItem } from "~/pages/components-playground/table/user-list-item";
import { useSearchParamsState } from "~/global/utils/r3/hooks";

const columnHeaders: ColumnHeader[] = [
    { id: "email", label: "Email" },
    { id: "name", label: "Name" },
    { id: "role", label: "Role" },
    { canSort: false, id: "actions", label: "" },
];

const Table = createTable<User>();

const TableComponent = () => {
    const [activeFilters, setActiveFilters] = useSearchParamsState();

    const filters: Filter[] = [
        {
            label: "Project",
            onClick: () => setActiveFilters({ project: "banc" }),
        },
        {
            label: "Status",
            onClick: () => setActiveFilters({ status: "pending" }),
        },
        {
            label: "Date",
            onClick: () => setActiveFilters({ date: "12-02-2012" }),
        },
    ];

    console.log(activeFilters);

    return (
        <ComponentCard title="Table component">
            <TableSection>
                <TableSection.Header className={"pb-0"}>
                    <TableSection.SearchAndFilter filters={filters} />
                    <TableSection.Actions>
                        <Button
                            variant={"outline"}
                            className={
                                "text-primary-shades-600 flex items-center gap-2 py-2.5"
                            }
                        >
                            <ExportIcon className={"size-4"} />
                            <p>Export </p>
                        </Button>
                        <Button className={"flex items-center gap-2 py-2.5"}>
                            <PlusIcon strokeWidth={2.5} className={"size-4"} />
                            <p>New customer </p>
                        </Button>
                    </TableSection.Actions>
                </TableSection.Header>
                <TableSection.ActiveFilters className={"pb-3"} />
                {/* Example with row selection enabled (default) */}
                <Table data={users}>
                    <Table.Header headers={columnHeaders} />
                    <Table.Body>
                        {(user) => <UserListItem user={user} />}
                    </Table.Body>
                </Table>

                <TableSection.Footer>
                    <Pagination totalPages={4} />
                </TableSection.Footer>
            </TableSection>
        </ComponentCard>
    );
};

export default TableComponent;
