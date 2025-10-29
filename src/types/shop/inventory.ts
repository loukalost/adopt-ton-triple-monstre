/**
 * Types pour la gestion de l'inventaire utilisateur
 * Principe SRP: Responsabilité unique de définition des types d'inventaire
 */

/**
 * Item dans l'inventaire utilisateur
 */
export interface InventoryItem {
  itemId: string // ID de l'accessoire ou du background
  type: 'accessory' | 'background'
  purchasedAt: Date
}

/**
 * Inventaire complet d'un utilisateur
 */
export interface UserInventory {
  userId: string
  accessories: string[] // Array d'IDs d'accessoires possédés
  backgrounds: string[] // Array d'IDs d'arrière-plans possédés
  createdAt: Date
  updatedAt: Date
}

/**
 * Inventaire utilisateur depuis MongoDB (avec _id)
 */
export interface DBInventory {
  _id: string
  userId: string
  accessories: string[]
  backgrounds: string[]
  createdAt: Date | string
  updatedAt: Date | string
}
