---
name: backend-boundary
description: Decide what to do when a screen needs data, a rule or an action the Makuruma Laravel API may not provide. Use before adding any API call or when a requirement implies validation, permissions, scheduling or notifications.
---

# Backend Boundary

The API in `../makuruma-backend` is the source of truth for data, validation and permissions. The SPA must not invent server behaviour.

## Check first

1. `routes/api.php` — does the endpoint exist? (`php artisan route:list --path=api`)
2. The controller method — what does it validate and return?
3. The model (`app/Models`) and migrations — do the columns exist?

## Then

| Situation | Do |
| --- | --- |
| Endpoint and fields exist | Use them. |
| Field missing | Plan a migration + model `$fillable`/casts + controller validation + response; list it in the change list. |
| Rule must hold for every client (date order, trailer+driver required, no duplicates) | Enforce in the API (validation/service) **and** mirror in the UI for feedback. UI-only rules are not enough. |
| Time-based rule (auto-complete after 5 days, POD overdue) | Laravel scheduled command (`routes/console.php`), idempotent, logged. |
| Notification | In-app `notifications` table (Laravel database notifications). No email/SMS unless approved. |
| Unsure | Stop and ask; do not fake data in the UI. |

Always state new endpoints, migrations and schemas in the pre-edit change list (`AGENTS.md`).
