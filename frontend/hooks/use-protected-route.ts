'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'

export function useProtectedRoute(requiredRole?: string) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.push('/auth/login')
      return
    }

    if (requiredRole && user.role !== requiredRole) {
      router.push('/')
      return
    }
  }, [user, isLoading, requiredRole, router])

  return { user, isLoading }
}
