"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronUp, UploadCloud, X, Star } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ROUTES } from "@/lib/constants";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { useToast } from "@/context/toast-context";
import { propertyAPI, uploadAPI } from "@/services/api";
import { normalizeProperty } from "@/lib/property-utils";
import type { Property } from "@/lib/types";

type ImageItem =
  | {
      id: string;
      type: "existing";
      url: string;
    }
  | {
      id: string;
      type: "file";
      file: File;
      previewUrl: string;
    };

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { isLoading } = useProtectedRoute("owner");
  const router = useRouter();
  const { addToast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoadingProperty, setIsLoadingProperty] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
  });
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const previewUrlsRef = useRef<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProperty = async () => {
      try {
        const resolvedParams = await params;
        const response = await propertyAPI.getById(resolvedParams.id);
        const rawProperty = response.data?.data?.property as
          | Record<string, unknown>
          | undefined;

        if (!rawProperty) {
          throw new Error("Property not found");
        }

        const normalized = normalizeProperty(rawProperty);

        if (isMounted) {
          setProperty(normalized);
          setImageItems(
            normalized.images.map((url) => ({
              id: url,
              type: "existing" as const,
              url,
            })),
          );
          setFormData({
            title: normalized.title,
            description: normalized.description,
            location: normalized.location,
            price: normalized.price.toString(),
            bedrooms: normalized.bedrooms?.toString() ?? "",
            bathrooms: normalized.bathrooms?.toString() ?? "",
            squareFeet: normalized.squareFeet?.toString() ?? "",
          });
        }
      } catch (error) {
        console.error("Failed to load property:", error);
        const message =
          error instanceof Error && error.message
            ? error.message
            : "Unable to load this property.";
        addToast(message, "error");
        router.push(ROUTES.OWNER_PROPERTIES);
      } finally {
        if (isMounted) {
          setIsLoadingProperty(false);
        }
      }
    };

    void loadProperty();

    return () => {
      isMounted = false;
    };
  }, [addToast, params, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      const newItems = files.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        type: "file" as const,
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      previewUrlsRef.current.push(...newItems.map((item) => item.previewUrl));

      setImageItems((prev) => [...prev, ...newItems]);
    }
    e.target.value = "";
  };

  const removeImageItem = (id: string) => {
    setImageItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      const removed = prev.find((item) => item.id === id);
      if (removed?.type === "file") {
        URL.revokeObjectURL(removed.previewUrl);
        previewUrlsRef.current = previewUrlsRef.current.filter(
          (url) => url !== removed.previewUrl,
        );
      }
      return next;
    });
  };

  const makeRepresentative = (id: string) => {
    setImageItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index <= 0) return prev;

      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return next;
    });
  };

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current = [];
    };
  }, []);

  const fileItems = useMemo(
    () =>
      imageItems.filter(
        (item): item is Extract<ImageItem, { type: "file" }> =>
          item.type === "file",
      ),
    [imageItems],
  );
  const existingItemCount = useMemo(
    () => imageItems.filter((item) => item.type === "existing").length,
    [imageItems],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!property) return;

    setIsSubmitting(true);

    try {
      const uploadedUrlsByFileId = new Map<string, string>();
      const fileItemsInOrder = fileItems;

      if (fileItemsInOrder.length > 0) {
        const uploadFormData = new FormData();
        fileItemsInOrder.forEach((item) =>
          uploadFormData.append("images", item.file),
        );

        const uploadResponse = await uploadAPI.uploadImages(uploadFormData);
        const newUrls = uploadResponse.data?.data?.urls ?? [];

        fileItemsInOrder.forEach((item, index) => {
          const url = newUrls[index];
          if (url) {
            uploadedUrlsByFileId.set(item.id, url);
          }
        });
      }

      const imageUrls = imageItems.flatMap((item) => {
        if (item.type === "existing") {
          return [item.url];
        }

        const uploadedUrl = uploadedUrlsByFileId.get(item.id);
        return uploadedUrl ? [uploadedUrl] : [];
      });

      const payload = {
        ...formData,
        price: Number(formData.price),
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
        squareFeet: formData.squareFeet ? Number(formData.squareFeet) : null,
        images: imageUrls,
      };

      await propertyAPI.update(property.id, payload);
      addToast("Property updated successfully!", "success");
      router.push(ROUTES.OWNER_PROPERTIES);
    } catch (error) {
      console.error("Error updating property:", error);
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ??
        (error instanceof Error && error.message
          ? error.message
          : "Failed to update property");
      addToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isLoadingProperty) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <div className="flex gap-0 md:gap-6">
      <DashboardSidebar role="owner" />

      <main className="flex-1 mt-16 md:mt-0 px-4 md:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href={ROUTES.OWNER_PROPERTIES}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            Back to Properties
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Edit Property
            </h1>
            <p className="text-muted-foreground mt-1">
              Update the details of your property
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Basic Information
              </h2>

              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-foreground"
                >
                  Property Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Luxury Downtown Penthouse"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-foreground"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your property..."
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-foreground"
                >
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Downtown, New York"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Price & Details
              </h2>

              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-foreground"
                >
                  Price (USD)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 500000"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  required
                />
              </div>

              <div className="grid gap-4 grid-cols-3">
                <div className="space-y-2">
                  <label
                    htmlFor="bedrooms"
                    className="block text-sm font-medium text-foreground"
                  >
                    Bedrooms
                  </label>
                  <input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="bathrooms"
                    className="block text-sm font-medium text-foreground"
                  >
                    Bathrooms
                  </label>
                  <input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="squareFeet"
                    className="block text-sm font-medium text-foreground"
                  >
                    Sq. Feet
                  </label>
                  <input
                    id="squareFeet"
                    name="squareFeet"
                    type="number"
                    value={formData.squareFeet}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-foreground">
                  Property Images
                </h2>
                <span className="text-xs text-muted-foreground">
                  Uploaded to Cloudinary
                </span>
              </div>

              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background px-4 py-6 text-sm font-medium text-muted-foreground transition-all hover:border-primary/50 hover:text-primary">
                <UploadCloud size={18} />
                <span>
                  {fileItems.length > 0
                    ? `${fileItems.length} file(s) selected`
                    : "Choose images to upload"}
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelection}
                />
              </label>

              {imageItems.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    Ordered images
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {imageItems.map((item, index) => {
                      const src =
                        item.type === "existing" ? item.url : item.previewUrl;
                      const label =
                        item.type === "existing"
                          ? "Existing image"
                          : item.file.name;

                      return (
                        <div
                          key={item.id}
                          className="rounded-xl border border-border bg-background overflow-hidden"
                        >
                          <div className="relative aspect-[4/3] bg-muted">
                            <Image
                              src={src}
                              alt={label}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 50vw"
                            />
                            {index === 0 ? (
                              <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white">
                                <Star size={12} />
                                Representative
                              </div>
                            ) : null}
                          </div>

                          <div className="space-y-2 p-3">
                            <div>
                              <p className="truncate text-sm font-medium text-foreground">
                                {label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.type === "existing"
                                  ? "Stored image"
                                  : "New upload preview"}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {index !== 0 ? (
                                <button
                                  type="button"
                                  onClick={() => makeRepresentative(item.id)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                                >
                                  <ChevronUp size={14} />
                                  Make representative
                                </button>
                              ) : null}
                              <button
                                type="button"
                                onClick={() => removeImageItem(item.id)}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400"
                              >
                                <X size={14} />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    The first image is used as the property cover image on the
                    home page and cards.
                    {existingItemCount > 0
                      ? " Existing images keep their URLs; uploaded files are added in the order shown here."
                      : ""}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No images added yet.
                </p>
              )}

              <p className="text-sm text-muted-foreground">
                Upload one or more images. You can reorder them by choosing a
                new representative image.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                href={ROUTES.OWNER_PROPERTIES}
                className="flex-1 py-2.5 rounded-lg border border-border bg-background text-foreground font-semibold hover:bg-muted transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Uploading & Updating..." : "Update Property"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
