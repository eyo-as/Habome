import type { Property } from "@/lib/types";

export function normalizeProperty(item: Record<string, unknown>): Property {
  const ownerId = item.ownerId as Record<string, unknown> | undefined;
  const owner =
    ownerId && typeof ownerId === "object"
      ? {
          id: String(ownerId._id || ownerId.id || ""),
          name: typeof ownerId.name === "string" ? ownerId.name : undefined,
          email: typeof ownerId.email === "string" ? ownerId.email : "",
          role: "owner" as const,
          createdAt: ownerId.createdAt
            ? new Date(String(ownerId.createdAt))
            : new Date(),
        }
      : undefined;

  return {
    id: String(item._id || item.id || ""),
    title: typeof item.title === "string" ? item.title : "",
    description: typeof item.description === "string" ? item.description : "",
    location: typeof item.location === "string" ? item.location : "",
    price: Number(item.price || 0),
    bedrooms: typeof item.bedrooms === "number" ? item.bedrooms : undefined,
    bathrooms: typeof item.bathrooms === "number" ? item.bathrooms : undefined,
    squareFeet:
      typeof item.squareFeet === "number" ? item.squareFeet : undefined,
    images: Array.isArray(item.images)
      ? item.images.filter((img): img is string => typeof img === "string")
      : [],
    status: (item.status as Property["status"]) || "published",
    ownerId:
      ownerId && typeof ownerId === "object"
        ? String(ownerId._id || ownerId.id || "")
        : String(item.ownerId || ""),
    owner,
    createdAt: item.createdAt ? new Date(String(item.createdAt)) : new Date(),
    updatedAt: item.updatedAt ? new Date(String(item.updatedAt)) : new Date(),
  };
}

export function getPropertyDisplayImages(property: Property) {
  return property.images.length > 0
    ? property.images
    : ["/api/placeholder?w=800&h=600&text=Property"];
}
