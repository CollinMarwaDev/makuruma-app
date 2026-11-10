/**
 * Retrieves the computed value of a CSS custom property (variable) from the root document element.
 *
 * @param {string} variable - The name of the CSS variable whose value needs to be retrieved.
 *                            It should be prefixed with '--' eg: --color-primary.
 * @returns {string} The computed value of the specified CSS variable. Returns an empty string
 *                   if executed in a server-side rendering (SSR) environment or if the variable is not found.
 */
export const getColorValue = (variable: string): string => {
    if (typeof window === "undefined") {
        return ""; // Fallback for SSR
    }
    return getComputedStyle(document.documentElement)
        .getPropertyValue(variable)
        .trim();
};

/**
 * Determines a readable text color (either dark or light) based on the luminance
 * of the provided background color in hexadecimal format.
 *
 * If the input is invalid or undefined, a default dark text color will be returned.
 *
 * @param {string} [hexColor] - A 6-character hexadecimal color string (e.g., "#RRGGBB").
 *                              The input is case-insensitive.
 * @returns {string} - The hexadecimal string for the readable text color:
 *                     "#111827" for dark text, or "#FFFFFF" for light text.
 */
export const getReadableTextColor = (hexColor?: string) => {
    if (!hexColor || !/^#[0-9a-f]{6}$/i.test(hexColor)) {
        return "#111827";
    }

    const red = Number.parseInt(hexColor.slice(1, 3), 16);
    const green = Number.parseInt(hexColor.slice(3, 5), 16);
    const blue = Number.parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

    return luminance > 0.62 ? "#111827" : "#FFFFFF";
};
