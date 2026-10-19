import { useState } from "react";
import { Link } from "react-router-dom";

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
      setShowPasswordForm(false);
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
      setMessageType("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#050507] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/dashboard"
              className="mb-3 inline-flex text-sm text-gray-400 transition hover:text-white"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="mt-2 text-sm text-gray-400">
              Manage your profile and account security.
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold">
            BH
          </div>
        </header>

        {/* Profile overview */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 bg-gradient-to-r from-indigo-950/70 to-violet-950/40 p-6 sm:p-8">
            <p className="text-sm font-medium text-violet-300">
              PERSONAL ACCOUNT
            </p>
            <h2 className="mt-2 text-xl font-semibold">Your profile</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
              Your real account details will appear here after we connect this
              page to your authenticated profile endpoint.
            </p>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-500">Username</p>
              <p className="mt-2 break-all font-medium text-gray-300">
                {user?.username || "Not available"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-500">Email address</p>
              <p className="mt-2 font-medium text-gray-300">
                {user?.email || "Not available"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-500">Account role</p>
              <p className="mt-2 font-medium text-gray-300">
                {user?.role || "Not avalable"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-gray-500">Account status</p>
              <p className="mt-2 font-medium text-emerald-300">
                {(() => {
                  try {
                    const savedUser = JSON.parse(localStorage.getItem("user"));
                    if (savedUser?.emailVerified === true) return "Verified";
                    if (savedUser?.emailVerified === false)
                      return "Awaiting verification";
                    return "Status unavailable";
                  } catch {
                    return "Status unavailable";
                  }
                })()}
              </p>
            </div>
          </div>
        </section>

        {/* Security settings */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-xl">
                  🔐
                </div>
                <h2 className="text-xl font-semibold">Password and security</h2>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Change your password to help keep your account secure.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowPasswordForm((current) => !current);
                setMessage("");
              }}
              className="rounded-xl border border-violet-500/30 px-4 py-2.5 text-sm font-medium text-violet-300 transition hover:bg-violet-500/10"
            >
              {showPasswordForm ? "Cancel" : "Change password"}
            </button>
          </div>

          {showPasswordForm && (
            <form
              onSubmit={handlePasswordSubmit}
              className="mt-7 space-y-5 border-t border-white/10 pt-6"
            >
              {message && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-xl border p-3 text-sm ${
                    messageType === "error"
                      ? "border-red-500/30 bg-red-500/10 text-red-300"
                      : messageType === "success"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                  }`}
                >
                  {message}
                </div>
              )}

              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Current password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm text-gray-300"
                >
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  placeholder="Re-enter new password"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 font-semibold transition hover:brightness-110 sm:w-auto sm:px-8"
              >
                Change password
              </button>

              <p className="text-xs leading-5 text-gray-500">
                Your password will be changed securely through the authenticated
                backend. If your access token expires, the app will attempt to
                refresh it automatically.
              </p>
            </form>
          )}
        </section>

        {/* Quick links */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            to="/forgot-password"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-500/40"
          >
            <p className="font-semibold">Forgot your password?</p>
            <p className="mt-2 text-sm text-gray-400">
              Request a password-reset link.
            </p>
            <span className="mt-4 inline-block text-sm text-violet-400">
              Recover account →
            </span>
          </Link>

          <Link
            to="/login"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-500/40"
          >
            <p className="font-semibold">Sign in</p>
            <p className="mt-2 text-sm text-gray-400">
              Continue to your account.
            </p>
            <span className="mt-4 inline-block text-sm text-violet-400">
              Open sign in →
            </span>
          </Link>
        </section>

        <footer className="py-8 text-center text-xs text-gray-600">
          BackendHub · Account settings
        </footer>
      </div>
    </main>
  );
}

export default Profile;
