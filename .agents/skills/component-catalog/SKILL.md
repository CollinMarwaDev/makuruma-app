---
name: component-catalog
description: Reuse the Makuruma global component kit (src/global/components) before writing any UI. Use whenever a task builds or edits UI — layouts, forms, tables, modals, slide-overs, filters, stats cards, badges, toasts, empty/error states — even if the user does not mention components.
---

# Component Catalog

## Read first

1. `references/component-catalog.md` — every global component and its exports.
2. The live example in `src/pages/components-playground/*` (route `/components/playground`).
3. `../component-creation/SKILL.md` before creating anything new.

## Workflow

1. Name the UI need.
2. Find a catalog component or composition that fits (Button variants `filled | accent | success | danger | outline | tonal | text | primaryGradient`, `Modal`, `SlideOver`, `Table` + `TableSection`, `StatsCard`, `Badge`, `form-controls/*`, `DatePicker`, `Combobox`, `Pagination`, `SearchBox`, `EmptyState`/`GeneralFallbackUI`, `toast`, `useConfirmation`).
3. Prefer composition or a small variant over a new component.
4. Only create a new global component when nothing fits; say why, add it to the playground and regenerate the catalog reference.

## Rules

- Colours via tokens only (`bg-primary`, `text-accent`, `bg-status-green-bg`, `border-outline`, `bg-surface`). Check light and dark.
- Search params: `SearchBox`, `Pagination`, table sort and row selection store state in the URL (`useSearchParamsState`).
- `Modal`/`SlideOver` footers close via `DialogContext`; use `Modal.Footer`.
- Confirmation: render inside `ConfirmationProvider`, then `await confirm({...})`.
- View tabs: `TabLinks` (its `matchPattern` is tested against path + query, so `?view=` tabs work; see `components/tracking/tracking-table-section.tsx`).
- Record detail/edit panes: `SlideOver` with the open id in the URL (`?leg=`), sections in `Card`, fields from `form-controls/*`, errors via `ModalFormError` (see `pages/Tracking.tsx`).
- Status and count pills: `Badge` variants only (`default` blue, `warning` orange, `danger` red, `success` green, `disabled` grey); no hand-made pills.
- Repeated rows with the same component → typed array + `map()`.
- Existing pages still use their older local components (`src/components/ui/*`); migrate a screen to the kit only when the task touches it.
