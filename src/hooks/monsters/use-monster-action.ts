import { useState, useCallback } from 'react'

/**
 * Type représentant une action possible sur un monstre
 */
export type MonsterAction = 'feed' | 'comfort' | 'hug' | 'wake'

/**
 * Interface du hook useMonsterAction
 */
export interface UseMonsterActionReturn {
  /** Action actuellement en cours (null si aucune) */
  activeAction: MonsterAction | null
  /** Fonction pour déclencher une nouvelle action */
  triggerAction: (action: MonsterAction, callback?: (action: MonsterAction) => void) => void
}

/**
 * Hook personnalisé pour gérer les actions sur un monstre
 *
 * Responsabilité unique : gérer l'état de l'action en cours
 * et son cycle de vie (déclenchement, réinitialisation).
 *
 * L'action est automatiquement réinitialisée après 2,5 secondes
 * pour permettre l'animation de se terminer.
 *
 * @param {number} [resetDelay=2500] - Délai avant réinitialisation en ms
 * @returns {UseMonsterActionReturn} État et fonctions de gestion
 *
 * @example
 * const { activeAction, triggerAction } = useMonsterAction()
 * triggerAction('feed', (action) => console.log(`Fed the monster: ${action}`))
 */
export function useMonsterAction (resetDelay: number = 2500): UseMonsterActionReturn {
  const [activeAction, setActiveAction] = useState<MonsterAction | null>(null)

  /**
   * Déclenche une action sur le monstre
   * @param {MonsterAction} action - Action à déclencher
   * @param {Function} callback - Callback optionnel appelé après déclenchement
   */
  const triggerAction = useCallback((
    action: MonsterAction,
    callback?: (action: MonsterAction) => void
  ) => {
    setActiveAction(action)

    // Appeler le callback si fourni
    if (callback !== undefined) {
      callback(action)
    }

    // Réinitialiser l'action après le délai
    setTimeout(() => {
      setActiveAction(null)
    }, resetDelay)
  }, [resetDelay])

  return {
    activeAction,
    triggerAction
  }
}
