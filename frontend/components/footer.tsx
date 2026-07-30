import { Building2 } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Habome</p>
              <p className="text-xs text-muted-foreground">Modern Property Listings Platform</p>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center sm:text-right">
            © {currentYear} Habome. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
