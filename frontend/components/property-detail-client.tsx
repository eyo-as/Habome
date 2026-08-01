"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  ArrowLeft,
  Heart,
  Share2,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/helpers";
import { getPropertyDisplayImages } from "@/lib/property-utils";
import { ROUTES } from "@/lib/constants";
import { ContactOwnerModal } from "@/components/contact-owner-modal";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";
import { favoriteAPI } from "@/services/api";
import type { Property } from "@/lib/types";

interface PropertyDetailClientProps {
  property: Property;
}

export function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isFavoriteUpdating, setIsFavoriteUpdating] = useState(false);

  const displayImages = getPropertyDisplayImages(property);
  const selectedImage =
    displayImages[Math.min(selectedImageIndex, displayImages.length - 1)];

  useEffect(() => {
    const loadFavoriteStatus = async () => {
      if (!user || user.role !== "user") {
        setIsFavorited(false);
        return;
      }

      try {
        const response = await favoriteAPI.getAll();
        const favoriteIds = (response.data?.data?.favorites ?? [])
          .map((fav: Record<string, unknown>) => {
            const propertyRef = fav.propertyId as
              | Record<string, unknown>
              | undefined;
            return propertyRef
              ? String(propertyRef._id || propertyRef.id || "")
              : "";
          })
          .filter(Boolean);

        setIsFavorited(favoriteIds.includes(property.id));
      } catch {
        setIsFavorited(false);
      }
    };

    loadFavoriteStatus();
  }, [property.id, user]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      addToast("Please log in to save favorites.", "info");
      router.push(ROUTES.LOGIN);
      return;
    }

    if (user.role !== "user") {
      addToast("Only regular users can save favorites.", "error");
      return;
    }

    setIsFavoriteUpdating(true);

    try {
      if (isFavorited) {
        await favoriteAPI.remove(property.id);
        setIsFavorited(false);
        addToast("Removed from favorites.", "info");
      } else {
        await favoriteAPI.add(property.id);
        setIsFavorited(true);
        addToast("Added to favorites!", "success");
      }
    } catch {
      addToast("Unable to update favorite. Please try again.", "error");
    } finally {
      setIsFavoriteUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2 py-4 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Properties
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative h-96 w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={selectedImage}
                  alt={`${property.title} - Image ${selectedImageIndex + 1}`}
                  fill
                  className="h-full w-full object-cover"
                  priority
                />
                <button
                  onClick={handleFavoriteToggle}
                  disabled={isFavoriteUpdating}
                  className="absolute right-4 top-4 rounded-full bg-white/90 p-3 shadow-lg transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-70 dark:bg-black/50 dark:hover:bg-black"
                  aria-label={
                    isFavorited ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <Heart
                    size={24}
                    className={
                      isFavorited
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground"
                    }
                  />
                </button>
              </div>

              {/* Thumbnail Grid */}
              {displayImages.length > 1 && (
                <div className="grid gap-2 grid-cols-4 sm:grid-cols-5">
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-20 overflow-hidden rounded-lg border-2 transition-all ${
                        index === selectedImageIndex
                          ? "border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="space-y-6 rounded-lg border border-border bg-card p-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={18} />
                  <span className="text-lg">{property.location}</span>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid gap-4 grid-cols-3 border-y border-border py-4">
                {property.bedrooms !== undefined && (
                  <div className="text-center">
                    <div className="flex justify-center mb-1">
                      <Bed size={24} className="text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {property.bedrooms}
                    </p>
                    <p className="text-xs text-muted-foreground">Bedrooms</p>
                  </div>
                )}
                {property.bathrooms !== undefined && (
                  <div className="text-center">
                    <div className="flex justify-center mb-1">
                      <Bath size={24} className="text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {property.bathrooms}
                    </p>
                    <p className="text-xs text-muted-foreground">Bathrooms</p>
                  </div>
                )}
                {property.squareFeet !== undefined && (
                  <div className="text-center">
                    <div className="flex justify-center mb-1">
                      <Square size={24} className="text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {property.squareFeet.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Square Feet</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  About This Property
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Share */}
              <button className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
                <Share2 size={18} />
                <span className="text-sm font-medium">Share This Property</span>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 h-fit space-y-4">
            {/* Price Card */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">List Price</p>
                <p className="text-4xl font-bold text-primary">
                  {formatPrice(property.price)}
                </p>
              </div>

              <button
                onClick={() => setIsContactModalOpen(true)}
                className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                Contact Owner
              </button>

              <button className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-semibold hover:bg-muted transition-colors">
                Schedule Viewing
              </button>
            </div>

            {/* Owner Card */}
            {property.owner && (
              <div className="rounded-lg border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground mb-3">Listed By</p>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-foreground">
                      {property.owner.name || property.owner.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Property Owner
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Card */}
            <div className="rounded-lg border border-border bg-card p-6 text-xs text-muted-foreground space-y-2">
              <p>
                <span className="font-medium text-foreground">Listed:</span>{" "}
                {formatDate(property.createdAt)}
              </p>
              <p>
                <span className="font-medium text-foreground">Status:</span>{" "}
                {property.status}
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Property ID:
                </span>{" "}
                {property.id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Owner Modal */}
      {property.owner && (
        <ContactOwnerModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          owner={property.owner}
          propertyTitle={property.title}
          propertyId={property.id}
        />
      )}
    </div>
  );
}
