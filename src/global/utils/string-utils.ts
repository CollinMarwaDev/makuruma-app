import { countriesAndCodes } from "~/global/constants/country-constants";
import type { LabelWithStringValue, LabelWithValue } from "~/global/types";
import { formatInputAdvanced } from "~/global/utils/format-input-advance";
import type { PhoneNumberType } from "~/global/utils/zod-common";

/**
 * Gets the initials from a name.
 *
 * @param name - The name to extract initials from. Can be a single name or full name.
 * @returns A two-character string containing the initials. For full names, returns first letter of
 * first name and first letter of last name. For single names, returns the first two letters.
 *
 * @example
 * // Returns "JD"
 * getInitials("John Doe")
 *
 * @example
 * // Returns "JS"
 * getInitials("Jane Smith")
 *
 * @example
 * // Returns "BA"
 * getInitials("Barack")
 */
export function getInitials(name: string): string {
    if (!name || name.trim() === "") {
        return "";
    }

    const nameParts = name.trim().split(/\s+/);

    if (nameParts.length >= 2) {
        const firstInitial = nameParts[0].charAt(0).toUpperCase();
        const lastInitial = nameParts[nameParts.length - 1]
            .charAt(0)
            .toUpperCase();
        return `${firstInitial}${lastInitial}`;
    } else {
        const singleName = nameParts[0];
        if (singleName.length >= 2) {
            return singleName.substring(0, 2).toUpperCase();
        } else {
            return singleName.charAt(0).toUpperCase().repeat(2);
        }
    }
}

/**
 * Generates a random alphanumeric identifier as a string.
 *
 * The generated ID is derived from a random decimal number,
 * removing the initial '0.' and selecting a substring of digits.
 * This ID might not be unique due to the nature of random number generation.
 *
 * @returns {string} A random alphanumeric string of fixed length derived from a random decimal.
 */
export const generateRandomId = () => {
    return Math.random().toString().slice(3, 9);
};

/**
 * Formats a camelCase string to Title Case with spaces
 * @param str - The camelCase string to format
 * @returns A string formatted in Title Case with spaces
 */
export const formatCamelCaseToTitle = (str: string): string => {
    const withSpaces = str.replace(/([A-Z])/g, " $1");
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};

/**
 * Converts a provided LabelWithValue object into a JSON string format.
 * If no value is provided, the function returns undefined.
 *
 * @param {LabelWithValue} [value] - The object containing label and value properties to be serialized.
 * @returns {string|undefined} The JSON string representation of the provided object or undefined if no value is supplied.
 */
export const stringifyLabelValue = (
    value?: LabelWithValue
): string | undefined => (value ? JSON.stringify(value) : undefined);

/**
 * Converts a given PhoneNumberType object to its string representation.
 *
 * @param {PhoneNumberType} phone - The phone number object containing country code and phone number.
 * @returns {string} A string representation of the phone number, combining the country code and the phone number.
 */
export const convertPhoneNumberToString = (
    phone?: PhoneNumberType
): string | undefined => {
    if (!phone) return undefined;

    return `${phone.countryCode.value}${phone.phoneNumber}`;
};

/**
 * Converts a given PhoneNumberType object to its string representation.
 *
 * @param {string} phoneNumber - The phone number value in string.
 * @returns {string} A string representation of the phone number, in a proper format.
 */
export const formatPhoneNumber = (phoneNumber?: string): string | undefined => {
    if (!phoneNumber) return undefined;

    let formattedPhoneNumber: string;

    if (phoneNumber.startsWith("0")) {
        formattedPhoneNumber = `255${phoneNumber.substring(1)}`;
    } else if (phoneNumber.startsWith("+")) {
        formattedPhoneNumber = phoneNumber.substring(1);
    } else {
        formattedPhoneNumber = phoneNumber;
    }

    return formatInputAdvanced(formattedPhoneNumber, "+(###) ### ### ###");
};
/**
 * Generates a default phone number value from a phone number string.
 *
 * Supports:
 * - Local numbers (e.g. 0712345678)
 * - International numbers with '+' (e.g. +255712345678)
 * - International numbers without '+' (e.g. 255712345678)
 * - Country codes of varying lengths.
 *
 * @param phone - The input phone number.
 * @returns A normalized PhoneNumberType.
 */
export const generateDefaultPhoneNumberValue = (
    phone?: string
): PhoneNumberType | undefined => {
    if (!phone) return undefined;

    const DEFAULT_COUNTRY: LabelWithStringValue = {
        label: "TZ",
        value: "+255",
    };

    // Remove spaces, dashes, parentheses, etc.
    const normalizedPhone = phone.trim().replace(/[^\d+]/g, "");

    // Local number (0712345678)
    if (normalizedPhone.startsWith("0")) {
        return {
            countryCode: DEFAULT_COUNTRY,
            phoneNumber: normalizedPhone.slice(1),
        };
    }

    // Convert "255712345678" -> "+255712345678"
    const internationalPhone = normalizedPhone.startsWith("+")
        ? normalizedPhone
        : `+${normalizedPhone}`;

    // Find the longest matching country code.
    const country = [...countriesAndCodes]
        .sort((a, b) => b.phone.length - a.phone.length)
        .find(({ phone }) => internationalPhone.startsWith(phone));

    if (!country) {
        return {
            countryCode: DEFAULT_COUNTRY,
            phoneNumber: internationalPhone.replace(/^\+/, ""),
        };
    }

    return {
        countryCode: {
            label: country.code,
            value: country.phone,
        },
        phoneNumber: internationalPhone.slice(country.phone.length),
    };
};

/**
 * Evaluates a given password against a set of constraints and returns the results for each constraint.
 *
 * The constraints include:
 * - Minimum length requirement of 8 characters.
 * - Presence of at least one uppercase letter.
 * - Presence of at least one numeric digit.
 * - Presence of at least one special character.
 *
 * @param {string} password - The password to be evaluated.
 * @returns {Array<{name: string, isValid: boolean}>} An array of objects where each object represents a constraint's name and the validation result for the given password.
 */
export const passwordConstraints = (
    password: string
): {
    name: string;
    isValid: boolean;
}[] => {
    return [
        {
            isValid: password?.length >= 8,
            name: "At least 8 characters",
        },
        {
            isValid: new RegExp("(?=.*[A-Z])").test(password),
            name: "Upper & lowercase letters",
        },
        {
            isValid: new RegExp("(?=.*[0-9])").test(password),
            name: "At least one number",
        },
        {
            isValid: new RegExp("(?=.*[!@#$%^&*])").test(password),
            name: "At least one special character",
        },
    ];
};
