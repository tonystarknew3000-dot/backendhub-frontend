
import { Link } from "react-router-dom";

function AdminDashboard() {
  const sections = [
    {
      icon: "👥",
      title: "User Management",
      description:
        "View and manage user accounts through authorized backend endpoints.",
      status: "Integration pending",
    },
    {
      icon: "🛡️",
      title: "Roles and Permissions",
      description:
        "Review access policies and protect administrative operations.",
      status: "Integration pending",
    },
    {
      icon: "📊",
      title: "System Overview",
      description:
        "Connect backend statistics and health information when available.",
      status: "Integration pending",
    },
  ];

  const glassCard =
    "rounded-2xl border border-white/[0.09] bg-white/[0.035] shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:border-violet-400/25 hover:bg-white/[0.05]";

  const primaryButton =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold leading-5 text-white shadow-lg shadow-violet-950/30 ring-1 ring-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/20 active:translate-y-0";

  const secondaryButton =
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium leading-5 text-gray-300 backdrop-blur-lg transition-all duration-200 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white";

  const textSafe = "min-w-0 break-words [overflow-wrap:anywhere]";

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

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-5 border-b border-white/[0.08] pb-7">
          <div className={`min-w-0 flex-1 ${textSafe}`}>
            <Link to="/dashboard" className={`${secondaryButton} mb-5`}>
              <span aria-hidden="true">←</span>
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600 text-lg font-bold shadow-lg shadow-violet-700/25 ring-1 ring-white/15">
                B
              </div>

              <div className={`min-w-0 ${textSafe}`}>
                <p className="px-0.5 text-xs font-semibold uppercase leading-5 tracking-[0.2em] text-violet-300">
                  BackendHub
                </p>
                <p className="mt-1 px-0.5 text-xs leading-5 text-gray-500">
                  Administration workspace
                </p>
              </div>
            </div>

            <h1 className="mt-7 px-1 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Admin{" "}
              <span className="bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>

            <p className={`mt-3 max-w-xl px-1 text-sm leading-7 text-gray-400 sm:text-base ${textSafe}`}>
              Administrative tools and system management in one
              workspace.
            </p>
          </div>

          {/* Access notice */}
          <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-amber-400/15 bg-amber-400/[0.05] p-4 shadow-inner shadow-white/[0.02] backdrop-blur-xl sm:max-w-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/15 bg-amber-400/[0.08] text-lg text-amber-200">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3l8 4v5c0 4.5-3.1 7.5-8 9-4.9-1.5-8-4.5-8-9V7l8-4z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4"
                />
              </svg>
            </span>

            <div className={`min-w-0 px-1 ${textSafe}`}>
              <p className="text-xs font-bold uppercase leading-5 tracking-[0.16em] text-amber-300">
                Access control
              </p>
              <p className="mt-1 text-sm font-medium leading-6 text-amber-100">
                Backend authorization required
              </p>
              <p className="mt-1 text-xs leading-6 text-gray-400">
                Administrative actions must be verified by the server.
              </p>
            </div>
          </div>
        </header>

        {/* Welcome banner */}
        <section className="relative isolate mt-8 overflow-hidden rounded-3xl border border-violet-300/[0.18] bg-gradient-to-br from-[#201443]/90 via-[#17102e]/85 to-[#101020]/95 p-6 shadow-[0_20px_80px_rgba(76,29,149,0.13)] backdrop-blur-2xl sm:p-9 lg:p-10">
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
            className="pointer-events-none absolute -bottom-28 left-[35%] h-56 w-56 rounded-full bg-indigo-500/[0.13] blur-[80px]"
          />

          <div className={`relative max-w-3xl px-1 ${textSafe}`}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/[0.10] text-2xl shadow-inner shadow-white/[0.04]">
              🛡️
            </div>

            <div className="mt-5 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/[0.07] px-3 py-2 text-[10px] font-bold uppercase leading-5 tracking-[0.16em] text-violet-200 sm:text-xs sm:tracking-[0.2em]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.8)]" />
              Authorized workspace
            </div>

            <h2 className="mt-4 px-0.5 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              Administrative workspace
            </h2>

            <p className={`mt-3 max-w-2xl px-0.5 text-sm leading-7 text-gray-300/90 sm:text-base ${textSafe}`}>
              This interface is prepared for your administrative features.
              Real user data and management actions will be connected to
              your backend after authentication and authorization are
              implemented.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/dashboard" className={primaryButton}>
                Return to Dashboard
                <span aria-hidden="true">→</span>
              </Link>

              <Link to="/profile" className={secondaryButton}>
                View my profile
              </Link>
            </div>
          </div>
        </section>

        {/* Management tools */}
        <section className="mt-10">
          <div className="mb-5 px-1">
            <p className="text-xs font-semibold uppercase leading-5 tracking-[0.18em] text-violet-300">
              Administration
            </p>

            <h2 className="mt-2 text-xl font-bold leading-tight tracking-tight sm:text-2xl">
              Management tools
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-400">
              These sections are interface placeholders until connected
              to authorized backend endpoints.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section, index) => (
              <article
                key={section.title}
                className={`${glassCard} group relative isolate overflow-hidden p-5 sm:p-6`}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 -top-12 -z-10 h-36 w-36 rounded-full bg-violet-500/[0.09] opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
                />

                <div className={`relative min-w-0 px-1 ${textSafe}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-300/15 bg-gradient-to-br from-violet-400/[0.13] to-indigo-400/[0.06] text-2xl shadow-inner shadow-white/[0.03]">
                      {section.icon}
                    </div>

                    <span className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[10px] font-medium leading-5 tracking-wide text-gray-500">
                      {`0${index + 1}`}
                    </span>
                  </div>

                  <h3 className="mt-5 px-0.5 text-lg font-semibold leading-7 tracking-tight">
                    {section.title}
                  </h3>

                  <p className={`mt-3 min-h-16 px-0.5 text-sm leading-7 text-gray-400 ${textSafe}`}>
                    {section.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/[0.08] pt-4">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.25)]" />
                    <span className="text-xs font-medium leading-6 text-amber-200/90">
                      {section.status}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Security reminder */}
        <section className="relative mt-8 overflow-hidden rounded-2xl border border-violet-300/[0.12] bg-white/[0.025] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-xl sm:p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-violet-500/[0.08] blur-3xl"
          />

          <div className="relative flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.08] text-violet-200">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.3 3.9L2.8 17a2 2 0 001.7 3h15a2 2 0 001.7-3l-7.5-13.1a2 2 0 00-3.4 0z"
                />
              </svg>
            </div>

            <div className={`min-w-0 px-1 ${textSafe}`}>
              <h2 className="font-semibold leading-6 tracking-tight">
                Security reminder
              </h2>

              <p className="mt-2 text-sm leading-7 text-gray-400">
                Hiding this page in the frontend is not sufficient to
                secure administrator features. Every administrative API
                request must be authorized by the backend using the
                authenticated user's role and permissions.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] px-1 py-6 text-xs text-gray-500">
          <p className="leading-6">
            <span className="font-semibold text-gray-300">BackendHub</span>
            <span className="mx-2 text-gray-600">·</span>
            Administrative workspace
          </p>

          <Link
            to="/dashboard"
            className="px-1 py-1 leading-6 transition-colors hover:text-violet-300"
          >
            Back to Dashboard ↑
          </Link>
        </footer>
      </div>
    </main>
  );
}

export default AdminDashboard;
