'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/buttons/button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * PWA Install Prompt Component
 *
 * Displays a prompt to install the app as a PWA when the browser supports it.
 * Automatically hides if the app is already installed or running as PWA.
 *
 * @example
 * ```tsx
 * <InstallPrompt />
 * ```
 */
export default function InstallPrompt (): React.ReactNode {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isPWA, setIsPWA] = useState(false)

  useEffect(() => {
    // Check if running as PWA
    const checkPWA = (): boolean => {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://')
      )
    }

    setIsPWA(checkPWA())

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event): void => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    // Listen for app installed event
    const handleAppInstalled = (): void => {
      console.log('PWA was installed')
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async (): Promise<void> => {
    if (deferredPrompt == null) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      console.log(`User response to install prompt: ${outcome}`)

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }

      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error('Error showing install prompt:', error)
    }
  }

  const handleDismiss = (): void => {
    setShowPrompt(false)
    // Store dismissal in localStorage to avoid showing again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Don't show if already installed or running as PWA
  if (isPWA || !showPrompt || deferredPrompt == null) {
    return null
  }

  return (
    <div className='fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 bg-white border-2 border-moccaccino-500 rounded-xl shadow-xl p-4 animate-slide-up'>
      <button
        onClick={handleDismiss}
        className='absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors'
        aria-label='Fermer'
      >
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </button>

      <div className='flex items-start gap-3 mb-3'>
        <div className='text-4xl'>📱</div>
        <div>
          <h3 className='font-bold text-lg text-gray-900 mb-1'>
            Installer Triple Monstre
          </h3>
          <p className='text-sm text-gray-600'>
            Installez l'application pour un accès rapide et une expérience optimale !
          </p>
        </div>
      </div>

      <div className='flex gap-2'>
        <Button
          onClick={() => { void handleInstallClick() }}
          size='sm'
          variant='primary'
        >
          Installer
        </Button>
        <Button
          onClick={handleDismiss}
          size='sm'
          variant='ghost'
        >
          Plus tard
        </Button>
      </div>
    </div>
  )
}
