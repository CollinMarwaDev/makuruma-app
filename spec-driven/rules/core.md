# Code style (Makuruma web)

- Sort type properties, component props and object props in ascending order in new code.
- Files in `src/global` and new module folders are kebab-case; hooks are named like the hook (`useSomething.ts`).
- Reusable utils, hooks and components get a short TSDoc description (example only when needed).
- Check how a similar task is already implemented before writing new code.
- Avoid unnecessary comments. Import things before using them.

### TypeScript

- Avoid `any`.
- Use the `~/` alias (maps to `src/`) for new imports.
- Type function parameters and component props.
- Run `pnpm typecheck` and `pnpm build` when a task is done and fix all errors.

### Workflow (MANDATORY)

- Follow `spec-driven/workflow.md` for feature work, including all gates (requirement confirmation, plan approval, tasks approval, end-of-phase). Direct Mode is allowed for tiny edits as defined in `AGENTS.md`.

### Skill Loading (MANDATORY)

- At the start of every task, load `.agents/skills/makuruma-web/SKILL.md` and the skills it routes to.
- Follow all rules in `spec-driven/rules/`.
- New skills go in `.agents/skills/<name>/SKILL.md`.

### Guard Rails

- After each task, run typecheck and build; no new lint errors.
