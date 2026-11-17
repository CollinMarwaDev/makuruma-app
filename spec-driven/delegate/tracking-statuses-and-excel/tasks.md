# Tasks

Backend paths are relative to `makuruma-backend/`, web app paths to `makuruma-app/`.

## Phase 1 — Backend: new statuses and Offloaded as the final status

- [x] 1.1 Migration `2026_11_18_090000_rename_tracking_statuses`: rename/add/remove statuses, system flags and sort order (req. 1–3, 6); move legs and trucks (req. 5); add `booking_trucks.invoice_ready_notified_at`; reversible `down()`.
- [x] 1.2 `app/Models/TrackingStatus.php` (`OFFLOADED`), `app/Services/TrackingLegService.php` (`markOffloaded`, `notifyReadyForInvoicing`), `app/Console/Commands/TrackingDailyChecks.php`, `app/Notifications/TrackingAlert.php`.
- [x] 1.3 Callers of Completed: `app/Models/BookingTruck.php`, `app/Http/Controllers/Api/TrackingController.php` (scope `offloaded`), `app/Services/TrackingWorkbook.php::findLeg`, `app/Http/Controllers/Api/DashboardController.php`, `database/seeders/DemoSeeder.php`.
- [x] 1.4 Tests: update `tests/Feature/TrackingWorkbookTest.php`; new `tests/Feature/TrackingStatusesTest.php`; migrate an old-seeded database forward and back; `php artisan test`.

## Phase 2 — Backend: one Excel format

- [x] 2.1 `app/Services/TrackingWorkbook.php`: old status names rejected with their replacements (req. 13); export works for any legs incl. Offloaded.
- [x] 2.2 `TrackingController::downloadExcel` accepts `ids` (`POST tracking/export-excel`), GET keeps all active; `routes/api.php`.
- [x] 2.3 Tests in `tests/Feature/TrackingWorkbookTest.php`: chosen legs incl. Offloaded, round trip “unchanged”, old-name rejection; `php artisan test`.

## Phase 3 — Web app: statuses, tabs and the single Excel workflow

- [x] 3.1 `src/components/tracking/use-tracking-list.ts`, `tracking-table-section.tsx`, `tracking-leg-form.tsx`, `src/types/tracking.ts`: Offloaded tab, no Auto/auto-completed badges.
- [x] 3.2 `src/pages/Tracking.tsx`, `src/services/trackingService.ts`, `src/components/tracking/tracking-import-modal.tsx`, `src/utils/csvExports.ts`: remove Export CSV; Download Excel sends the on-screen leg IDs; steps text.
- [x] 3.3 Dashboard: `src/types/dashboard.ts`, `src/components/dashboard/fleet-status-card.tsx`, `src/pages/Dashboard.tsx`; `src/components/InvoiceForm.tsx` finished = Offloaded.
- [x] 3.4 `pnpm typecheck`, `pnpm build`, `pnpm lint`; browser check (light/dark): status order, Offloaded tab, download → edit → upload → preview → save; update `spec-driven/FEATURES.md`.
