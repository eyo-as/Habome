"use client"

import { useMemo, useState } from "react"
import { SearchFilterBar } from "@/components/search-filter-bar"
import { PropertyCard } from "@/components/property-card"
import { EmptyState } from "@/components/empty-state"
import { Pagination } from "@/components/pagination"
import { filterProperties, sortProperties } from "@/lib/helpers"
import { PAGINATION } from "@/lib/constants"
import type { Property, PropertyFilter } from "@/lib/types"

interface HomeClientProps {
  initialProperties: Property[]
}

export function HomeClient({ initialProperties }: HomeClientProps) {
  const [filters, setFilters] = useState<PropertyFilter>({})
  const [sortBy, setSortBy] = useState<
    "price-asc" | "price-desc" | "newest" | "oldest"
  >("newest")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [properties] = useState<Property[]>(initialProperties)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProperties = useMemo(() => {
    let result = filterProperties(properties, filters)
    return sortProperties(result, sortBy)
  }, [filters, properties, sortBy])

  const totalPages = Math.ceil(
    filteredProperties.length / PAGINATION.HOME_PROPERTIES_LIMIT,
  )

  const paginatedProperties = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGINATION.HOME_PROPERTIES_LIMIT
    return filteredProperties.slice(
      startIdx,
      startIdx + PAGINATION.HOME_PROPERTIES_LIMIT,
    )
  }, [currentPage, filteredProperties])

  const handleFavoriteToggle = (propertyId: string, isFavorited: boolean) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (isFavorited) {
        next.add(propertyId)
      } else {
        next.delete(propertyId)
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-card to-background py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-2">
              Find Your Perfect Property
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse thousands of listings from trusted property owners
            </p>
          </div>

          <SearchFilterBar onFilterChange={setFilters} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {filteredProperties.length} Properties Available
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Showing properties that match your criteria
            </p>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {properties.length === 0 ? (
          <EmptyState
            title="No properties found"
            description="Try adjusting your search criteria to find more properties"
            type="search"
            action={{
              label: "Clear Filters",
              onClick: () => {
                setFilters({})
                setCurrentPage(1)
              },
            }}
          />
        ) : (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onFavoriteToggle={handleFavoriteToggle}
                  isFavorited={favorites.has(property.id)}
                  showOwner
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                  totalItems={filteredProperties.length}
                  itemsPerPage={PAGINATION.HOME_PROPERTIES_LIMIT}
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
