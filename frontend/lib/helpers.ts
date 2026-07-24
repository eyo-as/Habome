import { PROPERTY_STATUS_LABELS, PROPERTY_STATUS_COLORS, ROLE_LABELS } from './constants'
import type { Property, PropertyFilter } from './types'

/**
 * Format price as USD currency
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Format square feet with commas
 */
export function formatSquareFeet(sqft: number): string {
  return new Intl.NumberFormat('en-US').format(sqft)
}

/**
 * Get display label for property status
 */
export function getStatusLabel(status: string): string {
  return PROPERTY_STATUS_LABELS[status] || status
}

/**
 * Get badge classes for property status
 */
export function getStatusColors(status: string): string {
  return PROPERTY_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'
}

/**
 * Get display label for user role
 */
export function getRoleLabel(role: string): string {
  return ROLE_LABELS[role] || role
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * Format date as relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  }

  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value)
    if (interval >= 1) {
      return interval === 1 ? `${interval} ${key} ago` : `${interval} ${key}s ago`
    }
  }

  return 'just now'
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Generate mock ID (for demo purposes)
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain an uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain a lowercase letter')
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain a number')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Build query string from filter object
 */
export function buildQueryString(filters: PropertyFilter): string {
  const params = new URLSearchParams()

  if (filters.search) params.append('search', filters.search)
  if (filters.minPrice !== undefined) params.append('minPrice', String(filters.minPrice))
  if (filters.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice))
  if (filters.bedrooms !== undefined) params.append('bedrooms', String(filters.bedrooms))
  if (filters.location) params.append('location', filters.location)
  if (filters.status) params.append('status', filters.status)

  return params.toString()
}

/**
 * Parse query string to filter object
 */
export function parseQueryString(queryString: string): PropertyFilter {
  const params = new URLSearchParams(queryString)

  return {
    search: params.get('search') || undefined,
    minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
    maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
    bedrooms: params.get('bedrooms') ? Number(params.get('bedrooms')) : undefined,
    location: params.get('location') || undefined,
    status: (params.get('status') as any) || undefined,
  }
}

/**
 * Sort properties by field
 */
export function sortProperties(
  properties: Property[],
  sortBy: 'price-asc' | 'price-desc' | 'newest' | 'oldest'
): Property[] {
  const sorted = [...properties]

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    default:
      return sorted
  }
}

/**
 * Filter properties based on criteria
 */
export function filterProperties(properties: Property[], filters: PropertyFilter): Property[] {
  return properties.filter((property) => {
    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase()
      if (
        !property.title.toLowerCase().includes(search) &&
        !property.description.toLowerCase().includes(search) &&
        !property.location.toLowerCase().includes(search)
      ) {
        return false
      }
    }

    // Price filter
    if (filters.minPrice !== undefined && property.price < filters.minPrice) {
      return false
    }
    if (filters.maxPrice !== undefined && property.price > filters.maxPrice) {
      return false
    }

    // Bedrooms filter
    if (filters.bedrooms !== undefined && (!property.bedrooms || property.bedrooms < filters.bedrooms)) {
      return false
    }

    // Location filter
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false
    }

    // Status filter
    if (filters.status && property.status !== filters.status) {
      return false
    }

    return true
  })
}
