/**
 * Barrel export for monster components
 *
 * Centralise l'export des composants de monstres
 * pour faciliter les imports dans le reste de l'application.
 *
 * Applique ISP (Interface Segregation Principle) en permettant
 * aux consommateurs d'importer uniquement ce dont ils ont besoin.
 *
 * @module components/monsters
 */

// Core rendering components
export { PixelMonster } from './pixel-monster'
export { AnimatedMonster } from './animated-monster'

// UI components
export { MonsterCard } from './monster-card'
export { MonstersList } from './monsters-list'
export { MonsterActions } from './monster-actions'
export { MonsterStateBadge, isMonsterState } from './monster-state-badge'
export { EmptyMonstersState } from './empty-monsters-state'

// Re-export types
export type { MonsterTraits, MonsterState } from '@/types/monster'
