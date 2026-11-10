import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and merges tailwind classes using twMerge.
 *
 * @param {...ClassValue[]} input - List of class names or expressions.
 * @returns {string} - A single merged string with unique class names.
 */
export const cn = (...input: ClassValue[]): string => {
    return twMerge(clsx(input));
};
