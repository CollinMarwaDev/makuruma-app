# Plan

Feature: tracking-statuses-and-excel (req. 1–15). Keys change in the data (`completed` → `offloaded`, …) so every rule, list and export follows one source: the `tracking_statuses` table.

## Phase 1 — Backend: new statuses and Offloaded as the final status

Purpose: req. 1–9.
Changes:
- Migration `2026_11_18_090000_rename_tracking_statuses`: `loading` → `waiting_to_load` + new `loaded_waiting_documents`; `at_border` removed (legs → `clearing`); `clearing`, `waiting_to_cross` become system statuses; `offloading` → `waiting_to_offload`; `completed` → `offloaded`; new sort order (req. 6); legs and trucks moved per req. 5; `booking_trucks.invoice_ready_notified_at` (set for legs already auto-completed). `down()` maps back.
- `app/Models/TrackingStatus.php`: `OFFLOADED` replaces `COMPLETED`.
- `app/Services/TrackingLegService.php`: `markOffloaded()` replaces `complete()` (sets `completed_at`, frees the truck as today); `notifyReadyForInvoicing()` replaces `autoCompleteOffloaded()` (notice only, once per leg, no status change).
- `app/Console/Commands/TrackingDailyChecks.php`, `app/Notifications/TrackingAlert.php` (kind `ready_for_invoicing`).
- `app/Models/BookingTruck.php` (`is_overdue`), `TrackingController` (scope `offloaded`), `TrackingWorkbook::findLeg`, `DashboardController` (status counts), `database/seeders/DemoSeeder.php`.
- Tests: update `TrackingWorkbookTest`; new `tests/Feature/TrackingStatusesTest.php` (migration mapping, Offloaded frees the truck, 5-day notice without status change).
Reused components: `TrackingLegService`, tracking-status migration pattern (2026_11_11_090000).
Done when: `migrate:fresh --seed` and `php artisan test` pass; no `loading|at_border|offloading|completed` status key left in `app/`; old data migrates per req. 5 (tested by migrating a database seeded before the change, then rolling back).

## Phase 2 — Backend: one Excel format

Purpose: req. 10–14.
Changes:
- `app/Services/TrackingWorkbook.php`: export any set of legs (incl. Offloaded); old status names rejected with the replacement names (req. 13).
- `TrackingController::downloadExcel`: accepts the leg IDs on screen (`POST tracking/export-excel` with `ids`; current GET keeps “all active”); `routes/api.php`.
- Tests in `TrackingWorkbookTest`: export of chosen legs incl. Offloaded, round-trip import, old-name rejection.
Reused components: existing template `resources/templates/tracking-template.xlsx`, import preview/apply.
Done when: tests pass; a downloaded file for the Offloaded tab re-imports with “unchanged” rows; file name `MAKURUMA TRACKING dd.mm.yyyy.xlsx`.

## Phase 3 — Web app: statuses, tabs and the single Excel workflow

Purpose: req. 4, 7, 10, 15 on screen.
Changes:
- `src/components/tracking/use-tracking-list.ts`, `tracking-table-section.tsx` (tab “Offloaded”, no “Auto” badge), `tracking-leg-form.tsx`.
- `src/pages/Tracking.tsx`: Export CSV removed; “Download Excel” downloads the legs on the current tab/filters; short steps text; `src/services/trackingService.ts`; `tracking-import-modal.tsx` text; remove `exportTrackingCsv` from `src/utils/csvExports.ts` if unused.
- Dashboard: `src/types/dashboard.ts`, `src/components/dashboard/fleet-status-card.tsx`, `src/pages/Dashboard.tsx`.
- `src/components/InvoiceForm.tsx` (finished = Offloaded), `src/components/notifications/notification-bell.tsx` (new notice text comes from the API).
Reused components: `TabLinks`, `RecordTableSection`, existing import modal.
Done when: `pnpm typecheck`, `pnpm build`, `pnpm lint` (no new warnings) pass; browser check in light and dark: pickers show the new order, Offloaded tab works, download → edit → upload → preview → save works from the Offloaded and active tabs.

## Dependencies, Risks, Considerations

- Contract 2.2 D-6 (auto-complete after 5 days) becomes a notice only — client decision, recorded in FEATURES.md.
- Existing in-app notifications titled “Trip auto-completed” stay as history.
- Files the client already keeps with old status names will be rejected row by row with the replacement name — expected (req. 13).
- `completed_at` keeps its name in the database (time the leg was marked Offloaded) to avoid touching invoices/trips code that reads it.
- Back up production before migrating; the migration is reversible except that Clearing/Waiting to cross both map back to At border.
