import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507] px-4 py-12 text-white">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 -top-10 h-96 w-96 rounded-full bg-indigo-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[140px]" />

      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <section className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-8 text-center shadow-[0_0_80px_rgba(109,40,217,0.12)] backdrop-blur-2xl sm:p-12">
        {/* Top accent */}
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/70 to-transparent" />

        {/* BackendHub logo */}
        <Link
          to="/"
          aria-label="BackendHub home"
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-indigo-500 via-violet-600 to-fuchsia-600 text-3xl font-extrabold shadow-lg shadow-violet-950/40 transition duration-300 hover:scale-105"
        >
          B
        </Link>

        {/* Error indicator */}
        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.08] px-4 py-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
          <span className="text-xs font-semibold tracking-[0.2em] text-violet-300">
            ERROR 404
          </span>
        </div>

        {/* Main message */}
        <h1 className="mt-6 text-5xl font-extrabold tracking-tight sm:text-7xl">
          <span className="bg-gradient-to-r from-white via-violet-100 to-violet-400 bg-clip-text text-transparent">
            Lost in
          </span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            the void?
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-gray-400 sm:text-base">
          Looks like this endpoint doesn't exist. The page may have moved,
          been removed, or the URL might be incorrect.
        </p>

        {/* Navigation actions */}
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition duration-300 hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#09090d]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4 transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m10 19-7-7 7-7M3 12h18"
              />
            </svg>
            Back to Home
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-gray-300 transition duration-300 hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-violet-400/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5m5 5H3"
              />
            </svg>
            Sign In
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-10 border-t border-white/[0.07] pt-6">
          <p className="text-xs text-gray-500">
            <span className="font-semibold text-gray-400">BackendHub</span>
            <span className="mx-2 text-gray-700">·</span>
            Let's get you back on track
          </p>
        </div>
      </section>
    </main>
  );
}

export default NotFound;