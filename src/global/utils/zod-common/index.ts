//💡reusable zod schema & types
import {
    ApiDetailsSchema,
    createOptionalRefinement,
    NoneEmptyStringSchema,
} from "~/global/utils/r3/zod-common";
import type { RawCreateParams } from "zod";
import { type Schema, z } from "zod";

export const LabelAndValueSchema = z.object({
    label: NoneEmptyStringSchema("label"),
    value: z.union([z.string(), z.number(), z.boolean()]),
});

// ----------------------------------------------------------------------

/**
 * Creates a Zod array schema ensuring at least one item of a specified schema type.
 * @param schema - Zod schema for array items
 * @param params - Optional raw create parameters
 * @returns Zod array schema with min 1 item
 */
export const AtLeastOneArrayItemSchema = <T extends Schema>(
    schema: T,
    params?: RawCreateParams
) => {
    return z.array(schema, params).min(1);
};

// ----------------------------------------------------------------------
export const OptionalUrlSchema = z
    .string()
    .optional()
    .default("")
    .superRefine(
        createOptionalRefinement(z.string().url(), "invalid url address")
    );
// ----------------------------------------------------------------------

/**
 * Schema for validating user select option data.
 *
 * UserSelectOptionSchema is derived from {@link SelectOptionSchema}, excluding the `selected` property.
 * Additional fields specific to the user select option are included:
 * - `avatar`: A valid URL string representing the avatar of the user.
 * - `email`: A valid email address string.
 */
export const UserSelectOptionSchema = z.object({
    ...LabelAndValueSchema.shape,
    avatar: OptionalUrlSchema,
    email: z.string().email("Invalid email address"),
});

// ----------------------------------------------------------------------

export const ActionBySchema = z.object(
    {
        description: z.string().optional(),
        fullName: NoneEmptyStringSchema("action by full name"),
        imageUrl: OptionalUrlSchema,
        position: NoneEmptyStringSchema("position"),
    },
    { message: "Action by must be an object" }
);

export type ActionByType = z.infer<typeof ActionBySchema>;

// ----------------------------------------------------------------------
const normalizeDateTime = (value: string) => {
    // If it's a datetime with no timezone, assume UTC.
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/.test(value)) {
        return `${value}Z`;
    }

    return value;
};

export const DateSchema = (label: string) => {
    return NoneEmptyStringSchema(label)
        .refine(
            (date) => {
                const dateSchema = z.string().date();
                const datetimeSchema = z.string().datetime();

                return (
                    dateSchema.safeParse(date).success ||
                    datetimeSchema.safeParse(normalizeDateTime(date)).success
                );
            },
            { message: "invalid date or datetime" }
        )
        .transform((value) => normalizeDateTime(value));
};

export const DateTimeSchema = (label: string) =>
    NoneEmptyStringSchema(label)
        .transform(normalizeDateTime)
        .pipe(z.string().datetime());
// ----------------------------------------------------------------------

export const OptionalStringSchema = (label: string = "string") =>
    z
        .string()
        .optional()
        .default("")
        .superRefine(
            createOptionalRefinement(
                NoneEmptyStringSchema(label),
                `${label} is required`
            )
        );

// ----------------------------------------------------------------------

export const PhoneNumberSchema = z.object({
    countryCode: z.object({
        label: z.string(),
        value: z.string(),
    }),
    phoneNumber: NoneEmptyStringSchema("phoneNumber"),
});

export type PhoneNumberType = z.infer<typeof PhoneNumberSchema>;

// ----------------------------------------------------------------------

export const UploadFileResponseSchema = ApiDetailsSchema(
    z.object({
        url: NoneEmptyStringSchema("file ulr").url({
            message: "must be valid file url",
        }),
    })
);

export type UploadFileResponseType = z.infer<typeof UploadFileResponseSchema>;

// ----------------------------------------------------------------------
