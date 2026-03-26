const parseJwtPayload = (token: string): Record<string, unknown> | null => {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
        const jsonPayload = atob(paddedBase64);
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

export const isAccessTokenValid = (token: string | null) => {
    if (!token) return false;

    const payload = parseJwtPayload(token);
    if (!payload) return false;

    const exp = payload.exp;
    if (typeof exp !== 'number') return true;

    return exp * 1000 > Date.now();
};
