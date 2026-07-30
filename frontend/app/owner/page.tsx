"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Home,
  PlusSquare,
  TrendingUp,
  MessageSquareMore,
} from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ROUTES } from "@/lib/constants";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { contactAPI, propertyAPI } from "@/services/api";
import { normalizeProperty } from "@/lib/property-utils";
import { formatRelativeTime } from "@/lib/helpers";
import type { ContactMessage, Property } from "@/lib/types";

export default function OwnerDashboardPage() {
  const { isLoading: authLoading } = useProtectedRoute("owner");
  const [properties, setProperties] = useState<Property[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        const [propertiesResponse, messagesResponse] = await Promise.all([
          propertyAPI.getMyListings(),
          contactAPI.getInbox(),
        ]);

        const items = propertiesResponse.data?.data?.properties ?? [];
        const inboxMessages = messagesResponse.data?.data?.messages ?? [];

        if (isMounted) {
          setProperties(
            (items as Array<Record<string, unknown>>).map(normalizeProperty),
          );
          setMessages(inboxMessages as ContactMessage[]);
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError("We could not load your dashboard data right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const publishedCount = properties.filter(
      (property) => property.status === "published",
    ).length;
    const draftCount = properties.filter(
      (property) => property.status === "draft",
    ).length;
    const archivedCount = properties.filter(
      (property) => property.status === "archived",
    ).length;

    return [
      {
        label: "Total Properties",
        value: properties.length.toString(),
        icon: Home,
        color:
          "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      },
      {
        label: "Published",
        value: publishedCount.toString(),
        icon: Eye,
        color:
          "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      },
      {
        label: "Draft / Archived",
        value: `${draftCount}/${archivedCount}`,
        icon: TrendingUp,
        color:
          "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      },
    ];
  }, [properties]);

  const recentProperties = useMemo(() => properties.slice(0, 3), [properties]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-0 md:gap-6">
      <DashboardSidebar role="owner" />

      <main className="flex-1 mt-16 md:mt-0 px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back! Here&apos;s your property overview.
              </p>
            </div>
            <Link
              href={ROUTES.OWNER_CREATE_PROPERTY}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              <PlusSquare size={20} />
              <span>New Property</span>
            </Link>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-border bg-card p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-foreground mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Recent Listings
            </h2>
            {recentProperties.length > 0 ? (
              <div className="space-y-3">
                {recentProperties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-start justify-between gap-3 pb-3 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {property.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {property.location}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-primary">
                      {property.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                You have not created any properties yet.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Incoming Messages
              </h2>
              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <MessageSquareMore size={16} />
                <span>{messages.length}</span>
              </div>
            </div>

            {messages.length > 0 ? (
              <div className="space-y-3">
                {messages.slice(0, 4).map((message) => {
                  const sender =
                    typeof message.senderId === "object" &&
                    message.senderId !== null
                      ? (message.senderId as { name?: string; email?: string })
                      : null;
                  const property =
                    typeof message.propertyId === "object" &&
                    message.propertyId !== null
                      ? (message.propertyId as { title?: string })
                      : null;

                  return (
                    <div
                      key={message.id}
                      className="rounded-lg border border-border bg-background/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">
                            {sender?.name || sender?.email || "A buyer"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {property?.title || "Property inquiry"}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {message.createdAt
                            ? formatRelativeTime(message.createdAt)
                            : "Recently received"}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line">
                        {message.message}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No messages yet. New inquiries will appear here.
              </p>
            )}
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Link
              href={ROUTES.OWNER_PROPERTIES}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all group"
            >
              <div>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  Manage Properties
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  View and edit all your listings
                </p>
              </div>
              <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </Link>

            <Link
              href={ROUTES.OWNER_CREATE_PROPERTY}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all group"
            >
              <div>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  Create Listing
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add a new property to your portfolio
                </p>
              </div>
              <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
