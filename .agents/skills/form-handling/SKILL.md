---
name: form-handling
description: Build and manage forms using React Hook Form, Zod validation, and the project's FormField system. Use this skill when creating new forms, editing existing forms, adding form fields, or working with form validation. Apply it whenever the task involves form schemas, manage hooks, modal or flat-page forms, or the RenderFormField component.
---

> **Makuruma adapter:** Makuruma uses react-hook-form + zod 3.25 + `RenderFormField` from `~/global/components/form-controls/render-form-field`. There is no data router: submit with a service call from the manage hook (no `useFetcher`/`useSubmitData`/route actions). `r3-utils` imports map to `~/global/utils/r3/*`. Number inputs must not change on mouse-wheel (contract 2.1 B-8).

This skill defines conventions for building forms in the project using React Hook Form with Zod validation. Forms follow
a consistent file structure that scales with complexity — from a single manage hook file for small forms to multiple
co-located files for large forms.

## Required Pattern (Hook-First)

All form-related TypeScript logic must be managed through hook files.

- Use a `useManage<Feature>Form` hook as the primary form orchestration unit.
- Keep form schema, default values, field arrays, validation wiring, and submit handlers in hook-managed files.
- Route/page components should focus on layout/rendering and map `fields` with `RenderFormField`.
- Do not keep inline form state/validation wiring directly inside route components unless there is a documented exception.

## Base References (Makuruma path mapping)

Use these baseline standards alongside this skill:

- `../../rules/core.md`
- `../component-creation/SKILL.md`
- `../folder-structure/SKILL.md`

The iPFOS examples below preserve their source imports and APIs. Translate
`~/` to Makuruma's approved `@/` alias, and do not assume that `r3-utils`,
`useRouteDialog`, `useSubmitData`, or any form control exists until the
corresponding phase has established it.

## Core Components

Every form consists of these parts:

1. **Schema** — A Zod schema defining the form shape and validation rules.
2. **Manage Hook** — A `useManage<Feature>Form` hook that wires up `useForm` with `zodResolver`.
3. **FormField Array** — A typed `FormField<T>[]` array describing each field's input type, error state, and props.
4. **Rendering** — A component that maps the fields array using `RenderFormField` and handles submission.

## File Structure

Form file structure scales with schema complexity:

### Small Form (schema fits in manage hook)

When the schema is small (fewer than ~10 fields), keep everything in one file:

```
feature/
├── index.tsx                    # Route/component that renders the form
└── manage-<feature>-form.ts     # Schema + manage hook
```

### Large Form (schema extracted)

When the schema is large, extract it into a dedicated file:

```
feature/
├── index.tsx                              # Route/component that renders the form
├── <feature>-form-schema.ts               # Zod schema + inferred type
└── manage-<feature>-form.ts               # Manage hook (imports schema)
```

## Schema Definition

Define Zod schemas using reusable schema utilities from `r3-utils/zod-common` and `~/utils/zod-common`.

```ts
import { NoneEmptyStringSchema, SelectOptionSchema } from "r3-utils/zod-common";
import { z } from "zod";
import { LabelAndValueSchema, OptionalStringSchema } from "~/utils/zod-common";


const ExampleFormSchema = z.object({
    description: NoneEmptyStringSchema("description"),
    name: NoneEmptyStringSchema("name"),
    status: LabelAndValueSchema,
    type: SelectOptionSchema,
});

export type ExampleFormType = z.infer<typeof ExampleFormSchema>;
```

- Sort schema properties in ascending alphabetical order.
- Export the inferred type alongside the schema.
- Compose complex schemas from reusable sub-schemas (for nested objects and array items) instead of inline object literals.
- Follow the `manage-wb-campaigns.ts` format for schema composition: define each reusable nested schema first, export its type, then reference it in the parent form schema.
- Use `NoneEmptyStringSchema(fieldName)` for required strings.
- For optional strings that are required only in specific flows, use `NoneEmptyStringSchema("field label").optional()` so message text stays field-specific when those values are validated.
- Keep validation messages field-label driven and consistent (for example `"recipient phone number"`, `"scheduled date"`, `"sender name"`), matching the WhatsApp campaigns schema conventions.
- Add explicit messages for all primitive validators in schema definitions, including `z.string`, `z.number`, `z.boolean`, `z.enum`, and `z.coerce.*` variants.
- Optional primitive fields must still include explicit message definitions before `.optional()`.
- Avoid primitive validators without message text unless the field is already covered by a reusable schema utility that defines its own message contract.
- Use `LabelAndValueSchema` or `SelectOptionSchema` for select/combobox fields.
- Use `OptionalStringSchema(fieldName)` for optional strings.
- Use `PositiveNumberSchema` from `r3-utils/zod-common` for positive numbers.

