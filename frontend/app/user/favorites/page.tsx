'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Heart, Home } from 'lucide-react'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { PropertyCard } from '@/components/property-card'
import { EmptyState } from '@/components/empty-state'
import { Pagination } from '@/components/pagination'
import { ROUTES, PAGINATION } from '@/lib/constants'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { useToast } from '@/context/toast-context'
import type { Property } from '@/lib/types'

// Mock data - replace with actual API call
const MOCK_FAVORITES: Property[] = [
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
    bathrooms: 2,
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
]

export default function UserFavoritesPage() {
  const { isLoading } = useProtectedRoute('user')
  const { addToast } = useToast()
  const [favorites, setFavorites] = useState<Set<string>>(new Set(MOCK_FAVORITES.map((p) => p.id)))
  const [currentPage, setCurrentPage] = useState(1)

  const handleFavoriteToggle = (propertyId: string, isFavorited: boolean) => {
    const newFavorites = new Set(favorites)
    if (isFavorited) {
      newFavorites.add(propertyId)
      addToast('Added to favorites!', 'success')
    } else {
      newFavorites.delete(propertyId)
      addToast('Removed from favorites.', 'info')
    }
    setFavorites(newFavorites)
  }

  const favoriteProperties = MOCK_FAVORITES.filter((p) => favorites.has(p.id))
  const totalPages = Math.ceil(favoriteProperties.length / PAGINATION.USER_FAVORITES_LIMIT)
  const paginatedFavorites = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGINATION.USER_FAVORITES_LIMIT
    return favoriteProperties.slice(startIdx, startIdx + PAGINATION.USER_FAVORITES_LIMIT)
  }, [currentPage, favoriteProperties])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
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
            <h1 className="text-3xl font-bold text-foreground">Favorite Properties</h1>
            <p className="text-muted-foreground mt-1">
              {favoriteProperties.length} propert{favoriteProperties.length !== 1 ? 'ies' : 'y'} saved
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
                    isFavorited={favorites.has(property.id)}
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
                    setCurrentPage(page)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
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
                label: 'Browse Properties',
                onClick: () => {
                  // In a real app, navigate to home page
                  window.location.href = ROUTES.HOME
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
                Based on your saved properties, you might also like these listings
              </p>
              <div className="text-sm text-muted-foreground">
                <p>Check out more properties in the areas you love</p>
                <Link href={ROUTES.HOME} className="text-primary hover:text-primary/90 font-medium mt-2 inline-block">
                  Explore All Properties →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
