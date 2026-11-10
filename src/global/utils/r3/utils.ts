/** Local replacements for the private `r3-utils/utils` package. */

export const throwError = (message: string): never => {
    throw new Error(message);
};

export const removeNullish = <T extends Record<string, unknown>>(value: T) =>
    Object.fromEntries(
        Object.entries(value).filter(([, v]) => v !== null && v !== undefined)
    ) as Partial<T>;

export const serializeQueryParams = (params: Record<string, unknown>) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
    });
    const query = search.toString();
    return query ? `?${query}` : "";
};

export const parseSearchParams = (input: string | URLSearchParams) =>
    Object.fromEntries(new URLSearchParams(input).entries());

/** Initials avatar as an SVG data URI in the brand colour. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for API compatibility with the kit
export const generateAvatar = (name: string, _options?: { style?: string }) => {
    const initials =
        name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("") || "?";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#2a7f88"/><text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="sans-serif" font-size="26" fill="#fff">${initials}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export type CustomErrorResponse = { status: number; data: { message?: string } | string };

export const isCustomErrorResponse = (error: unknown): error is CustomErrorResponse =>
    typeof error === "object" && error !== null && "status" in error && "data" in error;

export const parseErrorResponse = (error: CustomErrorResponse) => ({
    data: typeof error.data === "string" ? { message: error.data } : error.data,
    status: error.status,
});

export const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : typeof error === "string" ? error : "Something went wrong";
