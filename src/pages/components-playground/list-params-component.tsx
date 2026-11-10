import { ComponentCard } from "~/global/components/component-card";
import { createTable, type ColumnHeader } from "~/global/components/table";
import { TableSection } from "~/global/components/table-section";
import { Pagination } from "~/global/components/pagination";
import { EmptyState } from "~/global/components/empty-state";
import { useListParams, type ListConfig } from "~/global/hooks/use-list-params";

type Row = { id: number; name: string; region: string; tons: number };

const ROWS: Row[] = Array.from({ length: 23 }, (_, i) => ({
    id: i + 1,
    name: `Truck T${String(100 + i)}`,
    region: ["Dar", "Tanga", "Mbeya"][i % 3],
    tons: 20 + (i % 13),
}));

const LIST: ListConfig<Row> = {
    filters: { region: (row, value) => row.region === value },
    pageSize: 5,
    search: (row) => [row.name, row.region],
    sort: { name: (row) => row.name, tons: (row) => row.tons },
};

const HEADERS: ColumnHeader[] = [
    { id: "name", label: "Name" },
    { canSort: false, id: "region", label: "Region" },
    { id: "tons", label: "Tons" },
];

const DemoTable = createTable<Row>();

/** `useListParams`: client-side search, filters, sort and paging kept in the URL. */
export const ListParamsComponent = () => {
    const { filteredCount, pageRows, setFilter, totalPages } = useListParams(ROWS, LIST);

    return (
        <ComponentCard title="useListParams (search, filter, sort, paging)">
            <TableSection>
                <TableSection.Header className="pb-0">
                    <TableSection.SearchAndFilter
                        placeholder="Search name or region"
                        filters={[
                            {
                                label: "Region",
                                onClick: () => undefined,
                                subItems: ["Dar", "Tanga", "Mbeya"].map((r) => ({ label: r, onClick: () => setFilter("region", r) })),
                            },
                        ]}
                    />
                </TableSection.Header>
                <TableSection.ActiveFilters exclude={["sortBy", "sortOrder"]} />
                {filteredCount === 0 ? (
                    <EmptyState className="py-8" noDataTitle="No rows" noDataText="Add rows to see them here." searchNotFoundText="Nothing matches." />
                ) : (
                    <DemoTable data={pageRows}>
                        <DemoTable.Header headers={HEADERS} />
                        <DemoTable.Body>
                            {(row) => (
                                <DemoTable.Row rowId={String(row.id)}>
                                    <DemoTable.Cell>{row.name}</DemoTable.Cell>
                                    <DemoTable.Cell>{row.region}</DemoTable.Cell>
                                    <DemoTable.Cell>{row.tons}</DemoTable.Cell>
                                </DemoTable.Row>
                            )}
                        </DemoTable.Body>
                    </DemoTable>
                )}
                {totalPages > 1 && (
                    <TableSection.Footer>
                        <Pagination totalPages={totalPages} />
                    </TableSection.Footer>
                )}
            </TableSection>
        </ComponentCard>
    );
};
