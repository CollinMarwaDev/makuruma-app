import { useMemo } from "react";
import { useSearchParamsState } from "~/global/utils/r3/hooks";

type Value = string | number | null | undefined;

export interface ListConfig<T> {
    /** Rows per page (default 10). */
    pageSize?: number;
    /** Values a row is searched on; the URL `q` param is matched case-insensitively against them. */
    search?: (row: T) => Value[];
    /** URL param name → predicate. A filter applies only while its param is set. */
    filters?: Record<string, (row: T, value: string) => boolean>;
    /** Column id (as in `ColumnHeader.id`) → sort value. */
    sort?: Record<string, (row: T) => string | number>;
    /** Used when the URL has no `sortBy`. */
    defaultSort?: { by: string; order: "asc" | "desc" };
}

type ListParams = Record<string, string | undefined> & {
    currentPage?: string;
    q?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

/**
 * Client-side search, filters, sort and paging for a table, all kept in the URL
 * (`q`, filter params, `sortBy`, `sortOrder`, `currentPage`) so a list view survives refresh and can be shared.
 * Works with `TableSection.SearchAndFilter`, `TableSection.ActiveFilters`, sortable `Table.Header` and `Pagination`.
 *
 * Define `config` outside the component (or memoise it) so the list is not recomputed on every render.
 */
export function useListParams<T>(rows: T[], config: ListConfig<T>) {
    const [params, setParams] = useSearchParamsState<ListParams>();

    return useMemo(() => {
        const term = params.q?.trim().toLowerCase() ?? "";
        const activeFilters = Object.entries(config.filters ?? {}).filter(([key]) => params[key]);

        const filtered = rows.filter((row) => {
            if (activeFilters.some(([key, matches]) => !matches(row, params[key] as string))) return false;
            if (!term || !config.search) return true;
            return config.search(row).some((value) => value != null && String(value).toLowerCase().includes(term));
        });

        const sortBy = params.sortBy ?? config.defaultSort?.by;
        const sortValue = sortBy ? config.sort?.[sortBy] : undefined;
        const order = params.sortBy ? (params.sortOrder ?? "asc") : (config.defaultSort?.order ?? "asc");
        const sorted = sortValue
            ? [...filtered].sort((a, b) => {
                  const [x, y] = [sortValue(a), sortValue(b)];
                  return (x < y ? -1 : x > y ? 1 : 0) * (order === "asc" ? 1 : -1);
              })
            : filtered;

        const pageSize = config.pageSize ?? 10;
        const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
        const page = Math.min(Math.max(1, Number(params.currentPage) || 1), totalPages);

        return {
            filtered: sorted,
            filteredCount: sorted.length,
            pageRows: sorted.slice((page - 1) * pageSize, page * pageSize),
            params,
            /** Apply (or clear with `undefined`) a filter and go back to page 1. */
            setFilter: (key: string, value: string | undefined) => setParams({ [key]: value, currentPage: undefined }),
            setParams,
            totalPages,
        };
    }, [rows, config, params, setParams]);
}

/** Distinct, sorted, non-empty values of a field — for filter sub-menus. */
export const distinctValues = <T>(rows: T[], pick: (row: T) => Value) =>
    [...new Set(rows.map(pick).filter((v): v is string | number => v != null && v !== "").map(String))].sort();
