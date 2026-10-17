
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("The verification link is missing its token.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          "https://backend-course-api-fzwg.onrender.com/auth/verify-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(
            data.message || "Email verification failed. The link may have expired."
          );
        }

        setStatus("success");
        setMessage(data.message || "Your email has been verified successfully.");
      } catch (error) {
        setStatus("error");
        setMessage(error.message || "Unable to verify your email. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams]);

  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <main className="min-h-screen bg-[#050507] text-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute w-80 h-80 bg-violet-600/20 blur-[120px] rounded-full -top-20 -left-20" />
      <div className="absolute w-80 h-80 bg-indigo-600/20 blur-[120px] rounded-full -bottom-20 -right-20" />

      <section className="relative w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-7 sm:p-9 shadow-2xl text-center">
          <div
            className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 ${
              isSuccess
                ? "bg-emerald-500/15 text-emerald-400"
                : isError
                  ? "bg-red-500/15 text-red-400"
                  : "bg-violet-500/15 text-violet-400"
            }`}
          >
            {isSuccess ? "✓" : isError ? "!" : "…"}
          </div>

          <p className="text-sm text-violet-400 font-medium mb-2">
            EMAIL VERIFICATION
          </p>

          <h1 className="text-3xl font-bold mb-4">
            {isSuccess
              ? "Email verified!"
              : isError
                ? "Verification failed"
                : "Verifying your email"}
          </h1>

          <p
            role="status"
            aria-live="polite"
            className="text-gray-400 text-sm leading-6 mb-8"
          >
            {message}
          </p>

          {status === "verifying" && (
            <div className="mx-auto mb-7 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
            </div>
          )}

          {isSuccess ? (
            <Link
              to="/login"
              className="block w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 font-semibold transition hover:brightness-110"
            >
              Continue to Sign In
            </Link>
          ) : isError ? (
            <Link
              to="/login"
              className="block w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 font-semibold transition hover:brightness-110"
            >
              Go to Sign In
            </Link>
          ) : null}

          <Link
            to="/"
            className="inline-block text-sm text-gray-400 hover:text-white mt-6 transition"
          >
            Back to Home
          </Link>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          BackendHub · Account security
        </p>
      </section>
    </main>
  );
}

export default VerifyEmail;
