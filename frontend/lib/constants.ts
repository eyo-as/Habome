// User roles
export const USER_ROLES = {
  OWNER: 'owner',
  USER: 'user',
  ADMIN: 'admin',
} as const

export const ROLE_LABELS: Record<string, string> = {
  owner: 'Property Owner',
  user: 'Buyer',
  admin: 'Administrator',
}

// Property statuses
export const PROPERTY_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const

export const PROPERTY_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
}

export const PROPERTY_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  archived: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

// Routes
export const ROUTES = {
  HOME: '/',
  PROPERTY: (id: string) => `/property/${id}`,
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  OWNER: '/owner',
  OWNER_PROPERTIES: '/owner/properties',
  OWNER_CREATE_PROPERTY: '/owner/create',
  OWNER_EDIT_PROPERTY: (id: string) => `/owner/edit/${id}`,
  OWNER_SETTINGS: '/owner/settings',
  ADMIN: '/admin',
  ADMIN_PROPERTIES: '/admin/properties',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
  USER: '/user',
  USER_FAVORITES: '/user/favorites',
  USER_SETTINGS: '/user/settings',
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 8, // Mobile-optimized default: 6-10 items per page (8 is sweet spot)
  ADMIN_USERS_LIMIT: 8,
  ADMIN_PROPERTIES_LIMIT: 6,
  OWNER_PROPERTIES_LIMIT: 6,
  USER_FAVORITES_LIMIT: 8,
  HOME_PROPERTIES_LIMIT: 8,
  MAX_LIMIT: 100,
  PAGE_SIZES: [6, 8, 12, 24],
} as const

// Price ranges for filters
export const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: Infinity },
  { label: 'Under $500k', min: 0, max: 500000 },
  { label: '$500k - $1M', min: 500000, max: 1000000 },
  { label: '$1M - $2M', min: 1000000, max: 2000000 },
  { label: '$2M - $5M', min: 2000000, max: 5000000 },
  { label: 'Over $5M', min: 5000000, max: Infinity },
] as const

// Bedroom options for filters
export const BEDROOM_OPTIONS = [
  { label: 'Any', value: undefined },
  { label: '1+', value: 1 },
  { label: '2+', value: 2 },
  { label: '3+', value: 3 },
  { label: '4+', value: 4 },
  { label: '5+', value: 5 },
] as const

// Navigation labels
export const NAV_LABELS = {
  HOME: 'Home',
  BROWSE: 'Browse Properties',
  MY_PROPERTIES: 'My Properties',
  DASHBOARD: 'Dashboard',
  FAVORITES: 'Favorites',
  PROFILE: 'Profile',
  LOGOUT: 'Logout',
  LOGIN: 'Login',
  REGISTER: 'Sign Up',
} as const

// Messages
export const MESSAGES = {
  NO_PROPERTIES: 'No properties found. Try adjusting your filters.',
  NO_FAVORITES: 'You haven&apos;t saved any favorites yet.',
  PROPERTY_CREATED: 'Property created successfully!',
  PROPERTY_UPDATED: 'Property updated successfully!',
  PROPERTY_DELETED: 'Property deleted successfully!',
  PROPERTY_PUBLISHED: 'Property published successfully!',
  FAVORITE_ADDED: 'Added to favorites!',
  FAVORITE_REMOVED: 'Removed from favorites.',
  ERROR_LOADING: 'Error loading data. Please try again.',
  UNAUTHORIZED: 'You don&apos;t have permission to access this.',
} as const
