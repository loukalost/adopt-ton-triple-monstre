import type { MonsterTraits } from '@/types/monster'

/**
 * Parse les traits d'un monstre depuis un JSON string
 *
 * @param {string} traitsJson - JSON stringifié des traits
 * @returns {MonsterTraits | null} Traits parsés ou null si erreur
 */
export function parseMonsterTraits (traitsJson: string): MonsterTraits | null {
  try {
    return JSON.parse(traitsJson) as MonsterTraits
  } catch (error) {
    console.error('Error parsing monster traits:', error)
    return null
  }
}

/**
 * Formate une date d'adoption au format français
 *
 * @param {string} dateString - Date ISO string
 * @returns {string | null} Date formatée ou null
 */
export function formatAdoptionDate (dateString: string): string | null {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return null

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  } catch (error) {
    console.error('Error formatting date:', error)
    return null
  }
}

/**
 * Combine plusieurs classes CSS conditionnellement
 *
 * @param {...(string | undefined | null | false)} classes - Classes à combiner
 * @returns {string} Classes combinées
 */
export function mergeClasses (...classes: Array<string | undefined | null | false>): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Retourne le label de l'état du monstre en français
 *
 * @param {string} state - État du monstre
 * @returns {string} Label formaté
 */
export function getStateLabel (state: string): string {
  const labels: Record<string, string> = {
    happy: 'Heureux',
    sad: 'Triste',
    angry: 'Fâché',
    hungry: 'Affamé',
    sleepy: 'Somnolent'
  }

  return labels[state] ?? 'Inconnu'
}
