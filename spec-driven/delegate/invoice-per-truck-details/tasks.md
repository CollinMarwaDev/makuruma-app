# Tasks — invoice-per-truck-details

Status: draft (awaiting `approved`). Plan: approved 2026-11-10.

## Backend (makuruma-backend)

- [ ] B1 `invoice-pdf.blade.php`: description cell second line per truck — reg no · loading → offloading · cargo · ETA (booking-truck value, else booking value, else "—"). Done when: mixed-route booking PDF shows each truck's values.
- [ ] B2 Same view: footer "Being the freight charges from X to Y" uses the shared route when all lines agree, else "multiple routes (see lines)".
- [ ] B3 `InvoiceController::eagerLoad` loads `lines.bookingTruck` with `loading_point, offloading_point, cargo, eta, current_status`; `eligibleTrucks` returns `current_status`, `offloading_date`, `completed_at`.
- [ ] B4 `InvoiceController::show` adds `uninvoiced_trucks` (active booking trucks of that booking with no line on an invoice of this type: id, reg no, current_status).
- [ ] B5 `TrackingSheetExport`: Cargo, Rate, ETA columns per truck row, same fallback.
- [ ] B6 Feature test `tests/Feature/PartialInvoiceTest.php`: 3 trucks, mixed routes → invoice 1 → eligible returns 2 → invoice 2 → eligible empty → `uninvoiced_trucks` empty → PDF download 200.
- [ ] B7 `php artisan test` and `php artisan migrate:fresh --seed` pass.

## Frontend (makuruma-app)

- [ ] F1 `types/invoice.ts`: extend `EligibleInvoiceTruck` and `Invoice` (`uninvoiced_trucks?`); Zod schema if the response is parsed.
- [ ] F2 `InvoiceForm.tsx` truck picker: `StatusBadge`, route, offloading date per truck; hint "Trucks you don't tick stay available for a later invoice."
- [ ] F3 `InvoiceForm.tsx`: button "Select offloaded / completed only" (selects trucks with `offloading_date` or status `completed`).
- [ ] F4 Invoice slide-over (global-kit-list-pages T5.1) lists `uninvoiced_trucks`.
- [ ] F5 `pnpm typecheck`, `pnpm lint`, `pnpm build`; Playwright: partial invoice then second invoice, light + dark.

## Order

B1–B7 → F1–F3 → F4 with T5.1 → F5. Sync to Mac and commit on `feature/contract-booking-tracking`.
