---
name: separation-of-concerns
description: Keep feature-owned code in its module and shared code generic in the Makuruma web app and API. Use when a change touches a large shared file (App.tsx, Sidebar, apiClient, a big Form/Table component, a Laravel controller) or when refactoring.
---

# Separation Of Concerns

- Feature behaviour (booking modes, tracking rules, expense categories) lives with its feature: page + feature components + service + types. Not in `src/global`.
- `src/global` holds domain-neutral primitives only. A component that knows about trucks or bookings is a feature component.
- Split big files when you add a new independent workflow (e.g. a booking "copy" dialog becomes its own component file rather than growing `BookingForm.tsx` further).
- Services stay one per resource; do not add tracking calls to `bookingService.ts`.
- Backend: validation in the controller's `validate()`/Form Request, business rules in a service class under `app/Services` when shared by more than one controller or the scheduler, persistence in models.
- Keep compatibility: when moving code, keep existing exports/import paths working unless the approved plan says otherwise.

## Review checklist

- No feature logic added to global/shared files.
- New files are kebab-case (frontend `src/global`, new module folders).
- No unrelated behaviour introduced.
