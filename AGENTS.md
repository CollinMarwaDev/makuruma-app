# Agent guide — Makuruma Logistics Web

Short routing index for agents. Do not treat this file as a manual.

## Code work

1. Load `.agents/skills/makuruma-web/SKILL.md` first.
2. For product context: `.agents/skills/project-overview/SKILL.md`.
3. For implementation: `.agents/skills/folder-structure/SKILL.md`, `.agents/skills/routing/SKILL.md`, `.agents/skills/data-fetching/SKILL.md`, then the UI skills: `component-catalog`, `component-creation`, `form-handling`, `frontend-design`.
4. Before a refactor, a convention change or any multi-file task: `.agents/skills/working-agreements/SKILL.md`.
5. When a screen needs data, a rule or an action the API may not provide: `.agents/skills/backend-boundary/SKILL.md`. For module boundaries: `.agents/skills/separation-of-concerns/SKILL.md`.
6. To review code, a diff or a pull request: `.agents/skills/code-review/SKILL.md`.
7. Skills live in `.agents/skills/` (`.claude/skills` symlinks there).

## Design / feature truth

Owned by **spec-driven** (no `./docs` convention):

- Workflow: `spec-driven/workflow.md`
- Rules: `spec-driven/rules/core.md`
- Feature log: `spec-driven/FEATURES.md`
- Artifacts: `spec-driven/delegate/<feature>/{requirements,plan,tasks}.md`
- Contract scope: `../Makuruma_Logistics_Enhancement_Contract_5.pdf` (Booking 2.1, Tracking 2.2, Expense 2.3, Invoice 2.4)

## Human setup

Install, run, env: `README.md` and `../README.md`.

## Coding Standard

Keep code simple, focused, and easy to reason about.

- Write the minimum code needed to express the solution clearly.
- Solve the actual problem in front of you; avoid extra patterns, layers, or abstractions unless necessary.
- Prefer straightforward logic that is easy to read, test, and maintain.
- Remove redundant code paths, unused helpers, and unnecessary configuration.
- Choose the shortest reasonable implementation path that still follows existing project conventions.
- Separation of concerns still matters: independent workflows should live in focused files when that makes ownership clearer.
- Do not collapse behavior into one page file merely to avoid components; avoid pointless wrappers, not purposeful independent modules.
- Before creating reusable utilities or schemas, extract the smallest reusable primitive first; create named domain-specific helpers only when they add distinct behavior beyond labels, defaults, or limits.
- Do not rush implementation. Inspect the closest existing page/component pattern and all relevant skill guidance before editing code, then self-review for conventions, theme tokens, global components, states, and avoidable rework before declaring a checkpoint complete.
- When creating spec-driven artifacts, follow the artifact rules in `spec-driven/workflow.md` and `spec-driven/rules/core.md`.

## Implementation Hard Stops

Before editing, identify the exact existing API contract, component, and route pattern being reused.

- Do not add an API call, response schema, conflict handler, state handoff, shared component, or route wrapper unless the existing implementation or confirmed requirement proves it is needed.
- One action should perform the minimum required mutation. A read-before-write flow requires an explicit documented backend requirement.
- If an implementation needs behavior beyond the stated request, stop and ask before coding.
- Before edits, provide a file-level change list and wait for approval when more than two files or any data flow changes are involved.
- Before completion, review the diff against this file and explicitly list every new abstraction, API call, route, and schema, with its necessity.

Before edits, provide this response:

```text
Existing pattern:
Files to change:
New API calls: none / list
New abstractions: none / list
Reason each is necessary:
```

## Non-negotiables

- Follow spec-driven gates for feature work (`confirm` / `approved` / etc.).
- Use Direct Mode for tiny, well-understood code/UI edits (≤2 files, no backend/data-model/security/product decision).
- After each spec-driven execution checkpoint, include a short review summary: what changed, code area, why, skills used, verification, known risk.
- New UI uses `src/global/components` first; colours only through theme tokens (`src/global/styles/theme.css`), never hex values in components. Check both light and dark.
- Kebab-case files in `src/global`; `~/*` imports for new code; no `any`; Zod at untrusted boundaries (API responses, file imports).
- Verify with `pnpm typecheck` and `pnpm build`.
- New agent skills go under `.agents/skills/<name>/SKILL.md`, never under `spec-driven/`.
