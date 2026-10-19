import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setMessageType("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://backend-course-api-fzwg.onrender.com/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || "Unable to process your request."
        );
      }

      setMessage(
        data.message ||
          "If the account exists, password-reset instructions will be sent."
      );
      setMessageType("success");
      setEmail("");
    } catch (error) {
      setMessage(
        error.message || "Something went wrong. Please try again."
      );
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-[#050507] px-4 py-12 text-white selection:bg-violet-500/30 sm:px-6 sm:py-16 lg:px-8">
      {/* Ambient violet lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px] sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-indigo-600/20 blur-[130px] sm:h-[30rem] sm:w-[30rem]" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/[0.07] blur-[120px]" />
      </div>

      <section className="relative z-10 my-auto w-full max-w-md min-w-0">
        {/* BackendHub brand */}
        <Link
          to="/"
          aria-label="BackendHub home"
          className="mb-8 flex items-center justify-center gap-3"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-indigo-500 via-violet-600 to-fuchsia-600 text-xl font-black shadow-lg shadow-violet-950/40 transition duration-300 hover:scale-105">
            B
          </span>

          <span className="px-1 text-2xl font-bold tracking-tight">
            Backend
            <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
              Hub
            </span>
          </span>
        </Link>

        <Link
          to="/"
          className="mb-6 inline-flex max-w-full items-center gap-2 text-sm text-gray-400 transition-colors hover:text-violet-200"
        >
          <span aria-hidden="true">←</span>
          Back to Home
        </Link>

        {/* Premium Violet Glass card — original padding preserved */}
        <div className="relative rounded-3xl border border-white/10 bg-white/[0.045] p-7 shadow-[0_20px_80px_rgba(109,40,217,0.12)] backdrop-blur-2xl sm:p-10 lg:p-11">
          {/* Top accent */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/70 to-transparent sm:inset-x-10"
          />

          {/* Card glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/[0.12] blur-[70px]"
          />

          <div className="relative min-w-0">
            {/* Recovery icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-indigo-400/[0.15] to-violet-400/[0.08] text-violet-300 shadow-inner shadow-white/[0.04]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4 7 8 6 8-6"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 3.5a4 4 0 0 1 4 4"
                />
              </svg>
            </div>

            <p className="mt-6 px-1 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
              Account recovery
            </p>

            {/* Horizontal text padding prevents gradient edges from clipping */}
            <h1 className="mt-3 -mx-1 px-1 py-1 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-white via-violet-100 to-violet-400 bg-clip-text text-transparent">
                Forgot password?
              </span>
            </h1>

            <p className="mt-4 px-1 text-sm leading-7 text-gray-400 sm:text-base">
              No worries. Enter the email address associated with your
              account. If the account exists, we'll send instructions
              to reset your password.
            </p>

            {/* Feedback message */}
            {message && (
              <div
                role="status"
                aria-live="polite"
                className={`mt-6 flex min-w-0 items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${
                  messageType === "success"
                    ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200"
                    : "border-red-400/20 bg-red-400/[0.06] text-red-200"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 font-bold"
                >
                  {messageType === "success" ? "✓" : "!"}
                </span>
                <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                  {message}
                </span>
              </div>
            )}

            {/* Email form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="min-w-0">
                <label
                  htmlFor="email"
                  className="mb-2 block px-1 text-sm font-medium text-gray-200"
                >
                  Email address
                </label>

                <div className="group relative">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-violet-300 transition-colors group-focus-within:text-violet-200">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="3" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4 7 8 6 8-6"
                      />
                    </svg>
                  </span>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full min-w-0 rounded-xl border border-white/10 bg-black/25 py-4 pl-12 pr-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-gray-500 hover:border-white/20 focus:border-violet-400/60 focus:bg-violet-500/[0.04] focus:ring-4 focus:ring-violet-500/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 ring-1 ring-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-violet-500/20 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
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
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span className="min-w-0 break-words">
                      Sending request...
                    </span>
                  </>
                ) : (
                  <>
                    <span className="px-1">Send Reset Link</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Account access divider */}
            <div className="my-8 flex items-center gap-3">
              <div className="h-px min-w-0 flex-1 bg-white/[0.08]" />
              <span className="shrink-0 px-1 text-[10px] font-medium uppercase tracking-[0.16em] text-gray-500">
                Account access
              </span>
              <div className="h-px min-w-0 flex-1 bg-white/[0.08]" />
            </div>

            <p className="px-1 text-center text-sm leading-6 text-gray-400">
              Remember your password?{" "}
              <Link
                to="/login"
                className="inline-block px-0.5 font-semibold text-violet-300 transition-colors hover:text-violet-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2 px-2 text-center text-xs leading-6 text-gray-500">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 shrink-0 text-violet-300"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <rect x="5" y="10" width="14" height="11" rx="2" />
            <path
              strokeLinecap="round"
              d="M8 10V7a4 4 0 118 0v3"
            />
          </svg>
          <span>BackendHub · Secure account recovery</span>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;