import { normalizeProperty } from "@/lib/property-utils";
import { HomeClient } from "@/components/home-client";
import type { Property } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not configured. Set the backend URL in Vercel environment variables.",
  );
}

async function getProperties(): Promise<Property[]> {
  let res: Response;

  try {
    res = await fetch(`${API_URL}/properties?page=1&limit=100`, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("Property fetch failed:", error, "API_URL=", API_URL);
    throw new Error("Failed to load properties");
  }

  if (!res.ok) {
    const body = await res.text();
    console.error(
      `Property fetch returned ${res.status} ${res.statusText}: ${body}`,
    );
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
