
import { useState } from "react";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isLoading, setIsLoading] = useState(false);

  const resetToken = new URLSearchParams(
    window.location.search
  ).get("token");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!resetToken) {
      setMessage("Your reset link is invalid. Please request a new one.");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Your passwords do not match.");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Your password must be at least 8 characters long.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://backend-course-api-fzwg.onrender.com/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resetToken,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || "Unable to reset your password."
        );
      }

      setMessage(
        data.message ||
          "Your password has been reset successfully. You can now log in."
      );
      setMessageType("success");
      setNewPassword("");
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

      {/* Reset password card */}
      <section className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <a
          href="/"
          className="mb-8 flex items-center justify-center gap-3"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-700 text-xl font-black shadow-lg shadow-indigo-600/20">
            B
          </span>

          <span className="text-2xl font-bold tracking-tight">
            Backend<span className="text-indigo-400">Hub</span>
          </span>
        </a>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-9">
          {/* Security icon */}
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
              <rect x="5" y="10" width="14" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              <path d="M12 14v3" />
            </svg>
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
            Account security
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Reset password
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Create a new password to secure your account. Choose
            something strong that you haven't used before.
          </p>

          {!resetToken ? (
            <div className="mt-7 rounded-xl border border-red-400/20 bg-red-400/10 p-4">
              <p className="text-sm font-semibold text-red-300">
                Invalid reset link
              </p>
              <p className="mt-1 text-sm leading-5 text-red-200/80">
                The password-reset token is missing. Please request
                a new reset email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* New password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium text-zinc-200"
                >
                  New password
                </label>

                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  placeholder="Enter your new password"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-zinc-200"
                >
                  Confirm new password
                </label>

                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Enter your password again"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {/* Show password */}
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(event) =>
                    setShowPassword(event.target.checked)
                  }
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
                    Resetting password...
                  </>
                ) : (
                  <>
                    Reset password
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Feedback message */}
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
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-indigo-300"
            >
              <span aria-hidden="true">←</span>
              Back to BackendHub
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs leading-5 text-zinc-600">
          Protected by secure, time-limited password reset tokens.
          <br />
          © {new Date().getFullYear()} BackendHub
        </p>
      </section>
    </main>
  );
}

export default ResetPassword;