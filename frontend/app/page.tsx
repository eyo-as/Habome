'use client'

import { useState, useMemo } from 'react'
import { SearchFilterBar } from '@/components/search-filter-bar'
import { PropertyCard } from '@/components/property-card'
import { PropertyGridSkeleton } from '@/components/property-skeleton'
import { EmptyState } from '@/components/empty-state'
import { Pagination } from '@/components/pagination'
import { filterProperties, sortProperties } from '@/lib/helpers'
import { PAGINATION } from '@/lib/constants'
import type { Property, PropertyFilter } from '@/lib/types'

// Mock data - replace with actual API calls
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Penthouse',
    description: 'Stunning luxury penthouse with panoramic city views',
    location: 'Downtown, New York',
    price: 2500000,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 3500,
    images: ['/api/placeholder?w=400&h=300&text=Penthouse'],
    status: 'published',
    ownerId: 'owner1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Cozy Suburban Home',
    description: 'Perfect family home in a quiet neighborhood',
    location: 'Suburbs, New York',
    price: 650000,
    bedrooms: 4,
    bathrooms: 2,
    squareFeet: 2200,
    images: ['/api/placeholder?w=400&h=300&text=Suburban'],
    status: 'published',
    ownerId: 'owner2',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    title: 'Beachfront Villa',
    description: 'Luxurious villa right on the beach with private access',
    location: 'Miami Beach, Florida',
    price: 3500000,
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 4800,
    images: ['/api/placeholder?w=400&h=300&text=Beachfront'],
    status: 'published',
    ownerId: 'owner3',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '4',
    title: 'Urban Loft',
    description: 'Modern loft in the heart of the city',
    location: 'Brooklyn, New York',
    price: 895000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1400,
    images: ['/api/placeholder?w=400&h=300&text=Urban+Loft'],
    status: 'published',
    ownerId: 'owner1',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: '5',
    title: 'Mountain Retreat',
    description: 'Peaceful mountain cabin with stunning views',
    location: 'Aspen, Colorado',
    price: 1200000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 2000,
    images: ['/api/placeholder?w=400&h=300&text=Mountain'],
    status: 'published',
    ownerId: 'owner2',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    id: '6',
    title: 'Historic Victorian',
    description: 'Charming restored Victorian mansion',
    location: 'Boston, Massachusetts',
    price: 1850000,
    bedrooms: 6,
    bathrooms: 3,
    squareFeet: 5000,
    images: ['/api/placeholder?w=400&h=300&text=Victorian'],
    status: 'published',
    ownerId: 'owner3',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '7',
    title: 'Lakefront Estate',
    description: 'Stunning lakefront property with private dock',
    location: 'Lake Tahoe, California',
    price: 2800000,
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 4200,
    images: ['/api/placeholder?w=400&h=300&text=Lakefront'],
    status: 'published',
    ownerId: 'owner1',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '8',
    title: 'Downtown Studio',
    description: 'Modern studio apartment in city center',
    location: 'Seattle, Washington',
    price: 425000,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 600,
    images: ['/api/placeholder?w=400&h=300&text=Studio'],
    status: 'published',
    ownerId: 'owner2',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
  },
  {
    id: '9',
    title: 'Country Manor',
    description: 'Spacious manor on sprawling grounds',
    location: 'Countryside, Virginia',
    price: 950000,
    bedrooms: 7,
    bathrooms: 5,
    squareFeet: 6500,
    images: ['/api/placeholder?w=400&h=300&text=Manor'],
    status: 'published',
    ownerId: 'owner3',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '10',
    title: 'Desert Oasis',
    description: 'Luxury home in desert landscape',
    location: 'Scottsdale, Arizona',
    price: 1750000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 3800,
    images: ['/api/placeholder?w=400&h=300&text=Desert'],
    status: 'published',
    ownerId: 'owner1',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: '11',
    title: 'Urban Townhouse',
    description: 'Modern townhouse with rooftop terrace',
    location: 'Washington, DC',
    price: 1200000,
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 2500,
    images: ['/api/placeholder?w=400&h=300&text=Townhouse'],
    status: 'published',
    ownerId: 'owner2',
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09'),
  },
  {
    id: '12',
    title: 'Forest Cabin',
    description: 'Secluded cabin surrounded by forest',
    location: 'Asheville, North Carolina',
    price: 480000,
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 1100,
    images: ['/api/placeholder?w=400&h=300&text=Cabin'],
    status: 'published',
    ownerId: 'owner3',
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
  },
  {
    id: '13',
    title: 'Waterfront Condo',
    description: 'Modern condo with bay views',
    location: 'San Diego, California',
    price: 1550000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1800,
    images: ['/api/placeholder?w=400&h=300&text=Condo'],
    status: 'published',
    ownerId: 'owner1',
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
  },
  {
    id: '14',
    title: 'Historic Brownstone',
    description: 'Restored brownstone in historic district',
    location: 'Philadelphia, Pennsylvania',
    price: 780000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 2200,
    images: ['/api/placeholder?w=400&h=300&text=Brownstone'],
    status: 'published',
    ownerId: 'owner2',
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    id: '15',
    title: 'Modern Minimalist',
    description: 'Contemporary design minimalist home',
    location: 'Austin, Texas',
    price: 1100000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 2000,
    images: ['/api/placeholder?w=400&h=300&text=Minimalist'],
    status: 'published',
    ownerId: 'owner3',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
]

export default function HomePage() {
  const [filters, setFilters] = useState<PropertyFilter>({})
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest' | 'oldest'>('newest')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [isLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProperties = useMemo(() => {
    let result = filterProperties(MOCK_PROPERTIES, filters)
    result = sortProperties(result, sortBy)
    return result
  }, [filters, sortBy])

  const totalPages = Math.ceil(filteredProperties.length / PAGINATION.HOME_PROPERTIES_LIMIT)
  const paginatedProperties = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGINATION.HOME_PROPERTIES_LIMIT
    return filteredProperties.slice(startIdx, startIdx + PAGINATION.HOME_PROPERTIES_LIMIT)
  }, [currentPage, filteredProperties])

  const handleFavoriteToggle = (propertyId: string, isFavorited: boolean) => {
    const newFavorites = new Set(favorites)
    if (isFavorited) {
      newFavorites.add(propertyId)
    } else {
      newFavorites.delete(propertyId)
    }
    setFavorites(newFavorites)
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

          {/* Search and Filter */}
          <SearchFilterBar onFilterChange={setFilters} />
        </div>
      </section>

      {/* Main Content */}
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

          {/* Sort Dropdown */}
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

        {/* Properties Grid */}
        {isLoading ? (
          <PropertyGridSkeleton count={12} />
        ) : filteredProperties.length > 0 ? (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  totalItems={filteredProperties.length}
                  itemsPerPage={PAGINATION.HOME_PROPERTIES_LIMIT}
                />
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No properties found"
            description="Try adjusting your search criteria to find more properties"
            type="search"
            action={{
              label: 'Clear Filters',
              onClick: () => {
                setFilters({})
                setCurrentPage(1)
              },
            }}
          />
        )}
      </section>
    </div>
  )
}
