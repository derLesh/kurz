export const ERROR_TYPES = {
    EXPIRED: {
        message: "Link expired",
        extendedMessage: "The link you are trying to access has expired.",
        code: 1
    },
    NOT_FOUND: {
        message: "Link not found",
        extendedMessage: "The link you are trying to access does not exist.",
        code: 2
    },
    UNAUTHORIZED: {
        message: "Unauthorized",
        extendedMessage: "You are not authorized to do this. Please sign in and try again.",
        code: 3
    },
    FORBIDDEN: {
        message: "Forbidden",
        extendedMessage: "You are not allowed to do this. Please try again.",
        code: 4
    },
    INTERNAL_SERVER_ERROR: {
        message: "Internal server error",
        extendedMessage: "An error occurred while processing your request. Please try again later.",
        code: 5
    },
    VIEW_LIMIT_REACHED: {
        message: "View limit reached",
        extendedMessage: "The view limit for this text has been reached.",
        code: 6
    }
}

export const getErrorUrl = (errorType: keyof typeof ERROR_TYPES) => {
    return `/error?code=${ERROR_TYPES[errorType].code}`;
};