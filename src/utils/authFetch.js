
const API_URL = "https://backend-course-api-fzwg.onrender.com";

let refreshPromise = null;

async function refreshAuthTokens() {
    // Reuse an in-progress refresh to avoid rotating the token twice.
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

        // Save BOTH tokens because the backend rotates the refresh token.
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
        headers,
    });

    // Refresh only when a protected request returns 401.
    if (response.status !== 401) {
        return response;
    }

    try {
        const newAccessToken = await refreshAuthTokens();

        const retryHeaders = new Headers(options.headers || {});
        retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);

        // Retry the original request once.
        response = await fetch(`${API_URL}${path}`, {
            ...options,
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
        // Clear the session only for authentication failures.
        if (error.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            window.location.assign("/login");
        }

        // For network errors and server errors, preserve the session.
        throw error;
    }
}

export { authFetch, refreshAuthTokens };
