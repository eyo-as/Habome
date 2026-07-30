"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import {
  Edit2,
  Trash2,
  Eye,
  Archive,
  PlusSquare,
  AlertCircle,
  Rocket,
} from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { StatusBadge } from "@/components/status-badge";
import { Pagination } from "@/components/pagination";
import { formatPrice, formatDate } from "@/lib/helpers";
import { ROUTES, PAGINATION } from "@/lib/constants";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { useToast } from "@/context/toast-context";
import { propertyAPI } from "@/services/api";
import { normalizeProperty } from "@/lib/property-utils";
import type { Property } from "@/lib/types";

export default function OwnerPropertiesPage() {
  const { isLoading } = useProtectedRoute("owner");
  const { addToast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProperties = async () => {
    try {
      setIsLoadingData(true);
      const response = await propertyAPI.getMyListings();
      const items = (response.data?.data?.properties ?? []) as Array<
        Record<string, unknown>
      >;
      setProperties(items.map(normalizeProperty));
      setError(null);
    } catch {
      setError("We could not load your properties right now.");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProperties = async () => {
      if (!isMounted) return;
      await loadProperties();
    };

    fetchProperties();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalPages = Math.ceil(
    properties.length / PAGINATION.OWNER_PROPERTIES_LIMIT,
  );
  const paginatedProperties = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGINATION.OWNER_PROPERTIES_LIMIT;
    return properties.slice(
      startIdx,
      startIdx + PAGINATION.OWNER_PROPERTIES_LIMIT,
    );
  }, [currentPage, properties]);

  const handlePublish = async (id: string) => {
    if (isUpdatingId) return;

    setIsUpdatingId(id);
    try {
      await propertyAPI.publish(id);
      addToast("Property published successfully.", "success");
      await loadProperties();
    } catch {
      addToast("We could not publish this property.", "error");
    } finally {
      setIsUpdatingId(null);
    }
  };

  const handleArchive = async (id: string) => {
    if (isUpdatingId) return;

    setIsUpdatingId(id);
    try {
      await propertyAPI.archive(id);
      addToast("Property archived successfully.", "success");
      await loadProperties();
    } catch {
      addToast("We could not archive this property.", "error");
    } finally {
      setIsUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (isUpdatingId || isDeleting) return;

    setIsDeleting(true);
    try {
      await propertyAPI.delete(id);
      addToast("Property deleted successfully.", "success");
      await loadProperties();
    } catch {
      addToast("We could not delete this property.", "error");
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
      setIsUpdatingId(null);
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
      <DashboardSidebar role="owner" />

      <main className="flex-1 mt-16 md:mt-0 px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                My Properties
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and view all your property listings
              </p>
            </div>
            <Link
              href={ROUTES.OWNER_CREATE_PROPERTY}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              <PlusSquare size={20} />
              <span>New Property</span>
            </Link>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
              {error}
            </div>
          ) : null}

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProperties.length > 0 ? (
                    paginatedProperties.map((property) => (
                      <tr
                        key={property.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-foreground">
                            {property.title}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-muted-foreground">
                            {property.location}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-primary">
                            {formatPrice(property.price)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={property.status} />
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-muted-foreground">
                            {formatDate(property.createdAt)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={ROUTES.PROPERTY(property.id)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                              title="View"
                            >
                              <Eye size={18} />
                            </Link>
                            <Link
                              href={ROUTES.OWNER_EDIT_PROPERTY(property.id)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </Link>
                            {property.status === "draft" ? (
                              <button
                                onClick={() => handlePublish(property.id)}
                                className="p-2 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg transition-colors text-muted-foreground hover:text-green-600"
                                title="Publish"
                                disabled={isUpdatingId === property.id}
                              >
                                <Rocket size={18} />
                              </button>
                            ) : null}
                            <button
                              onClick={() => handleArchive(property.id)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                              title="Archive"
                              disabled={
                                isUpdatingId === property.id ||
                                property.status === "archived"
                              }
                            >
                              <Archive size={18} />
                            </button>
                            <button
                              onClick={() => setPendingDeleteId(property.id)}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors text-muted-foreground hover:text-red-600"
                              title="Delete"
                              disabled={
                                isUpdatingId === property.id || isDeleting
                              }
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AlertCircle size={24} />
                          <span>No properties found</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-2 p-4">
              {paginatedProperties.length > 0 ? (
                paginatedProperties.map((property) => (
                  <div
                    key={property.id}
                    className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {property.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {property.location}
                        </p>
                      </div>
                      <StatusBadge status={property.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-primary">
                        {formatPrice(property.price)}
                      </p>
                      <div className="flex gap-1">
                        <Link
                          href={ROUTES.PROPERTY(property.id)}
                          className="p-1.5 hover:bg-muted rounded transition-colors"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={ROUTES.OWNER_EDIT_PROPERTY(property.id)}
                          className="p-1.5 hover:bg-muted rounded transition-colors"
                        >
                          <Edit2 size={16} />
                        </Link>
                        {property.status === "draft" ? (
                          <button
                            onClick={() => handlePublish(property.id)}
                            className="p-1.5 hover:bg-green-50 dark:hover:bg-green-950/30 rounded transition-colors text-green-600"
                            disabled={isUpdatingId === property.id}
                          >
                            <Rocket size={16} />
                          </button>
                        ) : null}
                        <button
                          onClick={() => handleArchive(property.id)}
                          className="p-1.5 hover:bg-muted rounded transition-colors"
                          disabled={
                            isUpdatingId === property.id ||
                            property.status === "archived"
                          }
                        >
                          <Archive size={16} />
                        </button>
                        <button
                          onClick={() => setPendingDeleteId(property.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors text-red-600"
                          disabled={isUpdatingId === property.id || isDeleting}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
                  <AlertCircle size={24} className="mx-auto mb-2" />
                  <p>No properties found</p>
                </div>
              )}
            </div>

            <DeleteConfirmationModal
              isOpen={Boolean(pendingDeleteId)}
              title="Delete property"
              description="This action will permanently remove the listing from your account."
              confirmLabel="Delete property"
              isLoading={isDeleting}
              onConfirm={() => {
                if (pendingDeleteId) {
                  void handleDelete(pendingDeleteId);
                }
              }}
              onCancel={() => {
                setPendingDeleteId(null);
              }}
            />

            {totalPages > 1 && (
              <div className="p-4 md:p-6 border-t border-border">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  totalItems={properties.length}
                  itemsPerPage={PAGINATION.OWNER_PROPERTIES_LIMIT}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
