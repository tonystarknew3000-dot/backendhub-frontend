
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507] px-4 py-12 text-white">
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-indigo-600/20 blur-[120px]" />

      <section className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold">
          B
        </div>

        <p className="mt-8 text-sm font-semibold tracking-[0.25em] text-violet-400">
          ERROR 404
        </p>

        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-gray-400 sm:text-base">
          The page you're looking for doesn't exist, may have moved,
          or may have an incorrect URL.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold transition hover:brightness-110"
          >
            Back to Home
          </Link>

          <Link
            to="/login"
            className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/5 hover:text-white"
          >
            Sign In
          </Link>
        </div>

        <p className="mt-10 text-xs text-gray-600">
          BackendHub · Let's get you back on track
        </p>
      </section>
    </main>
  );
}

export default NotFound;
