export function PropertySkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      {/* Image skeleton */}
      <div className="h-48 w-full bg-muted animate-pulse" />

      {/* Content skeleton */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Price skeleton */}
        <div className="h-6 w-32 bg-muted animate-pulse rounded" />

        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
        </div>

        {/* Location skeleton */}
        <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />

        {/* Features skeleton */}
        <div className="space-y-2 border-t border-border pt-2">
          <div className="flex gap-3">
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function PropertyGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PropertySkeleton key={i} />
      ))}
    </div>
  )
}
