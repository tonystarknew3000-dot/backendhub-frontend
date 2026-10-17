import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "https://backend-course-api-fzwg.onrender.com";

function Dashboard() {
  const [apiStatus, setApiStatus] = useState("checking");
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

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
    checking: "text-amber-400",
    online: "text-emerald-400",
    offline: "text-red-400",
  };

  const features = [
    {
      icon: "👤",
      title: "My Profile",
      description: "View your account and personal information.",
      link: "/profile",
      action: "View profile",
    },
    {
      icon: "🔐",
      title: "Security",
      description: "Manage your password and account security.",
      link: "/profile",
      action: "Manage security",
    },
    {
      icon: "🛡️",
      title: "Administration",
      description: "Access administrative tools if your account is authorized.",
      link: "/admin",
      action: "Open admin",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-white/[0.02] p-6 md:flex md:flex-col">
          <Link to="/" className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-bold">
              B
            </div>
            <div>
              <p className="font-bold tracking-wide">BackendHub</p>
              <p className="text-xs text-gray-500">Developer platform</p>
            </div>
          </Link>

          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Workspace
          </p>

          <nav className="space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-300"
            >
              <span>▦</span>
              Dashboard
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              <span>♙</span>
              My Profile
            </Link>

            <Link
              to="/forgot-password"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              <span>♧</span>
              Account Security
            </Link>
          </nav>

          <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm font-medium">Need help?</p>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Explore your API features and account tools.
            </p>
            <Link
              to="/"
              className="mt-3 inline-block text-sm text-violet-400 hover:text-violet-300"
            >
              Back to home →
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-8">
            <div>
              <p className="text-sm text-gray-500">Workspace / Overview</p>
              <h1 className="mt-1 text-xl font-bold sm:text-2xl">Dashboard</h1>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`h-2 w-2 rounded-full ${
                  apiStatus === "online"
                    ? "bg-emerald-400"
                    : apiStatus === "offline"
                      ? "bg-red-400"
                      : "bg-amber-400"
                }`}
              />
              <span className={`text-xs sm:text-sm ${statusColor[apiStatus]}`}>
                {statusText[apiStatus]}
              </span>
              <Link
                to="/login"
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5"
              >
                Sign in
              </Link>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
            {/* Welcome banner */}
            <section className="relative overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-br from-indigo-950/80 via-violet-950/50 to-[#11111a] p-6 sm:p-9">
              <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full bg-violet-500/20 blur-3xl" />

              <div className="relative max-w-2xl">
                <p className="text-sm font-medium text-violet-300">
                  BACKENDHUB WORKSPACE
                </p>
                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                  Your backend, at a glance.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-gray-300 sm:text-base">
                  Access your account tools and check the connection to your
                  deployed API from one place.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/profile"
                    className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-950 transition hover:bg-gray-200"
                  >
                    View my profile
                  </Link>
                  <Link
                    to="/"
                    className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
                  >
                    Explore home page
                  </Link>
                </div>
              </div>
            </section>

            {/* Overview cards */}
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">System overview</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Current connection status and available tools.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">Backend API</p>
                    <span className="text-xl">⌘</span>
                  </div>
                  <p className="mt-4 text-2xl font-bold">
                    {apiStatus === "online"
                      ? "Connected"
                      : apiStatus === "offline"
                        ? "Unavailable"
                        : "Checking"}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Health endpoint response
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">Account</p>
                    <span className="text-xl">♙</span>
                  </div>

                  <p className="mt-4 text-xl font-bold">
                    {user?.username || "User"}
                  </p>

                  <p className="mt-2 break-all text-sm text-gray-400">
                    {user?.email || "Email not available"}
                  </p>

                  <p className="mt-3 text-xs text-gray-500">
                    Role: {user?.role || "Not available"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:col-span-2 xl:col-span-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">Security</p>
                    <span className="text-xl">♢</span>
                  </div>
                  <p className="mt-4 text-2xl font-bold">Setup pending</p>
                  <p className="mt-2 text-xs text-gray-500">
                    Protected routes and session management come next.
                  </p>
                </div>
              </div>
            </section>

            {/* Quick actions */}
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Quick access</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Shortcuts to your account pages and tools.
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {features.map((feature) => (
                  <article
                    key={feature.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-500/40 hover:bg-white/[0.05]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-xl">
                      {feature.icon}
                    </div>
                    <h3 className="mt-4 font-semibold">{feature.title}</h3>
                    <p className="mt-2 min-h-12 text-sm leading-6 text-gray-400">
                      {feature.description}
                    </p>
                    <Link
                      to={feature.link}
                      className="mt-4 inline-flex text-sm font-medium text-violet-400 hover:text-violet-300"
                    >
                      {feature.action} →
                    </Link>
                  </article>
                ))}
              </div>
            </section>

            <footer className="border-t border-white/10 pt-5 text-xs text-gray-600">
              BackendHub · Dashboard interface
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
