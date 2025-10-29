import type { AccessoryRarity } from '@/types/monster'

/**
 * Configuration de la rareté des items
 * Principe SRP: Responsabilité unique de définition des paramètres de rareté
 */

/**
 * Couleurs Tailwind CSS pour chaque niveau de rareté (palette slate professionnelle)
 */
export const RARITY_COLORS: Record<AccessoryRarity, {
  bg: string
  text: string
  border: string
  glow: string
}> = {
  common: {
    bg: 'bg-slate-400',
    text: 'text-slate-700',
    border: 'border-slate-400',
    glow: 'shadow-slate-400/50'
  },
  rare: {
    bg: 'bg-slate-600',
    text: 'text-white',
    border: 'border-slate-600',
    glow: 'shadow-slate-600/50'
  },
  epic: {
    bg: 'bg-slate-800',
    text: 'text-white',
    border: 'border-slate-800',
    glow: 'shadow-slate-800/50'
  },
  legendary: {
    bg: 'bg-slate-900',
    text: 'text-amber-300',
    border: 'border-slate-900',
    glow: 'shadow-slate-900/80'
  }
}

/**
 * Labels affichés pour chaque rareté
 */
export const RARITY_LABELS: Record<AccessoryRarity, string> = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire'
}

/**
 * Icônes pour chaque rareté
 */
export const RARITY_ICONS: Record<AccessoryRarity, string> = {
  common: '⚪',
  rare: '🔵',
  epic: '🟣',
  legendary: '🟡'
}

/**
 * Multiplicateurs de prix selon la rareté
 */
export const RARITY_MULTIPLIERS: Record<AccessoryRarity, number> = {
  common: 1,
  rare: 3,
  epic: 7,
  legendary: 15
}

/**
 * Probabilités de drop pour génération aléatoire future (%)
 */
export const RARITY_DROP_RATES: Record<AccessoryRarity, number> = {
  common: 60,
  rare: 25,
  epic: 12,
  legendary: 3
}
