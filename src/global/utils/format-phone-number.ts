export const TANZANIA_PHONE_REGEX = /^255\d{9}$/;

/**
 * Formats a phone number to the standard 255XXXXXXXXX format.
 * Handles cases:
 * - +2557XXXXXXXXX -> 2557XXXXXXXXX
 * - 2557XXXXXXXXX -> 2557XXXXXXXXX
 * - 07XXXXXXXXX -> 2557XXXXXXXXX
 * - +2556XXXXXXXXX -> 2556XXXXXXXXX
 * - 2556XXXXXXXXX -> 2556XXXXXXXXX
 * - 06XXXXXXXXX -> 2556XXXXXXXXX
 */
export const formatTanzanianNumber = (number: string): string => {
    const clean = number.trim().replace(/\D/g, "");

    // Handle 2556... and 2557... (12 digits)
    if (clean.length === 12 && clean.startsWith("255")) {
        return clean;
    }

    // Handle 06... and 07... (10 digits)
    if (
        clean.length === 10 &&
        (clean.startsWith("06") || clean.startsWith("07"))
    ) {
        return "255" + clean.substring(1);
    }

    return clean;
};

export const isValidTanzanianNumber = (number: string): boolean => {
    return TANZANIA_PHONE_REGEX.test(number);
};

export const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export type RecipientType = "contact" | "group" | "manual";

export interface RecipientOption {
    id: string; // unique ID or value
    label: string;
    subLabel?: string;
    type: RecipientType;
    value: string; // The actual phone number or email string
    contactCount?: number;
    isValid?: boolean;
    avatar?: string;
}
