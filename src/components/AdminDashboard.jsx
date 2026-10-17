
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

  return (
    <main className="min-h-screen bg-[#050507] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <Link
              to="/dashboard"
              className="mb-3 inline-flex text-sm text-gray-400 transition hover:text-white"
            >
              ← Back to Dashboard
            </Link>

            <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
              BackendHub Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Administrative tools and system management.
            </p>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
              Access control
            </p>
            <p className="mt-1 text-sm text-amber-200">
              Backend authorization required
            </p>
          </div>
        </header>

        <section className="relative mt-8 overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-indigo-950/80 via-violet-950/50 to-[#11111a] p-6 sm:p-9">
          <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative max-w-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-2xl">
              🛡️
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Administrative workspace
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-300">
              This interface is prepared for your administrative features.
              Real user data and management actions will be connected
              to your backend after authentication and authorization
              are implemented.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              Management tools
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              These sections are interface placeholders until connected.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-violet-500/40 hover:bg-white/[0.05]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-2xl">
                  {section.icon}
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  {section.title}
                </h3>

                <p className="mt-3 min-h-16 text-sm leading-6 text-gray-400">
                  {section.description}
                </p>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <span className="text-xs font-medium text-amber-300">
                    {section.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-semibold">Security reminder</h2>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            Hiding this page in the frontend is not sufficient to secure
            administrator features. Every administrative API request must
            be authorized by the backend using the authenticated user's
            role and permissions.
          </p>
        </section>

        <footer className="py-8 text-center text-xs text-gray-600">
          BackendHub · Administrative workspace
        </footer>
      </div>
    </main>
  );
}

export default AdminDashboard;
