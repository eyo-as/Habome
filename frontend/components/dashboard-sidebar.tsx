'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/context/auth-context'
import {
  Home,
  Package,
  PlusSquare,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Users,
  Heart,
} from 'lucide-react'
import type { UserRole } from '@/lib/types'

interface DashboardSidebarProps {
  role: UserRole
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
    setIsOpen(false)
  }

  const getNavItems = () => {
    switch (role) {
      case 'owner':
        return [
          { icon: Home, label: 'Dashboard', href: ROUTES.OWNER },
          { icon: Package, label: 'My Properties', href: ROUTES.OWNER_PROPERTIES },
          { icon: PlusSquare, label: 'Create Property', href: ROUTES.OWNER_CREATE_PROPERTY },
          { icon: Settings, label: 'Settings', href: '/owner/settings' },
        ]
      case 'admin':
        return [
          { icon: BarChart3, label: 'Dashboard', href: ROUTES.ADMIN },
          { icon: Package, label: 'All Properties', href: ROUTES.ADMIN_PROPERTIES },
          { icon: Users, label: 'Users', href: '/admin/users' },
          { icon: Settings, label: 'Settings', href: '/admin/settings' },
        ]
      case 'user':
        return [
          { icon: Home, label: 'Dashboard', href: ROUTES.USER },
          { icon: Heart, label: 'Favorites', href: ROUTES.USER_FAVORITES },
          { icon: Settings, label: 'Settings', href: '/user/settings' },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 right-4 z-40 p-2 rounded-lg hover:bg-muted transition-colors md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border bg-black transition-transform duration-300 z-30 md:z-0 md:relative md:translate-x-0 overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="space-y-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}

          {/* Divider */}
          <div className="my-4 h-px bg-border" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  )
}
