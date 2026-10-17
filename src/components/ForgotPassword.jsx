
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
    <main className="min-h-screen bg-[#050507] text-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute w-80 h-80 bg-violet-600/20 blur-[120px] rounded-full -top-20 -left-20" />
      <div className="absolute w-80 h-80 bg-indigo-600/20 blur-[120px] rounded-full -bottom-20 -right-20" />

      <section className="relative w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition"
        >
          ← Back to Home
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-7 sm:p-9 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl font-bold mb-6">
            B
          </div>

          <p className="text-sm text-violet-400 font-medium mb-2">
            ACCOUNT RECOVERY
          </p>

          <h1 className="text-3xl font-bold mb-3">
            Forgot password?
          </h1>

          <p className="text-gray-400 text-sm leading-6 mb-7">
            Enter the email address associated with your account.
            If the account exists, we'll send instructions to reset
            your password.
          </p>

          {message && (
            <div
              role="status"
              aria-live="polite"
              className={`mb-5 rounded-lg border p-3 text-sm ${
                messageType === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-300 mb-2"
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
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Sending request..." : "Send Reset Link"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-7">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-violet-400 hover:text-violet-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          BackendHub · Secure account recovery
        </p>
      </section>
    </main>
  );
}

export default ForgotPassword;
