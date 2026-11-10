import type { UseFallbackUIProps } from "~/global/hooks/useFallbackUI";
import {
    ForbiddenIcon,
    InvalidDataIcon,
    NoConnectionIcon,
    PageSearchIcon,
    ServerIcon,
    UnauthorizedIcon,
} from "~/global/components/error-boundary/icons";
import {
    HTTP_FORBIDDEN,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_ACCEPTABLE,
    HTTP_SERVICE_NOT_AVAILABLE,
    HTTP_UNAUTHORIZED,
    OFFLINE_ERROR_CODE,
} from "~/global/utils/r3/http-client";

/**
 * Mapping of HTTP status codes to their corresponding fallback UI configurations.
 * Used to display appropriate error messages and icons based on the error status.
 */
export const errorMap: Record<number, UseFallbackUIProps> = {
    [HTTP_FORBIDDEN]: {
        description: "You do not have access to view this page",
        icon: ForbiddenIcon,
        statusCode: HTTP_FORBIDDEN,
        title: "Forbidden Access",
    },
    [HTTP_INTERNAL_SERVER_ERROR]: {
        icon: ServerIcon,
        statusCode: HTTP_INTERNAL_SERVER_ERROR,
        title: "Internal Server Error",
    },
    [HTTP_NOT_ACCEPTABLE]: {
        icon: InvalidDataIcon,
        statusCode: HTTP_NOT_ACCEPTABLE,
        title: "Invalid Data",
    },
    [HTTP_SERVICE_NOT_AVAILABLE]: {
        description: "There is no connection to the server",
        icon: NoConnectionIcon,
        statusCode: HTTP_SERVICE_NOT_AVAILABLE,
        title: "No Connection",
    },
    [HTTP_UNAUTHORIZED]: {
        ctaLabel: "Go to Log in",
        ctaLink: "/logout",
        description:
            "Your session has expired. Please login in order to continue.",
        icon: UnauthorizedIcon,
        statusCode: HTTP_UNAUTHORIZED,
        title: "Unauthorized Access",
    },
    [OFFLINE_ERROR_CODE]: {
        icon: PageSearchIcon,
        statusCode: OFFLINE_ERROR_CODE,
        title: "No Connection",
    },
};
