import { z, type RefinementCtx } from "zod";

export const NoneEmptyStringSchema = (label: string) =>
    z
        .string({ required_error: `${label} is required` })
        .trim()
        .min(1, { message: `${label} is required` });

export const PositiveNumberSchema = z.coerce.number().positive("must be a positive number");

/** Validate with `schema` only when a value is present. */
export const createOptionalRefinement =
    (schema: z.ZodTypeAny, message: string) => (value: unknown, ctx: RefinementCtx) => {
        if (value === undefined || value === null || value === "") return;
        if (!schema.safeParse(value).success) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    };

export const ApiDetailsSchema = <T extends z.ZodTypeAny>(schema: T) => z.object({ data: schema });

export const ApiListSchema = <T extends z.ZodTypeAny>(schema: T) =>
    z.object({
        data: z.array(schema),
        pagination: z
            .object({
                currentPage: z.number(),
                pageSize: z.number(),
                totalItems: z.number(),
                totalPages: z.number(),
            })
            .optional(),
    });

export type SelectInputOptionType = { label: string; value: string | number };
