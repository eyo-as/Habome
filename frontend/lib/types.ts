// User types
export type UserRole = "owner" | "user" | "admin";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt?: Date | string;
}

// Property types
export type PropertyStatus = "draft" | "published" | "archived" | "disabled";

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  images: string[];
  status: PropertyStatus;
  ownerId: string;
  owner?: User;
  createdAt: Date;
  updatedAt: Date;
}

// Favorite types
export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  property?: Property;
  createdAt: Date;
}

// Contact message types
export interface ContactMessage {
  id: string;
  senderId?: User | string;
  ownerId?: string;
  propertyId?: Property | string;
  message: string;
  createdAt?: Date | string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Search/Filter types
export interface PropertyFilter {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  location?: string;
  status?: PropertyStatus;
}
