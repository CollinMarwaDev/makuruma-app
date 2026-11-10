# Plan — global-kit-list-pages

Status: draft (awaiting `approved`). Requirements: confirmed 2026-11-10.

## Reference pattern (copy, don't reinvent)

- Page: `pages/Bookings.tsx` / `pages/Tracking.tsx` — `PageHeader`, `ErrorFallback` on load error, `GeneralErrorBoundary` around the section and every modal/slide-over body, `useConfirmation`, `toast`.
- Section: `components/bookings/bookings-table-section.tsx` — `TableSection` + `SearchAndFilter` + `ActiveFilters` + `createTable` + `EllipsisMenu` + `EmptyState` + `Pagination`.
- List state: `components/bookings/use-booking-list.ts` — URL params via `useSearchParamsState`.
- Detail: `SlideOver` (Panel/Header/Content/Footer) with the id in the URL (`?leg=` in Tracking).

## Global pieces reused (checked in src/global)

- components: `table`, `table-section`, `pagination`, `empty-state`, `error-boundary`, `slider-over`, `tab-link`, `ellipsis-menu`, `badge`, `button`, `page-header`, `card`, `label-value-list-item`, `details-layout`, `form-controls/*`, `loaders`.
- hooks/utils: `useSearchParamsState`, `useDebounce` (r3/hooks), `getErrorMessage` (r3/utils), `toast`, `useConfirmation`, `date-utils`, `string-utils`.

## One new global hook (needs approval)

- `global/hooks/use-list-params.ts` — `useListParams(rows, { search: (row) => string[], filters: Record<key, (row, value) => boolean>, sort: Record<key, (row) => string|number>, pageSize })` → `{ params, setFilter, filtered, pageRows, totalPages }`.
- Why: 13 lists need the same search/filter/sort/page logic; without it each page repeats ~50 lines (as `use-booking-list.ts` does). Bookings/Tracking keep their hooks (they add counts/views); no change there.

## Per-page design

| Page | Search on | Filters | Tabs | Row actions (confirm = ✓) | Slide-over "View" |
| --- | --- | --- | --- | --- | --- |
| Trips | trip code, truck, bookings, clients | status, client | — | View | trip: truck, go/return legs, status |
| Assets › Trucks | reg no, trailer, driver | trip status, has trailer/driver, compliance expiring | `TabLinks` `?tab=trucks/trailers/office` | View, Edit, Delete ✓ | truck + documents |
| Assets › Trailers | reg no | compliance expiring | (same tabs) | View, Edit, Delete ✓ | trailer + documents |
| Assets › Office | name, serial, location | category, condition | (same tabs) | View, Edit, Delete ✓ | asset details |
| Staff | name, phone, TIN | has attachment | — | View, Edit, Delete ✓ | staff + attachment |
| Drivers | name, phone | licence/document expiring | — | View, Edit, Delete ✓ | driver + documents |
| Clients | company, email, phone | advance invoicing yes/no | — | View, Edit, Delete ✓ | client details |
| Vendors | company, phone | vendor type | — | View, Edit, Delete ✓ | vendor details |
| Expenses | order no, reference, created by | status, line category, date from/to | `TabLinks` `?view=all/trip/office/truck` | View, Edit, Approve ✓, Reject ✓, Mark paid ✓, Delete ✓, downloads | order + lines + approvals |
| Invoices | invoice no, booking, client | type, status, client | — | View, Edit, Download, Confirm payment ✓, Delete ✓ | invoice + lines + trucks not yet invoiced on that booking |
| Reconciliation | client / vendor name | outstanding > 0 | `TabLinks` `?tab=clients/vendors` | Statement/ledger download, Record payment (modal) | — |
| Reports | truck, trailer, driver | — | — | Year select + Download | — |
| Users | name, email, phone | role, status | — | View, Edit, Reset password ✓, Delete ✓ | user details |
| Profile | — | — | — | Change password | — (global password inputs) |

- Status columns use `Badge` variants: pending/draft → `default`, approved/in progress → `warning`, paid/completed → `success`, rejected/overdue → `danger`, inactive → `disabled`.
- Forms keep their logic; they move from `components/ui/Modal` into the kit `Modal`? **No** — keep `components/ui/Modal` for forms in this feature (forms are out of scope); only View uses `SlideOver`.

## File layout (per feature, kebab-case)

- `components/<feature>/<feature>-table-section.tsx`, `components/<feature>/<feature>-details.tsx` (slide-over body); list hook only if `useListParams` is not enough.
- Pages stay in `pages/*.tsx` (thin: load, handlers, confirm, slide-over).
- Delete when unused: `components/*Table.tsx` (11), `components/ui/TableSkeleton.tsx`, `components/ui/Badge.tsx`, `components/ui/PasswordInput.tsx`, `components/ui/Skeleton.tsx` if unused.

## Phases

1. `useListParams` + Clients as pilot (smallest page) → review screenshots with you.
2. Vendors, Staff, Drivers, Users, Profile.
3. Assets (Trucks, Trailers, Office) with `TabLinks`.
4. Trips, Reports, Reconciliation.
5. Invoices, Expenses (most actions).
6. Remove dead components; update component-catalog skill; FEATURES.md → done.

## Verification

- Per phase: `pnpm typecheck`, `pnpm lint`, `pnpm build`; Playwright screenshots light + dark (list, search hit, no-match empty state, filter chip, slide-over, confirm dialog).
- Final grep: no `window.confirm`, `alert(`, `TableSkeleton`, `components/ui/Badge` in `src/pages` / `src/components`.

## Risks

- Large diff across shared files (`App.tsx` unchanged; `Sidebar` unchanged). Mitigation: one phase per commit.
- Lists are client-side; very large tables (expenses) may need server paging later — not in this feature.
