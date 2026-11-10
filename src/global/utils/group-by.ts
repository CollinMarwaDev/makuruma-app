/**
 * Groups an array of objects by a specified key.
 *
 * @template T - The type of the objects in the array.
 * @param {T[]} array - The array of objects to be grouped.
 * @param {keyof T} key - The key to group the objects by.
 * @returns {Record<string, T[]>} - An object where each key is a group name and each value is an array of objects that belong to that group.
 */
export const groupBy = <T extends object>(
    array: T[],
    key: keyof T
): Record<string, T[]> =>
    array.reduce(
        (result, currentValue) => {
            const groupKey = String(currentValue[key]);
            if (!result[groupKey]) {
                result[groupKey] = [];
            }
            result[groupKey].push(currentValue);
            return result;
        },
        {} as Record<string, T[]>
    );
