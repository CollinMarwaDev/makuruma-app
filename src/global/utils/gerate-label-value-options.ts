import type { LabelWithValue } from "~/global/types";

/**
 * Type definition for options required to generate label-value pairs
 */
type GenerateLabelValueOptions<TData> = {
    /**
     * Field name to use as label in generated label-value pairs
     */
    label: keyof TData;
    /**
     * Field name to use as value in generated label-value pairs
     */
    value: keyof TData;
};

/**
 * Generates an array of label-value pairs from input data using specified mapping options
 * @param data - Array of input data objects
 * @param options - Options specifying which fields to use for label and value
 * @returns Array of LabelWithValue objects
 */
export function generateLabelValueOptions<TData>(
    data: TData[] | undefined,
    options: GenerateLabelValueOptions<TData>
): LabelWithValue[];

/**
 * Generates an array of label-value pairs from input data that has name and id fields
 * @param data - Array of input objects containing name and id fields
 * @returns Array of LabelWithValue objects using name as label and id as value
 */
export function generateLabelValueOptions<
    TData extends { name: string; id: number | string },
>(data: TData[] | undefined): LabelWithValue[];

/**
 * Implementation of generateLabelValueOptions that handles both signatures
 * @param data - Input data array
 * @param options - Optional mapping options
 * @returns Array of LabelWithValue objects
 */
export function generateLabelValueOptions<TData>(
    data: TData[] | undefined = [],
    options?: GenerateLabelValueOptions<TData>
) {
    if (!data) return [];

    return data.map((item) => ({
        label: String(item[options?.label ?? ("name" as keyof TData)]),
        value: item[options?.value ?? ("id" as keyof TData)],
    })) as LabelWithValue[];
}
