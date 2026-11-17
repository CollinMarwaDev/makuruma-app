# Plan

Feature: expense-types-and-templates (req. 1–28). Order: foundation and fuel first, so they can ship even if templates slip.
Storage choice: keep one `expense_lines` row per truck, linked by `group_key` (the existing pattern). Trip and truck reports keep summing `expense_lines.amount` by `booking_truck_id`.

## Phase 1 — Backend foundation: types, numbering, lookups

Purpose: one type per order, a number series per type, multiple bookings, category rules, user-managed lookups (req. 1–6, 27, 28, 18 data).
Changes:
- Migrations (one per concern): `expense_orders` + `expense_type`, `form` (route|general|go|return|emergency|null), `serial`, `payment_mode`, `payment_account_id`, `vendor_id`, `route_template_id`, `parent_order_id`, `outbound_border`, `return_border`, `zmk_rate`, `usd_rate`, `other_subcategory_id`, `usd_total`; `expense_order_bookings` pivot; `expense_lines` + `multiplier`, `amount_description`, `is_flat`, `payee`; `payment_accounts`, `vendor_types` (vendors → `vendor_type_id`, e-seal → ECIL), `expense_subcategories`, `usd_rates` (from, to, rate).
- Backfill: `expense_type` from existing lines; mixed legacy orders keep their lines and stay read-only; `order_number` unchanged.
- `app/Services/ExpenseNumberGenerator.php` → per-type series (FUEL/VT/VC/OTH), `lockForUpdate` inside the store transaction, start value seeded per type.
- `app/Services/ExpenseOrderRules.php` (new): single type, category rules, bookings ↔ trucks, `initiated_by` = user.
- `ExpenseOrderController` store/update: new fields, bookings array; `initiated_by` taken from the user.
- New controllers + routes: `PaymentAccountController`, `VendorTypeController`, `ExpenseSubcategoryController`, `UsdRateController` (index/store/update/destroy; Admin/Manager/Accountant).
- Seeders: Cash, M-Pesa, CRDB; Fuel, ECIL; the 7 subcategories.
- `tests/Feature/ExpenseOrderRulesTest.php`.
Reused components: `TrackingStatusController` (managed-list pattern), `BookingTruckService` style for rules.
Done when: `php artisan migrate:fresh --seed` and `php artisan test` pass; the API rejects a mixed-type order; two FUEL orders get FUEL-…1, …2 while VT stays separate.

## Phase 2 — Form shell and settings UI

Purpose: type-first expense form with shared parts; screens for managed lists.
Changes:
- `src/types/expense.ts`, `src/services/expenseService.ts`, new `src/services/expense-settings-service.ts`.
- Split `src/components/ExpenseForm.tsx` into `src/components/expense-form/`: `expense-form.tsx` (type + category + header), `bookings-field.tsx` (multi-booking), `truck-set-field.tsx` (search + "Same for all"), `payment-account-field.tsx` (dropdown + add inline), `use-expense-form.ts`.
- `src/pages/ExpenseSettings.tsx` with tabs: Payment accounts, Vendor types, Subcategories, USD rates; route in `src/App.tsx`, `Sidebar.tsx`.
- `VendorForm.tsx`, `vendors-table-section.tsx`, `types/partner.ts`: vendor type from the list.
- `src/pages/Expenses.tsx`: type column/filter, new number shown.
Reused components: `truck-picker.tsx`, `src/pages/TrackingStatuses.tsx` pattern, `form-modal`, `combobox`, `TabLinks`, `createTable`.
Done when: an order of each type can be created with the shell (generic lines); initiated by is read-only; a new account/vendor type is added without a developer; `pnpm typecheck` and `pnpm build` pass.

## Phase 3 — Fuel

Purpose: req. 7–11.
Changes:
- Backend: fuel line rules (truck, driver, litres required; price optional); `payment_mode` defaults from the vendor; `PATCH expense-orders/{id}/prices` (any status before paid, `reason` required) → `expense_price_changes` table (old, new, reason, user, time); `markPaid` blocked while a price is missing.
- `app/Console/Commands/ExpensePendingPriceCheck.php` + `app/Notifications/ExpenseAlert.php`, scheduled in `routes/console.php` (idempotent, notified-at column); Accountants notified at 14 days.
- `resources/views/expenses/fuel-pdf.blade.php`; `download?show_price=0|1`.
- Frontend: `expense-form/fuel-lines.tsx`, `price-update-dialog.tsx` (reason), "Pending price"/"Overdue" badges + filter on Expenses, download dialog "Show price?", history in `expense-details.tsx`.
- `tests/Feature/ExpenseFuelPriceTest.php` (req. 9, 10).
Reused components: `TrackingDailyChecks` + `TrackingAlert` pattern, `useConfirmation`, `badge`, notifications UI.
Done when: a fuel order is saved without a price, shows Pending price, can't be paid, gets a price with a reason (history visible), and downloads with and without price columns; tests pass.

