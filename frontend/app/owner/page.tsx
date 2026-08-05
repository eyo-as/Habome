"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Home,
  PlusSquare,
  TrendingUp,
  MessageSquareMore,
  Sparkles,
  Clock3,
  Building2,
  UserRound,
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

  const messageCards = useMemo(() => {
    return messages.slice(0, 6).map((message) => {
      const sender =
        typeof message.senderId === "object" && message.senderId !== null
          ? (message.senderId as { name?: string; email?: string })
          : null;
      const property =
        typeof message.propertyId === "object" && message.propertyId !== null
          ? (message.propertyId as { title?: string })
          : null;

      const senderLabel = sender?.name || sender?.email || "A buyer";
      const senderInitial = senderLabel.trim().charAt(0).toUpperCase() || "B";
      const propertyLabel = property?.title || "Property inquiry";
      const timeLabel = message.createdAt
        ? formatRelativeTime(message.createdAt)
        : "Recently received";

      return {
        ...message,
        senderLabel,
        senderInitial,
        senderEmail: sender?.email,
        propertyLabel,
        timeLabel,
      };
    });
  }, [messages]);

  const messageInsights = useMemo(() => {
    const now = Date.now();
    const last24h = messages.filter((message) => {
      if (!message.createdAt) return false;
      const timestamp = new Date(message.createdAt).getTime();
      return (
        Number.isFinite(timestamp) && now - timestamp <= 24 * 60 * 60 * 1000
      );
    }).length;

    const uniqueProperties = new Set(messageCards.map((m) => m.propertyLabel))
      .size;
    const avgLength =
      messageCards.length > 0
        ? Math.round(
            messageCards.reduce(
              (sum, message) => sum + message.message.length,
              0,
            ) / messageCards.length,
          )
        : 0;

    return { last24h, uniqueProperties, avgLength };
  }, [messageCards, messages]);

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

          <div className="rounded-2xl border border-white/15 bg-black text-white overflow-hidden">
            <div className="bg-black px-6 py-5 border-b border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                    <Sparkles size={14} />
                    Message Center
                  </div>
                  <h2 className="mt-3 text-2xl font-bold text-white">
                    Incoming Messages
                  </h2>
                  <p className="mt-1 text-sm text-white/70">
                    Stay on top of buyer interest across your listings.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white w-fit">
                  <MessageSquareMore size={16} />
                  <span>{messages.length} total</span>
                </div>
              </div>

              {messages.length > 0 ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                    <p className="text-xs text-white/65">Last 24 hours</p>
                    <p className="mt-1 text-xl font-bold text-white">
                      {messageInsights.last24h}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                    <p className="text-xs text-white/65">Active listings</p>
                    <p className="mt-1 text-xl font-bold text-white">
                      {messageInsights.uniqueProperties}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                    <p className="text-xs text-white/65">Avg. message size</p>
                    <p className="mt-1 text-xl font-bold text-white">
                      {messageInsights.avgLength} chars
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-6 bg-black">
              {messageCards.length > 0 ? (
                <div className="grid gap-4 lg:grid-cols-5">
                  <div className="lg:col-span-2 rounded-xl border border-white/15 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                      Latest inquiry
                    </p>
                    <div className="mt-3 flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center font-semibold border border-white/15">
                        {messageCards[0].senderInitial}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate">
                          {messageCards[0].senderLabel}
                        </p>
                        <p className="text-xs text-white/65 truncate">
                          {messageCards[0].propertyLabel}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-white/75 whitespace-pre-line line-clamp-6">
                      {messageCards[0].message}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 size={14} />
                        {messageCards[0].timeLabel}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Building2 size={14} />
                        Priority lead
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-3 space-y-3">
                    {messageCards.slice(1).map((message) => (
                      <div
                        key={message.id}
                        className="rounded-xl border border-white/15 bg-white/5 p-4 hover:border-white/35 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-white truncate inline-flex items-center gap-2">
                              <span className="h-7 w-7 rounded-full bg-white/10 text-white/90 flex items-center justify-center text-xs font-semibold border border-white/15">
                                {message.senderInitial}
                              </span>
                              {message.senderLabel}
                            </p>
                            <p className="text-xs text-white/65 mt-1 inline-flex items-center gap-1">
                              <UserRound size={13} />
                              {message.propertyLabel}
                            </p>
                          </div>
                          <span className="text-xs text-white/60 whitespace-nowrap">
                            {message.timeLabel}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-white/75 whitespace-pre-line line-clamp-3">
                          {message.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
                  <MessageSquareMore
                    size={24}
                    className="mx-auto mb-3 text-white/60"
                  />
                  <p className="text-sm text-white/65">
                    No messages yet. New inquiries will appear here.
                  </p>
                </div>
              )}
            </div>
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
