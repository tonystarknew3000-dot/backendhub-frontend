
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import VerifyEmail from "./components/VerifyEmail";
import DashboardPage from "./components/Dashboard";
import Profile from "./components/Profile";
import AdminDashboard from "./components/AdminDashboard";
import NotFound from "./components/NotFound";

const API_URL = "https://backend-course-api-fzwg.onrender.com";

function Dashboard() {
  const [backendStatus, setBackendStatus] = useState("not-checked");
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState("");

  const checkBackendConnection = async () => {
    if (isChecking) return;

    setIsChecking(true);
    setBackendStatus("checking");

    try {
      const response = await fetch(`${API_URL}/health`);

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
      status: "Frontend layer",
      statusColor:
        "border-violet-400/20 bg-violet-400/10 text-violet-300",
      icon: "◈",
      iconColor: "bg-violet-500/10 text-violet-300",
    },
    {
      number: "02",
      title: "Express API",
      description:
        "Your REST API, authentication, middleware, and business logic.",
      status: "Deployed API",
      statusColor:
        "border-indigo-400/20 bg-indigo-400/10 text-indigo-300",
      icon: "⌘",
      iconColor: "bg-indigo-500/10 text-indigo-300",
    },
    {
      number: "03",
      title: "MongoDB Atlas",
      description:
        "Your application data stays behind your Express backend.",
      status: "Access through API",
      statusColor:
        "border-sky-400/20 bg-sky-400/10 text-sky-300",
      icon: "▤",
      iconColor: "bg-sky-500/10 text-sky-300",
    },
  ];

  const statusStyles = {
    connected:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    failed: "border-red-400/20 bg-red-400/10 text-red-300",
    checking: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    "not-checked": "border-white/10 bg-white/[0.04] text-gray-300",
  };

  const statusLabel = {
    connected: "Connected",
    failed: "Connection failed",
    checking: "Checking connection...",
    "not-checked": "Not checked yet",
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050507] text-white selection:bg-violet-500/30">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-48 left-1/2 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-violet-700/[0.14] blur-[150px]" />
        <div className="absolute right-[-150px] top-[35%] h-[420px] w-[420px] rounded-full bg-indigo-600/[0.12] blur-[140px]" />
        <div className="absolute bottom-[-200px] left-[-100px] h-[420px] w-[420px] rounded-full bg-fuchsia-700/[0.08] blur-[140px]" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 border-b border-white/[0.08] bg-black/30 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 sm:py-5 lg:px-12">
          <Link to="/" className="group flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 via-violet-600 to-indigo-700 text-xl font-black text-white shadow-lg shadow-violet-600/20 ring-1 ring-white/10 transition duration-200 group-hover:scale-105">
              B
            </span>

            <span className="text-xl font-bold leading-tight tracking-tight">
              Backend<span className="text-violet-400">Hub</span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 md:flex">
            <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.65)]" />
            <span className="text-xs font-medium leading-5 text-gray-300">
              Developer workspace
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="inline-flex min-h-10 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              Login
            </Link>

            <a
              href="https://github.com/tonystarknew3000-dot/backend-course"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-sm font-medium text-gray-300 transition hover:border-violet-400/30 hover:bg-white/[0.07] hover:text-white sm:px-4"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 sm:pt-20 lg:px-12 lg:pt-24">
        {/* Hero */}
        <section className="max-w-4xl px-1 sm:px-2">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-4 py-2 text-xs font-semibold leading-5 tracking-wide text-violet-300">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
            <span className="break-words">YOUR DEVELOPER WORKSPACE</span>
          </div>

          <h1 className="mt-7 text-4xl font-bold leading-[1.15] tracking-tight sm:text-6xl lg:text-7xl">
            Your backend.
            <br />
            <span className="bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
              One clear view.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
            A central workspace for your React frontend, Express API, and
            MongoDB database. Built to grow alongside your backend project.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#services"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              Explore workspace
              <span aria-hidden="true">↓</span>
            </a>

            <a
              href={API_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-violet-400/30 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              Open API <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        {/* Architecture cards */}
        <section
          id="services"
          className="mt-16 grid scroll-mt-8 gap-4 sm:mt-20 md:grid-cols-3"
        >
          {features.map((feature) => (
            <article
              key={feature.number}
              className="group min-w-0 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-400/25 hover:bg-white/[0.055] sm:p-6 lg:p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${feature.iconColor}`}
                  aria-hidden="true"
                >
                  {feature.icon}
                </span>

                <span className="pt-1 font-mono text-xs leading-5 text-gray-500">
                  / {feature.number}
                </span>
              </div>

              <h2 className="mt-6 break-words text-lg font-semibold leading-7 tracking-tight text-white">
                {feature.title}
              </h2>

              <p className="mt-3 min-h-12 break-words text-sm leading-7 text-gray-400">
                {feature.description}
              </p>

              <div className="mt-6 border-t border-white/[0.08] pt-5">
                <span
                  className={`inline-flex max-w-full items-start gap-2 rounded-full border px-3 py-2 text-xs font-medium leading-5 ${feature.statusColor}`}
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                  <span className="break-words">{feature.status}</span>
                </span>
              </div>
            </article>
          ))}
        </section>

        {/* Deployed backend and health check */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/[0.09] via-white/[0.025] to-indigo-500/[0.07] shadow-[0_20px_70px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-8 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-9">
            <div className="min-w-0 flex-1 px-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase leading-5 tracking-[0.16em] text-violet-300">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                Deployed backend
              </div>

              <h2 className="mt-4 break-words text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                Your API endpoint
              </h2>

              <p className="mt-4 break-all font-mono text-sm leading-7 text-gray-300 [overflow-wrap:anywhere]">
                {API_URL}
              </p>

              <div className="mt-6">
                <p className="text-sm font-medium leading-6 text-gray-300">
                  Backend connection status
                </p>

                <span
                  role="status"
                  aria-live="polite"
                  className={`mt-3 inline-flex max-w-full items-start gap-2 rounded-full border px-3 py-2 text-xs font-medium leading-5 ${statusStyles[backendStatus]}`}
                >
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current ${
                      isChecking ? "animate-pulse" : ""
                    }`}
                  />
                  <span className="break-words">
                    {statusLabel[backendStatus]}
                  </span>
                </span>

                {lastChecked && (
                  <p className="mt-3 break-words text-xs leading-6 text-gray-500">
                    Last checked: {lastChecked}
                  </p>
                )}
              </div>

              <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
                Check whether your deployed Express API is responding to
                requests. This checks the backend health endpoint, not
                whether every application feature is working.
              </p>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-52 lg:flex-col">
              <button
                type="button"
                onClick={checkBackendConnection}
                disabled={isChecking}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isChecking && (
                  <svg
                    className="h-4 w-4 animate-spin"
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
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                )}
                {isChecking ? "Checking..." : "Check connection"}
              </button>

              <a
                href={API_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-violet-400/30 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                Visit backend
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-14 border-t border-white/[0.08] px-1 pt-6">
          <div className="flex flex-col gap-3 text-xs leading-6 text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} BackendHub. Built for developers.
            </p>

            <p className="break-words">
              React <span className="text-violet-400">·</span> Tailwind CSS{" "}
              <span className="text-violet-400">·</span> Express{" "}
              <span className="text-violet-400">·</span> MongoDB
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Unknown URLs */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
