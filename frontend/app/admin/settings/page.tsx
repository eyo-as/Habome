'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Lock, Bell, Shield, Settings as SettingsIcon } from 'lucide-react'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { useToast } from '@/context/toast-context'
import { useAuth } from '@/context/auth-context'

export default function AdminSettingsPage() {
  const { isLoading } = useProtectedRoute('admin')
  const { user } = useAuth()
  const { addToast } = useToast()

  const [email, setEmail] = useState(user?.email || '')
  const [platformSettings, setPlatformSettings] = useState({
    maintenanceMode: false,
    requirePropertyApproval: true,
    allowUserRegistration: true,
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      addToast('Settings saved successfully!', 'success')
    } catch (error) {
      addToast('Failed to save settings', 'error')
    } finally {
      setIsSaving(false)
    }
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
        {/* Header */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-8">Admin Settings</h1>

        {/* Settings Sections */}
        <div className="grid gap-6 max-w-2xl">
          {/* Account Settings */}
          <div className="bg-black border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="text-primary" size={24} />
              <h2 className="text-xl font-semibold">Account Settings</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-black text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Change Password
              </button>
            </div>
          </div>

          {/* Platform Settings */}
          <div className="bg-black border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <SettingsIcon className="text-primary" size={24} />
              <h2 className="text-xl font-semibold">Platform Settings</h2>
            </div>

            <div className="space-y-3">
              {[
                { key: 'maintenanceMode', label: 'Maintenance Mode' },
                { key: 'requirePropertyApproval', label: 'Require Property Approval' },
                { key: 'allowUserRegistration', label: 'Allow User Registration' },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={platformSettings[item.key as keyof typeof platformSettings]}
                    onChange={(e) =>
                      setPlatformSettings({
                        ...platformSettings,
                        [item.key]: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded accent-primary"
                  />
                  <span className="font-medium">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-black border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-primary" size={24} />
              <h2 className="text-xl font-semibold">Security</h2>
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">Two-Factor Authentication: Enabled</p>
              <button className="text-primary hover:text-primary/80 font-medium">
                View Security Log
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </main>
    </div>
  )
}
