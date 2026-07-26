'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { ROUTES } from '@/lib/constants'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { useToast } from '@/context/toast-context'
import type { Property } from '@/lib/types'

// Mock property data - in a real app, fetch by ID
const MOCK_PROPERTY: Property = {
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
}

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const { isLoading } = useProtectedRoute('owner')
  const { addToast } = useToast()
  const [property] = useState<Property>(MOCK_PROPERTY)
  const [formData, setFormData] = useState({
    title: property.title,
    description: property.description,
    location: property.location,
    price: property.price.toString(),
    bedrooms: property.bedrooms.toString(),
    bathrooms: property.bathrooms.toString(),
    squareFeet: property.squareFeet.toString(),
  })
  const [images, setImages] = useState<string[]>(property.images || [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddImage = () => {
    setImages((prev) => [...prev, ''])
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleImageChange = (index: number, value: string) => {
    setImages((prev) => {
      const newImages = [...prev]
      newImages[index] = value
      return newImages
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Update property:', { ...formData, images, propertyId: params.id })
      addToast('Property updated successfully!', 'success')
      // In a real app, redirect to properties list
    } catch (error) {
      console.error('Error updating property:', error)
      addToast('Failed to update property', 'error')
    } finally {
      setIsSubmitting(false)
    }
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
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <Link
            href={ROUTES.OWNER_PROPERTIES}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            Back to Properties
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Edit Property</h1>
            <p className="text-muted-foreground mt-1">Update the details of your property</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Property Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Luxury Downtown Penthouse"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your property..."
                rows={5}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Downtown, New York"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="2500000"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Grid: Bedrooms, Bathrooms, Square Feet */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="3"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="2"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Square Feet</label>
                <input
                  type="number"
                  name="squareFeet"
                  value={formData.squareFeet}
                  onChange={handleInputChange}
                  placeholder="3500"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-foreground">Property Images</label>
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors text-sm font-medium"
                >
                  <Plus size={16} />
                  Add Image
                </button>
              </div>

              {images.length > 0 ? (
                <div className="space-y-2">
                  {images.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="Image URL or path"
                        className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="px-3 py-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-3">No images added yet</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Link
                href={ROUTES.OWNER_PROPERTIES}
                className="flex-1 py-2.5 rounded-lg border border-border bg-background text-foreground font-semibold hover:bg-muted transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Updating...' : 'Update Property'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
