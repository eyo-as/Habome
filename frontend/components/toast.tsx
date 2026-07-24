'use client'

import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { useToast } from '@/context/toast-context'

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border
            animate-in fade-in slide-in-from-bottom-2 duration-200
            ${
              toast.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-900 dark:text-green-300'
                : toast.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-900 dark:text-red-300'
                  : toast.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950/30 dark:border-yellow-900 dark:text-yellow-300'
                    : 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-300'
            }
          `}
        >
          {toast.type === 'success' && <CheckCircle size={20} className="flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle size={20} className="flex-shrink-0" />}
          {toast.type === 'warning' && <AlertCircle size={20} className="flex-shrink-0" />}
          {toast.type === 'info' && <Info size={20} className="flex-shrink-0" />}

          <p className="text-sm font-medium flex-1">{toast.message}</p>

          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
            aria-label="Close toast"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  )
}
