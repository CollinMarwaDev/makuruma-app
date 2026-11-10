import { ApiListSchema as BaseApiListSchema } from "~/global/utils/r3/zod-common";
import { type z } from "zod";
import { DateTimeSchema } from "~/global/utils/zod-common";

export const ApiListSchema = <T extends z.ZodType>(schema: T) =>
    BaseApiListSchema(schema).extend({
        timestamp: DateTimeSchema("timestamp").optional(),
    });
