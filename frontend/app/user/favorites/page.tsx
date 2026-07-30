"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { PropertyCard } from "@/components/property-card";
import { EmptyState } from "@/components/empty-state";
import { Pagination } from "@/components/pagination";
import { ROUTES, PAGINATION } from "@/lib/constants";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { useToast } from "@/context/toast-context";
import { favoriteAPI } from "@/services/api";
import { normalizeProperty } from "@/lib/property-utils";
import type { Property } from "@/lib/types";

interface FavoriteEntry {
  propertyId: Record<string, unknown> | null;
}

export default function UserFavoritesPage() {
  const { isLoading } = useProtectedRoute("user");
  const { addToast } = useToast();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = async () => {
    setIsLoadingFavorites(true);
    setError(null);

    try {
      const response = await favoriteAPI.getAll();
      const favoriteEntries: FavoriteEntry[] =
        response.data?.data?.favorites ?? [];
      const favoriteItems = favoriteEntries
        .map((entry) => {
          const property = entry.propertyId;
          return property && typeof property === "object"
            ? normalizeProperty(property)
            : null;
        })
        .filter(Boolean) as Property[];

      setFavorites(favoriteItems);
    } catch {
      setError("Unable to load favorites. Please try again.");
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleFavoriteToggle = async (
    propertyId: string,
    isFavorited: boolean,
  ) => {
    try {
      if (isFavorited) {
        await favoriteAPI.add(propertyId);
        addToast("Added to favorites!", "success");
      } else {
        await favoriteAPI.remove(propertyId);
        addToast("Removed from favorites.", "info");
      }

      await loadFavorites();
    } catch {
      addToast("Could not update favorites. Please try again.", "error");
    }
  };

  const favoriteProperties = favorites;
  const totalPages = Math.ceil(
    favoriteProperties.length / PAGINATION.USER_FAVORITES_LIMIT,
  );
  const paginatedFavorites = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGINATION.USER_FAVORITES_LIMIT;
    return favoriteProperties.slice(
      startIdx,
      startIdx + PAGINATION.USER_FAVORITES_LIMIT,
    );
  }, [currentPage, favoriteProperties]);

  if (isLoading || isLoadingFavorites) {
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
      {/* Sidebar */}
      <DashboardSidebar role="user" />

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Favorite Properties
            </h1>
            <p className="text-muted-foreground mt-1">
              {favoriteProperties.length} propert
              {favoriteProperties.length !== 1 ? "ies" : "y"} saved
            </p>
          </div>

          {/* Favorites Grid or Empty State */}
          {favoriteProperties.length > 0 ? (
            <>
              {/* Filter/Sort Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <select className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm">
                    <option value="newest">Newest Saved</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Properties Grid */}
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedFavorites.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onFavoriteToggle={handleFavoriteToggle}
                    isFavorited={true}
                    showOwner
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  totalItems={favoriteProperties.length}
                  itemsPerPage={PAGINATION.USER_FAVORITES_LIMIT}
                />
              )}
            </>
          ) : (
            <EmptyState
              title="No Favorites Yet"
              description="Start exploring properties and add your favorites to keep track of them!"
              type="favorites"
              action={{
                label: "Browse Properties",
                onClick: () => {
                  // In a real app, navigate to home page
                  window.location.href = ROUTES.HOME;
                },
              }}
            />
          )}

          {/* Recommendations Section */}
          {favoriteProperties.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Heart size={20} className="text-red-500" />
                Similar to Your Favorites
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Based on your saved properties, you might also like these
                listings
              </p>
              <div className="text-sm text-muted-foreground">
                <p>Check out more properties in the areas you love</p>
                <Link
                  href={ROUTES.HOME}
                  className="text-primary hover:text-primary/90 font-medium mt-2 inline-block"
                >
                  Explore All Properties →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
