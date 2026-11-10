# Tasks — global-kit-list-pages

Status: in progress (approved 2026-11-10). Plan: approved 2026-11-10 (incl. `use-list-params`).
Every task: check `src/global` (components, hooks, utils) first; reuse before adding.
Every phase ends with: `pnpm typecheck` · `pnpm lint` · `pnpm build` · Playwright light + dark · one commit.

## Shared pieces (added in Phase 1)

- `global/hooks/use-list-params.ts` (+ `distinctValues`) — approved global hook.
- `components/common/details-slide-over.tsx` + `use-details-param.ts` — one `?details=<id>` param for every page's View slide-over (instead of `?client=`, `?driver=` …), excluded from filter chips.
- `components/common/use-fetch-list.ts` — load/error/refresh for list pages (nothing equivalent in `src/global`).
- `components/common/record-table-section.tsx` — TableSection + SearchAndFilter + ActiveFilters + createTable + EllipsisMenu + EmptyState + Pagination for any record list.
- `components/common/crud-list-page.tsx` — page frame (`list-page.tsx`), form modal (`form-modal.tsx`), View slide-over and confirmed delete for simple record lists.
- `components/common/use-confirm-action.ts` — global confirmation → action → toast.
- `components/common/{expiry-badge,documents-card}.tsx` — document expiry badges and document list with View.
- Global tweak: confirmation modal OK button is red for `error`, green for `success`, orange for `warning`.

## Phase 1 — shared hook + Clients pilot

- [x] T1.1 `global/hooks/use-list-params.ts`: search (debounced via URL `q`), filters, sort (`sortBy`/`sortOrder`), page (`currentPage`), `pageSize`; returns `params, setFilter, filtered, pageRows, totalPages`. Done when: typed, no `any`, used by Clients.
- [x] T1.2 Playground card for `useListParams` (small demo list). Done when: visible on `/components/playground`.
- [x] T1.3 `components/clients/clients-table-section.tsx`: TableSection, SearchAndFilter (filter: advance invoicing), ActiveFilters, createTable, EllipsisMenu (View, Edit, Delete), EmptyState, Pagination.
- [x] T1.4 `components/clients/client-details.tsx`: slide-over body (`LabelValueListItem`).
- [x] T1.5 `pages/Clients.tsx`: PageHeader, ErrorFallback, GeneralErrorBoundary, SlideOver `?client=`, `useConfirmation` delete, `toast`; form stays in `components/ui/Modal`.
- [ ] T1.6 Screenshots to you for sign-off before Phase 2.

## Phase 2 — simple lists

- [x] T2.1 Vendors: search company/phone; filter vendor type; View/Edit/Delete ✓; `?vendor=`.
- [x] T2.2 Staff: search name/phone/TIN; filter has attachment; View (attachment link)/Edit/Delete ✓; `?staff=`.
- [x] T2.3 Drivers: search name/phone; filter document expiring (≤30 days / expired); View (documents with expiry badges)/Edit/Delete ✓; `?driver=`.
- [x] T2.4 Users: search name/email/phone; filters role, status; View/Edit/Reset password ✓/Delete ✓; `?user=`.
- [x] T2.5 Profile: global password inputs; remove `components/ui/PasswordInput.tsx` if unused.

## Phase 3 — Assets

- [x] T3.1 `pages/Assets.tsx`: `TabLinks` `?tab=trucks|trailers|office`.
- [x] T3.2 Trucks: search reg no/trailer/driver; filters trip status, missing trailer/driver, document expiring; View/Edit/Delete ✓; `?truck=`.
- [x] T3.3 Trailers: search reg no; filter document expiring; View/Edit/Delete ✓; `?trailer=`.
- [x] T3.4 Office assets: search name/serial/location; filters category, condition; View/Edit/Delete ✓; `?asset=`.

## Phase 4 — read-mostly pages

- [x] T4.1 Trips: search trip code/truck/bookings/clients; filters status, client; View slide-over (go + return legs, status badges); `?trip=`.
- [x] T4.2 Reports: search truck/trailer/driver; status filter; one page-level year (global `SelectInput`, `?year=`) + Download per row; toast on error.
- [x] T4.3 Reconciliation: `TabLinks` `?tab=clients|vendors`; both tables on kit; filter "outstanding only"; statement/ledger downloads; Record payment keeps its modal.

## Phase 5 — Invoices and Expenses

- [ ] T5.1 Invoices: search invoice no/booking/client; filters type, status, client; View slide-over (lines with per-truck route/cargo/ETA, `uninvoiced_trucks` from invoice-per-truck-details); Edit, Download, Confirm payment ✓, Delete ✓; `?invoice=`.
- [ ] T5.2 Expenses: `TabLinks` `?view=all|trip|office|truck` (counts in label); search order no/reference/created by; filters status, line category, date from/to (global `DatePicker`); View slide-over (lines, approval trail); Edit, Approve ✓, Reject ✓, Mark paid ✓, Delete ✓ (keeps existing warning text), downloads; `?expense=`.

## Phase 6 — cleanup and docs

- [ ] T6.1 Delete unused: `components/{Trips,Staff,Driver,Client,Vendor,User,Truck,Trailer,OfficeAsset,Invoice,Expense}Table.tsx`, `components/ui/{TableSkeleton,Badge,Skeleton}.tsx` (only if no imports).
- [ ] T6.2 Grep gate: no `window.confirm`, `alert(`, `TableSkeleton`, `components/ui/Badge` in `src/pages`, `src/components`.
- [ ] T6.3 Update `component-catalog` skill (useListParams, slide-over details pattern); `FEATURES.md` → done.
- [ ] T6.4 Sync to Mac, commit per phase on `feature/contract-booking-tracking`.

## Badge mapping (all pages)

- pending/draft → `default` · approved/in progress/go → `warning` · paid/completed/active → `success` · rejected/overdue/expired → `danger` · inactive/off duty → `disabled`.
