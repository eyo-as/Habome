'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Eye, Trash2, Shield, AlertCircle } from 'lucide-react'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { StatusBadge } from '@/components/status-badge'
import { Pagination } from '@/components/pagination'
import { formatPrice, formatDate } from '@/lib/helpers'
import { ROUTES, PAGINATION } from '@/lib/constants'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import type { Property } from '@/lib/types'

// Mock data - replace with actual API call
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
    images: [],
    status: 'published',
    ownerId: 'owner1',
    owner: {
      id: 'owner1',
      email: 'owner1@example.com',
      name: 'John Smith',
      role: 'owner',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
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
    images: [],
    status: 'published',
    ownerId: 'owner3',
    owner: {
      id: 'owner3',
      email: 'owner3@example.com',
      name: 'Sarah Johnson',
      role: 'owner',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
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
    images: [],
    status: 'published',
    ownerId: 'owner2',
    owner: {
      id: 'owner2',
      email: 'owner2@example.com',
      name: 'Mike Johnson',
      role: 'owner',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    id: '2',
    title: 'Urban Loft',
    description: 'Modern loft in the heart of the city',
    location: 'Brooklyn, New York',
    price: 895000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1400,
    images: [],
    status: 'draft',
    ownerId: 'owner1',
    owner: {
      id: 'owner1',
      email: 'owner1@example.com',
      name: 'John Smith',
      role: 'owner',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: '6',
    title: 'Lakefront Estate',
    description: 'Stunning lakefront property',
    location: 'Lake Tahoe, California',
    price: 2800000,
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 4200,
    images: [],
    status: 'published',
    ownerId: 'owner3',
    owner: {
      id: 'owner3',
      email: 'owner3@example.com',
      name: 'Sarah Johnson',
      role: 'owner',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '7',
    title: 'Downtown Studio',
    description: 'Modern studio apartment',
    location: 'Seattle, Washington',
    price: 425000,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 600,
    images: [],
    status: 'published',
    ownerId: 'owner2',
    owner: {
      id: 'owner2',
      email: 'owner2@example.com',
      name: 'Mike Johnson',
      role: 'owner',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
  },
  {
    id: '8',
    title: 'Country Manor',
    description: 'Spacious manor on grounds',
    location: 'Countryside, Virginia',
    price: 950000,
    bedrooms: 7,
    bathrooms: 5,
    squareFeet: 6500,
    images: [],
    status: 'published',
    ownerId: 'owner1',
    owner: {
      id: 'owner1',
      email: 'owner1@example.com',
      name: 'John Smith',
      role: 'owner',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '9',
    title: 'Desert Oasis',
    description: 'Luxury home in desert',
    location: 'Scottsdale, Arizona',
    price: 1750000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 3800,
    images: [],
    status: 'archived',
    ownerId: 'owner3',
    owner: {
      id: 'owner3',
      email: 'owner3@example.com',
      name: 'Sarah Johnson',
      role: 'owner',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: '10',
    title: 'Urban Townhouse',
    description: 'Modern townhouse',
    location: 'Washington, DC',
    price: 1200000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 2500,
    images: [],
    status: 'published',
    ownerId: 'owner2',
    owner: {
      id: 'owner2',
      email: 'owner2@example.com',
      name: 'Mike Johnson',
      role: 'owner',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09'),
  },
  {
    id: '11',
    title: 'Forest Cabin',
    description: 'Secluded cabin in forest',
    location: 'Asheville, North Carolina',
    price: 480000,
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 1100,
    images: [],
    status: 'draft',
    ownerId: 'owner1',
    owner: {
      id: 'owner1',
      email: 'owner1@example.com',
      name: 'John Smith',
      role: 'owner',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
  },
  {
    id: '12',
    title: 'Waterfront Condo',
    description: 'Modern condo with views',
    location: 'San Diego, California',
    price: 1550000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1800,
    images: [],
    status: 'published',
    ownerId: 'owner3',
    owner: {
      id: 'owner3',
      email: 'owner3@example.com',
      name: 'Sarah Johnson',
      role: 'owner',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
  },
  {
    id: '13',
    title: 'Historic Brownstone',
    description: 'Restored brownstone',
    location: 'Philadelphia, Pennsylvania',
    price: 780000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 2200,
    images: [],
    status: 'published',
    ownerId: 'owner2',
    owner: {
      id: 'owner2',
      email: 'owner2@example.com',
      name: 'Mike Johnson',
      role: 'owner',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    id: '14',
    title: 'Modern Minimalist',
    description: 'Contemporary minimalist design',
    location: 'Austin, Texas',
    price: 1100000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 2000,
    images: [],
    status: 'published',
    ownerId: 'owner1',
    owner: {
      id: 'owner1',
      email: 'owner1@example.com',
      name: 'John Smith',
      role: 'owner',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
]

export default function AdminPropertiesPage() {
  const { isLoading } = useProtectedRoute('admin')
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(MOCK_PROPERTIES.length / PAGINATION.ADMIN_PROPERTIES_LIMIT)
  const paginatedProperties = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGINATION.ADMIN_PROPERTIES_LIMIT
    return MOCK_PROPERTIES.slice(startIdx, startIdx + PAGINATION.ADMIN_PROPERTIES_LIMIT)
  }, [currentPage])

  const handleDelete = (id: string) => {
    console.log('Delete property:', id)
  }

  const handleReview = (id: string) => {
    console.log('Review property:', id)
  }

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
      <DashboardSidebar role="admin" />

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">All Properties</h1>
            <p className="text-muted-foreground mt-1">Review and manage all properties on the platform</p>
          </div>

          {/* Properties Table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Property</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Owner</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Listed</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProperties.map((property) => (
                    <tr key={property.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{property.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{property.location}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{property.owner?.name}</p>
                          <p className="text-xs text-muted-foreground">{property.owner?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-primary">{formatPrice(property.price)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={property.status} />
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-muted-foreground">{formatDate(property.createdAt)}</p>
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-2 p-4">
              {paginatedProperties.map((property) => (
                <div key={property.id} className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{property.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{property.owner?.name}</p>
                    </div>
                    <StatusBadge status={property.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-primary">{formatPrice(property.price)}</p>
                    <div className="flex gap-1">
                      <Link href={ROUTES.PROPERTY(property.id)} className="p-1.5 hover:bg-muted rounded transition-colors">
                        <Eye size={16} />
                      </Link>
                      <button onClick={() => handleReview(property.id)} className="p-1.5 hover:bg-muted rounded transition-colors">
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
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 md:p-6 border-t border-border">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  totalItems={MOCK_PROPERTIES.length}
                  itemsPerPage={PAGINATION.ADMIN_PROPERTIES_LIMIT}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
