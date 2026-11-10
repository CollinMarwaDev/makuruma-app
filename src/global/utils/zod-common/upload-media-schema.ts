import {
    NoneEmptyStringSchema,
    PositiveNumberSchema,
} from "~/global/utils/r3/zod-common";
import { PersonSchema } from "~/global/utils/zod-common/id-full-name";
import { z } from "zod";

const UploadMediaIdSchema = z.union([
    PositiveNumberSchema,
    NoneEmptyStringSchema("document id"),
]);

const UploadMediaPersonSchema = PersonSchema.extend({
    id: UploadMediaIdSchema,
});

/**
 * Defines the schema for the response of media upload.
 * This schema validates the structure and constraints of the returned data.
 *
 * @property createdAt - An optional upload date supplied by media details APIs.
 * @property fileName - A non-empty string representing the name of the file.
 *                      Must not exceed 255 characters.
 * @property fileSize - A positive number representing the size of the file in bytes.
 * @property fileType - A non-empty string representing the type of the file.
 *                      Must not exceed 255 characters.
 * @property id       - A number or string representing the unique identifier of the file.
 * @property uploadedBy - Optional metadata about the user who uploaded the file.
 * @property url      - A string representing the URL location of the uploaded file.
 *                      Must be a valid URL format.
 */
export const UploadMediaResponseSchema = z.object({
    createdAt: NoneEmptyStringSchema("document created at").optional(),
    fileName: NoneEmptyStringSchema("fileName").max(255, {
        message: "File name is too long",
    }),
    fileSize: z.coerce
        .number()
        .positive({ message: "File size must be positive" }),
    fileType: NoneEmptyStringSchema("fileType").max(255, {
        message: "File type is too long",
    }),
    id: UploadMediaIdSchema,
    uploadedBy: UploadMediaPersonSchema.optional(),
    url: z.string().url({ message: "Invalid URL" }),
});

/**
 * Represents the response type for uploading media.
 *
 * This type is inferred from the {@link UploadMediaResponseSchema} using Zod.
 *
 */
export type UploadMediaResponseType = z.infer<typeof UploadMediaResponseSchema>;
