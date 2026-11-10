import { formatPhoneNumber } from "~/global/utils/string-utils";
import {
    NoneEmptyStringSchema,
    PositiveNumberSchema,
} from "~/global/utils/r3/zod-common";
import { z } from "zod";

export const IdNameSchema = z.object({
    id: PositiveNumberSchema.transform((id) => String(id)),
    name: NoneEmptyStringSchema("name"),
});

export type IdNameType = z.infer<typeof IdNameSchema>;

// ----------------------------------------------------------------------

export const IdFullNameSchema = IdNameSchema.omit({ name: true }).extend({
    fullName: NoneEmptyStringSchema("full name"),
});
export type IdFullNameType = z.infer<typeof IdFullNameSchema>;

// ----------------------------------------------------------------------

export const PersonSchema = IdFullNameSchema.extend({
    avatar: NoneEmptyStringSchema("avatar").url("invalid image url").optional(),
});
export type PersonType = z.infer<typeof PersonSchema>;

// ----------------------------------------------------------------------

export const PersonWithContactSchema = PersonSchema.extend({
    email: NoneEmptyStringSchema("email").email("invalid email address"),
    phoneNumber: NoneEmptyStringSchema("phone number").transform((number) =>
        formatPhoneNumber(number)
    ),
});
export type PersonWithContactType = z.infer<typeof PersonWithContactSchema>;
