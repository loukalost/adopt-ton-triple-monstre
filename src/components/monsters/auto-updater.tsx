/**
 * Composant pour gérer les mises à jour automatiques des monstres
 *
 * Ce composant invisible s'occupe de déclencher automatiquement
 * les mises à jour des états des monstres à intervalle régulier.
 *
 * À placer dans le dashboard ou layout principal
 *
 * Usage:
 * ```tsx
 * <MonstersAutoUpdater
 *   userId={user.id}
 *   minInterval={60000}  // 1 minute
 *   maxInterval={180000} // 3 minutes
 *   enabled={true}       // Activé par défaut
 *   verbose={true}       // Logs dans la console
 * />
 * ```
 */
'use client'

import { useAutoUpdateMonsters } from '@/hooks/use-auto-update-monsters'
import { useEffect, useState } from 'react'

interface MonstersAutoUpdaterProps {
  /** ID de l'utilisateur dont les monstres doivent être mis à jour */
  userId?: string | null
  /** Intervalle minimum en millisecondes (défaut: 60000 = 1 min) */
  minInterval?: number
  /** Intervalle maximum en millisecondes (défaut: 180000 = 3 min) */
  maxInterval?: number
  /** Active ou désactive les mises à jour automatiques */
  enabled?: boolean
  /** Active les logs détaillés dans la console */
  verbose?: boolean
  /** Affiche un indicateur visuel des mises à jour */
  showIndicator?: boolean
}

export function MonstersAutoUpdater ({
  userId = null,
  minInterval = 60000,
  maxInterval = 180000,
  enabled = true,
  verbose = true,
  showIndicator = false
}: MonstersAutoUpdaterProps): React.ReactNode {
  const { isUpdating, lastUpdate, updateCount, nextUpdateIn } = useAutoUpdateMonsters({
    userId,
    minInterval,
    maxInterval,
    enabled,
    verbose,
    onUpdate: (result) => {
      if (verbose) {
        if (result.success) {
          console.log(`✅ [AUTO-UPDATER] Mise à jour #${updateCount + 1} réussie: ${result.updated ?? 0} monstre(s)`)
        } else {
          console.error(`❌ [AUTO-UPDATER] Mise à jour #${updateCount + 1} échouée:`, result.error ?? 'Unknown error')
        }
      }
    }
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Ne pas rendre côté serveur (hydratation)
  if (!mounted) return null

  // Si l'indicateur n'est pas activé, ne rien rendre
  if (!showIndicator) return null

  // Indicateur visuel optionnel
  return (
    <div
      className='fixed bottom-4 right-4 z-50 rounded-lg bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm'
      aria-live='polite'
      aria-atomic='true'
    >
      <div className='flex items-center gap-3'>
        <div className={`h-2 w-2 rounded-full ${isUpdating ? 'animate-pulse bg-blue-500' : 'bg-green-500'}`} />
        <div className='text-sm'>
          {isUpdating
            ? (
              <span className='font-medium text-gray-700'>Mise à jour en cours...</span>
              )
            : (
              <div className='flex flex-col'>
                <span className='font-medium text-gray-700'>
                  Mise à jour auto {updateCount > 0 ? `(${updateCount})` : ''}
                </span>
                {lastUpdate?.success === true && (
                  <span className='text-xs text-gray-500'>
                    {lastUpdate.updated} monstre(s) mis à jour
                  </span>
                )}
                {nextUpdateIn !== null && nextUpdateIn > 0 && (
                  <span className='text-xs text-gray-500'>
                    Prochaine dans {Math.round(nextUpdateIn / 1000)}s
                  </span>
                )}
              </div>
              )}
        </div>
      </div>
    </div>
  )
}
