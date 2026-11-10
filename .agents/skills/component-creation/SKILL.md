---
name: component-creation
description: Create consistent, reusable React components following project conventions for file structure, typing, styling, documentation, and composition patterns. Use this skill when building new UI components or refactoring existing ones.
---

> **Makuruma adapter:** Global components live in `src/global/components` (not `components/`); use the `~/global/...` alias wherever examples show `@/` or `~/`; `cn` is `~/global/utils/cn`; colours only via theme tokens from `src/global/styles/theme.css`; add an example to `src/pages/components-playground` and regenerate `../component-catalog/references/component-catalog.md`.

This skill defines conventions for creating React components in the application, covering file organization, typing,
styling, documentation, and composition patterns.

## Reuse First

Before creating or refactoring a component, read `../component-catalog/SKILL.md` and check the existing catalog in
`../component-catalog/references/component-catalog.md`.

## Base References (Makuruma path mapping)

Use these baseline standards alongside this skill:

- `../../rules/core.md`
- `../folder-structure/SKILL.md`

## File Organization

### Placement

- **Global reusable components** go under the `components/` folder.
- **Non-global components** go in their respective module folder (e.g., `users/`) — never in the global `components/`
  folder.

### Single-file components

Use a single file when the component is small and self-contained:

```
components/card.tsx
```

### Folder-based components

Use a folder when the component has multiple related files or sub-components. Always include an `index.ts` barrel file
for the public API:

```
components/button/
├── button.tsx
├── button-link.tsx
├── common.ts
└── index.ts
```

Barrel file re-exports all public components:

```ts
export { default as Button } from "@/components/button/button";
export { ButtonLink } from "@/components/button/button-link";
```

### File naming

- All files use `kebab-case` (e.g., `stats-card.tsx`, `empty-state.tsx`).
- Sort exports in barrel files alphabetically.

## Component Structure

### Props definition

- Define props using a TypeScript `interface`.
- Sort properties in ascending alphabetical order.
- Extend native HTML element props when appropriate using `ComponentPropsWithoutRef<"element">`.
- Use `className` for style customization and spread remaining props with `...otherProps`.

```tsx
import type { ComponentPropsWithoutRef, FC } from "react";
import { cn } from "@/utils/cn";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
    as?: ElementType;
}

export const Card: FC<CardProps> = ({ as: Tag = "div", className, ...otherProps }) => {
    return <Tag className={cn("rounded-xl border p-1.5 xl:p-3", className)} {...otherProps} />;
};
```

### Key rules

- Prefer **named exports** over default exports.
- Use `FC` type annotation or `forwardRef` when ref forwarding is needed.
- Use `cn()` from `@/utils/cn` to merge class names.
- Always use alias imports (`@/`) as defined in `tsconfig.json`.
- Keep import groups visually organized by ordering imports from the longest module specifier to the shortest.
- Reuse existing components as building blocks — only create from scratch when no existing component fits.
- Keep JSX declarative: when filter arrays, menu configs, or similar mapped configuration become non-trivial, move them into their own file or helper instead of defining them inline inside the rendered element tree.
- When rendering repeated UI rows with the same structure, prefer a typed data array and map over it instead of duplicating the same HTML structure many times.
- Only extract class name constants when the same class string is meaningfully reused across multiple places; do not create one-off constants for a single prop usage.
- For reusable display rows such as label/value pairs, build the data first and then map into the global component rather than repeating near-identical `LabelValueListItem` blocks.
- Keep the global Badge domain-neutral. Do not add inventory, meal, ticketing,
  or content-state resources while porting it to Nabaki.

## Composition Patterns

### Compound component (static property attachment)

Use when a component has tightly coupled sub-components. Attach sub-components as static properties on the parent:

```tsx
import { ModalContent } from "@/components/modal/modal-content";
import { ModalFooter } from "@/components/modal/modal-footer";
import { ModalHeader } from "@/components/modal/modal-header";

export const Modal = ({ children, onClose, open }: ModalProps) => {
    return (
        <Dialog.Root open={open} onOpenChange={onClose}>
            {children}
        </Dialog.Root>
    );
};

Modal.Header = ModalHeader;
Modal.Footer = ModalFooter;
Modal.Content = ModalContent;
```

Usage:

```tsx
<Modal open={isOpen} onClose={setIsOpen}>
    <Modal.Header title="Confirm" />
    <Modal.Content>Are you sure?</Modal.Content>
    <Modal.Footer />
</Modal>
```

### Tree-shakable compound component

Use when sub-components should be independently importable. Export each piece separately and assemble via a namespace
object:

```tsx
// empty-state.tsx
export const EmptyStateRoot = ({ children, className }: EmptyStateProps) => {
    return <div className={cn("flex flex-col", className)}>{children}</div>;
};

export const EmptyStateTitle: FC<EmptyStateTitleProps> = ({ children, className }) => {
    return <h2 className={cn("font-medium", className)}>{children}</h2>;
};

// index.ts
import { EmptyStateRoot, EmptyStateTitle } from "@/components/empty-state/empty-state";

export const EmptyState = {
    Root: EmptyStateRoot,
    Title: EmptyStateTitle,
};
```

### When to use which

- **Simple component** → single file, direct export.
- **Component with variants/helpers** → folder with barrel export.
- **Component with tightly coupled sub-components** → compound pattern with static properties.
- **Complex component with independently usable parts** → tree-shakable compound pattern.

## Styling

- Use **Tailwind CSS** for all styling.
- Use `cn()` to merge base classes with user-provided `className`.
- Accept `className` as a prop for style customization.

## Documentation

Document all reusable components with TSDoc. Include a concise description and an `@example` block for compound or
non-trivial components:

````tsx
/**
 * A compound component for displaying empty states or fallback content.
 *
 * @example
 * ```tsx
 * <EmptyState.Root>
 *   <EmptyState.Icon icon={SomeIcon} />
 *   <EmptyState.Title>No items found</EmptyState.Title>
 * </EmptyState.Root>
 * ```

*/
````

- Keep documentation short and clear.
- Document prop interfaces with inline `/** comment */` for non-obvious properties.
- Skip `@example` for simple, self-explanatory components.

## After Creation Checklist

1. **Re-export** — If the component belongs to a group folder (e.g., `form-controls/`), add it to the group's barrel
   `index.ts`.
2. **Showcase** — A Nabaki component playground is deferred unless an approved
   phase explicitly introduces it; use the iPFOS playground as the porting
   reference.
3. **Break down** — If the component is large, split it into smaller sub-components in their own folder.
4. **Compound pattern** — If the component is complex with multiple related pieces, use the compound component pattern.

## Imports

Always use alias imports and import from the correct packages:

```ts
import type { ComponentPropsWithoutRef, FC, ReactNode } from "react";
import { cn } from "@/utils/cn";
```
