---
name: spec-driven
version: 3.0.0
description:
  Extends v2.0 with Direct Mode — a fast path for small, well-understood tasks (build fixes, lint errors, broken imports, config corrections) that collapses the three artifact gates into a single inline plan. All approval words, state labels, and safety protocols remain identical to the standard workflow. Direct Mode escalates automatically to the full workflow if scope grows.
---
# Spec-Driven Development Workflow

Priority: Use this workflow for software development work, including code edits, tests, refactors, docs, config, and feature implementation.

Goal: preserve approval gates while minimizing total token usage.

---

## Foundation

### Core Laws

No confirmed `requirements.md` → no `plan.md`  
No approved `plan.md` → no `tasks.md`  
No approved `tasks.md` → no execution

Rules:

- One artifact per turn.
- Never skip, batch, or rename required artifacts.
- Never continue without explicit approval.
- Keep all output concise.

---

### Artifact Paths

Use exactly these paths:
```
spec-driven/delegate/<feature>/requirements.md
spec-driven/delegate/<feature>/plan.md
spec-driven/delegate/<feature>/tasks.md
```
`<feature>` must be short kebab-case, for example:
```
add-customer-filter
fix-login-redirect
```
---

### State Labels

Every response must start with exactly one state label:
```
State: Intake
State: Direct Plan
State: Requirements
State: Requirements Review
State: Planning
State: Plan Review
State: Task Breakdown
State: Tasks Review
State: Execution Approval
State: Execution
State: Verification
State: Complete
State: Blocked
```
---

### Approval Words

Proceed only when the user replies with one of:
```
confirm
approved
go ahead
proceed
yes, execute
continue
```
Rules:

- Treat approval words case-insensitively.
- If the reply is ambiguous, ask for clarification.
- Do not proceed on unclear replies such as `ok`, `sure?`, `maybe`, `hmm`, or partial agreement.

---

## Optimization

### Token Budget Rules

Optimize for low total token consumption.

General rules:

- Prefer bullets over prose.
- Avoid narrative explanations.
- Do not restate unchanged artifacts in chat.
- Do not paste full file contents unless explicitly requested.
- Reference artifact paths instead of repeating their contents.
- Ask no intake question if a safe default exists.
- Record safe defaults in `Assumptions`.
- Use compact status updates.
- Mention only relevant files, commands, results, blockers, and decisions.
- Do not summarize prior artifacts unless needed for a decision.
- During execution, focus only on the current phase, active tasks, and relevant done-when criteria.

Output limits:

- `requirements.md`: max 80 lines.
- `plan.md`: max 120 lines.
- `tasks.md`: max 150 lines.
- Normal chat replies: max 10 lines.
- Blocker reports: max 20 lines.
- Final verification reports: max 20 lines.

If a limit would hide critical information, include only the critical information and omit low-value detail.

---

### Direct Mode

Use Direct Mode when **all** of the following are true:

- Touches ≤ 2 files.
- No architecture, data model, or security change.
- No new user-facing behavior introduced.
- Root cause is already known or trivially identifiable.
- Examples: build errors, lint fixes, broken imports, config corrections, typos.

If **any** condition is false, use the standard workflow.

Direct Mode replaces Steps 1–3 with a single inline plan. No artifact files are written to disk.

The agent must declare `State: Direct Plan` explicitly. The human may override to the full workflow at any time before confirmation.

**Inline plan format:**
```
State: Direct Plan

Goal: <one line>
Change: <file(s) and what changes>
Done when: <verifiable condition>
Assumptions: <or _none_>
```

Ask exactly:
```
Reply `confirm` to proceed, or tell me what to change.
```

Do not begin execution until confirmed.

Steps 4–5 (Execution and Verification) run identically to the standard workflow.

**Execution report** (max 6 lines):
```
State: Execution

Done: <task summary>
Verified: <command/result or "not run">
Next: <complete | blocked>
```

**Mode escalation** — if scope expands mid-execution, stop immediately:
```
State: Blocked

Direct Mode criteria no longer met.
Reason: <what changed>
Action: restart from Step 1 with full workflow.
```
Wait for human confirmation before continuing.

---

### Small Change Mode

Use Small Change Mode when all are true:

- Expected implementation affects no more than 2 source files.
- No architecture change.
- No data model change.
- No security-sensitive behavior change.
- Expected implementation is simple.

Small Change Mode still uses all gates, but artifacts must be minimal:

- `requirements.md`: Goal, Functional requirements, Assumptions, Open questions.
- `plan.md`: one phase only.
- `tasks.md`: max 5 tasks.
- Execution reports: max 6 lines.

If the task grows beyond Small Change Mode, update `requirements.md` or `plan.md` and return to the relevant approval gate.

---

## Workflow Steps

### Step 0 — Intake

State: Intake

Clarify only if ambiguity changes one of:

- Architecture
- Behavior
- Scope
- Data model
- Security
- User-visible outcome

Rules:

- Ask max 3 blocking questions.
- Do not ask cosmetic questions.
- Do not ask if the answer can be safely inferred.
- If using a safe default, write it later under `Assumptions`.
- If no blocking question is needed, proceed to Step 1.

---

### Step 1 — Requirements

State: Requirements

