
export const validateHandle = (error: any) => {

    const fieldError = error?.error

    if (fieldError && error.error_code == "VALIDATE_ERROR") {
        const msgs = Object.values(fieldError)
        return msgs[0];
    }
    return;
}