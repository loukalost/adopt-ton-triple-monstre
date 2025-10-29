/**
 * Barrel exports pour les types Shop
 * Principe ISP: Exportation modulaire pour n'importer que ce qui est nécessaire
 */

// Domain types
export type {
  AccessoryCategory,
  AccessoryRarity,
  ShopAccessory,
  ShopBackground,
  EquippedAccessories,
  MonsterEquipment
} from './domain'

// Inventory types
export type {
  InventoryItem,
  UserInventory,
  DBInventory
} from './inventory'
