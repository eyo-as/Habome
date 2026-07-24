'use client'

import Link from 'next/link'
import { Package, Users, TrendingUp, AlertCircle } from 'lucide-react'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { ROUTES } from '@/lib/constants'
import { useProtectedRoute } from '@/hooks/use-protected-route'

const STATS = [
  {
    label: 'Total Properties',
    value: '42',
    icon: Package,
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  {
    label: 'Total Users',
    value: '128',
    icon: Users,
    color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  },
  {
    label: 'Platform Views',
    value: '8,932',
    icon: TrendingUp,
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  },
  {
    label: 'Pending Reviews',
    value: '3',
    icon: AlertCircle,
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  },
]

export default function AdminDashboardPage() {
  const { isLoading } = useProtectedRoute('admin')

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
      <DashboardSidebar role="admin" />

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Platform overview and management</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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

          {/* Main Actions */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Link
              href={ROUTES.ADMIN_PROPERTIES}
              className="flex items-center justify-between p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all group"
            >
              <div>
                <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  Manage All Properties
                </p>
                <p className="text-sm text-muted-foreground mt-1">View, review, and manage all properties on the platform</p>
              </div>
              <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</div>
            </Link>

            <div className="flex items-center justify-between p-6 rounded-lg border border-border bg-card cursor-not-allowed opacity-75">
              <div>
                <p className="text-lg font-semibold text-foreground">Manage Users</p>
                <p className="text-sm text-muted-foreground mt-1">Review user accounts and manage permissions</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Platform Activity</h2>
            <div className="space-y-3">
              {[
                { text: 'New property listed: Urban Loft (Brooklyn)', status: 'positive', time: '30 minutes ago' },
                { text: 'User registered: john.smith@example.com', status: 'neutral', time: '2 hours ago' },
                { text: 'Property archived: Historic Victorian', status: 'neutral', time: '4 hours ago' },
                { text: 'Suspicious activity flagged on: Modern Penthouse', status: 'alert', time: '6 hours ago' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.status === 'positive'
                        ? 'bg-green-500'
                        : activity.status === 'alert'
                          ? 'bg-orange-500'
                          : 'bg-primary'
                    }`}
                  />
                  <div>
                    <p className="text-foreground text-sm">{activity.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground font-medium">Avg. Properties per Owner</p>
              <p className="text-3xl font-bold text-foreground mt-2">3.2</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">+5% from last month</p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground font-medium">Platform Growth</p>
              <p className="text-3xl font-bold text-foreground mt-2">+12%</p>
              <p className="text-xs text-muted-foreground mt-2">New users this month</p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground font-medium">Avg. Property Price</p>
              <p className="text-3xl font-bold text-foreground mt-2">$1.2M</p>
              <p className="text-xs text-muted-foreground mt-2">Median across platform</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
