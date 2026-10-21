import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../utils/authFetch";
const AVAILABLE_PERMISSIONS = [
  "create:user",
  "read:user",
  "update:user",
  "delete:user",
];

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [usersReloadKey, setUsersReloadKey] = useState(0);
  const [roleFilter, setRoleFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);

  const [deletingUserId, setDeletingUserId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);

  const [accessUser, setAccessUser] = useState(null);
  const [accessRole, setAccessRole] = useState("user");
  const [accessPermissions, setAccessPermissions] = useState([]);
  const [accessSaving, setAccessSaving] = useState(false);
  const [accessError, setAccessError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      try {
        setUsersLoading(true);
        setUsersError("");

        const params = new URLSearchParams({
          search: userSearch.trim(),
          role: roleFilter,
          verification: verificationFilter,
          page: String(currentPage),
          limit: "10",
        });

        const response = await authFetch(`/admin/users?${params.toString()}`);

        let result;

        try {
          result = await response.json();
        } catch {
          throw new Error("The server returned an invalid response.");
        }

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load user accounts.");
        }

        if (!Array.isArray(result.data) || !result.pagination) {
          throw new Error("The server returned an unexpected user list.");
        }

        if (!cancelled) {
          setUsers(result.data);
          setPagination(result.pagination);
          setTotalUsers(result.totalUsers ?? 0);
        }
      } catch (error) {
        if (!cancelled) {
          setUsersError(error.message || "Unable to load user accounts.");
        }
      } finally {
        if (!cancelled) {
          setUsersLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, [userSearch, roleFilter, verificationFilter, currentPage, usersReloadKey]);

  async function handleDeleteUser() {
    if (!userToDelete || deletingUserId) {
      return;
    }

    const userId = userToDelete._id || userToDelete.id;

    if (!userId) {
      setDeleteError("Cannot delete this account because its ID is missing.");
      return;
    }

    try {
      setDeletingUserId(userId);
      setDeleteError("");
      setDeleteSuccess("");

      const response = await authFetch(
        `/admin/users/${encodeURIComponent(userId)}`,
        {
          method: "DELETE",
        },
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error("The server returned an invalid response.");
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to delete this account.");
      }

      setUsers((currentUsers) =>
        currentUsers.filter((user) => (user._id || user.id) !== userId),
      );

      setTotalUsers((total) => Math.max(0, total - 1));
      setPagination((current) => ({
        ...current,
        total: Math.max(0, current.total - 1),
      }));

      setSelectedUser((current) =>
        current && (current._id || current.id) === userId ? null : current,
      );

      setUserToDelete(null);
      setDeleteSuccess(result.message || "Account deleted successfully.");

      // If the deleted account was the only item on this page,
      // move back one page when possible.
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        setUsersReloadKey((key) => key + 1);
      }
    } catch (error) {
      setDeleteError(error.message || "Unable to delete this account.");
    } finally {
      setDeletingUserId(null);
    }
  }

  async function handleSaveAccess() {
    if (!accessUser || accessSaving) return;

    const userId = accessUser._id || accessUser.id;

    if (!userId) {
      setAccessError("Cannot update this account because its ID is missing.");
      return;
    }

    try {
      setAccessSaving(true);
      setAccessError("");

      const response = await authFetch(
        `/admin/users/${encodeURIComponent(userId)}/access`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: accessRole,
            permissions: accessPermissions,
          }),
        },
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error("The server returned an invalid response.");
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to update account access.");
      }

      const updatedUser = {
        ...accessUser,
        ...result.data,
        _id: result.data?.id || accessUser._id || accessUser.id,
      };

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          (user._id || user.id) === userId ? { ...user, ...updatedUser } : user,
        ),
      );

      setSelectedUser((current) =>
        current && (current._id || current.id) === userId
          ? { ...current, ...updatedUser }
          : current,
      );

      setAccessUser(null);
      setUsersReloadKey((key) => key + 1);
      setDeleteSuccess(
        result.message || "Account access updated successfully.",
      );
    } catch (error) {
      setAccessError(error.message || "Unable to update account access.");
    } finally {
      setAccessSaving(false);
    }
  }
  const sections = [
    {
      icon: "👥",
      title: "User Management",
      description: "View accounts returned by your protected admin API.",
      status: "User accounts",
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

            <p
              className={`mt-3 max-w-xl px-1 text-sm leading-7 text-gray-400 sm:text-base ${textSafe}`}
            >
              Administrative tools and system management in one workspace.
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

            <p
              className={`mt-3 max-w-2xl px-0.5 text-sm leading-7 text-gray-300/90 sm:text-base ${textSafe}`}
            >
              Your administrative workspace is connected to the backend. User
              account information is loaded through a protected endpoint and
              remains subject to server-side authorization.
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
              User Management is connected to your backend. Other tools will be
              connected when their endpoints are ready.
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

                  <p
                    className={`mt-3 min-h-16 px-0.5 text-sm leading-7 text-gray-400 ${textSafe}`}
                  >
                    {section.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/[0.08] pt-4">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        section.title === "User Management" &&
                        !usersLoading &&
                        !usersError
                          ? "bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.25)]"
                          : "bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.25)]"
                      }`}
                    />
                    <span className="text-xs font-medium leading-6 text-amber-200/90">
                      {section.title === "User Management"
                        ? usersLoading
                          ? "Loading accounts…"
                          : usersError
                            ? "Unable to load accounts"
                            : `${totalUsers} total account${totalUsers === 1 ? "" : "s"}`
                        : section.status}
                    </span>
                  </div>

                  {section.title === "User Management" && (
                    <div className="mt-4 border-t border-white/[0.08] pt-4">
                      {usersLoading ? (
                        <p
                          className="text-sm leading-6 text-gray-400"
                          role="status"
                        >
                          Loading user accounts…
                        </p>
                      ) : usersError ? (
                        <div
                          className="rounded-xl border border-red-400/20 bg-red-400/[0.06] p-3"
                          role="alert"
                        >
                          <p className="text-sm leading-6 text-red-200">
                            {usersError}
                          </p>
                          <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className={`${secondaryButton} mt-3`}
                          >
                            Try again
                          </button>
                        </div>
                      ) : (
                        <>
                          <label
                            htmlFor="admin-user-search"
                            className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-400"
                          >
                            Search users
                          </label>
                          <input
                            id="admin-user-search"
                            type="search"
                            value={userSearch}
                            onChange={(event) => {
                              setUserSearch(event.target.value);
                              setCurrentPage(1);
                            }}
                            placeholder="Search by username, email, or role…"
                            autoComplete="off"
                            className="mb-4 min-h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
                          />

                          <div className="mb-4 grid gap-3 sm:grid-cols-2">
                            <div>
                              <label
                                htmlFor="admin-role-filter"
                                className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-400"
                              >
                                Filter by role
                              </label>

                              <select
                                id="admin-role-filter"
                                value={roleFilter}
                                onChange={(event) => {
                                  setRoleFilter(event.target.value);
                                  setCurrentPage(1);
                                }}
                                className="min-h-11 w-full rounded-xl border border-white/10 bg-[#111018] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400/60"
                              >
                                <option value="all">All roles</option>
                                <option value="admin">Administrators</option>
                                <option value="user">Regular users</option>
                              </select>
                            </div>

                            <div>
                              <label
                                htmlFor="admin-verification-filter"
                                className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-400"
                              >
                                Email verification
                              </label>

                              <select
                                id="admin-verification-filter"
                                value={verificationFilter}
                                onChange={(event) => {
                                  setVerificationFilter(event.target.value);
                                  setCurrentPage(1);
                                }}
                                className="min-h-11 w-full rounded-xl border border-white/10 bg-[#111018] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400/60"
                              >
                                <option value="all">All accounts</option>
                                <option value="verified">Verified</option>
                                <option value="unverified">Not verified</option>
                              </select>
                            </div>
                          </div>

                          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                            {userSearch.trim() ||
                            roleFilter !== "all" ||
                            verificationFilter !== "all"
                              ? `${pagination.total} matching account${pagination.total === 1 ? "" : "s"}`
                              : `${pagination.total} accounts`}
                          </p>
                          {users.length === 0 ? (
                            <p className="rounded-xl border border-white/[0.07] bg-black/20 p-3 text-sm leading-6 text-gray-400">
                              No accounts match your current search and filters.
                              Try changing them.
                            </p>
                          ) : (
                            <>
                              <ul className="space-y-3">
                                {users.map((user, userIndex) => (
                                  <li
                                    key={
                                      user._id ||
                                      user.id ||
                                      user.email ||
                                      userIndex
                                    }
                                    className="rounded-xl border border-white/[0.07] bg-black/20 p-3"
                                  >
                                    <p className="break-words text-sm font-semibold text-gray-100">
                                      {user.username ||
                                        user.name ||
                                        "Unnamed user"}
                                    </p>
                                    <p className="mt-1 break-all text-xs leading-5 text-gray-400">
                                      {user.email || "No email provided"}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {user.role && (
                                        <span className="rounded-md border border-violet-300/15 bg-violet-400/[0.08] px-2 py-1 text-[10px] font-medium text-violet-200">
                                          {user.role}
                                        </span>
                                      )}
                                      <span
                                        className={`rounded-md border px-2 py-1 text-[10px] font-medium ${
                                          user.emailVerified
                                            ? "border-emerald-300/15 bg-emerald-400/[0.07] text-emerald-200"
                                            : "border-amber-300/15 bg-amber-400/[0.07] text-amber-200"
                                        }`}
                                      >
                                        {user.emailVerified
                                          ? "Email verified"
                                          : "Email not verified"}
                                      </span>
                                    </div>

                                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                      <button
                                        type="button"
                                        onClick={() => setSelectedUser(user)}
                                        className={secondaryButton}
                                      >
                                        View Details →
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setAccessUser(user);
                                          setAccessRole(user.role || "user");
                                          setAccessPermissions(
                                            Array.isArray(user.permissions)
                                              ? [...user.permissions]
                                              : [],
                                          );
                                          setAccessError("");
                                        }}
                                        disabled={accessSaving}
                                        className={secondaryButton}
                                      >
                                        Edit Access
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setDeleteError("");
                                          setDeleteSuccess("");
                                          setUserToDelete(user);
                                        }}
                                        disabled={Boolean(deletingUserId)}
                                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/[0.08] px-4 py-2.5 text-sm font-medium text-red-200 transition-colors hover:border-red-400/40 hover:bg-red-500/[0.15] disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        Delete Account
                                      </button>
                                    </div>
                                  </li>
                                ))}
                              </ul>

                              <div className="mt-4 border-t border-white/[0.08] pt-4">
                                <p className="mb-3 text-xs leading-5 text-gray-400">
                                  Showing{" "}
                                  {users.length === 0
                                    ? 0
                                    : (pagination.page - 1) * pagination.limit +
                                      1}
                                  {"–"}
                                  {(pagination.page - 1) * pagination.limit +
                                    users.length}
                                  {" of "}
                                  {pagination.total} matching accounts
                                </p>

                                <div className="flex items-center justify-between gap-3">
                                  <button
                                    type="button"
                                    disabled={
                                      !pagination.hasPrevPage || usersLoading
                                    }
                                    onClick={() =>
                                      setCurrentPage((page) => page - 1)
                                    }
                                    className={`${secondaryButton} disabled:cursor-not-allowed disabled:opacity-40`}
                                  >
                                    ← Previous
                                  </button>

                                  <span className="text-xs text-gray-400">
                                    Page {pagination.page} of{" "}
                                    {Math.max(1, pagination.totalPages)}
                                  </span>

                                  <button
                                    type="button"
                                    disabled={
                                      !pagination.hasNextPage || usersLoading
                                    }
                                    onClick={() =>
                                      setCurrentPage((page) => page + 1)
                                    }
                                    className={`${secondaryButton} disabled:cursor-not-allowed disabled:opacity-40`}
                                  >
                                    Next →
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Edit Account Access Modal */}
        {accessUser && (
          <div
            className="fixed inset-0 z-[65] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => {
              if (!accessSaving) setAccessUser(null);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-access-title"
              onClick={(event) => event.stopPropagation()}
              className="my-auto w-full max-w-lg rounded-2xl border border-violet-300/20 bg-[#111018] p-6 shadow-2xl"
            >
              <h2
                id="edit-access-title"
                className="text-xl font-bold text-white"
              >
                Edit Account Access
              </h2>

              <p className="mt-2 break-words text-sm text-gray-400">
                Update the role and permissions for{" "}
                <strong className="text-violet-200">
                  {accessUser.username || accessUser.email || "this account"}
                </strong>
                .
              </p>

              <div className="mt-6">
                <label
                  htmlFor="edit-access-role"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400"
                >
                  Account role
                </label>

                <select
                  id="edit-access-role"
                  value={accessRole}
                  onChange={(event) => setAccessRole(event.target.value)}
                  disabled={accessSaving}
                  className="min-h-11 w-full rounded-xl border border-white/10 bg-[#111018] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400/60 disabled:opacity-50"
                >
                  <option value="user">Regular user</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <fieldset className="mt-6">
                <legend className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Permissions
                </legend>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Select the permissions this account should have.
                </p>

                <div className="mt-3 space-y-3">
                  {AVAILABLE_PERMISSIONS.map((permission) => (
                    <label
                      key={permission}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 text-sm text-gray-200"
                    >
                      <input
                        type="checkbox"
                        checked={accessPermissions.includes(permission)}
                        disabled={accessSaving}
                        onChange={(event) => {
                          setAccessPermissions((current) =>
                            event.target.checked
                              ? [...current, permission]
                              : current.filter((item) => item !== permission),
                          );
                        }}
                        className="h-4 w-4 accent-violet-500"
                      />
                      <span>{permission}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {accessError && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-3 text-sm text-red-200"
                >
                  {accessError}
                </p>
              )}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={accessSaving}
                  onClick={() => setAccessUser(null)}
                  className={secondaryButton}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={accessSaving}
                  onClick={handleSaveAccess}
                  className={`${primaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {accessSaving ? "Saving…" : "Save Access"}
                </button>
              </div>

              <p className="mt-4 text-xs leading-5 text-amber-200/80">
                You cannot change your own role or permissions through this
                endpoint. The backend enforces this restriction.
              </p>
            </section>
          </div>
        )}
        {/* Delete Account Confirmation */}
        {userToDelete && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => {
              if (!deletingUserId) setUserToDelete(null);
            }}
          >
            <section
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-account-title"
              aria-describedby="delete-account-description"
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-red-400/20 bg-[#111018] p-6 shadow-2xl"
            >
              <h2
                id="delete-account-title"
                className="text-xl font-bold text-white"
              >
                Delete this account?
              </h2>

              <p
                id="delete-account-description"
                className="mt-3 break-words text-sm leading-7 text-gray-300"
              >
                You are about to permanently delete{" "}
                <strong className="text-white">
                  {userToDelete.username ||
                    userToDelete.email ||
                    "this account"}
                </strong>
                . This action cannot be undone.
              </p>

              {deleteError && (
                <p
                  className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-3 text-sm text-red-200"
                  role="alert"
                >
                  {deleteError}
                </p>
              )}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={Boolean(deletingUserId)}
                  onClick={() => setUserToDelete(null)}
                  className={secondaryButton}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={Boolean(deletingUserId)}
                  onClick={handleDeleteUser}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-400/30 bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingUserId ? "Deleting…" : "Confirm Delete"}
                </button>
              </div>
            </section>
          </div>
        )}

        {deleteSuccess && (
          <div
            role="status"
            className="fixed bottom-5 right-5 z-[70] max-w-sm rounded-xl border border-emerald-400/20 bg-[#111018] p-4 text-sm text-emerald-200 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <p>{deleteSuccess}</p>
              <button
                type="button"
                onClick={() => setDeleteSuccess("")}
                aria-label="Dismiss success message"
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        {/* Selected User Details Modal */}
        {selectedUser && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="user-details-title"
              onClick={(event) => event.stopPropagation()}
              className="my-auto w-full max-w-lg rounded-2xl border border-violet-300/20 bg-[#111018] p-6 shadow-2xl shadow-violet-950/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                    BackendHub Administration
                  </p>

                  <h2
                    id="user-details-title"
                    className="mt-2 text-2xl font-bold text-white"
                  >
                    User Details
                  </h2>

                  <p className="mt-2 text-sm text-gray-400">
                    Account information and permissions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  aria-label="Close user details"
                  className={secondaryButton}
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Username
                  </p>
                  <p className="mt-2 break-words text-sm font-semibold text-white">
                    {selectedUser.username ||
                      selectedUser.name ||
                      "Not available"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Email address
                  </p>
                  <p className="mt-2 break-all text-sm text-white">
                    {selectedUser.email || "Not available"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Account ID
                  </p>
                  <p className="mt-2 break-all font-mono text-xs text-gray-300">
                    {selectedUser._id || selectedUser.id || "Not available"}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Role
                    </p>
                    <p className="mt-2 text-sm font-semibold capitalize text-violet-200">
                      {selectedUser.role || "Not assigned"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Email verification
                    </p>
                    <p
                      className={`mt-2 text-sm font-semibold ${
                        selectedUser.emailVerified
                          ? "text-emerald-300"
                          : "text-amber-300"
                      }`}
                    >
                      {selectedUser.emailVerified ? "Verified" : "Not verified"}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Permissions
                  </p>

                  {Array.isArray(selectedUser.permissions) &&
                  selectedUser.permissions.length > 0 ? (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {selectedUser.permissions.map((permission) => (
                        <li
                          key={permission}
                          className="rounded-lg border border-violet-300/15 bg-violet-400/[0.08] px-3 py-1.5 text-xs text-violet-200"
                        >
                          {permission}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-gray-400">
                      No permissions assigned.
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Created
                    </p>
                    <p className="mt-2 text-sm text-gray-200">
                      {selectedUser.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleString()
                        : "Not available"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Last updated
                    </p>
                    <p className="mt-2 text-sm text-gray-200">
                      {selectedUser.updatedAt
                        ? new Date(selectedUser.updatedAt).toLocaleString()
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className={`${primaryButton} mt-6 w-full`}
              >
                Close Details
              </button>
            </section>
          </div>
        )}

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
                Hiding this page in the frontend is not sufficient to secure
                administrator features. Every administrative API request must be
                authorized by the backend using the authenticated user's role
                and permissions.
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
