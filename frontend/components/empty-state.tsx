import { Search, Heart, Home, AlertCircle } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  type?: 'search' | 'favorites' | 'properties' | 'error'
  action?: {
    label: string
    onClick: () => void
  }
}

const iconMap = {
  search: Search,
  favorites: Heart,
  properties: Home,
  error: AlertCircle,
}

export function EmptyState({ title, description, type = 'search', action }: EmptyStateProps) {
  const Icon = iconMap[type]

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card/50 px-6 py-12 text-center">
      <Icon className="h-12 w-12 text-muted-foreground" />
      <div className="gap-1.5">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
