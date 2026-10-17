import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Your passwords do not match.");
      setMessageType("error");
      return;
    }

    if (password.length < 8) {
      setMessage("Your password must be at least 8 characters long.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://backend-course-api-fzwg.onrender.com/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Unable to create your account.");
      }

      setMessage(
        data.message ||
          "Account created successfully. Check your email for verification."
      );
      setMessageType("success");

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(
        error.message ||
          "Unable to connect to the server. Please try again."
      );
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
        <Link to="/" className="mb-8 flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-700 text-xl font-black shadow-lg shadow-indigo-600/20">
            B
          </span>

          <span className="text-2xl font-bold tracking-tight">
            Backend<span className="text-indigo-400">Hub</span>
          </span>
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-9">
          {/* Account icon */}
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
              <circle cx="9" cy="8" r="4" />
              <path d="M3 21v-2a6 6 0 0 1 12 0v2" />
              <path d="M19 8v6" />
              <path d="M16 11h6" />
            </svg>
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
            Get started
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create account
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Join BackendHub and start building with your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                autoComplete="username"
                minLength={3}
                maxLength={30}
                pattern="[A-Za-z0-9_]+"
                title="Use 3–30 letters, numbers, or underscores."
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Choose a username"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              />
              <p className="mt-2 text-xs text-zinc-500">
                3–30 letters, numbers, or underscores.
              </p>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="registerEmail"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Email address
              </label>

              <input
                id="registerEmail"
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
              <label
                htmlFor="registerPassword"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Password
              </label>

              <input
                id="registerPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a strong password"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Enter your password again"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {/* Show passwords */}
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(event) => setShowPassword(event.target.checked)}
                className="h-4 w-4 accent-indigo-500"
              />
              Show passwords
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
                  Creating account...
                </>
              ) : (
                <>
                  Create account
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
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-300 transition hover:text-indigo-200"
              >
                Sign in
              </Link>
            </p>

            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-indigo-300"
            >
              <span aria-hidden="true">←</span>
              Back to BackendHub
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-zinc-600">
          Your password is securely processed by the backend.
          <br />
          © {new Date().getFullYear()} BackendHub
        </p>
      </section>
    </main>
  );
}

export default Register;