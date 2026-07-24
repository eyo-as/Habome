'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Building2, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ROUTES, NAV_LABELS } from '@/lib/constants'
import { useAuth } from '@/context/auth-context'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
    setIsOpen(false)
  }

  const isPublicPage = !user
  const isOwner = user?.role === 'owner'
  const isAdmin = user?.role === 'admin'
  const isUser = user?.role === 'user'

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2 font-bold text-lg">
            <Building2 className="h-6 w-6 text-primary" />
            <span>PropertyHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href={ROUTES.HOME}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === ROUTES.HOME ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {NAV_LABELS.HOME}
            </Link>

            {/* Conditional Navigation Based on Role */}
            {isOwner && (
              <>
                <Link
                  href={ROUTES.OWNER_PROPERTIES}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname.startsWith(ROUTES.OWNER) ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {NAV_LABELS.MY_PROPERTIES}
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link
                  href={ROUTES.ADMIN}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname.startsWith(ROUTES.ADMIN) ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {NAV_LABELS.DASHBOARD}
                </Link>
              </>
            )}

            {isUser && (
              <>
                <Link
                  href={ROUTES.USER_FAVORITES}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === ROUTES.USER_FAVORITES ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {NAV_LABELS.FAVORITES}
                </Link>
              </>
            )}

            {/* Auth Links */}
            {!user ? (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === ROUTES.LOGIN ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {NAV_LABELS.LOGIN}
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {NAV_LABELS.REGISTER}
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {NAV_LABELS.LOGOUT}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border pb-4 space-y-2">
            <Link
              href={ROUTES.HOME}
              className={cn(
                'block px-4 py-2 text-sm font-medium rounded-md transition-colors',
                pathname === ROUTES.HOME
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted'
              )}
              onClick={() => setIsOpen(false)}
            >
              {NAV_LABELS.HOME}
            </Link>

            {isOwner && (
              <Link
                href={ROUTES.OWNER_PROPERTIES}
                className={cn(
                  'block px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  pathname.startsWith(ROUTES.OWNER)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                )}
                onClick={() => setIsOpen(false)}
              >
                {NAV_LABELS.MY_PROPERTIES}
              </Link>
            )}

            {isAdmin && (
              <Link
                href={ROUTES.ADMIN}
                className={cn(
                  'block px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  pathname.startsWith(ROUTES.ADMIN)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                )}
                onClick={() => setIsOpen(false)}
              >
                {NAV_LABELS.DASHBOARD}
              </Link>
            )}

            {isUser && (
              <Link
                href={ROUTES.USER_FAVORITES}
                className={cn(
                  'block px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  pathname === ROUTES.USER_FAVORITES
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                )}
                onClick={() => setIsOpen(false)}
              >
                {NAV_LABELS.FAVORITES}
              </Link>
            )}

            {!user ? (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className={cn(
                    'block px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    pathname === ROUTES.LOGIN
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {NAV_LABELS.LOGIN}
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="block px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {NAV_LABELS.REGISTER}
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors"
              >
                {NAV_LABELS.LOGOUT}
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
