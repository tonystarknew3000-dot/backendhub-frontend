
import { useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../utils/authFetch";

function Profile() {
  const [user] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailVerified = user?.emailVerified;

  const glassCard =
    "rounded-2xl border border-white/[0.09] bg-white/[0.035] shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl";

  const textSafe = "min-w-0 break-words [overflow-wrap:anywhere]";

  const primaryButton =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold leading-5 text-white shadow-lg shadow-violet-950/30 ring-1 ring-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 active:translate-y-0";

  const secondaryButton =
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium leading-5 text-gray-300 transition-all duration-200 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white";

  const passwordInputClass =
    "w-full min-w-0 rounded-xl border border-white/10 bg-black/30 px-4 py-3 pr-12 text-sm leading-6 text-white placeholder:text-gray-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

  const visibilityButtonClass =
    "absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-gray-500 transition-colors duration-200 hover:text-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 active:scale-95";

  function PasswordVisibilityIcon({ visible }) {
    return visible ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
        <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.3 3.3" />
        <path d="M6.2 6.2C3.9 7.7 2.8 9.7 2.5 12c.5 1.2 1.7 3.1 4.2 4.8A9.7 9.7 0 0 0 12 19c1.2 0 2.3-.2 3.3-.6" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    if (newPassword.length < 8) {
      setMessage("Your new password must contain at least 8 characters.");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("The new passwords do not match.");
      setMessageType("error");
      return;
    }

    try {
      const response = await authFetch("/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to change password.");
      }

      setMessage(result.message || "Password changed successfully.");
      setMessageType("success");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setShowPasswordForm(false);
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
      setMessageType("error");
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050507] px-4 py-8 text-white selection:bg-violet-500/30 sm:px-8 sm:py-10">
      {/* Ambient violet lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-violet-700/[0.12] blur-[120px]" />
        <div className="absolute right-[-10rem] top-[20%] h-[30rem] w-[30rem] rounded-full bg-indigo-600/[0.10] blur-[130px]" />
        <div className="absolute bottom-[-12rem] left-[30%] h-[28rem] w-[28rem] rounded-full bg-fuchsia-700/[0.07] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Page header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-5 border-b border-white/[0.08] pb-7">
          <div className={`min-w-0 flex-1 ${textSafe}`}>
            <Link
              to="/dashboard"
              className={`${secondaryButton} mb-5`}
            >
              <span aria-hidden="true">←</span>
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600 text-lg font-bold shadow-lg shadow-violet-700/25 ring-1 ring-white/15">
                B
              </div>

              <div className="min-w-0">
                <p className="px-0.5 text-xs font-semibold uppercase leading-5 tracking-[0.2em] text-violet-300">
                  BackendHub
                </p>
                <p className="mt-1 px-0.5 text-xs leading-5 text-gray-500">
                  Personal account workspace
                </p>
              </div>
            </div>

            <h1 className="mt-7 px-1 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Account{" "}
              <span className="bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
                Settings
              </span>
            </h1>

            <p className="mt-3 max-w-xl px-1 text-sm leading-7 text-gray-400 sm:text-base">
              Manage your profile, update your password, and keep your
              account secure.
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-gradient-to-br from-violet-500/20 to-indigo-600/20 text-xl font-bold text-violet-200 shadow-lg shadow-violet-950/20 ring-1 ring-white/[0.06]">
            BH
          </div>
        </header>

        {/* Profile overview */}
        <section className={`${glassCard} overflow-hidden`}>
          <div className="border-b border-white/[0.08] bg-gradient-to-r from-violet-950/70 via-[#17102e]/80 to-indigo-950/50 px-6 py-6 sm:px-8 sm:py-7">
            <p className="px-1 text-xs font-semibold uppercase leading-5 tracking-[0.2em] text-violet-300">
              Personal account
            </p>

            <h2 className="mt-3 px-1 text-xl font-bold leading-tight tracking-tight sm:text-2xl">
              Your profile
            </h2>

            <p className={`mt-3 max-w-2xl px-1 text-sm leading-7 text-gray-400 ${textSafe}`}>
              Your account details are shown below using the user information
              currently saved in your browser.
            </p>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:gap-5 sm:p-6">
            <div className="min-w-0 rounded-xl border border-white/[0.08] bg-black/20 p-4 transition-colors hover:border-violet-400/20 sm:p-5">
              <p className="px-1 text-xs font-medium uppercase leading-5 tracking-wider text-gray-500">
                Username
              </p>
              <p className={`mt-2 px-1 text-sm font-medium leading-7 text-gray-200 sm:text-base ${textSafe}`}>
                {user?.username || "Not available"}
              </p>
            </div>

            <div className="min-w-0 rounded-xl border border-white/[0.08] bg-black/20 p-4 transition-colors hover:border-violet-400/20 sm:p-5">
              <p className="px-1 text-xs font-medium uppercase leading-5 tracking-wider text-gray-500">
                Email address
              </p>
              <p className={`mt-2 px-1 text-sm font-medium leading-7 text-gray-200 sm:text-base ${textSafe}`}>
                {user?.email || "Not available"}
              </p>
            </div>

            <div className="min-w-0 rounded-xl border border-white/[0.08] bg-black/20 p-4 transition-colors hover:border-violet-400/20 sm:p-5">
              <p className="px-1 text-xs font-medium uppercase leading-5 tracking-wider text-gray-500">
                Account role
              </p>
              <p className={`mt-2 px-1 text-sm font-medium leading-7 text-gray-200 sm:text-base ${textSafe}`}>
                {user?.role || "Not available"}
              </p>
            </div>

            <div className="min-w-0 rounded-xl border border-white/[0.08] bg-black/20 p-4 transition-colors hover:border-violet-400/20 sm:p-5">
              <p className="px-1 text-xs font-medium uppercase leading-5 tracking-wider text-gray-500">
                Account status
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2 px-1">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    emailVerified === true
                      ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                      : emailVerified === false
                        ? "bg-amber-300"
                        : "bg-gray-500"
                  }`}
                />

                <p
                  className={`text-sm font-medium leading-7 ${
                    emailVerified === true
                      ? "text-emerald-300"
                      : emailVerified === false
                        ? "text-amber-200"
                        : "text-gray-400"
                  }`}
                >
                  {emailVerified === true
                    ? "Verified"
                    : emailVerified === false
                      ? "Awaiting verification"
                      : "Status unavailable"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security settings */}
        <section className={`${glassCard} mt-6 p-5 sm:p-7`}>
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className={`min-w-0 flex-1 px-1 ${textSafe}`}>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-500/[0.10] text-xl">
                  🔐
                </div>

                <h2 className="text-lg font-bold leading-7 tracking-tight sm:text-xl">
                  Password and security
                </h2>
              </div>

              <p className="mt-3 text-sm leading-7 text-gray-400">
                Change your password to help keep your account secure.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowPasswordForm((current) => !current);
                setMessage("");
                setMessageType("");
              }}
              className={secondaryButton}
            >
              {showPasswordForm ? "Cancel" : "Change password"}
            </button>
          </div>

          {message && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-6 rounded-xl border px-4 py-3 ${
                messageType === "error"
                  ? "border-red-500/30 bg-red-500/10 text-red-300"
                  : messageType === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-violet-500/30 bg-violet-500/10 text-violet-200"
              }`}
            >
              <p className={`px-1 text-sm leading-7 ${textSafe}`}>
                {message}
              </p>
            </div>
          )}

          {showPasswordForm && (
            <form
              onSubmit={handlePasswordSubmit}
              className="mt-7 space-y-5 border-t border-white/[0.08] px-1 pt-6"
            >
              {/* Current password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block px-1 text-sm font-medium leading-6 text-gray-300"
                >
                  Current password
                </label>

                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                    className={passwordInputClass}
                    placeholder="Enter current password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword((previous) => !previous)
                    }
                    aria-label={
                      showCurrentPassword
                        ? "Hide current password"
                        : "Show current password"
                    }
                    aria-pressed={showCurrentPassword}
                    className={visibilityButtonClass}
                  >
                    <PasswordVisibilityIcon visible={showCurrentPassword} />
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block px-1 text-sm font-medium leading-6 text-gray-300"
                >
                  New password
                </label>

                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className={passwordInputClass}
                    placeholder="At least 8 characters"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword((previous) => !previous)}
                    aria-label={
                      showNewPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                    aria-pressed={showNewPassword}
                    className={visibilityButtonClass}
                  >
                    <PasswordVisibilityIcon visible={showNewPassword} />
                  </button>
                </div>
              </div>

              {/* Confirm new password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block px-1 text-sm font-medium leading-6 text-gray-300"
                >
                  Confirm new password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    className={passwordInputClass}
                    placeholder="Re-enter new password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirmation password"
                        : "Show confirmation password"
                    }
                    aria-pressed={showConfirmPassword}
                    className={visibilityButtonClass}
                  >
                    <PasswordVisibilityIcon visible={showConfirmPassword} />
                  </button>
                </div>
              </div>

              <button type="submit" className={primaryButton}>
                Change password
                <span aria-hidden="true">→</span>
              </button>

              <p className="max-w-2xl px-1 text-xs leading-6 text-gray-500">
                Your password will be changed through the authenticated
                backend. If your access token expires, your authentication
                helper may attempt to refresh it automatically.
              </p>
            </form>
          )}
        </section>

        {/* Quick links */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            to="/forgot-password"
            className={`${glassCard} group block p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/25`}
          >
            <div className="px-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-500/[0.10] text-lg">
                ↻
              </div>

              <h3 className="mt-4 text-base font-semibold leading-7 text-gray-100">
                Forgot your password?
              </h3>

              <p className="mt-2 text-sm leading-7 text-gray-400">
                Request a password-reset link to recover access to your
                account.
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium leading-6 text-violet-300 transition-colors group-hover:text-violet-200">
                Recover account
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>

          <Link
            to="/login"
            className={`${glassCard} group block p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/25`}
          >
            <div className="px-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-300/15 bg-indigo-500/[0.10] text-lg">
                ↗
              </div>

              <h3 className="mt-4 text-base font-semibold leading-7 text-gray-100">
                Sign in
              </h3>

              <p className="mt-2 text-sm leading-7 text-gray-400">
                Continue to your account using your registered credentials.
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium leading-6 text-violet-300 transition-colors group-hover:text-violet-200">
                Open sign in
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-8 border-t border-white/[0.08] px-1 py-6 text-center">
          <p className="text-xs leading-6 text-gray-500">
            <span className="font-semibold text-gray-300">BackendHub</span>
            <span className="mx-2 text-gray-700">·</span>
            Account settings
          </p>
        </footer>
      </div>
    </main>
  );
}

export default Profile;
