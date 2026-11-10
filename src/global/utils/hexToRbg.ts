/**
 * Converts a hexadecimal color code to an RGB color string.
 *
 * @param {string} hexColor - The hexadecimal color code to convert.
 * @param {number} [alpha=1] - Optional alpha value for the RGB color string.
 * @returns {string} The RGB color string.
 */
export const hexToRgb = (hexColor: string, alpha?: number): string => {
    // Remove '#' symbol if present
    hexColor = hexColor.replace("#", "");

    // Parse hexadecimal components
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);

    // Return RGB color string
    return `rgb(${r}, ${g}, ${b},${alpha ?? 1})`;
};
