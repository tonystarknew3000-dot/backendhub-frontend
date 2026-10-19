
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Verifying your email address..."
  );

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
            data.message ||
              "Email verification failed. The link may have expired."
          );
        }

        setStatus("success");
        setMessage(
          data.message ||
            "Your email has been verified successfully."
        );
      } catch (error) {
        setStatus("error");
        setMessage(
          error.message ||
            "Unable to verify your email. Please try again."
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

  const isSuccess = status === "success";
  const isError = status === "error";
  const isVerifying = status === "verifying";

  const buttonClass =
    "flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold leading-6 text-white shadow-lg shadow-violet-950/30 ring-1 ring-white/10 transition duration-200 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507]";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-[#050507] px-4 py-10 text-white selection:bg-violet-500/30 sm:px-6 sm:py-12">
      {/* Ambient violet lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-700/[0.14] blur-[120px]" />
        <div className="absolute -right-40 top-[25%] h-96 w-96 rounded-full bg-indigo-600/[0.12] blur-[130px]" />
        <div className="absolute -bottom-48 left-[20%] h-96 w-96 rounded-full bg-fuchsia-700/[0.08] blur-[130px]" />
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

        {/* Verification card */}
        <div className="rounded-3xl border border-white/[0.10] bg-white/[0.045] p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">
          <div className="px-1">
            {/* Status icon */}
            <div
              className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border text-3xl font-semibold shadow-inner shadow-white/[0.03] ${
                isSuccess
                  ? "border-emerald-400/20 bg-emerald-400/[0.10] text-emerald-300"
                  : isError
                    ? "border-red-400/20 bg-red-400/[0.10] text-red-300"
                    : "border-violet-400/20 bg-violet-500/[0.10] text-violet-300"
              }`}
              aria-hidden="true"
            >
              {isSuccess ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-8 w-8"
                >
                  <path
                    d="m5 12 4 4L19 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : isError ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-8 w-8"
                >
                  <path
                    d="M12 8v5m0 4h.01"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-8 w-8 animate-pulse"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path
                    d="M12 7v5l3 2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            <p className="text-xs font-semibold uppercase leading-5 tracking-[0.2em] text-violet-300">
              Account security
            </p>

            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {isSuccess ? (
                <>
                  Email{" "}
                  <span className="bg-gradient-to-r from-emerald-200 to-emerald-400 bg-clip-text text-transparent">
                    verified!
                  </span>
                </>
              ) : isError ? (
                <>
                  Verification{" "}
                  <span className="bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent">
                    failed
                  </span>
                </>
              ) : (
                <>
                  Verifying your{" "}
                  <span className="bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
                    email
                  </span>
                </>
              )}
            </h1>

            <p
              role="status"
              aria-live="polite"
              className={`mx-1 mt-4 break-words text-sm leading-7 [overflow-wrap:anywhere] ${
                isSuccess
                  ? "text-emerald-200/80"
                  : isError
                    ? "text-red-200/90"
                    : "text-gray-400"
              }`}
            >
              {message}
            </p>
          </div>

          {/* Verification progress */}
          {isVerifying && (
            <div
              className="mx-auto mb-7 mt-7 h-1.5 w-full max-w-40 overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-label="Email verification in progress"
            >
              <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-violet-500 to-indigo-400" />
            </div>
          )}

          {/* Actions */}
          {isSuccess && (
            <div className="mt-8">
              <Link to="/login" className={buttonClass}>
                Continue to Sign In
                <span aria-hidden="true">→</span>
              </Link>

              <p className="mt-4 px-1 text-xs leading-6 text-gray-500">
                Your email is verified. You can now sign in to your
                BackendHub account.
              </p>
            </div>
          )}

          {isError && (
            <div className="mt-8">
              <Link to="/login" className={buttonClass}>
                Go to Sign In
                <span aria-hidden="true">→</span>
              </Link>

              <p className="mt-4 px-1 text-xs leading-6 text-gray-500">
                If your link has expired or is invalid, you may need
                to request a fresh verification email.
              </p>
            </div>
          )}

          {isVerifying && (
            <p className="mt-6 px-1 text-xs leading-6 text-gray-500">
              Please keep this page open while we verify your email.
            </p>
          )}

          {/* Home navigation */}
          <div className="mt-8 border-t border-white/[0.08] px-1 pt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 py-1 text-sm font-medium leading-6 text-gray-400 transition hover:text-violet-300"
            >
              <span aria-hidden="true">←</span>
              Back to BackendHub
            </Link>
          </div>
        </div>

        {/* Page footer */}
        <p className="mt-6 px-2 text-center text-xs leading-6 text-gray-500">
          Secure email verification
          <span className="mt-1 block text-gray-600">
            © {new Date().getFullYear()} BackendHub
          </span>
        </p>
      </section>
    </main>
  );
}

export default VerifyEmail;