Write only:
```
spec-driven/delegate/<feature>/requirements.md
```
Required sections for normal mode:
```
markdown
# Requirements

## Goal

## Functional Requirements

## Non-functional Requirements

## Out of Scope

## Assumptions

## Open Questions
```
Required sections for Small Change Mode:
```
markdown
# Requirements

## Goal

## Functional Requirements

## Assumptions

## Open Questions
```
Rules:

- Functional requirements must be numbered.
- Requirements must be testable.
- Requirements must describe user-facing behavior or observable system behavior.
- Use `_none_` for empty `Open Questions`.
- No implementation tasks.
- No phases.
- No checkbox lists.
- Keep concise.

Stop after writing `requirements.md`.

Ask exactly:
```
Reply `confirm` if correct, or tell me what to change.
```
Do not write `plan.md` until confirmed.

---

### Step 2 — Plan

State: Planning

After requirements confirmation, write only:
```
spec-driven/delegate/<feature>/plan.md
```
Required format:
```
markdown
# Plan

## Phase 1 — <Name>

Purpose:
Changes:
Reused components:
Done when:

## Dependencies, Risks, Considerations
```
For additional phases, repeat the same phase format.

Rules:

- Keep phases coarse.
- Prefer fewer phases.
- Small Change Mode must use exactly one phase.
- `Changes` should list files/components, not prose.
- `Done when` must be verifiable.
- No checkbox lists.
- No implementation work.
- No new scope beyond `requirements.md`.

Stop after writing `plan.md`.

Ask exactly:
```
Reply `approve` if correct, or tell me what to change.
```
Do not write `tasks.md` until approved.

---

### Step 3 — Tasks

State: Task Breakdown

After plan approval, write only:
```
spec-driven/delegate/<feature>/tasks.md
```
Required format:
```
markdown
# Tasks

## Phase 1 — <Name>

- [ ] 1.1 <Atomic task naming file/component>
- [ ] 1.2 <Atomic task naming file/component>
```
Rules:

- Tasks must be atomic.
- Tasks must be ordered.
- Tasks must map to `plan.md` phases.
- No new scope.
- No pre-checked boxes.
- Prefer 2–6 tasks per phase.
- Small Change Mode allows max 5 total tasks.

Stop after writing `tasks.md`.

Ask exactly:
```
Reply `approve` or `yes, execute` to start Phase 1, or tell me what to change.
```
Do not modify implementation files until execution is approved.

---

### Step 4 — Execution

State: Execution

Approval authorizes only the current phase.

Before editing:

- Read only the current phase tasks.
- Read only relevant done-when criteria.
- Inspect similar existing implementation before changing code.
- Avoid loading unrelated files.

Execution loop:

1. Pick the next unchecked task in the approved phase.
2. Execute it.
3. Verify if practical.
4. Mark completed tasks in `tasks.md`.
5. If blocked, use Blocker Protocol.
6. Continue until the current phase is complete.

Task checkmark rule:

- Default: mark completed tasks in batches of up to 3.
- Mark immediately if a task is risky, blocked, independently verified, or user requested strict tracking.
- Never mark a task complete before doing it.
- Never mark tasks from unapproved phases.

Execution report format:
```
markdown
State: Execution

Done:
- <task ids>

Verified:
- <command/result or "not run">

Next:
- <continuing current phase | awaiting approval | blocked>
```
After completing a phase:

- Verify the phase `Done when` criteria from `plan.md`.
- Stop.
- Ask exactly:
```
Continue with Phase N+1, make changes, or stop?
```
Do not start the next phase without approval.

---

### Step 5 — Verification

State: Verification

Run applicable checks, prioritizing project-defined commands.

Recommended checks for TypeScript/npm projects:
```
pnpm typecheck
pnpm build
pnpm test
pnpm lint
```
Use only commands that exist or are appropriate for the project.

Report compactly:
```
markdown
State: Verification

Commands:
- <command>: <result>

Files changed:
- <file>

Completed:
- <requirement ids or summary>

Follow-ups:
- <item or _none_>
```
---

## Safety & Error Handling

### Blocker Protocol

State: Blocked

Stop immediately when blocked.

Report:
```
markdown
State: Blocked

Where:
- <task + file>

What happened:
- <concrete issue>

Why it blocks:
- <affected requirement/assumption>

Options:
- <option 1 + tradeoff>
- <option 2 + tradeoff>

Recommendation:
- <recommended option>
```
Rules:

- Wait for human decision.
- If scope changes, update `requirements.md` and return to Step 1 gate.
- If approach changes, update `plan.md` and return to Step 2 gate.
- Do not continue execution while blocked.

---

### Forbidden

- Creating two required artifacts in one turn.
- Continuing without explicit approval.
- Skipping required artifacts.
- Renaming required artifacts.
- Planning only in chat instead of writing required files.
- Writing `plan.md` before `requirements.md` confirmation.
- Writing `tasks.md` before `plan.md` approval.
- Editing implementation files before execution approval.
- Marking tasks complete before doing them.
- Batch-checking more than 3 tasks by default.
- Starting the next phase automatically.
- Modifying files outside the approved phase.
- Changing scope without updating `requirements.md`.
- Adding implementation detail to `requirements.md`.
- Adding new scope in `plan.md` or `tasks.md`.
- Reprinting full files or artifacts unless explicitly requested.
- Staying in Direct Mode after escalation criteria are met.