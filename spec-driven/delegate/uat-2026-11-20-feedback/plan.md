# Plan

Requirements: `requirements.md` (confirmed 20 Nov 2026). Backend = `makuruma-backend`, web = `makuruma-app`.

## Data model (one migration each, reversible)

- `bookings.booking_date` (date, nullable): average ETA of the booking's trucks; backfill = average truck ETA, else `created_at`. (req. 2)
- `expense_lines.filled_at` (date, nullable). (req. 11)
- `expense_orders`: reference_no unique per `expense_type` instead of globally (drop old unique, add composite); migration aborts with a list if live data has duplicates within a type. (req. 7)
- No change for paid date: `paid_at` holds the date the user enters. (req. 9)

## Phase 1 — Booking (req. 1, 2)

- Web `booking-form-utils.ts`: add `eta` to `SHARED_FIELDS` / labels / `EMPTY_SHARED` / `ALL_SAME`; date input in `mode-fields.tsx`; `booking-trucks-table.tsx` shows the ETA column only when "Different"; copy text in `booking-form.tsx` ("ETA is always per truck" removed). Same-for-all writes the value to every truck row (API unchanged: per-truck `eta`).
- API `BookingDateService::sync(Booking)` (average of truck ETAs, fallback created_at) called after create/update/add/remove truck in `BookingController`.
- `BookingNumberGenerator::generate()` takes the booking date for the MMYYYY part (new bookings only; existing numbers never change).
- Dashboard "this month" + monthly trend, `TruckProfitReportExport` year filter: use `booking_date` instead of `created_at`.
- Booking list/details show "Booking month".

## Phase 2 — Tracking (req. 3–6)

- `config/tracking.php` `offloaded_visible_days` ← `.env TRACKING_OFFLOADED_VISIBLE_DAYS` (default 1).
- `BookingTruck` appended `on_active_list`: not offloaded, or offloaded and today ≤ offloading_date + N days. Web `use-tracking-list.ts` uses it for Active/Go/Return tabs and counts; Offloaded tab unchanged. Excel download already takes the legs on screen.
- `TrackingWorkbook::export()`: hidden sheet `Statuses` with active status labels; list data validation on column G of GOING and RETURN (header row+1 … +500), error style "Stop" with message "Pick a status from the list".
- API `GET /tracking/booking-needs` → `{ unbooked: [...], urgent: [...] }` in new `BookingNeedsService`:
  - unbooked: active trucks with no non-offloaded leg; last leg (booking no., direction, offloading date), last location, days idle.
  - urgent: Go legs whose trip has no Return leg and that have an arrival at Kasumbalesa Zambia/Sakania Zambia or current location naming Kasumbalesa/K/lesa/Sakania; Return legs with arrival at Nakonde or location naming Nakonde and no later Go leg for the truck. Each row: truck, driver, booking, leg, reached where/when.
- Web: two more tabs on Tracking ("Unbooked", "Needs booking") rendered by new `booking-needs-section.tsx` (global Table, search, empty state); counts on the tab links; "Create booking" action links to the booking form.

## Phase 3 — Expense rules (req. 7–12)

- Reference as form number: `ExpenseOrder` accessor `form_number` = reference_no ?: order_number; PDFs ("NO:"), Excel, download file names, list "Order" column, confirmations and search use it. Form label "Form number (reference)". Validation `unique` scoped by expense_type.
- Fuel driver: `ExpenseOrderRules` drops the driver-required check; on save, a blank `driver_name` is filled from the leg's driver (trip) or the truck's driver (truck). Web fuel form pre-fills and no longer blocks on a blank driver.
- Mark paid: `markPaid` accepts `paid_at` (required date, ≤ today); web replaces the confirm with a small dialog (date input, default today) reusing `ConfirmDialog`/form pattern of `price-update-dialog.tsx`. Details show "Paid on".
- Approver edit: `update` allows status `approved` when `approved_by` = current user and not paid (`ExpenseOrderRules::canEdit`); status stays approved. Web shows Edit for that user.
- Filling date: optional date per fuel line (`fuel-lines.tsx`), saved in `filled_at`; `VendorLedgerExport` dates fuel debits by `filled_at` ?? order payment_date ?? created_at.
- Payee: required (driver/agent) on Vibali lines in API and form (label "Money goes to"); existing lines without payee are only required when the order is edited. `ExpenseAmountCalculator::printData` adds `payeeTotals` per currency; `vibali-lines` partial prints "To driver" / "Stays with agent" rows under the totals.

## Phase 4 — Printouts (req. 14, 15)

- Font +20% in every PDF head: `expenses/partials/vibali-head`, `fuel-pdf`, `order-pdf`, `other-pdf`, `other-mizani-pdf`, `invoices/invoice-pdf`, `tracking/report-pdf`, `bookings/access-list-pdf`; check each sample still fits A4 pages.
- New `App\Exports\ExpenseFormSheet` writes the same blocks as the PDFs from `printData` (Vibali: title, NO, line table with currency subtotals/conversions/grand total, truck lists four per row, per-truck table, payee totals) or the fuel/other PDF table (fuel with/without price as the PDF dialog). `ExpenseOrderExport` and `LineCategoryExpenseExport` (category = that category's lines) both use it; `FuelExpenseExport` retired if unused.

## Phase 5 — Expenses performance (req. 13)

- `index`: slim list rows — header fields, bookings (number, client), creator/approver names, computed `truck_reg_nos`, `line_categories`, flags; no lines, price changes, trips or documents. Optional filters (`expense_type`, `form`, `status`) kept.
- Web: `ExpenseListItem` type for the list; details, edit, pricing and downloads load `GET /expense-orders/{id}` (`useExpenseOrder(id)`) when opened.
- Expense form: parent-order picker uses `?expense_type=vibali_congo&form=go` (slim); bookings fetch uses the existing open-bookings filter if available, else a slim `?for=expense` variant; trucks without `driver.documents`.
- Measure: list payload size and request time before/after on a copy of live data.

## Phase 6 — Verification

- Feature tests: booking date + number month; ETA same-for-all round-trip; on_active_list window; status validation present in the Excel; booking-needs rules (both directions, negatives); reference unique per type + file names; driver auto-fill; paid date; approver edit allowed / others blocked; ledger uses filled_at; payee required + totals; Excel mirrors PDF figures (885 / 760 samples).
- `php artisan test` (MySQL), `pnpm typecheck`, `pnpm build`, `pnpm lint`; render each PDF sample and look at it.
- Deploy notes: backup, migrations rehearsed on a copy, `.env TRACKING_OFFLOADED_VISIBLE_DAYS=1`, users download a fresh tracking Excel.

## Risks

- Changing the report year/month basis to `booking_date` moves some bookings between months in existing dashboards — expected, noted for the client.
- Larger fonts can push long Vibali forms onto a second page; checked per sample.
- "Location names Kasumbalesa/Nakonde" matching depends on how users type locations; arrival dates are the reliable signal.
