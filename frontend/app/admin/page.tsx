"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Package, Users, TrendingUp, AlertCircle } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ROUTES } from "@/lib/constants";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { adminAPI } from "@/services/api";
import { normalizeProperty } from "@/lib/property-utils";
import type { Property } from "@/lib/types";

interface MetricsSummary {
  totalUsers: number;
  totalProperties: number;
  publishedProperties: number;
}

export default function AdminDashboardPage() {
  const { isLoading: authLoading } = useProtectedRoute("admin");
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        const [metricsResponse, propertiesResponse] = await Promise.all([
          adminAPI.getMetrics(),
          adminAPI.getAllProperties({ page: 1, limit: 5 }),
        ]);

        if (isMounted) {
          setMetrics(metricsResponse.data?.data ?? null);
          const items = propertiesResponse.data?.data?.properties ?? [];
          setProperties(
            (items as Array<Record<string, unknown>>).map(normalizeProperty),
          );
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError("We could not load the admin dashboard data.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    if (!metrics) {
      return [];
    }

    const draftCount = properties.filter(
      (property) => property.status === "draft",
    ).length;

    return [
      {
        label: "Total Properties",
        value: metrics.totalProperties.toString(),
        icon: Package,
        color:
          "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      },
      {
        label: "Total Users",
        value: metrics.totalUsers.toString(),
        icon: Users,
        color:
          "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      },
      {
        label: "Published Properties",
        value: metrics.publishedProperties.toString(),
        icon: TrendingUp,
        color:
          "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      },
      {
        label: "Draft Listings",
        value: draftCount.toString(),
        icon: AlertCircle,
        color:
          "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
      },
    ];
  }, [metrics, properties]);

  if (authLoading || isLoading) {
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
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Platform overview and management
            </p>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-border bg-card p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-foreground mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Link
              href={ROUTES.ADMIN_PROPERTIES}
              className="flex items-center justify-between p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all group"
            >
              <div>
                <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  Manage All Properties
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  View, review, and manage all properties on the platform
                </p>
              </div>
              <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </Link>

            <Link
              href={ROUTES.ADMIN_USERS}
              className="flex items-center justify-between p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all group"
            >
              <div>
                <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  Manage Users
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Review user accounts and manage permissions
                </p>
              </div>
              <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Recently Updated Listings
            </h2>
            {properties.length > 0 ? (
              <div className="space-y-3">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-start justify-between gap-3 pb-3 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {property.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {property.location}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-primary">
                      {property.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No listings have been loaded yet.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