## Manage Hook

The manage hook initializes `useForm` with `zodResolver`, builds the `FormField[]` array, and returns
`{ fields, handleSubmit }`.

### Small form (inline schema and fields)

```ts
import { zodResolver } from "@hookform/resolvers/zod";
import { NoneEmptyStringSchema } from "r3-utils/zod-common";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { FormField } from "~/components/form-controls/types";


const ReasonFormSchema = z.object({
    reason: NoneEmptyStringSchema("reason"),
});

export type ReasonFormType = z.infer<typeof ReasonFormSchema>;

// ----------------------------------------------------------------------

export const useManageReasonForm = () => {
    const {
        formState: { errors },
        handleSubmit,
        register,
    } = useForm<ReasonFormType>({
        resolver: zodResolver(ReasonFormSchema),
    });

    const fields: FormField<ReasonFormType>[] = [
        {
            errorMessage: errors.reason?.message,
            hasError: !!errors.reason?.message,
            inputType: "textarea",
            label: "Reason",
            name: "reason",
            placeholder: "Enter reason",
            register,
        },
    ];

    return { fields, handleSubmit };
};
```

### Naming conventions

- **Hook:** `useManage<Feature>Form`
- **Schema:** `<Feature>FormSchema`
- **Type:** `<Feature>FormType`
- **Fields hook:** `use<Feature>FormFields`
- **Defaults hook:** `use<Feature>FormDefaultValues`
- **File names:** `manage-<feature>-form.ts`, `<feature>-form-schema.ts`, `form-fields.ts`, `default-values.ts`

### Enforcement rules

- Treat `useManage<Feature>Form` as mandatory for every non-trivial form.
- Prefer `-manage-<feature>.ts` / `manage-<feature>-form.ts` co-located with the route.
- Keep all typed field configs (`FormField<T>[]`) in hook-managed files, not in JSX route components.
- Keep submit transformation logic in hook-managed files when possible; route components should call `handleSubmit(onSubmit)` with minimal glue code.

## FormField Array

Each field in the array is typed as `FormField<TFormType>` — a discriminated union keyed by `inputType`.

### Source-supported input types

This table records the iPFOS form-field contract. Nabaki support is governed by
`../component-catalog/references/nabaki-port-annotations.md`; commented,
incomplete, or excluded source controls are not operational merely because
they appear in this source contract.

| `inputType`        | Component           | Requires   |
|--------------------|---------------------|------------|
| `text-input`       | TextInputField      | `register` |
| `textarea`         | TextareaField       | `register` |
| `select-input`     | SelectFormField     | `control`  |
| `combobox-input`   | ComboboxInput       | `control`  |
| `date-input`       | DateInput           | `control`  |
| `phone-input`      | PhoneInputField     | `control`  |
| `checkbox`         | Checkbox            | `register` |
| `radio-group`      | RadioGroupFormField | `control`  |
| `number`           | NumberInputField    | `control`  |
| `file-input`       | FilePickerFormField | `control`  |
| `rich-text-editor` | RichTextEditorField | `control`  |

### Common field properties

```ts
{
    containerClassName ? : string;  // CSS class for the field wrapper
    disabled ? : boolean;           // Disable the field
    errorMessage: errors.fieldName?.message;
    hasError: !!errors.fieldName?.message;
    hidden ? : boolean;             // Conditionally hide the field
    inputType: "text-input";      // Discriminator
    label: "Field Label";
    name: "fieldName";            // Must match a key in the schema
    optional ? : boolean;           // Show optional indicator
    placeholder: "Enter value";
    register;                     // or control, depending on inputType
}
```

- Sort field properties in ascending alphabetical order.
- Fields using `register` (text-input, textarea, checkbox): pass `register` from `useForm`.
- Fields using `control` (select-input, combobox-input, date-input, etc.): pass `control` from `useForm`.

## Rendering Forms

### Modal form (route-based dialog)

