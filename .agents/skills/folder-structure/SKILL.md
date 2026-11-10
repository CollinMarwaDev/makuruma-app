---
name: folder-structure
description: Folder structure, naming and import rules for the Makuruma web app (src/global design system vs app pages/components/services). Use when adding or moving any file, hook, util, schema or component.
---

# Folder Structure

| Directory | Purpose | Naming |
| --- | --- | --- |
| `src/global/components` | Reusable, domain-neutral UI (design system) | kebab-case files/folders; compound parts `ParentChild` |
| `src/global/hooks` | Reusable hooks | `useSomething.ts` |
| `src/global/utils` | Pure helpers; `zod-common/` for shared schemas; `r3/` = local replacements for the kit's former private package | kebab-case |
| `src/global/providers` | App-wide providers (theme, confirmation, dialog) | kebab-case |
| `src/global/styles/theme.css` | Colour tokens (light + dark) | — |
| `src/pages` | One file per route | existing `PascalCase.tsx`; new folders kebab-case |
| `src/components` | Feature components owned by app modules | existing PascalCase; new work kebab-case in a module folder |
| `src/services` | API access (`apiClient` + per-resource service) | existing `camelCaseService.ts` |
| `src/types` | API data types per resource | existing names |
| `src/context`, `src/hooks`, `src/constants`, `src/utils` | App-level auth/context and helpers | existing names |

## Rules

- Imports: use `~/` (maps to `src/`) for new code. Existing relative imports may stay.
- Domain code (bookings, tracking, expenses…) never goes into `src/global`. Global components stay domain-neutral (e.g. Badge gets `variant`, not booking statuses).
- Components with several parts get a folder and an `index.ts` barrel.
- Icons: Solar (`@solar-icons/react/ssr`) for kit components, Heroicons as fallback; existing pages use `lucide-react` — keep the family consistent within a screen.
- Do not add new top-level folders under `src/` without approval.
- Shared Zod schemas go in `src/global/utils/zod-common`; module schemas live next to their module.
