'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Shield, Trash2, Mail, Calendar } from 'lucide-react'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Pagination } from '@/components/pagination'
import { ROLE_LABELS, PAGINATION } from '@/lib/constants'
import { formatDate } from '@/lib/helpers'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { useToast } from '@/context/toast-context'
import type { User } from '@/lib/types'

const MOCK_USERS: User[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@example.com', role: 'owner', createdAt: '2024-01-15' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'user', createdAt: '2024-01-18' },
  { id: '3', name: 'Michael Brown', email: 'michael.b@example.com', role: 'owner', createdAt: '2024-02-01' },
  { id: '4', name: 'Emily Davis', email: 'emily.davis@example.com', role: 'user', createdAt: '2024-02-05' },
  { id: '5', name: 'James Wilson', email: 'james.w@example.com', role: 'owner', createdAt: '2024-02-10' },
  { id: '6', name: 'Jessica Martinez', email: 'jessica.m@example.com', role: 'user', createdAt: '2024-02-15' },
  { id: '7', name: 'Robert Garcia', email: 'robert.g@example.com', role: 'owner', createdAt: '2024-02-20' },
  { id: '8', name: 'Linda Rodriguez', email: 'linda.r@example.com', role: 'user', createdAt: '2024-02-25' },
  { id: '9', name: 'David Lee', email: 'david.lee@example.com', role: 'owner', createdAt: '2024-03-01' },
  { id: '10', name: 'Maria Anderson', email: 'maria.a@example.com', role: 'user', createdAt: '2024-03-05' },
  { id: '11', name: 'Thomas Taylor', email: 'thomas.t@example.com', role: 'owner', createdAt: '2024-03-10' },
  { id: '12', name: 'Jennifer Thomas', email: 'jennifer.t@example.com', role: 'user', createdAt: '2024-03-15' },
]

export default function AdminUsersPage() {
  const { isLoading } = useProtectedRoute('admin')
  const { addToast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'owner' | 'user'>('all')

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [searchTerm, roleFilter])

  const totalPages = Math.ceil(filteredUsers.length / PAGINATION.ADMIN_USERS_LIMIT)
  const paginatedUsers = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGINATION.ADMIN_USERS_LIMIT
    return filteredUsers.slice(startIdx, startIdx + PAGINATION.ADMIN_USERS_LIMIT)
  }, [currentPage, filteredUsers])

  const handleDeleteUser = (id: string) => {
    console.log('Delete user:', id)
    addToast('User deleted successfully', 'success')
  }

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
      <DashboardSidebar role="admin" />

      <main className="flex-1 mt-16 md:mt-0 px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage all users on the platform</p>
        </div>

        {/* Filters */}
        <div className="grid gap-3 md:grid-cols-2 mb-6">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="px-4 py-2 rounded-lg border border-border bg-black text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as typeof roleFilter)
              setCurrentPage(1)
            }}
            className="px-4 py-2 rounded-lg border border-border bg-black text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Roles</option>
            <option value="owner">Property Owners</option>
            <option value="user">Buyers</option>
          </select>
        </div>

        {/* Users Table */}
        {paginatedUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="bg-black border border-border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-black/50 font-semibold text-sm">
                <div className="col-span-4">Name</div>
                <div className="col-span-4">Email</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border">
                {paginatedUsers.map((user) => (
                  <div key={user.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-black/50 transition-colors text-sm">
                    <div className="col-span-4 font-medium">{user.name}</div>
                    <div className="col-span-4 text-muted-foreground flex items-center gap-2">
                      <Mail size={16} />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {ROLE_LABELS[user.role]}
                      </span>
                    </div>
                    <div className="col-span-2 flex gap-2">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-600 hover:text-red-500 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-black border border-border rounded-lg p-8 text-center">
            <Shield size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredUsers.length}
              itemsPerPage={PAGINATION.ADMIN_USERS_LIMIT}
            />
          </div>
        )}
      </main>
    </div>
  )
}
