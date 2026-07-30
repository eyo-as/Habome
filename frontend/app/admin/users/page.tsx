"use client";

import { useEffect, useMemo, useState } from "react";
import { Shield, Trash2, Mail } from "lucide-react";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Pagination } from "@/components/pagination";
import { ROLE_LABELS, PAGINATION } from "@/lib/constants";
import { formatDate } from "@/lib/helpers";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { useToast } from "@/context/toast-context";
import { adminAPI } from "@/services/api";
import type { User } from "@/lib/types";

export default function AdminUsersPage() {
  const { isLoading } = useProtectedRoute("admin");
  const { addToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "owner" | "user">("all");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setIsLoadingData(true);
      const response = await adminAPI.getAllUsers({ page: 1, limit: 100 });

      const items = (response.data?.data?.users ?? []) as Array<
        Record<string, unknown>
      >;
      setUsers(
        items.map((user) => ({
          id: String(user._id || user.id || ""),
          name: typeof user.name === "string" ? user.name : "",
          email: typeof user.email === "string" ? user.email : "",
          role: (user.role as User["role"]) || "user",
          createdAt: user.createdAt
            ? new Date(String(user.createdAt))
            : new Date(),
        })),
      );
      setError(null);
    } catch {
      setError("We could not load users right now.");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter, users]);

  const totalPages = Math.ceil(
    filteredUsers.length / PAGINATION.ADMIN_USERS_LIMIT,
  );
  const paginatedUsers = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGINATION.ADMIN_USERS_LIMIT;
    return filteredUsers.slice(
      startIdx,
      startIdx + PAGINATION.ADMIN_USERS_LIMIT,
    );
  }, [currentPage, filteredUsers]);

  const handleDeleteUser = async (id: string) => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await adminAPI.deleteUser(id);
      addToast("User deleted successfully", "success");
      setPendingDeleteId(null);
      await loadUsers();
    } catch {
      addToast("We could not delete this user.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-0 md:gap-6">
      <DashboardSidebar role="admin" />

      <main className="flex-1 mt-16 md:mt-0 px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users on the platform
          </p>
        </div>

        {error ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2 mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 rounded-lg border border-border bg-black text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as typeof roleFilter);
              setCurrentPage(1);
            }}
            className="px-4 py-2 rounded-lg border border-border bg-black text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Roles</option>
            <option value="owner">Property Owners</option>
            <option value="user">Buyers</option>
          </select>
        </div>

        {paginatedUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="bg-black border border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-black/50 font-semibold text-sm">
                <div className="col-span-4">Name</div>
                <div className="col-span-4">Email</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Actions</div>
              </div>

              <div className="divide-y divide-border">
                {paginatedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-black/50 transition-colors text-sm"
                  >
                    <div className="col-span-4 font-medium">{user.name}</div>
                    <div className="col-span-4 text-muted-foreground flex items-center gap-2">
                      <Mail size={16} />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {ROLE_LABELS[user.role]}
                      </span>
                    </div>
                    <div className="col-span-2 flex gap-2">
                      <button
                        onClick={() => setPendingDeleteId(user.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-600 hover:text-red-500 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-black border border-border rounded-lg p-8 text-center">
            <Shield
              size={48}
              className="mx-auto mb-4 text-muted-foreground opacity-50"
            />
            <p className="text-muted-foreground">No users found</p>
          </div>
        )}

        <DeleteConfirmationModal
          isOpen={Boolean(pendingDeleteId)}
          title="Delete user"
          description="This action will remove the user account from the platform."
          confirmLabel="Delete user"
          isLoading={isDeleting}
          onConfirm={() => {
            if (pendingDeleteId) {
              void handleDeleteUser(pendingDeleteId);
            }
          }}
          onCancel={() => setPendingDeleteId(null)}
        />

        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredUsers.length}
              itemsPerPage={PAGINATION.ADMIN_USERS_LIMIT}
            />
          </div>
        )}
      </main>
    </div>
  );
}
