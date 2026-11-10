# Requirements — global-kit-list-pages

Status: confirmed 2026-11-10

## Goal

Every list page uses the global kit (`src/global`) the same way Bookings and Tracking already do: one table pattern, one search + filter pattern, one empty state, one error boundary, slide-over details and a confirmation modal for destructive or approval actions.

## Pages in scope

| Page | Today | Table(s) |
| --- | --- | --- |
| Trips | `TripsTable` | trips |
| Assets | tabs → `Trucks`, `Trailers`, `OfficeAssets` | trucks, trailers, office assets |
| Staff | `StaffTable` | staff |
| Drivers | `DriverTable` | drivers |
| Clients | `ClientTable` | clients |
| Vendors | `VendorTable` | vendors |
| Expenses | `ExpenseTable` + local tabs and date inputs | expense orders |
| Invoices | `InvoiceTable` | invoices |
| Reconciliation | inline `<table>` × 2 | client balances, vendor balances |
| Reports | inline `<table>` | truck reports |
| Users | `UserTable` | users |
| Profile | old `components/ui/PasswordInput` | — (form only) |

## Functional requirements

- R1 Table: `createTable<T>()` (Header with sortable columns, Body, Row, Cell, Loading) inside `TableSection`.
- R2 Search + filters: `TableSection.Header` + `TableSection.SearchAndFilter` at the top of each table; `TableSection.ActiveFilters` chips under it. State lives in the URL (`useSearchParamsState`). Filters per page are listed in `plan.md`.
- R3 Tabs: views that today use local tab buttons (Assets, Expenses categories, Reconciliation clients/vendors) use the global `TabLinks` (`?view=` / `?tab=`).
- R4 Pagination: global `Pagination` when a list has more than one page.
- R5 Empty state: global `EmptyState` (no data vs. no search match) on every table.
- R6 Errors: page load errors render `ErrorFallback`; each table section and each slide-over/modal body is wrapped in `GeneralErrorBoundary`.
- R7 Row actions: global `EllipsisMenu` (or `Button`/`ButtonIcon` when there is a single action).
- R8 View details: records that have a "view" action open in the global `SlideOver` (id kept in the URL, e.g. `?driver=12`) instead of a modal or a new page.
- R9 Confirmation: every delete, reject, approve, mark-paid, confirm-payment and reset-password action asks first through `useConfirmation` (global `ConfirmationProvider`). No `window.confirm`.
- R10 Feedback: success/failure via global `toast`. No `alert()`.
- R11 Buttons, badges, inputs: global `Button` variants, `Badge` variants (status colours only via `default | warning | danger | success | disabled`), `form-controls/*`.
- R12 Profile: password fields use the global password input (`TextInputBasic type="password"` / `RenderFormField`); remove `components/ui/PasswordInput` if unused.
- R13 Light and dark mode both checked on every page.

## Rules for the implementer

- Check `src/global/components`, `src/global/hooks` and `src/global/utils` (incl. `utils/r3`) before writing any component, hook or helper. Reuse first; extend a global piece only when nothing fits, and record why.
- Page-specific list logic goes in `components/<feature>/use-<feature>-list.ts` (same shape as `use-booking-list.ts`, `use-tracking-list.ts`).
- No new API endpoints unless a filter cannot be done client-side; any such case goes back for approval (backend-boundary skill).
- Existing forms stay unchanged unless a requirement above touches them.

## Out of scope

- Redesigning forms (BookingForm-style rewrites) beyond swapping `Modal`/confirm/toast.
- Backend changes.
- Invoice PDF / trip sheet route details when trucks differ (separate decision).

## Assumptions

- "Filter button and input on the top" = search box and Filter button in the table header, as on Bookings and Tracking.
- Lists stay client-side filtered (current API returns full lists).
- Old `components/*Table.tsx` and `components/ui/{TableSkeleton,Badge,PasswordInput}` are deleted once nothing imports them.

## Done when

- All pages above meet R1–R13; no `window.confirm`, `alert(` or `components/ui/TableSkeleton` imports remain in `src/pages`.
- `pnpm typecheck`, `pnpm lint`, `pnpm build` pass; Playwright check of each page in light and dark.
