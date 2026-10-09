import { useState, useEffect } from "react";

function App() {
  const [backendStatus, setBackendStatus] = useState("not-checked");
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState("");

  const checkBackendConnection = async () => {
    setIsChecking(true);

    try {
      const response = await fetch(
        "https://backend-course-api-fzwg.onrender.com/health",
      );

      if (!response.ok) {
        throw new Error("Backend health check failed");
      }

      const data = await response.json();

      if (data.success === true) {
        setBackendStatus("connected");
      } else {
        setBackendStatus("failed");
      }
    } catch (error) {
      console.error("Backend connection error:", error);
      setBackendStatus("failed");
    } finally {
      setIsChecking(false);
      setLastChecked(new Date().toLocaleTimeString());
    }
  };

  const features = [
    {
      number: "01",
      title: "React Frontend",
      description:
        "Your interface, built with React and styled with Tailwind CSS.",
      status: "Running locally",
      statusColor: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
      icon: "◈",
      iconColor: "text-indigo-300 bg-indigo-400/10",
    },
    {
      number: "02",
      title: "Express API",
      description:
        "Your REST API, authentication, middleware, and business logic.",
      status: "Ready to connect",
      statusColor: "text-amber-300 bg-amber-400/10 border-amber-400/20",
      icon: "⌘",
      iconColor: "text-violet-300 bg-violet-400/10",
    },
    {
      number: "03",
      title: "MongoDB Atlas",
      description: "Your application data stays behind your Express backend.",
      status: "Through API",
      statusColor: "text-sky-300 bg-sky-400/10 border-sky-400/20",
      icon: "▤",
      iconColor: "text-sky-300 bg-sky-400/10",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050507] text-white selection:bg-indigo-500/30">
      {/* Background glow */}{" "}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[130px]" />{" "}
      <div className="pointer-events-none absolute right-0 top-[500px] h-72 w-72 rounded-full bg-violet-700/10 blur-[120px]" />
      {/* Navigation */}
      <header className="relative z-10 border-b border-white/[0.08] bg-black/30 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <a href="/" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-700 text-lg font-black shadow-lg shadow-indigo-600/20 transition group-hover:scale-105">
              B
            </span>
            <span className="text-xl font-bold tracking-tight">
              Backend<span className="text-indigo-400">Hub</span>
            </span>
          </a>

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
            <span className="text-xs font-medium text-zinc-300">
              Development workspace
            </span>
          </div>

          <a
            href="https://github.com/tonystarknew3000-dot/backend-course"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-indigo-400/50 hover:bg-white/5 hover:text-white"
          >
            GitHub ↗
          </a>
        </nav>
      </header>
      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8 sm:pt-24 lg:px-12">
        {/* Hero */}
        <section className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.07] px-3 py-1.5 text-xs font-semibold tracking-wide text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            YOUR DEVELOPER WORKSPACE
          </div>

          <h1 className="mt-7 text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            Your backend.
            <br />
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-500 bg-clip-text text-transparent">
              One clear view.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            A central workspace for your React frontend, Express API, and
            MongoDB database. Built to grow alongside your backend project.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-400"
            >
              Explore workspace <span aria-hidden="true">↓</span>
            </a>

            <a
              href="https://backend-course-api-fzwg.onrender.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              Open API <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        {/* Architecture summary */}
        <section
          id="services"
          className="mt-16 grid gap-4 sm:mt-20 md:grid-cols-3"
        >
          {features.map((feature) => (
            <article
              key={feature.number}
              className="group rounded-2xl border border-white/[0.09] bg-white/[0.025] p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-white/[0.045] sm:p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${feature.iconColor}`}
                >
                  {feature.icon}
                </span>

                <span className="font-mono text-xs text-zinc-600">
                  / {feature.number}
                </span>
              </div>

              <h2 className="mt-7 text-lg font-semibold tracking-tight">
                {feature.title}
              </h2>

              <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-400">
                {feature.description}
              </p>

              <div className="mt-6 border-t border-white/[0.07] pt-5">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${feature.statusColor}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {feature.status}
                </span>
              </div>
            </article>
          ))}
        </section>

       
        {/* API endpoint */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/[0.09] via-white/[0.025] to-violet-500/[0.06]">
          <div className="flex flex-col gap-7 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Deployed backend
              </div>

              <h2 className="mt-4 text-2xl font-bold tracking-tight">
                Your API endpoint
              </h2>

              <p className="mt-3 break-all font-mono text-sm leading-6 text-zinc-300">
                https://backend-course-api-fzwg.onrender.com
              </p>

              <div className="mt-5">
                <p className="text-sm text-zinc-400">
                  Backend connection status
                </p>

                <span
                  className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                    backendStatus === "connected"
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                      : backendStatus === "failed"
                        ? "border-red-400/20 bg-red-400/10 text-red-300"
                        : backendStatus === "checking"
                          ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                          : "border-white/10 bg-white/5 text-zinc-300"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />

                  {backendStatus === "connected"
                    ? "Connected"
                    : backendStatus === "failed"
                      ? "Connection failed"
                      : backendStatus === "checking"
                        ? "Checking..."
                        : "Not checked"}
                </span>

                {lastChecked && (
                  <p className="mt-2 text-xs text-zinc-500">
                    Last checked: {lastChecked}
                  </p>
                )}
              </div>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Check whether your deployed Express API is responding.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
              <button
                type="button"
                onClick={checkBackendConnection}
                disabled={isChecking}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isChecking ? "Checking..." : "Check connection"}
              </button>

              <a
                href="https://backend-course-api-fzwg.onrender.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-300/20 bg-indigo-500/15 px-5 py-3 text-sm font-semibold text-indigo-200 transition hover:border-indigo-300/40 hover:bg-indigo-500/25"
              >
                Visit backend <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-14 flex flex-col gap-3 border-t border-white/[0.08] pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} BackendHub. Built for developers.</p>
          <p>React · Tailwind CSS · Express · MongoDB</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
