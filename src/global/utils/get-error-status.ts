/**
 * Reads an HTTP status from the shapes thrown by loaders and the API client:
 * a `Response`, an object with `status`, or a React Router `data()` result
 * carrying `init.status`. Returns `undefined` when none is present.
 */
export const getErrorStatus = (error: unknown): number | undefined => {
    if (error instanceof Response) return error.status;
    if (!error || typeof error !== "object") return undefined;
    if ("status" in error && typeof error.status === "number") {
        return error.status;
    }
    if (
        "init" in error &&
        error.init &&
        typeof error.init === "object" &&
        "status" in error.init &&
        typeof error.init.status === "number"
    ) {
        return error.init.status;
    }
    return undefined;
};
