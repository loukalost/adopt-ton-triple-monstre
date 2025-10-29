import { useEffect, useRef } from 'react'
import type confetti from 'canvas-confetti'

/**
 * Hook personnalisé pour gérer les animations de confettis
 * Principe SRP: Responsabilité unique de gestion des confettis
 *
 * @param {boolean} isActive - Déclenche les confettis quand true
 * @returns {React.RefObject<HTMLCanvasElement | null>} Référence au canvas pour les confettis
 */
export function useConfetti (isActive: boolean): React.RefObject<HTMLCanvasElement | null> {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!isActive || canvasRef.current === null) return

    // Import dynamique de canvas-confetti (côté client uniquement)
    void import('canvas-confetti').then((module) => {
      const confettiCreate = module.default.create as typeof confetti.create
      if (canvasRef.current === null) return

      const myConfetti = confettiCreate(canvasRef.current, {
        resize: true,
        useWorker: true
      })

      /**
       * Lance une explosion de confettis - Couleurs SLATE + AMBER
       */
      const fireConfetti = (): void => {
        // Explosion centrale
        void myConfetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })

        // Rafales latérales
        void myConfetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        })

        void myConfetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        })
      }

      // Première vague
      fireConfetti()

      // Deuxième vague après 200ms
      const timeout1 = setTimeout(() => { fireConfetti() }, 200)

      // Confettis continus pour 2 secondes - Couleurs SLATE + AMBER
      const interval = setInterval(() => {
        void myConfetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#64748b', '#475569', '#fbbf24', '#f59e0b', '#334155'] // slate-500, slate-600, amber-400, amber-500, slate-700
        })
        void myConfetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#64748b', '#475569', '#fbbf24', '#f59e0b', '#334155']
        })
      }, 100)

      // Explosion finale
      const timeout2 = setTimeout(() => {
        void myConfetti({
          particleCount: 150,
          spread: 180,
          origin: { y: 0.5 },
          colors: ['#64748b', '#475569', '#fbbf24', '#f59e0b', '#334155', '#94a3b8', '#1e293b'] // Palette SLATE + AMBER
        })
      }, 2000)

      // Cleanup function
      return () => {
        clearTimeout(timeout1)
        clearTimeout(timeout2)
        clearInterval(interval)
      }
    }).catch((err) => {
      console.error('Failed to load canvas-confetti:', err)
    })
  }, [isActive])

  return canvasRef
}
