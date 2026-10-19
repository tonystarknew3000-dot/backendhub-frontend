
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

  const textSafe = "min-w-0 break-words [overflow-wrap:anywhere]";

  const inputClass =
    "w-full min-w-0 rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-gray-600 hover:border-white/20 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10";

  const primaryButton =
    "group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold leading-6 text-white shadow-lg shadow-violet-950/30 ring-1 ring-white/10 transition duration-200 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

  const secondaryLink =
    "inline-flex items-center gap-2 text-sm font-medium leading-6 text-gray-400 transition-colors hover:text-violet-300";

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
      setShowPassword(false);
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
    <main className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-[#050507] px-4 py-10 text-white selection:bg-violet-500/30 sm:px-6 sm:py-12">
      {/* Ambient violet lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-700/[0.13] blur-[120px]" />
        <div className="absolute -right-40 top-[20%] h-96 w-96 rounded-full bg-indigo-600/[0.12] blur-[130px]" />
        <div className="absolute -bottom-48 left-[25%] h-96 w-96 rounded-full bg-fuchsia-700/[0.08] blur-[130px]" />
      </div>

      <section className="relative z-10 w-full max-w-md">
        {/* BackendHub branding */}
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-3 px-2"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600 text-xl font-black text-white shadow-lg shadow-violet-700/25 ring-1 ring-white/15">
            B
          </span>

          <span className="text-2xl font-bold leading-tight tracking-tight text-white">
            Backend<span className="text-violet-400">Hub</span>
          </span>
        </Link>

        {/* Registration card */}
        <div className="rounded-3xl border border-white/[0.10] bg-white/[0.045] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">
          <div className="px-1">
            {/* Account icon */}
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/[0.10] text-violet-200 shadow-inner shadow-white/[0.03]">
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

            <p className="text-xs font-semibold uppercase leading-5 tracking-[0.2em] text-violet-300">
              Get started
            </p>

            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Create{" "}
              <span className="bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
                account
              </span>
            </h1>

            <p className="mt-3 text-sm leading-7 text-gray-400">
              Join BackendHub and start building with your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Username */}
            <div className="min-w-0">
              <label
                htmlFor="username"
                className="mb-2 block px-1 text-sm font-medium leading-6 text-gray-200"
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
                className={inputClass}
              />

              <p className="mt-2 px-1 text-xs leading-6 text-gray-500">
                3–30 letters, numbers, or underscores.
              </p>
            </div>

            {/* Email */}
            <div className="min-w-0">
              <label
                htmlFor="registerEmail"
                className="mb-2 block px-1 text-sm font-medium leading-6 text-gray-200"
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
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div className="min-w-0">
              <label
                htmlFor="registerPassword"
                className="mb-2 block px-1 text-sm font-medium leading-6 text-gray-200"
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
                className={inputClass}
              />

              <p className="mt-2 px-1 text-xs leading-6 text-gray-500">
                Use at least 8 characters. Your backend may enforce
                additional password requirements.
              </p>
            </div>

            {/* Confirm password */}
            <div className="min-w-0">
              <label
                htmlFor="confirmPassword"
                className="mb-2 block px-1 text-sm font-medium leading-6 text-gray-200"
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
                className={inputClass}
              />
            </div>

            {/* Show passwords */}
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3 text-sm leading-6 text-gray-400 transition hover:border-violet-400/20 hover:text-gray-300">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(event) => setShowPassword(event.target.checked)}
                className="h-4 w-4 shrink-0 accent-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              />
              <span>Show passwords</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={primaryButton}
            >
              {isLoading ? (
                <>
                  <svg
                    className="h-5 w-5 shrink-0 animate-spin"
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
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
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
              className={`mt-5 rounded-xl border px-4 py-3 ${
                messageType === "success"
                  ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300"
                  : "border-red-400/20 bg-red-400/[0.08] text-red-300"
              }`}
            >
              <p className={`px-1 text-sm leading-7 ${textSafe}`}>
                {message}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-7 border-t border-white/[0.08] px-1 pt-6">
            <p className="text-center text-sm leading-7 text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-violet-300 transition hover:text-violet-200"
              >
                Sign in
              </Link>
            </p>

            <Link to="/" className={`mt-5 ${secondaryLink}`}>
              <span aria-hidden="true">←</span>
              Back to BackendHub
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 px-2 text-center text-xs leading-6 text-gray-500">
          Your password is securely processed by the backend.
          <span className="mt-1 block text-gray-600">
            © {new Date().getFullYear()} BackendHub
          </span>
        </p>
      </section>
    </main>
  );
}

export default Register;
