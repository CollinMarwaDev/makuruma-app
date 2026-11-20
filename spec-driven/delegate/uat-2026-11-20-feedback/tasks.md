# Tasks

Plan: `plan.md` (approved 20 Nov 2026). Each task: done when its check passes. Checkpoint review after each phase.

## Phase 1 — Booking (req. 1, 2)

- [x] T1 Migration `bookings.booking_date` + backfill (avg truck ETA, else created_at). Done: migrate/rollback clean on MySQL.
- [x] T2 Booking date set in `BookingTruckService::syncSummary` (runs after every create/update/add/remove; no separate service needed). Done: test — dates 1 Dec + 31 Dec → 16 Dec; no ETAs → created date.
- [x] T3 `BookingNumberGenerator` uses booking date month/year for new bookings; existing numbers untouched on edit. Done: test — ETAs in Jan 2027 → number ends 012027; editing ETAs keeps number.
- [x] T4 Dashboard monthly + this-month and TruckProfitReport year use `booking_date`. Done: tests updated/passing.
- [x] T5 Web: ETA same-for-all / different (`booking-form-utils`, `mode-fields`, `booking-trucks-table`, `booking-form`, `use-manage-booking-form`); edit form derives the mode from rows. Booking month shown on details. Done: typecheck; manual create/edit both modes.

## Phase 2 — Tracking (req. 3–6)

- [x] T6 `config/tracking.php` + `.env.example TRACKING_OFFLOADED_VISIBLE_DAYS=1`; `BookingTruck::on_active_list` appended. Done: test — offloaded today/yesterday on, 2 days ago off; N=2 keeps it.
- [x] T7 Web `use-tracking-list.ts` uses `on_active_list` for Active/Go/Return lists and counts. Done: typecheck.
- [x] T8 `TrackingWorkbook` status drop-down (hidden `Statuses` sheet, validation on G both sheets, stop error). Done: test reads validation back from the file; import still rejects bad text.
- [x] T9 `BookingNeedsService` + `GET /tracking/booking-needs` (urgent = legs still on the road; an offloaded truck with no next booking is under Unbooked, "Next booking" Go/Return). Done: tests — unbooked (no leg / all offloaded / inactive excluded); urgent Go (K/lesa Zambia arrival, Sakania Zambia via location, has Return → excluded); urgent Return (Nakonde arrival, later Go → excluded).
- [x] T10 Web tabs "Unbooked" and "Needs booking" (`booking-needs-section.tsx`, service + Zod schema, counts, search, empty state, "Create booking" link → `/bookings?new=go|return` opens the form). Done: typecheck, light/dark check.

## Phase 3 — Expense rules (req. 7–12)

- [x] T11 Migration: reference_no unique per expense_type (no duplicate guard needed: it was unique across all types). `form_number` accessor; validation scoped per type. Done: test — same ref allowed across types, rejected within a type.
- [x] T12 Use form number in PDFs "NO:", Excel, download file names (API + web), list column/search, confirm texts; form label. Done: test — PDF file name uses reference.
- [x] T13 Fuel driver optional + auto-fill from leg/truck driver (API); web pre-fill, no blocking. Done: test — blank driver saved as the truck's driver.
- [x] T14 Mark paid with date (`paid_at` required, ≤ today) API + web dialog; details "Paid on". Done: tests — future date rejected; dashboard paid-this-month uses it.
- [x] T15 Approver may edit approved unpaid order (API rule + web menu). Done: tests — approver 200, other user 422, paid 422; status stays approved.
- [x] T16 Migration `expense_lines.filled_at`; fuel line Filling date (API + `fuel-lines.tsx`); `VendorLedgerExport` date = filled_at ?? payment_date ?? created_at. Done: test — ledger row dated by filling date.
- [x] T17 Payee required on Vibali lines (new/edited orders); `printData.payeeTotals`; "To driver / Stays with agent" rows in `vibali-lines`. Done: tests — missing payee 422; totals per currency.

## Phase 4 — Printouts (req. 14, 15)

- [x] T18 Font +20% in all PDF heads (6 style blocks; Vibali/Other forms share one); Vibali pages get tighter margins/padding so 123 and 165 stay one page; 129 truck lists also four per row. Done: render each sample (123, 129, 165, 163, 180, VC-00001, fuel, other, mizani, invoice, tracking report, access list) and inspect.
- [x] T19 `ExpenseFormSheet` renders the order's PDF view and writes it cell by cell (money as numbers with currency format); both Excel downloads use it; the old exports stay only for orders saved before the typed forms (mixed lines). View choice moved to `ExpensePrintout` (shared by PDF and Excel). Done: tests — Excel totals 885 / 760 / 40,290 and truck lists match printData; opened and inspected.

## Phase 5 — Expenses performance (req. 13)

- [x] T20 API slim `index` (list fields, truck_reg_nos, line_categories; filters expense_type/form/status). Done: test — no `lines` key in list. Measured (80 orders): 626 KB / 198 ms → 50 KB / 35 ms.
- [x] T21 Web `ExpenseListItem` type; list uses it; details/edit/pricing/downloads load `GET /expense-orders/{id}`. Done: typecheck; manual flow each action.
- [x] T22 Expense form: slim parent-order fetch, slim bookings/trucks fetches. Done: `?for=expense` bookings/trucks (Zod-checked); bookings 4.5 KB → 0.6 KB on test data; parent picker filtered on the server.

## Phase 6 — Verification

- [x] T23 `php artisan test` (MySQL) 48 passed; `pnpm typecheck`, `pnpm build` pass; `pnpm lint` 0 errors (34 older warnings in `src/global`, none in changed files). Screens checked in a browser on demo data, light and dark.
- [x] T24 Update `FEATURES.md` (status done), project notes, deploy notes (backup, rehearsal on a copy, `.env`, fresh tracking Excel).

## Deploy notes

1. Back up the live database (as for the 17 Nov releases) and rehearse `php artisan migrate` on a copy: 3 migrations
   (`2026_11_20_0900xx`: bookings.booking_date + backfill, expense reference unique per type, expense_lines.filled_at).
2. `.env`: add `TRACKING_OFFLOADED_VISIBLE_DAYS=1`; then `php artisan config:clear` (or `config:cache`).
3. Deploy backend + web app together (the list endpoint changed shape: `GET /expense-orders` returns list rows).
4. After deploy: open Expenses (list, details, mark paid with a date), a Vibali Congo emergency PDF and Excel, Tracking
   Unbooked / Needs booking, a booking with ETA "Same for all"; check `storage/logs`.
5. Tell users: download a fresh tracking Excel (status drop-down); Vibali lines now need "Money goes to"; the reference no.
   is the printed form number and must be unique within its expense type; dashboard booking months follow the average ETA.
