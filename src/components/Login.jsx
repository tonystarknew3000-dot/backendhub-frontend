import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://backend-course-api-fzwg.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        setMessage(data.message || "Login failed. Please try again.");
        setMessageType("error");
        return;
      }

      if (!data.data?.accessToken || !data.data?.refreshToken) {
        setMessage("The server response did not contain the expected tokens.");
        setMessageType("error");
        return;
      }

      // Save the authentication tokens.
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      // Save the logged-in user's information.
      localStorage.setItem("user", JSON.stringify(data.data.user));

      // Navigate to the dashboard after successful login.
      navigate("/dashboard");
    } catch (error) {
      console.error("Login request failed:", error);
      setMessage("Unable to connect to the server. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507] px-4 py-12 text-white sm:px-6">
      {/* Background effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-violet-700/15 blur-[120px]" />

      <section className="relative z-10 w-full max-w-md">
        {/* BackendHub logo */}
        <a href="/" className="mb-8 flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-700 text-xl font-black shadow-lg shadow-indigo-600/20">
            B
          </span>

          <span className="text-2xl font-bold tracking-tight">
            Backend<span className="text-indigo-400">Hub</span>
          </span>
        </a>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-9">
          {/* Login icon */}
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-7 w-7"
              aria-hidden="true"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
            </svg>
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
            Welcome back
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Sign in
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Sign in to your BackendHub account to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-200"
                >
                  Password
                </label>

                <a
                  href="/forgot-password"
                  className="text-xs font-medium text-indigo-300 transition hover:text-indigo-200"
                >
                  Forgot password?
                </a>
              </div>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {/* Show password */}
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(event) => setShowPassword(event.target.checked)}
                className="h-4 w-4 accent-indigo-500"
              />
              Show password
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition duration-200 hover:-translate-y-0.5 hover:from-indigo-400 hover:to-violet-500 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-90"
                      fill="currentColor"
                      d="M4 12a8 8 0 0 1 8-8V0C5.37 0 0 5.37 0 12h4z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Feedback */}
          {message && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-5 rounded-xl border p-4 text-sm leading-6 ${
                messageType === "success"
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                  : "border-red-400/20 bg-red-400/10 text-red-300"
              }`}
            >
              {message}
            </div>
          )}

          <div className="mt-7 border-t border-white/[0.08] pt-6">
            <p className="text-center text-sm text-zinc-400">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-semibold text-indigo-300 transition hover:text-indigo-200"
              >
                Create account
              </a>
            </p>

            <a
              href="/"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-indigo-300"
            >
              <span aria-hidden="true">←</span>
              Back to BackendHub
            </a>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-zinc-600">
          Secure authentication powered by BackendHub.
          <br />© {new Date().getFullYear()} BackendHub
        </p>
      </section>
    </main>
  );
}

export default Login;
