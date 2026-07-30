"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Trash2, Shield, AlertCircle } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { StatusBadge } from "@/components/status-badge";
import { Pagination } from "@/components/pagination";
import { formatPrice, formatDate } from "@/lib/helpers";
import { ROUTES, PAGINATION } from "@/lib/constants";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { adminAPI } from "@/services/api";
import { normalizeProperty } from "@/lib/property-utils";
import type { Property } from "@/lib/types";

export default function AdminPropertiesPage() {
  const { isLoading } = useProtectedRoute("admin");
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({ totalPages: 1, totalItems: 0 });
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProperties = async () => {
      try {
        setIsLoadingData(true);
        const response = await adminAPI.getAllProperties({
          page: currentPage,
          limit: PAGINATION.ADMIN_PROPERTIES_LIMIT,
        });

        if (isMounted) {
          const items = (response.data?.data?.properties ?? []) as Array<
            Record<string, unknown>
          >;
          setProperties(items.map(normalizeProperty));
          setPageInfo({
            totalPages: response.data?.data?.totalPages ?? 1,
            totalItems: response.data?.data?.total ?? 0,
          });
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError("We could not load the properties right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    };

    loadProperties();

    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  const handleDelete = (id: string) => {
    console.log("Delete property:", id);
  };

  const handleReview = (id: string) => {
    console.log("Review property:", id);
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
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              All Properties
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and manage all properties on the platform
            </p>
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
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Owner
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Listed
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {properties.length > 0 ? (
                    properties.map((property) => (
                      <tr
                        key={property.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-foreground">
                              {property.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {property.location}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {property.owner?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {property.owner?.email}
                            </p>
                          </div>
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
                            <button
                              onClick={() => handleReview(property.id)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                              title="Review"
                            >
                              <Shield size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(property.id)}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors text-muted-foreground hover:text-red-600"
                              title="Delete"
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
              {properties.length > 0 ? (
                properties.map((property) => (
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
                          {property.owner?.name}
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
                        <button
                          onClick={() => handleReview(property.id)}
                          className="p-1.5 hover:bg-muted rounded transition-colors"
                        >
                          <Shield size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors text-red-600"
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

            {pageInfo.totalPages > 1 && (
              <div className="p-4 md:p-6 border-t border-border">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pageInfo.totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  totalItems={pageInfo.totalItems}
                  itemsPerPage={PAGINATION.ADMIN_PROPERTIES_LIMIT}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
