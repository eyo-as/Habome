'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Edit2, Trash2, Eye, Archive, PlusSquare } from 'lucide-react'
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
    images: [],
    status: 'draft',
    ownerId: 'owner1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
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
    images: [],
    status: 'published',
    ownerId: 'owner1',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: '5',
    title: 'Beachfront Villa',
    description: 'Luxury villa with direct beach access',
    location: 'Miami, Florida',
    price: 1800000,
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 4200,
    images: [],
    status: 'published',
    ownerId: 'owner1',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '6',
    title: 'Mountain Cabin',
    description: 'Cozy cabin perfect for weekend getaway',
    location: 'Aspen, Colorado',
    price: 750000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    images: [],
    status: 'published',
    ownerId: 'owner1',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: '7',
    title: 'Historic Brownstone',
    description: 'Charming brownstone in a historic neighborhood',
    location: 'Boston, Massachusetts',
    price: 950000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 2100,
    images: [],
    status: 'published',
    ownerId: 'owner1',
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09'),
  },
  {
    id: '8',
    title: 'Modern Tech House',
    description: 'Smart home with latest technology',
    location: 'San Francisco, California',
    price: 2200000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 3100,
    images: [],
    status: 'draft',
    ownerId: 'owner1',
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
  },
  {
    id: '9',
    title: 'Lakefront Estate',
    description: 'Stunning lakefront property with private dock',
    location: 'Lake Tahoe, California',
    price: 3500000,
    bedrooms: 6,
    bathrooms: 5,
    squareFeet: 5000,
    images: [],
    status: 'published',
    ownerId: 'owner1',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '10',
    title: 'Urban Studio Apartment',
    description: 'Trendy studio in the city center',
    location: 'Chicago, Illinois',
    price: 450000,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 650,
    images: [],
    status: 'published',
    ownerId: 'owner1',
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
  },
  {
    id: '11',
    title: 'Country Estate',
    description: 'Spacious estate on 50 acres',
    location: 'Nashville, Tennessee',
    price: 1200000,
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 4500,
    images: [],
    status: 'published',
    ownerId: 'owner1',
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    id: '12',
    title: 'Riverside Bungalow',
    description: 'Charming bungalow with river views',
    location: 'Portland, Oregon',
    price: 580000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    images: [],
    status: 'archived',
    ownerId: 'owner1',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
]

export default function OwnerPropertiesPage() {
  const { isLoading } = useProtectedRoute('owner')
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(MOCK_PROPERTIES.length / PAGINATION.OWNER_PROPERTIES_LIMIT)
  const paginatedProperties = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGINATION.OWNER_PROPERTIES_LIMIT
    return MOCK_PROPERTIES.slice(startIdx, startIdx + PAGINATION.OWNER_PROPERTIES_LIMIT)
  }, [currentPage])

  const handleDelete = (id: string) => {
    console.log('Delete property:', id)
  }

  const handleArchive = (id: string) => {
    console.log('Archive property:', id)
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
      <DashboardSidebar role="owner" />

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Properties</h1>
              <p className="text-muted-foreground mt-1">Manage and view all your property listings</p>
            </div>
            <Link
              href={ROUTES.OWNER_CREATE_PROPERTY}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              <PlusSquare size={20} />
              <span>New Property</span>
            </Link>
          </div>

          {/* Properties Table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProperties.map((property) => (
                    <tr key={property.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{property.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-muted-foreground">{property.location}</p>
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
                          <Link
                            href={ROUTES.OWNER_EDIT_PROPERTY(property.id)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <button
                            onClick={() => handleArchive(property.id)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                            title="Archive"
                          >
                            <Archive size={18} />
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
                      <p className="text-xs text-muted-foreground mt-1">{property.location}</p>
                    </div>
                    <StatusBadge status={property.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-primary">{formatPrice(property.price)}</p>
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
                      <button onClick={() => handleArchive(property.id)} className="p-1.5 hover:bg-muted rounded transition-colors">
                        <Archive size={16} />
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
                  itemsPerPage={PAGINATION.OWNER_PROPERTIES_LIMIT}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
