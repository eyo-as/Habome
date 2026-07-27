import { notFound } from "next/navigation";
import { PropertyDetailClient } from "@/components/property-detail-client";
import { normalizeProperty } from "@/lib/property-utils";
import type { Property } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getProperty(id: string): Promise<Property> {
  const res = await fetch(`${API_URL}/properties/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error("Failed to load property");
  }

  const payload = await res.json();
  const property = normalizeProperty(payload?.data?.property ?? {});

  if (!property?.id) {
    notFound();
  }

  return property;
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);
  return <PropertyDetailClient property={property} />;
}
