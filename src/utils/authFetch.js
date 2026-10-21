
const API_URL = "https://backend-course-api-fzwg.onrender.com";

let refreshPromise = null;

const AUTH_ERROR_MESSAGES = new Set([
    "A valid Bearer token is required",
    "Invalid access token",
    "Invalid or expired token",
]);

async function refreshAuthTokens() {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            const error = new Error("Refresh token is missing");
            error.status = 401;
            throw error;
        }

        let response;

        try {
            response = await fetch(`${API_URL}/auth/refresh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refreshToken }),
            });
        } catch (cause) {
            const error = new Error("Unable to reach the server");
            error.cause = cause;
            throw error;
        }

        let result;

        try {
            result = await response.json();
        } catch {
            result = {};
        }

        if (
            !response.ok ||
            !result.success ||
            !result.data?.accessToken ||
            !result.data?.refreshToken
        ) {
            const error = new Error(
                result.message || "Token refresh failed"
            );
            error.status = response.status;
            throw error;
        }

        localStorage.setItem("accessToken", result.data.accessToken);
        localStorage.setItem("refreshToken", result.data.refreshToken);

        return result.data.accessToken;
    })();

    try {
        return await refreshPromise;
    } finally {
        refreshPromise = null;
    }
}

async function authFetch(path, options = {}) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        throw new Error("Please log in to continue");
    }

    const headers = new Headers(options.headers || {});
    headers.set("Authorization", `Bearer ${accessToken}`);

    let response = await fetch(`${API_URL}${path}`, {
        ...options,
        cache: "no-store",
        headers,
    });

    if (response.status !== 401) {
        return response;
    }

    // Inspect a copy so the original response body remains readable.
    let result = {};

    try {
        result = await response.clone().json();
    } catch {
        return response;
    }

    // Do not refresh for unrelated errors such as incorrect passwords.
    if (!AUTH_ERROR_MESSAGES.has(result.message)) {
        return response;
    }

    try {
        const newAccessToken = await refreshAuthTokens();

        const retryHeaders = new Headers(options.headers || {});
        retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);

        response = await fetch(`${API_URL}${path}`, {
            ...options,
            cache: "no-store",
            headers: retryHeaders,
        });

        if (response.status === 401) {
            const error = new Error(
                "Authentication failed after refreshing"
            );
            error.status = 401;
            throw error;
        }

        return response;
    } catch (error) {
        if (error.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.assign("/login");
        }

        throw error;
    }
}

export { authFetch, refreshAuthTokens };
