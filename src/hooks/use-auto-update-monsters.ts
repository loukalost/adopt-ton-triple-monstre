/**
 * Hook React pour déclencher automatiquement la mise à jour des monstres
 * depuis le frontend à intervalle régulier
 *
 * Usage:
 * ```tsx
 * const { trigger, isUpdating, lastUpdate } = useAutoUpdateMonsters({
 *   userId: 'user123',
 *   minInterval: 60000, // 1 minute
 *   maxInterval: 180000, // 3 minutes
 *   enabled: true,
 * })
 * ```
 */
'use client'

import { useEffect, useRef, useState } from 'react'

interface UseAutoUpdateMonstersOptions {
  /** ID de l'utilisateur dont les monstres doivent être mis à jour */
  userId?: string | null
  /** Intervalle minimum en millisecondes (par défaut 60000 = 1 minute) */
  minInterval?: number
  /** Intervalle maximum en millisecondes (par défaut 180000 = 3 minutes) */
  maxInterval?: number
  /** Active ou désactive les mises à jour automatiques */
  enabled?: boolean
  /** Callback appelé après chaque mise à jour */
  onUpdate?: (result: UpdateResult) => void
  /** Active les logs détaillés dans la console */
  verbose?: boolean
}

interface UpdateResult {
  success: boolean
  updated?: number
  timestamp?: string
  duration?: number
  error?: string
}

export function useAutoUpdateMonsters (options: UseAutoUpdateMonstersOptions = {}): {
  trigger: () => Promise<void>
  isUpdating: boolean
  lastUpdate: UpdateResult | null
  updateCount: number
  nextUpdateIn: number | null
} {
  const {
    userId = null,
    minInterval = 60000, // 1 minute par défaut
    maxInterval = 180000, // 3 minutes par défaut
    enabled = true,
    onUpdate,
    verbose = true
  } = options

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isUpdatingRef = useRef(false)

  const [isUpdating, setIsUpdating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<UpdateResult | null>(null)
  const [updateCount, setUpdateCount] = useState(0)
  const [nextUpdateIn, setNextUpdateIn] = useState<number | null>(null)

  /**
   * Logger conditionnel basé sur le flag verbose
   */
  const log = (level: 'log' | 'warn' | 'error', message: string, data?: Record<string, unknown>): void => {
    if (!verbose) return
    const prefix = '[AUTO-UPDATE-MONSTERS]'
    if (data !== undefined) {
      console[level](`${prefix} ${message}`, data)
    } else {
      console[level](`${prefix} ${message}`)
    }
  }

  /**
   * Fonction principale de mise à jour des monstres
   */
  const updateMonsters = async (): Promise<void> => {
    // Éviter les appels concurrents
    if (isUpdatingRef.current) {
      log('warn', '⚠️ Mise à jour déjà en cours, abandon...')
      return
    }

    // Vérifier que l'userId est fourni
    if (userId === null || userId === undefined) {
      log('warn', '⚠️ Pas d\'userId fourni, mise à jour annulée')
      return
    }

    isUpdatingRef.current = true
    setIsUpdating(true)
    setNextUpdateIn(null)

    try {
      log('log', `🔄 Déclenchement mise à jour des monstres pour l'utilisateur ${userId}...`)

      const response = await fetch(`/api/cron/update-monsters?userId=${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET_TOKEN ?? ''}`,
          'Content-Type': 'application/json'
        }
      })

      const data: unknown = await response.json()
      const parsedData = data as Record<string, unknown>

      if (response.ok) {
        log('log', '✅ Monstres mis à jour avec succès', {
          updated: parsedData.updated,
          duration: parsedData.duration
        })

        const result: UpdateResult = {
          success: true,
          updated: parsedData.updated as number,
          timestamp: parsedData.timestamp as string,
          duration: parsedData.duration as number
        }

        setLastUpdate(result)
        setUpdateCount((prev) => prev + 1)
        onUpdate?.(result)
      } else {
        log('error', '❌ Erreur lors de la mise à jour', {
          status: response.status,
          error: parsedData.error
        })

        const result: UpdateResult = {
          success: false,
          error: `HTTP ${response.status}: ${String(parsedData.error ?? 'Unknown error')}`
        }

        setLastUpdate(result)
        onUpdate?.(result)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      log('error', '❌ Exception lors de la mise à jour', { error: errorMessage })

      const result: UpdateResult = {
        success: false,
        error: errorMessage
      }

      setLastUpdate(result)
      onUpdate?.(result)
    } finally {
      isUpdatingRef.current = false
      setIsUpdating(false)
    }
  }

  /**
   * Fonction pour déclencher manuellement une mise à jour
   */
  const trigger = async (): Promise<void> => {
    await updateMonsters()
  }

  /**
   * Planifier la prochaine mise à jour avec un délai aléatoire
   */
  const scheduleNext = (): void => {
    // Délai aléatoire entre min et max
    const delay = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval

    setNextUpdateIn(delay)
    log('log', `⏰ Prochaine mise à jour dans ${Math.round(delay / 1000)}s (${Math.round(delay / 60000)} min)`)

    timeoutRef.current = setTimeout(() => {
      void updateMonsters().then(() => {
        scheduleNext() // Planifier la suivante après succès
      })
    }, delay)
  }

  /**
   * Setup de l'intervalle automatique avec délais aléatoires
   */
  useEffect(() => {
    // Si disabled ou pas d'userId, ne rien faire
    if (!enabled || userId == null) {
      if (!enabled) {
        log('log', '⏸️ Mises à jour automatiques désactivées')
      } else {
        log('log', '⏸️ En attente de connexion utilisateur...')
      }
      return
    }

    log('log', `🚀 Démarrage des mises à jour automatiques pour l'utilisateur ${userId} (intervalle aléatoire: ${Math.round(minInterval / 60000)}-${Math.round(maxInterval / 60000)} min)`)

    // Première exécution immédiate puis planification
    void updateMonsters().then(() => {
      scheduleNext()
    })

    // Cleanup au démontage
    return () => {
      log('log', '⏹️ Arrêt des mises à jour automatiques')
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [enabled, userId, minInterval, maxInterval])

  return {
    trigger,
    isUpdating,
    lastUpdate,
    updateCount,
    nextUpdateIn
  }
}
