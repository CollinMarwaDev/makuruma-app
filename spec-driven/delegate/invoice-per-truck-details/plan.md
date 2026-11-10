# Plan — invoice-per-truck-details

Status: approved 2026-11-10. Requirements: confirmed 2026-11-10.
Assumption kept: any truck may be invoiced at any time (advance invoices need this).

## Backend (makuruma-backend)

1. `resources/views/invoices/invoice-pdf.blade.php`
   - Lines table keeps its 4 columns; the description cell adds a second line per truck: reg no · loading → offloading · cargo · ETA (fits A4 portrait).
   - Each value: `$line->bookingTruck->X ?? $invoice->booking->X ?? '—'`.
   - Footer sentence "Being the freight charges from … to …": shared route when all lines agree, else "multiple routes (see lines)".
   - Small helper in the view (`@php $shared = fn($f) => …`) — no new class.
2. `app/Http/Controllers/Api/InvoiceController.php`
   - `eagerLoad()` adds `lines.bookingTruck` fields already present; no change needed beyond confirming `cargo`, `eta`, `loading_point`, `offloading_point` load.
   - `eligibleTrucks`: return `current_status`, `offloading_date`, `completed_at` (already on the model; ensure not hidden) — no rule change.
   - `show`: add `uninvoiced_trucks` for the invoice's booking and type (reg nos) for the slide-over.
3. `app/Exports/TrackingSheetExport.php` — add Cargo, Rate, ETA columns per truck row (same fallback).
4. Test: feature test — booking with 3 trucks, mixed routes; invoice 1 truck; `eligible-trucks` returns the other 2; second invoice for the rest; PDF renders (200).

## Frontend (makuruma-app)

1. `types/invoice.ts` — `EligibleInvoiceTruck` gets `current_status`, `offloading_date`, `loading_point`, `offloading_point`, `cargo`, `eta`; `Invoice` gets optional `uninvoiced_trucks`.
2. `components/InvoiceForm.tsx` (truck picker only)
   - Each truck row: `StatusBadge` (tracking status), route, offloading date.
   - Quick action "Select offloaded / completed only".
   - Hint text: "Trucks you don't tick stay available for a later invoice."
3. Invoice slide-over (built in global-kit-list-pages phase 5) shows `uninvoiced_trucks`.

## Order

- Backend 1–4 → frontend 1–2 → frontend 3 lands with global-kit-list-pages phase 5.

## Verification

- `php artisan test`; download a PDF for a mixed-route booking and check columns + footer; open the Excel export.
- `pnpm typecheck`, `pnpm build`; Playwright: invoice form with mixed statuses, partial invoice, second invoice.

## Risks

- Long cargo names wrap the description cell; acceptable (no extra columns).
