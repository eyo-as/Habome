"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, Search, TrendingUp } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ROUTES } from "@/lib/constants";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { favoriteAPI, propertyAPI } from "@/services/api";
import { normalizeProperty } from "@/lib/property-utils";
import type { Property } from "@/lib/types";

export default function UserDashboardPage() {
  const { isLoading: authLoading, user } = useProtectedRoute("user");
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [recommendations, setRecommendations] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        const [favoritesResponse, propertiesResponse] = await Promise.all([
          favoriteAPI.getAll(),
          propertyAPI.getAll({ page: 1, limit: 3 }),
        ]);

        if (isMounted) {
          const favoriteItems = (favoritesResponse.data?.data?.favorites ?? [])
            .map((entry: Record<string, unknown>) => {
              const property = entry.propertyId;
              return property && typeof property === "object"
                ? normalizeProperty(property as Record<string, unknown>)
                : null;
            })
            .filter(Boolean) as Property[];

          const recommendationItems = (
            propertiesResponse.data?.data?.properties ?? []
          ).map((entry: Record<string, unknown>) => normalizeProperty(entry));

          setFavorites(favoriteItems);
          setRecommendations(recommendationItems);
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError("We could not load your dashboard right now.");
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

  const stats = useMemo(
    () => [
      {
        label: "Favorites",
        value: favorites.length.toString(),
        icon: Heart,
        color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
      },
      {
        label: "Saved Searches",
        value: "3",
        icon: Search,
        color:
          "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      },
      {
        label: "Watchlist",
        value: favorites.length > 0 ? "Active" : "Empty",
        icon: TrendingUp,
        color:
          "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      },
    ],
    [favorites.length],
  );

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
      <DashboardSidebar role="user" />

      <main className="flex-1 mt-16 md:mt-0 px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name || "there"}! Here&apos;s your activity
              overview.
            </p>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
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

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Link
              href={ROUTES.USER_FAVORITES}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all group"
            >
              <div>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  View Favorites
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Browse your saved properties
                </p>
              </div>
              <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </Link>

            <Link
              href={ROUTES.HOME}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all group"
            >
              <div>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  Browse Properties
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Discover new listings
                </p>
              </div>
              <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Based on Your Activity
            </h2>
            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-start gap-3 pb-3 border-b border-border last:border-0"
                  >
                    <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {property.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {property.location}
                      </p>
                    </div>
                    <p className="font-semibold text-primary whitespace-nowrap">
                      {property.price}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recommendations available right now.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-border bg-blue-50 dark:bg-blue-950/30 p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              💡 Pro Tip
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Save your favorite properties to create a personalized watchlist.
              You&apos;ll get notified when the owner updates property details
              or new similar properties are listed.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
