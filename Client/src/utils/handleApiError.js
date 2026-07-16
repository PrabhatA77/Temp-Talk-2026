export function handleApiError(error) {
    //console.log(error.response);

    if (error.response) {
        //console.log(error.response.data);

        return {
            success: false,
            status: error.response.status,
            message: error.response.data?.message || "Something went wrong.",
            errors: error.response.data?.errors || {},
        };
    }

    return {
        success: false,
        status: null,
        message: error.message,
        errors: {},
    };
}