'use client'

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/pwa'

/**
 * PWA Registration Component
 *
 * Handles service worker registration for PWA functionality.
 * Should be placed in the root layout or a high-level component.
 *
 * @example
 * ```tsx
 * <PWARegistration />
 * ```
 */
export default function PWARegistration (): React.ReactNode {
  useEffect(() => {
    // Only register in production
    if (process.env.NODE_ENV === 'production') {
      registerServiceWorker().catch((error) => {
        console.error('Failed to register service worker:', error)
      })
    } else {
      console.log('Service Worker registration skipped in development')
    }
  }, [])

  return null
}
