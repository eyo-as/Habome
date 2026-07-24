'use client'

import Link from 'next/link'
import { Eye, Home, PlusSquare, TrendingUp } from 'lucide-react'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { ROUTES } from '@/lib/constants'
import { useProtectedRoute } from '@/hooks/use-protected-route'

const STATS = [
  {
    label: 'Total Properties',
    value: '8',
    icon: Home,
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  {
    label: 'Published',
    value: '6',
    icon: Eye,
    color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  },
  {
    label: 'Total Views',
    value: '1,234',
    icon: TrendingUp,
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  },
]

export default function OwnerDashboardPage() {
  const { isLoading } = useProtectedRoute('owner')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-0 md:gap-6">
      {/* Sidebar */}
      <DashboardSidebar role="owner" />

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s your property overview.</p>
            </div>
            <Link
              href={ROUTES.OWNER_CREATE_PROPERTY}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              <PlusSquare size={20} />
              <span>New Property</span>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            {STATS.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="rounded-lg border border-border bg-card p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon size={24} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {[
                { text: 'Modern Downtown Penthouse received 12 new views', time: '2 hours ago' },
                { text: 'Cozy Suburban Home was published', time: '1 day ago' },
                { text: 'Urban Loft listing was created', time: '3 days ago' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-foreground text-sm">{activity.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Link
              href={ROUTES.OWNER_PROPERTIES}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all group"
            >
              <div>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  Manage Properties
                </p>
                <p className="text-xs text-muted-foreground mt-1">View and edit all your listings</p>
              </div>
              <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</div>
            </Link>

            <Link
              href={ROUTES.OWNER_CREATE_PROPERTY}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all group"
            >
              <div>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  Create Listing
                </p>
                <p className="text-xs text-muted-foreground mt-1">Add a new property to your portfolio</p>
              </div>
              <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
