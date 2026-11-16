# Features

Decision log for the spec-driven workflow. Each entry: status (`discussed` → `specced` → `done`), flow, key decisions, open items.

## contract-enhancements-2026 — status: discussed

Source: `../Makuruma_Logistics_Enhancement_Contract_5.pdf` (sections 2.1 Booking, 2.2 Tracking, 2.3 Expense, 2.4 Invoice).

Key decisions so far:

- Accountant notifications for automatic completion / overdue POD are **in-app only** (no email/SMS).
- Sakania is an alternate border/route, not a further checkpoint in the sequence.
- Custom tracking statuses are admin-managed records (create, rename, order, deactivate).
- Automatic completion and POD-overdue checks run from the Laravel scheduler (`php artisan schedule:work` locally, cron in production).

Open items: per-item implementation plan to be approved before coding (see `delegate/contract-enhancements/`).

## global-kit-list-pages — status: done

Move every remaining list page (Trips, Assets, Staff, Drivers, Clients, Vendors, Expenses, Invoices, Reconciliation, Reports, Users) and Profile onto the global kit: TableSection search + filters, createTable, TabLinks, Pagination, EmptyState, ErrorFallback/GeneralErrorBoundary, SlideOver for details, useConfirmation for delete/approve, toast.

Artifacts: `delegate/global-kit-list-pages/` requirements → plan → tasks (all done 2026-11-10).

## invoice-per-truck-details — status: done

Client decision (2026-11-10): loading/offloading point, cargo, rate and ETA can be the same or different per truck; invoice PDF and tracking sheet show them per truck line (header shows "Multiple – see lines" when they differ). A booking can be invoiced in parts — only the trucks that have finished, while others are still in transit.

Artifacts: `delegate/invoice-per-truck-details/` requirements → plan → tasks (all done 2026-11-10).

## uat-2026-11-tracking-excel-and-half-trips — status: done

UAT feedback (12 Nov 2026), decided by the product owner on 13 Nov:

1. A booking keeps its number when trucks are added or removed (contract 2.1 B-4). No change.
2. A Go leg whose trip already has a Return booked can no longer be deleted, removed or swapped; the user is told which Return booking to fix first. The truck profit report also lists a trip that has only a Return half instead of hiding it. The three split trips on live (T351 EAQ, T975 CFD, T876 DXE) are joined: Go REL19092026 + Return REL21102026.
3. Tracking bulk update (contract 2.2 A/B) in the client's own spreadsheet layout (`makuruma-backend/resources/templates/tracking-template.xlsx`, GOING and RETURN sheets). Download Excel fills it with the open legs (hidden column Y holds each row's ID); Upload Excel previews every change and every rejected row with its reason, then saves only the valid rows. Rows without an ID match the truck's latest leg on that sheet. Blank cells leave values unchanged; dates are day.month.year.
