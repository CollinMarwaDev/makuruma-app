---
name: working-agreements
description: How to plan, get approval for, and report multi-file or convention-changing work on Makuruma. Use before any refactor, multi-file change, data-flow change or new abstraction.
---

# Working Agreements

1. **Understand** — read the related page, component, service, controller and model. Name the existing pattern you will follow.
2. **Change list** — post the `AGENTS.md` block (existing pattern, files, new API calls, new abstractions, reasons). Wait for approval when >2 files or any data flow changes.
3. **Small steps** — one checkpoint per contract item or coherent slice; keep each reviewable.
4. **Verify** — `pnpm typecheck`, `pnpm build`, `pnpm lint` (no new errors); backend: `php artisan test`, `php artisan migrate` on a fresh DB; click through the screen in light and dark.
5. **Report** — what changed, where, why this approach, skills used, verification results, known risks, and every new abstraction/API call/route/schema with its necessity.
6. **Don't** — add speculative helpers, change unrelated code, or commit/push unless asked.
