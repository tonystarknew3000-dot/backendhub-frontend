import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../utils/authFetch";

const API_URL = "https://backend-course-api-fzwg.onrender.com";

function Dashboard() {
  const [sessionMessage, setSessionMessage] = useState("");
  const [checkingSession, setCheckingSession] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking");

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  async function checkSession() {
    console.log("TEST SESSION: Button clicked");

    setCheckingSession(true);
    setSessionMessage("Connecting to the server...");

    try {
      const response = await authFetch("/auth/verify");
      console.log("TEST SESSION: Response status:", response.status);

      const result = await response.json();
      console.log("TEST SESSION: Response data:", result);

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Session verification failed");
      }

      setSessionMessage("Session verified successfully.");
    } catch (error) {
      console.error("TEST SESSION ERROR:", error);
      setSessionMessage(error.message || "Unable to verify session.");
    } finally {
      setCheckingSession(false);
    }
  }

  async function handleLogout() {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      if (refreshToken) {
        const response = await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(localStorage.getItem("accessToken")
              ? {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                }
              : {}),
          },
          body: JSON.stringify({ refreshToken }),
        });

        const result = await response.json();

        console.log("LOGOUT: Response status:", response.status);
        console.log("LOGOUT: Response data:", result);
      }
    } catch (error) {
      console.error("LOGOUT: Backend request failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      setUser(null);
      window.location.href = "/login";
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    async function checkApi() {
      try {
        const response = await fetch(`${API_URL}/health`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("API health check failed");
        }

        setApiStatus("online");
      } catch (error) {
        if (error.name !== "AbortError") {
          setApiStatus("offline");
        }
      }
    }

    checkApi();

    return () => controller.abort();
  }, []);

  const statusText = {
    checking: "Checking connection...",
    online: "API is reachable",
    offline: "API is unavailable",
  };

  const statusColor = {
    checking: "text-amber-300",
    online: "text-emerald-300",
    offline: "text-red-300",
  };

  const statusDot = {
    checking: "bg-amber-400 animate-pulse",
    online: "bg-emerald-400",
    offline: "bg-red-400",
  };

  const features = [
    {
      icon: "♙",
      title: "My Profile",
      description: "View your account and personal information.",
      link: "/profile",
      action: "View profile",
    },
    {
      icon: "⌘",
      title: "Security",
      description: "Manage your password and account security.",
      link: "/profile",
      action: "Manage security",
    },
    {
      icon: "◇",
      title: "Administration",
      description:
        "Access administrative tools if your account is authorized.",
      link: "/admin",
      action: "Open admin",
    },
  ];

  const glassCard =
    "rounded-2xl border border-white/[0.09] bg-white/[0.035] shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:border-violet-400/25 hover:bg-white/[0.05]";

  const primaryButton =
    "inline-flex min-w-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 ring-1 ring-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/20 active:translate-y-0 active:scale-[0.98]";

  const secondaryButton =
    "inline-flex min-w-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-gray-200 backdrop-blur-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white active:translate-y-0";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070611] text-white selection:bg-violet-500/30">
      {/* Ambient background lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-violet-700/[0.12] blur-[120px]" />
        <div className="absolute right-[-10rem] top-[15%] h-[30rem] w-[30rem] rounded-full bg-indigo-600/[0.10] blur-[130px]" />
        <div className="absolute bottom-[-12rem] left-[35%] h-[28rem] w-[28rem] rounded-full bg-fuchsia-700/[0.07] blur-[120px]" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-white/[0.08] bg-[#0b0918]/70 p-6 backdrop-blur-2xl md:flex md:flex-col">
          <Link
            to="/"
            aria-label="BackendHub home"
            className="mb-10 flex items-center gap-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600 text-lg font-bold shadow-lg shadow-violet-700/25 ring-1 ring-white/15">
              B
            </div>

            <div className="min-w-0 px-1">
              <p className="py-0.5 font-bold tracking-wide">BackendHub</p>
              <p className="mt-0.5 text-xs leading-5 text-gray-500">
                Developer platform
              </p>
            </div>
          </Link>

          <p className="mb-4 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500">
            Workspace
          </p>

          <nav className="space-y-2">
            <Link
              to="/dashboard"
              aria-current="page"
              className="flex items-center gap-3 rounded-xl border border-violet-400/20 bg-gradient-to-r from-violet-500/[0.16] to-indigo-500/[0.06] px-4 py-3 text-sm font-medium text-violet-200 shadow-inner shadow-violet-400/[0.03]"
            >
              <span className="shrink-0 px-0.5 text-lg">▦</span>
              <span className="min-w-0 py-0.5">Dashboard</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm text-gray-400 transition-all duration-200 hover:border-white/[0.06] hover:bg-white/[0.04] hover:text-white"
            >
              <span className="shrink-0 px-0.5 text-lg">♙</span>
              <span className="min-w-0 py-0.5">My Profile</span>
            </Link>

            <Link
              to="/forgot-password"
              className="flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm text-gray-400 transition-all duration-200 hover:border-white/[0.06] hover:bg-white/[0.04] hover:text-white"
            >
              <span className="shrink-0 px-0.5 text-lg">♧</span>
              <span className="min-w-0 py-0.5">Account Security</span>
            </Link>
          </nav>

          <div className="mt-auto rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[0.09] to-indigo-500/[0.03] p-4 shadow-inner shadow-white/[0.02] backdrop-blur-xl">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/10 text-violet-300">
              ?
            </div>

            <p className="px-0.5 py-0.5 text-sm font-semibold">Need help?</p>
            <p className="mt-1 px-0.5 text-xs leading-5 text-gray-400">
              Explore your API features and account tools.
            </p>

            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-2 px-0.5 py-1 text-sm font-medium text-violet-300 transition hover:text-violet-200"
            >
              Back to home <span aria-hidden="true">→</span>
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] bg-[#080714]/75 px-5 py-4 backdrop-blur-2xl sm:px-8">
            <div className="min-w-0">
              <p className="px-1 text-xs font-medium leading-5 text-gray-500 sm:text-sm">
                Workspace <span className="mx-1 text-violet-500">/</span>
                Overview
              </p>
              <h1 className="-mx-1 mt-1 px-1 py-1 text-xl font-bold leading-tight tracking-tight sm:text-2xl">
                Dashboard
              </h1>
            </div>

            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <div className="flex min-w-0 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 backdrop-blur-lg">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${statusDot[apiStatus]}`}
                />
                <span
                  className={`min-w-0 break-words py-0.5 text-xs font-medium sm:text-sm ${statusColor[apiStatus]}`}
                >
                  {statusText[apiStatus]}
                </span>
              </div>

              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`${secondaryButton} px-3 py-2`}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4 shrink-0"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 17l5-5-5-5m5 5H3m9-9h5a2 2 0 012 2v14a2 2 0 01-2 2h-5"
                    />
                  </svg>
                  <span className="px-0.5">Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className={`${secondaryButton} px-3 py-2`}
                >
                  <span className="px-0.5">Sign in</span>
                </Link>
              )}
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8 lg:p-10">
            {/* Welcome banner */}
            <section className="relative isolate overflow-hidden rounded-3xl border border-violet-300/[0.18] bg-gradient-to-br from-[#201443]/90 via-[#17102e]/85 to-[#101020]/95 p-6 shadow-[0_20px_80px_rgba(76,29,149,0.13)] backdrop-blur-2xl sm:p-9 lg:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-400/[0.07] via-transparent to-indigo-400/[0.07]"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-[90px]"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 left-[40%] h-56 w-56 rounded-full bg-indigo-500/[0.13] blur-[80px]"
              />

              <div className="relative min-w-0 max-w-3xl">
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/[0.07] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200 sm:text-xs sm:tracking-[0.2em]">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.8)]" />
                  <span className="px-0.5 py-0.5">BackendHub workspace</span>
                </div>

                <h2 className="-mx-1 mt-5 px-1 py-1 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  <span className="block py-0.5">Your backend,</span>
                  <span className="mt-1 block py-0.5 bg-gradient-to-r from-violet-200 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                    at a glance.
                  </span>
                </h2>

                <p className="mt-4 max-w-xl px-1 text-sm leading-7 text-gray-300/90 sm:text-base">
                  Access your account tools and check the connection to your
                  deployed API from one place.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link to="/profile" className={primaryButton}>
                    <span className="px-0.5">View my profile</span>
                    <span aria-hidden="true" className="shrink-0">→</span>
                  </Link>

                  <Link to="/" className={secondaryButton}>
                    <span className="px-0.5">Explore home page</span>
                  </Link>

                  <button
                    type="button"
                    onClick={checkSession}
                    disabled={checkingSession}
                    className={`${secondaryButton} border-violet-400/25 bg-violet-500/[0.07] disabled:cursor-wait disabled:opacity-60`}
                  >
                    {checkingSession ? (
                      <>
                        <svg
                          className="h-4 w-4 shrink-0 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
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
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        <span className="px-0.5">Checking session...</span>
                      </>
                    ) : (
                      <>
                        {sessionMessage === "Session verified successfully." && (
                          <span aria-hidden="true" className="shrink-0 text-emerald-300">
                            ✓
                          </span>
                        )}
                        <span className="px-0.5">Test session</span>
                      </>
                    )}
                  </button>
                </div>

                {sessionMessage && (
                  <p
                    role="status"
                    aria-live="polite"
                    className={`mt-4 inline-flex max-w-full min-w-0 items-start gap-2 rounded-xl border px-4 py-3 text-sm leading-6 ${
                      sessionMessage === "Session verified successfully."
                        ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200"
                        : sessionMessage === "Connecting to the server..."
                          ? "border-violet-400/20 bg-violet-400/[0.06] text-violet-200"
                          : "border-red-400/20 bg-red-400/[0.06] text-red-200"
                    }`}
                  >
                    <span aria-hidden="true" className="shrink-0 px-0.5">
                      {sessionMessage === "Session verified successfully."
                        ? "✓"
                        : sessionMessage === "Connecting to the server..."
                          ? "◌"
                          : "!"}
                    </span>
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                      {sessionMessage}
                    </span>
                  </p>
                )}
              </div>
            </section>

            {/* System overview */}
            <section>
              <div className="mb-5">
                <p className="px-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300/80">
                  At a glance
                </p>
                <h2 className="-mx-1 mt-2 px-1 py-1 text-xl font-bold leading-tight tracking-tight">
                  System overview
                </h2>
                <p className="mt-1 px-1 text-sm leading-6 text-gray-400">
                  Current connection status and available tools.
                </p>
              </div>

              <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {/* API card */}
                <article className={`${glassCard} relative min-w-0 overflow-hidden p-5 sm:p-6`}>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-violet-500/[0.12] blur-3xl"
                  />

                  <div className="relative flex items-center justify-between gap-3">
                    <p className="min-w-0 px-1 py-1 text-sm font-medium text-gray-300">
                      Backend API
                    </p>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.08] text-lg text-violet-200">
                      ⌘
                    </span>
                  </div>

                  <p className="relative mt-5 px-1 py-1 text-2xl font-bold leading-tight tracking-tight">
                    {apiStatus === "online"
                      ? "Connected"
                      : apiStatus === "offline"
                        ? "Unavailable"
                        : "Checking"}
                  </p>

                  <div className="relative mt-3 flex items-start gap-2 px-1">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${statusDot[apiStatus]}`} />
                    <p className="min-w-0 py-0.5 text-xs leading-5 text-gray-400">
                      Health endpoint response
                    </p>
                  </div>
                </article>

                {/* User card */}
                <article className={`${glassCard} relative min-w-0 overflow-hidden p-5 sm:p-6`}>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-indigo-500/[0.12] blur-3xl"
                  />

                  <div className="relative flex items-center justify-between gap-3">
                    <p className="min-w-0 px-1 py-1 text-sm font-medium text-gray-300">
                      Account
                    </p>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-300/15 bg-indigo-400/[0.08] text-lg text-indigo-200">
                      ♙
                    </span>
                  </div>

                  <p className="relative mt-5 break-words px-1 py-1 text-xl font-bold leading-tight tracking-tight">
                    {user?.username || "User"}
                  </p>

                  <p className="relative mt-2 break-all px-1 py-1 text-sm leading-6 text-gray-400">
                    {user?.email || "Email not available"}
                  </p>

                  <div className="relative mt-4 inline-flex max-w-full items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2">
                    <span className="shrink-0 text-xs text-gray-500">Role</span>
                    <span className="min-w-0 break-words px-0.5 text-xs font-medium text-violet-200">
                      {user?.role || "Not available"}
                    </span>
                  </div>
                </article>

                {/* Security card */}
                <article className={`${glassCard} relative min-w-0 overflow-hidden p-5 sm:col-span-2 sm:p-6 xl:col-span-1`}>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-fuchsia-500/[0.10] blur-3xl"
                  />

                  <div className="relative flex items-center justify-between gap-3">
                    <p className="min-w-0 px-1 py-1 text-sm font-medium text-gray-300">
                      Security
                    </p>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-fuchsia-300/15 bg-fuchsia-400/[0.07] text-lg text-fuchsia-200">
                      ◇
                    </span>
                  </div>

                  <p className="relative mt-5 px-1 py-1 text-2xl font-bold leading-tight tracking-tight">
                    Setup pending
                  </p>

                  <p className="relative mt-3 px-1 py-1 text-xs leading-6 text-gray-400">
                    Protected routes and session management come next.
                  </p>
                </article>
              </div>
            </section>

            {/* Quick actions */}
            <section>
              <div className="mb-5">
                <p className="px-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300/80">
                  Your workspace
                </p>
                <h2 className="-mx-1 mt-2 px-1 py-1 text-xl font-bold leading-tight tracking-tight">
                  Quick access
                </h2>
                <p className="mt-1 px-1 text-sm leading-6 text-gray-400">
                  Shortcuts to your account pages and tools.
                </p>
              </div>

              <div className="grid min-w-0 gap-4 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <article
                    key={feature.title}
                    className={`${glassCard} group relative min-w-0 overflow-hidden p-5 sm:p-6`}
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-violet-500/[0.08] opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
                    />

                    <div className="relative flex items-start justify-between gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-300/15 bg-gradient-to-br from-violet-400/[0.13] to-indigo-400/[0.06] text-xl text-violet-200 shadow-inner shadow-white/[0.03]">
                        {feature.icon}
                      </span>

                      <span className="shrink-0 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[10px] font-medium tracking-wide text-gray-500">
                        {`0${index + 1}`}
                      </span>
                    </div>

                    <h3 className="relative -mx-1 mt-5 break-words px-1 py-1 text-base font-semibold leading-snug tracking-tight">
                      {feature.title}
                    </h3>

                    <p className="relative mt-2 min-h-12 px-1 py-1 text-sm leading-6 text-gray-400">
                      {feature.description}
                    </p>

                    <Link
                      to={feature.link}
                      className="relative mt-5 inline-flex max-w-full items-center gap-2 px-1 py-1 text-sm font-semibold text-violet-300 transition-all duration-200 hover:gap-3 hover:text-violet-200"
                    >
                      <span className="break-words">{feature.action}</span>
                      <span aria-hidden="true" className="shrink-0">→</span>
                    </Link>
                  </article>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-6 pb-2 text-xs leading-6 text-gray-500">
              <p className="px-1">
                <span className="font-semibold text-gray-300">BackendHub</span>
                <span className="mx-1 text-gray-700">·</span>
                Developer workspace
              </p>

              <Link
                to="/"
                className="px-1 py-1 transition-colors hover:text-violet-300"
              >
                Back to home ↑
              </Link>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;