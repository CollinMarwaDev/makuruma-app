---
name: code-review
description: Review a Makuruma diff or pull request (frontend or Laravel API) for correctness, contract scope, conventions and regressions. Use when asked to review code, a diff or a PR.
---

# Code Review

Check, in order:

1. **Correctness** — does it do what the requirement/contract item says? Edge cases: empty lists, one truck vs many, Same/Different modes, Go vs Return, missing trailer/driver, dates out of order, failed uploads.
2. **Server enforcement** — rules that matter are validated in Laravel, not only in React. Migrations are reversible; no data loss on existing rows.
3. **Data flow** — no extra API calls, no read-before-write without a backend reason, totals recalculated after mutations, no stale state.
4. **Conventions** — global components and theme tokens used; works in light and dark; kebab-case in `src/global`; `~/` imports; no `any`; Zod at untrusted boundaries.
5. **Scope** — nothing outside the request/contract; no unrelated refactors.
6. **Verification** — typecheck/build/tests ran; screenshots or steps for UI changes.

Report findings most-severe first with file:line, the failure scenario, and a concrete fix. Say explicitly when nothing blocking was found.
