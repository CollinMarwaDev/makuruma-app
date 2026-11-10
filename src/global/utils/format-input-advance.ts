/**
 * Formats an input string based on a provided mask template.
 *
 * The function applies a mask to the `value` parameter by replacing placeholder characters
 * in the mask with the corresponding characters from the `value`. Non-alphanumeric characters
 * are removed from the input before applying the mask. It supports repeating the mask pattern
 * for the remaining input characters when the `repeat` parameter is set to `true`.
 *
 * @param {string} value - The input string to format, which is sanitized by removing non-alphanumeric characters.
 * @param {string} mask - The mask template containing placeholders represented by the `#` character.
 * @param {boolean} [repeat=false] - A flag determining whether the mask should be applied repeatedly to the input.
 * @returns {string} - The formatted string based on the provided mask and repeat flag.
 */
export const formatInputAdvanced = (
    value: string,
    mask: string,
    repeat: boolean = false
): string => {
    const rawValue = value.replace(/[^a-zA-Z0-9]/g, "");
    const placeholder = "#";
    let result = "";
    let index = 0;

    const applyMask = () => {
        let segment = "";
        for (let i = 0; i < mask.length && index < rawValue.length; i++) {
            const char = mask[i];
            if (char === placeholder) {
                segment += rawValue[index];
                index++;
            } else {
                segment += char;
            }
        }
        return segment;
    };

    if (repeat) {
        while (index < rawValue.length) {
            if (result && result[result.length - 1] !== " ") result += " ";
            result += applyMask();
        }
    } else {
        result = applyMask();
        if (index < rawValue.length) {
            result += rawValue.slice(index);
        }
    }

    return result;
};
