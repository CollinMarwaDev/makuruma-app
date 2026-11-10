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
