"use client"

import { Logo } from "@/components/logo"

export function MobileHeader() {
  return (
    <div className="lg:hidden h-header-mobile sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-center px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-16 flex items-center justify-center">
              <Logo className="w-8 h-8" width={32} height={32} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
