/**
 * Types du domaine Shop (Boutique d'accessoires et arrière-plans)
 * Principe SRP: Responsabilité unique de définition des types métier
 */

/**
 * Catégories d'accessoires disponibles
 */
export type AccessoryCategory = 'hat' | 'glasses' | 'shoes'

/**
 * Niveaux de rareté des items
 */
export type AccessoryRarity = 'common' | 'rare' | 'epic' | 'legendary'

/**
 * Accessoire disponible dans la boutique
 */
export interface ShopAccessory {
  id: string
  name: string
  category: AccessoryCategory
  rarity: AccessoryRarity
  price: number
  description: string
  emoji: string
}

/**
 * Arrière-plan disponible dans la boutique
 */
export interface ShopBackground {
  id: string
  name: string
  price: number
  description: string
  gradient: string // Classes Tailwind CSS (ex: 'from-orange-400 to-pink-500')
  rarity: AccessoryRarity
}

/**
 * Accessoires équipés sur un monstre
 */
export interface EquippedAccessories {
  hat?: string // ID de l'accessoire
  glasses?: string // ID de l'accessoire
  shoes?: string // ID de l'accessoire
}

/**
 * Équipement complet d'un monstre (accessoires + arrière-plan)
 */
export interface MonsterEquipment {
  accessories: EquippedAccessories
  background?: string // ID de l'arrière-plan
}
