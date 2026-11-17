# Tasks

Backend paths are relative to `makuruma-backend/`, frontend paths to `makuruma-app/`.

## Phase 1 — Backend foundation: types, numbering, lookups

- [x] 1.1 Migrations for lookups: `payment_accounts`, `vendor_types` (+ `vendors.vendor_type_id`, map fuel/e-seal → Fuel/ECIL, drop enum), `expense_subcategories`, `usd_rates`; models `PaymentAccount`, `VendorType`, `ExpenseSubcategory`, `UsdRate`; update `Vendor`.
- [x] 1.2 Migrations for orders/lines: `expense_orders` new columns (type, form, serial, payment_mode, FKs, borders, rates, usd_total), `expense_order_bookings` pivot, `expense_lines` (multiplier, amount_description, is_flat, payee); backfill `expense_type` and pivot from existing data; update `ExpenseOrder`/`ExpenseLine` fillable, casts, relations.
- [x] 1.3 `app/Services/ExpenseNumberGenerator.php`: per-type series FUEL/VT/VC/OTH with `lockForUpdate`, start values from config/seeder.
- [x] 1.4 `app/Services/ExpenseOrderRules.php`: single type, category rules (trip/truck/office), trucks belong to selected bookings, legacy mixed orders read-only; wire into `ExpenseOrderController` store/update (bookings array, `initiated_by` from user).
- [x] 1.5 Controllers + routes `PaymentAccountController`, `VendorTypeController`, `ExpenseSubcategoryController`, `UsdRateController` (Admin/Manager/Accountant); `VendorController` validates `vendor_type_id`; seeders for Cash/M-Pesa/CRDB, Fuel/ECIL, 7 subcategories.
- [x] 1.6 `tests/Feature/ExpenseOrderRulesTest.php` (mixed type rejected, per-type numbering, category rules); run `migrate:fresh --seed` + `php artisan test`.

## Phase 2 — Form shell and settings UI

- [x] 2.1 `src/types/expense.ts`, `src/types/partner.ts`, `src/services/expenseService.ts`, new `src/services/expense-settings-service.ts` (accounts, vendor types, subcategories, USD rates).
- [x] 2.2 `src/components/expense-form/` shell: `use-expense-form.ts`, `expense-form.tsx` (type → category → header, read-only initiated by), `bookings-field.tsx` (multi-booking).
- [x] 2.3 `expense-form/truck-set-field.tsx` (search + "Same for all", reuse `truck-picker.tsx`) and `payment-account-field.tsx` (dropdown + add inline); swap `ExpenseForm.tsx` usage in `src/pages/Expenses.tsx` and remove the old file.
- [x] 2.4 `src/pages/ExpenseSettings.tsx` (tabs: Payment accounts, Vendor types, Subcategories, USD rates) following `TrackingStatuses.tsx`; route in `src/App.tsx`, link in `Sidebar.tsx`.
- [x] 2.5 Vendors: `VendorForm.tsx`, `vendors-table-section.tsx`, `src/pages/Vendors.tsx` use the vendor-type list; Expenses list shows type column/filter and new number.
- [x] 2.6 `pnpm typecheck`, `pnpm build`, `pnpm lint`; check light/dark.

## Phase 3 — Fuel

- [x] 3.1 Backend fuel rules (truck, driver, litres required; price optional), `payment_mode` default from vendor, `markPaid` blocked while a price is missing.
- [x] 3.2 Migration `expense_price_changes` + `PATCH expense-orders/{id}/prices` (reason required, before paid); price diff captured in update before lines are replaced.
- [x] 3.3 `app/Console/Commands/ExpensePendingPriceCheck.php` + `app/Notifications/ExpenseAlert.php` (14 days, idempotent), schedule in `routes/console.php`; `pending_price` / `price_overdue` in API output and index filter.
- [x] 3.4 `resources/views/expenses/fuel-pdf.blade.php` (provisional layout) + `download?show_price=0|1`.
- [x] 3.5 Frontend: `expense-form/fuel-lines.tsx`, `price-update-dialog.tsx`, Pending/Overdue badges + filter in `Expenses.tsx`, "Show price?" download dialog, price history in `expense-details.tsx`.
- [x] 3.6 `tests/Feature/ExpenseFuelPriceTest.php` (req. 9, 10); `php artisan test`, `pnpm typecheck`, `pnpm build`.

## Phase 4 — Vibali Tunduma: route templates, 123 and 129

- [x] 4.1 Migrations + models `RouteTemplate`, `RouteTemplateLine`; `RouteTemplateController` + routes (CRUD, deactivate).
- [x] 4.2 `app/Services/ExpenseAmountCalculator.php` (unit × multiplier × trucks, flat lines, currency subtotals, ZMK → TZS, USD kept, TZS `amount` via USD period rate) used by store/update; copy template lines on create.
- [x] 4.3 `resources/views/expenses/partials/` (heading, currency block, truck list) + `vt-route-pdf.blade.php` (sample 123) + `vt-general-pdf.blade.php` (sample 129, TRUCK | PESA table); download picks the view by type/form.
- [x] 4.4 Frontend `src/pages/RouteTemplates.tsx` + `src/components/route-templates/`; route + sidebar link.
- [x] 4.5 `expense-form/route-lines.tsx` (load template, edit, extra lines for selected trucks, amount description) and `expense-form/general-lines.tsx` (per-line trucks, currency, payee).
- [x] 4.6 `tests/Feature/ExpenseAmountCalculatorTest.php` with sample 123 (TSh 21,519,300; $7,206) and 129 (TSh 352,300); full checks.

## Phase 5 — Vibali Congo: 165, 163, 180

- [x] 5.1 Backend VC rules: USD only, `form=return` needs Go `parent_order_id` and allows negative lines, `form=emergency` without booking and multiplier as days.
- [x] 5.2 `vc-go-pdf.blade.php` (165: trucks once, line trucks only when different), `vc-return-pdf.blade.php` (163), `vc-emergency-pdf.blade.php` (180).
- [x] 5.3 Frontend `expense-form/settlement-lines.tsx` (pick Go order, +/− and no-truck lines); emergency uses `general-lines.tsx` in USD.
- [x] 5.4 Tests for sample 165 ($40,290), 180 ($760) and a negative 163 line; full checks.

## Phase 6 — Other expenses and reports

- [x] 6.1 `expense-form/other-lines.tsx` (subcategory, description, amount, optional truck + driver); backend rules for Other.
- [x] 6.2 `other-mizani-pdf.blade.php` (sample No. 05) + generic Other PDF.
- [x] 6.3 `TripProfitCalculator::legExpenseTotal`: equal share of no-truck lines, Office excluded.
- [x] 6.4 `TripSheetExport`, `LineCategoryExpenseExport`, `AnnualSheetExport`, `TruckProfitReportExport`, `ExpenseOrderExport`: group by type/subcategory, Truck category in annual sheet.
- [x] 6.5 Final verification: `migrate:fresh --seed`, `php artisan test`, `pnpm typecheck`, `pnpm build`, `pnpm lint`; update `FEATURES.md` status.