Most forms render as modals using `useRouteDialog` and the `Modal` component:

```tsx
import { useNavigationState } from "r3-utils/hooks";
import type { SubmitHandler } from "react-hook-form";
import { RenderFormField } from "~/components/form-controls/render-form-field";
import { Modal } from "~/components/modal/modal";
import useRouteDialog from "~/hooks/useRouteDialog";


const ExampleModalForm = () => {
    const { open, closeDialog } = useRouteDialog();
    const { fields, handleSubmit } = useManageExampleForm();
    const { isBusy } = useNavigationState();

    const onSubmit: SubmitHandler<ExampleFormType> = async (values) => {
        // submit logic
    };

    return (
        <Modal onClose={closeDialog} open={open}>
            <Modal.Panel size="sm">
                <Modal.Header
                    Icon={SomeIcon}
                    title="Form Title"
                    subtitle="Form description"
                />
                <Modal.Content as="form" onSubmit={handleSubmit(onSubmit)}>
                    {fields.map((field) => (
                        <RenderFormField {...field} key={field.name} />
                    ))}
                    <Modal.FormError />
                    <Modal.Footer className="px-0" loading={isBusy} />
                </Modal.Content>
            </Modal.Panel>
        </Modal>
    );
};

export default ExampleModalForm;
```

### Flat page form

For full-page forms, use a standard `<form>` element with a grid layout:

```tsx
import type { SubmitHandler } from "react-hook-form";
import { RenderFormField } from "~/components/form-controls/render-form-field";


const ExamplePageForm = () => {
    const { fields, handleSubmit } = useManageExampleForm();

    const onSubmit: SubmitHandler<ExampleFormType> = async (values) => {
        // submit logic
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                {fields.map((field) => (
                    <RenderFormField key={field.name} {...field} />
                ))}
            </div>
        </form>
    );
};
```

### Complex form with FormProvider

When a form has sub-components that need access to form context, use `FormProvider`:

```tsx
import { FormProvider } from "react-hook-form";


const ComplexForm = () => {
    const { formMethods, someField } = useManageComplexForm();

    return (
        <FormProvider {...formMethods}>
            <Modal.Panel as="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
                <RenderFormField {...someField} />
                <ChildFormSection /> {/* uses useFormContext() internally */}
            </Modal.Panel>
        </FormProvider>
    );
};
```

In this case, the manage hook returns `formMethods` (the full `useForm` return value) instead of just `handleSubmit`.

## Best Practices

- Always use `zodResolver` with a Zod schema — never use manual validation
- Sort schema properties and field properties in ascending alphabetical order
- Extract schema to a separate file when it exceeds ~10 fields
- Extract form-fields and default-values hooks when the form has complex conditional logic
- Use reusable schemas from `~/utils/zod-common` and `r3-utils/zod-common`
- Always type the `FormField` array as `FormField<YourFormType>[]`
- Prefer modal forms (`useRouteDialog` + `Modal`) unless the form is part of a multi-step flow
- Use `FormProvider` only when child components need direct access to form methods
- Import `FormField` type from `~/components/form-controls/types`
- Import `RenderFormField` from `~/components/form-controls/render-form-field`

## Submission Pattern (useSubmitData)

For route-action form submissions in this project, follow this pattern:

1. Import `useSubmitData` from `r3-utils/hooks`.
2. Initialize submit handler at component level:
   - `const submit = useSubmitData();`
3. Use `submit(...)` inside the form submit callback (including async callbacks when needed), with explicit options:
   - `action`: route action path
   - `encType`: optional; default is `"application/json"`, set explicitly for overrides such as `"multipart/form-data"`
   - `method`: optional; default is `"POST"`, set explicitly only when overriding
4. Keep payload-building logic separate from UI rendering logic when forms have multiple submission modes.
5. Prefer `useNavigationState().isSubmitting` for submit loading state instead of local fetcher submit-state wiring when using this pattern.

Example:

```tsx
import { useNavigationState, useSubmitData } from "r3-utils/hooks";

const FeatureForm = () => {
    const submit = useSubmitData();
    const { isSubmitting } = useNavigationState();

    const onSubmit = async (values: FeatureFormType) => {
        submit(
            { name: values.name },
            {
                action: "/dashboard/feature",
            }
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <button disabled={isSubmitting} type="submit">
                Save
            </button>
        </form>
    );
};
```
