'use client'

import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { PRICE_RANGES, BEDROOM_OPTIONS } from '@/lib/constants'
import { buildQueryString } from '@/lib/helpers'
import type { PropertyFilter } from '@/lib/types'

interface SearchFilterBarProps {
  onFilterChange: (filters: PropertyFilter) => void
  initialFilters?: PropertyFilter
}

export function SearchFilterBar({ onFilterChange, initialFilters = {} }: SearchFilterBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState(initialFilters.search || '')
  const [priceRange, setPriceRange] = useState(0)
  const [bedrooms, setBedrooms] = useState<number | undefined>(initialFilters.bedrooms)
  const [location, setLocation] = useState(initialFilters.location || '')

  const handleSearch = (value: string) => {
    setSearch(value)
    applyFilters({ search: value, bedrooms, location, ...getPriceRange(priceRange) })
  }

  const handlePriceChange = (index: number) => {
    setPriceRange(index)
    applyFilters({ search, bedrooms, location, ...getPriceRange(index) })
  }

  const handleBedroomChange = (value: number | undefined) => {
    setBedrooms(value)
    applyFilters({ search, bedrooms: value, location, ...getPriceRange(priceRange) })
  }

  const handleLocationChange = (value: string) => {
    setLocation(value)
    applyFilters({ search, bedrooms, location: value, ...getPriceRange(priceRange) })
  }

  const applyFilters = (filters: PropertyFilter) => {
    onFilterChange(filters)
  }

  const resetFilters = () => {
    setSearch('')
    setPriceRange(0)
    setBedrooms(undefined)
    setLocation('')
    onFilterChange({})
  }

  const getPriceRange = (index: number) => {
    const range = PRICE_RANGES[index]
    return {
      minPrice: range.min,
      maxPrice: range.max === Infinity ? undefined : range.max,
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, description, or location..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
          aria-label="Toggle filters"
        >
          <SlidersHorizontal size={18} />
          <span className="hidden sm:inline text-sm font-medium">Filters</span>
        </button>
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Price Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                {PRICE_RANGES.map((range, index) => (
                  <option key={index} value={index}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Bedrooms Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Bedrooms</label>
              <select
                value={bedrooms ?? ''}
                onChange={(e) => handleBedroomChange(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                {BEDROOM_OPTIONS.map((option, index) => (
                  <option key={index} value={option.value ?? ''}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Location</label>
              <input
                type="text"
                placeholder="City, state, or area..."
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors text-sm font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
