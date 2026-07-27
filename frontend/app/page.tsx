import { normalizeProperty } from "@/lib/property-utils";
import { HomeClient } from "@/components/home-client";
import type { Property } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getProperties(): Promise<Property[]> {
  const res = await fetch(`${API_URL}/properties?page=1&limit=100`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load properties");
  }

  const payload = await res.json();
  const items = Array.isArray(payload?.data?.properties)
    ? payload.data.properties
    : [];

  return items.map((item: Record<string, unknown>) => normalizeProperty(item));
}

export default async function HomePage() {
  const properties = await getProperties();
  return <HomeClient initialProperties={properties} />;
}
