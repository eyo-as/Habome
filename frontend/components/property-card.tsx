'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, DollarSign, Bed, Bath } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/helpers'
import { ROUTES } from '@/lib/constants'
import type { Property } from '@/lib/types'

interface PropertyCardProps {
  property: Property
  onFavoriteToggle?: (propertyId: string, isFavorited: boolean) => void
  isFavorited?: boolean
  showOwner?: boolean
}

export function PropertyCard({
  property,
  onFavoriteToggle,
  isFavorited = false,
  showOwner = false,
}: PropertyCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onFavoriteToggle?.(property.id, !isFavorited)
  }

  return (
    <Link href={ROUTES.PROPERTY(property.id)}>
      <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg hover:border-primary/50">
        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          {property.images[0] ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              <span className="text-sm">No image</span>
            </div>
          )}

          {/* Favorite Button */}
          {onFavoriteToggle && (
            <button
              onClick={handleFavoriteClick}
              className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-md transition-all hover:bg-white dark:bg-black/50 dark:hover:bg-black"
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                size={20}
                className={cn(isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground')}
              />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          {/* Price */}
          <div className="flex items-center gap-1 text-lg font-semibold text-primary">
            <DollarSign size={18} />
            <span>{formatPrice(property.price)}</span>
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 font-semibold text-foreground transition-colors group-hover:text-primary">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin size={16} />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          {/* Features */}
          {(property.bedrooms || property.bathrooms || property.squareFeet) && (
            <div className="flex flex-wrap gap-3 border-t border-border pt-2 text-xs text-muted-foreground">
              {property.bedrooms !== undefined && (
                <div className="flex items-center gap-1">
                  <Bed size={14} />
                  <span>{property.bedrooms} Bed</span>
                </div>
              )}
              {property.bathrooms !== undefined && (
                <div className="flex items-center gap-1">
                  <Bath size={14} />
                  <span>{property.bathrooms} Bath</span>
                </div>
              )}
              {property.squareFeet !== undefined && (
                <div className="text-xs">
                  <span>{property.squareFeet.toLocaleString()} sqft</span>
                </div>
              )}
            </div>
          )}

          {/* Owner Info */}
          {showOwner && property.owner && (
            <div className="border-t border-border pt-2 text-xs text-muted-foreground">
              <span>By {property.owner.name || property.owner.email}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
