import { pricingTable } from './pricing'

/**
 * Interface pour un package de Koins
 */
export interface KoinPackage {
  amount: number
  price: number
  emoji: string
  color: string // Classes Tailwind pour le gradient
  badge: string
  popular: boolean
}

/**
 * Configuration des packages de Koins disponibles - Thème SLATE
 * Principe SRP: Responsabilité unique de configuration des packages
 * Principe OCP: Facile à étendre avec de nouveaux packages
 *
 * Couleurs SLATE adaptées:
 * - Pack populaire: amber (gold) - from-amber-400 to-amber-500
 * - Packs standard: slate gradients progressifs (600→700→800→900)
 */
export const walletPackages: KoinPackage[] = [
  {
    amount: 10,
    price: pricingTable[10].price,
    emoji: '🪙',
    color: 'from-amber-400 to-amber-500', // Gold pour starter
    badge: 'Débutant',
    popular: false
  },
  {
    amount: 50,
    price: pricingTable[50].price,
    emoji: '💰',
    color: 'from-amber-500 to-amber-600', // Gold renforcé pour le populaire
    badge: 'Populaire',
    popular: true
  },
  {
    amount: 500,
    price: pricingTable[500].price,
    emoji: '💎',
    color: 'from-slate-600 to-slate-700', // Slate professionnel
    badge: 'Pro',
    popular: false
  },
  {
    amount: 1000,
    price: pricingTable[1000].price,
    emoji: '👑',
    color: 'from-slate-700 to-slate-800', // Slate plus sombre
    badge: 'Royal',
    popular: false
  }
]