## Phase 4 — Vibali Tunduma: route templates, 123 and 129

Purpose: req. 12–20.
Changes:
- Backend: `route_templates`, `route_template_lines` (segment, description, currency, unit, multiplier, flat, sort, active); `RouteTemplateController`; copy-on-create into lines (template edits never touch orders).
- `app/Services/ExpenseAmountCalculator.php` (new): unit × multiplier × trucks, flat lines, currency subtotals, ZMK × `zmk_rate` → TZS, USD kept; line `amount` (TZS, reports) for USD uses the `usd_rates` period, else `usd_rate`, else 0 + flag.
- PDFs: `expenses/vt-route-pdf.blade.php` (sample 123), `expenses/vt-general-pdf.blade.php` (sample 129: per-line truck lists, TRUCK | PESA table), shared `expenses/partials/` (heading, currency blocks, truck list).
- Frontend: `src/pages/RouteTemplates.tsx` + `components/route-templates/`; `expense-form/route-lines.tsx` (load template, edit, extra lines for selected trucks, amount description), `expense-form/general-lines.tsx` (per-line trucks, payee).
- `tests/Feature/ExpenseAmountCalculatorTest.php` using sample 123 figures (TSh 21,519,300; $7,206).
Reused components: phase 2 `truck-set-field`, `dompdf` layout from `order-pdf.blade.php`.
Done when: sample 123 and 129 are reproduced in the system and their PDFs match the samples' figures and layout; a template edit doesn't change a saved order.

## Phase 5 — Vibali Congo: 165, 163, 180

Purpose: req. 21–25.
Changes:
- Backend: USD-only rule for VC; `form=return` requires `parent_order_id` (Go order) and allows negative lines; `form=emergency` needs no booking, multiplier may be days.
- PDFs: `expenses/vc-go-pdf.blade.php` (165: trucks once, extra lines list their trucks only when different), `vc-return-pdf.blade.php` (163), `vc-emergency-pdf.blade.php` (180).
- Frontend: `expense-form/settlement-lines.tsx` (pick Go order, +/− lines, no-truck lines); emergency reuses `general-lines.tsx` in USD.
Reused components: phase 4 templates, calculator, partials.
Done when: sample 165 ($40,290) and 180 ($760) are reproduced; a 163 order with a negative line reduces the trip totals.

## Phase 6 — Other expenses and reports

Purpose: req. 26, 24 (allocation), 4, 18 (report use).
Changes:
- `expense-form/other-lines.tsx` (subcategory, description, amount, optional truck + driver); `expenses/other-mizani-pdf.blade.php` (sample No. 05) and generic other PDF.
- `TripProfitCalculator::legExpenseTotal`: add an equal share of no-truck lines on orders that contain the truck; exclude Office.
- `TripSheetExport`, `LineCategoryExpenseExport`, `AnnualSheetExport`, `TruckProfitReportExport`, `ExpenseOrderExport`: group by type/subcategory; Truck category in the annual sheet.
Reused components: existing exports.
Done when: Mizani sample reproduced; the profit report groups Other by subcategory; a shared no-truck line is split across trucks; full `php artisan test`, `pnpm typecheck`, `pnpm build`, `pnpm lint` pass.

## Dependencies, Risks, Considerations

- Timeline: 2–3 days is tight. Day 1 = P1–P3, Day 2 = P4, Day 3 = P5–P6. If it slips, P5–P6 go to a follow-up UAT drop.
- Waiting on the client: fuel forms (P3 PDF layout uses a provisional layout until they arrive), the second Other form, and the 180 penalty-row and Other-numbering questions. Default until answered: penalties split per truck; one OTH series.
- Series start numbers (e.g. VT after 129, VC after 180, OTH after 05) must be confirmed before go-live.
- Legacy mixed orders: read-only; no data rewrite beyond backfill. Back up production before migrating.
- Update currently deletes and recreates lines; the price-change diff is captured before the replace.
- Each phase ends with a review summary and waits for approval (workflow Step 4).
